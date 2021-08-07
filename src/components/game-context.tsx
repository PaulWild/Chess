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

      console.log(validMoves);

      const move = validMoves.find(
        (m) =>
          m.file === state.threatenedSquare?.file &&
          m.rank === state.threatenedSquare?.rank
      );

      if (!move) {
        return {
          board: state.board,
        };
      }

      switch (move.move) {
        case "Castle":
          console.log(move);
          const rookFile = move.type === "SHORT" ? "h" : "a";
          const rookRank = move.colour === "WHITE" ? 1 : 8;

          const board1 = state.board.filter(
            (x) =>
              !(
                x.position.rank === state.activePiece?.rank &&
                x.position.file === state.activePiece?.file
              ) &&
              !(x.position.rank === rookRank && x.position.file === rookFile)
          );

          const rookFileNew = move.type === "SHORT" ? "f" : "d";

          board1.push({
            colour: piece?.colour,
            piece: "ROOK",
            moved: true,
            position: {
              rank: rookRank,
              file: rookFileNew,
            },
          });

          board1.push({
            colour: piece?.colour,
            piece: piece.piece,
            moved: true,
            position: {
              rank: state.threatenedSquare?.rank,
              file: state.threatenedSquare?.file,
            },
          });
          return {
            board: board1,
          };
        case "Capture":
        case "Move":
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
            moved: true,
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
