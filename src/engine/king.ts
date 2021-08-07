import { BasePiece } from "./basePiece";
import { Board, FileArray } from "./board";
import { PieceType, Position, Rank, ValidMoves } from "./types";

export class King extends BasePiece {
  pieceType = "KING" as PieceType;

  getValidMoves = (position: Position, board: Board) => {
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

    const file = FileArray.indexOf(position.file);
    const rank = position.rank;

    validMoves = validMoves.concat(
      moveDeltas
        .map(([rankDelta, fileDelta]) =>
          board.getMoveAtPosition(position, this, rankDelta, fileDelta)
        )
        .filter(board.isStandardMove)
    );

    if (this.moved) {
      return validMoves;
    }

    const shortRook = board.getPieceAt({ rank: position.rank, file: "h" });

    if (shortRook && !shortRook.piece.moved) {
      const moveDeltas = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];

      const canShortCastle = moveDeltas.every(([rankDelta, fileDelta]) => {
        const newFile = file + fileDelta;
        const newRank = rank + rankDelta;

        const pieceAt = board.getPieceAt({
          file: FileArray[newFile],
          rank: newRank as Rank,
        });

        if (!pieceAt || (rankDelta === 0 && fileDelta === 0)) {
          const potentialBoard = board.board.filter(
            (x) =>
              !(
                x.position.rank === position.rank &&
                x.position.file === position.file
              )
          );

          var p = new King(this.colour);
          p.setMoved();
          potentialBoard.push({
            piece: p,
            position: {
              rank: newRank as Rank,
              file: FileArray[newFile],
            },
          });

          const b = new Board(potentialBoard);

          return !b.KingInCheck(this.colour);
        }
        return false;
      });

      if (canShortCastle)
        validMoves.push({
          move: "Castle",
          type: "SHORT",
          colour: this.colour,
          rank: rank,
          file: FileArray[file + 2],
        });
    }

    const longRook = board.getPieceAt({ rank: position.rank, file: "h" });

    if (longRook && !longRook.piece.moved) {
      const moveDeltas = [
        [0, 0],
        [0, -1],
        [0, -2],
      ];

      const canLongCastle = moveDeltas.every(([rankDelta, fileDelta]) => {
        const newFile = file + fileDelta;
        const newRank = rank + rankDelta;

        const pieceAt = board.getPieceAt({
          file: FileArray[newFile],
          rank: newRank as Rank,
        });

        if (!pieceAt || (rankDelta === 0 && fileDelta === 0)) {
          const potentialBoard = board.board.filter(
            (x) =>
              !(
                x.position.rank === position.rank &&
                x.position.file === position.file
              )
          );

          var p = new King(this.colour);
          p.setMoved();
          potentialBoard.push({
            piece: p,
            position: {
              rank: newRank as Rank,
              file: FileArray[newFile],
            },
          });

          const b = new Board(potentialBoard);

          return !b.KingInCheck(this.colour);
        }
        return false;
      });

      if (canLongCastle)
        validMoves.push({
          move: "Castle",
          type: "LONG",
          colour: this.colour,
          rank: rank,
          file: FileArray[file - 2],
        });
    }

    return validMoves;
  };
}
