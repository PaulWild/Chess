import { BasePiece } from "./basePiece";
import { Square } from "./square";
import {
  File,
  PiecePosition,
  Position,
  Rank,
  ValidMove,
  ValidMoves,
} from "./types";

export const RankArray: Rank[] = [8, 7, 6, 5, 4, 3, 2, 1];
export const FileArray: File[] = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const isLightSquare = (rank: Rank, file: File) => {
  if (rank % 2 === 0 && FileArray.indexOf(file) % 2 === 0) {
    return true;
  } else if (rank % 2 === 1 && FileArray.indexOf(file) % 2 === 1) {
    return true;
  }
  return false;
};

export class Board {
  private _board: Square[];

  public get board() {
    return this._board;
  }

  private _enPassant: Position | undefined;
  public get enPassant(): Position | undefined {
    return this._enPassant;
  }
  public set enPassant(value: Position | undefined) {
    this._enPassant = value;
  }

  constructor(
    initialPositions: Square[],
    enPassant: Position | undefined = undefined
  ) {
    this._board = initialPositions;
    this.enPassant = enPassant;
  }

  clone = () => {
    const board = this._board.map((x) => x.clone());
    return new Board(board, this._enPassant);
  };

  move = (from: Position, to: Position) => {
    console.log(this.enPassant, "enPassant");
    const squareFrom = this.getPieceAt(from);
    const squareTo = this.getPieceAt(to);

    if (!squareFrom.piece) throw new Error("no piece to move");

    squareFrom.piece.setMoved();
    squareTo.place(squareFrom.piece);
    squareFrom.remove();
  };

  remove = (position: Position) => {
    const square = this.getPieceAt(position);
    if (!square.piece) throw new Error("no piece to remove");
    square.remove();
  };

  placeAt = (position: Position, piece: BasePiece) => {
    const square = this.getPieceAt(position);
    square.place(piece);
  };

  getMoveAtPosition = (
    position: Position,
    piece: BasePiece,
    rankDelta: number,
    fileDelta: number
  ): ValidMove | undefined => {
    const newFile = FileArray.indexOf(position.file) + fileDelta;
    const newRank = position.rank + rankDelta;

    if (newRank > 8 || newFile > 7 || newRank < 1 || newFile < 0) {
      return;
    }
    return this.checkPosition(piece, newRank as Rank, FileArray[newFile]);
  };

  getMovesOnLine = (
    position: Position,
    piece: BasePiece,
    rankDelta: number,
    fileDelta: number
  ): ValidMoves => {
    const validMoves = [];
    for (let i = 1; i < 8; i++) {
      const newFile = FileArray.indexOf(position.file) + fileDelta * i;
      const newRank = position.rank + rankDelta * i;

      if (newRank > 8 || newFile > 7 || newRank < 1 || newFile < 0) {
        break;
      }

      const move = this.checkPosition(
        piece,
        newRank as Rank,
        FileArray[newFile]
      );

      if (move === undefined) {
        break;
      }

      validMoves.push(move);

      if (move.move === "Capture") {
        break;
      }
    }
    return validMoves;
  };

  checkPosition = (
    piece: BasePiece,
    rank: Rank,
    file: File
  ): ValidMove | undefined => {
    if (this.canTakeAt(rank, file, piece.colour)) {
      return {
        move: "Capture",
        rank: rank,
        file: file,
      };
    }
    if (this.canTakeEnPassant(rank, file, piece)) {
      return {
        move: "CaptureEnPassant",
        rank: rank,
        file: file,
      };
    }
    if (this.canMoveTo(rank, file)) {
      if (
        piece.pieceType === "PAWN" &&
        !piece.moved &&
        (rank === 4 || rank === 5)
      ) {
        return {
          move: "PawnPush",
          rank: rank,
          file: file,
        };
      }
      return {
        move: "Move",
        rank: rank,
        file: file,
      };
    }
    return undefined;
  };

  isStandardMove = (item: ValidMove | undefined): item is ValidMove => {
    return !!item;
  };

  canTakeAt = (rank: Rank, file: File, colour: "WHITE" | "BLACK"): boolean => {
    const square = this.getPieceAt({ rank: rank as Rank, file });

    return square.piece !== null && square.piece.colour !== colour;
  };

  canTakeEnPassant = (rank: Rank, file: File, piece: BasePiece): boolean => {
    if (piece.pieceType !== "PAWN") return false;
    if (!this.enPassant) return false;

    return (
      this.enPassant.file === file &&
      this.enPassant.rank === rank + (piece.colour === "WHITE" ? -1 : 1)
    );
  };

  canMoveTo = (rank: Rank, file: File): boolean => {
    const pieceAt = this.getPieceAt({ rank: rank as Rank, file });
    return pieceAt.piece === null;
  };

  getPieceAt = (position: Position): Square => {
    const square = this._board.find(
      (x) => x.rank === position.rank && x.file === position.file
    );

    if (square === undefined) throw new Error("Out of bounds");

    return square;
  };

  isKingInCheck = (colour: "WHITE" | "BLACK"): Boolean => {
    const kingPosition = this.board.find(
      (x) => x.piece?.pieceType === "KING" && x.piece.colour === colour
    );

    return this.board
      .filter((x) => x.piece !== null && x.piece.colour !== colour)
      .flatMap((x) =>
        x.piece?.getPotentialMoves({ file: x.file, rank: x.rank }, this)
      )
      .some(
        (x) =>
          (x as Position).file === kingPosition?.file &&
          (x as Position).rank === kingPosition?.rank
      );
  };
}
