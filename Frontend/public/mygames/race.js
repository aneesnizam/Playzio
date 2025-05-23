const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");

const rows = 7;
const cols = 3;
let playerPos = 1;
let carRow = Math.floor(rows * 0.75);
let score = 0;
let highScore = localStorage.getItem("racingHighScore") || 0;
let obstacles = [];
let cells = [];
let gameInterval = null;
let isRunning = false;
let gameSpeed = 500;
let spawnCooldown = 0; // control gap between spawns

highScoreDisplay.textContent = highScore;

// Create the grid
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const div = document.createElement("div");
    div.classList.add("cell");
    gameArea.appendChild(div);
    cells.push(div);
  }
}

function getIndex(row, col) {
  return row * cols + col;
}

function drawPlayer() {
  const index = getIndex(carRow, playerPos);
  if (cells[index]) cells[index].classList.add("car");
}

function clearPlayer() {
  const index = getIndex(carRow, playerPos);
  if (cells[index]) cells[index].classList.remove("car");
}

function drawObstacles() {
  obstacles.forEach(obs => {
    const index = getIndex(obs.row, obs.col);
    if (cells[index]) cells[index].classList.add("obstacle");
  });
}

function clearObstacles() {
  obstacles.forEach(obs => {
    const index = getIndex(obs.row, obs.col);
    if (cells[index]) cells[index].classList.remove("obstacle");
  });
}

function updateObstacles() {
  clearObstacles();
  obstacles.forEach(obs => obs.row += 1);
  obstacles = obstacles.filter(obs => obs.row < rows);

  // Check collision
  for (let obs of obstacles) {
    if (obs.col === playerPos && obs.row === carRow) {
      gameOver();
      return;
    }
  }

  drawObstacles();
}

function spawnObstacle() {
  if (spawnCooldown > 0) {
    spawnCooldown--;
    return;
  }

  const availableCols = [0, 1, 2];

  // Shuffle columns
  for (let i = availableCols.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableCols[i], availableCols[j]] = [availableCols[j], availableCols[i]];
  }

  const count = Math.random() < 0.5 ? 1 : 2;
  const selectedCols = availableCols.slice(0, count);

  for (let col of selectedCols) {
    obstacles.push({ row: 0, col });
  }

  spawnCooldown = 2; // Wait 2 frames before next spawn
}

function gameOver() {
  pauseGame();
  alert("Game Over! Final Score: " + score);
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("racingHighScore", highScore);
    highScoreDisplay.textContent = highScore;
  }
  location.reload();
}

function updateScore() {
  score++;
  scoreDisplay.textContent = score;
}

function gameLoop() {
  updateObstacles();
  updateScore();
  spawnObstacle();
}

document.addEventListener("keydown", e => {
  if (!isRunning) return;
  clearPlayer();
  if (e.key === "ArrowLeft" && playerPos > 0) playerPos--;
  if (e.key === "ArrowRight" && playerPos < cols - 1) playerPos++;
  drawPlayer();
});

function startGame() {
  if (isRunning) return;

  const level = document.querySelector('input[name="level"]:checked').value;
  if (level === "easy") gameSpeed = 600;
  else if (level === "medium") gameSpeed = 400;
  else if (level === "hard") gameSpeed = 200;

  isRunning = true;
  drawPlayer();
  gameInterval = setInterval(gameLoop, gameSpeed);
}

function pauseGame() {
  if (!isRunning) return;
  clearInterval(gameInterval);
  isRunning = false;
}

startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);
