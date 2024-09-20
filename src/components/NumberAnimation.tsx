"use client";

import { useInView } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NumberAnimationProps {
  value: number;
}

export const NumberAnimation: React.FC<NumberAnimationProps> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [currentValue, setCurrentValue] = useState(0);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      const duration = 200; // Animation duration in milliseconds
      const steps = 10; // Number of steps in the animation
      const stepDuration = duration / steps;
      const increment = (value - currentValue) / steps;

      let step = 0;
      const interval = setInterval(() => {
        if (step < steps) {
          setCurrentValue((prevValue) => {
            const newValue = prevValue + increment;
            return newValue > value ? value : newValue;
          });
          step++;
        } else {
          setCurrentValue(value);
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [value, isInView, currentValue]);

  return (
    <span ref={ref} className="text-3xl font-bold">
      {Intl.NumberFormat("en-US").format(Math.ceil(currentValue))}
    </span>
  );
};
