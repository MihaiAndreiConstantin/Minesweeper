let columns = 0
let lines = 0
let gameboardSize = 0
let bombsNr = 0
let bombsNrCopy = 0
let mineMarkMode = false
let randomMineLocation = []
let matrixID = []
let fieldsNr = 0
let minesPositionMatrix = []
let gameTableMatrix = []
let colors = ["", "green", "yellow", "pink", "lightcoral", "darkred", "darkred", "darkred", "darkred"]
let size = ["", "10", "15", "20"]
let bombs = ["", "10", "25", "50"]

function levelSelect(x) {
    lines = parseInt(size[x])
    columns = parseInt(size[x])
    bombsNr = parseInt(bombs[x])
    bombsNrCopy = parseInt(bombs[x])
    createGameboard()
    createMatrixID()
    checkMinesPozition()
    createGameTablematrix()
}

function createGameboard() {
    document.getElementById("level-select").remove()
    createStatus()
    createFields()
    setGameboardSize()
    generateRandomMineLocation()    
}

function createFields() {
    for (let i = 1; i <= lines * columns; ++i) {
        document.getElementById("gameboard").innerHTML += '<button type="button" class="fields" id="'+ i +'" onclick="checkFields(' + i + ')">'+ fieldsNr +'</button>'     
    }
}

function  createStatus() {
    document.getElementById("status").innerHTML = "🚩" + bombsNr + " " + '<button type="button" id="mark-bomb" class="mark" onclick="markMine()">Mark 💣</button>'
    document.getElementById("status").style.width = "404px"
}

function setGameboardSize() {
    gameboardSize = (lines * 10) + (columns * 10) + 4
    document.getElementById("gameboard").style.width = gameboardSize + "px";
    document.getElementById("gameboard").style.height = gameboardSize + "px";
}

function markMine() {
    if (mineMarkMode == false) {
        mineMarkMode = true
        document.getElementById("mark-bomb").style.backgroundColor = "red"
    } else {
        mineMarkMode = false
        document.getElementById("mark-bomb").style.backgroundColor = "transparent"
    }
}

function generateRandomMineLocation() {
    for (let i = 0; i < bombsNr; ++i) {
        let radomNr = Math.floor(Math.random() * (lines * columns)) + 1;
        if (randomMineLocation.includes(radomNr)) {
            --i 
        } else {
            randomMineLocation[i] = radomNr
            document.getElementById(randomMineLocation[i]).innerHTML = "💥"
        }
    }
}

function createMatrixID() {
    let id = 1
    for (let i = 0; i <= lines + 1; ++i) {
        matrixID[i] = []
        for (let j = 0; j <= columns + 1; ++j) {
            if (i == 0 || j == 0 || i == (lines + 1) || j == (columns + 1)) {
                matrixID[i][j] = 0
            } else {
                matrixID[i][j] = id
                if (document.getElementById(id).innerHTML == "💥") {   
                    createMinesPositionMatrix(i, j)
                }
                ++id;
            }
        }
    }
}

let index = 0;
function createMinesPositionMatrix(i, j) {
    minesPositionMatrix[index] = []
    minesPositionMatrix[index][0] = i
    minesPositionMatrix[index][1] = j
    ++index
}

function checkMinesPozition() {
    for (let i = 0; i < minesPositionMatrix.length; ++i) {
            updateMinesVicinityFields(minesPositionMatrix[i][0], minesPositionMatrix[i][1])
    } 
}

function updateMinesVicinityFields(i, j) {
    for (let x = i - 1; x <= i + 1; ++x) {
        for (let y = j - 1; y <= j + 1; ++y) {
            if (x != 0 && y != 0 && x != (lines + 1) && y != (columns + 1)) {
                if (document.getElementById(matrixID[x][y]).innerHTML != "💥") {
                checkNrFromFields(document.getElementById(matrixID[x][y]).innerHTML)
                document.getElementById(matrixID[x][y]).innerHTML = fieldsNr + 1
                }
            }
        }
    }
}

function checkNrFromFields(x) {  
    fieldsNr = parseInt(x)   
}

function checkFields(x) {
    if (mineMarkMode == true && document.getElementById(x).style.backgroundColor != "white") {
        markUnmarkFields(x)
    } else {
        if (document.getElementById(x).style.backgroundColor != "red") {
            if (document.getElementById(x).innerHTML == "💥") {
                openFields(x)
                setTimeout(function() { gameOver() },700)
            } else if (document.getElementById(x).innerHTML != "0") {
                openFields(x)
            } else if (document.getElementById(x).innerHTML == "0") {
                openFields(x)
                indexOfClickedFields(x)
            }
        }
    } 
    checkWin()
}

function markUnmarkFields(x) {
    if (document.getElementById(x).style.backgroundColor == "red") {
        document.getElementById(x).style.backgroundColor = "transparent"
        ++bombsNr   
    } else {
        document.getElementById(x).style.backgroundColor = "red"
        --bombsNr
    }  
    updateStatus()
}

function updateStatus() {
    document.getElementById("status").innerHTML = "🚩" + bombsNr + " " + '<button type="button" id="mark-bomb" class="mark" onclick="markMine()">Mark 💣</button>'
    if (mineMarkMode == true) {
        document.getElementById("mark-bomb").style.backgroundColor = "red"
    }
}

function checkWin() {
    let openedCell = 0
    for (let i = 1; i <= lines * columns; i++) {
        if (document.getElementById(i).style.backgroundColor == "white") {
            ++openedCell
        }
    }
    if (openedCell == ((lines * columns) - bombsNrCopy)) {
        winGame()
    }
}

function winGame() {
    document.getElementById("gameboard").remove()
    document.getElementById("status").style.backgroundColor = "transparent"
    document.getElementById("status").innerHTML = "---✔️💪🏽!!YOU WON THE GAME!!💪🏽✔️---"
    document.getElementById("restart").innerHTML = '<button class="restart-btn" role="button" onclick="location.reload()">--Restart Game--</button>'
}

function gameOver() {
    document.getElementById("gameboard").remove()
    document.getElementById("status").style.backgroundColor = "transparent"
    document.getElementById("status").innerHTML = "---❌!!GAME OVER!!❌---"
    document.getElementById("restart").innerHTML = '<button class="restart-btn" role="button" onclick="location.reload()">--Restart Game--</button>'
}

function openFields(x) {
    if (document.getElementById(x).style.backgroundColor == "red") {
        ++bombsNr
        updateStatus()
    }
    document.getElementById(x).style.backgroundColor = "white"
    document.getElementById(x).style.border = "transparent"
    for (let i = "1"; i <= "8"; ++i) {
        if (document.getElementById(x).innerHTML == i) {
            document.getElementById(x).style.color = colors[parseInt(i)] 
        }
    }
    if (document.getElementById(x).innerHTML == "💥") {
        document.getElementById(x).style.backgroundImage = "url(bomb.jpg)" 
    }
}

function createGameTablematrix() {
    for (let i = 1; i <= lines; ++i) {
        gameTableMatrix[i] = [] 
        for (let j = 1; j <= columns; ++j) {
            if (document.getElementById(matrixID[i][j]).innerHTML == "0") {
                gameTableMatrix[i][j] = parseInt(document.getElementById(matrixID[i][j]).innerHTML)
            } else {
                gameTableMatrix[i][j] = parseInt(document.getElementById(matrixID[i][j]).innerHTML)
            }
        }
    }
}



function indexOfClickedFields(x) {
    for (let i = 1; i <= lines; ++i) {
        for (let j = 1; j <= lines; ++j) {
            if (matrixID[i][j] == x) {
                return sarchingBlankFields(i, j)
            }
        }
    }
}

function sarchingBlankFields(x, y) {
    gameTableMatrix[x][y] = -1
    console.log(x, y);
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (matrixID[i][j] > 0 && gameTableMatrix[i][j] != -1) {
                openFields(matrixID[i][j])
            }
        }
    }

    if ((x - 1) > 0)  {
        if (gameTableMatrix[x - 1][y] == 0) {
            gameTableMatrix[x - 1][y] = -1
            sarchingBlankFields(x - 1, y)
        }
    }

    if ((x + 1) <= lines)  {
        if (gameTableMatrix[x + 1][y] == 0) {
            gameTableMatrix[x + 1][y] = -1
            sarchingBlankFields(x + 1, y)
        }
    }

    if ((y - 1) > 0)  {
        if (gameTableMatrix[x][y - 1] == 0) {
            gameTableMatrix[x][y - 1] = -1
            sarchingBlankFields(x, y - 1)

        }
    }

    if ((y + 1) <= columns)  {
        if (gameTableMatrix[x][y + 1] == 0) {
            gameTableMatrix[x][y + 1] = -1
            sarchingBlankFields(x, y + 1)

        }
    }

    if ((y - 1) > 0 && (x - 1) > 0)  {
        if (gameTableMatrix[x - 1][y - 1] == 0) {
            gameTableMatrix[x - 1][y - 1] = -1
            sarchingBlankFields(x - 1, y - 1)
        }
    }

    if ((y + 1) <= columns && (x + 1) <= lines)  {
        if (gameTableMatrix[x + 1][y + 1] == 0) {
            gameTableMatrix[x + 1][y + 1] = -1
            sarchingBlankFields(x + 1, y + 1)
        }
    }
    if ((y + 1) <= columns && (x - 1) > 0)  {
        if (gameTableMatrix[x - 1][y + 1] == 0) {
            gameTableMatrix[x - 1][y + 1] = -1
            sarchingBlankFields(x - 1, y + 1)
        }
    }

    if ((y - 1) > 0 && (x + 1) <= lines)  {
        if (gameTableMatrix[x + 1][y - 1] == 0) {
            gameTableMatrix[x + 1][y - 1] = -1
            sarchingBlankFields(x + 1, y - 1)
        }
    }
}
