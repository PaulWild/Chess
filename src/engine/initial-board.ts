import { FileArray, RankArray } from "./board";
import { Bishop, IPiece, King, Knight, Pawn, Queen, Rook } from "./pieces";

import { Square } from "./square";
import { PiecePosition, Rank, File } from "./types";

export const buildBoard = (): Square[] => {
  const board = RankArray.flatMap((rank) =>
    FileArray.map((file) => new Square(rank, file))
  );

  const placeAt = (rank: Rank, file: File, piece: IPiece) => {
    const sqaure = board.find((x) => x.file === file && x.rank === rank);
    sqaure?.place(piece);
  };

  placeAt(1, "a", new Rook("WHITE"));
  placeAt(1, "b", new Knight("WHITE"));
  placeAt(1, "c", new Bishop("WHITE"));
  placeAt(1, "d", new Queen("WHITE"));
  placeAt(1, "e", new King("WHITE"));
  placeAt(1, "f", new Bishop("WHITE"));
  placeAt(1, "g", new Knight("WHITE"));
  placeAt(1, "h", new Rook("WHITE"));

  placeAt(2, "a", new Pawn("WHITE"));
  placeAt(2, "b", new Pawn("WHITE"));
  placeAt(2, "c", new Pawn("WHITE"));
  placeAt(2, "d", new Pawn("WHITE"));
  placeAt(2, "e", new Pawn("WHITE"));
  placeAt(2, "f", new Pawn("WHITE"));
  placeAt(2, "g", new Pawn("WHITE"));
  placeAt(2, "h", new Pawn("WHITE"));

  placeAt(7, "a", new Pawn("BLACK"));
  placeAt(7, "b", new Pawn("BLACK"));
  placeAt(7, "c", new Pawn("BLACK"));
  placeAt(7, "d", new Pawn("BLACK"));
  placeAt(7, "e", new Pawn("BLACK"));
  placeAt(7, "f", new Pawn("BLACK"));
  placeAt(7, "g", new Pawn("BLACK"));
  placeAt(7, "h", new Pawn("BLACK"));

  placeAt(8, "a", new Rook("BLACK"));
  placeAt(8, "b", new Knight("BLACK"));
  placeAt(8, "c", new Bishop("BLACK"));
  placeAt(8, "d", new Queen("BLACK"));
  placeAt(8, "e", new King("BLACK"));
  placeAt(8, "f", new Bishop("BLACK"));
  placeAt(8, "g", new Knight("BLACK"));
  placeAt(8, "h", new Rook("BLACK"));

  return board;
};

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
