import { getMoveValidator } from "./basePiece";
import { Board } from "./board";
import { buildBoard } from "./initial-board";
import { IPiece } from "./pieces";
import { CatlingRights, File, GameState, PieceColour, Position } from "./types";

export class Game {
  private _board: Board;

  public get board(): Board {
    return this._board;
  }

  constructor() {
    this._board = new Board(buildBoard());
    console.log(this._board.getFenPlacement());
    this._state = "WhiteMove";
    this._fullMoves = 1;
    this._halfMoves = 0;
    this._enPessantFen = "-";
    this._castlingAbility =
      CatlingRights.K | CatlingRights.Q | CatlingRights.k | CatlingRights.q;
  }

  // Full moves, used in FEN notation
  private _fullMoves: number;

  // Hald moves, used in FEN notation
  private _halfMoves: number;

  // Game Engine knows about en-Pessant
  private _enPessantFen: String;

  private _castlingAbility: CatlingRights;

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
          let r = to.rank;
          if (piece.colour === "WHITE") {
            r -= 1;
          } else {
            r += 1;
          }
          this._enPessantFen = `${to.file}${r}`;
        } else {
          this._board.enPassant = undefined;
          this._enPessantFen = "-";
        }

        // //FEN stuff
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
      }
    }

    this.changeState();
    console.log(this.getFenString());
  }

  private getFenString(): string {
    if (this._state === "BlackMove" || this._state === "WhiteMove") {
      return `${this._board.getFenPlacement()} ${
        this._state === "WhiteMove" ? "w" : "b"
      } ${this.castlingAbilityString()} ${this._enPessantFen} ${
        this._halfMoves
      } ${this._fullMoves}`;
    } else {
      return "";
    }
  }

  //CatlingRights.K | CatlingRights.Q | CatlingRights.k | CatlingRights.q;
  private castlingAbilityString(): string {
    let str = "";
    if (this._castlingAbility & CatlingRights.K) str += "K";
    if (this._castlingAbility & CatlingRights.Q) str += "Q";
    if (this._castlingAbility & CatlingRights.k) str += "k";
    if (this._castlingAbility & CatlingRights.q) str += "q";

    return str === "" ? "-" : str;
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
        this._fullMoves += 1;
        break;
      }
    }
    console.log(this._state);
  }
}
