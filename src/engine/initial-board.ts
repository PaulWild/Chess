import { isEmptyBindingElement } from "typescript";
import { BasePiece } from "./basePiece";
import { Bishop } from "./bishop";
import { FileArray, RankArray } from "./board";
import { King } from "./king";
import { Knight } from "./knight";
import { Pawn } from "./pawn";
import { Queen } from "./queen";
import { Rook } from "./rook";
import { PiecePosition, Rank, File, Empty } from "./types";

class Square {
  piece: BasePiece | Empty;
  rank: Rank;
  file: File;

  constructor(rank: Rank, file: File, piece: BasePiece | Empty = null) {
    this.rank = rank;
    this.file = file;
    this.piece = piece;
  }
}

export const buildBoard = (): Record<Rank, Record<File, BasePiece | Empty>> => {
  return  = {
    1: {"a": null, "b": null, "c": null, "d": null, "e": null, "f": null, "g": null, "h": null},
    2: {"a": null, "b": null, "c": null, "d": null, "e": null, "f": null, "g": null, "h": null},
    3: {"a": null, "b": null, "c": null, "d": null, "e": null, "f": null, "g": null, "h": null},
    4: {"a": null, "b": null, "c": null, "d": null, "e": null, "f": null, "g": null, "h": null},
    5: {"a": null, "b": null, "c": null, "d": null, "e": null, "f": null, "g": null, "h": null},
    6: {"a": null, "b": null, "c": null, "d": null, "e": null, "f": null, "g": null, "h": null},
    7: {"a": null, "b": null, "c": null, "d": null, "e": null, "f": null, "g": null, "h": null},
    8: {"a": null, "b": null, "c": null, "d": null, "e": null, "f": null, "g": null, "h": null}}
}

const InitialBoard: PiecePosition[] = [
  {
    position: { rank: 1, file: "a" },
    piece: new Rook("WHITE"),
  },
  {
    position: { rank: 1, file: "b" },
    piece: new Knight("WHITE"),
  },
  {
    position: { rank: 1, file: "c" },
    piece: new Bishop("WHITE"),
  },
  {
    position: { rank: 1, file: "d" },
    piece: new Queen("WHITE"),
  },
  {
    position: { rank: 1, file: "e" },
    piece: new King("WHITE"),
  },
  {
    position: { rank: 1, file: "f" },
    piece: new Bishop("WHITE"),
  },
  {
    position: { rank: 1, file: "g" },
    piece: new Knight("WHITE"),
  },
  {
    position: { rank: 1, file: "h" },
    piece: new Rook("WHITE"),
  },
  {
    position: { rank: 2, file: "a" },
    piece: new Pawn("WHITE"),
  },
  {
    position: { rank: 2, file: "b" },
    piece: new Pawn("WHITE"),
  },
  {
    position: { rank: 2, file: "c" },
    piece: new Pawn("WHITE"),
  },
  {
    position: { rank: 2, file: "d" },
    piece: new Pawn("WHITE"),
  },
  {
    position: { rank: 2, file: "e" },
    piece: new Pawn("WHITE"),
  },
  {
    position: { rank: 2, file: "f" },
    piece: new Pawn("WHITE"),
  },
  {
    position: { rank: 2, file: "g" },
    piece: new Pawn("WHITE"),
  },
  {
    position: { rank: 2, file: "h" },
    piece: new Pawn("WHITE"),
  },
  {
    position: { rank: 8, file: "a" },
    piece: new Rook("BLACK"),
  },
  {
    position: { rank: 8, file: "b" },
    piece: new Knight("BLACK"),
  },
  {
    position: { rank: 8, file: "c" },
    piece: new Bishop("BLACK"),
  },
  {
    position: { rank: 8, file: "d" },
    piece: new Queen("BLACK"),
  },
  {
    position: { rank: 8, file: "e" },
    piece: new King("BLACK"),
  },
  {
    position: { rank: 8, file: "f" },
    piece: new Bishop("BLACK"),
  },
  {
    position: { rank: 8, file: "g" },
    piece: new Knight("BLACK"),
  },
  {
    position: { rank: 8, file: "h" },
    piece: new Rook("BLACK"),
  },
  {
    position: { rank: 7, file: "a" },
    piece: new Pawn("BLACK"),
  },
  {
    position: { rank: 7, file: "b" },
    piece: new Pawn("BLACK"),
  },
  {
    position: { rank: 7, file: "c" },
    piece: new Pawn("BLACK"),
  },
  {
    position: { rank: 7, file: "d" },
    piece: new Pawn("BLACK"),
  },
  {
    position: { rank: 7, file: "e" },
    piece: new Pawn("BLACK"),
  },
  {
    position: { rank: 7, file: "f" },
    piece: new Pawn("BLACK"),
  },
  {
    position: { rank: 7, file: "g" },
    piece: new Pawn("BLACK"),
  },
  {
    position: { rank: 7, file: "h" },
    piece: new Pawn("BLACK"),
  },
];

export default InitialBoard;
