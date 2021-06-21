import React, { useReducer, createContext, Dispatch } from "react";
import { getValidMoves } from "../engine/board";
import InitialBoard from "../engine/initial-board";
import { File, PiecePosition, Rank } from "../engine/types";

const initialState: State = { board: InitialBoard };

const GameContext = createContext<[State, Dispatch<Action>]>([
  initialState,
  () => null,
]);

type State = {
  activePiece?: ActivePiece;
  threatenedSquare?: { rank: Rank; file: File };
  board: PiecePosition[];
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
      //Get moving piece
      const piece = state.board.find(
        (x) =>
          x.position.rank === state.activePiece?.rank &&
          x.position.file === state.activePiece?.file
      );

      if (!piece) throw new Error("state is corrupted");

      const validMoves = getValidMoves(piece, state.board);

      if (
        !validMoves.some(
          (x) =>
            state.threatenedSquare?.rank === x.rank &&
            state.threatenedSquare?.file === x.file
        )
      ) {
        return {
          board: state.board,
        };
      }

      const board = state.board.filter(
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

      board.push({
        colour: piece?.colour,
        piece: piece.piece,
        position: {
          rank: state.threatenedSquare?.rank,
          file: state.threatenedSquare?.file,
        },
      });

      return {
        board,
      };
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
