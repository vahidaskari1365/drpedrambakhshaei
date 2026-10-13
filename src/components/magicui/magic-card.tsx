"use client";

import React, { useCallback, useEffect, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Magic UI — Magic Card (تطبیق‌یافته)
 * کارت با نورافکن گرادیانی دنبال‌کننده ماوس — دو حالت «گرادیان مرزی» و «گوی درخشان»
 * بدون وابستگی به next-themes؛ رنگ‌ها با پراپ پاس داده می‌شوند.
 */
interface MagicCardBaseProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  gradientSize?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

interface MagicCardGradientProps extends MagicCardBaseProps {
  mode?: "gradient";
  gradientColor?: string;
  gradientOpacity?: number;
}

interface MagicCardOrbProps extends MagicCardBaseProps {
  mode: "orb";
  glowFrom?: string;
  glowTo?: string;
  glowAngle?: number;
  glowSize?: number;
  glowBlur?: number;
  glowOpacity?: number;
}

type MagicCardProps = MagicCardGradientProps | MagicCardOrbProps;

function isOrbMode(props: MagicCardProps): props is MagicCardOrbProps {
  return props.mode === "orb";
}

export function MagicCard(props: MagicCardProps) {
  const {
    children,
    className,
    style,
    gradientSize = 220,
    gradientFrom = "#2e9d9a",
    gradientTo = "#d9a53f",
    mode = "gradient",
  } = props;

  const gradientColor = isOrbMode(props)
    ? undefined
    : (props.gradientColor ?? "oklch(0.52 0.09 190 / 0.08)");
  const gradientOpacity = isOrbMode(props)
    ? undefined
    : (props.gradientOpacity ?? 1);

  const glowFrom = isOrbMode(props) ? (props.glowFrom ?? "#2e9d9a") : "#2e9d9a";
  const glowTo = isOrbMode(props) ? (props.glowTo ?? "#d9a53f") : "#d9a53f";
  const glowAngle = isOrbMode(props) ? (props.glowAngle ?? 90) : 90;
  const glowSize = isOrbMode(props) ? (props.glowSize ?? 420) : 420;
  const glowBlur = isOrbMode(props) ? (props.glowBlur ?? 60) : 60;
  const glowOpacity = isOrbMode(props) ? (props.glowOpacity ?? 0.9) : 0.9;

  const mouseX = useMotionValue(-gradientSize * 2);
  const mouseY = useMotionValue(-gradientSize * 2);

  const orbX = useSpring(mouseX, { stiffness: 250, damping: 30, mass: 0.6 });
  const orbY = useSpring(mouseY, { stiffness: 250, damping: 30, mass: 0.6 });
  const orbVisible = useSpring(0, { stiffness: 300, damping: 35 });

  const modeRef = useRef(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const reset = useCallback(
    (reason: "enter" | "leave") => {
      if (modeRef.current === "orb") {
        orbVisible.set(reason === "enter" ? glowOpacity : 0);
        return;
      }
      mouseX.set(-gradientSize * 2);
      mouseY.set(-gradientSize * 2);
    },
    [mouseX, mouseY, orbVisible, glowOpacity, gradientSize]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const borderBackground = useMotionTemplate`
    linear-gradient(var(--mg-card-bg, var(--card)) 0 0) padding-box,
    radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
      ${gradientFrom},
      ${gradientTo},
      var(--border) 100%
    ) border-box
  `;

  const innerGlow = useMotionTemplate`
    radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
      ${gradientColor ?? "transparent"},
      transparent 100%
    )
  `;

  return (
    <motion.div
      className={cn(
        "group relative isolate overflow-hidden rounded-[inherit] border border-transparent",
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => reset("leave")}
      onPointerEnter={() => reset("enter")}
      style={{
        background: borderBackground,
        ...style,
      }}
    >
      <div className="absolute inset-px z-20 rounded-[inherit] bg-[var(--mg-card-bg,var(--card))]" />

      {mode === "gradient" && (
        <motion.div
          suppressHydrationWarning
          className="pointer-events-none absolute inset-px z-30 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: innerGlow,
            opacity: gradientOpacity,
          }}
        />
      )}

      {mode === "orb" && (
        <motion.div
          suppressHydrationWarning
          aria-hidden="true"
          className="pointer-events-none absolute z-30"
          style={{
            width: glowSize,
            height: glowSize,
            x: orbX,
            y: orbY,
            translateX: "-50%",
            translateY: "-50%",
            borderRadius: 9999,
            filter: `blur(${glowBlur}px)`,
            opacity: orbVisible,
            background: `linear-gradient(${glowAngle}deg, ${glowFrom}, ${glowTo})`,
            mixBlendMode: "screen",
            willChange: "transform, opacity",
          }}
        />
      )}
      <div className="relative z-40">{children}</div>
    </motion.div>
  );
}
