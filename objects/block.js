class Block {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = grid;
        this.height = grid;
    }

    collide() {
        return 1;
    }

    display() {
        fill(54, 54, 54);
        noStroke();
        rect(this.x, this.y, this.width, this.height);
    }
}
