let columns = 0
let lines = 0
let bombsNr = 0
let bombsNrCopy = 0
let time = 0 
let mineMarkMode = false
let randomMineLocation = []
let matrixID = []
let fieldsNr = 0
let gameTableMatrix = []
let colors = ["", "green", "yellow", "pink", "lightcoral", "darkred", "darkred", "darkred", "darkred"]
let size = ["", "10", "15", "20"]
let bombs = ["", "10", "25", "50"]
let endLine = `<br>`;
let status = `
<div id="status" class="status"><button  type="button" id="timer"class="timer"></button>
</div>`;
let lvlDiv = `
<div style="font-family: cursive;" id="level-select">Please select your level!<br><br>
    <button type="button" class="btn" onclick="levelSelect(1)">Easy</button>
    <button type="button" class="btn" onclick="levelSelect(2)">Medium</button>
    <button type="button" class="btn" onclick="levelSelect(3)">Hard</button>
</div>`;
let markButton = `
<button type="button" onclick="markMode()" id="mark" class="mark">⚑</button>
`;
let restartBtn = `
<button type="button" class="restart-btn" onclick="location.reload()">Restart Game</button>
`;

function startGame() {
    deleteDiv("start")
    addDiv("first-page", lvlDiv)
}

function levelSelect(x) {//selecteaza levelul
    lines = parseInt(size[x])
    columns = parseInt(size[x])
    bombsNr = parseInt(bombs[x])
    bombsNrCopy = parseInt(bombs[x])
    createPlayTable()
}

function deleteDiv(id) { //sterge divuri
    document.getElementById(id).remove()
}

function addDiv(id, content) { // adauga divuri sau update
    document.getElementById(id).innerHTML += content;
}

function updateDiv(id, content) {// updateaza div
    document.getElementById(id).innerHTML = content;
}

function createPlayTable() {// creeaza statusul si tabla de joaca
    deleteDiv("level-select")
    addDiv("first-page", status) 
    startStopwatch()
    bombs = '<button type="button" id="mine" class="mine">' + bombsNr + '</button>'
    status = "There are " + bombs + " 💣 left" + "" + markButton
    addDiv("status", status)
    let fields = `
    <div id="fields" class="fields-page">
    </div>`;
    addDiv("first-page", fields)
    createFields()
    generateRandomMineLocation()
    creatematrixID()
    updateMinesVicinity()
    createGameTablematrix()
}

function increasTime() { // creonometru
    time += 10
    let minutes = Math.floor(time / 1000 / 60)
    let seconds = Math.floor(time / 1000) % 60
    let miliseconds = time % 1000 / 10
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    if (miliseconds < 10) {
        miliseconds = "0" + miliseconds
    }
    let timer = "Timer : " + minutes + ":" + seconds + ":" + miliseconds
    updateDiv("timer", timer)
}

function startStopwatch() { //porneste cronometru
    intervalID = setInterval(increasTime, 10)
}

function stopStopwatch() { // opreste timpul
    clearInterval(intervalID)
}

function createFields() {
    for (let i = 1; i <= lines * columns; ++i) {
        let fields = '<button type="button" class="fields" id="'+ i +'" onclick="checkFields(' + i + ')">'+ fieldsNr +'</button>';
        addDiv("fields", fields)
        updateDiv(i, 0)
        if (i % columns == 0) {
            addDiv("fields", endLine)
        }     
    }
}

function generateRandomMineLocation() {
    for (let i = 0; i < bombsNr; ++i) {
        let radomNr = Math.floor(Math.random() * (lines * columns)) + 1;
        if (randomMineLocation.includes(radomNr)) {
            --i 
        } else {
            randomMineLocation[i] = radomNr
            updateDiv(randomMineLocation[i], "💥")
        }
    }    
}

function creatematrixID() {
    let id = 1
    for (let i = 0; i < lines; ++i) {
        matrixID[i] = []
        for (let j = 0; j < columns; ++j) {
            matrixID[i][j] = id
            ++id
        }
    }
}

function createGameTablematrix() {
    for (let i = 0; i < lines; ++i) {
        gameTableMatrix[i] = []
        for (let j = 0; j < columns; ++j) {
            gameTableMatrix[i][j] = parseInt(document.getElementById(matrixID[i][j]).innerHTML)
        }
    }
}

function updateMinesVicinity() {
    for (let i = 0; i < lines; ++i) {
        for (let j = 0; j < columns; ++j) {
            if (randomMineLocation.includes(matrixID[i][j])) {
                updateVicinityFields(i, j)     
            }
        }
    }
}

function updateVicinityFields(x, y) {
    for (let i = x - 1; i <= x + 1; ++i) {
        for (let j = y - 1; j <= y + 1; ++j) {
            if (i >= 0 && j >= 0 && i < lines && j < columns && document.getElementById(matrixID[i][j]).innerHTML != "💥") {
                let fieldsValue = parseInt(document.getElementById(matrixID[i][j]).innerHTML)
                updateDiv(matrixID[i][j], fieldsValue + 1)
            }
        }
    }
}

function markMode() {
    if (mineMarkMode == false) {
        mineMarkMode = true 
        changeBackgroundColor("mark", "red")
    } else {
        mineMarkMode = false
        changeBackgroundColor("mark", "gray")
    }
}

function checkFields(x) { //x = id
    let backgroundColor = document.getElementById(x).style.backgroundColor;
    let fieldsValue = parseInt(document.getElementById(x).innerHTML)
    if (mineMarkMode == true) {
        let minesValue = parseInt(document.getElementById("mine").innerHTML)
        if (backgroundColor == "red") {
            changeBackgroundColor(x, "gray")
            updateDiv("mine", minesValue + 1)
        } else {
            changeBackgroundColor(x, "red")
            updateDiv("mine", minesValue - 1)
        }
    } else {
        if (backgroundColor != "red") {
            if(document.getElementById(x).innerHTML == "💥") {
                gameOver()
            } else if (fieldsValue > 0) {
                changeFontColor(x, colors[fieldsValue])
                openFields(x)
            } else {
                sarchingIndexOfClickedFields(x)
            }
        }
    }
    checkWin()
}

function changeBackgroundColor(id, color) {
    document.getElementById(id).style.backgroundColor = color
}

function changeFontColor(id, color) {
    document.getElementById(id).style.color = color
}

function gameOver() {
    gameOverGif = `
    <img src="explode.gif">
    <br>
    <h4>Unfortunately you lost, you hit a mine. Don't get discouraged and press the restart button to try again.</h4>
    `;
    stopStopwatch()
    updateDiv("fields", gameOverGif)
    addDiv("fields", restartBtn)
}

function sarchingIndexOfClickedFields(x) { //x = id
    for (let i = 0; i <= lines; ++i) {
        for (let j = 0; j <= lines; ++j) { 
            if (matrixID[i][j] == x) {
                return sarchingBlankFields(i, j)
            }
        }
    }
}

function sarchingBlankFields(x, y) { // x = Line, y = column
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i >= 0 && j >= 0 && i < lines && j < columns) {
                openFields(matrixID[i][j])
            }
        }
    }
    if ((x - 1) >= 0 && gameTableMatrix[x - 1][y] == 0)  {
        gameTableMatrix[x - 1][y] = -1
        sarchingBlankFields(x - 1, y)
    }
    if ((x + 1) < lines && gameTableMatrix[x + 1][y] == 0)  {
        gameTableMatrix[x + 1][y] = -1
        sarchingBlankFields(x + 1, y)
    }
    if ((y - 1) >= 0 && gameTableMatrix[x][y - 1] == 0)  {
        gameTableMatrix[x][y - 1] = -1
        sarchingBlankFields(x, y - 1)
    }
    if ((y + 1) < columns && gameTableMatrix[x][y + 1] == 0)  {
        gameTableMatrix[x][y + 1] = -1
        sarchingBlankFields(x, y + 1)
    }
    if ((y - 1) >= 0 && (x - 1) >= 0 && gameTableMatrix[x - 1][y - 1] == 0)  {
        gameTableMatrix[x - 1][y - 1] = -1
        sarchingBlankFields(x - 1, y - 1)
    }
    if ((y + 1) < columns && (x + 1) < lines && gameTableMatrix[x + 1][y + 1] == 0)  {
        gameTableMatrix[x + 1][y + 1] = -1
        sarchingBlankFields(x + 1, y + 1)
    }
    if ((y + 1) < columns && (x - 1) >= 0 && gameTableMatrix[x - 1][y + 1] == 0)  {
        gameTableMatrix[x - 1][y + 1] = -1
        sarchingBlankFields(x - 1, y + 1)
    }
    if ((y - 1) >= 0 && (x + 1) < lines && gameTableMatrix[x + 1][y - 1] == 0)  {
        gameTableMatrix[x + 1][y - 1] = -1
        sarchingBlankFields(x + 1, y - 1)
   }
}

function openFields(id) {
    changeBackgroundColor(id, "white")
    let fieldsValue = parseInt(document.getElementById(id).innerHTML)
    if (fieldsValue > 0) {
        changeFontColor(id, colors[fieldsValue])
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
    let winGameGif = `
    <img src="win.gif">
    <br>
    <h4>Looks like you won, congratulations. To play again press the restart button.</h4>
    `;
    stopStopwatch()
    updateDiv("fields", winGameGif)
    addDiv("fields", restartBtn)
}
