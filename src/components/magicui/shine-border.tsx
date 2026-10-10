import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Magic UI — Shine Border
 * مرز درخشان چرخان با گرادیان radial متحرک — CSS کامپوزیتوری
 */
interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  borderWidth?: number;
  duration?: number;
  shineColor?: string | string[];
}

export function ShineBorder({
  borderWidth = 1.5,
  duration = 12,
  shineColor = ["#2e9d9a", "#d9a53f"],
  className,
  style,
  ...props
}: ShineBorderProps) {
  return (
    <div
      aria-hidden="true"
      style={
        {
          "--mg-border-width": `${borderWidth}px`,
          "--mg-shine-duration": `${duration}s`,
          backgroundImage: `radial-gradient(transparent, transparent, ${
            Array.isArray(shineColor) ? shineColor.join(",") : shineColor
          }, transparent, transparent)`,
          backgroundSize: "300% 300%",
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "var(--mg-border-width)",
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "animate-mg-shine pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position]",
        className
      )}
      {...props}
    />
  );
}
