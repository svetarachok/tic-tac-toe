const gameCells = document.querySelectorAll(".game_cell");
const stepXCount = document.querySelector(".player_x_steps");
const stepOCount = document.querySelector(".player_o_steps");
const resultsBtn = document.querySelector(".game_results_btn");
const gameResults = document.querySelector(".game_results");
const closeResultsBtn = document.querySelector(".results_close_btn");
const resetBtn = document.querySelector(".reset_btn");
const buttons = document.querySelectorAll(".btn");

let step = 0;
let stepX = 0;
let stepO = 0;
let player = "X";

let messageText = document.querySelector(".message");

const winCombination = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let gameResultsArr = [];

function currentStep() {
  if (!this.textContent) {
    this.innerText = player;
    this.classList.add("clicked");
    step++;
    changePlayer();
    if (this.textContent === "O") {
      this.classList.add("orange");
    }
    activeSteps();
    messageText.textContent = `Ходит Игрок-${player}`;
    checkWinner();
  }
}

function activeSteps() {
  const stepIcon = document.querySelector(".player_score_icon");
  const xSteps = document.querySelector(".player_x_steps");
  const oSteps = document.querySelector(".player_o_steps");
  if (step > 0) {
    stepIcon.classList.add("active");
    xSteps.classList.add("active");
    oSteps.classList.add("active");
  } else {
    stepIcon.classList.remove("active");
    xSteps.classList.remove("active");
    oSteps.classList.remove("active");
  }
}

function changePlayer() {
  if (player === "X") {
    player = "O";
    stepX++;
    stepXCount.textContent = `${stepX}`;
  } else {
    player = "X";
    stepO++;
    stepOCount.textContent = `${stepO}`;
  }
}

function checkWinner() {
  let winner = "";
  let target = gameCells;
  let win = winCombination;
  for (i = 0; i < win.length; i++) {
    if (
      target[win[i][0]].textContent === "X" &&
      target[win[i][1]].textContent === "X" &&
      target[win[i][2]].textContent === "X"
    ) {
      winner = "X";
      target[win[i][0]].classList.add("winner_item_x");
      target[win[i][1]].classList.add("winner_item_x");
      target[win[i][2]].classList.add("winner_item_x");
      stopGame(winner);
    } else if (
      target[win[i][0]].textContent === "O" &&
      target[win[i][1]].textContent === "O" &&
      target[win[i][2]].textContent === "O"
    ) {
      winner = "O";
      target[win[i][0]].classList.add("winner_item_o");
      target[win[i][1]].classList.add("winner_item_o");
      target[win[i][2]].classList.add("winner_item_o");
      stopGame(winner);
    }
  }
  if (step === 9 && winner === "") {
    winner = "";
    stopGame(winner);
  }
  return winner;
}

function stopGame(result) {
  if (result === "") {
    messageText.textContent = `Ничья!`;
    addMusic('assets/draw.mp3')
  } else {
    messageText.textContent = `Победил Игрок-${result}`;
    addMusic('assets/winner.mp3')
    gameCells.forEach((item) => item.removeEventListener("click", currentStep));
  }
  saveGameResults(result, gameResultsArr);
  showGameResults();
}

function resetAll() {
  gameCells.forEach((item) => {
    item.classList.remove("clicked", "winner_item_x", "winner_item_o", 'orange');
    item.textContent = "";
    item.addEventListener("click", currentStep);
  });
  messageText.textContent = `Ходит Игрок-X`;
  player = "X";
  winner = "";
  step = 0;
  activeSteps();
  stepXCount.textContent = "0";
  stepOCount.textContent = "0";
  stepX = 0;
  stepO = 0;
}

function saveGameResults(data, arr) {
  arr.unshift(data);
  if (arr.length > 10) {
    arr.pop();
  }
  localStorage.setItem('key', JSON.stringify(arr));
}

function showGameResults() {
  const gameStat = gameResults.querySelector(".game_stat");
  gameStat.innerHTML = "";
  let lastTenResults = JSON.parse(localStorage.getItem('key'));
  console.log(lastTenResults)
  for (let i = 0; i < lastTenResults.length; i++) {
    let res = document.createElement("div");
    res.textContent = `Победил Игрок-${lastTenResults[i]}`;
    if (lastTenResults[i] === "") {
      res.textContent = `Ничья!`;
    }
    gameStat.append(res);
  }
}

function addBtnSound(src) {
  let audio = new Audio();
  audio.preload = "auto";
  audio.src = src;
  audio.play();
}

function addMusic(src){
    let audio = new Audio();
    audio.preload = 'auto';
    audio.autoplay = true;
    audio.src = src;
    audio.play();
}

document.addEventListener('DOMContentLoaded', showGameResults);

resultsBtn.addEventListener("click", () => {
  gameResults.classList.remove("hidden");
  resultsBtn.classList.add("inactive");
});

closeResultsBtn.addEventListener("click", () => {
  gameResults.classList.add("hidden");
  resultsBtn.classList.remove("inactive");
});
resetBtn.addEventListener("click", resetAll);

gameCells.forEach((item) => item.addEventListener("click", currentStep));
gameCells.forEach((item) =>
  item.addEventListener("click", () => addBtnSound("assets/cell-click.mp3"))
);

buttons.forEach((item) =>
  item.addEventListener("click", () => addBtnSound("assets/btn-click.mp3"))
);
