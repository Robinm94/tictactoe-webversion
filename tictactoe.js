$(function () {
    let board = initial_state();
    player();
    actions(board);
    const X = "X";
    const O = "O";
    const xwin = [X, X, X];
    const owin = [O, O, O];

    function player() {
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

    }

    function initial_state() {
        return [[null, null, null], [null, null, null], [null, null, null]];
    }
});