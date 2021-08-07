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
  getValidMoves(position: Position, board: Board): ValidMoves;

  canMove(from: Position, to: Position, board: Board): ValidMove | InvalidMove;
}

interface IPiece {
  pieceType: PieceType;
  colour: PieceColour;
  moved: boolean;
}

export abstract class BasePiece implements IValidMoves, IPiece {
  abstract pieceType: PieceType;
  colour: PieceColour;
  moved: boolean;

  setMoved() {
    this.moved = true;
  }

  constructor(colour: PieceColour) {
    this.colour = colour;
    this.moved = false;
  }

  canMove(from: Position, to: Position, board: Board): ValidMove | InvalidMove {
    const allMoves = this.getValidMoves(from, board);

    const potentialMove = allMoves.find(
      (position) => position.file === to.file && position.rank === to.rank
    );

    if (!potentialMove) return { move: "INVALID" };

    const potentialBoard = board.board.filter(
      (x) =>
        !(x.position.rank === from.rank && x.position.file === from.file) &&
        !(x.position.rank === to.rank && x.position.file === to.file)
    );

    potentialBoard.push({
      piece: this,
      position: {
        rank: to.rank,
        file: to.file,
      },
    });

    const m: ValidMove | InvalidMove = !new Board(potentialBoard).KingInCheck(
      this.colour
    )
      ? potentialMove
      : { move: "INVALID" };

    return m;
  }

  abstract getValidMoves(from: Position, board: Board): ValidMoves;
}
