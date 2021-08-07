import { BasePiece } from "./basePiece";
import { Board } from "./board";
import { PieceType, Position, ValidMoves } from "./types";

export class Bishop extends BasePiece {
  pieceType = "BISHOP" as PieceType;

  getValidMoves = (position: Position, board: Board): ValidMoves => {
    return [
      ...board.getMovesOnLine(position, this, -1, -1),
      ...board.getMovesOnLine(position, this, 1, 1),
      ...board.getMovesOnLine(position, this, 1, -1),
      ...board.getMovesOnLine(position, this, -1, 1),
    ];
  };
}
