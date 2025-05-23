// Game configuration
const config = {
    gridSize: 10,
    timeLimit: 30,
    colors: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'cyan', 'magenta'],
    minColorCount: 5,
    maxColorCount: 10
};

// Game state
let state = {
    targetColor: '',
    cells: [],
    timeLeft: config.timeLimit,
    score: 0,
    targetCount: 0,
    foundCount: 0,
    timer: null,
    gameActive: false
};

// DOM elements
const grid = document.getElementById('grid');
const targetColorDisplay = document.getElementById('target-color');
const timerDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

// Initialize the game
function initGame() {
    // Reset game state
    state = {
        targetColor: '',
        cells: [],
        timeLeft: config.timeLimit,
        score: 0,
        targetCount: 0,
        foundCount: 0,
        timer: null,
        gameActive: true
    };
    
    // Update displays
    scoreDisplay.textContent = state.score;
    timerDisplay.textContent = state.timeLeft;
    
    // Clear the grid
    grid.innerHTML = '';
    
    // Create cells
    createCells();
    
    // Set first target color
    setNewTargetColor();
    
    // Start timer
    startTimer();
    
    // Hide game over screen
    gameOverScreen.style.display = 'none';
}

// Create grid cells with random colors
function createCells() {
    // Determine how many cells will have each color
    const colorCounts = {};
    const totalColorCells = Math.floor(config.gridSize * config.gridSize * 0.7); // 70% of cells will be colored
    
    // Initialize color counts
    config.colors.forEach(color => {
        colorCounts[color] = 0;
    });
    
    // Distribute cells among colors
    for (let i = 0; i < totalColorCells; i++) {
        const randomColor = config.colors[Math.floor(Math.random() * config.colors.length)];
        colorCounts[randomColor]++;
    }
    
    // Create cells
    for (let i = 0; i < config.gridSize * config.gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        
        // 30% chance to be empty (white)
        if (Math.random() < 0.3) {
            cell.style.backgroundColor = 'white';
            cell.dataset.color = 'white';
        } else {
            // Assign a random color that still needs cells
            let availableColors = Object.keys(colorCounts).filter(color => colorCounts[color] > 0);
            if (availableColors.length === 0) {
                availableColors = config.colors;
            }
            const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
            cell.style.backgroundColor = randomColor;
            cell.dataset.color = randomColor;
            colorCounts[randomColor]--;
        }
        
        cell.addEventListener('click', handleCellClick);
        grid.appendChild(cell);
        state.cells.push(cell);
    }
}

// Set a new target color
function setNewTargetColor() {
    // Find colors that still have cells remaining
    const availableColors = [];
    const colorCounts = {};
    
    config.colors.forEach(color => {
        colorCounts[color] = 0;
    });
    
    state.cells.forEach(cell => {
        const color = cell.dataset.color;
        if (color !== 'white' && !cell.classList.contains('selected')) {
            colorCounts[color]++;
        }
    });
    
    for (const color in colorCounts) {
        if (colorCounts[color] > 0) {
            availableColors.push(color);
        }
    }
    
    // If no colors left, end game
    if (availableColors.length === 0) {
        endGame(true);
        return;
    }
    
    // Select a random available color
    state.targetColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    targetColorDisplay.textContent = state.targetColor;
    targetColorDisplay.style.color = state.targetColor;
    
    // Count how many of this color exist
    state.targetCount = colorCounts[state.targetColor];
    state.foundCount = 0;
    
    // Reset timer
    state.timeLeft = config.timeLimit;
    timerDisplay.textContent = state.timeLeft;
}

// Handle cell clicks
function handleCellClick(e) {
    if (!state.gameActive) return;
    
    const cell = e.target;
    const cellColor = cell.dataset.color;
    
    // If cell is already selected or white, ignore
    if (cell.classList.contains('selected') || cellColor === 'white') {
        return;
    }
    
    // If correct color
    if (cellColor === state.targetColor) {
        cell.classList.add('selected');
        state.foundCount++;
        state.score += 10;
        scoreDisplay.textContent = state.score;
        
        // Check if all target colors found
        if (state.foundCount === state.targetCount) {
            state.score += Math.floor(state.timeLeft) * 5; // Bonus for remaining time
            scoreDisplay.textContent = state.score;
            setNewTargetColor();
        }
    } else {
        // Wrong color penalty
        state.score = Math.max(0, state.score - 5);
        scoreDisplay.textContent = state.score;
    }
}

// Start the game timer
function startTimer() {
    clearInterval(state.timer);
    state.timer = setInterval(() => {
        state.timeLeft--;
        timerDisplay.textContent = state.timeLeft;
        
        if (state.timeLeft <= 0) {
            // Time's up - set new target color
            setNewTargetColor();
        }
    }, 1000);
}

// End the game
function endGame(success) {
    state.gameActive = false;
    clearInterval(state.timer);
    
    finalScoreDisplay.textContent = state.score;
    gameOverScreen.style.display = 'flex';
}

// Event listeners
restartBtn.addEventListener('click', initGame);

// Start the game
initGame();