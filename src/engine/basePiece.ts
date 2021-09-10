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
  CastlingRights,
} from "./types";

const invalidMove: InvalidMove = { move: "INVALID" };

interface IValidMoves {
  getPotentialMoves(position: Position): ValidMoves;

  canMove(from: Position, to: Position): ValidMove | InvalidMove;
}

abstract class BaseValidator implements IValidMoves {
  piece: IPiece;
  board: Board;
  enPassantTarget: Position | undefined;
  castlingRights: CastlingRights;

  constructor(
    piece: IPiece,
    board: Board,
    enPassantTarget: Position | undefined,
    castlingRights: CastlingRights
  ) {
    this.piece = piece;
    this.board = board;
    this.enPassantTarget = enPassantTarget;
    this.castlingRights = castlingRights;
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

    return !getMoveValidator(this.piece, clone).isKingInCheck(this.piece.colour)
      ? potentialMove
      : invalidMove;
  }

  getMoveAtPosition = (
    position: Position,
    rankDelta: number,
    fileDelta: number
  ): ValidMove | InvalidMove => {
    const newFile = FileArray.indexOf(position.file) + fileDelta;
    const newRank = position.rank + rankDelta;

    if (newRank > 8 || newFile > 7 || newRank < 1 || newFile < 0) {
      return invalidMove;
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

      if (move.move === "INVALID") {
        break;
      }

      validMoves.push(move);

      if (move.move === "Capture") {
        break;
      }
    }
    return validMoves;
  };

  checkPosition = (rank: Rank, file: File): ValidMove | InvalidMove => {
    if (this.canTakeAt(rank, file)) {
      return {
        move: "Capture",
        rank: rank,
        file: file,
      };
    }
    if (this.canMoveTo(rank, file)) {
      return {
        move: "Move",
        rank: rank,
        file: file,
      };
    }
    return invalidMove;
  };

  isStandardMove = (item: ValidMove | InvalidMove): item is ValidMove => {
    return item.move !== "INVALID";
  };

  canTakeAt = (rank: Rank, file: File): boolean => {
    const square = this.board.getPieceAt({ rank: rank as Rank, file });

    return square.piece !== null && square.piece.colour !== this.piece.colour;
  };

  canMoveTo = (rank: Rank, file: File): boolean => {
    const pieceAt = this.board.getPieceAt({ rank: rank, file });

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
      ...new RookValidator(
        this.piece,
        this.board,
        this.enPassantTarget,
        this.castlingRights
      ).getPotentialMoves(from),
      ...new BishopValidator(
        this.piece,
        this.board,
        this.enPassantTarget,
        this.castlingRights
      ).getPotentialMoves(from),
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
    const moves: ValidMoves = [];
    const increment = this.piece.colour === "WHITE" ? 1 : -1;
    const pieceMoved = this.pieceMoved(from);

    const captureDeltas = [
      [increment, 1],
      [increment, -1],
    ];

    const moveOne = this.getMoveAtPosition(from, increment, 0);
    if (this.isStandardMove(moveOne)) {
      moves.push(moveOne);
    }

    if (
      this.isStandardMove(moveOne) &&
      moveOne.move !== "Capture" &&
      !pieceMoved
    ) {
      const newRank = (from.rank + increment * 2) as Rank;
      const canMoveTwo = this.canMoveTo(newRank, from.file);
      if (canMoveTwo) {
        moves.push({
          move: "PawnPush",
          rank: newRank,
          file: from.file,
        });
      }
    }

    const captures: ValidMoves = captureDeltas
      .map(([rd, fd]) => this.getMoveAtPosition(from, rd, fd))
      .filter(this.isStandardMove)
      .filter((x) => x.move === "Capture");

    captureDeltas.forEach(([rd, fd]) => {
      const newRank = (from.rank + rd) as Rank;
      const newFile = FileArray[FileArray.indexOf(from.file) + fd];

      if (
        this.enPassantTarget?.file === newFile &&
        this.enPassantTarget?.rank === newRank
      ) {
        captures.push({
          move: "CaptureEnPassant",
          rank: newRank,
          file: newFile,
        });
      }
    });

    return [...moves, ...captures];
  }

  private pieceMoved(from: Position) {
    const startRank = this.piece.colour === "WHITE" ? 2 : 7;
    return startRank !== from.rank;
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

    const kingRank = this.piece.colour === "WHITE" ? 1 : 8;

    let side = CastlingRights.None;
    if (this.piece.colour === "WHITE") {
      side = type === "SHORT" ? CastlingRights.k : CastlingRights.q;
    } else {
      side = type === "SHORT" ? CastlingRights.K : CastlingRights.Q;
    }

    if (!(this.castlingRights & side)) return false;

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
  board: Board,
  enPessantTarget: Position | undefined = undefined,
  castlingRights: CastlingRights = CastlingRights.None
): BaseValidator => {
  switch (piece.pieceType) {
    case "BISHOP":
      return new BishopValidator(piece, board, enPessantTarget, castlingRights);
    case "KING":
      return new KingValidator(piece, board, enPessantTarget, castlingRights);
    case "KNIGHT":
      return new KnightValidator(piece, board, enPessantTarget, castlingRights);
    case "PAWN":
      return new PawnValidator(piece, board, enPessantTarget, castlingRights);
    case "QUEEN":
      return new QueenValidator(piece, board, enPessantTarget, castlingRights);
    case "ROOK":
      return new RookValidator(piece, board, enPessantTarget, castlingRights);
  }
};
