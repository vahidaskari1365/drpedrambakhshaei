"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { CASE_SLIDES } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * اسلایدر کشویی نمونه جراحی‌ها — عکس‌های واقعی، مثل صفحه اول سایت اصلی
 * سوایپ لمسی + دکمه‌ها + پخش خودکار با مکث روی هاور
 */
export function WorksSlider({ className }: { className?: string }) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const cardW = () => {
    const track = trackRef.current;
    if (!track) return 320;
    const card = track.querySelector<HTMLElement>("[data-slide]");
    return card ? card.offsetWidth + 20 : 320;
  };

  // جهت‌یابی RTL: آیتم بعدی سمت چپ است
  const go = React.useCallback((dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * cardW(), behavior: "smooth" });
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>("[data-slide]");
    const target = cards[i];
    const first = cards[0];
    if (!target || !first) return;
    // در RTL مقصد سمت چپ کارت اول است → اختلاف منفی
    track.scrollTo({ left: target.offsetLeft - first.offsetLeft, behavior: "smooth" });
  };

  // پخش خودکار
  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth - 8;
      // در RTL اسکرول به سمت منفی است؛ رسیدن به انتها = نزدیک صفر
      if (Math.abs(track.scrollLeft) >= max) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        go(-1);
      }
    }, 4200);
    return () => clearInterval(t);
  }, [paused, go]);

  // همگام‌سازی نقطه فعال با اسکرول
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-slide]"));
      const first = cards[0];
      if (!first) return;
      const x = Math.abs(track.scrollLeft);
      const w = cardW();
      setActive(Math.min(cards.length - 1, Math.round(x / w)));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={trackRef}
        className="scrollbar-slim -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 lg:mx-0 lg:px-1"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onPointerDown={() => setPaused(true)}
        onTouchStart={() => setPaused(true)}
        role="region"
        aria-label="اسلایدر نمونه جراحی‌ها"
      >
        {CASE_SLIDES.map((s, i) => (
          <motion.article
            data-slide
            key={s.title}
            initial={{ opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.85, ease, delay: i * 0.08 }}
            className="group relative aspect-[4/5] w-[78vw] shrink-0 snap-center overflow-hidden rounded-[2rem] border border-border/60 shadow-[0_30px_70px_-35px_oklch(0.35_0.05_205/0.55)] transition-all duration-500 hover:-translate-y-2 sm:w-[46vw] lg:aspect-[3/4] lg:w-[calc(25%-15px)]"
            aria-label={`${s.title} — ${s.subtitle}`}
          >
            <Image
              src={s.image}
              alt={`${s.title} — ${s.subtitle}`}
              fill
              className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.025_205/0.9)] via-[oklch(0.16_0.03_205/0.15)] to-transparent" />
            <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-3 py-1.5 text-[10px] font-black text-primary backdrop-blur">
              <Sparkles className="h-3 w-3" />
              {s.tag}
            </span>
            <div className="absolute inset-x-5 bottom-5">
              <h3 className="text-xl font-black text-background">{s.title}</h3>
              <p className="mt-1 text-[12px] font-medium leading-6 text-background/70">{s.subtitle}</p>
            </div>
          </motion.article>
        ))}
      </div>

      {/* کنترل‌ها */}
      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="اسلاید قبلی"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card text-foreground shadow-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground active:scale-90 cursor-pointer"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          {CASE_SLIDES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`رفتن به اسلاید ${i + 1}`}
              aria-current={active === i}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                active === i ? "w-9 bg-primary" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="اسلاید بعدی"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card text-foreground shadow-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground active:scale-90 cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
