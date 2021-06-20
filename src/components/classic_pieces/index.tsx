import BishopBlack from "./bishop_black";
import BishopWhite from "./bishop_white";
import KingBlack from "./king_black";
import KingWhite from "./king_white";
import KnightBlack from "./knight_black";
import KnightWhite from "./knight_white";
import PawnBlack from "./pawn_black";
import PawnWhite from "./pawn_white";
import QueenBlack from "./queen_black";
import QueenWhite from "./queen_white";
import RookBlack from "./rook_black";
import RookWhite from "./rook_white";

const Black = {
  King: KingBlack,
  Queen: QueenBlack,
  Knight: KnightBlack,
  Bishop: BishopBlack,
  Pawn: PawnBlack,
  Rook: RookBlack,
};

const White = {
  King: KingWhite,
  Queen: QueenWhite,
  Knight: KnightWhite,
  Bishop: BishopWhite,
  Pawn: PawnWhite,
  Rook: RookWhite,
};

export { Black, White };
