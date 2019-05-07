class Lava {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = grid;
        this.height = grid;
    }

    collide() {
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (!collision(this, player)) continue;
            player.die();
        }
    }

    display () {
        fill(245, 49, 0);
        noStroke();
        rect(this.x, this.y, this.width, this.height);
    }
}
