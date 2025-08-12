// REV 12.1
document.addEventListener('DOMContentLoaded', () => {

    // --- Références aux éléments HTML ---
    const configScreen = document.getElementById('config-screen');
    const gameScreen = document.getElementById('game-screen');
    const startBtn = document.getElementById('start-btn');
    const gridContainer = document.getElementById('game-grid');
    const infoText = document.getElementById('info-text');
    const menuBtn = document.getElementById('menu-btn');
    const solutionBtn = document.getElementById('solution-btn');
    const hintBtn = document.getElementById('hint-btn');
    const helpBtn = document.getElementById('help-btn');
    const fontBtn = document.getElementById('font-btn');
    const soundBtn = document.getElementById('sound-btn');
    const infoLeftContainer = document.getElementById('info-left-container');
    const infoRightContainer = document.getElementById('info-right-container');
    const gameModeDisplay = document.getElementById('game-mode-display');
    
    // --- Variables de jeu globales ---
    let settings = {};
    let solutionBoard = [], gameBoard = [], playableSuites = new Set();
    let selectedCell = null;
    let score = 0, timeElapsed = 0, lockedCells = new Set(), movesRemaining = 0, isGameOver = false, showSolution = false;
    let timerInterval = null;
    let isSoundOn = true;
    const fontSizes = [{size: '16px', label: 'Petit'}, {size: '22px', label: 'Moyen'}, {size: '28px', label: 'Gros'}];
    let currentFontIndex = 1;

    const sounds = {
        clic: new Audio('clic.mp3'),
        ding: new Audio('ding.mp3'),
        victory: new Audio('victory.mp3'),
        incorrect: new Audio('incorrect.mp3'),
        gameover: new Audio('gameover.mp3')
    };

    const HELP_TEXT = `COMMENT JOUER (RÉSUMÉ)
Le but est de placer chaque numéro sur sa case finale correcte.

- Bordure VERTE = Numéro bien placé.
- Bordure ROUGE = Numéro mal placé.
- Sélectionnez un numéro, puis cliquez sur une case pour le déplacer.
- Si une case est occupée, vous pouvez échanger les deux numéros.

-----------------------------------------

EXPLICATION DÉTAILLÉE

1. Les Bases (Les Colonnes)
Chaque numéro appartient à une "Base" de 1 à 9 (ex: 68 -> 6+8=14 -> 1+4=5. Base 5). La couleur du numéro vous indique sa Base, et sa Base détermine sa colonne finale.

2. Les Suites (La Logique de la Grille)
La grille suit une logique : +9 de haut en bas, et +1 de gauche à droite.

-----------------------------------------

MODES DE JEU

Mode Survie :
- Déplacement correct : +150 points (ou +75 si une case est déjà verrouillée).
- Déplacement incorrect : -50 points et la case de départ est verrouillée 🔒.
- Un 2ème déplacement incorrect : GAME OVER.

Mode Coups Limités :
- Le but est de finir le puzzle avec le budget de coups alloué.
- Un mauvais coup coûte 1 coup et des points.
- Un "échange parfait" est un coup gratuit et donne un bonus de points !`;


    function playSound(sound) { if (isSoundOn && sounds[sound]) { sounds[sound].play(); } }

    const DIFFICULTY_LEVELS = { "Facile": 0.60, "Moyen": 0.75, "Difficile": 0.90 };

    // --- LOGIQUE DE NAVIGATION ---
    startBtn.addEventListener('click', () => {
        settings = {
            gridSize: parseInt(document.querySelector('input[name="gridSize"]:checked').value, 10),
            difficulty: document.querySelector('input[name="difficulty"]:checked').value,
            gameMode: document.querySelector('input[name="gameMode"]:checked').value
        };
        configScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        startNewGame();
    });

    menuBtn.addEventListener('click', () => {
        gameScreen.classList.add('hidden');
        configScreen.classList.remove('hidden');
        clearInterval(timerInterval);
    });
    
    solutionBtn.addEventListener('click', () => {
        showSolution = !showSolution;
        solutionBtn.textContent = showSolution ? 'Jouer' : 'Solution';
        renderBoard();
    });

    soundBtn.addEventListener('click', () => {
        isSoundOn = !isSoundOn;
        soundBtn.textContent = isSoundOn ? 'Son 🔊' : 'Son 🔇';
    });

    fontBtn.addEventListener('click', () => {
        currentFontIndex = (currentFontIndex + 1) % fontSizes.length;
        infoText.textContent = `Police : ${fontSizes[currentFontIndex].label}`;
        renderBoard();
    });
    
    helpBtn.addEventListener('click', () => {
        alert(HELP_TEXT);
    });

    hintBtn.addEventListener('click', () => {
        if (!selectedCell) {
            infoText.textContent = "Sélectionnez un numéro pour avoir un indice.";
            return;
        }
        const numToFind = gameBoard[selectedCell.row][selectedCell.col];
        for (let r = 0; r < settings.gridSize; r++) {
            for (let c = 0; c < settings.gridSize; c++) {
                if (solutionBoard[r][c] === numToFind) {
                    const hintCell = document.getElementById(`cell-${r}-${c}`);
                    if(hintCell) {
                        hintCell.classList.add('hint');
                        setTimeout(() => {
                            hintCell.classList.remove('hint');
                        }, 1000);
                    }
                    return;
                }
            }
        }
    });

    // --- FONCTIONS DE LOGIQUE PURE ---
    function getBase(number) { if (number === 0) return 0; let sNumber = number.toString(); while (sNumber.length > 1) { let sum = 0; for (const char of sNumber) { sum += parseInt(char, 10); } sNumber = sum.toString(); } return parseInt(sNumber, 10); }
    function generateSolution() { const board = Array(settings.gridSize).fill(0).map(() => Array(settings.gridSize).fill(0)); let startNum = Math.floor(Math.random() * (100 - 50 + 1)) + 50; while (getBase(startNum) !== 1) { startNum++; } for (let r = 0; r < settings.gridSize; r++) { for (let c = 0; c < settings.gridSize; c++) { board[r][c] = startNum + (r * 9) + c; } } return board; }
    function checkWinCondition() { for (let r = 0; r < settings.gridSize; r++) { for (let c = 0; c < settings.gridSize; c++) { const sNum = solutionBoard[r][c]; const pNum = gameBoard[r][c]; if (playableSuites.has(sNum)) { if (pNum !== sNum) return false; } else { if (pNum !== 0) return false; } } } return true; }

    // --- FONCTIONS DU JEU ---
    function renderBoard() {
        gridContainer.innerHTML = '';
        const cellSize = settings.gridSize === 4 ? 60 : (settings.gridSize === 6 ? 50 : 40);
        gridContainer.style.gridTemplateColumns = `repeat(${settings.gridSize}, ${cellSize}px)`;
        const boardToShow = showSolution ? solutionBoard : gameBoard;
        for (let r = 0; r < settings.gridSize; r++) {
            for (let c = 0; c < settings.gridSize; c++) {
                const cell = document.createElement('div');
                cell.style.width = `${cellSize}px`; cell.style.height = `${cellSize}px`;
                cell.style.fontSize = fontSizes[currentFontIndex].size;
                cell.id = `cell-${r}-${c}`;
                cell.addEventListener('click', () => onCellClick(r, c));
                const number = boardToShow[r][c];
                cell.className = 'grid-cell';
                if (number === 0) { cell.classList.add('empty'); } 
                else {
                    cell.textContent = number;
                    cell.classList.add(`base-${getBase(number)}`);
                    if (number === solutionBoard[r][c]) { cell.classList.add('correct'); } 
                    else { cell.classList.add('wrong'); }
                }
                if (selectedCell && selectedCell.row === r && selectedCell.col === c && !showSolution) { cell.classList.add('selected'); }
                if (lockedCells.has(`${r}-${c}`)) { cell.classList.add('locked'); }
                gridContainer.appendChild(cell);
            }
        }
    }
    
    function updateInfoDisplay() {
        if (settings.gameMode === 'SURVIE') {
            infoLeftContainer.textContent = `Temps : ${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}`;
            infoRightContainer.textContent = `Score : ${score}`;
        } else {
            infoLeftContainer.textContent = `Score : ${score}`;
            infoRightContainer.textContent = `Coups Restants : ${movesRemaining}`;
        }
    }

    function onCellClick(row, col) {
        if (isGameOver || showSolution) return;
        if (lockedCells.has(`${row}-${col}`)) { infoText.textContent = "Cette case est verrouillée !"; return; }
        const clickedNumber = gameBoard[row][col];
        if (selectedCell) {
            const selectedRow = selectedCell.row;
            const selectedCol = selectedCell.col;
            if (lockedCells.has(`${selectedRow}-${selectedCol}`)) { selectedCell = null; renderBoard(); return; }
            const selectedNumber = gameBoard[selectedRow][selectedCol];
            const isValidMove = selectedNumber === solutionBoard[row][col];
            let moveMade = false;

            if (isValidMove) {
                moveMade = true;
                if (clickedNumber !== 0) { gameBoard[selectedRow][selectedCol] = clickedNumber; gameBoard[row][col] = selectedNumber; } 
                else { gameBoard[row][col] = selectedNumber; gameBoard[selectedRow][selectedCol] = 0; }
            }
            
            if (settings.gameMode === 'SURVIE') {
                if (isValidMove) { score += lockedCells.size > 0 ? 75 : 150; infoText.textContent = `Bien joué !`; playSound('ding'); } 
                else {
                    if (lockedCells.size > 0) { isGameOver = true; playSound('gameover'); } 
                    else { score -= 50; lockedCells.add(`${selectedRow}-${selectedCol}`); infoText.textContent = "Erreur ! Case verrouillée."; playSound('incorrect'); }
                }
            } else { // Mode Coups Limités
                const isPerfectSwap = (isValidMove && clickedNumber !== 0 && clickedNumber === solutionBoard[selectedRow][selectedCol]);
                if (!isPerfectSwap) { movesRemaining--; } 
                else { score += 400; }
                score += isValidMove ? 100 : -100;
                infoText.textContent = isValidMove ? "Bien joué !" : "Erreur ! -1 coup.";
                if(isValidMove) playSound('ding'); else playSound('incorrect');
            }
            
            selectedCell = null;
            updateInfoDisplay();
            renderBoard();

            if (moveMade && checkWinCondition()) {
                clearInterval(timerInterval);
                playSound('victory');
                const penalty = lockedCells.size > 0 ? ' (avec pénalité)' : '';
                setTimeout(() => {
                    alert(`Félicitations !\nScore: ${score}${penalty}`);
                    startNewGame();
                }, 100);
            } else if (isGameOver || (settings.gameMode === 'COUPS_LIMITES' && movesRemaining <= 0)) {
                clearInterval(timerInterval);
                isGameOver = true;
                infoText.textContent = "GAME OVER";
                playSound('gameover');
                setTimeout(() => {
                    alert(movesRemaining <= 0 ? "Vous n'avez plus de coups !" : "GAME OVER !");
                    startNewGame();
                }, 100);
            }
        } else {
            if (clickedNumber !== 0) {
                selectedCell = { row, col };
                infoText.textContent = `Numéro ${clickedNumber} sélectionné.`;
                playSound('clic');
                renderBoard();
            }
        }
    }
    
    function startNewGame() {
        clearInterval(timerInterval);
        gameModeDisplay.textContent = `Mode : ${settings.gameMode === 'SURVIE' ? 'Survie' : 'Coups Limités'}`;
        solutionBoard = generateSolution();
        const flatSolution = solutionBoard.flat();
        const numSuites = Math.floor((settings.gridSize * settings.gridSize) * DIFFICULTY_LEVELS[settings.difficulty]);
        playableSuites = new Set(flatSolution.sort(() => 0.5 - Math.random()).slice(0, numSuites));
        let gameBoardItems = [...playableSuites];
        while (gameBoardItems.length < settings.gridSize * settings.gridSize) { gameBoardItems.push(0); }
        gameBoardItems.sort(() => 0.5 - Math.random());
        gameBoard = [];
        while(gameBoardItems.length) gameBoard.push(gameBoardItems.splice(0, settings.gridSize));
        selectedCell = null; score = 0; timeElapsed = 0; lockedCells = new Set(); isGameOver = false; showSolution = false;
        solutionBtn.textContent = 'Solution';
        if (settings.gameMode === 'COUPS_LIMITES') {
            let misplaced = 0;
            for(let r=0; r<settings.gridSize; r++) for(let c=0; c<settings.gridSize; c++) if(gameBoard[r][c] !== 0 && gameBoard[r][c] !== solutionBoard[r][c]) misplaced++;
            const buffer = {"Facile":5, "Moyen":3, "Difficile":1}[settings.difficulty];
            movesRemaining = misplaced + buffer;
        }
        infoText.textContent = "Nouvelle partie !";
        updateInfoDisplay();
        renderBoard();
        if (settings.gameMode === 'SURVIE') {
            timerInterval = setInterval(() => { if (!isGameOver && !showSolution) { timeElapsed++; updateInfoDisplay(); } }, 1000);
        }
    }
});