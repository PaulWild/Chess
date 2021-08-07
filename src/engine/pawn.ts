import { BasePiece } from "./basePiece";
import { Board } from "./board";
import { PieceType, Position, ValidMoves } from "./types";

export class Pawn extends BasePiece {
  pieceType = "PAWN" as PieceType;

  getValidMoves = (position: Position, board: Board) => {
    const increment = this.colour === "WHITE" ? 1 : -1;

    const moveDeltas = this.moved
      ? [[1 * increment, 0]]
      : [
          [1 * increment, 0],
          [2 * increment, 0],
        ];

    const captureDeltas = [
      [increment, 1],
      [increment, -1],
    ];

    const moves: ValidMoves = moveDeltas
      .map(([rd, fd]) => board.getMoveAtPosition(position, this, rd, fd))
      .filter(board.isStandardMove)
      .filter((x) => x.move === "Move");

    const captures: ValidMoves = captureDeltas
      .map(([rd, fd]) => board.getMoveAtPosition(position, this, rd, fd))
      .filter(board.isStandardMove)
      .filter((x) => x.move === "Capture");

    //TODO: EN-Passant
    return [...moves, ...captures];
  };
}
