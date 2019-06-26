var world = [];
var worldRules = [];

var loopOn = true;
var twoPlayers = false;

var worldRulesRows = [
    [2,2,17],
    [4,5,16],
    [5,5,16],
    [10,4,6],
    [8,11,15],
    [11,11,15],
    [13,11,17],
    [17,12,14]
]; // KEY ..... [ROW, START COLUMN, END COLUMN]

var worldRulesColumns = [
    [2,2,6],
    [2,8,11],
    [2,13,17],
    [7,7,15],
    [15,8,11],
    [17,14,18],
    [12,15,17]
]; // KEY ..... [COLUMN, START ROW, END ROW]

// var pacman = {
//     'left': 1,
//     'top': 1,
//     'tilt': 0
// }

var pacmen = [
    {
        'top': 1,
        'left': 1,
        'tilt': 0,
        'lives': 3,
        'score': 0,
        'alive': true
    },
    {
        'top': 18,
        'left': 18,
        'tilt': 0,
        'lives': 3,
        'score': 0,
        'alive': false
    }
];

var ghosts = [
    {
        'top': 11,
        'left': 10,
        'color': 'orange'
    },
    {
        'top': 10,
        'left': 12,
        'color': 'inky'
    },
    {
        'top': 5,
        'left': 3,
        'color': 'red'
    },
    {
        'top': 13,
        'left': 9,
        'color': 'pinky'
    }
];

var score = 0, lives = 3;

function generateWorld(x,y){
    world = [];
    for(var row = 0; row < y; row++){
        world[row] = [];
        for (var column = 0; column < x; column++){
            var value;
            if(column === 0 || column === x - 1 || row === 0 || row === y - 1){
                value = 2;
            } else {
                value = checkRules(row,column);
            }
            world[row].push(value);
        }
    }
    world[1][1] = 0;
    if(twoPlayers){world[18][18] = 0}
}

function setRules(){
    for (var i = 0; i < worldRulesRows.length; i++){
        worldRules.push(worldRulesRows[i]);
    }
    for (var i = 0; i < worldRulesColumns.length; i++){
        for (var j = worldRulesColumns[i][1]; j <= worldRulesColumns[i][2]; j++){
            worldRules.push([j]);
            worldRules[worldRules.length - 1].push(worldRulesColumns[i][0]);
            worldRules[worldRules.length - 1].push(worldRulesColumns[i][0]);
        }
    }
}

function checkRules(row,column){
    for (var rule = 0; rule < worldRules.length; rule++){
        if (row === worldRules[rule][0] && column >= worldRules[rule][1] && column <= worldRules[rule][2]){
            return 2;
        }
    }
    return getCoinOrCherry();
}

function getCoinOrCherry(){
    if (Math.floor(Math.random() * 100 + 1) < 90){
        return 1;
    } else {
        return 3;
    }
}

function drawWorld(){
    var output = '';

    for (var i = 0; i<world.length; i++){
        output += '<div class="row">';
        for (var j = 0; j<world[i].length; j++){
            if(world[i][j] === 2){
                output += '<div class="brick"></div>';
            } else if (world[i][j] === 1){
                output += '<div class="coin"></div>';
            } else if (world[i][j] === 0){
                output += '<div class="empty"></div>';
            } else if (world[i][j] === 3){
                output += '<div class="cherry"></div>';
            }
        }
        output += '</div>';
    }
    // console.log(output);
    document.getElementById('world').innerHTML = output;
}

// function drawPacman(){
//     if (!twoPlayers){
//         document.getElementById('pacman').style.left = pacman.left * 40 + 'px';
//         document.getElementById('pacman').style.top = pacman.top * 40 + 'px';
//         document.getElementById('pacman').style.transform = 'rotate(' + pacman.tilt + 'deg)';
//     } else {
//         for (var i = 0; i < pacmen.length; i++){

//         }
//     }
// }

function drawPacmen(){
    var div = document.getElementById('pacmen');
    if (arguments.length === 0){
        var html = '';
        var players = 1;
        if(twoPlayers){players = 2;}
        for (var i = 0; i < players; i++){
            html += '<div class="pacman"></div>';
            div.innerHTML = html;
            div.lastChild.style.left = pacmen[i].left * 40 + 'px';
            div.lastChild.style.top = pacmen[i].top * 40 + 'px';
            div.lastChild.style.transform = 'rotate(' + pacmen[i].tilt + 'deg)';
            html = div.innerHTML;
        }
    } else {
        if (arguments[0] === 1){
            if (pacmen[0].alive === true){
                div.firstChild.style.left = pacmen[0].left * 40 + 'px';
                div.firstChild.style.top = pacmen[0].top * 40 + 'px';
                div.firstChild.style.transform = 'rotate(' + pacmen[0].tilt + 'deg)';
            } else {
                div.firstChild.style.display = 'none';
            }
        } else if (arguments[0] === 2){
            if (pacmen[1].alive === true){
                div.lastChild.style.left = pacmen[1].left * 40 + 'px';
                div.lastChild.style.top = pacmen[1].top * 40 + 'px';
                div.lastChild.style.transform = 'rotate(' + pacmen[1].tilt + 'deg)';
            } else {
                div.lastChild.style.display = 'none';
            }
        }
    }
}

function drawGhosts(){
    var div = document.getElementById('ghosts');
    var html = '';
    for(var i = 0; i < ghosts.length; i++){
        html += '<div class="ghost"></div>';
        div.innerHTML = html;
        div.lastChild.style.left = ghosts[i].left * 40 + 'px';
        div.lastChild.style.top = ghosts[i].top * 40 + 'px';
        if(div.lastChild.style.backgroundImage == ''){
            div.lastChild.style.backgroundImage = 'url("img/'+ ghosts[i].color +'ghost.gif")';
        }
        html = div.innerHTML;
    }
}

function moveGhosts(){
    for (var i = 0; i < ghosts.length; i++){
        var rand = Math.floor(Math.random() * 4 + 1)
        if(rand === 1){moveGhost(i,1)} // up
        if(rand === 2){moveGhost(i,2)} // down
        if(rand === 3){moveGhost(i,3)} // left
        if(rand === 4){moveGhost(i,4)} // right
    }
}

function moveGhost(num, dir){

}

function checkGhostPlayerLoc(){
    var players = 1;
    if (twoPlayers) {players = 2}
    for (var ghost = 0; ghost < ghosts.length; ghost++){
        for (var player = 0; player < players; player++){
            var leftValue = pacmen[player].left;
            var topValue = pacmen[player].top;
            if (ghosts[ghost].top === topValue && ghosts[ghost].left === leftValue){
                kill(player);
            }
        }
    }
}

function kill(player){
    pacmen[player].score -= 50;
    if (pacmen[player].score < 0) {pacmen[player].score = 0;}
    updateScore();
    startPos = 1;
    if (player === 1) {startPos = 18;}
    pacmen[player].left = startPos;
    pacmen[player].top = startPos;
    pacmen[player].tilt = 0;
    pacmen[player].lives--;
    updateLives();
    if (pacmen[player].lives < 0){
        die(player);
    }
}

function die(player){
    pacmen[player].alive = false;
    if (twoPlayers){
        if(player === 0) {var otherPlayer = 1;}
        else {var otherPlayer = 0;}
        if (pacmen[otherPlayer].alive === false){
            if (pacmen[0].score > pacmen[1].score){
                window.alert('PLAYER 1 WINS!');
            } else {
                window.alert('PLAYER 2 WINS!');
            }
            reset();
        }
    } else {
        reset();
    }
}

function updateScore(){
    document.getElementById('p1score').innerHTML = 'Score: ' + pacmen[0].score;
    document.getElementById('p2score').innerHTML = 'Score: ' + pacmen[1].score;
    if (twoPlayers){
        document.getElementById('p2box').style.visibility = 'visible';
    }
}

function updateLives(){
    document.getElementById('p1lives').innerHTML = 'Lives: ' + pacmen[0].lives;
    document.getElementById('p2lives').innerHTML = 'Lives: ' + pacmen[1].lives;
    if (pacmen[0].lives < 0){
        document.getElementById('p1lives').innerHTML = 'Lives: dead';
    }
    if (pacmen[1].lives < 0){
        document.getElementById('p2lives').innerHTML = 'Lives: dead';
    }
}

function addScore(player,num){
    world[pacmen[player].top][pacmen[player].left] = 0;
    pacmen[player].score += num;
    updateScore();
    drawWorld();
}

function reset(){
    setRules();
    generateWorld(20,20);
    pacmen[0].left = 1;
    pacmen[0].top = 1;
    pacmen[0].lives = 3;
    pacmen[0].score = 0;
    pacmen[0].alive = true;
    pacmen[1].left = world[0].length - 2;
    pacmen[1].top = world.length - 2;
    pacmen[1].lives = 3;
    pacmen[1].score = 0;
    if (twoPlayers) {pacmen[1].alive = true;}
    drawPacmen();
    drawWorld();
    drawGhosts();
    updateScore();
    updateLives();
}

document.onkeydown = function (e){
    var pacman = 0;

    if (e.keyCode === 37 && pacmen[0].alive === true){ // go left
        if((world[pacmen[0].top][pacmen[0].left - 1] != 2 && !(pacmen[0].top == pacmen[1].top && pacmen[0].left - 1 == pacmen[1].left)) || (world[pacmen[0].top][pacmen[0].left - 1] != 2 && pacmen[1].alive === false)) {
            pacmen[0].left -= 1;
        }
        pacmen[0].tilt = 180;
        pacman = 1;
    } else if (e.keyCode === 39 && pacmen[0].alive === true){ // go right
        if((world[pacmen[0].top][pacmen[0].left + 1] != 2 && !(pacmen[0].top == pacmen[1].top && pacmen[0].left + 1 == pacmen[1].left)) || (world[pacmen[0].top][pacmen[0].left + 1] != 2 && pacmen[1].alive === false)){
            pacmen[0].left += 1;
        }
        pacmen[0].tilt = 0;
        pacman = 1;
    } else if (e.keyCode === 38 && pacmen[0].alive === true){ // go up
        if((world[pacmen[0].top - 1][pacmen[0].left] != 2 && !(pacmen[0].top - 1 == pacmen[1].top && pacmen[0].left == pacmen[1].left)) || (world[pacmen[0].top - 1][pacmen[0].left] != 2 && pacmen[1].alive === false)){
            pacmen[0].top -= 1;
        }
        pacmen[0].tilt = 270;
        pacman = 1;
    } else if (e.keyCode === 40 && pacmen[0].alive === true){ // go down
        if((world[pacmen[0].top + 1][pacmen[0].left] != 2 && !(pacmen[0].top + 1 == pacmen[1].top && pacmen[0].left == pacmen[1].left)) || (world[pacmen[0].top + 1][pacmen[0].left] != 2 && pacmen[1].alive === false)){
            pacmen[0].top += 1;
        }
        pacmen[0].tilt = 90;
        pacman = 1;
    }

    if (e.keyCode === 65 && twoPlayers && pacmen[1].alive === true){ // player 2 go left
        if((world[pacmen[1].top][pacmen[1].left - 1] != 2 && !(pacmen[0].top == pacmen[1].top && pacmen[1].left - 1 == pacmen[0].left)) || (world[pacmen[1].top][pacmen[1].left - 1] != 2 && pacmen[0].alive === false)){
            pacmen[1].left -= 1;
        }
        pacmen[1].tilt = 180;
        pacman = 2;
    } else if (e.keyCode === 68 && twoPlayers && pacmen[1].alive === true){ // player 2 go right
        if ((world[pacmen[1].top][pacmen[1].left + 1] != 2 && !(pacmen[0].top == pacmen[1].top && pacmen[1].left + 1 == pacmen[0].left)) || (world[pacmen[1].top][pacmen[1].left + 1] != 2 && pacmen[0].alive === false)){
            pacmen[1].left += 1;
        }
        pacmen[1].tilt = 0;
        pacman = 2;
    } else if (e.keyCode === 87 && twoPlayers && pacmen[1].alive === true){ // player 2 go up
        if ((world[pacmen[1].top - 1][pacmen[1].left] != 2 && !(pacmen[0].top == pacmen[1].top - 1 && pacmen[1].left == pacmen[0].left)) || (world[pacmen[1].top - 1][pacmen[1].left] != 2 && pacmen[0].alive === false)){
            pacmen[1].top -=1;
        }
        pacmen[1].tilt = 270;
        pacman = 2;
    } else if (e.keyCode === 83 && twoPlayers && pacmen[1].alive === true){ // player 2 go down
        if ((world[pacmen[1].top + 1][pacmen[1].left] != 2 && !(pacmen[0].top == pacmen[1].top + 1 && pacmen[1].left == pacmen[0].left)) || (world[pacmen[1].top + 1][pacmen[1].left] != 2 && pacmen[0].alive === false)){
            pacmen[1].top += 1;
        }
        pacmen[1].tilt = 90;
        pacman = 2;
    }

    checkGhostPlayerLoc();

    var players = 1;
    if (twoPlayers){players = 2;}
    for (var characters = 0; characters < players; characters++){
        if (world[pacmen[characters].top][pacmen[characters].left] === 1){
            addScore(characters,10);
        } else if (world[pacmen[characters].top][pacmen[characters].left] === 3){
            addScore(characters,50);
        }
    }
    if (pacman != 0) {drawPacmen(pacman);}
}

document.getElementById('reset').addEventListener('click', function () {
    reset();
});

document.getElementById('oneplayer').addEventListener('click', function () {
    if (twoPlayers){
        twoPlayers = false;
        document.getElementById('p2box').style.visibility = 'hidden';
        pacmen[1].alive = false;
        reset();
    }
});
document.getElementById('twoplayer').addEventListener('click', function () {
    if (!twoPlayers){
        twoPlayers = true;
        reset();
    }
});

reset();

