import { Board } from "./board";
import {
  InvalidMove,
  PieceColour,
  PieceType,
  Position,
  ValidMove,
  ValidMoves,
} from "./types";

interface IValidMoves {
  getPotentialMoves(position: Position, board: Board): ValidMoves;

  canMove(from: Position, to: Position, board: Board): ValidMove | InvalidMove;
}

interface IPiece {
  pieceType: PieceType;
  colour: PieceColour;
}

export abstract class BasePiece implements IValidMoves, IPiece {
  abstract pieceType: PieceType;
  colour: PieceColour;

  constructor(colour: PieceColour) {
    this.colour = colour;
  }

  canMove(from: Position, to: Position, board: Board): ValidMove | InvalidMove {
    const allMoves = this.getPotentialMoves(from, board);

    console.log(allMoves);
    const potentialMove = allMoves.find(
      (position) => position.file === to.file && position.rank === to.rank
    );

    if (!potentialMove) return { move: "INVALID" };

    const clone = board.clone();
    clone.move(from, to);

    const m: ValidMove | InvalidMove = !clone.isKingInCheck(this.colour)
      ? potentialMove
      : { move: "INVALID" };

    return m;
  }

  abstract getPotentialMoves(from: Position, board: Board): ValidMoves;
}
