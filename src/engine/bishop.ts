import { BasePiece } from "./basePiece";
import { PiecePosition } from "./types";

export class Bishop extends BasePiece {
  getValidMoves = (piece: PiecePosition) => {
    return [
      ...this.getMovesOnLine(piece, -1, -1),
      ...this.getMovesOnLine(piece, 1, 1),
      ...this.getMovesOnLine(piece, 1, -1),
      ...this.getMovesOnLine(piece, -1, 1),
    ];
  };
}
