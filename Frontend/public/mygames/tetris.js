document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetris');
    const context = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    const linesElement = document.getElementById('lines');

    context.scale(30, 30);

    const arena = createMatrix(12, 20);
    const player = {
        pos: {x: 0, y: 0},
        matrix: null,
        score: 0,
        level: 1,
        lines: 0,
        dropCounter: 0,
        dropInterval: 1000
    };

    const colors = [
        null,
        '#FF0D72', // I
        '#0DC2FF', // J
        '#0DFF72', // L
        '#F538FF', // O
        '#FF8E0D', // S
        '#FFE138', // T
        '#3877FF'  // Z
    ];

    const pieces = [
        null,
        [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], // I
        [[2, 0, 0], [2, 2, 2], [0, 0, 0]],                         // J
        [[0, 0, 3], [3, 3, 3], [0, 0, 0]],                         // L
        [[0, 4, 4], [0, 4, 4], [0, 0, 0]],                         // O
        [[0, 5, 5], [5, 5, 0], [0, 0, 0]],                         // S
        [[0, 6, 0], [6, 6, 6], [0, 0, 0]],                         // T
        [[7, 7, 0], [0, 7, 7], [0, 0, 0]]                          // Z
    ];

    let lastTime = 0;
    let gameOver = false;
    let isPaused = false;

    function update(time = 0) {
        if (gameOver || isPaused) return;

        const deltaTime = time - lastTime;
        lastTime = time;

        player.dropCounter += deltaTime;
        if (player.dropCounter > player.dropInterval) {
            playerDrop();
        }

        draw();
        requestAnimationFrame(update);
    }

    function draw() {
        context.fillStyle = '#111';
        context.fillRect(0, 0, canvas.width, canvas.height);

        drawMatrix(arena, {x: 0, y: 0});
        drawMatrix(player.matrix, player.pos);
    }

    function drawMatrix(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    context.fillStyle = colors[value];
                    context.fillRect(x + offset.x, y + offset.y, 1, 1);
                    context.strokeStyle = '#000';
                    context.lineWidth = 0.05;
                    context.strokeRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
    }

    function createMatrix(w, h) {
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    }

    function playerReset() {
        const pieceId = Math.floor(Math.random() * 7) + 1;
        player.matrix = pieces[pieceId];
        player.pos.y = 0;
        player.pos.x = Math.floor(arena[0].length / 2) - Math.floor(player.matrix[0].length / 2);

        if (collide(arena, player)) {
            gameOver = true;
            alert('Game Over! Your score: ' + player.score);
            arena.forEach(row => row.fill(0));
            player.score = 0;
            player.level = 1;
            player.lines = 0;
            player.dropInterval = 1000;
            updateScore();
            gameOver = false;
        }
    }

    function playerDrop() {
        player.pos.y++;
        if (collide(arena, player)) {
            player.pos.y--;
            merge(arena, player);
            playerReset();
            arenaSweep();
            updateScore();
        }
        player.dropCounter = 0;
    }

    function playerMove(dir) {
        player.pos.x += dir;
        if (collide(arena, player)) {
            player.pos.x -= dir;
        }
    }

    function playerRotate(dir) {
        const pos = player.pos.x;
        let offset = 1;
        rotate(player.matrix, dir);
        
        while (collide(arena, player)) {
            player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > player.matrix[0].length) {
                rotate(player.matrix, -dir);
                player.pos.x = pos;
                return;
            }
        }
    }

    function rotate(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
        }

        if (dir > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }

    function collide(arena, player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 &&
                    (arena[y + o.y] &&
                    arena[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    function merge(arena, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    arena[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    }

    function arenaSweep() {
        let linesCleared = 0;
        outer: for (let y = arena.length - 1; y >= 0; y--) {
            for (let x = 0; x < arena[y].length; x++) {
                if (arena[y][x] === 0) {
                    continue outer;
                }
            }

            const row = arena.splice(y, 1)[0].fill(0);
            arena.unshift(row);
            y++;
            linesCleared++;
        }

        if (linesCleared > 0) {
            player.lines += linesCleared;
            player.score += calculateScore(linesCleared, player.level);
            if (player.lines >= player.level * 10) {
                player.level++;
                player.dropInterval = Math.max(100, player.dropInterval - 100);
            }
        }
    }

    function calculateScore(lines, level) {
        const points = [0, 40, 100, 300, 1200];
        return points[lines] * level;
    }

    function updateScore() {
        scoreElement.textContent = player.score;
        levelElement.textContent = player.level;
        linesElement.textContent = player.lines;
    }

    function playerHardDrop() {
        while (!collide(arena, player)) {
            player.pos.y++;
        }
        player.pos.y--;
        playerDrop();
    }

    document.addEventListener('keydown', event => {
        if (gameOver) return;

        if (event.keyCode === 80) { // P key
            isPaused = !isPaused;
            if (!isPaused) {
                lastTime = 0;
                update();
            }
            return;
        }

        if (isPaused) return;

        switch (event.keyCode) {
            case 37: // Left arrow
                playerMove(-1);
                break;
            case 39: // Right arrow
                playerMove(1);
                break;
            case 40: // Down arrow
                playerDrop();
                break;
            case 38: // Up arrow
                playerRotate(1);
                break;
            case 32: // Space
                playerHardDrop();
                break;
        }
    });

    playerReset();
    update();
});