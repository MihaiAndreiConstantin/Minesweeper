let level = 0
let columns = 0
let lines = 0
let gameboardSize = 0
let levelSelectDiv = document.getElementById("level-select")
let bombsNr = 0;
let mineMarkMode = false
let randomMineLocation = []
let cornersFields = []
let leftFields = []
let rightFields = []
let upperFields = []
let lowerFields = []
let midFields = []
let cornerVicinity
let leftSideVicinity = []
let leftSideVicinityfields
let minesInVicinity
let rightSideVicinity = []
let topSideVicinity = []
let bottomSideVicinity = []
let midFieldsVicinity = []

function levelSelect(x) {
    if (x == 1) {
        columns = 10
        lines = 10
        bombsNr = 10
    } else if (x == 2) {
        columns = 15
        lines = 15
        bombsNr = 25
    } else {
        columns = 20
        lines = 20
        bombsNr = 50
    }
    createGameboard()
    setGameboardSize()
    generateRandomMineLocation()
    setMarginFieldsID()

    setCornersVicinityID()
    
    setLeftSideVicinity()
    setRightSideVicinity()
    setTopSideVicinity()
    setBottomSideVicinity()
    setMiddleVecinity()
    setNrOfMinesFromVicinity(cornersFields, cornerVicinity)
    setNrOfMinesFromVicinity(leftFields, leftSideVicinity)
    setNrOfMinesFromVicinity(rightFields, rightSideVicinity)
    setNrOfMinesFromVicinity(upperFields, topSideVicinity)
    setNrOfMinesFromVicinity(lowerFields, bottomSideVicinity)
    setNrOfMinesFromVicinity(midFields, midFieldsVicinity)
}

function createGameboard() {
    preparePlayTable()
    createStatus()
    for (let i = 1; i <= lines * columns; ++i) {
        document.getElementById("gameboard").innerHTML += '<button type="button" class="fields" id="'+ i +'" onclick="checkFields(' + i + ')">' + i +'</button>'     
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

function  createStatus() {
    document.getElementById("status").innerHTML = "🚩" + bombsNr + " " + '<button type="button" id="mark-bomb" class="mark" onclick="markMine()">Mark 💣</button>'
    document.getElementById("status").style.width = "404px"
}

function markMine() {
    if (mineMarkMode == false) {
        mineMarkMode = true
        document.getElementById("mark-bomb").style.backgroundColor = "red"
    } else {
        mineMarkMode = false
        document.getElementById("mark-bomb").style.backgroundColor = "transparent"
    }
    //console.log(mineMarkMode);
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

function cornerFields() {
    cornersFields[0] = 1
    cornersFields[1] = columns
    cornersFields[2] = (lines * columns) - (columns - 1)
    cornersFields[3] = lines * columns
}

function leftSideFields() {
    let leftSideField = cornersFields[0] + columns
    for (let i = 0; i < lines - 2; ++i) {
        leftFields[i] = leftSideField 
        leftSideField += columns
    }
}

function rightSideFields() {
    let rightSideField = cornersFields[1] + columns
    for (let i = 0; i < lines - 2; ++i) {
        rightFields[i] = rightSideField
        rightSideField += columns
    }
}

function upperSideFields() {
    for (let i = 0; i < lines - 2; ++i) {
        upperFields[i] = i + 2
    }
}

function lowerSideFields() {
    let lowerField = cornersFields[2] + 1
    for (let i = 0; i < lines - 2; ++i) {
        lowerFields[i] = lowerField
        lowerField += 1
    }
}

function middleFields() {
    index = 0
    for (let i = columns + 2; i < (lines * columns) - columns; ++i) {
        if (leftFields.includes(i) == false && rightFields.includes(i) == false) {
            midFields[index] = i
            ++index
        }
    }
    console.table(midFields);
}

function setMarginFieldsID() {
    cornerFields()
    leftSideFields()
    rightSideFields()
    upperSideFields()
    lowerSideFields()
    middleFields()
}

function setCornersVicinityID() {
    cornerVicinity = [[cornersFields[0] + 1, cornersFields[0] + columns, cornersFields[0] + columns + 1],
    [cornersFields[1] - 1, cornersFields[1] + columns - 1, cornersFields[1] + columns],
    [cornersFields[2] - columns, cornersFields[2] - (columns - 1), cornersFields[2] + 1],
    [cornersFields[3] - columns - 1, cornersFields[3] - columns, cornersFields[3] - 1]]
}

function setLeftSideVicinity() {
    for (let i = 0; i < lines - 2; ++i) {
        leftSideVicinity.push([leftFields[i] + (columns * (-1)), leftFields[i] + ((columns - 1) * (-1)), leftFields[i] + (1), leftFields[i] + (columns), leftFields[i] + (columns + 1)])   
    }
}

function setRightSideVicinity() {
    for (let i = 0; i < lines - 2; ++i) {
        rightSideVicinity.push([rightFields[i] + (columns * (-1)), rightFields[i] - (columns + 1), rightFields[i] + (-1), rightFields[i] + (columns - 1), rightFields[i] + columns])   
    }
    //console.table(rightSideVicinity)
}

function setTopSideVicinity() {
    for (let i = 0; i < columns - 2; ++i) {
        topSideVicinity.push([upperFields[i] - 1, upperFields[i] + 1, upperFields[i] + (columns - 1), upperFields[i] + columns, upperFields[i] + columns + 1])   
    }
    //console.table(topSideVicinity)
}

function setBottomSideVicinity() {
    for (let i = 0; i < columns - 2; ++i) {
        bottomSideVicinity.push([lowerFields[i] - columns - 1, lowerFields[i] - columns, lowerFields[i] - (columns - 1), lowerFields[i] - 1, lowerFields[i] + 1])   
    }
    //
}

function setMiddleVecinity() {
    for(let i = 0; i <midFields.length; ++i) {
        midFieldsVicinity.push([midFields[i] - columns - 1, midFields[i] - columns, midFields[i] - (columns - 1), midFields[i] - 1, midFields[i] + 1,  midFields[i] + (columns - 1), midFields[i] + columns, midFields[i] + columns + 1])
    }console.table(midFieldsVicinity)
}

function setNrOfMinesFromVicinity(rf, rsv) {
    for (let i = 1; i <= lines * columns; ++i) {
        let minesInVicinity = 0
        if (rf.includes(i)) {
            for (let x = 0; x < rf.length; ++x) {
                minesInVicinity = 0
                if (rf[x] == i && document.getElementById(rf[x]).innerHTML != "💥") {
                    let lungime = rsv[x].length
                    for (let j = 0; j < lungime; ++j) {
                        console.table(rsv[x][j])
                        if (document.getElementById(rsv[x][j]).innerText == "💥") {
                            ++minesInVicinity
                            //console.log(minesInVicinity);
                        }
                    document.getElementById(rf[x]).innerHTML = minesInVicinity
                    }
                }
            }
        }
    }
}
