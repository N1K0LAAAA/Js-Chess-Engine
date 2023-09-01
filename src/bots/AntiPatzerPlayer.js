const ChessUtils = require("../utils/ChessUtils");
const getBoardEval = require("../utils/EvalFunction");

class AntiPatzerPlayer {
  // ... existing code ...
  positionCount = 0;

  minimaxRoot(depth, chess, isMaximisingPlayer) {
    let newGameMoves = chess.legalMoves();
    let bestMove = (isMaximisingPlayer) ? -Infinity : Infinity; 
    let bestMoveFound;

    for (var i = 0; i < newGameMoves.length; i++) {
      let newGameMove = newGameMoves[i]
      chess.move(newGameMove);
      let value = this.minimax(depth - 1, chess, -Infinity, Infinity, !isMaximisingPlayer);
      chess.undo();
      if ((isMaximisingPlayer) ? bestMove <= value : bestMove >= value) {
        bestMove = value;
        bestMoveFound = newGameMove;
      }
    }
    return bestMoveFound;
  }

  minimax(depth, chess, alpha, beta, isMaximisingPlayer) {
    this.positionCount++;
   // const chess = new ChessUtils();
    // chess.chess.load(chessFen);
    let cords = chess.getAllSquares();

    if (depth === 0) return   getBoardEval(cords);


    const legalMoves = chess.legalMoves();
    if (isMaximisingPlayer) {
      let bestMove = -Infinity;
      for (const move of legalMoves) {
        chess.move(move);
        bestMove = Math.max(bestMove, this.minimax(depth - 1, chess, alpha, beta, !isMaximisingPlayer));
        chess.undo();
        alpha = Math.max(alpha, bestMove);
        if (beta <= alpha) {
          // Beta cutoff
          break;
        }
      }
      return bestMove;
    } else {
      let bestMove = Infinity;
      for (const move of legalMoves) {
        chess.move(move);
        bestMove = Math.min(bestMove, this.minimax(depth - 1, chess, alpha, beta, !isMaximisingPlayer));
        chess.undo();
        beta = Math.min(beta, bestMove);
        if (beta <= alpha) {
          // Alpha cutoff
          break;
        }
      }
      return bestMove;
    }
  }

  getNextMove(moves) {
    const chess = new ChessUtils();
    chess.applyMoves(moves);
    const legalMoves = chess.legalMoves();
    const who = chess.turn();
    const bestMove = this.findBestMove(chess, legalMoves, who);
    return bestMove;
  }

  findBestMove(chess, legalMoves, who) {
    let depth = 2; // Adjust the depth as per your requirement
    const isMaximisingPlayer = who === "w";
    this.positionCount = 0;
    var d = new Date().getTime();
    let bestMove;
    while(this.positionCount < 3500 && depth < 10){
       this.positionCount = 0;
       bestMove = this.minimaxRoot(++depth, chess, isMaximisingPlayer);
    }
    const bestMoveString = chess.uci(bestMove);
    console.log(bestMoveString)
    var d2 = new Date().getTime();
    var moveTime = (d2 - d) / 1000;
    var positionsPerS = ( this.positionCount / moveTime);
    console.log("Possible Moves: " + chess.legalMoves().length);
    console.log("Positions Counted: " + this.positionCount);
    console.log("Calculation Time: " + moveTime);
    console.log("Position/s: " + positionsPerS);
    console.log("Depth: " + depth);
    chess.move(bestMove);
    console.log("Eval: " + getBoardEval(chess.getAllSquares()));
    chess.undo();
    return bestMoveString;
  }

  getReply(chat) {
    return "Hello";
  }
}

module.exports = AntiPatzerPlayer;
