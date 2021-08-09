import { Board } from "./board";
import InitialBoard from "./initial-board";
import { Rook } from "./rook";
import { Position } from "./types";

export class Game {
  private _board: Board;

  public get board(): Board {
    return this._board;
  }

  constructor() {
    this._board = new Board(InitialBoard);
  }

  move(from: Position, to: Position) {
    const piece = this._board.getPieceAt(from);

    if (!piece) throw new Error("No Piece to move");

    const move = piece.piece.canMove(from, to, this.board);
    console.log(move);

    switch (move.move) {
      case "INVALID":
        break;
      case "Move":
      case "PawnPush":
      case "CaptureEnPassant":
      case "Capture": {
        let board;

        if (move.move === "CaptureEnPassant") {
          board = this.board.board.filter(
            (x) =>
              !(
                x.position.rank === from.rank && x.position.file === from.file
              ) &&
              !(
                x.position.rank === this.board.enPassant?.position.rank &&
                x.position.file === this.board.enPassant?.position.file
              )
          );
        } else {
          board = this._board.board.filter(
            (x) =>
              !(
                x.position.rank === from.rank && x.position.file === from.file
              ) && !(x.position.rank === to.rank && x.position.file === to.file)
          );
        }

        piece.piece.setMoved();
        board.push({
          piece: piece.piece,
          position: {
            rank: to.rank,
            file: to.file,
          },
        });

        if (move.move === "PawnPush") {
          this._board = new Board(board, {
            piece: piece.piece,
            position: {
              rank: to.rank,
              file: to.file,
            },
          });
        } else {
          this._board = new Board(board);
        }

        break;
      }
      case "Castle": {
        const b2 = this.board.board.filter(
          (x) =>
            !(x.position.rank === from.rank && x.position.file === from.file) &&
            !(x.position.rank === to.rank && x.position.file === to.file) &&
            !(
              x.position.rank === piece.position.rank &&
              x.position.file === (move.type === "SHORT" ? "h" : "a")
            )
        );

        piece.piece.setMoved();
        b2.push({
          piece: piece.piece,
          position: {
            rank: to.rank,
            file: to.file,
          },
        });

        const rook = new Rook(piece.piece.colour);
        b2.push({
          piece: rook,
          position: {
            rank: piece.position.rank,
            file: move.type === "SHORT" ? "f" : "d",
          },
        });
        this._board = new Board(b2);
      }
    }
  }
}
