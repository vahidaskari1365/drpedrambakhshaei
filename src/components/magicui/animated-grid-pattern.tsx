import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Magic UI — Flickering pattern جایگزین: Animated Grid Pattern (نسخه CSS)
 * الگوی شبکه‌ای با نقاط درخشان چشمک‌زن — برای پس‌زمینه‌های تیره
 */
interface AnimatedGridPatternProps
  extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function AnimatedGridPattern({
  width = 48,
  height = 48,
  numSquares = 40,
  className,
  maxOpacity = 0.5,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId();

  const squares = Array.from({ length: numSquares }, (_, i) => {
    const r1 = seededRandom(i + 3);
    const r2 = seededRandom(i + 91);
    const r3 = seededRandom(i + 133);
    return {
      x: Math.floor(r1 * 12) * width,
      y: Math.floor(r2 * 12) * height,
      opacity: (0.15 + r3 * maxOpacity).toFixed(2),
      delay: (r2 * 4).toFixed(2),
      duration: (2.5 + r1 * 2.5).toFixed(2),
      span: r3 > 0.75,
    };
  });

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-emerald-200",
        className
      )}
      {...props}
    >
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse">
          <path
            d={`M ${width} 0 L 0 0 0 ${height}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            strokeOpacity={0.08}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares.map((s, i) => (
        <rect
          key={i}
          x={s.x}
          y={s.y}
          width={s.span ? width * 2 : width}
          height={s.span ? height * 2 : height}
          fill="currentColor"
          opacity={0}
          className="animate-mg-grid-glow"
          style={
            {
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
              "--mg-max-opacity": s.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </svg>
  );
}
