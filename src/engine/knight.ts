import { BasePiece } from "./basePiece";
import { Board } from "./board";
import { PieceType, Position, ValidMoves } from "./types";

export class Knight extends BasePiece {
  pieceType = "KNIGHT" as PieceType;

  getPotentialMoves = (position: Position, board: Board): ValidMoves => {
    const moveDeltas = [
      [1, 2],
      [2, 1],
      [-1, 2],
      [-2, 1],
      [-1, -2],
      [-2, -1],
      [1, -2],
      [2, -1],
    ];

    return moveDeltas
      .map(([rd, fd]) => board.getMoveAtPosition(position, this, rd, fd))
      .filter(board.isStandardMove);
  };
}
