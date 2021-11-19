import { IValidMoves } from ".";
import { FileArray } from "../board";
import { Game } from "../game";
import { IPiece } from "../pieces";
import {
  Position,
  CastlingRights,
  ValidMoves,
  ValidMove,
  InvalidMove,
  Rank,
  File,
} from "../types";

const invalidMove: InvalidMove = { move: "INVALID" };

export abstract class BaseValidator implements IValidMoves {
  piece: IPiece;
  game: Game;
  enPassantTarget: Position | undefined;
  castlingRights: CastlingRights;

  constructor(
    piece: IPiece,
    game: Game,
    enPassantTarget: Position | undefined,
    castlingRights: CastlingRights
  ) {
    this.piece = piece;
    this.game = game;
    this.enPassantTarget = enPassantTarget;
    this.castlingRights = castlingRights;
  }

  canMove(from: Position, to: Position): ValidMove | InvalidMove {
    const allMoves = this.potentialMoves(from);

    const potentialMove = allMoves.find(
      (position) => position.file === to.file && position.rank === to.rank
    );

    return potentialMove ?? { move: "INVALID" };
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
    const square = this.game.board.getPieceAt({ rank: rank as Rank, file });

    return square !== null && square.colour !== this.piece.colour;
  };

  canMoveTo = (rank: Rank, file: File): boolean => {
    const pieceAt = this.game.board.getPieceAt({ rank: rank, file });

    return pieceAt === null;
  };

  abstract potentialMoves(from: Position): ValidMoves;
}
