// Game elements
const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');
const gameOverElement = document.getElementById('game-over');

// Game variables
let isJumping = false;
let isGameOver = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameSpeed = 5;
let gameInterval;
let obstacleInterval;

// Initialize game
function initGame() {
    // Set high score
    highScoreElement.textContent = highScore;
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    document.addEventListener('keydown', handleKeyPress);
}

// Start game
function startGame() {
    // Reset game state
    isGameOver = false;
    score = 0;
    scoreElement.textContent = score;
    gameOverElement.style.display = 'none';
    startBtn.style.display = 'none';
    
    // Clear existing obstacles
    document.querySelectorAll('.obstacle').forEach(obs => obs.remove());
    
    // Reset player position
    player.style.bottom = '0px';
    
    // Start game loops
    gameInterval = setInterval(updateGame, 20);
    obstacleInterval = setInterval(createObstacle, 1500);
}

// Handle keyboard input
function handleKeyPress(e) {
    if ((e.code === 'Space' || e.key === 'ArrowUp') && !isJumping && !isGameOver) {
        jump();
    }
}

// Make player jump
function jump() {
    if (isJumping) return;
    
    isJumping = true;
    let jumpHeight = 0;
    const jumpUp = setInterval(() => {
        jumpHeight += 5;
        player.style.bottom = jumpHeight + 'px';
        
        if (jumpHeight >= 150) {
            clearInterval(jumpUp);
            const jumpDown = setInterval(() => {
                jumpHeight -= 5;
                player.style.bottom = jumpHeight + 'px';
                
                if (jumpHeight <= 0) {
                    player.style.bottom = '0px';
                    clearInterval(jumpDown);
                    isJumping = false;
                }
            }, 20);
        }
    }, 20);
}

// Create new obstacle
function createObstacle() {
    if (isGameOver) return;
    
    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    gameArea.appendChild(obstacle);
    
    let obstaclePosition = gameArea.offsetWidth;
    const obstacleMove = setInterval(() => {
        if (obstaclePosition < -30) {
            clearInterval(obstacleMove);
            obstacle.remove();
            if (!isGameOver) {
                score++;
                scoreElement.textContent = score;
                
                // Increase speed every 5 points
                if (score % 5 === 0) {
                    gameSpeed += 0.5;
                }
            }
        } else {
            obstaclePosition -= gameSpeed;
            obstacle.style.right = `${gameArea.offsetWidth - obstaclePosition}px`;
            
            // Check collision
            if (
                obstaclePosition < player.offsetLeft + player.offsetWidth &&
                obstaclePosition + 30 > player.offsetLeft &&
                player.offsetTop + player.offsetHeight > gameArea.offsetHeight - 30
            ) {
                gameOver();
            }
        }
    }, 20);
}

// Update game state
function updateGame() {
    // Check if player is on ground
    const playerBottom = parseInt(window.getComputedStyle(player).getPropertyValue('bottom'));
    if (playerBottom > 0) {
        player.classList.add('jumping');
    } else {
        player.classList.remove('jumping');
    }
}

// Game over
function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('highScore', highScore);
    }
    
    gameOverElement.style.display = 'block';
    startBtn.style.display = 'inline-block';
    startBtn.textContent = 'Play Again';
}

// Initialize the game
initGame();