import React, { useReducer, createContext, Dispatch } from "react";
import { Board } from "../engine/board";
import InitialBoard from "../engine/initial-board";
import { Rook } from "../engine/rook";
import { File, Rank } from "../engine/types";

const initialState: State = { board: new Board(InitialBoard) };

const GameContext = createContext<[State, Dispatch<Action>]>([
  initialState,
  () => null,
]);

type State = {
  activePiece?: ActivePiece;
  threatenedSquare?: { rank: Rank; file: File };
  board: Board;
};

type ActivePiece = {
  rank: Rank;
  file: File;
  x: number;
  y: number;
};

type Action =
  | { type: "PIECE_HOVER"; payload: { x: number; y: number } }
  | {
      type: "PIECE_ACTIVATED";
      payload: { rank: Rank; file: File; x: number; y: number };
    }
  | {
      type: "SQUARE_ATTACKED";
      payload: { rank: Rank; file: File };
    }
  | { type: "MOVE" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "PIECE_HOVER": {
      if (!state.activePiece) throw new Error("state is corrupted");

      return {
        ...state,
        activePiece: {
          ...state.activePiece,
          x: action.payload.x,
          y: action.payload.y,
        },
      };
    }
    case "PIECE_ACTIVATED":
      return {
        ...state,
        activePiece: {
          ...action.payload,
        },
      };
    case "SQUARE_ATTACKED":
      return {
        ...state,
        threatenedSquare: {
          ...action.payload,
        },
      };
    case "MOVE": {
      if (!state.threatenedSquare) throw new Error("state is corrupted");
      if (!state.activePiece) throw new Error("state is corrupted");

      const from = {
        file: state.activePiece.file,
        rank: state.activePiece.rank,
      };

      const to = {
        file: state.threatenedSquare.file,
        rank: state.threatenedSquare.rank,
      };

      const piece = state.board.getPieceAt(from);

      if (!piece) throw new Error("state is corrupted");

      const move = piece.piece.canMove(from, to, state.board);
      console.log(move);

      switch (move.move) {
        case "INVALID":
          return {
            board: state.board,
          };
        case "Move":
        case "PawnPush":
        case "CaptureEnPassant":
        case "Capture":
          let board;

          if (move.move === "CaptureEnPassant") {
            board = state.board.board.filter(
              (x) =>
                !(
                  x.position.rank === state.activePiece?.rank &&
                  x.position.file === state.activePiece?.file
                ) &&
                !(
                  x.position.rank === state.board.enPassant?.position.rank &&
                  x.position.file === state.board.enPassant?.position.file
                )
            );
          } else {
            board = state.board.board.filter(
              (x) =>
                !(
                  x.position.rank === state.activePiece?.rank &&
                  x.position.file === state.activePiece?.file
                ) &&
                !(
                  x.position.rank === state.threatenedSquare?.rank &&
                  x.position.file === state.threatenedSquare?.file
                )
            );
          }

          piece.piece.setMoved();
          board.push({
            piece: piece.piece,
            position: {
              rank: state.threatenedSquare?.rank,
              file: state.threatenedSquare?.file,
            },
          });

          if (move.move === "PawnPush")
            return {
              board: new Board(board, {
                piece: piece.piece,
                position: {
                  rank: state.threatenedSquare?.rank,
                  file: state.threatenedSquare?.file,
                },
              }),
            };
          return {
            board: new Board(board),
          };
        case "Castle":
          const b2 = state.board.board.filter(
            (x) =>
              !(
                x.position.rank === state.activePiece?.rank &&
                x.position.file === state.activePiece?.file
              ) &&
              !(
                x.position.rank === state.threatenedSquare?.rank &&
                x.position.file === state.threatenedSquare?.file
              ) &&
              !(
                x.position.rank === piece.position.rank &&
                x.position.file === (move.type === "SHORT" ? "h" : "a")
              )
          );

          piece.piece.setMoved();
          b2.push({
            piece: piece.piece,
            position: {
              rank: state.threatenedSquare?.rank,
              file: state.threatenedSquare?.file,
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
          return {
            board: new Board(b2),
          };
      }
    }
  }
};

type props = {
  children: React.ReactNode;
};

const GameContextProvider = ({ children }: props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GameContext.Provider value={[state, dispatch]}>
      {children}
    </GameContext.Provider>
  );
};

export {
  GameContextProvider as DraggableContextProvider,
  GameContext as DraggableContext,
};
