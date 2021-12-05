import { useCallback, useEffect, useState } from "react";

export const useStockfish = (onMove: (move: string) => void) => {
  var [stockfish] = useState(() => {
    console.log("created a stockfish");
    return new Worker(`/chess/stockfish.asm.js`);
  });

  useEffect(() => {
    stockfish.postMessage("uci");
    stockfish.postMessage("setoption name Skill Level value 10");
    stockfish.onmessage = function (line) {
      console.log(line.data);

      if (line.data.indexOf("bestmove") > -1) {
        const move = line.data as String;
        const match = move.match(/bestmove\s+(\S+)/);
        if (match) {
          console.log("Best move: " + match[1]);
          onMove(match[1]);
        }
      }
    };
  }, [onMove, stockfish]);

  const setMove = useCallback(
    (fenString: string) => {
      console.log("Hello");
      console.log(fenString);
      stockfish.postMessage(`position fen ${fenString}`);
      stockfish.postMessage("go depth 10");
      setTimeout(function () {
        stockfish.postMessage("stop");
      }, 1000 * 5);
    },
    [stockfish]
  );

  return setMove;
};
