import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Magic UI — Marquee
 * نوار متحرک بی‌نهایت با CSS کامپوزیتوری (بدون framer) — RTL-safe
 * حلقه روی keyframe محلی animate-mg-marquee تعریف شده در globals.css
 */
interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex [gap:var(--mg-gap,1rem)] overflow-hidden p-2 [--mg-duration:40s]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 ? true : undefined}
          className={cn("flex shrink-0 justify-around [gap:var(--mg-gap,1rem)]", {
            "animate-mg-marquee flex-row": !vertical,
            "animate-mg-marquee-vertical flex-col": vertical,
            "group-hover:[animation-play-state:paused]": pauseOnHover,
            "[animation-direction:reverse]": reverse,
          })}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
