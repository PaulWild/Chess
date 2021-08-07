import { BasePiece } from "./basePiece";
import { Board } from "./board";
import { PieceType, Position, ValidMoves } from "./types";

export class Rook extends BasePiece {
  pieceType = "ROOK" as PieceType;

  getValidMoves(from: Position, board: Board): ValidMoves {
    return [
      ...board.getMovesOnLine(from, this, 1, 0),
      ...board.getMovesOnLine(from, this, 0, 1),
      ...board.getMovesOnLine(from, this, 0, -1),
      ...board.getMovesOnLine(from, this, -1, 0),
    ];
  }
}
