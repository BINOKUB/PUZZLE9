document.addEventListener('DOMContentLoaded', () => {

    const appContainer = document.getElementById('app-container');
    
    let settings = {};
    let timerInterval = null;
    let score = 0;
    let selectedCell = null;
    let gameBoard = [];
    let baseCounts = {};
    let solutionBoard = []; // Ajouté pour la logique de jeu complète

    function showConfigScreen() {
        clearInterval(timerInterval);
        appContainer.innerHTML = `
            <div id="config-container" class="container text-center my-4">
                <h1 class="mb-3">Logibase 9</h1>
                <div class="my-3">
                    <h5>Mode de temps :</h5>
                    <div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="timerMode" id="timer-passive" value="PASSIVE" checked><label class="form-check-label" for="timer-passive">Passif</label></div>
                    <div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="timerMode" id="timer-active" value="TIMED"><label class="form-check-label" for="timer-active">Contre la montre</label></div>
                </div>
                <div id="timed-options" class="my-3 hidden">
                    <h5>Difficulté du temps :</h5>
                    <div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="timedDifficulty" id="timed-easy" value="DEBUTANT"><label class="form-check-label" for="timed-easy">Débutant</label></div>
                    <div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="timedDifficulty" id="timed-medium" value="INTERMEDIAIRE" checked><label class="form-check-label" for="timed-medium">Intermédiaire</label></div>
                    <div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="timedDifficulty" id="timed-hard" value="DIFFICILE"><label class="form-check-label" for="timed-hard">Difficile</label></div>
                </div>
                <button id="start-btn" class="btn btn-primary btn-lg">Jouer</button>
            </div>`;
        
        const timerModeRadios = document.querySelectorAll('input[name="timerMode"]');
        const timedOptions = document.getElementById('timed-options');
        timerModeRadios.forEach(radio => {
            radio.addEventListener('change', (event) => {
                if (event.target.value === 'TIMED') {
                    timedOptions.classList.remove('hidden');
                } else {
                    timedOptions.classList.add('hidden');
                }
            });
        });

        document.getElementById('start-btn').addEventListener('click', () => {
            settings = {
                timerMode: document.querySelector('input[name="timerMode"]:checked').value,
                timedDifficulty: document.querySelector('input[name="timedDifficulty"]:checked').value
            };
            showGameScreen();
        });
    }

    function showGameScreen() {
        appContainer.innerHTML = `
            <div id="game-container" class="container text-center my-4">
                <h1 class="mb-3">Logibase 9</h1>
                <div id="game-info" class="row my-3 fs-5">
                    <div id="score-display" class="col text-start">Score : 0</div>
                    <div id="timer-display" class="col text-end">Temps : 0:00</div>
                </div>
                <div id="game-grid"></div>
                <div id="base-counters" class="mt-3"></div>
                <div id="game-controls" class="d-grid gap-2 col-6 mx-auto mt-4">
                    <button id="replay-btn" class="btn btn-primary">Rejouer</button>
                    <button id="help-btn" class="btn btn-secondary">Comment Jouer</button>
                </div>
            </div>`;

        document.getElementById('replay-btn').addEventListener('click', showConfigScreen);
        document.getElementById('help-btn').addEventListener('click', () => {
            alert("Cliquez sur un numéro dans la grille, puis sur la base correspondante en dessous.\n\nLa base d'un numéro s'obtient en additionnant ses chiffres jusqu'à n'en avoir qu'un seul (ex: 69 -> 6+9=15 -> 1+5=6. La base est 6).");
        });

        startNewGame();
    }

    function getBase(number) { let sNumber = number.toString(); while (sNumber.length > 1) { let sum = 0; for (const char of sNumber) { sum += parseInt(char, 10); } sNumber = sum.toString(); } return parseInt(sNumber, 10); }
    function generateValidNumber() { let number; do { number = Math.floor(Math.random() * (999 - 111 + 1)) + 111; } while (number.toString().includes('0')); return number; }
    
    function renderGrid() {
        const gridContainer = document.getElementById('game-grid');
        gridContainer.innerHTML = '';
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.dataset.row = r; cell.dataset.col = c;
                cell.textContent = gameBoard[r][c];
                cell.addEventListener('click', () => onCellClick(cell, r, c));
                gridContainer.appendChild(cell);
            }
        }
    }

    function renderBaseCounters() {
        const baseCountersContainer = document.getElementById('base-counters');
        baseCountersContainer.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            const counter = document.createElement('div');
            counter.classList.add('base-counter');
            counter.dataset.base = i;
            counter.textContent = `${i} / ${baseCounts[i]}`;
            counter.addEventListener('click', () => onBaseClick(i));
            baseCountersContainer.appendChild(counter);
        }
    }

    function updateDisplay(time) {
        document.getElementById('score-display').textContent = `Score : ${score}`;
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const timerDisplay = document.getElementById('timer-display');
        if (settings.timerMode === 'TIMED') {
            timerDisplay.textContent = `Temps Restant : ${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else {
            timerDisplay.textContent = `Temps : ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    function onCellClick(cellElement, row, col) {
        if (cellElement.classList.contains('played-correct') || cellElement.classList.contains('played-error')) return;
        if (selectedCell) { selectedCell.element.classList.remove('selected'); }
        cellElement.classList.add('selected');
        selectedCell = { element: cellElement, number: gameBoard[row][col], row: row, col: col };
    }

    function onBaseClick(base) {
        if (!selectedCell) return;
        const correctBase = getBase(selectedCell.number);
        if (base === correctBase) {
            score += 50;
            baseCounts[base]++;
            selectedCell.element.classList.add('played-correct', `played-correct-${base}`);
        } else {
            score -= 100;
            selectedCell.element.classList.add('played-error');
        }
        selectedCell.element.classList.remove('selected');
        selectedCell = null;
        updateDisplay(settings.timerMode === 'TIMED' ? (81 * 2) - Object.values(baseCounts).reduce((s, c) => s + c, 0) : Object.values(baseCounts).reduce((s, c) => s + c, 0)); // Approximation
        renderBaseCounters();
        checkWinCondition();
    }

    function checkWinCondition() {
        const totalPlayed = Object.values(baseCounts).reduce((sum, count) => sum + count, 0);
        if (totalPlayed === 81) {
            clearInterval(timerInterval);
            alert(`Partie terminée !\nScore Final : ${score}`);
        }
    }

    function startNewGame() {
        clearInterval(timerInterval);
        score = 0;
        let time = 0;
        selectedCell = null;
        baseCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
        gameBoard = [];
        for (let r = 0; r < 9; r++) {
            const row = [];
            for (let c = 0; c < 9; c++) { row.push(generateValidNumber()); }
            gameBoard.push(row);
        }
        updateDisplay(time);
        renderGrid();
        renderBaseCounters();
        if (settings.timerMode === 'TIMED') {
            const timePerCell = { "DEBUTANT": 5, "INTERMEDIAIRE": 3.5, "DIFFICILE": 2 };
            time = 81 * timePerCell[settings.timedDifficulty];
            timerInterval = setInterval(() => {
                time--;
                updateDisplay(time);
                if (time <= 0) {
                    clearInterval(timerInterval);
                    alert("Temps écoulé ! Game Over.");
                }
            }, 1000);
        } else {
            timerInterval = setInterval(() => {
                time++;
                updateDisplay(time);
            }, 1000);
        }
    }

    showConfigScreen();
});