import { IPiece } from "./pieces";
import { Square } from "./square";
import { File, PieceColour, Position, Rank } from "./types";

export const RankArray: Rank[] = [8, 7, 6, 5, 4, 3, 2, 1];
export const FileArray: File[] = ["a", "b", "c", "d", "e", "f", "g", "h"];

const RankMap: Record<File, number> = {
  "a": 1,
  "b": 2,
  "c": 3,
  "d": 4,
  "e": 5,
  "f": 6,
  "g": 7,
  "h": 8
}


type Rec = {
  piece: IPiece,
  rank: Rank,
  file: File
}
const squareIndex = (rank: Rank, file: File): number => {
  return RankMap[file] + ((rank-1) * 8);
} 

export class Board {
  private _board: Square[];
  private _boardMap: Record<number, Rec>

  public get board() {
    return this._board;
  }

  buildBoardMap = (squares: Square[]) => {
    squares.filter(x => x.piece).forEach(x => 
      {
        this._boardMap[squareIndex(x.rank, x.file)] =  {piece: x.piece!, rank: x.rank, file: x.file}
      })

  }

  constructor(initialPositions: Square[], map: Record<number, Rec> | undefined = undefined) {
    this._board = initialPositions;
    this._boardMap = {}
    if (!map) {
    this.buildBoardMap(initialPositions)
    }
    else {
      this._boardMap = map;
    }
  }


  clone = () => {
    return new Board(this._board, {...this._boardMap});
  };

  move = (from: Position, to: Position) => {
    const squareFrom = this.getPieceAt(from);
    const squareFromPiece = squareFrom;

    if (!squareFromPiece) throw new Error("no piece to move");

    this.remove(from)
    this.placeAt(to, squareFromPiece);
 
  };

  remove = (position: Position) => {
    const piece = this.getPieceAt(position);
    if (!piece) throw new Error("no piece to remove");
    delete this._boardMap[squareIndex(position.rank, position.file)]
  };

  placeAt = (position: Position, piece: IPiece) => {
    this._boardMap[squareIndex(position.rank, position.file)] = {piece, file: position.file, rank: position.rank}
  };

  getPieceAt = (position: Position): IPiece | null => {
    
    const square = this._boardMap[squareIndex(position.rank, position.file)]

    return square ? square.piece : null;
  };

  getPieces = (colour: PieceColour): Square[] => {
    return Object.values(this._boardMap).filter(x => x.piece.colour === colour).map(x =>new Square(x.rank, x.file, x.piece));
  };
}
