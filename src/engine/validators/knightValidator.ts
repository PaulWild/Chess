import { Position, ValidMove } from "../types";
import { BaseValidator } from "./baseValidator";

export class KnightValidator extends BaseValidator {
  *potentialMoves(from: Position): IterableIterator<ValidMove> {
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

    for (const [rd, fd] of moveDeltas) {
      const move = this.getMoveAtPosition(from, rd, fd);
      if (this.isStandardMove(move)) {
        yield move;
      }
    }
  }
}
