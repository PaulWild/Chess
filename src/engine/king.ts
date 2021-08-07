import { BasePiece } from "./basePiece";
import { FileArray, KingInCheck } from "./board";
import { PiecePosition, Rank, ValidMoves } from "./types";

export class King extends BasePiece {
  getValidMoves = (piece: PiecePosition) => {
    let validMoves: ValidMoves = [];
    const moveDeltas = [
      [1, 1],
      [0, 1],
      [1, 0],
      [-1, 0],
      [-1, -1],
      [0, -1],
      [-1, 1],
      [1, -1],
    ];

    const file = FileArray.indexOf(piece.position.file);
    const rank = piece.position.rank;

    validMoves = validMoves.concat(
      moveDeltas
        .map(([rankDelta, fileDelta]) =>
          this.getMoveAtPosition(piece, rankDelta, fileDelta)
        )
        .filter(this.isStandardMove)
    );

    //short Castle.
    const colour = piece.colour;
    const shortRook = this.board.find(
      (x) =>
        x.piece === "ROOK" &&
        x.colour === colour &&
        x.position.file === "h" &&
        x.moved === false
    );

    if (shortRook && !piece.moved) {
      const moveDeltas = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];

      const canShortCastle = moveDeltas.every(([rankDelta, fileDelta]) => {
        const newFile = file + fileDelta;
        const newRank = rank + rankDelta;

        const pieceAt = this.board.find(
          (x) =>
            x.position.file === FileArray[newFile] &&
            x.position.rank === newRank
        );
        if (!pieceAt || (rankDelta === 0 && fileDelta === 0)) {
          const potentialBoard = this.board.filter(
            (x) =>
              !(
                x.position.rank === piece.position.rank &&
                x.position.file === piece.position.file
              )
          );

          potentialBoard.push({
            colour: piece?.colour,
            piece: piece.piece,
            moved: true,
            position: {
              rank: newRank as Rank,
              file: FileArray[newFile],
            },
          });

          return !KingInCheck(piece.colour, potentialBoard);
        }
        return false;
      });

      if (canShortCastle)
        validMoves.push({
          move: "Castle",
          type: "SHORT",
          colour: piece.colour,
          rank: rank,
          file: FileArray[file + 2],
        });
    }

    //short Castle.
    const longRook = this.board.find(
      (x) =>
        x.piece === "ROOK" &&
        x.colour === colour &&
        x.position.file === "a" &&
        x.moved === false
    );

    if (longRook && !piece.moved) {
      const moveDeltas = [
        [0, 0],
        [0, -1],
        [0, -2],
      ];

      const canLongCastle = moveDeltas.every(([rankDelta, fileDelta]) => {
        const newFile = file + fileDelta;
        const newRank = rank + rankDelta;

        const pieceAt = this.board.find(
          (x) =>
            x.position.file === FileArray[newFile] &&
            x.position.rank === newRank
        );
        if (!pieceAt || (rankDelta === 0 && fileDelta === 0)) {
          const potentialBoard = this.board.filter(
            (x) =>
              !(
                x.position.rank === piece.position.rank &&
                x.position.file === piece.position.file
              )
          );

          potentialBoard.push({
            colour: piece?.colour,
            piece: piece.piece,
            moved: true,
            position: {
              rank: newRank as Rank,
              file: FileArray[newFile],
            },
          });

          return !KingInCheck(piece.colour, potentialBoard);
        }
        return false;
      });

      if (canLongCastle)
        validMoves.push({
          move: "Castle",
          type: "LONG",
          colour: piece.colour,
          rank: rank,
          file: FileArray[file - 2],
        });
    }

    return validMoves;
  };
}
