import { PieceColour, PieceType } from "./types";

export interface IPiece {
  pieceType: PieceType;
  colour: PieceColour;
}

abstract class BasePiece implements IPiece {
  abstract pieceType: PieceType;
  colour: PieceColour;

  constructor(colour: PieceColour) {
    this.colour = colour;
  }
}

export class Bishop extends BasePiece {
  pieceType = "BISHOP" as PieceType;
}

export class King extends BasePiece {
  pieceType = "KING" as PieceType;
}

export class Knight extends BasePiece {
  pieceType = "KNIGHT" as PieceType;
}

export class Queen extends BasePiece {
  pieceType = "QUEEN" as PieceType;
}

export class Rook extends BasePiece {
  pieceType = "ROOK" as PieceType;
}

export class Pawn extends BasePiece {
  pieceType = "PAWN" as PieceType;
}
