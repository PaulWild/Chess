import { getMoveValidator } from "./validators";
import { Board } from "./board";
import { buildBoard } from "./initial-board";
import { IPiece } from "./pieces";
import { Square } from "./square";
import {
  CastlingRights,
  File,
  GameState,
  PieceColour,
  Position,
  Rank,
} from "./types";

export class Game {
  private _board: Board;

  public get board(): Board {
    return this._board;
  }

  constructor() {
    this._board = new Board(buildBoard());
    this._state = "WhiteMove";
    this._fullMoves = 1;
    this._halfMoves = 0;
    this._castlingAbility =
      CastlingRights.K | CastlingRights.Q | CastlingRights.k | CastlingRights.q;
  }

  // Full moves, used in FEN notation
  private _fullMoves: number;

  // Hald moves, used in FEN notation
  private _halfMoves: number;

  // Game Engine knows about en-Pessant
  private get _enPessantFen(): string {
    return this._enPessantSquare
      ? `${this._enPessantSquare.file}${this._enPessantSquare.rank}`
      : "-";
  }

  private _enPessantSquare: Position | undefined;

  private _castlingAbility: CastlingRights;

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

    const piece = square.piece;
    const move = getMoveValidator(
      square.piece,
      this._board,
      this._enPessantSquare,
      this._castlingAbility
    ).canMove(from, to);

    switch (move.move) {
      case "INVALID":
        return;
      case "Move":
      case "PawnPush":
      case "CaptureEnPassant":
      case "Capture": {
        if (move.move === "CaptureEnPassant") {
          if (!this._enPessantSquare) throw new Error("no enPassant");
          this._board.remove({
            rank: from.rank,
            file: this._enPessantSquare.file,
          });
        }
        this._board.move(from, to);

        if (move.move === "PawnPush") {
          let r = to.rank;
          if (piece.colour === "WHITE") {
            r -= 1;
          } else {
            r += 1;
          }
          this._enPessantSquare = { rank: r as Rank, file: move.file };
        } else {
          this._enPessantSquare = undefined;
        }

        if (piece.pieceType === "KING") {
          if (piece.colour === "WHITE") {
            this._castlingAbility &= ~CastlingRights.K;
            this._castlingAbility &= ~CastlingRights.Q;
          }
          if (piece.colour === "BLACK") {
            this._castlingAbility &= ~CastlingRights.k;
            this._castlingAbility &= ~CastlingRights.q;
          }
        }

        if (piece.pieceType === "ROOK") {
          if (from.rank === 1 && from.file === "a") {
            this._castlingAbility &= ~CastlingRights.Q;
          }

          if (from.rank === 1 && from.file === "h") {
            this._castlingAbility &= ~CastlingRights.K;
          }

          if (from.rank === 8 && from.file === "a") {
            this._castlingAbility &= ~CastlingRights.q;
          }

          if (from.rank === 8 && from.file === "h") {
            this._castlingAbility &= ~CastlingRights.k;
          }
        }

        if (move.move === "Capture") {
          if (to.rank === 1 && to.file === "a") {
            this._castlingAbility &= ~CastlingRights.Q;
          }

          if (to.rank === 1 && to.file === "h") {
            this._castlingAbility &= ~CastlingRights.K;
          }

          if (to.rank === 8 && to.file === "a") {
            this._castlingAbility &= ~CastlingRights.q;
          }

          if (to.rank === 8 && to.file === "h") {
            this._castlingAbility &= ~CastlingRights.k;
          }
        }

        //FEN stuff
        if (
          move.move === "Capture" ||
          move.move === "CaptureEnPassant" ||
          move.move === "PawnPush" ||
          (move.move === "Move" && piece.pieceType === "PAWN")
        ) {
          this._halfMoves = 0;
        } else {
          this._halfMoves += 1;
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
        if (piece.colour === "WHITE") {
          this._castlingAbility &= ~CastlingRights.K;
          this._castlingAbility &= ~CastlingRights.Q;
        }
        if (piece.colour === "BLACK") {
          this._castlingAbility &= ~CastlingRights.k;
          this._castlingAbility &= ~CastlingRights.q;
        }
      }
    }

    this.changeState();
    console.log(this.getFenString());
  }

  private getFenString(): string {
    if (this._state === "BlackMove" || this._state === "WhiteMove") {
      return `${this._board.fenPlacement} ${
        this._state === "WhiteMove" ? "w" : "b"
      } ${this.castlingAbilityString()} ${this._enPessantFen} ${
        this._halfMoves
      } ${this._fullMoves}`;
    } else {
      return "";
    }
  }

  private castlingAbilityString(): string {
    let str = "";
    if (this._castlingAbility & CastlingRights.K) str += "K";
    if (this._castlingAbility & CastlingRights.Q) str += "Q";
    if (this._castlingAbility & CastlingRights.k) str += "k";
    if (this._castlingAbility & CastlingRights.q) str += "q";

    return str === "" ? "-" : str;
  }

  private checkMate(colour: PieceColour) {
    const king = this.getKing(colour);
    const validator = getMoveValidator(king.piece as IPiece, this._board);
    const kingInCheck = validator.isKingInCheck();

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

  private getKing = (colour: PieceColour): Square => {
    const king = this.board
      .getPieces(colour)
      .find((x) => x.piece?.pieceType === "KING");

    if (!king) {
      throw new Error("Where's the king?");
    }
    return king;
  };

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
        this._fullMoves += 1;
        break;
      }
    }
  }
}
