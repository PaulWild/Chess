import { Position, ValidMove } from "../types";
import { BaseValidator } from "./baseValidator";

export class RookValidator extends BaseValidator {
  *potentialMoves(from: Position): IterableIterator<ValidMove> {
    yield* this.getMovesOnLine(from, 1, 0);
    yield* this.getMovesOnLine(from, 0, 1);
    yield* this.getMovesOnLine(from, 0, -1);
    yield* this.getMovesOnLine(from, -1, 0);
  }
}
