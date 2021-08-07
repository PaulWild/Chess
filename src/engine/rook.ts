import { BasePiece } from "./basePiece";
import { PiecePosition } from "./types";

export class Rook extends BasePiece {
  getValidMoves = (piece: PiecePosition) => {
    return [
      ...this.getMovesOnLine(piece, 1, 0),
      ...this.getMovesOnLine(piece, 0, 1),
      ...this.getMovesOnLine(piece, 0, -1),
      ...this.getMovesOnLine(piece, -1, 0),
    ];
  };
}
