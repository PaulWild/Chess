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

export const KingInCheck = (
  colour: "WHITE" | "BLACK",
  board: Board
): Boolean => {
  const kingPosition = board.board.find(
    (x) => x.piece.pieceType === "KING" && x.piece.colour === colour
  );

  return board.board
    .filter((x) => x.piece.colour !== colour)
    .flatMap((x) => x.piece.getValidMoves(x.position, board))
    .some(
      (x) =>
        (x as Position).file === kingPosition?.position.file &&
        (x as Position).rank === kingPosition?.position.rank
    );
};
export class Board {
  private _board: PiecePosition[];

  public get board() {
    return this._board;
  }

  enPassant: PiecePosition | undefined;

  constructor(
    initialPositions: PiecePosition[],
    enPassant: PiecePosition | undefined = undefined
  ) {
    this._board = initialPositions;
    this.enPassant = enPassant;
  }

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
    if (this.takeAt(rank, file, piece.colour)) {
      return {
        move: "Capture",
        rank: rank,
        file: file,
      };
    }
    if (this.takeEnPassant(rank, file, piece)) {
      return {
        move: "CaptureEnPassant",
        rank: rank,
        file: file,
      };
    }
    if (this.moveTo(rank, file)) {
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

  takeAt = (rank: Rank, file: File, colour: "WHITE" | "BLACK"): boolean => {
    const pieceAt = this.getPieceAt({ rank: rank as Rank, file });
    return pieceAt !== undefined && pieceAt.piece.colour !== colour;
  };

  takeEnPassant = (rank: Rank, file: File, piece: BasePiece): boolean => {
    if (piece.pieceType !== "PAWN") return false;
    if (!this.enPassant) return false;

    return (
      this.enPassant.position.file === file &&
      this.enPassant.position.rank ===
        rank + (piece.colour === "WHITE" ? -1 : 1) &&
      this.enPassant.piece.colour !== piece.colour
    );
  };

  moveTo = (rank: Rank, file: File): boolean => {
    const pieceAt = this.getPieceAt({ rank: rank as Rank, file });
    return pieceAt === undefined;
  };

  getPieceAt = (position: Position) => {
    return this._board.find(
      (x) =>
        x.position.rank === position.rank && x.position.file === position.file
    );
  };

  KingInCheck = (colour: "WHITE" | "BLACK"): Boolean => {
    const kingPosition = this.board.find(
      (x) => x.piece.pieceType === "KING" && x.piece.colour === colour
    );

    return this.board
      .filter((x) => x.piece.colour !== colour)
      .flatMap((x) => x.piece.getValidMoves(x.position, this))
      .some(
        (x) =>
          (x as Position).file === kingPosition?.position.file &&
          (x as Position).rank === kingPosition?.position.rank
      );
  };
}
