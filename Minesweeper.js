let level
let columns = 0, line = 0

function levelSelect(x) {
    if (x == 1) {
        columns = 10
        lines = 8
    } else if (x == 2) {
        columns = 18
        lines = 14
    } else {
        columns = 24
        lines = 20
    }
    createGameboard()
}

function createGameboard() {
    for (let i = 1; i <= lines; ++i) {
        for (let j = 1; j <= columns; ++j) {
            document.getElementById("gameboard").innerHTML = '<div class="fields">-</div>'
        }
    } 
}