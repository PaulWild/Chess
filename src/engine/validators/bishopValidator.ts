import { Position, ValidMove } from "../types";
import { BaseValidator } from "./baseValidator";

export class BishopValidator extends BaseValidator {
  *potentialMoves(from: Position): IterableIterator<ValidMove> {
    yield* this.getMovesOnLine(from, -1, -1);
    yield* this.getMovesOnLine(from, 1, 1);
    yield* this.getMovesOnLine(from, 1, -1);
    yield* this.getMovesOnLine(from, -1, 1);
  }
}
