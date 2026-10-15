import { cn } from "@/lib/utils";

/**
 * Magic UI — Meteors (نسخه deterministic)
 * شهاب‌سنگ‌های محیطی با مختصات قطعی (بدون hydration mismatch) — CSS کامپوزیتوری
 */
interface MeteorsProps {
  number?: number;
  minDelay?: number;
  maxDelay?: number;
  minDuration?: number;
  maxDuration?: number;
  angle?: number;
  className?: string;
}

/** random قطعی بر اساس seed — برای SSR/CSR یکسان */
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function Meteors({
  number = 18,
  minDelay = 0.4,
  maxDelay = 4.2,
  minDuration = 3,
  maxDuration = 9,
  angle = 215,
  className,
}: MeteorsProps) {
  const meteors = Array.from({ length: number }, (_, i) => {
    const r1 = seededRandom(i + 1);
    const r2 = seededRandom(i + 42);
    const r3 = seededRandom(i + 77);
    return {
      left: `${(r1 * 100).toFixed(2)}%`,
      animationDelay: `${(r2 * (maxDelay - minDelay) + minDelay).toFixed(2)}s`,
      animationDuration: `${(Math.floor(r3 * (maxDuration - minDuration)) + minDuration).toFixed(2)}s`,
    };
  });

  return (
    <>
      {meteors.map((m, idx) => (
        <span
          key={idx}
          aria-hidden="true"
          style={
            {
              "--mg-angle": `${-angle}deg`,
              top: "-5%",
              left: m.left,
              animationDelay: m.animationDelay,
              animationDuration: m.animationDuration,
            } as React.CSSProperties
          }
          className={cn(
            "animate-mg-meteor pointer-events-none absolute size-0.5 rotate-[var(--mg-angle)] rounded-full bg-emerald-200/90 shadow-[0_0_0_1px_#ffffff10]",
            className
          )}
        >
          {/* دنباله شهاب */}
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-12 -translate-y-1/2 bg-gradient-to-r from-emerald-200/80 to-transparent" />
        </span>
      ))}
    </>
  );
}
