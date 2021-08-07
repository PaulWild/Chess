import { BasePiece } from "./basePiece";

export type PiecePosition = {
  position: Position;
  piece: BasePiece;
};

export type PieceType =
  | "ROOK"
  | "KNIGHT"
  | "BISHOP"
  | "KING"
  | "QUEEN"
  | "PAWN";

export type PieceColour = "WHITE" | "BLACK";

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

export type Position = {
  rank: Rank;
  file: File;
};

export type StandardMove = {
  move: "Move";
} & Position;

export type PawnPush = {
  move: "PawnPush";
} & Position;

export type Capture = {
  move: "Capture";
} & Position;

export type CaptureEnPassant = {
  move: "CaptureEnPassant";
} & Position;

export type Castle = {
  move: "Castle";
  type: "SHORT" | "LONG";
  colour: "WHITE" | "BLACK";
} & Position;

export type InvalidMove = {
  move: "INVALID";
};

export type ValidMove =
  | StandardMove
  | Capture
  | Castle
  | PawnPush
  | CaptureEnPassant;

export type ValidMoves = ValidMove[];
