import { File, PiecePosition, Position, Rank } from "./types";

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

export const getValidMoves = (piece: PiecePosition, board: PiecePosition[]) => {
  switch (piece.piece) {
    case "PAWN":
      return getPawnValidMoves(piece, board);
    case "ROOK":
      return getRookValidMoves(piece, board);
    default:
      return getAllBoardPositions();
  }
};

const getPieceAt = (position: Position, board: PiecePosition[]) => {
  return board.find(
    (x) =>
      x.position.rank === position.rank && x.position.file === position?.file
  );
};

function getPawnValidMoves(
  piece: PiecePosition,
  board: PiecePosition[]
): Position[] {
  const startRank = piece.colour === "WHITE" ? 2 : 7;
  const increment = piece.colour === "WHITE" ? 1 : -1;
  const steps = piece.position.rank === startRank ? 2 : 1;

  const validMoves: Position[] = [];
  for (let i = 1; i <= steps; i++) {
    const newRank = (piece.position.rank + i * increment) as Rank;

    if (newRank) {
      const pieceAt = getPieceAt(
        { rank: newRank, file: piece?.position.file },
        board
      );

      if (pieceAt) {
        break;
      }

      validMoves.push({ rank: newRank, file: piece.position.file });
    }
  }

  if (piece.position.file !== "a") {
    const fileToCheck = FileArray[FileArray.indexOf(piece.position.file) - 1];
    const rankToCheck = (piece.position.rank + 1 * increment) as Rank;

    const leftFilePiece = getPieceAt(
      { rank: rankToCheck, file: fileToCheck },
      board
    );

    if (leftFilePiece && leftFilePiece.colour !== piece.colour) {
      validMoves.push({
        rank: rankToCheck,
        file: fileToCheck,
      });
    }
  }

  if (piece.position.file !== "h") {
    const fileToCheck = FileArray[FileArray.indexOf(piece.position.file) + 1];
    const rankToCheck = (piece.position.rank + 1 * increment) as Rank;

    const leftFilePiece = getPieceAt(
      { rank: rankToCheck, file: fileToCheck },
      board
    );

    if (leftFilePiece && leftFilePiece.colour !== piece.colour) {
      validMoves.push({
        rank: rankToCheck,
        file: fileToCheck,
      });
    }
  }

  //TODO: EN-Passant
  return validMoves;
}

const getAllBoardPositions = (): Position[] => {
  return RankArray.flatMap((rank) => FileArray.map((file) => ({ rank, file })));
};

const getRookValidMoves = (piece: PiecePosition, board: PiecePosition[]) => {
  const validMoves: Position[] = [];
  //left
  for (let i = FileArray.indexOf(piece.position.file) - 1; i >= 0; i--) {
    const pieceAt = getPieceAt(
      { rank: piece.position.rank, file: FileArray[i] },
      board
    );

    if (pieceAt && pieceAt.colour !== piece.colour) {
      validMoves.push({ rank: piece.position.rank, file: FileArray[i] });
      break;
    } else if (pieceAt) {
      break;
    } else {
      validMoves.push({ rank: piece.position.rank, file: FileArray[i] });
    }
  }
  //right
  for (
    let i = FileArray.indexOf(piece.position.file) + 1;
    i < FileArray.length;
    i++
  ) {
    const pieceAt = getPieceAt(
      { rank: piece.position.rank, file: FileArray[i] },
      board
    );

    if (pieceAt && pieceAt.colour !== piece.colour) {
      validMoves.push({ rank: piece.position.rank, file: FileArray[i] });
      break;
    } else if (pieceAt) {
      break;
    } else {
      validMoves.push({ rank: piece.position.rank, file: FileArray[i] });
    }
  }
  //up
  for (let i = piece.position.rank + 1; i <= RankArray.length; i++) {
    const pieceAt = getPieceAt(
      { rank: i as Rank, file: piece.position.file },
      board
    );

    if (pieceAt && pieceAt.colour !== piece.colour) {
      validMoves.push({ rank: i as Rank, file: piece.position.file });
      break;
    } else if (pieceAt) {
      break;
    } else {
      validMoves.push({ rank: i as Rank, file: piece.position.file });
    }
  }
  //down
  for (let i = piece.position.rank - 1; i >= 0; i--) {
    const pieceAt = getPieceAt(
      { rank: i as Rank, file: piece.position.file },
      board
    );

    if (pieceAt && pieceAt.colour !== piece.colour) {
      validMoves.push({ rank: i as Rank, file: piece.position.file });
      break;
    } else if (pieceAt) {
      break;
    } else {
      validMoves.push({ rank: i as Rank, file: piece.position.file });
    }
  }
  return validMoves;
};
