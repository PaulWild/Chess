import { RankArray, FileArray, Board } from "../board";
import { Game } from "../game";
import { IPiece, Rook, King, Pawn } from "../pieces";
import { Square } from "../square";
import { PieceColour, Rank, File, CastlingRights } from "../types";

export const Position3 = (): Square[] => {
  const board = RankArray.flatMap((rank) =>
    FileArray.map((file) => new Square(rank, file))
  );

  const placeAt = (rank: Rank, file: File, piece: IPiece) => {
    const sqaure = board.find((x) => x.file === file && x.rank === rank);
    sqaure?.place(piece);
  };

  placeAt(4, "b", new Rook("WHITE"));
  placeAt(5, "a", new King("WHITE"));

  placeAt(5, "b", new Pawn("WHITE"));
  placeAt(2, "e", new Pawn("WHITE"));
  placeAt(2, "g", new Pawn("WHITE"));

  placeAt(7, "c", new Pawn("BLACK"));
  placeAt(6, "d", new Pawn("BLACK"));
  placeAt(4, "f", new Pawn("BLACK"));

  placeAt(4, "h", new King("BLACK"));
  placeAt(5, "h", new Rook("BLACK"));

  return board;
};

const perft = (game: Game, colour: PieceColour, depth: number): number => {
  if (depth === 0) {
    return 1;
  }

  let nodes = 0;
  const moves = game.movesPerf(colour);

  for (const move of moves) {
    const newGame = game.clone();

    newGame.move(move.from, {
      rank: move.move.rank,
      file: move.move.file,
    });

    if (newGame.state === "BlackPromote" || newGame.state === "WhitePromote") {
      const q = newGame.clone();
      q.promote("QUEEN");
      nodes += perft(
        newGame,
        colour === "WHITE" ? "BLACK" : "WHITE",
        depth - 1
      );

      const r = newGame.clone();
      r.promote("ROOK");
      nodes += perft(r, colour === "WHITE" ? "BLACK" : "WHITE", depth - 1);

      const b = newGame.clone();
      b.promote("BISHOP");
      nodes += perft(b, colour === "WHITE" ? "BLACK" : "WHITE", depth - 1);

      const k = newGame.clone();
      k.promote("KNIGHT");
      nodes += perft(k, colour === "WHITE" ? "BLACK" : "WHITE", depth - 1);
    } else {
      nodes += perft(
        newGame,
        colour === "WHITE" ? "BLACK" : "WHITE",
        depth - 1
      );
    }
  }

  return nodes;
};

describe("Game Engine", () => {
  it("calculates moves in a timely manner", () => {
    const colour = "WHITE";
    const game = new Game();

    const result = perft(game, colour, 3);

    expect(result).toBe(8902);
  });

  it("calculates moves of position 3", () => {
    const colour = "WHITE";
    const game = new Game(
      new Board(Position3()),
      "WhiteMove",
      0,
      0,
      CastlingRights.None
    );

    const result = perft(game, colour, 3);

    expect(result).toBe(2812);
  });

  it("calculates moves of position 3 to depth 4", () => {
    const colour = "WHITE";
    const game = new Game(
      new Board(Position3()),
      "WhiteMove",
      0,
      0,
      CastlingRights.None
    );

    const result = perft(game, colour, 4);

    expect(result).toBe(43_238);
  });
});
