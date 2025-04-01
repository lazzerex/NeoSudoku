class Sudoku {
    constructor() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = null;
        this.selectedCell = null;
        this.startTime = null;
        this.timerInterval = null;
        this.difficulty = 'easy';
        this.timerStarted = false;
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.generateBoard();
        this.renderBoard();
        document.getElementById('time').textContent = '0:00';
    }

    generateBoard() {
        // Generate a valid Sudoku solution
        this.solution = this.generateSolution();
        
        // Create the puzzle by removing numbers based on difficulty
        this.board = this.solution.map(row => [...row]);
        const cellsToRemove = {
            'easy': 40,
            'medium': 50,
            'hard': 60
        }[this.difficulty];

        let removed = 0;
        while (removed < cellsToRemove) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (this.board[row][col] !== 0) {
                this.board[row][col] = 0;
                removed++;
            }
        }
    }

    generateSolution() {
        const board = Array(9).fill().map(() => Array(9).fill(0));
        this.solveSudoku(board);
        return board;
    }

    solveSudoku(board) {
        const empty = this.findEmpty(board);
        if (!empty) return true;

        const [row, col] = empty;
        for (let num = 1; num <= 9; num++) {
            if (this.isValid(board, row, col, num)) {
                board[row][col] = num;
                if (this.solveSudoku(board)) return true;
                board[row][col] = 0;
            }
        }
        return false;
    }

    findEmpty(board) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) return [i, j];
            }
        }
        return null;
    }

    isValid(board, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num) return false;
        }

        // Check column
        for (let x = 0; x < 9; x++) {
            if (board[x][col] === num) return false;
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] === num) return false;
            }
        }

        return true;
    }

    renderBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                if (this.board[i][j] !== 0) {
                    cell.textContent = this.board[i][j];
                    cell.classList.add('initial');
                }

                if (this.selectedCell && 
                    this.selectedCell.row === i && 
                    this.selectedCell.col === j) {
                    cell.classList.add('selected');
                }

                boardElement.appendChild(cell);
            }
        }
    }

    setupEventListeners() {
        // Board cell selection
        document.getElementById('board').addEventListener('click', (e) => {
            const cell = e.target.closest('.cell');
            if (cell) {
                if (!cell.classList.contains('initial')) {
                    // For editable cells, select them
                    this.selectCell(parseInt(cell.dataset.row), parseInt(cell.dataset.col));
                } else if (cell.textContent) {
                    // For initial cells, just highlight matching numbers
                    this.clearHighlights();
                    this.highlightMatchingNumbers(cell.textContent);
                }
            }
        });

        // number pad with highlighting
        document.querySelectorAll('.number').forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('clear')) {
                    // Clear button
                    if (this.selectedCell) {
                        this.updateCell(0);
                        this.clearHighlights();
                    }
                } else {
                    // Number buttons
                    const value = parseInt(button.textContent);
                    
                    if (this.selectedCell) {
                        // If a cell is selected, update it
                        this.updateCell(value);
                    } else {
                        // If no cell is selected, just highlight matching numbers
                        this.highlightMatchingNumbers(value);
                    }
                }
            });
        });

        // New game button
        document.getElementById('new-game').addEventListener('click', () => {
            this.resetGame();
        });

        // Check solution button
        document.getElementById('check-solution').addEventListener('click', () => {
            this.checkSolution();
        });

        // Difficulty buttons
        document.querySelectorAll('.difficulty').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelector('.difficulty.active').classList.remove('active');
                button.classList.add('active');
                this.difficulty = button.dataset.level;
                this.resetGame();
            });
        });

        // Keyboard input
        document.addEventListener('keydown', (e) => {
            if (this.selectedCell) {
                const key = e.key;
                if (key >= '1' && key <= '9') {
                    this.updateCell(parseInt(key));
                } else if (key === 'Backspace' || key === 'Delete') {
                    this.updateCell(0);
                    this.clearHighlights();
                }
            }
        });
    }

    selectCell(row, col) {
        // If the same cell is clicked twice, deselect it
        if (this.selectedCell && this.selectedCell.row === row && this.selectedCell.col === col) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.classList.remove('selected');
            this.selectedCell = null;
            this.clearHighlights();
            return;
        }
        
        // Otherwise handle normal cell selection
        if (this.selectedCell) {
            const prevCell = document.querySelector(`[data-row="${this.selectedCell.row}"][data-col="${this.selectedCell.col}"]`);
            prevCell.classList.remove('selected');
        }

        this.selectedCell = { row, col };
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add('selected');
        
        // Highlight matching numbers if the cell has a value
        if (cell.textContent) {
            this.highlightMatchingNumbers(cell.textContent);
        } else {
            this.clearHighlights();
        }
    }

    updateCell(value) {
        if (!this.selectedCell) return;

        const { row, col } = this.selectedCell;
        this.board[row][col] = value;
        
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.textContent = value || '';
        cell.classList.remove('error');
        
        if (!this.timerStarted) {
            this.startTimer();
        }
        
        // Highlight matching numbers if a value was entered
        if (value) {
            this.highlightMatchingNumbers(value);
        } else {
            this.clearHighlights();
        }
    }

    checkSolution() {
        if (!this.timerStarted) {
            this.startTimer();
        }
        
        let hasError = false;
        let hasEmptyCells = false;
        const cells = document.querySelectorAll('.cell');
        
        // First, remove any existing error classes
        cells.forEach(cell => {
            cell.classList.remove('error');
        });

        // Check if the board is complete and correct
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const value = parseInt(cell.textContent) || 0;

            // Check for empty cells
            if (value === 0) {
                hasEmptyCells = true;
                cell.classList.add('error');
                
                // Remove the error class after animation completes
                setTimeout(() => {
                    cell.classList.remove('error');
                }, 1500);
                hasError = true;
            }
            // Check for incorrect values
            else if (value !== this.solution[row][col]) {
                cell.classList.add('error');
                hasError = true;
                
                // Remove the error class after animation completes
                setTimeout(() => {
                    cell.classList.remove('error');
                }, 1500);
            }
        });

        if (!hasError) {
            this.stopTimer();
            setTimeout(() => {
                alert('Congratulations! You solved the puzzle!');
            }, 100);
        }
    }

    startTimer() {
        if (!this.timerStarted) {
            this.timerStarted = true;
            this.startTime = Date.now();
            this.timerInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                document.getElementById('time').textContent = 
                    `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);
        }
    }

    stopTimer() {
        clearInterval(this.timerInterval);
    }

    resetGame() {
        this.stopTimer();
        this.timerStarted = false;
        this.selectedCell = null;
        this.clearHighlights();
        this.initializeGame();
    }

    highlightMatchingNumbers(number) {
        // Check if hints are enabled
        if (window.gameMenu && !window.gameMenu.hintsEnabled) {
            return;
        }
        
        // First clear any existing highlights
        this.clearHighlights();
        
        // Then highlight all matching cells
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            if (cell.textContent === number.toString()) {
                cell.classList.add('highlight-match');
            }
        });
    }

    clearHighlights() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('highlight-match');
        });
    }
}

class Menu {
    constructor(game) {
        this.game = game;
        this.menuPanel = document.querySelector('.menu-panel');
        this.menuOverlay = document.querySelector('.menu-overlay');
        this.menuBtn = document.getElementById('menu-btn');
        this.closeMenuBtn = document.getElementById('close-menu');
        this.hintsEnabled = true;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Menu open/close
        this.menuBtn.addEventListener('click', () => this.openMenu());
        this.closeMenuBtn.addEventListener('click', () => this.closeMenu());
        this.menuOverlay.addEventListener('click', () => this.closeMenu());

        // Menu items
        document.getElementById('new-game-menu').addEventListener('click', () => {
            this.game.resetGame();
            this.closeMenu();
        });

        document.getElementById('how-to-play').addEventListener('click', () => {
            this.showHowToPlay();
            this.closeMenu();
        });

        document.getElementById('toggle-theme').addEventListener('click', () => {
            this.toggleDarkMode();
            this.closeMenu();
        });

        document.getElementById('toggle-hints').addEventListener('click', () => {
            this.toggleHints();
            this.closeMenu();
        });

        document.getElementById('about-game').addEventListener('click', () => {
            this.showAbout();
            this.closeMenu();
        });

        // Back to home screen
        document.getElementById('back-to-home').addEventListener('click', () => {
            this.showHomeScreen();
            this.closeMenu();
        });
    }

    openMenu() {
        this.menuPanel.classList.add('active');
        this.menuOverlay.classList.add('active');
    }

    closeMenu() {
        this.menuPanel.classList.remove('active');
        this.menuOverlay.classList.remove('active');
    }

    showHowToPlay() {
        alert(
            "How to Play NeoSudoku:\n\n" +
            "1. Fill in the 9×9 grid so that each column, row, and 3×3 box contains the digits 1-9.\n" +
            "2. Click on an empty cell to select it.\n" +
            "3. Enter a number using the number pad or keyboard.\n" +
            "4. Click 'Check Solution' to verify your progress.\n" +
            "5. Start a new game anytime using the 'New Game' button.\n\n" +
            "Tips:\n" +
            "- Click any number to highlight all matching numbers.\n" +
            "- Click a cell twice to deselect it."
        );
    }

    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        // Store preference
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('neosudoku-dark-mode', isDarkMode);
    }

    toggleHints() {
        this.hintsEnabled = !this.hintsEnabled;
        
        if (!this.hintsEnabled) {
            // Clear any active highlights
            this.game.clearHighlights();
            document.getElementById('toggle-hints').textContent = "Enable Hints";
        } else {
            document.getElementById('toggle-hints').textContent = "Disable Hints";
        }
        
        // Store preference
        localStorage.setItem('neosudoku-hints', this.hintsEnabled);
    }

    showAbout() {
        alert(
            "NeoSudoku v1.0\n\n" +
            "A modern implementation of the classic Sudoku puzzle game.\n" +
            "Created with ❤️ as part of the Neo game series.\n\n" +
            "© " + new Date().getFullYear()
        );
    }

    // Load saved preferences
    loadPreferences() {
        // Load dark mode preference
        const darkMode = localStorage.getItem('neosudoku-dark-mode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }
        
        // Load hints preference
        this.hintsEnabled = localStorage.getItem('neosudoku-hints') !== 'false';
        if (!this.hintsEnabled) {
            document.getElementById('toggle-hints').textContent = "Enable Hints";
        }
    }

    showHomeScreen() {
        // Stop the game timer if it's running
        if (this.game.timerStarted) {
            this.game.stopTimer();
            this.game.timerStarted = false;
        }
        
        // Hide game screen and show home screen
        document.querySelector('.game-screen').style.display = 'none';
        document.querySelector('.home-screen').style.display = 'flex';
    }
}

class HomeScreen {
    constructor() {
        this.homeScreen = document.querySelector('.home-screen');
        this.gameScreen = document.querySelector('.game-screen');
        this.startButton = document.getElementById('start-game');
        this.themeToggleBtn = document.getElementById('toggle-theme-home');
        
        this.setupEventListeners();
        this.loadThemePreference();
    }
    
    setupEventListeners() {
        // Start game button
        this.startButton.addEventListener('click', () => {
            this.homeScreen.style.display = 'none';
            this.gameScreen.style.display = 'block';
        });
        
        // Theme toggle on home screen
        this.themeToggleBtn.addEventListener('click', () => {
            this.toggleDarkMode();
        });
    }
    
    loadThemePreference() {
        // Load dark mode preference
        const darkMode = localStorage.getItem('neosudoku-dark-mode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
            this.updateThemeIcon();
        }
    }
    
    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        // Store preference
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('neosudoku-dark-mode', isDarkMode);
        this.updateThemeIcon();
    }
    
    updateThemeIcon() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const themeIcon = this.themeToggleBtn.querySelector('.theme-icon');
        themeIcon.textContent = isDarkMode ? '☀️' : '🌙';
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    const homeScreen = new HomeScreen();
    const game = new Sudoku();
    // Initialize the menu and pass the game instance
    window.gameMenu = new Menu(game);
    window.gameMenu.loadPreferences();
}); 