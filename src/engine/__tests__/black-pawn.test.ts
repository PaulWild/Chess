import { Board } from "../board";
import { Pawn } from "../pawn";
import { PiecePosition } from "../types";

describe("White Pawns", () => {
  describe("when not moved", () => {
    const piece: PiecePosition = {
      position: { rank: 7, file: "d" },
      piece: new Pawn("BLACK"),
    };

    it("can move forward twice on first rank", () => {
      const board = new Board([piece]);
      const moves = piece.piece.getValidMoves(piece.position, board);

      const expectedMoves = [
        { file: "d", move: "Move", rank: 6 },
        { file: "d", move: "Move", rank: 5 },
      ];

      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });
  });

  describe("when already moved", () => {
    const piece: PiecePosition = {
      position: { rank: 5, file: "d" },
      piece: new Pawn("BLACK"),
    };

    piece.piece.setMoved();

    it("can move forward once on after moving", () => {
      const board = new Board([piece]);
      const moves = piece.piece.getValidMoves(piece.position, board);
      const expectedMoves = [{ file: "d", move: "Move", rank: 4 }];

      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });

    it("capture diagonally", () => {
      const board = new Board([
        piece,
        {
          position: { rank: 4, file: "c" },
          piece: new Pawn("WHITE"),
        },
        {
          position: { rank: 4, file: "d" },
          piece: new Pawn("WHITE"),
        },
        {
          position: { rank: 4, file: "e" },
          piece: new Pawn("WHITE"),
        },
        {
          position: { rank: 5, file: "c" },
          piece: new Pawn("WHITE"),
        },
        {
          position: { rank: 5, file: "e" },
          piece: new Pawn("WHITE"),
        },
        {
          position: { rank: 6, file: "c" },
          piece: new Pawn("WHITE"),
        },
        {
          position: { rank: 6, file: "d" },
          piece: new Pawn("WHITE"),
        },
        {
          position: { rank: 6, file: "e" },
          piece: new Pawn("WHITE"),
        },
      ]);

      const moves = piece.piece.getValidMoves(piece.position, board);
      const expectedMoves = [
        { move: "Capture", rank: 4, file: "c" },
        { move: "Capture", rank: 4, file: "e" },
      ];

      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });
  });
});
