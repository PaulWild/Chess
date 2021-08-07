import { Bishop } from "./bishop";
import { King } from "./king";
import { Knight } from "./knight";
import { Pawn } from "./pawn";
import { Queen } from "./queen";
import { Rook } from "./rook";
import { PiecePosition } from "./types";

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
