// LOGIC
class Node {
  constructor([x, y], moves, route) {
    this.location = [x, y];
    this.moves = moves;
    this.route = route;
  }
}
const createGameBoard = () => {
  const gameBoard = [];
  for (let i = 0; i <= 7; i++) {
    gameBoard[i] = [];
    for (let j = 0; j <= 7; j++) {
      gameBoard[i][j] = false;
    }
  }
  return gameBoard;
};

const checkTileOpen = (board, loc) => {
  const x = loc[0];
  const y = loc[1];
  return !board[x][y];
};

const isWithinBounds = (loc) => {
  if (loc[0] < 0 || loc[0] > 7 || loc[1] < 0 || loc[1] > 7) {
    return false;
  } else {
    return true;
  }
};

const availableMoves = (board, loc) => {
  let moves = [
    [loc[0] + 2, loc[1] + 1],
    [loc[0] + 2, loc[1] - 1],
    [loc[0] + 1, loc[1] + 2],
    [loc[0] + 1, loc[1] - 2],
    [loc[0] - 1, loc[1] + 2],
    [loc[0] - 1, loc[1] - 2],
    [loc[0] - 2, loc[1] + 1],
    [loc[0] - 2, loc[1] - 1],
  ];
  let available = moves.filter((move) => {
    if (isWithinBounds(move) && checkTileOpen(board, move)) {
      return move;
    }
  });
  return available;
};

const knightMoves = (start, end) => {
  let currentBoard = createGameBoard();
  let queue = [new Node([start[0], start[1]], 0, [start[0], start[1]])];

  while (queue.length > 0) {
    let currentMove = queue.shift();
    let x = currentMove.location[0];
    let y = currentMove.location[1];

    currentBoard[x][y] = true;

    if (
      currentMove.location[0] === end[0] &&
      currentMove.location[1] === end[1]
    ) {
      return currentMove;
    } else {
      let available = availableMoves(currentBoard, currentMove.location);
      available.forEach((move) => {
        let node = new Node(
          [move[0], move[1]],
          currentMove.moves + 1,
          currentMove.route.concat([move])
        );
        queue.push(node);
      });
    }
    document;
  }
};

const printKnightMoves = (start, end) => {
  const result = knightMoves(start, end);
  console.log(result.route);
  return {
    moves: result.moves,
    path: result.route,
  };
};

// DOM
const BoardDOM = document.querySelector("#board");
const StartBtn = document.querySelector("#start");
const ResetBtn = document.querySelector("#reset");
const InstructionDom = document.querySelector(".instruction");

let KnightSvg;
let startingCell = [];
let endingCell = [];

StartBtn.addEventListener("click", () => startBtnHandler());
ResetBtn.addEventListener("click", () => resetBtnHandler());

let currentColor = "white";
const intiBoard = () => {
  InstructionDom.innerHTML = "Click on cell to place the knight";
  startingCell = [];
  endingCell = [];
  StartBtn.disabled = true;
  ResetBtn.disabled = true;
  BoardDOM.innerHTML = "";

  BoardDOM.innerHTML = `<img class="knight" src="./knight.svg" alt="" />`;

  KnightSvg = document.querySelector(".knight");
  KnightSvg.hidden = true;
  for (let x = 0; x < 8; x++) {
    if (currentColor === "black") currentColor = "white";
    else currentColor = "black";

    for (let y = 0; y < 8; y++) {
      if (currentColor === "black") {
        BoardDOM.appendChild(cell(`${x}+${y}`, "black", x, y));
        currentColor = "white";
      } else {
        BoardDOM.appendChild(cell(`${x}+${y}`, "white", x, y));
        currentColor = "black";
      }
    }
  }
};
const cell = (id, backgroundColor, x, y) => {
  const box = document.createElement("div");
  if (backgroundColor === "black") backgroundColor = "#b9a8a8";
  box.style.backgroundColor = backgroundColor;
  box.id = id;
  box.className = "cell";
  box.style.cursor = "pointer";
  box.addEventListener("click", () => handleCellClick(x, y));
  return box;
};

const placeKnight = (x, y) => {
  const row = x * 100 + 25;
  const col = y * 100 + 25;
  KnightSvg.hidden = false;
  KnightSvg.style.transform = `translate(${col}px, ${row}px)`;
};
const markEndCell = (x, y) => {
  const id = `${x}+${y}`;
  const currentCell = document.getElementById(id);
  currentCell.style.backgroundColor = "#3f3838";
};
const markMove = (count, x, y) => {
  document.getElementById(`${x}+${y}`).style.backgroundColor = "#301616";
};

// Click Handlers
const handleCellClick = (x, y) => {
  if (startingCell.length == 0) {
    startingCell = [x, y];
    placeKnight(x, y);
    InstructionDom.innerHTML = "Please select end cell";
    ResetBtn.disabled = false;
    return;
  }
  if (endingCell.length == 0) {
    if (startingCell[0] === x && startingCell[1] === y) {
      InstructionDom.innerHTML = "Please select different end cell";
      return;
    }
    endingCell = [x, y];
    markEndCell(x, y);
    InstructionDom.innerHTML = "Press Travail button to start travail";
    StartBtn.disabled = false;
    ResetBtn.disabled = false;
    return;
  }
};

const startBtnHandler = async () => {
  StartBtn.disabled = true;
  if (startingCell.length == 0 && endingCell.length == 0) return;
  const { path, moves } = printKnightMoves(startingCell, endingCell);
  ResetBtn.disabled = true;
  for (i = 2; i < 2 + moves; i++) {
    let cell = path[i];
    placeKnight(cell[0], cell[1]);
    // markMove(i - 1, cell[0], cell[1]);
    await new Promise((r) => setTimeout(r, 1000));
  }
  ResetBtn.disabled = false;
};

const resetBtnHandler = () => {
  intiBoard();
};

intiBoard();
