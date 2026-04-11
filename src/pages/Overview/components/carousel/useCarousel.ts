import { useEffect, useState } from "react";

export function useCarousel(length: number, interval = 7000) {
  const [index, setIndex] = useState(1);
  const [paused, setPaused] = useState(false);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if (paused) return;

    const id = setInterval(() => {
      setAnimate(true);
      setIndex((i) => i + 1);
    }, interval);

    return () => clearInterval(id);
  }, [paused, interval]);

  const normalize = () => {
    if (index === 0) {
      setAnimate(false);
      setIndex(length);
    }

    if (index === length + 1) {
      setAnimate(false);
      setIndex(1);
    }
  };

  return {
    index,
    setIndex,
    setPaused,
    animate,
    setAnimate,
    normalize,
  };
}
