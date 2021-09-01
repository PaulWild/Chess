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
