import { BishopValidator } from "./bishopValidator";
import { RookValidator } from "./rookValidator";
import { Position, ValidMoves } from "../types";
import { BaseValidator } from "./baseValidator";

export class QueenValidator extends BaseValidator {
  getPotentialMoves(from: Position): ValidMoves {
    return [
      ...new RookValidator(
        this.piece,
        this.board,
        this.enPassantTarget,
        this.castlingRights
      ).getPotentialMoves(from),
      ...new BishopValidator(
        this.piece,
        this.board,
        this.enPassantTarget,
        this.castlingRights
      ).getPotentialMoves(from),
    ];
  }
}
