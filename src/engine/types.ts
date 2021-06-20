export type PiecePosition = {
  rank: Rank;
  file: File;
  piece: "ROOK" | "KNIGHT" | "BISHOP" | "KING" | "QUEEN" | "PAWN";
  colour: "WHITE" | "BLACK";
};

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
