import { Black, White } from "../classic_pieces";
import styles from "./Promotion.module.css";
type Props = {
  colour: "WHITE" | "BLACK";
  promoteCallback: (piece: "QUEEN" | "ROOK" | "BISHOP" | "KNIGHT") => void;
};

export const Promotion = ({ colour, promoteCallback }: Props) => {
  const set = colour === "WHITE" ? White : Black;

  const Queen = set.Queen;
  const Bishop = set.Bishop;
  const Rook = set.Rook;
  const Knight = set.Knight;

  return (
    <section className={styles.promotionSection}>
      <span>Select piece to promote to</span>
      <div className={styles.chessRow}>
        <div
          className={`${styles.chessSquare}`}
          onClick={() => promoteCallback("QUEEN")}
        >
          <Queen />
        </div>
        <div
          className={`${styles.chessSquare}`}
          onClick={() => promoteCallback("BISHOP")}
        >
          <Bishop />
        </div>
        <div
          className={`${styles.chessSquare}`}
          onClick={() => promoteCallback("ROOK")}
        >
          <Rook />
        </div>
        <div
          className={`${styles.chessSquare} `}
          onClick={() => promoteCallback("KNIGHT")}
        >
          <Knight />
        </div>
      </div>
    </section>
  );
};
