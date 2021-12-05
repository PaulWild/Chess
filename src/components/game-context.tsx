import React, { useReducer, createContext, Dispatch } from "react";
import { Board } from "../engine/board";
import { Game } from "../engine/game";
import { File, GameState, Rank } from "../engine/types";

const game = new Game();
const initialState: State = {
  board: game.board,
  state: game.state,
  game: game,
};

const GameContext = createContext<[State, Dispatch<Action>]>([
  initialState,
  () => null,
]);

type State = {
  activePiece?: ActivePiece;
  threatenedSquare?: { rank: Rank; file: File };
  board: Board;
  state: GameState;
  game: Game;
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
  | { type: "MOVE" }
  | {
      type: "BLACKMOVE";
      payload: {
        from: { rank: Rank; file: File };
        to: { rank: Rank; file: File };
      };
    }
  | {
      type: "PROMOTE";
      payload: { piece: "QUEEN" | "ROOK" | "BISHOP" | "KNIGHT" };
    };

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
    case "PROMOTE":
      game.promote(action.payload.piece);
      return {
        board: game.board,
        state: game.state,
        game: game,
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

      if (state.state === "WhiteMove") {
        try {
          game.move(from, to);
        } catch (e) {
          console.log(e);
        }
      }

      return {
        board: game.board,
        state: game.state,
        game: game,
      };
    }
    case "BLACKMOVE": {
      try {
        game.move(action.payload.from, action.payload.to);
      } catch (e) {
        console.log(e);
      }

      return {
        board: game.board,
        state: game.state,
        game: game,
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
