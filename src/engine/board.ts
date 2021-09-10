import { IPiece } from "./pieces";
import { Square } from "./square";
import { File, PieceColour, Position, Rank } from "./types";

export const RankArray: Rank[] = [8, 7, 6, 5, 4, 3, 2, 1];
export const FileArray: File[] = ["a", "b", "c", "d", "e", "f", "g", "h"];

export class Board {
  private _board: Square[];

  public get board() {
    return this._board;
  }

  constructor(initialPositions: Square[]) {
    this._board = initialPositions;
  }

  clone = () => {
    const board = this._board.map((x) => x.clone());
    return new Board(board);
  };

  move = (from: Position, to: Position) => {
    const squareFrom = this.getPieceAt(from);
    const squareFromPiece = squareFrom.piece;
    const squareTo = this.getPieceAt(to);

    if (!squareFromPiece) throw new Error("no piece to move");

    squareFrom.remove();
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
}
