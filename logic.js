// const xPossibility = [1,2,1,2,-1,-2,-1,-2];
// const yPossibility = [2,1,-2,-1,2,1,-2,-1];
// const possibility = ([x, y]) => {  
//     let arr = [];
//     let tempX = 0;
//     let tempY = 0;
//     for(let i = 0; i < 8; i++){
//         tempX = x + xPossibility[i];
//         tempY = y + yPossibility[i];
//         if((tempX >= 0 && tempX <= 7) && (tempY >= 0 && tempY <= 7))
//             arr.push([tempX, tempY]);
//     }
//     return arr;
// }
// // const arraysAreEqual = (arr1, arr2) => {
// //     // Check if the lengths are different
// //     if (arr1.length !== arr2.length) {
// //         return false;
// //     }
// //     // Check each element
// //     for (let i = 0; i < arr1.length; i++) {
// //         if (arr1[i] !== arr2[i]) {
// //             return false;
// //         }
// //     }
// //     return true;
// // }
class Node {
    constructor([x, y], moves, route) {
        this.location = [x, y];
        this.moves = moves;
        this.route = route;
}
}
const createGameBoard = () => {
    const gameBoard = [];
    for (let i = 0; i <= 7; i++) {
        gameBoard[i] = [];
        for (let j = 0; j <= 7; j++) {
            gameBoard[i][j] = false;
        }
    }
    return gameBoard;
};

/* make sure the tile is empty [false] */
const checkTileOpen = (board, loc) => {
    const x = loc[0];
    const y = loc[1];
    return !board[x][y];
};

/* make sure the suggested move is with 0-7x 0-7y bounds */
const isWithinBounds = (loc) => {
if (loc[0] < 0 || loc[0] > 7 || loc[1] < 0 || loc[1] > 7) {
    return false;
} else {
    return true;
}
};

/* uses the above 2 functions to return the only available moves based on the 
submitted co-ordinates */
const availableMoves = (board, loc) => {
    let moves = [
        [loc[0] + 2, loc[1] + 1],
        [loc[0] + 2, loc[1] - 1],
        [loc[0] + 1, loc[1] + 2],
        [loc[0] + 1, loc[1] - 2],
        [loc[0] - 1, loc[1] + 2],
        [loc[0] - 1, loc[1] - 2],
        [loc[0] - 2, loc[1] + 1],
        [loc[0] - 2, loc[1] - 1],
    ];
    let available = moves.filter((move) => {
        if (isWithinBounds(move) && checkTileOpen(board, move)) {
            return move;
        }
    });
    return available;
};

const knightMoves = (start, end) => {
    let currentBoard = createGameBoard();
    let queue = [new Node([start[0], start[1]], 0, [start[0], start[1]])];
/* The BFS part */
    while (queue.length > 0) {
        let currentMove = queue.shift();
        let x = currentMove.location[0];
        let y = currentMove.location[1];
        /* This is here to check off every node on the current board to stop
        it being accessed more than once */
        currentBoard[x][y] = true;
        /* If we've found our end value we return it */
        if (
            currentMove.location[0] === end[0] &&
            currentMove.location[1] === end[1]
        ) {
            return currentMove;
        } else {
        /* If not we keep adding nodes to the queue using the available move checker
        setup earlier. We make sure each child node has it's parent nodes 'route' and
        'depth' incremented so that we can use these in the result */
            let available = availableMoves(currentBoard, currentMove.location);
            available.forEach((move) => {
                let node = new Node(
                    [move[0], move[1]],
                    currentMove.moves + 1,
                    currentMove.route.concat([move])
                );
                queue.push(node);
            });
        }
    }
};

const printKnightMoves = (start, end) => {
    const result = knightMoves(start, end); 
    console.log(result.route)
    return `You made it in ${result.moves} moves! Here's your path: ${result.route}`;
};