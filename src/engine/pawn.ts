import { BasePiece } from "./basePiece";
import { FileArray } from "./board";
import { PiecePosition, Rank, StandardMove } from "./types";

export class Pawn extends BasePiece {
  getValidMoves = (piece: PiecePosition) => {
    const startRank = piece.colour === "WHITE" ? 2 : 7;
    const increment = piece.colour === "WHITE" ? 1 : -1;
    const steps = piece.position.rank === startRank ? 2 : 1;

    const validMoves: StandardMove[] = [];
    for (let i = 1; i <= steps; i++) {
      const newRank = (piece.position.rank + i * increment) as Rank;

      if (newRank) {
        const pieceAt = this.getPieceAt({
          rank: newRank,
          file: piece?.position.file,
        });

        if (pieceAt) {
          break;
        }

        validMoves.push({
          move: "Move",
          rank: newRank,
          file: piece.position.file,
        });
      }
    }

    if (piece.position.file !== "a") {
      const fileToCheck = FileArray[FileArray.indexOf(piece.position.file) - 1];
      const rankToCheck = (piece.position.rank + 1 * increment) as Rank;

      const leftFilePiece = this.getPieceAt({
        rank: rankToCheck,
        file: fileToCheck,
      });

      if (leftFilePiece && leftFilePiece.colour !== piece.colour) {
        validMoves.push({
          move: "Move",
          rank: rankToCheck,
          file: fileToCheck,
        });
      }
    }

    if (piece.position.file !== "h") {
      const fileToCheck = FileArray[FileArray.indexOf(piece.position.file) + 1];
      const rankToCheck = (piece.position.rank + 1 * increment) as Rank;

      const leftFilePiece = this.getPieceAt({
        rank: rankToCheck,
        file: fileToCheck,
      });

      if (leftFilePiece && leftFilePiece.colour !== piece.colour) {
        validMoves.push({
          move: "Move",
          rank: rankToCheck,
          file: fileToCheck,
        });
      }
    }

    //TODO: EN-Passant
    return validMoves;
  };
}
