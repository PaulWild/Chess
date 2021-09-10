import { Board, FileArray, RankArray } from "../board";
import { Game } from "../game";
import { CastlingRights } from "../types";

export const toFenString = (game: Game): string => {
  if (game.state === "BlackMove" || game.state === "WhiteMove") {
    return `${boardAsFenPlacement(game.board)} ${
      game.state === "WhiteMove" ? "w" : "b"
    } ${castlingAbilityString(game)} ${enPassantFen(game)} ${game.HalfMoves} ${
      game.FullMoves
    }`;
  } else {
    return "";
  }
};

const enPassantFen = (game: Game): string => {
  return game.enPassantSquare
    ? `${game.enPassantSquare.file}${game.enPassantSquare.rank}`
    : "-";
};

const castlingAbilityString = (game: Game): string => {
  let str = "";
  if (game.CastlingAbility & CastlingRights.K) str += "K";
  if (game.CastlingAbility & CastlingRights.Q) str += "Q";
  if (game.CastlingAbility & CastlingRights.k) str += "k";
  if (game.CastlingAbility & CastlingRights.q) str += "q";

  return str === "" ? "-" : str;
};

export const boardAsFenPlacement = (board: Board): string => {
  let ranks: string[] = [];
  RankArray.forEach((rank) => {
    let count = 0;
    let rankString = "";
    FileArray.forEach((file) => {
      let piece = board.getPieceAt({ rank, file });
      if (piece.piece) {
        if (count > 0) {
          rankString += count;
          count = 0;
        }
        let str = "";
        switch (piece.piece!.pieceType) {
          case "BISHOP":
            str = "b";
            break;
          case "KING":
            str = "k";
            break;
          case "KNIGHT":
            str = "n";
            break;
          case "PAWN":
            str = "p";
            break;
          case "QUEEN":
            str = "q";
            break;
          case "ROOK":
            str = "r";
            break;
        }
        if (piece.piece.colour === "WHITE") {
          str = str.toUpperCase();
        }

        rankString += str;
      } else if (file === "h") {
        rankString += ++count;
      }
      if (!piece.piece) {
        count += 1;
      }
    });
    ranks.push(rankString);
  });

  return ranks.join("/");
};
