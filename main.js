document.body.style.margin = 0;
document.body.style.padding = 0;
document.body.style.fontFamily = 'Arial, sans-serif';

const size = 3;  // Tamanho do tabuleiro (3x3)
const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#F5A623', '#50E3C2']; // Cores variadas para o tabuleiro
let board = Array(size).fill().map(() => Array(size).fill(''));
let currentPlayer = 'X';  // Jogador humano
let gameOver = false;
let playerWins = 0;
let botWins = 0;
let draws = 0;

const container = document.createElement('div');
container.style.display = 'grid';
container.style.gridTemplateColumns = `repeat(${size}, 100px)`;
container.style.gridTemplateRows = `repeat(${size}, 100px)`;
container.style.gap = '5px';
container.style.margin = '50px auto';
container.style.width = 'fit-content';
document.body.appendChild(container);

const scoreBoard = document.createElement('div');
scoreBoard.style.textAlign = 'center';
scoreBoard.style.fontSize = '24px';
scoreBoard.style.marginBottom = '20px';
scoreBoard.innerHTML = `Placar: Jogador X: ${playerWins} | Bot: ${botWins} | Empates: ${draws}`;
document.body.insertBefore(scoreBoard, container);

// Função para desenhar o tabuleiro
function drawBoard() {
    container.innerHTML = '';
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.style.width = '100px';
            cellElement.style.height = '100px';
            cellElement.style.display = 'flex';
            cellElement.style.alignItems = 'center';
            cellElement.style.justifyContent = 'center';
            cellElement.style.fontSize = '36px';
            cellElement.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            cellElement.style.cursor = gameOver || cell !== '' ? 'not-allowed' : 'pointer';
            cellElement.onclick = () => makeMove(rowIndex, colIndex);

            if (cell !== '') {
                cellElement.textContent = cell;
                cellElement.style.pointerEvents = 'none';  // Não permite clicar em células já preenchidas
            }

            container.appendChild(cellElement);
        });
    });
}

// Função para verificar se alguém ganhou
function checkWinner() {
    // Verifica linhas, colunas e diagonais
    for (let i = 0; i < size; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) return board[i][0];
        if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) return board[0][i];
    }
    if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) return board[0][0];
    if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) return board[0][2];

    // Verifica empate
    if (board.flat().every(cell => cell !== '')) return 'draw';

    return null;  // Nenhum vencedor ainda
}

// Função para fazer o movimento do jogador
function makeMove(row, col) {
    if (gameOver || board[row][col] !== '') return;

    board[row][col] = currentPlayer;
    drawBoard();

    const winner = checkWinner();
    if (winner) {
        if (winner === 'X') {
            playerWins++;
            scoreBoard.innerHTML = `Placar: Jogador X: ${playerWins} | Bot: ${botWins} | Empates: ${draws}`;
            alert('Você ganhou!');
        } else if (winner === 'O') {
            botWins++;
            scoreBoard.innerHTML = `Placar: Jogador X: ${playerWins} | Bot: ${botWins} | Empates: ${draws}`;
            alert('O Bot ganhou!');
        } else {
            draws++;
            scoreBoard.innerHTML = `Placar: Jogador X: ${playerWins} | Bot: ${botWins} | Empates: ${draws}`;
            alert('Empate!');
        }
        gameOver = true;
        setTimeout(startNewGame, 1500);  // Reinicia o jogo após 1.5 segundos
        return;
    }

    // Troca o jogador
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (currentPlayer === 'O') {
        setTimeout(botMove, 500);  // O bot faz o movimento após um pequeno delay
    }
}

// Função para o movimento do bot
function botMove() {
    let availableMoves = [];
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell === '') availableMoves.push({ rowIndex, colIndex });
        });
    });

    // Escolhe um movimento aleatório (bot simples)
    const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    makeMove(move.rowIndex, move.colIndex);
}

// Inicia um novo jogo
function startNewGame() {
    board = Array(size).fill().map(() => Array(size).fill(''));
    currentPlayer = 'X';
    gameOver = false;
    drawBoard();
}

// Iniciar o jogo inicial
drawBoard();
