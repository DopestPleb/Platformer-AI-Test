let grid = 25;
let cameraX = 0;
let cameraY = 0;
let level = 0;
let blocks;
let portal;
let lava;
let deadPlayers = [];
let players = [];
let allPlayers = [];
let playerNum = 200;
let game;
let keys = [];
let rewards = [];
let punishments = [];
let winningPlayers = [];

let levels = [
    [
    "######################################",
    "#                                    #",
    "#                                   @#",
    "#                                #####",
    "#                                    #",
    "#                                    #",
    "#    #                        #      #",
    "#                                    #",
    "#        ##                          #",
    "#                           #        #",
    "#                     ####           #",
    "#         ###                        #",
    "#    #              #                #",
    "#                                    #",
    "#  P  ###     #  #   %%%%%%%%%%%%%%%%#",
    "######################################",
    ],
    [
    "######################################",
    "#                                    #",
    "#                                    #",
    "#                                    #",
    "#                                    #",
    "#                                    #",
    "#                                    #",
    "#                                    #",
    "#                             #      #",
    "#                                    #",
    "#        #        #                  #",
    "#       ##                #         @#",
    "#      ###     #      ##         #####",
    "#  P  ####                           #",
    "#    #####%%%%%%%%%%%%%%%%%%%%%%%%%%%#",
    "######################################",
    ],
    [
    "######################################",
    "#                                    #",
    "#                                    #",
    "#                                    #",
    "# P           #                      #",
    "#                                    #",
    "#                                    #",
    "#     %  %  % %                      #",
    "############# ########################",
    "#           #                                                 #",
    "#           #####################   ###########################",
    "#                                                   %         #",
    "#                                                             #",
    "#                                                             #",
    "#                                   %%  %%  %%  %       %    @#",
    "###############################################################",
    ],
    [
    "######################################",
    "#                                    #",
    "#                                   @#",
    "#                                #####",
    "#                                    #",
    "#                               #    #",
    "#                                    #",
    "#                             #      #",
    "#                                    #",
    "#                           #        #",
    "#                                    #",
    "#       #   #        #    #          #",
    "#      #     #      #      #         #",
    "#  P  #       #    #        #        #",
    "#    #%%%%%%%%%#  #%%%%%%%%%%#       #",
    "################%%####################",
    ],
    [
    "###       ############################",
    "#P                                   #",
    "#    %  %                            #",
    "#   %%  %%                           #",
    "######  ##############################",
    "#                                    #",
    "#                                    #",
    "#            %  %                    #",
    "#           %%  %%                   #",
    "##############  ######################",
    "#                                    #",
    "#                                    #",
    "#                   %  %             #",
    "#                  %%  %%            #",
    "#####################  ###############",
    "#                                    #",
    "#                                    #",
    "#                                    #",
    "#                                    #",
    "#                                    #",
    "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
    ],
];
let timer = 0;

function collision(one, two) {
    return one.x > two.x - one.width &&
        one.x < two.x + two.width &&
        one.y > two.y - one.height &&
        one.y < two.y + two.height;
};

function setup() {
    createCanvas(800, 1300);
    textAlign(CENTER , CENTER);
    rectMode(CENTER);
    noStroke();

    blocks = [];
    lava = [];
    portals = [];
    for (let y = 0; y < levels[level].length; y++) {
        for (let x = 0; x < levels[level][y].length; x++) {
            switch (levels[level][y][x]) {
                case "#": blocks.push(new Block(x * grid + (grid / 2), y * grid + (grid / 2), false));
                break;
                case "P":
                    if (players.length === 0) {
                        let xPos = x * grid + (grid / 2);
                        let yPos = y * grid + (grid / 2);
                        for (let j = 0; j < playerNum; j++) {
                            players[j] = new Player(xPos, yPos);
                            allPlayers[j] = new Player(xPos, yPos);
                        }
                    }
                break;
                case "@": portals.push(new Portal(x * grid + (grid / 2), y * grid + (grid / 2)));
                break;
                case "%": blocks.push(new Lava(x * grid + (grid / 2), y * grid + (grid / 2)));
                break;
                case "^": rewards.push(new Reward(x * grid + (grid / 2), y * grid + (grid / 2)));
                break;
                case "*": punishments.push(new Punish(x * grid + (grid / 2), y * grid + (grid / 2)));
                break;
            }
        }
    }
}

function draw() {
    background(255, 255, 255);
    push();
    players.sort(function(a, b) {
        return b.x - a.x
    });
    for (let i = 0; i < players.length; i++) {
        if (players[i].show) {
            translate(round(-players[i].scrollX), round(-players[i].scrollY));
            break;
        }
    }
    for (let i = 0; i < players.length; i++) {
        if (!players[i].show) {
            if (deadPlayers.indexOf(players[i]) === -1) {
                deadPlayers.push(players[i]);
                continue;
            }
            continue;
        } else {
            players[i].think(blocks);
            players[i].update();
            players[i].display();
        }
    }
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].display();
        blocks[i].collide();
    }
    for (let i = 0; i < portals.length; i++) {
        portals[i].display();
    }
    pop();

    timer++;
    if (players.length === deadPlayers.length) {
        nextGeneration();
    }
}

keyPressed = function() {
    keys[keyCode] = true;
};
keyReleased = function() {
    keys[keyCode] = false;
};
