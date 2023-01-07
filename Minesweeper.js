let level = 0
let columns = 0
let lines = 0
let gameboardSize = 0
let levelSelectDiv = document.getElementById("level-select")

function levelSelect(x) {
    if (x == 1) {
        columns = 10
        lines = 10
    } else if (x == 2) {
        columns = 15
        lines = 15
        
    } else {
        columns = 20
        lines = 20
    }
    createGameboard()
    setGameboardSize()
}

function createGameboard() {
    preparePlayTable()
    for (let i = 1; i <= lines * columns; ++i) {
        document.getElementById("gameboard").innerHTML += '<button type="button" class="fields" id="i">💣</button>'     
    }
}

function preparePlayTable() {
    levelSelectDiv.remove()
}

function setGameboardSize() {
    gameboardSize = (lines * 10) + (columns * 10) + 4
    document.getElementById("gameboard").style.width = gameboardSize + "px";
    document.getElementById("gameboard").style.height = gameboardSize + "px";
}
