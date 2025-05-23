// Game variables
let players = [];
let currentPlayerIndex = 0;
let boardSize = 100;
let snakes = [];
let ladders = [];
let playerPositions = [];
let gameStarted = false;

// DOM elements
const boardElement = document.getElementById('board');
const diceElement = document.getElementById('dice');
const rollDiceButton = document.getElementById('rollDice');
const playerInfoElement = document.getElementById('playerInfo');
const startGameButton = document.getElementById('startGame');
const playerCountInput = document.getElementById('playerCount');
const statusElement = document.getElementById('status');

// Colors for players
const playerColors = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF', '#00FFFF'];

// Initialize the board
function initializeBoard() {
    boardElement.innerHTML = '';
    
    // Create cells in reverse order for snake and ladder board
    for (let row = 9; row >= 0; row--) {
        for (let col = 0; col < 10; col++) {
            const cellNumber = (row % 2 === 0) ? (row * 10 + col + 1) : (row * 10 + (10 - col));
            
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.number = cellNumber;
            
            const cellNumberElement = document.createElement('div');
            cellNumberElement.className = 'cell-number';
            cellNumberElement.textContent = cellNumber;
            cell.appendChild(cellNumberElement);
            
            boardElement.appendChild(cell);
        }
    }
}

// Generate random snakes and ladders
function generateSnakesAndLadders() {
    snakes = [];
    ladders = [];
    
    // Clear existing snakes and ladders
    const existingSnakes = document.querySelectorAll('.snake');
    const existingLadders = document.querySelectorAll('.ladder');
    
    existingSnakes.forEach(snake => snake.remove());
    existingLadders.forEach(ladder => ladder.remove());
    
    // Generate snakes (5-8 snakes)
    const snakeCount = Math.floor(Math.random() * 4) + 5;
    for (let i = 0; i < snakeCount; i++) {
        let start, end;
        
        do {
            start = Math.floor(Math.random() * (boardSize - 10)) + 10; // 10-99
            end = Math.floor(Math.random() * (start - 1)) + 1; // 1 to start-1
            
            // Make sure this start isn't already used and end isn't a ladder bottom
            const startUsed = snakes.some(s => s.start === start) || ladders.some(l => l.start === start);
            const endUsedAsLadderBottom = ladders.some(l => l.start === end);
            
            if (!startUsed && !endUsedAsLadderBottom) {
                snakes.push({ start, end });
                drawSnake(start, end);
                break;
            }
        } while (true);
    }
    
    // Generate ladders (5-8 ladders)
    const ladderCount = Math.floor(Math.random() * 4) + 5;
    for (let i = 0; i < ladderCount; i++) {
        let start, end;
        
        do {
            start = Math.floor(Math.random() * (boardSize - 10)) + 1; // 1-90
            end = Math.floor(Math.random() * (boardSize - start)) + start + 1; // start+1 to 100
            
            // Make sure this start isn't already used and end isn't a snake head
            const startUsed = ladders.some(l => l.start === start) || snakes.some(s => s.start === start);
            const endUsedAsSnakeHead = snakes.some(s => s.start === end);
            
            if (!startUsed && !endUsedAsSnakeHead && start !== end) {
                ladders.push({ start, end });
                drawLadder(start, end);
                break;
            }
        } while (true);
    }
}

// Draw a snake on the board
function drawSnake(start, end) {
    const startCell = document.querySelector(`.cell[data-number="${start}"]`);
    const endCell = document.querySelector(`.cell[data-number="${end}"]`);
    
    if (!startCell || !endCell) return;
    
    const snakeElement = document.createElement('div');
    snakeElement.className = 'snake';
    
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
    
    const boardRect = boardElement.getBoundingClientRect();
    
    const startX = startRect.left + startRect.width / 2 - boardRect.left;
    const startY = startRect.top + startRect.height / 2 - boardRect.top;
    const endX = endRect.left + endRect.width / 2 - boardRect.left;
    const endY = endRect.top + endRect.height / 2 - boardRect.top;
    
    // Create a curved path for the snake
    const controlX1 = startX + (endX - startX) * 0.3;
    const controlY1 = startY + (endY - startY) * 0.7;
    const controlX2 = startX + (endX - startX) * 0.7;
    const controlY2 = startY + (endY - startY) * 0.3;
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", `0 0 ${boardRect.width} ${boardRect.height}`);
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M${startX},${startY} C${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`);
    path.setAttribute("class", "snake-path");
    
    svg.appendChild(path);
    snakeElement.appendChild(svg);
    boardElement.appendChild(snakeElement);
}

// Draw a ladder on the board
function drawLadder(start, end) {
    const startCell = document.querySelector(`.cell[data-number="${start}"]`);
    const endCell = document.querySelector(`.cell[data-number="${end}"]`);
    
    if (!startCell || !endCell) return;
    
    const ladderElement = document.createElement('div');
    ladderElement.className = 'ladder';
    
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
    
    const boardRect = boardElement.getBoundingClientRect();
    
    const startX = startRect.left + startRect.width / 2 - boardRect.left;
    const startY = startRect.top + startRect.height / 2 - boardRect.top;
    const endX = endRect.left + endRect.width / 2 - boardRect.left;
    const endY = endRect.top + endRect.height / 2 - boardRect.top;
    
    // Calculate ladder sides (slightly offset from center)
    const offset = 10;
    const angle = Math.atan2(endY - startY, endX - startX);
    const sideOffsetX = offset * Math.sin(angle);
    const sideOffsetY = offset * Math.cos(angle);
    
    const leftStartX = startX - sideOffsetX;
    const leftStartY = startY + sideOffsetY;
    const leftEndX = endX - sideOffsetX;
    const leftEndY = endY + sideOffsetY;
    
    const rightStartX = startX + sideOffsetX;
    const rightStartY = startY - sideOffsetY;
    const rightEndX = endX + sideOffsetX;
    const rightEndY = endY - sideOffsetY;
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", `0 0 ${boardRect.width} ${boardRect.height}`);
    
    // Draw ladder sides
    const leftSide = document.createElementNS("http://www.w3.org/2000/svg", "path");
    leftSide.setAttribute("d", `M${leftStartX},${leftStartY} L${leftEndX},${leftEndY}`);
    leftSide.setAttribute("class", "ladder-path");
    
    const rightSide = document.createElementNS("http://www.w3.org/2000/svg", "path");
    rightSide.setAttribute("d", `M${rightStartX},${rightStartY} L${rightEndX},${rightEndY}`);
    rightSide.setAttribute("class", "ladder-path");
    
    svg.appendChild(leftSide);
    svg.appendChild(rightSide);
    
    // Draw ladder rungs (5 rungs)
    const rungCount = 5;
    for (let i = 0; i <= rungCount; i++) {
        const t = i / rungCount;
        const rungX1 = leftStartX + (leftEndX - leftStartX) * t;
        const rungY1 = leftStartY + (leftEndY - leftStartY) * t;
        const rungX2 = rightStartX + (rightEndX - rightStartX) * t;
        const rungY2 = rightStartY + (rightEndY - rightStartY) * t;
        
        const rung = document.createElementNS("http://www.w3.org/2000/svg", "line");
        rung.setAttribute("x1", rungX1);
        rung.setAttribute("y1", rungY1);
        rung.setAttribute("x2", rungX2);
        rung.setAttribute("y2", rungY2);
        rung.setAttribute("class", "ladder-rung");
        
        svg.appendChild(rung);
    }
    
    ladderElement.appendChild(svg);
    boardElement.appendChild(ladderElement);
}

// Initialize players
function initializePlayers(count) {
    players = [];
    playerPositions = [];
    
    for (let i = 0; i < count; i++) {
        players.push({
            id: i + 1,
            name: `Player ${i + 1}`,
            color: playerColors[i % playerColors.length],
            position: 0
        });
        
        playerPositions[i] = 0;
    }
    
    updatePlayerInfo();
    renderPlayers();
}

// Update player information display
function updatePlayerInfo() {
    playerInfoElement.innerHTML = '';
    
    players.forEach((player, index) => {
        const playerElement = document.createElement('div');
        playerElement.innerHTML = `
            <span style="color: ${player.color}; ${index === currentPlayerIndex ? 'font-weight: bold;' : ''}">
                ${player.name} (Position: ${player.position})
            </span>
        `;
        playerInfoElement.appendChild(playerElement);
    });
}

// Render players on the board
function renderPlayers() {
    // Clear all player markers
    document.querySelectorAll('.player').forEach(el => el.remove());
    
    // Group players by position
    const playersByPosition = {};
    players.forEach((player, index) => {
        if (player.position > 0 && player.position <= boardSize) {
            if (!playersByPosition[player.position]) {
                playersByPosition[player.position] = [];
            }
            playersByPosition[player.position].push(player);
        }
    });
    
    // Render players at each position
    for (const [position, playersAtPosition] of Object.entries(playersByPosition)) {
        const cell = document.querySelector(`.cell[data-number="${position}"]`);
        if (cell) {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexWrap = 'wrap';
            container.style.justifyContent = 'center';
            
            playersAtPosition.forEach(player => {
                const playerElement = document.createElement('div');
                playerElement.className = 'player';
                playerElement.style.backgroundColor = player.color;
                container.appendChild(playerElement);
            });
            
            cell.appendChild(container);
        }
    }
}

// Roll the dice
function rollDice() {
    rollDiceButton.disabled = true;
    diceElement.textContent = '...';
    
    // Simple dice roll animation
    let rolls = 0;
    const maxRolls = 5;
    const rollInterval = setInterval(() => {
        diceElement.textContent = Math.floor(Math.random() * 6) + 1;
        rolls++;
        
        if (rolls >= maxRolls) {
            clearInterval(rollInterval);
            const diceValue = Math.floor(Math.random() * 6) + 1;
            diceElement.textContent = diceValue;
            movePlayer(diceValue);
        }
    }, 100);
}

// Move the current player
function movePlayer(steps) {
    const currentPlayer = players[currentPlayerIndex];
    let newPosition = currentPlayer.position + steps;
    
    // Check if player won
    if (newPosition >= boardSize) {
        newPosition = boardSize;
        statusElement.textContent = `${currentPlayer.name} wins!`;
        rollDiceButton.disabled = true;
        
        // Show winning player
        currentPlayer.position = newPosition;
        updatePlayerInfo();
        renderPlayers();
        return;
    }
    
    // Check for snakes
    const snake = snakes.find(s => s.start === newPosition);
    if (snake) {
        statusElement.textContent = `${currentPlayer.name} got bitten by a snake! Sliding down from ${newPosition} to ${snake.end}`;
        newPosition = snake.end;
    }
    
    // Check for ladders
    const ladder = ladders.find(l => l.start === newPosition);
    if (ladder) {
        statusElement.textContent = `${currentPlayer.name} found a ladder! Climbing up from ${newPosition} to ${ladder.end}`;
        newPosition = ladder.end;
    }
    
    // Update player position
    currentPlayer.position = newPosition;
    playerPositions[currentPlayerIndex] = newPosition;
    
    // Update display
    updatePlayerInfo();
    renderPlayers();
    
    // Move to next player
    if (newPosition !== boardSize) {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        statusElement.textContent = `${players[currentPlayerIndex].name}'s turn`;
        rollDiceButton.disabled = false;
    }
}

// Start the game
function startGame() {
    const playerCount = parseInt(playerCountInput.value);
    
    if (playerCount < 2 || playerCount > 6) {
        alert('Please enter a number between 2 and 6');
        return;
    }
    
    initializeBoard();
    generateSnakesAndLadders();
    initializePlayers(playerCount);
    
    gameStarted = true;
    currentPlayerIndex = 0;
    rollDiceButton.disabled = false;
    startGameButton.disabled = true;
    playerCountInput.disabled = true;
    
    statusElement.textContent = `${players[currentPlayerIndex].name}'s turn`;
}

// Event listeners
startGameButton.addEventListener('click', startGame);
rollDiceButton.addEventListener('click', rollDice);

// Initialize the board on load
initializeBoard();