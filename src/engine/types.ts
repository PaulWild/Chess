export type PiecePosition = {
  position: Position;
  piece: "ROOK" | "KNIGHT" | "BISHOP" | "KING" | "QUEEN" | "PAWN";
  colour: "WHITE" | "BLACK";
};

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

export type Position = {
  rank: Rank;
  file: File;
};
