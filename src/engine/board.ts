import { Bishop } from "./bishop";
import { King } from "./king";
import { Knight } from "./knight";
import { Pawn } from "./pawn";
import { Queen } from "./queen";
import { Rook } from "./rook";

import { File, PiecePosition, Position, Rank, ValidMoves } from "./types";

export const RankArray: Rank[] = [8, 7, 6, 5, 4, 3, 2, 1];
export const FileArray: File[] = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const isLightSquare = (rank: Rank, file: File) => {
  if (rank % 2 === 0 && FileArray.indexOf(file) % 2 === 0) {
    return true;
  } else if (rank % 2 === 1 && FileArray.indexOf(file) % 2 === 1) {
    return true;
  }
  return false;
};

export const getValidMoves = (
  piece: PiecePosition,
  board: PiecePosition[]
): ValidMoves => {
  const potentialMoves = getValidMovesInternal(piece, board);

  return potentialMoves.filter((move) => {
    if (move.move === "Castle") {
      return true;
    }
    const movePosition = move as Position;
    const potentialBoard = board.filter(
      (x) =>
        !(
          x.position.rank === piece.position.rank &&
          x.position.file === piece.position.file
        ) &&
        !(
          x.position.rank === movePosition.rank &&
          x.position.file === movePosition.file
        )
    );

    potentialBoard.push({
      colour: piece?.colour,
      piece: piece.piece,
      moved: true,
      position: {
        rank: movePosition.rank,
        file: movePosition.file,
      },
    });

    return !KingInCheck(piece.colour, potentialBoard);
  });
};

export const KingInCheck = (
  colour: "WHITE" | "BLACK",
  board: PiecePosition[]
): Boolean => {
  const kingPosition = board.find(
    (x) => x.piece === "KING" && x.colour === colour
  );

  return board
    .filter((x) => x.colour !== colour)
    .flatMap((x) => getValidMovesInternal(x, board))
    .some(
      (x) =>
        (x as Position).file === kingPosition?.position.file &&
        (x as Position).rank === kingPosition?.position.rank
    );
};

export const getValidMovesInternal = (
  piece: PiecePosition,
  board: PiecePosition[]
): ValidMoves => {
  switch (piece.piece) {
    case "PAWN":
      return new Pawn(board).getValidMoves(piece);
    case "ROOK":
      return new Rook(board).getValidMoves(piece);
    case "BISHOP":
      return new Bishop(board).getValidMoves(piece);
    case "QUEEN":
      return new Queen(board).getValidMoves(piece);
    case "KNIGHT":
      return new Knight(board).getValidMoves(piece);
    case "KING":
      return new King(board).getValidMoves(piece);
    default:
      throw Error("nope");
  }
};
