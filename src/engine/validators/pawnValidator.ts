import { FileArray } from "../board";
import { Position, Rank, ValidMoves } from "../types";
import { BaseValidator } from "./baseValidator";

export class PawnValidator extends BaseValidator {
  getPotentialMoves(from: Position): ValidMoves {
    const moves: ValidMoves = [];
    const increment = this.piece.colour === "WHITE" ? 1 : -1;
    const pieceMoved = this.pieceMoved(from);

    const captureDeltas = [
      [increment, 1],
      [increment, -1],
    ];

    const moveOne = this.getMoveAtPosition(from, increment, 0);
    if (this.isStandardMove(moveOne)) {
      moves.push(moveOne);
    }

    if (
      this.isStandardMove(moveOne) &&
      moveOne.move !== "Capture" &&
      !pieceMoved
    ) {
      const newRank = (from.rank + increment * 2) as Rank;
      const canMoveTwo = this.canMoveTo(newRank, from.file);
      if (canMoveTwo) {
        moves.push({
          move: "PawnPush",
          rank: newRank,
          file: from.file,
        });
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

    return [...moves, ...captures];
  }

  private pieceMoved(from: Position) {
    const startRank = this.piece.colour === "WHITE" ? 2 : 7;
    return startRank !== from.rank;
  }
}
