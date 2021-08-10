import { Board } from "./board";
import InitialBoard from "./initial-board";
import { File, Position } from "./types";

export class Game {
  private _board: Board;

  public get board(): Board {
    return this._board;
  }

  constructor() {
    this._board = new Board(InitialBoard);
  }

  move(from: Position, to: Position) {
    const piece = this._board.getPieceAt(from);

    if (!piece) throw new Error("No Piece to move");

    const move = piece.piece.canMove(from, to, this.board);
    console.log(move);

    switch (move.move) {
      case "INVALID":
        break;
      case "Move":
      case "PawnPush":
      case "CaptureEnPassant":
      case "Capture": {
        if (move.move === "CaptureEnPassant") {
          if (!this._board.enPassant) throw new Error("no enPassant");
          this._board.remove(this._board.enPassant);
        }
        this._board.move(from, to);

        if (move.move === "PawnPush") {
          this._board.enPassant = to;
        } else {
          this._board.enPassant = undefined;
        }
        break;
      }
      case "Castle": {
        this._board.move(from, to);

        const rookFrom = {
          rank: piece.position.rank,
          file: move.type === "SHORT" ? "h" : ("a" as File),
        };

        const rookTo = {
          rank: piece.position.rank,
          file: move.type === "SHORT" ? "f" : ("d" as File),
        };

        this._board.move(rookFrom, rookTo);
      }
    }
  }
}
