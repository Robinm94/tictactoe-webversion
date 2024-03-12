$(function () {

    const X = "X";
    const O = "O";
    const xwin = [X, X, X];
    const owin = [O, O, O];
    const graph = new Map();
    let user = null;
    let board = initial_state();
    // graphPopulator(board);
    stateValue(board);
    console.log(graph);
    // minimax(board);
    // player(board);
    // actions(board);
    // winner(board);

    $("#playAsX").on("click", function () {
        user = X;
        $("#playerInfo").text("Play as X");
        $("#gameMenu").slideUp();
    });

    $("#playAsO").on("click", function () {
        user = O;
        $("#gameMenu").slideUp();
        aiMove();
        $("#playerInfo").text("Play as O");
    });

    $("#endGame").on("click", function () {
        $("#gameMenu").slideDown();
        $("#playerInfo").empty();
        user = null;
        board = initial_state();
        $(".cell").empty();
    });

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
        if (terminal(board)) {
            let wPlayer = winner(board);
            if (wPlayer != null) {
                if(wPlayer == user){
                    $("#playerInfo").text("Game Over: The Player Wins");
                }
                else{
                    $("#playerInfo").text("Game Over: Computer Wins");
                }
            }
            else {
                $("#playerInfo").text("Game Over: Tie");
            }
            return 1;
        }
        return 0;
    }

    function aiMove() {
        if (player(board) != user && !terminal(board)) {
            const comPlayer = player(board);
            $("#playerInfo").text("Computer playing as " + comPlayer);
            const bestMove = minimax(board);
            const cellId = "cell" + (parseInt(bestMove[0] * 3 + bestMove[1]));
            $("#" + cellId).text(player(board));
            board = result(board, bestMove);
        }
    }

    function initial_state() {
        return [[null, null, null], [null, null, null], [null, null, null]];
    }

    function player(board) {
        let counter = 0;
        for (const row of board) {
            for (const cell of row) {
                if (cell == null) {
                    counter++;
                }
            }
        }
        if (counter == 0) return null;
        else if (counter % 2 == 0) return O;
        else return X;
    }

    function actions(board) {
        const action = new Set();
        for (let i = 0; i < board.length; i++) {
            const row = board[i];
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                if (cell == null) {
                    action.add([i, j]);
                }
            }
        }
        return action;
    }

    function result(board, action) {
        let newBoard = $.extend(true, [], board);
        let cplayer = player(newBoard);
        const i = action[0];
        const j = action[1];
        if (newBoard[i][j] != null) {
            throw new Error("Invalid Move");
        }
        newBoard[i][j] = cplayer;
        return newBoard;
    }

    function winner(board) {
        let winlines = [];
        $.extend(winlines, board);
        for (let i = 0; i < 3; i++) {
            winlines.push([board[0][i], board[1][i], board[2][i]]);
        }
        winlines.push([board[0][0], board[1][1], board[2][2]]);
        winlines.push([board[2][0], board[1][1], board[0][2]]);
        for (const line of winlines) {
            if (xwin.length == line.length && xwin.every(function (element, index) { return element === line[index]; })) {
                return X;
            }
            if (owin.length == line.length && owin.every(function (element, index) { return element === line[index]; })) {
                return O;
            }
        }
        return null;
    }

    function terminal(board) {
        if (player(board) == null || winner(board) != null) {
            return true;
        }
        else {
            return false;
        }
    }

    function utility(board) {
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
        const hashboard = hash(board);
        if (graph.has(hashboard)) {
            return graph.get(hashboard);
        }
        if (terminal(board)) {
            const boardValue = utility(board);
            graph.set(hashboard, boardValue);
            return boardValue;
        }
        const mvalue = [];
        const listAction = actions(board);
        const cplayer = player(board);
        for (let move of listAction) {
            const move_value = stateValue(result(board, move));
            mvalue.push(move_value);
            if ((cplayer == X && move_value == 1) || (cplayer == O && move_value == -1)) {
                break;
            }
        }
        if (cplayer == X) {
            const boardValue = Math.max(...mvalue);
            graph.set(hashboard, boardValue);
            return boardValue;
        }
        else {
            const boardValue = Math.min(...mvalue);
            graph.set(hashboard, boardValue);
            return boardValue;
        }
    }

    function minimax(board) {
        if (terminal(board)) {
            return null;
        }
        const cplayer = player(board);
        const listAction = actions(board);
        const mvalue = [];
        const moves = new Map();
        for (let move of listAction) {
            const move_value = stateValue(result(board, move));
            mvalue.push(move_value);
            if (moves.has(move_value)) {
                moves.get(move_value).push(move);
            }
            else {
                moves.set(move_value, [move]);
            }
        }
        if (cplayer == X) {
            const bestMoves = moves.get(Math.max(...mvalue));
            return bestMoves[Math.floor(Math.random() * bestMoves.length)];
        }
        else {
            const bestMoves = moves.get(Math.min(...mvalue));
            return bestMoves[Math.floor(Math.random() * bestMoves.length)];
        }
    }
    // async function graphPopulator(board){
    //     stateValue(board);
    // }
});