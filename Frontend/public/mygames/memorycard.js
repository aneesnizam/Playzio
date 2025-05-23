document.addEventListener('DOMContentLoaded', () => {
    // Game state
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let totalPairs = 0;
    let gameStarted = false;
    let timer = null;
    let timeLeft = 0;
    let score = 0;
    let difficulty = '';
    
    // DOM elements
    const gameBoard = document.getElementById('game-board');
    const pairsFoundElement = document.getElementById('pairs-found');
    const timeLeftElement = document.getElementById('time-left');
    const scoreElement = document.getElementById('score');
    const messageElement = document.getElementById('message');
    const easyButton = document.getElementById('easy');
    const mediumButton = document.getElementById('medium');
    const hardButton = document.getElementById('hard');
    
    // Colors and shapes for the cards
    const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#F3FF33',
        '#FF33F3', '#33FFF3', '#8A2BE2', '#FF7F50',
        '#7FFFD4', '#D2691E', '#6495ED', '#DC143C',
        '#00FFFF', '#00008B', '#008B8B', '#B8860B'
    ];
    
    const shapes = [
        'circle', 'square', 'triangle', 'diamond',
        'pentagon', 'hexagon', 'star', 'heart',
        'oval', 'rectangle', 'trapezoid', 'parallelogram',
        'rhombus', 'cross', 'moon', 'cloud'
    ];
    
    // Event listeners for difficulty buttons
    easyButton.addEventListener('click', () => startGame(16));
    mediumButton.addEventListener('click', () => startGame(32));
    hardButton.addEventListener('click', () => startGame(64));
    
    function startGame(numCards) {
        // Reset game state
        clearInterval(timer);
        gameBoard.innerHTML = '';
        flippedCards = [];
        matchedPairs = 0;
        gameStarted = false;
        score = 0;
        
        // Set difficulty
        difficulty = getDifficulty(numCards);
        totalPairs = numCards / 2;
        
        // Update UI
        pairsFoundElement.textContent = '0';
        scoreElement.textContent = '0';
        messageElement.textContent = '';
        
        // Create cards
        createCards(numCards);
        
        // Show all cards for 5 seconds
        showAllCards();
        
        // Set time based on difficulty
        timeLeft = getTimeLimit(numCards);
        timeLeftElement.textContent = timeLeft;
        
        // Flip cards back after 5 seconds
        setTimeout(() => {
            flipAllCards(false);
            gameStarted = true;
            
            // Start timer
            timer = setInterval(() => {
                timeLeft--;
                timeLeftElement.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    endGame(false);
                }
            }, 1000);
        }, 5000);
    }
    
    function getDifficulty(numCards) {
        if (numCards === 16) return 'easy';
        if (numCards === 32) return 'medium';
        return 'hard';
    }
    
    function getTimeLimit(numCards) {
        if (numCards === 16) return 90; // 1.5 minutes
        if (numCards === 32) return 180; // 3 minutes
        return 300; // 5 minutes
    }
    
    function createCards(numCards) {
        cards = [];
        
        // Determine how many unique pairs we need
        const pairsNeeded = numCards / 2;
        const selectedColors = colors.slice(0, pairsNeeded);
        const selectedShapes = shapes.slice(0, pairsNeeded);
        
        // Create pairs
        for (let i = 0; i < pairsNeeded; i++) {
            cards.push({
                id: i * 2,
                color: selectedColors[i],
                shape: selectedShapes[i],
                matched: false
            });
            
            cards.push({
                id: i * 2 + 1,
                color: selectedColors[i],
                shape: selectedShapes[i],
                matched: false
            });
        }
        
        // Shuffle cards
        shuffleArray(cards);
        
        // Create card elements
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.index = index;
            
            // Front face (with shape)
            const frontFace = document.createElement('div');
            frontFace.className = 'card-face card-front';
            frontFace.style.backgroundColor = card.color;
            
            const shapeElement = document.createElement('div');
            shapeElement.className = `shape ${card.shape}`;
            shapeElement.style.backgroundColor = card.color;
            frontFace.appendChild(shapeElement);
            
            // Back face (cover)
            const backFace = document.createElement('div');
            backFace.className = 'card-face card-back';
            
            cardElement.appendChild(frontFace);
            cardElement.appendChild(backFace);
            
            cardElement.addEventListener('click', () => handleCardClick(index));
            gameBoard.appendChild(cardElement);
        });
        
        // Adjust grid columns based on difficulty
        if (numCards === 16) {
            gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        } else if (numCards === 32) {
            gameBoard.style.gridTemplateColumns = 'repeat(8, 1fr)';
        } else {
            gameBoard.style.gridTemplateColumns = 'repeat(8, 1fr)';
        }
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    function showAllCards() {
        const cardElements = document.querySelectorAll('.card');
        cardElements.forEach(card => {
            card.classList.add('flipped');
        });
    }
    
    function flipAllCards(flipToFront) {
        const cardElements = document.querySelectorAll('.card');
        cardElements.forEach((card, index) => {
            if (flipToFront || !cards[index].matched) {
                card.classList.remove('flipped');
            }
        });
    }
    
    function handleCardClick(index) {
        if (!gameStarted || cards[index].matched || flippedCards.length >= 2 || flippedCards.includes(index)) {
            return;
        }
        
        // Flip the card
        const cardElement = document.querySelector(`.card[data-index="${index}"]`);
        cardElement.classList.add('flipped');
        flippedCards.push(index);
        
        // Check for match if two cards are flipped
        if (flippedCards.length === 2) {
            const [firstIndex, secondIndex] = flippedCards;
            
            if (cards[firstIndex].color === cards[secondIndex].color && 
                cards[firstIndex].shape === cards[secondIndex].shape) {
                // Match found
                cards[firstIndex].matched = true;
                cards[secondIndex].matched = true;
                matchedPairs++;
                
                // Update score
                score += calculateScore(timeLeft);
                scoreElement.textContent = score;
                
                // Update pairs found
                pairsFoundElement.textContent = matchedPairs;
                
                // Check if game is won
                if (matchedPairs === totalPairs) {
                    endGame(true);
                }
                
                flippedCards = [];
            } else {
                // No match, flip back after delay
                setTimeout(() => {
                    const firstCard = document.querySelector(`.card[data-index="${firstIndex}"]`);
                    const secondCard = document.querySelector(`.card[data-index="${secondIndex}"]`);
                    
                    if (firstCard) firstCard.classList.remove('flipped');
                    if (secondCard) secondCard.classList.remove('flipped');
                    
                    flippedCards = [];
                }, 1000);
            }
        }
    }
    
    function calculateScore(timeRemaining) {
        const baseScore = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
        const timeBonus = Math.floor(timeRemaining / 10);
        return baseScore + timeBonus;
    }
    
    function endGame(isWin) {
        clearInterval(timer);
        gameStarted = false;
        
        if (isWin) {
            messageElement.textContent = `Congratulations! You won with a score of ${score}!`;
            messageElement.style.color = '#2ecc71';
        } else {
            messageElement.textContent = `Time's up! You found ${matchedPairs} of ${totalPairs} pairs.`;
            messageElement.style.color = '#e74c3c';
        }
        
        // Show all cards
        flipAllCards(true);
    }
    
    // CSS for shapes (injected via JavaScript)
    const style = document.createElement('style');
    style.textContent = `
        .circle {
            width: 80%;
            height: 80%;
            border-radius: 50%;
        }
        
        .square {
            width: 80%;
            height: 80%;
        }
        
        .triangle {
            width: 0;
            height: 0;
            border-left: 40px solid transparent;
            border-right: 40px solid transparent;
            border-bottom: 80px solid;
        }
        
        .diamond {
            width: 60%;
            height: 60%;
            transform: rotate(45deg);
        }
        
        .pentagon {
            width: 80%;
            height: 80%;
            clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
        }
        
        .hexagon {
            width: 80%;
            height: 80%;
            clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
        }
        
        .star {
            width: 80%;
            height: 80%;
            clip-path: polygon(
                50% 0%, 
                61% 35%, 
                98% 35%, 
                68% 57%, 
                79% 91%, 
                50% 70%, 
                21% 91%, 
                32% 57%, 
                2% 35%, 
                39% 35%
            );
        }
        
        .heart {
            width: 80%;
            height: 80%;
            position: relative;
            transform: rotate(45deg);
        }
        
        .heart:before, .heart:after {
            content: "";
            width: 80%;
            height: 80%;
            border-radius: 50%;
            position: absolute;
        }
        
        .heart:before {
            top: -40%;
            left: 0;
        }
        
        .heart:after {
            top: 0;
            left: -40%;
        }
        
        .oval {
            width: 60%;
            height: 80%;
            border-radius: 50%;
        }
        
        .rectangle {
            width: 60%;
            height: 80%;
        }
        
        .trapezoid {
            width: 80%;
            height: 60%;
            clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
        }
        
        .parallelogram {
            width: 80%;
            height: 60%;
            clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);
        }
        
        .rhombus {
            width: 60%;
            height: 60%;
            transform: skew(20deg);
        }
        
        .cross {
            width: 80%;
            height: 80%;
            position: relative;
        }
        
        .cross:before, .cross:after {
            content: "";
            position: absolute;
            background-color: inherit;
        }
        
        .cross:before {
            width: 100%;
            height: 30%;
            top: 35%;
            left: 0;
        }
        
        .cross:after {
            width: 30%;
            height: 100%;
            left: 35%;
            top: 0;
        }
        
        .moon {
            width: 80%;
            height: 80%;
            border-radius: 50%;
            box-shadow: -15px 0 0 0;
        }
        
        .cloud {
            width: 80%;
            height: 60%;
            position: relative;
        }
        
        .cloud:before, .cloud:after {
            content: "";
            position: absolute;
            border-radius: 50%;
            background-color: inherit;
        }
        
        .cloud:before {
            width: 50%;
            height: 100%;
            left: 25%;
            top: 0;
        }
        
        .cloud:after {
            width: 30%;
            height: 60%;
            left: 0;
            top: 20%;
        }
    `;
    document.head.appendChild(style);
});