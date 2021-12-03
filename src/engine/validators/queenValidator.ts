import { BishopValidator } from "./bishopValidator";
import { RookValidator } from "./rookValidator";
import { Position, ValidMove } from "../types";
import { BaseValidator } from "./baseValidator";

export class QueenValidator extends BaseValidator {
  *potentialMoves(from: Position): IterableIterator<ValidMove> {
    yield* new RookValidator(
      this.piece,
      this.game,
      this.enPassantTarget,
      this.castlingRights
    ).potentialMoves(from);

    yield* new BishopValidator(
      this.piece,
      this.game,
      this.enPassantTarget,
      this.castlingRights
    ).potentialMoves(from);
  }
}
