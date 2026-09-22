var board
var score = 0
var rows = 4
var columns = 4
const pool = [0, 0, 0, 0, 0, 0, 2, 2, 2, 4, 4, 8];

var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;
var isMouseDown = false;






function getRandomValue() {
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
}
window.onload = function() {
    setGame();
}
function setGame() {
    //   board = [
    //     [2, 2, 2, 2],
    //     [2, 2, 2, 2],
    //     [4, 4, 8, 8],
    //     [4, 4, 8, 8]
    //  ]; // a test for the board

board = []
for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push(getRandomValue());
        }
        board.push(row);
}
for(let r = 0; r<rows; r++) {
    for(let c = 0; c < columns; c++) { // filling out the squares in the 2048 grid
        let tile = document.createElement("div")
        tile.id = r.toString() + "-" + c.toString();
        let num = board[r][c];
        updateTile(tile,num);
        document.getElementById("board").append(tile)
    }
}
setTwo();
setTwo();
}
function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList = "";
    tile.classList.add("tile")
    if(num > 0) {
        tile.innerText = num;
        if(num <= 4096) tile.classList.add("x"+num.toString())
            else tile.classList.add("x8192")
    }
}
document.addEventListener('keyup', (e) => {
if(e.code == 'ArrowLeft') {
    slideLeft();
    setTwo();
}
if(e.code == 'ArrowRight') {
    slideRight();
    setTwo();
}
if(e.code == 'ArrowUp') {
    slideUp();
    setTwo();
}
if(e.code == 'ArrowDown') {
    slideDown();
    setTwo();
}
document.getElementById("score").innerText = score;
})


document.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    startX = e.clientX;
    startY = e.clientY;
});

document.addEventListener('mouseup', (e) => {
    if (!isMouseDown) return;
    isMouseDown = false;

    endX = e.clientX;
    endY = e.clientY;

    let diffX = endX - startX;
    let diffY = endY - startY;

    
    let minDistance = 30;

    let moved = false;

    
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > minDistance) {
            if (diffX > 0) {
                slideRight();
            } else {
                slideLeft();
            }
            moved = true;
        }
    } else {
        // Vertical movement
        if (Math.abs(diffY) > minDistance) {
            if (diffY > 0) {
                slideDown();
            } else {
                slideUp();
            }
            moved = true;
        }
    }

    if (moved) {
        setTwo();
        document.getElementById("score").innerText = score;
    }
});




function filterZero(row) {
    return row.filter(num => num != 0) // creates a different array that removes the zero and the number will replace the position of that zero
}
function slide(row) {
row = filterZero(row)
// sliding process
 for(let i = 0; i < row.length-1; i++) {
            if (row[i] == row[i+1]) {
            row[i] *= 2; //merging the squares together
            row[i+1] = 0;
            score += row[i]; //updating the score
            i++; // skip next merged tile
        }
        } // [2,2,2,0] => [4,0,2,0 (ignore this)]
        row = filterZero(row)
    //add zeros back
    while (row.length < columns) row.push(0);
    //[4, 2, 0, 0]
    return row;
       
}
function slideLeft() {
    for(let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}
function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];         //[0, 2, 2, 2]
        row.reverse();              //[2, 2, 2, 0]
        row = slide(row)            //[4, 2, 0, 0]
        board[r] = row.reverse();   //[0, 0, 2, 4];
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function setTwo() {
    if (!hasEmptyTile()) {
        return; // stop the program
    }
    let found = false;
    while (!found) {
        //find random row and column to place a 2 in
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) { //at least one zero in the board
                return true;
            }
        }
    }
    return false;
}