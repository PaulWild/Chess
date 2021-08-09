import { BasePiece } from "./basePiece";
import { Bishop } from "./bishop";
import { Board } from "./board";
import { Rook } from "./rook";
import { PieceType, Position } from "./types";

export class Queen extends BasePiece {
  pieceType = "QUEEN" as PieceType;

  getPotentialMoves = (position: Position, board: Board) => {
    return [
      ...new Rook(this.colour).getPotentialMoves(position, board),
      ...new Bishop(this.colour).getPotentialMoves(position, board),
    ];
  };
}
