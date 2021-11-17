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

let caputres = 0;
const perft = (game: Game, colour: PieceColour, depth: number): number => {
  if (depth === 0) {
    return 1;
  }

  let nodes = 0;
  const moves = game.movesPerf(colour);

  for (let i = 0; i < moves.length; i++) {
    const newGame = game.clone();
    if (
      moves[i].move.move === "Capture" ||
      moves[i].move.move === "CaptureEnPassant"
    ) {
      caputres++;
    }

    newGame.move(moves[i].from, {
      rank: moves[i].move.rank,
      file: moves[i].move.file,
    });

    nodes += perft(newGame, colour === "WHITE" ? "BLACK" : "WHITE", depth - 1);
  }

  return nodes;
};

describe("Game Engine", () => {
  beforeEach(() => {
    caputres = 0;
  });

  it.skip("calculates moves in a timely manner", () => {
    const colour = "WHITE";
    const game = new Game();

    console.time("perft timing");
    const result = perft(game, colour, 4);
    console.timeEnd("perft timing");
    console.log(caputres, "captures");
    expect(result).toBe(197281);
  });

  it.skip("calculates moves of position 3", () => {
    const colour = "WHITE";
    const game = new Game(
      new Board(Position3()),
      "WhiteMove",
      0,
      0,
      CastlingRights.None
    );

    console.time("perft timing");
    const result = perft(game, colour, 1);
    console.timeEnd("perft timing");
    console.log(caputres, "captures");
    expect(result).toBe(14);
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

    console.time("perft timing");
    const result = perft(game, colour, 4);
    console.timeEnd("perft timing");
    console.log(caputres, "captures");
    expect(result).toBe(674624);
  });
});
