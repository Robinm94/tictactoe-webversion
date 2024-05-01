/*
 * This is a JavaScript implementation of the game Tic Tac Toe.
 * The game is played on a 3x3 grid, with two players: X and O.
 * Players take turns placing their symbol on the grid, with the goal of getting three of their symbols in a row.
 * The game ends when one player has three of their symbols in a row (horizontally, vertically, or diagonally) or the grid is full (a tie).
 *
 * The game includes an AI opponent that uses the minimax algorithm to determine its moves.
 * The minimax algorithm is a recursive algorithm used for decision making in game theory and artificial intelligence.
 * At each level of the game tree, the AI simulates all possible games that could be played from that point, and chooses the move that leads to the most favorable outcome.
 *
 * The game state is represented by a 2D array (board), where each element is either null (empty), X, or O.
 * The game includes several helper functions to manipulate and evaluate the game state:
 * - initial_state: Returns the initial state of the game board.
 * - player: Returns the player who has the next turn on a board.
 * - actions: Returns a set of all possible actions (i, j) available on the board.
 * - result: Returns the board that results from making a move on a board.
 * - winner: Returns the winner of the game, if there is one.
 * - terminal: Returns true if the game is over (either a tie or a winner), false otherwise.
 * - utility: Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
 * - minimax: Returns the optimal action for the current player on the board.
 *
 * The game also includes two main functions that control the game flow:
 * - checkGameOver: Checks if the game is over and updates the game message accordingly.
 * - aiMove: Makes a move for the AI player.
 */
$(function () {

    // Initialize variables
    let user = null;
    const X = "X";
    const O = "O";
    const xwin = [X, X, X];
    const owin = [O, O, O];
    // Create a graph to store the values of board states
    const graph = new Map();
    // Initialize the game board
    let board = initial_state();
    // Calculate the value of the initial board state and store it in the graph
    stateValue(board);

    // When the user clicks the "Play as X" button
    $("#playAsX").on("click", function () {
        user = X;
        $("#playerInfo").text("Play as X");
        $("#gameMenu").slideUp();
    });

    // When the user clicks the "Play as O" button
    $("#playAsO").on("click", function () {
        user = O;
        $("#gameMenu").slideUp();
        aiMove();
        $("#playerInfo").text("Play as O");
    });

    // When the user clicks the "End Game" button
    $("#endGame").on("click", function () {
        $("#gameMenu").slideDown();
        $("#playerInfo").empty();
        user = null;
        board = initial_state();
        $(".cell").empty();
    });

    // When the user clicks a cell on the board
    $(".cell").on("click", function () {
        if (user == player(board)) {
            const cellId = parseInt($(this).attr("id").replace("cell", ""));
            let action = [parseInt(cellId / 3), parseInt(cellId % 3)];
            try {
                board = result(board, action);
            } catch (error) {
                return;
            }
            $(this).text(user);
            aiMove();
            if (checkGameOver()) {
                return;
            }
            $("#playerInfo").text("Play as " + user);
        }
    });

    function checkGameOver() {
    // Check if the game has reached a terminal state
    if (terminal(board)) {
        // Determine the winner of the game
        let wPlayer = winner(board);
        // If there is a winner
        if (wPlayer != null) {
            // If the winner is the user
            if(wPlayer == user){
                // Display a message indicating that the player has won
                $("#playerInfo").text("Game Over: The Player Wins");
            }
            // If the winner is not the user
            else{
                // Display a message indicating that the computer has won
                $("#playerInfo").text("Game Over: Computer Wins");
            }
        }
        // If there is no winner
        else {
            // Display a message indicating that the game is a tie
            $("#playerInfo").text("Game Over: Tie");
        }
        // Return 1 to indicate that the game is over
        return 1;
    }
    // If the game has not reached a terminal state, return 0
    return 0;
    }

    function aiMove() {
        // Check if it's the computer's turn and the game is not over
        if (player(board) != user && !terminal(board)) {
            // Get the current player (computer)
            const comPlayer = player(board);
            // Display a message indicating that the computer is playing
            $("#playerInfo").text("Computer playing as " + comPlayer);
            // Use the minimax algorithm to determine the best move for the computer
            const bestMove = minimax(board);
            // Convert the best move to a cell ID
            const cellId = "cell" + (parseInt(bestMove[0] * 3 + bestMove[1]));
            // Update the board with the computer's move
            $("#" + cellId).text(player(board));
            // Update the game state with the result of the move
            board = result(board, bestMove);
        }
    }

    function initial_state() {
        // Return the initial state of the game board
        return [[null, null, null], [null, null, null], [null, null, null]];
    }

    function player(board) {
        // Initialize a counter to count the number of null cells
        let counter = 0;
        // Iterate over each row in the board
        for (const row of board) {
            // Iterate over each cell in the row
            for (const cell of row) {
                // If the cell is null, increment the counter
                if (cell == null) {
                    counter++;
                }
            }
        }
        // If all cells are filled, return null
        if (counter == 0) return null;
        // If the number of null cells is even, it's O's turn
        else if (counter % 2 == 0) return O;
        // If the number of null cells is odd, it's X's turn
        else return X;
    }

    function actions(board) {
        // Initialize a set to store the possible actions
        const action = new Set();
        // Iterate over each row in the board
        for (let i = 0; i < board.length; i++) {
            const row = board[i];
            // Iterate over each cell in the row
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                // If the cell is null, it's a possible action
                if (cell == null) {
                    // Add the action to the set
                    action.add([i, j]);
                }
            }
        }
        // Return the set of possible actions
        return action;
    }

    function result(board, action) {
        // Create a deep copy of the board
        let newBoard = $.extend(true, [], board);
        // Get the current player
        let cplayer = player(newBoard);
        // Extract the row and column from the action
        const i = action[0];
        const j = action[1];
        // If the cell at the specified row and column is not null, throw an error
        if (newBoard[i][j] != null) {
            throw new Error("Invalid Move");
        }
        // Otherwise, set the cell at the specified row and column to the current player
        newBoard[i][j] = cplayer;
        // Return the new board
        return newBoard;
    }

    function winner(board) {
        // Initialize an array to store the winning lines
        let winlines = [];
        // Add the rows of the board to the winning lines
        $.extend(winlines, board);
        // Add the columns of the board to the winning lines
        for (let i = 0; i < 3; i++) {
            winlines.push([board[0][i], board[1][i], board[2][i]]);
        }
        // Add the diagonals of the board to the winning lines
        winlines.push([board[0][0], board[1][1], board[2][2]]);
        winlines.push([board[2][0], board[1][1], board[0][2]]);
        // Iterate over each winning line
        for (const line of winlines) {
            // If the line matches the winning line for X, return X
            if (xwin.length == line.length && xwin.every(function (element, index) { return element === line[index]; })) {
                return X;
            }
            // If the line matches the winning line for O, return O
            if (owin.length == line.length && owin.every(function (element, index) { return element === line[index]; })) {
                return O;
            }
        }
        // If no winning line is found, return null
        return null;
    }

    function terminal(board) {
        // The terminal function checks if the game has reached a terminal state.
        // A terminal state is reached when there is a winner or all cells on the board are filled.
        // If the current player is null (indicating all cells are filled) or there is a winner, return true.
        // Otherwise, return false.
        if (player(board) == null || winner(board) != null) {
            return true;
        }
        else {
            return false;
        }
    }

    function utility(board) {
        // The utility function calculates the utility of the board.
        // The utility is a numerical value that represents the desirability of a game state.
        // If the game is still in progress, the utility is 0.
        // If the game is won by X, the utility is 1.
        // If the game is won by O, the utility is -1.
        const winplayer = winner(board);
        if (winplayer == null) {
            return 0;
        }
        else if (winplayer == X) {
            return 1;
        } else {
            return -1;
        }
    }

    function hash(board) {
        // The hash function generates a unique string representation of the board state.
        // This is used to store and retrieve board states in a graph data structure.
        // Each cell on the board is represented by a number: 0 for null, 1 for X, and 2 for O.
        // The string is generated by concatenating these numbers in row-major order.
        let hashmap = "";
        for (const row of board) {
            for (const cell of row) {
                if (cell == null) {
                    hashmap += 0;
                }
                else if (cell == X) {
                    hashmap += 1;
                } else {
                    hashmap += 2;
                }
            }
        }
        return hashmap;
    }

    function stateValue(board) {
        // Hash the current board state
        const hashboard = hash(board);

        // If the hashed board state is already in the graph, return its value
        if (graph.has(hashboard)) {
            return graph.get(hashboard);
        }

        // If the board is in a terminal state, calculate its utility, store it in the graph, and return it
        if (terminal(board)) {
            const boardValue = utility(board);
            graph.set(hashboard, boardValue);
            return boardValue;
        }

        // Initialize an array to store the values of all possible moves from the current state
        const mvalue = [];
        // Get all possible actions for the current state
        const listAction = actions(board);
        // Get the current player
        const cplayer = player(board);

        // For each possible action, calculate the value of the resulting state and add it to the array
        for (let move of listAction) {
            const move_value = stateValue(result(board, move));
            mvalue.push(move_value);
            // If the current player is X and the move value is 1, or the current player is O and the move value is -1, stop evaluating further moves
            if ((cplayer == X && move_value == 1) || (cplayer == O && move_value == -1)) {
                break;
            }
        }

        // If the current player is X, find the maximum move value, store it in the graph, and return it
        if (cplayer == X) {
            const boardValue = Math.max(...mvalue);
            graph.set(hashboard, boardValue);
            return boardValue;
        }
        // If the current player is O, find the minimum move value, store it in the graph, and return it
        else {
            const boardValue = Math.min(...mvalue);
            graph.set(hashboard, boardValue);
            return boardValue;
        }
    }

    function minimax(board) {
        // If the game has reached a terminal state, return null
        if (terminal(board)) {
            return null;
        }
        // Get the current player
        const cplayer = player(board);
        // Get all possible actions for the current state
        const listAction = actions(board);
        // Initialize an array to store the values of the moves
        const mvalue = [];
        // Initialize a map to store the moves and their corresponding values
        const moves = new Map();
        // Iterate over all possible actions
        for (let move of listAction) {
            // Calculate the value of the state that would result from each action
            const move_value = stateValue(result(board, move));
            // Add the value to the array of move values
            mvalue.push(move_value);
            // If the map already contains the move value, add the move to the list of moves for that value
            if (moves.has(move_value)) {
                moves.get(move_value).push(move);
            }
            // If the map does not contain the move value, add a new entry for the move value and move
            else {
                moves.set(move_value, [move]);
            }
        }
        // If the current player is X, find the move with the maximum value
        if (cplayer == X) {
            // Get the list of best moves for X
            const bestMoves = moves.get(Math.max(...mvalue));
            // Return a random move from the list of best moves
            return bestMoves[Math.floor(Math.random() * bestMoves.length)];
        }
        // If the current player is O, find the move with the minimum value
        else {
            // Get the list of best moves for O
            const bestMoves = moves.get(Math.min(...mvalue));
            // Return a random move from the list of best moves
            return bestMoves[Math.floor(Math.random() * bestMoves.length)];
        }
    }
});