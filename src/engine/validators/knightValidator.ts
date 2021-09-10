import { Position, ValidMoves } from "../types";
import { BaseValidator } from "./baseValidator";

export class KnightValidator extends BaseValidator {
  getPotentialMoves(from: Position): ValidMoves {
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

    const piece = this.board.getPieceAt(from);
    if (piece.piece === null) {
      throw new Error("nope");
    }

    return moveDeltas
      .map(([rd, fd]) => this.getMoveAtPosition(from, rd, fd))
      .filter(this.isStandardMove);
  }
}
