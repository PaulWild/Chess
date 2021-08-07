import {
  File,
  PiecePosition,
  Position,
  Rank,
  ValidMove,
  ValidMoves,
} from "./types";

interface IValidMoves {
  getValidMoves(piece: PiecePosition): ValidMoves;
}

interface IPiece {
  type: "ROOK" | "KNIGHT" | "BISHOP" | "KING" | "QUEEN" | "PAWN";
  colour: "WHITE" | "BLACK";
}

const FileArray: File[] = ["a", "b", "c", "d", "e", "f", "g", "h"];

export abstract class BasePiece implements IValidMoves {
  board: PiecePosition[];
  constructor(board: PiecePosition[]) {
    this.board = board;
  }

  abstract getValidMoves(piece: PiecePosition): ValidMoves;

  getMoveAtPosition = (
    piece: PiecePosition,
    rankDelta: number,
    fileDelta: number
  ): ValidMove | undefined => {
    const newFile = FileArray.indexOf(piece.position.file) + fileDelta;
    const newRank = piece.position.rank + rankDelta;

    if (newRank > 8 || newFile > 7 || newRank < 1 || newFile < 0) {
      return;
    }
    return this.checkPosition(
      piece.colour,
      newRank as Rank,
      FileArray[newFile]
    );
  };

  getMovesOnLine = (
    piece: PiecePosition,
    rankDelta: number,
    fileDelta: number
  ): ValidMoves => {
    const validMoves = [];
    for (let i = 1; i < 8; i++) {
      const newFile = FileArray.indexOf(piece.position.file) + fileDelta * i;
      const newRank = piece.position.rank + rankDelta * i;

      if (newRank > 8 || newFile > 7 || newRank < 1 || newFile < 0) {
        break;
      }

      const move = this.checkPosition(
        piece.colour,
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
    colour: "WHITE" | "BLACK",
    rank: Rank,
    file: File
  ): ValidMove | undefined => {
    if (this.takeAt(rank, file, colour)) {
      return {
        move: "Capture",
        rank: rank,
        file: file,
      };
    }
    if (this.moveTo(rank, file)) {
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
    return pieceAt !== undefined && pieceAt.colour !== colour;
  };

  moveTo = (rank: Rank, file: File): boolean => {
    const pieceAt = this.getPieceAt({ rank: rank as Rank, file });
    return pieceAt === undefined;
  };

  getPieceAt = (position: Position) => {
    return this.board.find(
      (x) =>
        x.position.rank === position.rank && x.position.file === position?.file
    );
  };
}
