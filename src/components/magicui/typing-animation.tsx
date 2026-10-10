"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Magic UI — Typing Animation (تطبیق‌یافته با متن فارسی)
 * تایپ و پاک‌شدن چرخشی کلمات — سازگار با گراف‌های فارسی (Array.from)
 */
interface TypingAnimationProps {
  words?: string[];
  children?: string;
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  delay?: number;
  pauseDelay?: number;
  loop?: boolean;
  startOnView?: boolean;
  showCursor?: boolean;
}

export function TypingAnimation({
  children,
  words,
  className,
  typeSpeed = 90,
  deleteSpeed = 45,
  delay = 0,
  pauseDelay = 1600,
  loop = true,
  startOnView = true,
  showCursor = true,
}: TypingAnimationProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { amount: 0.3, once: true });

  const wordsToAnimate = useMemo(
    () => words ?? (children ? [children] : []),
    [words, children]
  );

  const [displayedText, setDisplayedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing");

  const shouldStart = startOnView ? isInView : true;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (!shouldStart || wordsToAnimate.length === 0) return;

    const timeoutDelay =
      delay > 0 && displayedText === "" && wordIndex === 0
        ? delay
        : phase === "typing"
          ? typeSpeed
          : phase === "deleting"
            ? deleteSpeed
            : pauseDelay;

    timeout = setTimeout(() => {
      const currentWord = wordsToAnimate[wordIndex] ?? "";
      const graphemes = Array.from(currentWord);

      if (phase === "typing") {
        if (charIndex < graphemes.length) {
          setDisplayedText(graphemes.slice(0, charIndex + 1).join(""));
          setCharIndex((c) => c + 1);
        } else if (wordsToAnimate.length > 1 || loop) {
          setPhase("pause");
        }
      } else if (phase === "pause") {
        if (wordsToAnimate.length > 1 || loop) setPhase("deleting");
      } else {
        if (charIndex > 0) {
          setDisplayedText(graphemes.slice(0, charIndex - 1).join(""));
          setCharIndex((c) => c - 1);
        } else {
          setWordIndex((w) => (w + 1) % wordsToAnimate.length);
          setPhase("typing");
        }
      }
    }, timeoutDelay);

    return () => {
      if (timeout !== null) clearTimeout(timeout);
    };
  }, [
    shouldStart,
    phase,
    charIndex,
    wordIndex,
    displayedText,
    wordsToAnimate,
    loop,
    typeSpeed,
    deleteSpeed,
    pauseDelay,
    delay,
  ]);

  const currentWord = wordsToAnimate[wordIndex] ?? "";
  const isSingleWord = wordsToAnimate.length <= 1;
  const isComplete =
    !loop && isSingleWord && charIndex >= Array.from(currentWord).length;

  return (
    <span ref={ref} className={cn("inline-block", className)}>
      {displayedText}
      {showCursor && !isComplete && (
        <span
          aria-hidden="true"
          className="animate-mg-blink inline-block font-normal opacity-80"
        >
          |
        </span>
      )}
    </span>
  );
}
