$(function () {
    let board = initial_state();
    const X = "X";
    const O = "O";
    const xwin = [X, X, X];
    const owin = [O, O, O];
    player(board);
    actions(board);
    winner(board);
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

    function utility(board){
        const winplayer = winner(board);
        if (winplayer == null){
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
                if (cell == null){
                    hashmap.concat(0);
                }
                else if (cell == X) {
                    hashmap.concat(1);
                } else {
                    hashmap.concat(2);
                }
            }
        }
        return hashmap;
    }

});