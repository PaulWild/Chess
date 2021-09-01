import { getMoveValidator } from "./basePiece";
import { Board } from "./board";
import { buildBoard } from "./initial-board";
import { File, GameState, Position } from "./types";

export class Game {
  private _board: Board;

  public get board(): Board {
    return this._board;
  }

  constructor() {
    this._board = new Board(buildBoard());
    this._state = "WhiteMove";
  }

  private _state: GameState;

  public get state(): GameState {
    return this._state;
  }

  move(from: Position, to: Position) {
    if (this._state !== "BlackMove" && this._state !== "WhiteMove") {
      return;
    }

    const square = this._board.getPieceAt(from);

    if (this._state === "BlackMove" && square.piece?.colour === "WHITE") {
      return;
    }

    if (this._state === "WhiteMove" && square.piece?.colour === "BLACK") {
      return;
    }

    console.log(square);
    if (!square.piece) throw new Error("No Piece to move");

    const move = getMoveValidator(square.piece, this._board).canMove(from, to);
    console.log(move);

    switch (move.move) {
      case "INVALID":
        return;
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
          rank: square.rank,
          file: move.type === "SHORT" ? "h" : ("a" as File),
        };

        const rookTo = {
          rank: square.rank,
          file: move.type === "SHORT" ? "f" : ("d" as File),
        };

        this._board.move(rookFrom, rookTo);
      }
    }

    this._state = this._state === "WhiteMove" ? "BlackMove" : "WhiteMove";
  }
}
