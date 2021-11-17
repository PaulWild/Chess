import { Board, getValidMoves } from "../board";
import { Pawn } from "../pawn";
import { PiecePosition } from "../types";

describe("White Pawns", () => {
  describe("when not moved", () => {
    const piece: PiecePosition = {
      position: { rank: 2, file: "d" },
      piece: new Pawn("WHITE"),
    };

    it("can move forward twice on first rank", () => {
      const board = new Board([piece]);
      const moves = getValidMoves(piece, board);

      const expectedMoves = [
        { file: "d", move: "Move", rank: 3 },
        { file: "d", move: "Move", rank: 4 },
      ];

      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });
  });

  describe("when already moved", () => {
    const piece: PiecePosition = {
      position: { rank: 3, file: "d" },
      piece: new Pawn("WHITE"),
    };

    it("can move forward once on after moving", () => {
      const board = new Board([piece]);
      const moves = getValidMoves(piece, board);

      const expectedMoves = [{ file: "d", move: "Move", rank: 4 }];

      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });

    it("capture diagonally", () => {
      const board = new Board([
        piece,
        {
          position: { rank: 4, file: "c" },
          piece: new Pawn("BLACK"),
        },
        {
          position: { rank: 4, file: "d" },
          piece: new Pawn("BLACK"),
        },
        {
          position: { rank: 4, file: "e" },
          piece: new Pawn("BLACK"),
        },
        {
          position: { rank: 3, file: "c" },
          piece: new Pawn("BLACK"),
        },
        {
          position: { rank: 3, file: "e" },
          piece: new Pawn("BLACK"),
        },
        {
          position: { rank: 2, file: "c" },
          piece: new Pawn("BLACK"),
        },
        {
          position: { rank: 2, file: "d" },
          piece: new Pawn("BLACK"),
        },
        {
          position: { rank: 2, file: "e" },
          piece: new Pawn("BLACK"),
        },
      ]);

      const moves = getValidMoves(piece, board);

      const expectedMoves = [
        { move: "Capture", rank: 4, file: "c" },
        { move: "Capture", rank: 4, file: "e" },
      ];

      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });
  });
});
