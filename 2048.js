var board;
var score = 0;
var highScore = JSON.parse(localStorage.getItem('highScore')) || 0;
var rows = 4;
var columns = 4;
var changed = false;

window.onload = function() {
  setGame();
}

function setGame() {
  document.getElementById("high-score").innerText = highScore;
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  // board = [
  //   [2, 2, 2, 2],
  //   [2, 2, 2, 2],
  //   [4, 4, 8, 8],
  //   [4, 4, 8, 8]
  // ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      // <div id="r-c"></div>
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      let num = board[r][c];
      updateTile(tile, num);
      document.getElementById("board").append(tile);
    }
  }

  setTwo();
  setTwo();
}

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 0) {
        return true;
      }
    }
  }
  return false;
}

function setTwo() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;
  while (!found) {
    // random r, c
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

function updateTile(tile, num) {
  // clear number and classlist
  tile.innerText = "";
  tile.classList.value = "";
  tile.classList.add("tile");
  if (num > 0) {
    tile.innerText = num;
    if (num <= 4096) {
      tile.classList.add("x"+num.toString());
    } else {
      tile.classList.add("x8192");
    }
  }
}

function updateHighScore() {
  localStorage.setItem('highScore', score);
  highScore = score;
  document.getElementById("high-score").innerText = highScore;
}

// use keyup to ensure user does one move at a time
document.addEventListener("keyup", (e) => {
  if (e.code == "ArrowLeft") {
    slideLeft();
  } else if (e.code == "ArrowRight") {
    slideRight();
  } else if (e.code == "ArrowUp") {
    slideUp();
  } else if (e.code == "ArrowDown") {
    slideDown();
  }

  if (changed) { // only place new tile if player moves
    setTwo();
    changed = false;
  }

  document.getElementById("score").innerText = score;
});

function filterZero(row) {
  return row.filter(num => num != 0);
}

function slide(row) {
  // [0, 2, 2, 2]
  var originalRow = [...row];
  row = filterZero(row); // get rid of zeroes -> [2, 2, 2]

  // slide
  for (let i = 0; i < row.length-1; i++) {
    // check every 2
    if (row[i] == row[i+1]) {
      row[i] *= 2;
      row[i+1] = 0;
      score += row[i];
      if (score > highScore) {
        updateHighScore();
      }
    } // [2, 2, 2] -> [4, 0, 2]
  }

  row = filterZero(row); // [4, 2]

  // add zeroes
  while(row.length < columns) {
    row.push(0);
  } // [4, 2, 0, 0]

  // check if any changes were made to row
  for (let i = 0; i < row.length; i++) {
    if (row[i] !== originalRow[i]) {
      changed = true;
    }
  }

  return row;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    row.reverse(); // reverse before slide()
    row = slide(row);
    row.reverse(); // reverse after slide()
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    /* transpose column into a row */
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    row = slide(row);
    // board[0][c] = row[0];
    // board[1][c] = row[1];
    // board[2][c] = row[2];
    // board[3][c] = row[3];
    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    /* transpose column into a row */
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    row.reverse(); //reverse before slide()
    row = slide(row);
    row.reverse(); //reverse after slide()
    // board[0][c] = row[0];
    // board[1][c] = row[1];
    // board[2][c] = row[2];
    // board[3][c] = row[3];
    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

/*
features to implement:
  - check for when no more possible moves (player loses)
      - no more free tiles and no adjacent matching tiles
  - add reset high score button
  - add reset button
  - animate sliding?
*/