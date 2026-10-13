import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Magic UI — Animated Gradient Text
 * متن با گرادیان متحرک برند (پترول → طلایی)
 */
export interface AnimatedGradientTextProps
  extends ComponentPropsWithoutRef<"span"> {
  speed?: number;
  colorFrom?: string;
  colorTo?: string;
}

export function AnimatedGradientText({
  children,
  className,
  speed = 1,
  colorFrom = "#2e9d9a",
  colorTo = "#d9a53f",
  ...props
}: AnimatedGradientTextProps) {
  return (
    <span
      style={
        {
          "--mg-bg-size": `${speed * 300}%`,
          "--mg-color-from": colorFrom,
          "--mg-color-to": colorTo,
        } as React.CSSProperties
      }
      className={cn(
        "animate-mg-gradient-x inline bg-gradient-to-r from-[var(--mg-color-from)] via-[var(--mg-color-to)] to-[var(--mg-color-from)] bg-[length:var(--mg-bg-size)_100%] bg-clip-text text-transparent",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
