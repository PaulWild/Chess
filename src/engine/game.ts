import { getMoveValidator } from "./validators";
import { Board } from "./board";
import { buildBoard } from "./initial-board";
import { Square } from "./square";
import { Bishop, IPiece, Knight, Queen, Rook } from "./pieces";
import {
  CastlingRights,
  File,
  GameState,
  PieceColour,
  PieceType,
  Position,
  Rank,
} from "./types";
import { boardAsFenPlacement } from "./fen";

type GameIntState = {
  board: Board;
  halfMoves: number;
  fullMoves: number;
  state: GameState;
  castlingAbility: CastlingRights;
  enPassantSquare: Position | undefined;
};
export class Game {
  public get board(): Board {
    return this._intState.board;
  }

  private _intState: GameIntState;

  /**
   *
   */
  constructor(
    board: Board = new Board(buildBoard()),
    state: GameState = "WhiteMove",
    fullMoves: number = 0,
    halfMoves: number = 0,
    castlingAbility: CastlingRights = CastlingRights.K |
      CastlingRights.Q |
      CastlingRights.k |
      CastlingRights.q,
    enPassantSquare: undefined | Position = undefined
  ) {
    this._intState = {
      board,
      halfMoves,
      fullMoves,
      castlingAbility,
      state,
      enPassantSquare,
    };
  }

  clone() {
    return new Game(
      this._intState.board.clone(),
      this._intState.state,
      this._intState.fullMoves,
      this._intState.halfMoves,
      this._intState.castlingAbility,
      this._intState.enPassantSquare
    );
  }

  private seenBoardPositions: Record<string, number> = {};

  public get FullMoves() {
    return this._intState.fullMoves;
  }

  public get HalfMoves() {
    return this._intState.halfMoves;
  }

  public get enPassantSquare() {
    return this._intState.enPassantSquare;
  }

  public get CastlingAbility() {
    return this._intState.castlingAbility;
  }

  public get state(): GameState {
    return this._intState.state;
  }

  *moves(colour: PieceColour) {
    const pieces = this.board.getPieces(colour);
    const king = pieces.find((x) => x.piece?.pieceType === "KING") as Square;
    const rest = pieces.filter(
      (x) => x.piece?.pieceType !== "KING"
    ) as Square[];

    for (const piece of [king, ...rest]) {
      const validators = getMoveValidator(
        piece.piece as IPiece,
        this,
        this.enPassantSquare,
        this.CastlingAbility
      );
      const potential = validators.potentialMoves({
        rank: piece.rank,
        file: piece.file,
      });

      for (const p of potential) {
        const clone = this.clone();
        if (
          clone.move(
            { file: piece.file, rank: piece.rank },
            { file: p.file, rank: p.rank }
          )
        ) {
          yield p;
        }
      }
    }
  }

  promote(pieceType: PieceType) {
    if (this.state === "BlackPromote" || this.state === "WhitePromote") {
      const colour: PieceColour =
        this.state === "BlackPromote" ? "BLACK" : "WHITE";
      const rank: Rank = this.state === "BlackPromote" ? 1 : 8;

      const pawn = this.board
        .getPieces(colour)
        .find((x) => x.piece?.pieceType === "PAWN" && x.rank === rank);

      this.board.remove(pawn!);

      let piece;
      switch (pieceType) {
        case "BISHOP":
          piece = new Bishop(colour);
          break;
        case "KNIGHT":
          piece = new Knight(colour);
          break;
        case "QUEEN":
          piece = new Queen(colour);
          break;
        case "ROOK":
          piece = new Rook(colour);
          break;
        default:
          throw new Error("Not a promotable piece");
      }
      this.board.placeAt(pawn!, piece);
      this.changeState(colour);

      return;
    }
  }

  *movesPerf(colour: PieceColour) {
    const pieces = this.board.getPieces(colour);

    for (const piece of pieces) {
      const potentialMoves = getMoveValidator(
        piece.piece as IPiece,
        this,
        this.enPassantSquare,
        this.CastlingAbility
      ).potentialMoves({
        rank: piece.rank,
        file: piece.file,
      });

      for (const potential of potentialMoves) {
        const clone = this.clone();
        if (
          clone.move(
            { file: piece.file, rank: piece.rank },
            { file: potential.file, rank: potential.rank }
          )
        ) {
          yield { move: potential, from: piece };
        }
      }
    }
  }

  move(from: Position, to: Position): Boolean {
    const square = this.board.getPieceAt(from);
    if (!square) {
      throw new Error("No Piece to move");
    }

    const piece = square;

    const state = {
      ...this._intState,
      board: this.board.clone(),
    };

    const madeMove = this.move2(from, to);
    if (madeMove && this.kingInCheck(piece.colour)) {
      this._intState = state;
      return false;
    }
    if (madeMove) {
      this.changeState(piece.colour);
    }

    return madeMove;
  }

  kingInCheck(colour: PieceColour) {
    const kingPosition = this.board
      .getPieces(colour)
      .find((x) => x.piece?.pieceType === "KING");

    const pieces = this.board.getPieces(colour === "WHITE" ? "BLACK" : "WHITE");

    for (const piece of pieces) {
      const moves = getMoveValidator(
        piece.piece as IPiece,
        this
      ).potentialMoves({
        file: piece.file,
        rank: piece.rank,
      });

      for (const move of moves) {
        if (
          move.file === kingPosition?.file &&
          move.rank === kingPosition?.rank
        ) {
          return true;
        }
      }
    }

    return false;
  }

  hasPieceToPromote(colour: PieceColour) {
    const promotionRank = colour === "BLACK" ? 1 : 8;
    const pawns = this.board
      .getPieces(colour)
      .filter((x) => x.piece?.pieceType === "PAWN");
    return pawns.some((x) => x.rank === promotionRank);
  }

  move2(from: Position, to: Position): Boolean {
    const square = this.board.getPieceAt(from);

    if (!square) throw new Error("No Piece to move");

    if (this.state === "BlackMove" && square?.colour === "WHITE") {
      return false;
    }

    if (this.state === "WhiteMove" && square?.colour === "BLACK") {
      return false;
    }

    if (this.state !== "WhiteMove" && this.state !== "BlackMove") {
      return false;
    }

    const piece = square;
    const move = getMoveValidator(
      square!,
      this,
      this.enPassantSquare,
      this.CastlingAbility
    ).canMove(from, to);

    switch (move.move) {
      case "INVALID":
        return false;
      case "Move":
      case "PawnPush":
      case "CaptureEnPassant":
      case "Capture": {
        if (move.move === "CaptureEnPassant") {
          if (!this.enPassantSquare) throw new Error("no enPassant");
          this.board.remove({
            rank: from.rank,
            file: this.enPassantSquare.file,
          });
        }
        this.board.move(from, to);

        if (move.move === "PawnPush") {
          let r = to.rank;
          if (piece!.colour === "WHITE") {
            r -= 1;
          } else {
            r += 1;
          }
          this._intState.enPassantSquare = { rank: r as Rank, file: move.file };
        } else {
          this._intState.enPassantSquare = undefined;
        }

        if (piece!.pieceType === "KING") {
          if (piece!.colour === "WHITE") {
            this._intState.castlingAbility &= ~CastlingRights.K;
            this._intState.castlingAbility &= ~CastlingRights.Q;
          }
          if (piece!.colour === "BLACK") {
            this._intState.castlingAbility &= ~CastlingRights.k;
            this._intState.castlingAbility &= ~CastlingRights.q;
          }
        }

        if (piece!.pieceType === "ROOK") {
          if (from.rank === 1 && from.file === "a") {
            this._intState.castlingAbility &= ~CastlingRights.Q;
          }

          if (from.rank === 1 && from.file === "h") {
            this._intState.castlingAbility &= ~CastlingRights.K;
          }

          if (from.rank === 8 && from.file === "a") {
            this._intState.castlingAbility &= ~CastlingRights.q;
          }

          if (from.rank === 8 && from.file === "h") {
            this._intState.castlingAbility &= ~CastlingRights.k;
          }
        }

        if (move.move === "Capture") {
          if (to.rank === 1 && to.file === "a") {
            this._intState.castlingAbility &= ~CastlingRights.Q;
          }

          if (to.rank === 1 && to.file === "h") {
            this._intState.castlingAbility &= ~CastlingRights.K;
          }

          if (to.rank === 8 && to.file === "a") {
            this._intState.castlingAbility &= ~CastlingRights.q;
          }

          if (to.rank === 8 && to.file === "h") {
            this._intState.castlingAbility &= ~CastlingRights.k;
          }
        }

        //FEN stuff
        if (
          move.move === "Capture" ||
          move.move === "CaptureEnPassant" ||
          move.move === "PawnPush" ||
          (move.move === "Move" && piece!.pieceType === "PAWN")
        ) {
          this._intState.halfMoves = 0;
        } else {
          this._intState.halfMoves += 1;
        }

        break;
      }
      case "Castle": {
        this.board.move(from, to);

        const rookFrom = {
          rank: from.rank,
          file: move.type === "SHORT" ? "h" : ("a" as File),
        };

        const rookTo = {
          rank: from.rank,
          file: move.type === "SHORT" ? "f" : ("d" as File),
        };

        this.board.move(rookFrom, rookTo);
        if (piece!.colour === "WHITE") {
          this._intState.castlingAbility &= ~CastlingRights.K;
          this._intState.castlingAbility &= ~CastlingRights.Q;
        }
        if (piece!.colour === "BLACK") {
          this._intState.castlingAbility &= ~CastlingRights.k;
          this._intState.castlingAbility &= ~CastlingRights.q;
        }
      }
    }

    const boardFen = boardAsFenPlacement(this.board);
    if (this.seenBoardPositions[boardFen]) {
      this.seenBoardPositions[boardFen] += 1;
    } else {
      this.seenBoardPositions[boardFen] = 1;
    }

    return true;
  }

  private checkMate(colour: PieceColour) {
    const kingInCheck = this.kingInCheck(colour);

    if (kingInCheck) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _ of this.moves(colour)) {
        return false;
      }
      return true;
    }
    return false;
  }

  staleMate(colour: PieceColour) {
    const pieces = this.board.getPieces(colour);

    for (const piece of pieces) {
      const validators = getMoveValidator(
        piece.piece as IPiece,
        this,
        this.enPassantSquare,
        this.CastlingAbility
      );
      const potential = validators.potentialMoves({
        rank: piece.rank,
        file: piece.file,
      });

      // eslint-disable-next-line no-empty-pattern
      for (const {} of potential) {
        return false;
      }
    }
    return true;
  }

  private changeState(colourMove: PieceColour) {
    if (Object.values(this.seenBoardPositions).includes(3)) {
      this._intState.state = "DrawRepetition3";
      return;
    }

    switch (this.state) {
      case "BlackWin":
      case "StaleMate":
      case "WhiteWin":
      case "DrawRepetition3":
      case "DrawRepetition5":
        break;
      case "WhitePromote":
      case "WhiteMove": {
        if (colourMove === "BLACK") break;
        this._intState.state = "BlackMove";
        if (this.hasPieceToPromote(colourMove)) {
          this._intState.state = "WhitePromote";
        } else if (this.checkMate("BLACK")) {
          this._intState.state = "WhiteWin";
        } else if (this.staleMate("BLACK")) {
          this._intState.state = "StaleMate";
        }
        break;
      }
      case "BlackPromote":
      case "BlackMove": {
        if (colourMove === "WHITE") break;
        this._intState.state = "WhiteMove";
        if (this.hasPieceToPromote(colourMove)) {
          this._intState.state = "BlackPromote";
        } else if (this.checkMate("WHITE")) {
          this._intState.state = "BlackWin";
        } else if (this.staleMate("WHITE")) {
          this._intState.state = "StaleMate";
        }
        this._intState.fullMoves += 1;
        break;
      }
    }
  }
}
