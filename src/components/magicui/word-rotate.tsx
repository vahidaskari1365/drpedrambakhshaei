"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Magic UI — Word Rotate
 * چرخش کلمات با ترنزیشن فنری — مناسب تیترهای کوتاه
 */
interface WordRotateProps {
  words: string[];
  duration?: number;
  motionProps?: MotionProps;
  className?: string;
}

export function WordRotate({
  words,
  duration = 2600,
  motionProps = {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
    transition: { duration: 0.28, ease: "easeOut" },
  },
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <span className="relative inline-grid overflow-hidden align-bottom [grid-template-areas:'stack']">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className={cn("[grid-area:stack]", className)}
          {...motionProps}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
