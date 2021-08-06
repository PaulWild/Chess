import { getValidMoves } from "../board";
import { PiecePosition } from "../types";

describe("White Pawns", () => {
  describe("when not moved", () => {
    const piece: PiecePosition = {
      position: { rank: 7, file: "d" },
      piece: "PAWN",
      colour: "BLACK",
      moved: false,
    };

    it("can move forward twice on first rank", () => {
      const board = [piece];
      const moves = getValidMoves(piece, board);

      const expectedMoves = [
        { file: "d", move: "Move", rank: 6 },
        { file: "d", move: "Move", rank: 5 },
      ];

      expect(moves).toEqual(expectedMoves);
    });
  });

  describe("when already moved", () => {
    const piece: PiecePosition = {
      position: { rank: 5, file: "d" },
      piece: "PAWN",
      colour: "BLACK",
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
          colour: "WHITE",
          moved: true,
        },
        {
          position: { rank: 4, file: "d" },
          piece: "PAWN",
          colour: "WHITE",
          moved: true,
        },
        {
          position: { rank: 4, file: "e" },
          piece: "PAWN",
          colour: "WHITE",
          moved: true,
        },
        {
          position: { rank: 5, file: "c" },
          piece: "PAWN",
          colour: "WHITE",
          moved: true,
        },
        {
          position: { rank: 5, file: "e" },
          piece: "PAWN",
          colour: "WHITE",
          moved: true,
        },
        {
          position: { rank: 6, file: "c" },
          piece: "PAWN",
          colour: "WHITE",
          moved: true,
        },
        {
          position: { rank: 6, file: "d" },
          piece: "PAWN",
          colour: "WHITE",
          moved: true,
        },
        {
          position: { rank: 6, file: "e" },
          piece: "PAWN",
          colour: "WHITE",
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
