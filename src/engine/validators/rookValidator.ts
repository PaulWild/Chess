import { Position, ValidMoves } from "../types";
import { BaseValidator } from "./baseValidator";

export class RookValidator extends BaseValidator {
  getPotentialMoves(from: Position): ValidMoves {
    return [
      ...this.getMovesOnLine(from, 1, 0),
      ...this.getMovesOnLine(from, 0, 1),
      ...this.getMovesOnLine(from, 0, -1),
      ...this.getMovesOnLine(from, -1, 0),
    ];
  }
}
