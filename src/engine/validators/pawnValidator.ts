import { FileArray } from "../board";
import { Position, Rank, ValidMove, ValidMoves } from "../types";
import { BaseValidator } from "./baseValidator";

export class PawnValidator extends BaseValidator {
  *potentialMoves(from: Position): IterableIterator<ValidMove> {
    const increment = this.piece.colour === "WHITE" ? 1 : -1;
    const pieceMoved = this.pieceMoved(from);

    const captureDeltas = [
      [increment, 1],
      [increment, -1],
    ];

    const newRank = from.rank + increment;
    let validRank = true;
    if (newRank === 0 || newRank === 9) {
      validRank = false;
    }

    const canMoveOne = validRank
      ? this.canMoveTo(newRank as Rank, from.file)
      : false;

    if (canMoveOne) {
      yield {
        move: "Move",
        rank: newRank as Rank,
        file: from.file,
      };
    }

    if (canMoveOne && !pieceMoved) {
      const newRank = (from.rank + increment * 2) as Rank;
      const canMoveTwo = this.canMoveTo(newRank, from.file);
      if (canMoveTwo) {
        yield {
          move: "PawnPush",
          rank: newRank,
          file: from.file,
        };
      }
    }

    const captures: ValidMoves = captureDeltas
      .map(([rd, fd]) => this.getMoveAtPosition(from, rd, fd))
      .filter(this.isStandardMove)
      .filter((x) => x.move === "Capture");

    captureDeltas.forEach(([rd, fd]) => {
      const newRank = (from.rank + rd) as Rank;
      const newFile = FileArray[FileArray.indexOf(from.file) + fd];

      if (
        this.enPassantTarget?.file === newFile &&
        this.enPassantTarget?.rank === newRank
      ) {
        captures.push({
          move: "CaptureEnPassant",
          rank: newRank,
          file: newFile,
        });
      }
    });

    for (var capture of captures) {
      yield capture;
    }
  }

  private pieceMoved(from: Position) {
    const startRank = this.piece.colour === "WHITE" ? 2 : 7;
    return startRank !== from.rank;
  }
}
