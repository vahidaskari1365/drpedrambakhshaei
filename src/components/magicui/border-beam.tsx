import { cn } from "@/lib/utils";

/**
 * Magic UI — Border Beam (نسخه CSS کامپوزیتوری)
 * پرتو نور متحرک دور مرز کارت — بدون framer تا در همه محیط‌ها پایدار باشد
 */
interface BorderBeamProps {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  reverse?: boolean;
  initialOffset?: number;
  borderWidth?: number;
  className?: string;
}

export function BorderBeam({
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "#2e9d9a",
  colorTo = "#d9a53f",
  reverse = false,
  initialOffset = 0,
  borderWidth = 1.5,
  className,
}: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-transparent [border-style:solid] [border-width:var(--mg-beam-width)] [mask:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] [mask-composite:intersect] [-webkit-mask-composite:xor]"
      style={{ "--mg-beam-width": `${borderWidth}px` } as React.CSSProperties}
    >
      <div
        className={cn(
          "animate-mg-border-beam absolute aspect-square",
          className
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            animationDelay: `-${delay}s`,
            animationDuration: `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
            background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
            "--mg-offset-start": `${initialOffset}%`,
          } as React.CSSProperties
        }
      />
    </div>
  );
}
