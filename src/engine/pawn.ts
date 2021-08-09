import { BasePiece } from "./basePiece";
import { Board } from "./board";
import { PieceType, Position, ValidMoves } from "./types";

export class Pawn extends BasePiece {
  pieceType = "PAWN" as PieceType;

  getPotentialMoves = (position: Position, board: Board) => {
    const increment = this.colour === "WHITE" ? 1 : -1;

    const moveDeltas = this.moved
      ? [1 * increment]
      : [1 * increment, 2 * increment];

    const captureDeltas = [
      [increment, 1],
      [increment, -1],
    ];

    const moves: ValidMoves = moveDeltas
      .map((rd) => board.getMoveAtPosition(position, this, rd, 0))
      .filter(board.isStandardMove)
      .filter((x) => x.move === "Move" || x.move === "PawnPush");

    const captures: ValidMoves = captureDeltas
      .map(([rd, fd]) => board.getMoveAtPosition(position, this, rd, fd))
      .filter(board.isStandardMove)
      .filter((x) => x.move === "Capture" || x.move === "CaptureEnPassant");

    return [...moves, ...captures];
  };
}
