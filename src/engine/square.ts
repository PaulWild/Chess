import { FileArray } from "./board";
import { IPiece } from "./pieces";
import { Empty, Rank, File } from "./types";

export class Square {
  private _piece: IPiece | Empty;

  public get piece(): IPiece | Empty {
    return this._piece;
  }

  rank: Rank;
  file: File;

  constructor(rank: Rank, file: File, piece: IPiece | Empty = null) {
    this.rank = rank;
    this.file = file;
    this._piece = piece;
  }

  place(piece: IPiece) {
    this._piece = piece;
  }

  remove() {
    this._piece = null;
  }

  clone() {
    return new Square(this.rank, this.file, this.piece);
  }
}

export const isLightSquare = (rank: Rank, file: File) => {
  if (rank % 2 === 0 && FileArray.indexOf(file) % 2 === 0) {
    return true;
  } else if (rank % 2 === 1 && FileArray.indexOf(file) % 2 === 1) {
    return true;
  }
  return false;
};
