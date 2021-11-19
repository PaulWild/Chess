import { Position, ValidMoves } from "../types";
import { BaseValidator } from "./baseValidator";

export class KnightValidator extends BaseValidator {
  potentialMoves(from: Position): ValidMoves {
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

    const piece = this.game.board.getPieceAt(from);
    if (piece === null) {
      throw new Error("nope");
    }

    return moveDeltas
      .map(([rd, fd]) => this.getMoveAtPosition(from, rd, fd))
      .filter(this.isStandardMove);
  }
}
