"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, ExternalLink, Quote, MapPin, Phone } from "lucide-react";
import { PageHero } from "../page-hero";
import { useSite } from "../content-provider";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

function Stars({ n = 5 }: { n?: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`امتیاز ${n} از ۵`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("h-4 w-4", i < n ? "fill-amber-400 text-amber-400" : "fill-background/20 text-background/20")}
        />
      ))}
    </span>
  );
}

export function ReviewsPage() {
  const { reviews, site } = useSite();
  return (
    <>
      <PageHero
        kicker="رضایت مراجعین"
        title={
          <>
            اعتماد شما،
            <span className="text-gradient-light block">افتخار ماست</span>
          </>
        }
        desc="نظرات واقعی مراجعین از گوگل مپ و پروفایل دکترتو — امتیاز ۵٫۰ از ۹ نظر در گوگل مپ"
      />

      {/* خلاصه امتیاز — پترول تیره */}
      <section className="bg-petrol-deep relative overflow-hidden py-14 lg:py-20" aria-label="خلاصه امتیاز">
        <div className="aurora" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          {/* کارت امتیاز گوگل */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
            className="glass-dark gold-top-line relative mx-auto w-full max-w-sm rounded-[2.5rem] p-8 text-center"
          >
            <div className="mb-4 flex items-center justify-center gap-1.5">
              <MapPin className="h-4 w-4 text-teal-300" />
              <span className="text-xs font-bold text-background/60">نظرات گوگل مپ</span>
            </div>
            <p className="text-[4.5rem] font-black leading-none tracking-tight text-background" aria-label="امتیاز ۵ از ۵">
              {site.rating.score}
            </p>
            <div className="mt-3 flex justify-center">
              <Stars />
            </div>
            <p className="mt-2 text-sm font-bold text-background/60">
              بر اساس {site.rating.count.toLocaleString("fa-IR")} نظر ثبت‌شده
            </p>
            <a
              href={site.reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-background px-6 py-3.5 text-sm font-black text-[oklch(0.2_0.03_205)] transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              مشاهده همه نظرات در گوگل
              <ExternalLink className="h-4 w-4" />
            </a>
            <p className="mt-4 text-[11px] leading-5 text-background/45">
              نظر خود را هم به اشتراک بگذارید تا به بهبود مجموعه کمک کنید
            </p>
          </motion.div>

          {/* آمار نظرات */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { value: "۱۸+", label: "نظر واقعی ثبت‌شده", desc: "در گوگل مپ و دکترتو" },
              { value: "۹۶٪", label: "نظرات ۵ ستاره", desc: "از مجموع نظرات ثبت‌شده" },
              { value: "ایمپلنت", label: "بیشترین موضوع رضایت", desc: "جراحی ایمپلنت و پیوند استخوان" },
              { value: "پاسداران", label: "محل مطب", desc: "مرکز خرید پاسداران، طبقه ۲ و ۴" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, ease, delay: i * 0.08 }}
                className="glass-dark rounded-3xl p-6"
              >
                <p className="text-2xl font-black text-teal-300">{s.value}</p>
                <p className="mt-1 text-sm font-extrabold text-background">{s.label}</p>
                <p className="mt-0.5 text-xs text-background/50">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* همه نظرات */}
      <section className="bg-petrol relative overflow-hidden py-16 lg:py-24" aria-label="همه نظرات">
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-10 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
              className="text-3xl font-black tracking-tight text-background sm:text-[2.4rem]"
            >
              تجربه واقعی مراجعین
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
              className="mt-3 text-sm text-background/60"
            >
              متن نظرات بدون تغییر، از منابع عمومی ثبت‌شده
            </motion.p>
          </div>

          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {reviews.map((r, i) => (
              <motion.figure
                key={`${r.author}-${i}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, ease, delay: (i % 3) * 0.08 }}
                className={cn(
                  "glass-dark relative break-inside-avoid rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1",
                  i === 0 && "gold-top-line"
                )}
              >
                <Quote className="mb-3 h-5 w-5 text-teal-300/40" />
                <blockquote className="text-[13px] leading-7 text-background/85">{r.text}</blockquote>
                <figcaption className="mt-4 flex items-center justify-between gap-3 border-t border-background/10 pt-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/15 text-sm font-black text-teal-300">
                      {r.author.charAt(0)}
                    </span>
                    <div>
                      <p className="text-[13px] font-extrabold text-background">{r.author}</p>
                      <p className="text-[11px] text-background/50">{r.meta}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Stars n={r.stars} />
                    <span className="text-[10px] font-bold text-background/45">{r.source} · {r.time}</span>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>

          {/* CTA نهایی */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            className="mx-auto mt-14 max-w-2xl rounded-[2.5rem] border border-background/12 bg-gradient-to-b from-background/[0.08] to-background/[0.03] p-8 text-center backdrop-blur-xl sm:p-10"
          >
            <h2 className="text-2xl font-black tracking-tight text-background sm:text-3xl">
              شما هم تجربه‌تان را ثبت کنید
            </h2>
            <p className="mt-3 text-sm leading-7 text-background/60">
              اگر تحت درمان دکتر بخشایی بوده‌اید، ثبت تجربه‌تان به مراجعین بعدی کمک می‌کند
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={site.reviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-black text-[oklch(0.2_0.03_205)] transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
              >
                <Star className="h-4 w-4" />
                ثبت نظر در گوگل
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-background/25 bg-background/10 px-6 py-3 text-sm font-bold text-background backdrop-blur transition-all hover:bg-background/20 cursor-pointer"
              >
                <Phone className="h-4 w-4" />
                رزرو نوبت
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
