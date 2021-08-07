import { BasePiece } from "./basePiece";
import { Bishop } from "./bishop";
import { Board } from "./board";
import { Rook } from "./rook";
import { PieceType, Position } from "./types";

export class Queen extends BasePiece {
  pieceType = "QUEEN" as PieceType;

  getValidMoves = (position: Position, board: Board) => {
    return [
      ...new Rook(this.colour).getValidMoves(position, board),
      ...new Bishop(this.colour).getValidMoves(position, board),
    ];
  };
}
