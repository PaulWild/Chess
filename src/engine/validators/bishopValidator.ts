import { Position, ValidMoves } from "../types";
import { BaseValidator } from "./baseValidator";

export class BishopValidator extends BaseValidator {
  potentialMoves(from: Position): ValidMoves {
    return [
      ...this.getMovesOnLine(from, -1, -1),
      ...this.getMovesOnLine(from, 1, 1),
      ...this.getMovesOnLine(from, 1, -1),
      ...this.getMovesOnLine(from, -1, 1),
    ];
  }
}
