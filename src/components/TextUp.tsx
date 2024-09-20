import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TextUpProps {
  animationTrigger: number;
  points: number;
}

interface AnimatedText {
  id: number;
  points: number;
  x: number;
  y: number;
}

const TextUp = ({ animationTrigger, points }: TextUpProps) => {
  const [animatedTexts, setAnimatedTexts] = useState<AnimatedText[]>([]);

  useEffect(() => {
    if (animationTrigger > 0) {
      const newId = animationTrigger;
      const newX = Math.random() * 250 - 125; // Random x position between -125 and 125
      const newY = Math.random() * 75 - 37.5; // Random y position between -37.5 and 37.5
      setAnimatedTexts((prev) => [
        ...prev,
        { id: newId, points, x: newX, y: newY },
      ]);

      const timer = setTimeout(() => {
        setAnimatedTexts((prev) => prev.filter((text) => text.id !== newId));
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [animationTrigger, points]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedTexts([]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center relative">
      <AnimatePresence>
        {animatedTexts.map((text) => (
          <motion.div
            key={text.id}
            initial={{ opacity: 0, y: text.y + 20, x: text.x }}
            animate={{ opacity: 1, y: text.y, x: text.x }}
            exit={{ opacity: 0, y: text.y - 20, x: text.x }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-green-500 mt-4 absolute"
          >
            +{text.points}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TextUp;
