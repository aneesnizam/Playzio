document.addEventListener('DOMContentLoaded', () => {
    const stickman = document.getElementById('stickman');
    const obstaclesContainer = document.getElementById('obstacles');
    const scoreDisplay = document.getElementById('score');
    const gameOverScreen = document.getElementById('game-over');
    const finalScoreDisplay = document.getElementById('final-score');
    const restartButton = document.getElementById('restart');

    let score = 0;
    let gameSpeed = 5;
    let isJumping = false;
    let isSliding = false;
    let isDead = false;
    let gameLoop;
    let obstacleInterval;
    let scoreInterval;

    // Initialize game
    function initGame() {
        score = 0;
        gameSpeed = 5;
        isJumping = false;
        isSliding = false;
        isDead = false;
        scoreDisplay.textContent = '0';
        gameOverScreen.style.display = 'none';
        obstaclesContainer.innerHTML = '';
        stickman.className = 'stickman run';
        
        // Start game loops
        gameLoop = requestAnimationFrame(updateGame);
        obstacleInterval = setInterval(createObstacle, 2000);
        scoreInterval = setInterval(updateScore, 100);
    }

    // Update game state
    function updateGame() {
        if (isDead) return;
        
        checkCollisions();
        gameLoop = requestAnimationFrame(updateGame);
    }

    // Create random obstacles
    function createObstacle() {
        if (isDead) return;
        
        const obstacleTypes = ['brick', 'bench', 'tree-branch', 'slope', 'steps'];
        const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        const obstacle = document.createElement('div');
        obstacle.className = `obstacle ${type}`;
        
        if (type === 'steps') {
            for (let i = 0; i < 3; i++) {
                const step = document.createElement('div');
                step.className = 'step';
                obstacle.appendChild(step);
            }
        }
        
        obstaclesContainer.appendChild(obstacle);
        
        // Animate obstacle
        const animationDuration = 3000 / gameSpeed;
        obstacle.style.animation = `obstacleMove ${animationDuration}ms linear forwards`;
        
        // Remove obstacle after it passes
        setTimeout(() => {
            if (obstacle.parentNode) {
                obstacle.remove();
            }
        }, animationDuration);
    }

    // Check for collisions
    function checkCollisions() {
        const stickmanRect = stickman.getBoundingClientRect();
        const obstacles = document.querySelectorAll('.obstacle');
        
        obstacles.forEach(obstacle => {
            const obstacleRect = obstacle.getBoundingClientRect();
            
            // Simple collision detection
            if (
                stickmanRect.right > obstacleRect.left &&
                stickmanRect.left < obstacleRect.right &&
                stickmanRect.bottom > obstacleRect.top &&
                stickmanRect.top < obstacleRect.bottom
            ) {
                if (!isJumping && !isSliding) {
                    gameOver();
                }
            }
        });
    }

    // Update score
    function updateScore() {
        if (isDead) return;
        
        score++;
        scoreDisplay.textContent = score;
        
        // Increase game speed every 500 points
        if (score % 500 === 0) {
            gameSpeed += 0.5;
        }
    }

    // Game over
    function gameOver() {
        isDead = true;
        cancelAnimationFrame(gameLoop);
        clearInterval(obstacleInterval);
        clearInterval(scoreInterval);
        
        // Show death animation
        stickman.className = 'stickman dead';
        
        // Show game over screen
        finalScoreDisplay.textContent = score;
        gameOverScreen.style.display = 'block';
    }

    // Jump action
    function jump() {
        if (isJumping || isSliding || isDead) return;
        
        isJumping = true;
        stickman.className = 'stickman jump';
        
        // Jump animation
        let jumpHeight = 0;
        let jumpUp = true;
        const jumpInterval = setInterval(() => {
            if (jumpUp) {
                jumpHeight += 5;
                if (jumpHeight >= 100) jumpUp = false;
            } else {
                jumpHeight -= 5;
                if (jumpHeight <= 0) {
                    jumpHeight = 0;
                    clearInterval(jumpInterval);
                    isJumping = false;
                    stickman.className = 'stickman run';
                }
            }
            stickman.style.bottom = `${20 + jumpHeight}px`;
        }, 20);
    }

    // Slide action
    function slide() {
        if (isSliding || isJumping || isDead) return;
        
        isSliding = true;
        stickman.className = 'stickman slide';
        
        // Slide duration
        setTimeout(() => {
            isSliding = false;
            stickman.className = 'stickman run';
        }, 800);
    }

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            jump();
        } else if (e.key === 'ArrowDown') {
            slide();
        }
    });

    // Touch controls for mobile
    document.addEventListener('touchstart', (e) => {
        if (e.touches[0].clientY < window.innerHeight / 2) {
            jump();
        } else {
            slide();
        }
    });

    // Restart button
    restartButton.addEventListener('click', initGame);

    // Start the game
    initGame();
});