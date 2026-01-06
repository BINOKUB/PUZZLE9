// BINOKUB PUZZLE 9 - VERSION DE LUXE (REV 12.5)
document.addEventListener('DOMContentLoaded', () => {
    // --- Éléments ---
    const configScreen = document.getElementById('config-screen');
    const gameScreen = document.getElementById('game-screen');
    const gridContainer = document.getElementById('game-grid');
    const statusMsg = document.getElementById('status-msg');
    
    // --- Variables ---
    let settings = {};
    let solutionBoard = [], gameBoard = [], playableSuites = new Set();
    let selectedCell = null;
    let score = 0, timeElapsed = 0, lockedCells = new Set(), movesRemaining = 0, isGameOver = false;
    let timerInterval = null;

    // --- Audio & Vibration ---
    const sounds = {
        clic: new Audio('clic.mp3'),
        ding: new Audio('ding.mp3'),
        victory: new Audio('victory.mp3'),
        incorrect: new Audio('incorrect.mp3'),
        gameover: new Audio('gameover.mp3')
    };

    function playAction(type) {
        if (sounds[type]) {
            sounds[type].currentTime = 0;
            sounds[type].play().catch(() => {}); // Évite les erreurs si les sons ne sont pas chargés
        }
        // Vibration haptique (si disponible sur Android)
        if (navigator.vibrate) {
            if (type === 'incorrect' || type === 'gameover') navigator.vibrate([100, 50, 100]);
            else navigator.vibrate(20);
        }
    }

    const DIFFICULTY_LEVELS = { "Facile": 0.60, "Moyen": 0.75, "Difficile": 0.90 };

    // --- Navigation ---
    document.getElementById('start-btn').addEventListener('click', () => {
        settings = {
            gridSize: parseInt(document.querySelector('input[name="gridSize"]:checked').value),
            difficulty: document.querySelector('input[name="difficulty"]:checked').value,
            gameMode: document.querySelector('input[name="gameMode"]:checked').value
        };
        configScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        startNewGame();
    });

    document.getElementById('menu-btn').addEventListener('click', () => {
        if(confirm("Quitter la partie ?")) {
            gameScreen.classList.add('hidden');
            configScreen.classList.remove('hidden');
            clearInterval(timerInterval);
        }
    });

    // --- Logique Mathématique ---
    function getBase(n) { 
        if (n === 0) return 0;
        return (n % 9 === 0) ? 9 : (n % 9);
    }

    function generateSolution() {
        const board = Array(settings.gridSize).fill(0).map(() => Array(settings.gridSize).fill(0));
        let startNum = Math.floor(Math.random() * 50) + 50;
        while (getBase(startNum) !== 1) startNum++;
        
        for (let r = 0; r < settings.gridSize; r++) {
            for (let c = 0; c < settings.gridSize; c++) {
                board[r][c] = startNum + (r * 9) + c;
            }
        }
        return board;
    }

    // --- Moteur du Jeu ---
    function renderBoard() {
        gridContainer.innerHTML = '';
        // Ajustement automatique de la taille des cellules selon la grille
        const gridW = Math.min(window.innerWidth - 40, 500);
        const cellSize = (gridW / settings.gridSize) - 6;
        
        gridContainer.style.gridTemplateColumns = `repeat(${settings.gridSize}, 1fr)`;
        gridContainer.style.width = `${gridW}px`;

        for (let r = 0; r < settings.gridSize; r++) {
            for (let c = 0; c < settings.gridSize; c++) {
                const num = gameBoard[r][c];
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.style.height = `${cellSize}px`;
                cell.style.fontSize = `${cellSize * 0.5}px`;
                
                if (num !== 0) {
                    cell.textContent = num;
                    cell.classList.add(`base-${getBase(num)}`);
                    // Feedback visuel direct
                    if (num === solutionBoard[r][c]) cell.classList.add('correct');
                    else cell.classList.add('wrong');
                } else {
                    cell.classList.add('empty');
                }

                if (selectedCell && selectedCell.row === r && selectedCell.col === c) {
                    cell.classList.add('selected');
                }
                
                if (lockedCells.has(`${r}-${c}`)) cell.classList.add('locked');

                cell.onclick = () => onCellClick(r, c);
                gridContainer.appendChild(cell);
            }
        }
    }

    function onCellClick(row, col) {
        if (isGameOver) return;
        if (lockedCells.has(`${row}-${col}`)) {
            statusMsg.textContent = "CASE VERROUILLÉE 🔒";
            playAction('incorrect');
            return;
        }

        const clickedNum = gameBoard[row][col];

        if (selectedCell) {
            const sR = selectedCell.row;
            const sC = selectedCell.col;
            const sNum = gameBoard[sR][sC];
            
            // Si on clique sur la même case, on désélectionne
            if (sR === row && sC === col) {
                selectedCell = null;
                renderBoard();
                return;
            }

            const isValid = (sNum === solutionBoard[row][col]);

            // Application de la logique selon le mode
            if (settings.gameMode === 'SURVIE') {
                if (isValid) {
                    score += lockedCells.size > 0 ? 75 : 150;
                    gameBoard[row][col] = sNum;
                    gameBoard[sR][sC] = clickedNum;
                    playAction('ding');
                } else {
                    if (lockedCells.size > 0) endGame(false);
                    else {
                        lockedCells.add(`${sR}-${sC}`);
                        score -= 50;
                        playAction('incorrect');
                        statusMsg.textContent = "ERREUR ! CASE VERROUILLÉE";
                    }
                }
            } else { // Coups Limités
                movesRemaining--;
                if (isValid) {
                    score += 100;
                    gameBoard[row][col] = sNum;
                    gameBoard[sR][sC] = clickedNum;
                    playAction('ding');
                } else {
                    score -= 50;
                    playAction('incorrect');
                }
                if (movesRemaining <= 0 && !checkWin()) endGame(false);
            }

            selectedCell = null;
            if (checkWin()) endGame(true);
            else {
                updateStats();
                renderBoard();
            }
        } else if (clickedNum !== 0) {
            selectedCell = { row, col };
            playAction('clic');
            renderBoard();
        }
    }

    function checkWin() {
        for (let r = 0; r < settings.gridSize; r++) {
            for (let c = 0; c < settings.gridSize; c++) {
                if (playableSuites.has(solutionBoard[r][c]) && gameBoard[r][c] !== solutionBoard[r][c]) return false;
            }
        }
        return true;
    }

    function updateStats() {
        const left = document.getElementById('info-left');
        const right = document.getElementById('info-right');
        if (settings.gameMode === 'SURVIE') {
            left.textContent = `⏱ ${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}`;
            right.textContent = `SCORE: ${score}`;
        } else {
            left.textContent = `SCORE: ${score}`;
            right.textContent = `COUPS: ${movesRemaining}`;
        }
    }

    function endGame(win) {
        isGameOver = true;
        clearInterval(timerInterval);
        if (win) {
            playAction('victory');
            statusMsg.textContent = "VICTOIRE !";
            alert(`BRAVO ! Score final : ${score}`);
        } else {
            playAction('gameover');
            statusMsg.textContent = "GAME OVER";
            alert("Partie terminée !");
        }
        startNewGame();
    }

    function startNewGame() {
        isGameOver = false;
        score = 0;
        timeElapsed = 0;
        lockedCells = new Set();
        solutionBoard = generateSolution();
        
        // Distribution des suites jouables
        const flatSolution = solutionBoard.flat();
        const count = Math.floor(flatSolution.length * DIFFICULTY_LEVELS[settings.difficulty]);
        playableSuites = new Set(flatSolution.sort(() => Math.random() - 0.5).slice(0, count));
        
        // Remplissage du plateau
        let items = [...playableSuites];
        while (items.length < settings.gridSize ** 2) items.push(0);
        items.sort(() => Math.random() - 0.5);
        
        gameBoard = [];
        for (let i = 0; i < settings.gridSize; i++) {
            gameBoard.push(items.splice(0, settings.gridSize));
        }

        if (settings.gameMode === 'COUPS_LIMITES') {
            movesRemaining = Math.floor(playableSuites.size * 1.5);
        }

        if (settings.gameMode === 'SURVIE') {
            timerInterval = setInterval(() => {
                timeElapsed++;
                updateStats();
            }, 1000);
        }

        statusMsg.textContent = "À VOUS DE JOUER !";
        updateStats();
        renderBoard();
    }
});
