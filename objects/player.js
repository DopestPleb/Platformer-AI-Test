function mutate(x) {
    console.log("run");
    if (random(1) < 0.05) {
        let offset = randomGaussian() * 0.5;
        let newx = x + offset;
        return newx;
    } else {
        return x;
    }
}

class Player {
    constructor (x, y, brain) {
        this.x = x;
        this.y = y;
        this.startingPos = new createVector(this.x, this.y);
        this.scrollX = constrain(this.x - (width / 2), 0, width);
        this.scrollY = constrain(this.y - (height / 2), 0, height);
        this.width = grid;
        this.height = grid;
        this.jumping = false;
        this.displayPos = this.x;
        this.gravity = 0.6;
        this.accel = 0.2;
        this.limit = 3;
        this.xVel = 0;
        this.yVel = 0;
        this.jumpHeight = 10;
        this.timer = 0;
        if (brain instanceof NeuralNetwork) {
            this.brain = brain.copy();
            this.brain.mutate(mutate);
        } else {
            this.brain = new NeuralNetwork(110, 76, 3);
        }
        this.score = 0;
        this.xDist = 0;
        this.yDist = 0;
        this.fitness = 0;
        this.pX = 0;
        this.show = true;
    }

    collision (xVel, yVel) {
        for(let i in blocks) {
            let b = blocks[i];
            if (b instanceof Block) {
                if (!collision(this, b)) continue;
                if (xVel > 0) {
                    this.x = b.x - this.width;
                    this.xVel = 0;
                }
                if (xVel < 0) {
                    this.x = b.x + b.width;
                    this.xVel = 0;
                }
                if (yVel > 0) {
                    this.jumping = false;
                    this.yVel = 0;
                    this.y = b.y - this.height;
                }
                if (yVel < 0) {
                    this.yVel = 0;
                    this.y = b.y + b.height;
                }
            }
        }
        for (let i in portals) {
            let b = portals[i];
            if (!collision(this, b)) continue;
            level++;
        }
    }

    update() {
        this.timer++;
        if (this.x !== this.pX) {
            this.timer = 0;
        }
        if (this.timer > 20) {
            this.die();
        }
        this.pX = this.x;
        this.xDist = abs(portals[0].x - this.x);
        this.yDist = abs(portals[0].y - this.y);
        this.score = this.xDist + this.yDist;
        this.keys();
        this.jumping = true;
        this.xVel = constrain(this.xVel, -this.limit, this.limit);
        this.x += this.xVel;
        this.collision(this.xVel, 0);
        this.yVel += this.gravity;
        this.y += this.yVel;
        this.collision(0, this.yVel);

        let to = constrain(this.x - (width / 2), 0, width * 2);
        this.scrollX += (to - this.scrollX) / 12;
        to = constrain(this.y - (height / 2), 0, width * 2);
        this.scrollY += (to - this.scrollY) / 12;
    }

    jump() {
        if (!this.jumping) {
            this.yVel = -this.jumpHeight;
            this.jumping = true;
        }
    }

    move(right) {
        if (right) return this.xVel += this.accel;
        if (!right) return this.xVel -= this.accel;
    }

    think() {
        let inputs = [];
        let vision = [];

        // Create AI vision
        for (let y = (ceil(this.y / grid) * grid - grid) / grid - 5; y < (ceil(this.y / grid) * grid - grid) / grid + 5; y++) {
            if (y < 0) {
                vision.push(" ".repeat(levels[level][0].length));
                continue;
            }
            if (y > levels[level].length - 1) {
                vision.push(" ".repeat(levels[level][0].length));
                continue;
            }

            vision.push(levels[level][y]);
        }

        // Read AI vision
        for (let y = 0; y < vision.length; y++) {
            for (let x = (ceil(this.x / grid) * grid - grid) / grid - 5; x < (ceil(this.x / grid) * grid - grid) / grid + 6; x++) {
                if (x < 0) {
                    inputs.push(0);
                    continue;
                }
                if (x > vision[y].length - 1) {
                    inputs.push(0);
                    continue;
                }
                if (vision[y][x] === " " || vision[y][x] === "P" || vision[y][x] === "@") {
                    inputs.push(0);
                } else
                if (vision[y][x] === "#") {
                    inputs.push(1);
                } else
                if (vision[y][x] === "%") {
                    inputs.push(2);
                }
            }
        }

        let action = this.brain.predict(inputs);
        if (action[0] > 0.5) {
            this.move(true);
        }
        if (action[1] > 0.5) {
            //this.move(false);
        }
        if (action[0] <= 0.5) {
            this.xVel *= 0.8;
        }
        if (action[2] > 0.5) {
            this.jump();
        }
    }

    die() {
        this.show = false;
        this.display = function() {

        }
    }

    copy() {
        return new Player(this.startingPos.x, this.startingPos.y, this.brain);
    }

    keys() {
        if (keys[39]){
            this.xVel += this.accel;
        }
        if (keys[37]){
            this.xVel -= this.accel;
        }
        if (!keys[37] && !keys[39]){
            //this.xVel *= 0.8;
        }
        if (keys[38] && !this.jumping){
            this.yVel = -this.jumpHeight;
            this.jumping = true;
        }
    }

    display() {
        push();
        translate(this.x, this.y);
        fill(0, 145, 255);
        rect(0, 0, grid, grid);
        pop();

        /**
        push();
        translate(ceil(this.x / grid) * grid - grid, ceil(this.y / grid) * grid - grid / 2);
        noFill();
        stroke(0, 0, 0);
        rect(0, 0, grid * 10, grid * 11);
        pop();*/
    }
}
