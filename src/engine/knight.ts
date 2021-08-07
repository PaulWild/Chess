import { BasePiece } from "./basePiece";
import { PiecePosition } from "./types";

export class Knight extends BasePiece {
  getValidMoves = (piece: PiecePosition) => {
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
      .map(([rd, fd]) => this.getMoveAtPosition(piece, rd, fd))
      .filter(this.isStandardMove);
  };
}
