function nextGeneration() {
    deadPlayers = [];
    normalizeFitness(allPlayers);

    players = generate(allPlayers);
    allPlayers = players.slice();
}

function generate(oldPlayers) {
    let newPlayers = [];
    for (let i = 0; i < oldPlayers.length; i++) {
        let player = poolSelection(oldPlayers);
        newPlayers[i] = player;
    }
    return newPlayers;
}

function normalizeFitness(players) {
    for (let i = 0; i < players.length; i++) {
        players[i].score = pow(players[i].score, 2);
    }

    let sum = 0;
    for (let i = 0; i < players.length; i++) {
        sum += players[i].score;
    }
    for (let i = 0; i < players.length; i++) {
        players[i].fitness = players[i].score / sum;
    }
}

function poolSelection(players) {
    let index = 0;

    let r = random(1);

    while (r > 0) {
        r -= players[index].fitness;
        index += 1;
    }
    index -= 1;
    return players[index].copy();
}
