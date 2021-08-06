import { getValidMoves } from "../board";
import { PiecePosition } from "../types";

describe("White Pawns", () => {
  describe("when not moved", () => {
    const piece: PiecePosition = {
      position: { rank: 2, file: "d" },
      piece: "PAWN",
      colour: "WHITE",
      moved: false,
    };

    it("can move forward twice on first rank", () => {
      const board = [piece];
      const moves = getValidMoves(piece, board);

      const expectedMoves = [
        { file: "d", move: "Move", rank: 3 },
        { file: "d", move: "Move", rank: 4 },
      ];

      expect(moves).toEqual(expectedMoves);
    });
  });

  describe("when already moved", () => {
    const piece: PiecePosition = {
      position: { rank: 3, file: "d" },
      piece: "PAWN",
      colour: "WHITE",
      moved: true,
    };

    it("can move forward once on after moving", () => {
      const board = [piece];
      const moves = getValidMoves(piece, board);

      const expectedMoves = [{ file: "d", move: "Move", rank: 4 }];

      expect(moves).toEqual(expectedMoves);
    });

    it("capture diagonally", () => {
      const board: PiecePosition[] = [
        piece,
        {
          position: { rank: 4, file: "c" },
          piece: "PAWN",
          colour: "BLACK",
          moved: true,
        },
        {
          position: { rank: 4, file: "d" },
          piece: "PAWN",
          colour: "BLACK",
          moved: true,
        },
        {
          position: { rank: 4, file: "e" },
          piece: "PAWN",
          colour: "BLACK",
          moved: true,
        },
        {
          position: { rank: 3, file: "c" },
          piece: "PAWN",
          colour: "BLACK",
          moved: true,
        },
        {
          position: { rank: 3, file: "e" },
          piece: "PAWN",
          colour: "BLACK",
          moved: true,
        },
        {
          position: { rank: 2, file: "c" },
          piece: "PAWN",
          colour: "BLACK",
          moved: true,
        },
        {
          position: { rank: 2, file: "d" },
          piece: "PAWN",
          colour: "BLACK",
          moved: true,
        },
        {
          position: { rank: 2, file: "e" },
          piece: "PAWN",
          colour: "BLACK",
          moved: true,
        },
      ];

      const moves = getValidMoves(piece, board);

      const expectedMoves = [
        { move: "Move", rank: 4, file: "c" },
        { move: "Move", rank: 4, file: "e" },
      ];

      expect(moves).toEqual(expectedMoves);
    });
  });
});
