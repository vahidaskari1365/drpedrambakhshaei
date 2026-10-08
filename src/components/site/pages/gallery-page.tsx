"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Expand, ArrowLeft, ChevronRight, ChevronLeft, Camera, Sparkles } from "lucide-react";
import { PageHero } from "../page-hero";
import { SectionHeading } from "../section-heading";
import { BeforeAfter } from "../before-after";
import { useSite } from "../content-provider";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

/** دسته‌بندی نمونه کارها برای فیلتر گرید معمولی */
type Category = "all" | "treatments" | "clinic";

const TREATMENT_IMAGES = new Set([
  "/uploads/jaw-surgery-result.jpg",
  "/uploads/genioplasty-real.jpg",
  "/uploads/implant-real.jpg",
  "/uploads/wisdom-real.jpg",
]);

const FILTERS: { id: Category; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "treatments", label: "جراحی‌ها و خدمات" },
  { id: "clinic", label: "فضای مطب" },
];

export function GalleryPage() {
  const { works, gallery, beforeAfter } = useSite();
  const [filter, setFilter] = React.useState<Category>("all");
  const [lightbox, setLightbox] = React.useState<number | null>(null);

  const items = React.useMemo(
    () =>
      works.map((w) => ({
        ...w,
        category: (TREATMENT_IMAGES.has(w.image) ? "treatments" : "clinic") as Category,
      })),
    [works]
  );

  const filtered = React.useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.category === filter)),
    [filter, items]
  );

  // قفل اسکرول بدنه هنگام باز بودن لایت‌باکس
  React.useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  // ناوبری لایت‌باکس با کیبورد
  React.useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") setLightbox((p) => (p === null ? null : (p + 1) % filtered.length));
      if (e.key === "ArrowRight") setLightbox((p) => (p === null ? null : (p - 1 + filtered.length) % filtered.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, filtered.length]);

  return (
    <>
      <PageHero
        kicker="نمونه کارها و گالری"
        title={
          <>
            جراحی‌ها و فضای مطب،
            <span className="text-gradient-light block">از زاویه‌ای نزدیک ببینید</span>
          </>
        }
        desc="تصاویر حوزه‌های تخصصی و عکس‌های واقعی مطب در مرکز خرید پاسداران — برای آشنایی بیشتر قبل از مراجعه"
      />

      {/* گرید معمولی نمونه کارها — زمینه روشن */}
      <section className="relative bg-background py-14 lg:py-20" aria-label="نمونه کارها">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            kicker="گالری تصاویر"
            title={
              <>
                نمونه کارها و فضای مطب
              </>
            }
            desc="ترکیبی از تصاویر حوزه‌های درمانی و عکس‌های واقعی مطب ثبت‌شده در گوگل مپ"
          />

          {/* فیلترها */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-bold transition-all duration-300 cursor-pointer",
                  filter === f.id
                    ? "border-primary bg-primary text-primary-foreground shadow-[0_10px_28px_-10px] shadow-primary/50"
                    : "border-border/80 bg-card text-muted-foreground hover:text-foreground hover:border-foreground/25"
                )}
              >
                {f.id === "treatments" && <Sparkles className="h-3.5 w-3.5" />}
                {f.id === "clinic" && <Camera className="h-3.5 w-3.5" />}
                {f.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px] tabular-nums",
                    filter === f.id ? "bg-background/20" : "bg-muted"
                  )}
                >
                  {(f.id === "all" ? items : items.filter((i) => i.category === f.id)).length.toLocaleString("fa-IR")}
                </span>
              </button>
            ))}
          </div>

          {/* گرید تصاویر */}
          <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((g, i) => (
                <motion.button
                  layout
                  key={g.image}
                  type="button"
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.7, ease, delay: (i % 3) * 0.08 }}
                  onClick={() => setLightbox(i)}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-card shadow-[0_24px_60px_-35px_oklch(0.4_0.05_205/0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_34px_70px_-30px_oklch(0.4_0.06_205/0.6)] cursor-pointer"
                  aria-label={`بزرگ‌نمایی ${g.title}`}
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={g.image}
                      alt={g.title}
                      fill
                      className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-108"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.16_0.03_205/0.85)] via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                  <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-background">{g.title}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background/20 text-background backdrop-blur transition-transform duration-300 group-hover:scale-110">
                      <Expand className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>

            {/* کارت CTA داخل گرید */}
            <motion.a
              href="/contact"
              layout
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
              className="group relative flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-[1.75rem] border border-primary/25 bg-sage p-8 text-center transition-all duration-500 hover:-translate-y-1.5 cursor-pointer"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <ArrowLeft className="h-6 w-6 text-primary transition-transform duration-300 group-hover:-translate-x-1" />
              </span>
              <p className="text-lg font-black text-foreground">بازدید حضوری از مطب</p>
              <p className="text-[13px] leading-6 text-muted-foreground">
                برای مشاهده حضوری فضای مطب، نوبت مشاوره رزرو کنید
              </p>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* مقایسه قبل/بعد + عکس‌های واقعی مطب از گوگل مپ — بخش تیره سینمایی */}
      <section className="bg-petrol-deep grain relative overflow-hidden py-16 lg:py-24" aria-label="نتایج واقعی و عکس‌های مطب">
        <div className="aurora" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          {/* مقایسه کشویی قبل/بعد */}
          <div className="mb-16 grid items-center gap-10 lg:mb-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease }}
            >
              <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-teal-400/10 px-3 py-1.5 text-xs font-bold text-teal-300">
                <Sparkles className="h-3.5 w-3.5" />
                {beforeAfter.kicker}
              </p>
              <h2 className="text-2xl font-black tracking-tight text-background sm:text-4xl sm:leading-[1.25]">
                {beforeAfter.title}
              </h2>
              <p className="mt-4 max-w-lg text-[14px] leading-8 text-background/70">{beforeAfter.desc}</p>
              <a
                href="/contact"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-teal-300 transition-all duration-300 hover:gap-3 cursor-pointer"
              >
                رزرو مشاوره برای طرح مشابه
                <ArrowLeft className="h-4 w-4" />
              </a>
            </motion.div>
            <BeforeAfter
              before={beforeAfter.before}
              after={beforeAfter.after}
              beforeLabel={beforeAfter.beforeLabel}
              afterLabel={beforeAfter.afterLabel}
              alt="بازسازی کامل دهان با ایمپلنت"
            />
          </div>

          <div className="divider-fade mb-16 lg:mb-20" />

          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease }}
                className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-teal-400/10 px-3 py-1.5 text-xs font-bold text-teal-300"
              >
                <Camera className="h-3.5 w-3.5" />
                ثبت‌شده در گوگل مپ
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease, delay: 0.08 }}
                className="text-2xl font-black tracking-tight text-background sm:text-4xl"
              >
                عکس‌های واقعی مطب
              </motion.h2>
            </div>
            <motion.a
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-full border border-background/15 bg-background/[0.06] px-5 py-2.5 text-[13px] font-bold text-background/80 backdrop-blur transition-all hover:bg-background/15 hover:text-background cursor-pointer"
            >
              رزرو بازدید حضوری
              <ArrowLeft className="h-3.5 w-3.5" />
            </motion.a>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            {gallery.map((g, i) => (
              <motion.button
                key={g.image}
                type="button"
                onClick={() => {
                  const idx = items.findIndex((it) => it.image === g.image);
                  if (idx >= 0) setLightbox(idx);
                }}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, ease, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-3xl border border-background/10 shadow-[0_20px_50px_-25px_oklch(0.08_0.02_205/0.9)] transition-all duration-500 hover:-translate-y-1.5 hover:border-background/25 cursor-pointer"
                aria-label={`بزرگ‌نمایی ${g.title}`}
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={g.image}
                    alt={g.title}
                    fill
                    className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-108"
                    sizes="(max-width: 640px) 50vw, 20vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.13_0.02_205/0.85)] via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                <span className="absolute inset-x-3 bottom-3 text-[12px] font-extrabold text-background">{g.title}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* لایت‌باکس با ناوبری قبلی/بعدی */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[oklch(0.1_0.02_205/0.94)] p-4 backdrop-blur-xl sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-label={filtered[lightbox].title}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="بستن"
              className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-background/20 bg-background/10 text-background transition-colors hover:bg-background/20 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.figure
              key={filtered[lightbox].image}
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              transition={{ duration: 0.4, ease }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-background/15 shadow-2xl">
                <Image
                  src={filtered[lightbox].image}
                  alt={filtered[lightbox].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 900px"
                  priority
                />
              </div>
              <figcaption className="mt-4 flex items-center justify-between">
                <span className="text-sm font-extrabold text-background">{filtered[lightbox].title}</span>
                <span className="text-xs tabular-nums text-background/50">
                  {(lightbox + 1).toLocaleString("fa-IR")} از {filtered.length.toLocaleString("fa-IR")}
                </span>
              </figcaption>

              {/* دکمه‌های قبلی/بعدی */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setLightbox((p) => (p === null ? null : (p - 1 + filtered.length) % filtered.length))}
                  aria-label="تصویر قبلی"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-background/20 bg-background/10 text-background transition-colors hover:bg-background/20 cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                {filtered.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightbox(i)}
                    aria-label={`عکس ${i + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      i === lightbox ? "w-8 bg-teal-300" : "w-2 bg-background/25 hover:bg-background/40"
                    }`}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setLightbox((p) => (p === null ? null : (p + 1) % filtered.length))}
                  aria-label="تصویر بعدی"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-background/20 bg-background/10 text-background transition-colors hover:bg-background/20 cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
