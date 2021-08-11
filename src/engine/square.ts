import { BasePiece } from "./basePiece";
import { Empty, Rank, File } from "./types";

export class Square {
  private _piece: BasePiece | Empty;

  public get piece(): BasePiece | Empty {
    return this._piece;
  }

  rank: Rank;
  file: File;

  constructor(rank: Rank, file: File, piece: BasePiece | Empty = null) {
    this.rank = rank;
    this.file = file;
    this._piece = piece;
  }

  place(piece: BasePiece) {
    this._piece = piece;
  }

  remove() {
    this._piece = null;
  }

  clone() {
    return new Square(this.rank, this.file, this.piece);
  }
}
