import { FileArray } from "../board";
import { Position, ValidMove, CastlingRights } from "../types";
import { BaseValidator } from "./baseValidator";

export class KingValidator extends BaseValidator {
  *potentialMoves(from: Position): IterableIterator<ValidMove> {
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

    for (const [rd, fd] of moveDeltas) {
      const move = this.getMoveAtPosition(from, rd, fd);
      if (this.isStandardMove(move)) {
        yield move;
      }
    }

    if (this.canCastle("SHORT"))
      yield {
        move: "Castle",
        type: "SHORT",
        colour: this.piece.colour,
        rank: rank,
        file: FileArray[file + 2],
      };

    if (this.canCastle("LONG"))
      yield {
        move: "Castle",
        type: "LONG",
        colour: this.piece.colour,
        rank: rank,
        file: FileArray[file - 2],
      };
  }

  private castlingDeltas = (type: "SHORT" | "LONG") =>
    type === "SHORT" ? [0, 1, 2] : [0, -1, -2];

  private canCastle(type: "SHORT" | "LONG") {
    const moveDeltas = this.castlingDeltas(type);

    const kingRank = this.piece.colour === "WHITE" ? 1 : 8;

    let side = CastlingRights.None;
    if (this.piece.colour === "BLACK") {
      side = type === "SHORT" ? CastlingRights.k : CastlingRights.q;
    } else {
      side = type === "SHORT" ? CastlingRights.K : CastlingRights.Q;
    }

    if (!(this.castlingRights & side)) return false;

    return moveDeltas.every((fileDelta) => {
      const newFile = 4 + fileDelta;

      const pieceAt = this.game.board.getPieceAt({
        file: FileArray[newFile],
        rank: kingRank,
      });

      if (pieceAt === null || fileDelta === 0) {
        return true;
      }
      return false;
    });
  }
}
