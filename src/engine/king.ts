import { BasePiece } from "./basePiece";
import { Board, FileArray } from "./board";
import { PieceType, Position, ValidMoves } from "./types";

export class King extends BasePiece {
  pieceType = "KING" as PieceType;

  getPotentialMoves = (position: Position, board: Board) => {
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

    const file = FileArray.indexOf(position.file);
    const rank = position.rank;

    validMoves = moveDeltas
      .map(([rd, fd]) => board.getMoveAtPosition(position, this, rd, fd))
      .filter(board.isStandardMove);

    if (this.canCastle(board, "SHORT"))
      validMoves.push({
        move: "Castle",
        type: "SHORT",
        colour: this.colour,
        rank: rank,
        file: FileArray[file + 2],
      });

    if (this.canCastle(board, "LONG"))
      validMoves.push({
        move: "Castle",
        type: "LONG",
        colour: this.colour,
        rank: rank,
        file: FileArray[file - 2],
      });

    return validMoves;
  };

  private castlingDeltas = (type: "SHORT" | "LONG") =>
    type === "SHORT" ? [0, 1, 2] : [0, -1, -2];

  private canCastle(board: Board, type: "SHORT" | "LONG") {
    const moveDeltas = this.castlingDeltas(type);
    const rookFile = type === "SHORT" ? "h" : "a";
    const kingRank = this.colour === "WHITE" ? 1 : 8;

    if (this.moved) return false;

    const rook = board.getPieceAt({ rank: kingRank, file: rookFile });
    if (!(rook.piece && !rook.piece.moved)) return false;

    return moveDeltas.every((fileDelta) => {
      const newFile = 4 + fileDelta;

      const pieceAt = board.getPieceAt({
        file: FileArray[newFile],
        rank: kingRank,
      });

      if (!pieceAt || fileDelta === 0) {
        const clone = board.clone();
        const king = new King(this.colour);
        king.setMoved();
        clone.remove({ rank: kingRank, file: "e" });
        clone.placeAt({ rank: kingRank, file: FileArray[newFile] }, king);

        return !clone.isKingInCheck(this.colour);
      }
      return false;
    });
  }
}
