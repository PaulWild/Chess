import { getMoveValidator } from "./basePiece";
import { Board } from "./board";
import { buildBoard } from "./initial-board";
import { IPiece } from "./pieces";
import { File, GameState, PieceColour, Position } from "./types";

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

    if (!square.piece) throw new Error("No Piece to move");

    const move = getMoveValidator(square.piece, this._board).canMove(from, to);

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

    this.changeState();
  }

  private checkMate(colour: PieceColour) {
    const king = this._board.getKing(colour);
    const validator = getMoveValidator(king.piece as IPiece, this._board);
    const kingInCheck = validator.isKingInCheck(colour);

    if (kingInCheck) {
      const pieces = this._board.getPieces(colour).flatMap((x) => {
        const validator = getMoveValidator(x.piece as IPiece, this._board);
        return validator.moves({ rank: x.rank, file: x.file });
      });
      return pieces.length === 0;
    }
    return false;
  }

  private staleMate(colour: PieceColour) {
    const pieces = this._board.getPieces(colour);
    const hasMoves = pieces.flatMap((x) => {
      const validator = getMoveValidator(x.piece as IPiece, this._board);
      return validator.moves({ rank: x.rank, file: x.file });
    });

    return hasMoves.length === 0;
  }

  private changeState() {
    switch (this._state) {
      case "BlackWin":
      case "StaleMate":
      case "WhiteWin":
      case "DrawRepition3":
      case "DrawRepition5":
        break;
      case "WhiteMove": {
        if (this.checkMate("BLACK")) {
          this._state = "WhiteWin";
        } else if (this.staleMate("BLACK")) {
          this._state = "StaleMate";
        } else {
          this._state = "BlackMove";
        }
        break;
      }
      case "BlackMove": {
        if (this.checkMate("WHITE")) {
          this._state = "BlackWin";
        } else if (this.staleMate("WHITE")) {
          this._state = "StaleMate";
        } else {
          this._state = "WhiteMove";
        }
        break;
      }
    }
    console.log(this._state);
  }
}
