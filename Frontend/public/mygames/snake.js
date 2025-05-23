const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let box = 80;
let cols, rows;
const gap = 4;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("highScore").innerText = highScore;

let snake = [];
let direction = "RIGHT";
let food = {};
let game = null;
let isPaused = false;
let gameStarted = false;

// Images
const snakeImg = new Image();
snakeImg.src = "snake.png";

const foodImg = new Image();
foodImg.src = "apple.png";

// Resize canvas
function resizeCanvas() {
  // Set base canvas dimensions
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.7;

  // Dynamically size the box so it fits on all screens
  const maxCols = Math.floor(canvas.width / 40);
  const maxRows = Math.floor(canvas.height / 40);

  cols = maxCols;
  rows = maxRows;

  // Set box size based on available space
  box = Math.min(
    Math.floor(canvas.width / cols),
    Math.floor(canvas.height / rows)
  );
}


window.addEventListener("resize", () => {
  resizeCanvas();
  if (gameStarted) spawnFood();
});

document.addEventListener("keydown", setDirection);
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", togglePause);

function startGame() {
  if (game) clearInterval(game);
  resizeCanvas();
  score = 0;
  snake = [{ x: 5 * box, y: 5 * box }];
  direction = "RIGHT"; // ensure initial movement
  spawnFood();
  document.getElementById("score").innerText = score;
  isPaused = false;
  gameStarted = true;
  game = setInterval(drawGame, 150);
}

function togglePause() {
  if (!game) return;
  if (isPaused) {
    game = setInterval(drawGame, 150);
  } else {
    clearInterval(game);
  }
  isPaused = !isPaused;
}

function setDirection(e) {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function spawnFood() {
  food = {
    x: Math.floor(Math.random() * cols) * box,
    y: Math.floor(Math.random() * rows) * box
  };
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw gridlines
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += box) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += box) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.drawImage(
      snakeImg,
      snake[i].x + gap,
      snake[i].y + gap,
      box - 2 * gap,
      box - 2 * gap
    );
  }

  // Draw food
  ctx.drawImage(
    foodImg,
    food.x + gap,
    food.y + gap,
    box - 2 * gap,
    box - 2 * gap
  );

  // Move snake
  let head = { x: snake[0].x, y: snake[0].y };
  if (direction === "UP") head.y -= box;
  else if (direction === "DOWN") head.y += box;
  else if (direction === "LEFT") head.x -= box;
  else if (direction === "RIGHT") head.x += box;

  // Game over check
  if (
    head.x < 0 || head.x >= cols * box ||
    head.y < 0 || head.y >= rows * box ||
    snake.some((seg, i) => i !== 0 && seg.x === head.x && seg.y === head.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      document.getElementById("highScore").innerText = highScore;
    }

    spawnFood();
  } else {
    snake.pop();
  }
}

function gameOver() {
  clearInterval(game);
  alert("Game Over!");
  game = null;
  gameStarted = false;
}
