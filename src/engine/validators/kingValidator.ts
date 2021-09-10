import { FileArray } from "../board";
import { Position, ValidMoves, CastlingRights } from "../types";
import { BaseValidator } from "./baseValidator";
import { getMoveValidator } from ".";

export class KingValidator extends BaseValidator {
  potentialMoves(from: Position): ValidMoves {
    let validMoves: ValidMoves = [];
    const moveDeltas = [
      [1, 1],
      [0, 1],
      [1, 0],
      [-1, 0],
      [-1, -1],
      [0, -1],
      [-1, 1],
      [1, -1],
    ];

    const file = FileArray.indexOf(from.file);
    const rank = from.rank;

    validMoves = moveDeltas
      .map(([rd, fd]) => this.getMoveAtPosition(from, rd, fd))
      .filter(this.isStandardMove);

    if (this.canCastle("SHORT"))
      validMoves.push({
        move: "Castle",
        type: "SHORT",
        colour: this.piece.colour,
        rank: rank,
        file: FileArray[file + 2],
      });

    if (this.canCastle("LONG"))
      validMoves.push({
        move: "Castle",
        type: "LONG",
        colour: this.piece.colour,
        rank: rank,
        file: FileArray[file - 2],
      });

    return validMoves;
  }

  private castlingDeltas = (type: "SHORT" | "LONG") =>
    type === "SHORT" ? [0, 1, 2] : [0, -1, -2];

  private canCastle(type: "SHORT" | "LONG") {
    const moveDeltas = this.castlingDeltas(type);

    const kingRank = this.piece.colour === "WHITE" ? 1 : 8;

    let side = CastlingRights.None;
    if (this.piece.colour === "WHITE") {
      side = type === "SHORT" ? CastlingRights.k : CastlingRights.q;
    } else {
      side = type === "SHORT" ? CastlingRights.K : CastlingRights.Q;
    }

    if (!(this.castlingRights & side)) return false;

    return moveDeltas.every((fileDelta) => {
      const newFile = 4 + fileDelta;

      const pieceAt = this.board.getPieceAt({
        file: FileArray[newFile],
        rank: kingRank,
      });

      if (pieceAt.piece === null || fileDelta === 0) {
        const clone = this.board.clone();
        clone.move(
          { rank: kingRank, file: "e" },
          { rank: kingRank, file: FileArray[newFile] }
        );

        return !getMoveValidator(this.piece, clone).isKingInCheck();
      }
      return false;
    });
  }
}
