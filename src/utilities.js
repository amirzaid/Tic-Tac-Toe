/* export function calculateWinner(cells, line_pos) { */
export function calculateWinner(cells) {
    const winningTables = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2]
    ];

    for (let i = 0; i < winningTables.length; i++) {
        const [a, b, c] = winningTables[i];
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            /* // Calculate line offset
            const new_offset = calculateOffset(a, c);
            line_pos.offset_top = new_offset.offset_top;
            line_pos.offset_left = new_offset.offset_left;
            line_pos.angle = new_offset.angle;
            document.getElementsByClassName('line')[0].classList.add('stretch'); */
            /* return cells[a]; */
            return { cell: cells[a], a: a, c: c };
        }
    }
    return (freeCells(cells).length > 0) ? null : { cell: 'tie', a: null, c: null }; // If board is full return 'tie'
    /* return null; */
}

// Check if board is full
export function freeCells(cells) {
    // Create a new array having the free cells indexes
    const free_cells = cells.reduce((newArray, value, idx) => {
        // Cell is free
        if (value === '') {
            return [...newArray, idx]; // Add cells index to new array
        }
        else return newArray;
    }, []);
    return free_cells
}

// Set cell's value to current player's sign and switch turns
export function setValue(cells, setCells, cell, turn, setTurn) {
    setTurn((turn === 'x') ? 'o' : 'x');
    var newArray = [...cells];
    newArray[cell] = turn;
    setCells(newArray);
    document.getElementsByClassName('cell')[cell].style.fontSize = '4em';
    if (turn === 'o') document.getElementsByClassName('cell')[cell].style.color = 'rgb(242, 235, 211)';
}

// Calculate line's top and left offsets + line's angle 
export function calculateOffset(cell_idx_1, cell_idx_2) {
    document.getElementsByClassName('line')[0].style.display = 'block';
    const line = document.getElementsByClassName('line')[0];
    const cell_1 = document.getElementsByClassName('cell')[cell_idx_1];
    const cell_2 = document.getElementsByClassName('cell')[cell_idx_2];
    const angle = Math.atan2(cell_2.offsetTop - cell_1.offsetTop, cell_2.offsetLeft - cell_1.offsetLeft) * 180 / Math.PI;
    const offset_top = 0 - (line.offsetTop - cell_1.offsetTop - (angle !== 90 ? (cell_1.offsetHeight / 2) : 0));
    const offset_left = angle !== 0 ? ((document.getElementsByClassName('cell')[0].offsetWidth / 2) + (angle === 90 ? cell_1.offsetWidth * (cell_idx_1 % 3) : 0)) : 0;
    return { offset_top, offset_left, angle };
}

export function style_reset() {
    const cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.style.color = 'rgb(84, 84, 84)';
        cell.style.fontSize = '1em';
    };
}

export function bestMove(cells) {
    let board = [...cells]; // Create a copy of the current board
    let bestScore = -Infinity; // Reset best score
    let move; // Best move

    // Check all possible moves
    for (let cell_idx of board.keys()) {
        // Check if cell is free
        if (board[cell_idx] === '') {
            board[cell_idx] = 'o';
            let score = minimax(board, 0, false); // Run minimax to get best score for this move
            board[cell_idx] = ''; // Undo to check next move
            // Update best score
            if (score > bestScore) {
                bestScore = score;
                move = cell_idx;
            }
        }
        /* console.log(board); */
    }
    return move;
}

let scores = {
    'x': -1,
    'o': 1,
    'tie': 0
}

function minimax(board, depth, isMaximizing) {
    let result = calculateWinner(board);
    if (result != null) {
        /* console.log(scores[result.cell]); */
        return scores[result.cell];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let cell_idx of board.keys()) {
            // Check if cell is free
            if (board[cell_idx] === '') {
                board[cell_idx] = 'o';
                let score = minimax(board, depth + 1, false); // Run minimax to get best score for this move
                board[cell_idx] = ''; // Undo to check next move
                // Update best score
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let cell_idx of board.keys()) {
            // Check if cell is free
            if (board[cell_idx] === '') {
                board[cell_idx] = 'x';
                let score = minimax(board, depth + 1, true); // Run minimax to get best score for this move
                board[cell_idx] = ''; // Undo to check next move
                // Update best score
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}