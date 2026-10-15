import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Magic UI — Shimmer Button (نسخه CSS کامپوزیتوری)
 * دکمه درخشان با پرتو conic چرخان — با href لینک رندر می‌شود
 */
export interface ShimmerButtonProps
  extends React.ComponentPropsWithoutRef<"a"> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  contentClassName?: string;
}

export const ShimmerButton = React.forwardRef<
  HTMLAnchorElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "#f0c869",
      shimmerSize = "0.06em",
      shimmerDuration = "3.4s",
      borderRadius = "999px",
      background = "linear-gradient(135deg, oklch(0.32 0.06 262), oklch(0.24 0.05 264))",
      className,
      children,
      contentClassName,
      ...props
    },
    ref
  ) => {
    return (
      <a
        ref={ref}
        style={
          {
            "--mg-spread": "90deg",
            "--mg-shimmer-color": shimmerColor,
            "--mg-radius": borderRadius,
            "--mg-speed": shimmerDuration,
            "--mg-cut": shimmerSize,
            "--mg-bg": background,
          } as React.CSSProperties
        }
        className={cn(
          "group relative z-0 flex items-center justify-center overflow-hidden whitespace-nowrap [border-radius:var(--mg-radius)] border border-white/15 px-7 py-3.5 text-white [background:var(--mg-bg)]",
          "transform-gpu transition-transform duration-300 ease-in-out hover:scale-[1.03] active:translate-y-px active:scale-95",
          className
        )}
        {...props}
      >
        {/* محفظه پرتو */}
        <div className="absolute inset-0 overflow-visible blur-[2px] [-z-30] [container-type:size]">
          <div className="animate-mg-shimmer-slide absolute inset-0 aspect-1 h-[100cqh] rounded-none">
            <div className="animate-mg-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--mg-spread)*0.5)),transparent_0,var(--mg-shimmer-color)_var(--mg-spread),transparent_var(--mg-spread))] [translate:0_0]" />
          </div>
        </div>

        {children}

        {/* هایلایت داخلی */}
        <div className="absolute inset-0 size-full rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f] transition-all duration-300 ease-in-out group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]" />

        {/* بک‌دراپ */}
        <div className="absolute inset-[var(--mg-cut)] -z-20 [border-radius:var(--mg-radius)] [background:var(--mg-bg)]" />
      </a>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
