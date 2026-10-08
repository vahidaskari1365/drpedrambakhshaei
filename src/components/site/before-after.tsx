"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * اسلایدر مقایسه قبل/بعد — مثل سایت اصلی (cz_image_comparison_slider)
 * کشیدن دستگیره لایه «قبل» را روی «بعد» باز و بسته می‌کند؛ RTL-دوست
 */
export function BeforeAfter({
  before,
  after,
  beforeLabel = "قبل",
  afterLabel = "بعد",
  alt = "مقایسه قبل و بعد جراحی",
  className,
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState(50); // درصد فاصله دستگیره از راست
  const [dragging, setDragging] = React.useState(false);
  const [touched, setTouched] = React.useState(false);

  const update = React.useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((rect.right - clientX) / rect.width) * 100; // از راست (RTL)
    setPos(Math.min(96, Math.max(4, p)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    setTouched(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    update(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging) update(e.clientX);
  };
  const stop = () => setDragging(false);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setPos((p) => Math.min(96, p + 4));
      setTouched(true);
    }
    if (e.key === "ArrowRight") {
      setPos((p) => Math.max(4, p - 4));
      setTouched(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 32 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease }}
      className={cn("relative", className)}
    >
      <div
        ref={ref}
        role="slider"
        tabIndex={0}
        aria-label="اسلایدر مقایسه قبل و بعد"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
        onKeyDown={onKey}
        className={cn(
          "group relative aspect-[16/9] w-full touch-none select-none overflow-hidden rounded-[2rem] border border-background/15 bg-petrol-deep shadow-[0_40px_90px_-40px_oklch(0.06_0.02_205/0.9)] outline-none focus-visible:ring-2 focus-visible:ring-teal-300",
          dragging ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        {/* لایه پایه — بعد */}
        <Image
          src={after}
          alt={`${alt} — ${afterLabel}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 900px"
          priority
        />
        {/* لایه کلیپ‌شده — قبل (از سمت راست) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${100 - pos}%)` }}
        >
          <Image
            src={before}
            alt={`${alt} — ${beforeLabel}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 900px"
          />
        </div>

        {/* برچسب‌ها */}
        <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-[oklch(0.15_0.02_205/0.72)] px-3.5 py-1.5 text-xs font-black text-background backdrop-blur">
          {beforeLabel}
        </span>
        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-teal-400/85 px-3.5 py-1.5 text-xs font-black text-[oklch(0.15_0.03_205)] backdrop-blur">
          {afterLabel}
        </span>

        {/* دستگیره */}
        <div
          className="pointer-events-none absolute inset-y-0"
          style={{ right: `${pos}%` }}
        >
          <div className="absolute inset-y-0 -translate-x-1/2 border-r-2 border-dashed border-background/80" />
          <div
            className={cn(
              "absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-background/40 bg-background/95 text-[oklch(0.2_0.03_205)] shadow-[0_10px_30px_-8px_oklch(0.08_0.02_205/0.8)] backdrop-blur transition-transform",
              dragging ? "scale-110" : "group-hover:scale-105"
            )}
          >
            <MoveHorizontal className="h-5 w-5" />
          </div>
        </div>

        {/* راهنمای اولیه */}
        {!touched && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[oklch(0.15_0.02_205/0.72)] px-4 py-2 text-[11px] font-bold text-background backdrop-blur"
          >
            <MoveHorizontal className="h-3.5 w-3.5 animate-pulse-soft" />
            دستگیره را بکشید
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
