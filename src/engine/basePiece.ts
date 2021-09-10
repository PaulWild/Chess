import { Board, FileArray } from "./board";
import { IPiece } from "./pieces";

import {
  InvalidMove,
  Position,
  Rank,
  ValidMove,
  ValidMoves,
  File,
  PieceColour,
} from "./types";

interface IValidMoves {
  getPotentialMoves(position: Position): ValidMoves;

  canMove(from: Position, to: Position): ValidMove | InvalidMove;
}

abstract class BaseValidator implements IValidMoves {
  piece: IPiece;
  board: Board;

  constructor(piece: IPiece, board: Board) {
    this.piece = piece;
    this.board = board;
  }

  moves(from: Position): ValidMoves {
    const allMoves = this.getPotentialMoves(from);
    return allMoves.filter((x) => {
      const clone = this.board.clone();
      clone.move(from, { rank: x.rank, file: x.file });

      return !getMoveValidator(this.piece, clone).isKingInCheck(
        this.piece.colour
      );
    });
  }

  canMove(from: Position, to: Position): ValidMove | InvalidMove {
    const allMoves = this.getPotentialMoves(from);

    const potentialMove = allMoves.find(
      (position) => position.file === to.file && position.rank === to.rank
    );

    if (!potentialMove) return { move: "INVALID" };

    const clone = this.board.clone();
    clone.move(from, to);

    const m: ValidMove | InvalidMove = !getMoveValidator(
      this.piece,
      clone
    ).isKingInCheck(this.piece.colour)
      ? potentialMove
      : { move: "INVALID" };

    return m;
  }

  getMoveAtPosition = (
    position: Position,
    rankDelta: number,
    fileDelta: number
  ): ValidMove | undefined => {
    const newFile = FileArray.indexOf(position.file) + fileDelta;
    const newRank = position.rank + rankDelta;

    if (newRank > 8 || newFile > 7 || newRank < 1 || newFile < 0) {
      return;
    }
    return this.checkPosition(newRank as Rank, FileArray[newFile]);
  };

  getMovesOnLine = (
    position: Position,
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

      const move = this.checkPosition(newRank as Rank, FileArray[newFile]);

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

  checkPosition = (rank: Rank, file: File): ValidMove | undefined => {
    if (this.canTakeAt(rank, file)) {
      return {
        move: "Capture",
        rank: rank,
        file: file,
      };
    }
    if (this.canTakeEnPassant(rank, file)) {
      return {
        move: "CaptureEnPassant",
        rank: rank,
        file: file,
      };
    }
    if (this.canMoveTo(rank, file)) {
      if (
        this.piece.pieceType === "PAWN" &&
        !this.board.pieceMoved(this.piece) &&
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

  canTakeAt = (rank: Rank, file: File): boolean => {
    const square = this.board.getPieceAt({ rank: rank as Rank, file });

    return square.piece !== null && square.piece.colour !== this.piece.colour;
  };

  canTakeEnPassant = (rank: Rank, file: File): boolean => {
    if (this.piece.pieceType !== "PAWN") return false;
    if (!this.board.enPassant) return false;

    return (
      this.board.enPassant.file === file &&
      this.board.enPassant.rank ===
        rank + (this.piece.colour === "WHITE" ? -1 : 1)
    );
  };

  canMoveTo = (rank: Rank, file: File): boolean => {
    const pieceAt = this.board.getPieceAt({ rank: rank as Rank, file });
    return pieceAt.piece === null;
  };

  isKingInCheck = (colour: PieceColour): Boolean => {
    const kingPosition = this.board.getKing(colour);

    return this.board
      .getPieces(colour === "WHITE" ? "BLACK" : "WHITE")
      .flatMap((x) =>
        getMoveValidator(x.piece as IPiece, this.board).getPotentialMoves({
          file: x.file,
          rank: x.rank,
        })
      )
      .some(
        (x) =>
          (x as Position).file === kingPosition?.file &&
          (x as Position).rank === kingPosition?.rank
      );
  };

  abstract getPotentialMoves(from: Position): ValidMoves;
}

export class BishopValidator extends BaseValidator {
  getPotentialMoves(from: Position): ValidMoves {
    return [
      ...this.getMovesOnLine(from, -1, -1),
      ...this.getMovesOnLine(from, 1, 1),
      ...this.getMovesOnLine(from, 1, -1),
      ...this.getMovesOnLine(from, -1, 1),
    ];
  }
}

export class RookValidator extends BaseValidator {
  getPotentialMoves(from: Position): ValidMoves {
    return [
      ...this.getMovesOnLine(from, 1, 0),
      ...this.getMovesOnLine(from, 0, 1),
      ...this.getMovesOnLine(from, 0, -1),
      ...this.getMovesOnLine(from, -1, 0),
    ];
  }
}

export class QueenValidator extends BaseValidator {
  getPotentialMoves(from: Position): ValidMoves {
    return [
      ...new RookValidator(this.piece, this.board).getPotentialMoves(from),
      ...new BishopValidator(this.piece, this.board).getPotentialMoves(from),
    ];
  }
}

export class KnightValidator extends BaseValidator {
  getPotentialMoves(from: Position): ValidMoves {
    const moveDeltas = [
      [1, 2],
      [2, 1],
      [-1, 2],
      [-2, 1],
      [-1, -2],
      [-2, -1],
      [1, -2],
      [2, -1],
    ];

    const piece = this.board.getPieceAt(from);
    if (piece.piece === null) {
      throw new Error("nope");
    }

    return moveDeltas
      .map(([rd, fd]) => this.getMoveAtPosition(from, rd, fd))
      .filter(this.isStandardMove);
  }
}

export class PawnValidator extends BaseValidator {
  getPotentialMoves(from: Position): ValidMoves {
    const increment = this.piece.colour === "WHITE" ? 1 : -1;

    const moveDeltas = this.board.pieceMoved(this.piece)
      ? [1 * increment]
      : [1 * increment, 2 * increment];

    const captureDeltas = [
      [increment, 1],
      [increment, -1],
    ];

    const moves: ValidMoves = moveDeltas
      .map((rd) => this.getMoveAtPosition(from, rd, 0))
      .filter(this.isStandardMove)
      .filter((x) => x.move === "Move" || x.move === "PawnPush");

    const captures: ValidMoves = captureDeltas
      .map(([rd, fd]) => this.getMoveAtPosition(from, rd, fd))
      .filter(this.isStandardMove)
      .filter((x) => x.move === "Capture" || x.move === "CaptureEnPassant");

    return [...moves, ...captures];
  }
}

export class KingValidator extends BaseValidator {
  getPotentialMoves(from: Position): ValidMoves {
    let validMoves: ValidMoves = [];
    const moveDeltas = [
      [1, 1],
      [0, 1],
      [1, 0],
      [-1, 0],
      [-1, -1],
      [0, -1],
      [-1, 1],
      [1, -1],
    ];

    const file = FileArray.indexOf(from.file);
    const rank = from.rank;

    validMoves = moveDeltas
      .map(([rd, fd]) => this.getMoveAtPosition(from, rd, fd))
      .filter(this.isStandardMove);

    if (this.canCastle("SHORT"))
      validMoves.push({
        move: "Castle",
        type: "SHORT",
        colour: this.piece.colour,
        rank: rank,
        file: FileArray[file + 2],
      });

    if (this.canCastle("LONG"))
      validMoves.push({
        move: "Castle",
        type: "LONG",
        colour: this.piece.colour,
        rank: rank,
        file: FileArray[file - 2],
      });

    return validMoves;
  }

  private castlingDeltas = (type: "SHORT" | "LONG") =>
    type === "SHORT" ? [0, 1, 2] : [0, -1, -2];

  private canCastle(type: "SHORT" | "LONG") {
    const moveDeltas = this.castlingDeltas(type);
    const rookFile = type === "SHORT" ? "h" : "a";
    const kingRank = this.piece.colour === "WHITE" ? 1 : 8;

    if (this.board.pieceMoved(this.piece)) return false;

    const rook = this.board.getPieceAt({ rank: kingRank, file: rookFile });
    if (!(rook.piece && !this.board.pieceMoved(rook.piece))) return false;

    return moveDeltas.every((fileDelta) => {
      const newFile = 4 + fileDelta;

      const pieceAt = this.board.getPieceAt({
        file: FileArray[newFile],
        rank: kingRank,
      });

      if (pieceAt.piece === null || fileDelta === 0) {
        const clone = this.board.clone();
        clone.move(
          { rank: kingRank, file: "e" },
          { rank: kingRank, file: FileArray[newFile] }
        );

        return !getMoveValidator(this.piece, clone).isKingInCheck(
          this.piece.colour
        );
      }
      return false;
    });
  }
}

export const getMoveValidator = (
  piece: IPiece,
  board: Board
): BaseValidator => {
  switch (piece.pieceType) {
    case "BISHOP":
      return new BishopValidator(piece, board);
    case "KING":
      return new KingValidator(piece, board);
    case "KNIGHT":
      return new KnightValidator(piece, board);
    case "PAWN":
      return new PawnValidator(piece, board);
    case "QUEEN":
      return new QueenValidator(piece, board);
    case "ROOK":
      return new RookValidator(piece, board);
  }
};
