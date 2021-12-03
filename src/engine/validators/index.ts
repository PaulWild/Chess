import { Game } from "../game";
import { IPiece } from "../pieces";
import {
  Position,
  ValidMoves,
  ValidMove,
  InvalidMove,
  CastlingRights,
} from "../types";
import { BishopValidator } from "./bishopValidator";
import { KingValidator } from "./kingValidator";
import { KnightValidator } from "./knightValidator";
import { PawnValidator } from "./pawnValidator";
import { QueenValidator } from "./queenValidator";
import { RookValidator } from "./rookValidator";

export interface IValidMoves {
  potentialMoves(position: Position): IterableIterator<ValidMove>;

  canMove(from: Position, to: Position): ValidMove | InvalidMove;
}

export const getMoveValidator = (
  piece: IPiece,
  game: Game,
  enPessantTarget: Position | undefined = undefined,
  castlingRights: CastlingRights = CastlingRights.None
): IValidMoves => {
  switch (piece.pieceType) {
    case "BISHOP":
      return new BishopValidator(piece, game, enPessantTarget, castlingRights);
    case "KING":
      return new KingValidator(piece, game, enPessantTarget, castlingRights);
    case "KNIGHT":
      return new KnightValidator(piece, game, enPessantTarget, castlingRights);
    case "PAWN":
      return new PawnValidator(piece, game, enPessantTarget, castlingRights);
    case "QUEEN":
      return new QueenValidator(piece, game, enPessantTarget, castlingRights);
    case "ROOK":
      return new RookValidator(piece, game, enPessantTarget, castlingRights);
  }
};
