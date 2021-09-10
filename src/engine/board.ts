import { IPiece } from "./pieces";
import { Square } from "./square";
import { File, PieceColour, Position, Rank } from "./types";

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

  private _movedPieces: IPiece[];

  constructor(initialPositions: Square[], movedPieces: IPiece[] | [] = []) {
    this._board = initialPositions;
    this._movedPieces = movedPieces;
  }

  addToMoved = (piece: IPiece) => {
    if (!this._movedPieces.includes(piece)) {
      this._movedPieces.push(piece);
    }
  };

  pieceMoved = (piece: IPiece) => {
    return this._movedPieces.includes(piece);
  };

  clone = () => {
    const board = this._board.map((x) => x.clone());
    return new Board(
      board,
      this._movedPieces.map((_) => _)
    );
  };

  move = (from: Position, to: Position) => {
    const squareFrom = this.getPieceAt(from);
    const squareFromPiece = squareFrom.piece;
    const squareTo = this.getPieceAt(to);

    if (!squareFromPiece) throw new Error("no piece to move");

    squareFrom.remove();
    this.addToMoved(squareFromPiece);
    squareTo.place(squareFromPiece);
  };

  remove = (position: Position) => {
    const square = this.getPieceAt(position);
    if (!square.piece) throw new Error("no piece to remove");
    square.remove();
  };

  placeAt = (position: Position, piece: IPiece) => {
    const square = this.getPieceAt(position);
    square.place(piece);
  };

  getPieceAt = (position: Position): Square => {
    const square = this._board.find(
      (x) => x.rank === position.rank && x.file === position.file
    );

    if (square === undefined) throw new Error("Out of bounds");

    return square;
  };

  getPieces = (colour: PieceColour): Square[] => {
    return this.board.filter(
      (x) => x.piece !== null && x.piece.colour === colour
    );
  };

  getKing = (colour: PieceColour): Square => {
    const king = this.board.find(
      (x) => x.piece?.pieceType === "KING" && x.piece.colour === colour
    );

    if (!king) {
      throw new Error("Where's the king?");
    }
    return king;
  };

  public get fenPlacement(): string {
    let ranks: string[] = [];
    RankArray.forEach((rank) => {
      let count = 0;
      let rankString = "";
      FileArray.forEach((file) => {
        let piece = this.getPieceAt({ rank, file });
        if (piece.piece) {
          if (count > 0) {
            rankString += count;
            count = 0;
          }
          let str = "";
          switch (piece.piece!.pieceType) {
            case "BISHOP":
              str = "b";
              break;
            case "KING":
              str = "k";
              break;
            case "KNIGHT":
              str = "n";
              break;
            case "PAWN":
              str = "p";
              break;
            case "QUEEN":
              str = "q";
              break;
            case "ROOK":
              str = "r";
              break;
          }
          if (piece.piece.colour === "WHITE") {
            str = str.toUpperCase();
          }

          rankString += str;
        } else if (file === "h") {
          rankString += ++count;
        }
        if (!piece.piece) {
          count += 1;
        }
      });
      ranks.push(rankString);
    });

    return ranks.join("/");
  }
}
