import { BasePiece } from "./basePiece";
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
  private _board: PiecePosition[];

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
    initialPositions: PiecePosition[],
    enPassant: Position | undefined = undefined
  ) {
    this._board = initialPositions;
    this.enPassant = enPassant;
  }

  move = (from: Position, to: Position) => {
    console.log(this.enPassant, "enPassant");
    const pieceToMove = this.getPieceAt(from);
    if (!pieceToMove) throw new Error("no piece to move");

    this._board = this._board.filter(
      (x) =>
        !(x.position.rank === from.rank && x.position.file === from.file) &&
        !(x.position.rank === to.rank && x.position.file === to.file)
    );

    pieceToMove.piece.setMoved();
    this._board.push({
      piece: pieceToMove.piece,
      position: {
        rank: to.rank,
        file: to.file,
      },
    });
  };

  remove = (position: Position) => {
    const pieceToRemove = this.getPieceAt(position);
    if (!pieceToRemove) throw new Error("no piece to remove");

    this._board = this._board.filter(
      (x) =>
        !(
          x.position.rank === position.rank && x.position.file === position.file
        )
    );
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
    const pieceAt = this.getPieceAt({ rank: rank as Rank, file });
    return pieceAt !== undefined && pieceAt.piece.colour !== colour;
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
    return pieceAt === undefined;
  };

  getPieceAt = (position: Position) => {
    return this._board.find(
      (x) =>
        x.position.rank === position.rank && x.position.file === position.file
    );
  };

  isKingInCheck = (colour: "WHITE" | "BLACK"): Boolean => {
    const kingPosition = this.board.find(
      (x) => x.piece.pieceType === "KING" && x.piece.colour === colour
    );

    return this.board
      .filter((x) => x.piece.colour !== colour)
      .flatMap((x) => x.piece.getPotentialMoves(x.position, this))
      .some(
        (x) =>
          (x as Position).file === kingPosition?.position.file &&
          (x as Position).rank === kingPosition?.position.rank
      );
  };
}
