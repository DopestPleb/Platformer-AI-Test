class Portal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = grid;
        this.height = grid;
    }

    display() {
        fill(255, 0, 255);
        noStroke();
        rect(this.x, this.y, this.width, this.height);
    }
}
