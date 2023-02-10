let level = 0
let columns = 0
let lines = 0
let gameboardSize = 0
let levelSelectDiv = document.getElementById("level-select")
let bombsNr = 0
let bombsNrCopy = 0
let mineMarkMode = false
let randomMineLocation = []
let matrixID = []
let fieldsNr = 0
let minesPositionMatrix = []
let gameTableMatrix = []


function levelSelect(x) {
    if (x == 1) {
        columns = 10
        lines = 10
        bombsNr = 10
        bombsNrCopy = 10
    } else if (x == 2) {
        columns = 15
        lines = 15
        bombsNr = 25
        bombsNrCopy = 25
    } else {
        columns = 20
        lines = 20
        bombsNr = 50
        bombsNrCopy = 50
    }
    createGameboard()
    createMatrixID()
    checkMinesPozition()
    createGameTablematrix()

}

function createGameboard() {
    levelSelectDiv.remove()
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
                if (document.getElementById(id).innerHTML == "💥") {
                    matrixID[i][j] = id
                    createMinesPositionMatrix(i, j)
                } else {
                    matrixID[i][j] = id  
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
    if (mineMarkMode == true) {
        if (document.getElementById(x).style.backgroundColor == "red") {
            document.getElementById(x).style.backgroundColor = "transparent"
            ++bombsNr
            updateStatus()
        } else {
            document.getElementById(x).style.backgroundColor = "red"
            --bombsNr
            updateStatus()
        }  
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

function updateStatus () {
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
    document.getElementById(x).style.backgroundColor = "white"
    document.getElementById(x).style.border = "transparent"
    if (document.getElementById(x).innerHTML == "1") {
        document.getElementById(x).style.color = "green" 
    }
    if (document.getElementById(x).innerHTML == "2") {
        document.getElementById(x).style.color = "yellow" 
    }
    if (document.getElementById(x).innerHTML == "3") {
        document.getElementById(x).style.color = "pink" 
    }
    if (document.getElementById(x).innerHTML == "4") {
        document.getElementById(x).style.color = "lightcoral" 
    }
    if (document.getElementById(x).innerHTML == "5") {
        document.getElementById(x).style.color = "darkred" 
    }
    if (document.getElementById(x).innerHTML == "6") {
        document.getElementById(x).style.color = "darkred" 
    }
    if (document.getElementById(x).innerHTML == "7") {
        document.getElementById(x).style.color = "darkred" 
    }
    if (document.getElementById(x).innerHTML == "8") {
        document.getElementById(x).style.color = "darkred" 
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
    console.table(gameTableMatrix);
    console.table(blankFieldsArray);
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