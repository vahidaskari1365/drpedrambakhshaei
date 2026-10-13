"use client";

import { memo } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Magic UI — TextAnimate (نسخه سبک blurInUp)
 * شکستن متن به کلمات و ورود پلکانی با بلور — یک‌بار در ورود به ویو
 */
interface TextAnimateProps {
  children: string;
  className?: string;
  segmentClassName?: string;
  delay?: number;
  duration?: number;
  by?: "word" | "character";
  once?: boolean;
  accessible?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

const container: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { delayChildren: 0, staggerChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      y: { duration: 0.35 },
      opacity: { duration: 0.45 },
      filter: { duration: 0.35 },
    },
  },
};

const MotionTag = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

const TextAnimateBase = ({
  children,
  className,
  segmentClassName,
  delay = 0,
  duration = 0.05,
  by = "word",
  once = true,
  accessible = true,
  as = "span",
}: TextAnimateProps) => {
  const MotionComponent = MotionTag[as];

  const segments =
    by === "word"
      ? children.split(/(\s+)/)
      : Array.from(children);

  return (
    <MotionComponent
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once }}
      className={cn("whitespace-pre-wrap", className)}
      aria-label={accessible ? children : undefined}
    >
      {accessible && <span className="sr-only">{children}</span>}
      {segments.map((segment, i) => (
        <motion.span
          key={`${by}-${i}-${segment}`}
          variants={item}
          transition={{ delayChildren: delay, staggerChildren: duration }}
          className={cn(
            "inline-block whitespace-pre",
            segmentClassName
          )}
          aria-hidden={accessible ? true : undefined}
        >
          {segment}
        </motion.span>
      ))}
    </MotionComponent>
  );
};

export const TextAnimate = memo(TextAnimateBase);
