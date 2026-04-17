import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { overviewCards } from "../../data/overviewData";

type Card = {
  id: number;
  title: string;
  value: string;
  color: string;
};

// Map overviewCards to the Card format expected by this carousel
const cards: Card[] = overviewCards.map(card => ({
  id: card.id,
  title: card.title,
  value: card.value,
  color: card.accent, // Use accent as the background color directly
}));

// ---- layout constants ----
const CARD_SIZE = 260; // square cards
const GAP = 24;
const TRACK_WIDTH = cards.length * (CARD_SIZE + GAP);

export default function CardCarousel() {
  const x = useMotionValue(0);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    controlsRef.current = animate(x, [-TRACK_WIDTH, 0], {
      ease: "linear",
      duration: 30,
      repeat: Infinity,
    });

    return () => {
      controlsRef.current?.stop();
    };
  }, [x]);

  return (
    <div
      className="overflow-hidden"
      style={{
        width: CARD_SIZE * 3 + GAP * 2, // exactly 3 cards visible
      }}
    >
      <motion.div
        className="flex"
        style={{
          x,
          gap: `${GAP}px`,
          width: TRACK_WIDTH * 2,
        }}
      >
        {/* First track */}
        {cards.map((card) => (
          <CardItem key={`a-${card.id}`} card={card} />
        ))}

        {/* Duplicate track */}
        {cards.map((card) => (
          <CardItem key={`b-${card.id}`} card={card} />
        ))}
      </motion.div>
    </div>
  );
}

function CardItem({ card }: { card: Card }) {
  return (
    <div
      className="
        flex-shrink-0
        rounded-2xl
        shadow-lg
        flex
        flex-col
        justify-center
        items-center
        text-white
        font-semibold
      "
      style={{
        width: CARD_SIZE,
        height: CARD_SIZE,
        backgroundColor: card.color,
      }}
    >
      <div className="text-lg">{card.title}</div>
      <div className="text-3xl mt-2">{card.value}</div>
    </div>
  );
}
