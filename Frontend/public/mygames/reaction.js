// Game configuration
const config = {
    gridSize: 15,
    timeLimit: 60,
    targetDuration: 2000
};

// Game state
let state = {
    score: 0,
    timeLeft: config.timeLimit,
    targetCell: null,
    timer: null,
    targetTimer: null,
    gameActive: false
};

// DOM elements
const grid = document.getElementById('grid');
const timerDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

// Initialize the game
function initGame() {
    // Reset game state
    state = {
        score: 0,
        timeLeft: config.timeLimit,
        targetCell: null,
        timer: null,
        targetTimer: null,
        gameActive: true
    };
    
    // Update displays
    scoreDisplay.textContent = state.score;
    timerDisplay.textContent = state.timeLeft;
    
    // Clear the grid
    grid.innerHTML = '';
    
    // Create cells
    createCells();
    
    // Start game timer
    startGameTimer();
    
    // Create first target
    createNewTarget();
    
    // Hide game over screen
    gameOverScreen.style.display = 'none';
}

// Create grid cells
function createCells() {
    for (let i = 0; i < config.gridSize * config.gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        grid.appendChild(cell);
    }
}

// Create a new target
function createNewTarget() {
    if (!state.gameActive) return;
    
    // Clear previous target if exists
    if (state.targetCell) {
        state.targetCell.classList.remove('target');
        clearTimeout(state.targetTimer);
    }
    
    // Select random cell
    const cells = document.querySelectorAll('.cell');
    const randomIndex = Math.floor(Math.random() * cells.length);
    state.targetCell = cells[randomIndex];
    state.targetCell.classList.add('target');
    
    // Set timer to move target if not clicked
    state.targetTimer = setTimeout(() => {
        if (state.gameActive) {
            createNewTarget();
        }
    }, config.targetDuration);
}

// Handle cell clicks
function handleCellClick(e) {
    if (!state.gameActive) return;
    
    const cell = e.target;
    
    // If clicked on target
    if (cell === state.targetCell) {
        state.score++;
        scoreDisplay.textContent = state.score;
        createNewTarget();
    }
}

// Start the game timer
function startGameTimer() {
    clearInterval(state.timer);
    state.timer = setInterval(() => {
        state.timeLeft--;
        timerDisplay.textContent = state.timeLeft;
        
        if (state.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// End the game
function endGame() {
    state.gameActive = false;
    clearInterval(state.timer);
    clearTimeout(state.targetTimer);
    
    if (state.targetCell) {
        state.targetCell.classList.remove('target');
    }
    
    finalScoreDisplay.textContent = state.score;
    gameOverScreen.style.display = 'flex';
}

// Event listeners
restartBtn.addEventListener('click', initGame);

// Start the game
initGame();