import { BasePiece } from "./basePiece";
import { Bishop } from "./bishop";
import { Rook } from "./rook";
import { PiecePosition } from "./types";

export class Queen extends BasePiece {
  getValidMoves = (piece: PiecePosition) => {
    return [
      ...new Rook(this.board).getValidMoves(piece),
      ...new Bishop(this.board).getValidMoves(piece),
    ];
  };
}
