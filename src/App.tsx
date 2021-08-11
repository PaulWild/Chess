import { useState } from "react";
import { Draggable } from "./components/draggable";
import { Black, White } from "./components/classic_pieces";
import styles from "./App.module.css";
import { useRef } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import {
  DraggableContext,
  DraggableContextProvider,
} from "./components/game-context";
import { useContext } from "react";
import { File, Rank } from "./engine/types";
import {
  FileArray,
  isLightSquare,
  RankArray,
  Board as GameBoard,
} from "./engine/board";

const getPieceAt = (rank: Rank, file: File, currentBoard: GameBoard) => {
  const square = currentBoard.getPieceAt({ rank, file });

  if (square.piece) {
    const set = square.piece.colour === "WHITE" ? White : Black;
    switch (square.piece.pieceType) {
      case "BISHOP":
        return set.Bishop;
      case "KING":
        return set.King;
      case "KNIGHT":
        return set.Knight;
      case "PAWN":
        return set.Pawn;
      case "QUEEN":
        return set.Queen;
      case "ROOK":
        return set.Rook;
    }
  }
};

type gridProps = {
  rank: Rank;
  file: File;
  bound: DOMRect | undefined;
};

const GridPosition = ({ rank, file, bound }: gridProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useContext(DraggableContext);
  const [inBound, setInBound] = useState(false);
  const isLight = isLightSquare(rank, file);
  const Piece = getPieceAt(rank, file, state.board);

  useEffect(() => {
    const bound = ref.current?.getBoundingClientRect();

    if (bound) {
      if (
        state.activePiece &&
        state.activePiece.x >= bound?.left &&
        state.activePiece.x < bound?.right &&
        state.activePiece.y >= bound.top &&
        state.activePiece.y < bound.bottom
      ) {
        setInBound(true);
      } else {
        setInBound(false);
      }
    }
  }, [state, rank, file]);

  useEffect(() => {
    if (inBound) {
      dispatch({ type: "SQUARE_ATTACKED", payload: { rank, file } });
    }
  }, [inBound, dispatch, file, rank]);

  const pieceHover = useCallback(
    (x, y) => dispatch({ type: "PIECE_HOVER", payload: { x, y } }),
    [dispatch]
  );

  const pieceActivated = useCallback(
    (x, y) =>
      dispatch({ type: "PIECE_ACTIVATED", payload: { rank, file, x, y } }),
    [dispatch, rank, file]
  );

  const move = useCallback(() => dispatch({ type: "MOVE" }), [dispatch]);

  return (
    <div
      className={`${styles.chessSquare} ${isLight ? styles.light : ""} ${
        inBound ? styles.highlighted : ""
      }`}
      //@ts-ignore
      rank={rank}
      file={file}
      key={rank + file}
      ref={ref}
    >
      {Piece && (
        <Draggable
          boundingBox={bound}
          onMouseUp={move}
          onMouseMove={pieceHover}
          onMouseDown={pieceActivated}
        >
          <Piece />
        </Draggable>
      )}
    </div>
  );
};

const Board = () => {
  const chessGrid = useRef<HTMLDivElement>(null);
  const [bound, setBound] = useState<DOMRect>();

  const onWindowResize = useCallback(() => {
    setBound(chessGrid.current?.getBoundingClientRect());
  }, []);

  useOnWindowResize(onWindowResize);

  useEffect(() => {
    setBound(chessGrid.current?.getBoundingClientRect());
  }, [chessGrid]);

  return (
    <div className={styles.container}>
      <div ref={chessGrid} className={styles.chessGrid}>
        {RankArray.map((r) =>
          FileArray.map((f) => (
            <GridPosition rank={r} file={f} bound={bound} key={r + f} />
          ))
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <DraggableContextProvider>
      <Board />
    </DraggableContextProvider>
  );
}

export default App;

const useOnWindowResize = (action: Function) => {
  useEffect(() => {
    const handleResize = () => {
      action();
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [action]);
};
