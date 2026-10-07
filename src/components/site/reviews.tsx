"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, ExternalLink, Quote, MapPin } from "lucide-react";
import { REVIEWS, SITE } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./services";

const ease = [0.16, 1, 0.3, 1] as const;

function Stars({ n = 5 }: { n?: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`امتیاز ${n} از ۵`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < n ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
          )}
        />
      ))}
    </span>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className="relative overflow-hidden py-20 lg:py-28" aria-label="نظرات مراجعین">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          kicker="رضایت مراجعین"
          title={
            <>
              اعتماد شما،
              <br className="hidden sm:block" /> افتخار ماست
            </>
          }
        />

        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* امتیاز کل */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
            className="relative mx-auto w-full max-w-sm rounded-[2.5rem] border border-border/60 bg-card p-8 text-center shadow-[0_30px_80px_-30px] shadow-foreground/25"
          >
            <div className="absolute inset-x-0 -top-px mx-auto h-px w-2/3 bg-gradient-to-l from-transparent via-amber-400/60 to-transparent" />
            <div className="mb-4 flex items-center justify-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-muted-foreground">نظرات گوگل مپ</span>
            </div>
            <p className="text-[4.5rem] font-black leading-none tracking-tight" aria-label="امتیاز ۵ از ۵">
              {SITE.rating.score}
            </p>
            <div className="mt-3 flex justify-center">
              <Stars />
            </div>
            <p className="mt-2 text-sm font-bold text-muted-foreground">
              بر اساس {SITE.rating.count.toLocaleString("fa-IR")} نظر ثبت‌شده
            </p>
            <a
              href={SITE.reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-bold text-background transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              مشاهده همه نظرات در گوگل
              <ExternalLink className="h-4 w-4" />
            </a>
            <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
              نظر خود را هم به اشتراک بگذارید تا به بهبود مجموعه کمک کنید
            </p>
          </motion.div>

          {/* کارت‌های نظر */}
          <div className="grid gap-4 sm:grid-cols-2">
            {REVIEWS.map((r, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, ease, delay: i * 0.1 }}
                className={cn(
                  "relative flex flex-col rounded-3xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg",
                  i === 0 && "sm:col-span-2 border-primary/25 bg-gradient-to-bl from-card to-primary/[0.04]"
                )}
              >
                <Quote className="mb-3 h-5 w-5 text-primary/40" />
                <blockquote className="flex-1 text-sm leading-8 text-foreground/85">
                  {r.text}
                </blockquote>
                <figcaption className="mt-4 flex items-center justify-between gap-3 border-t border-border/50 pt-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-black text-primary">
                      {r.author.charAt(0)}
                    </span>
                    <div>
                      <p className="text-[13px] font-extrabold">{r.author}</p>
                      <p className="text-[11px] text-muted-foreground">{r.meta} · {r.time}</p>
                    </div>
                  </div>
                  <Stars n={r.stars} />
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
