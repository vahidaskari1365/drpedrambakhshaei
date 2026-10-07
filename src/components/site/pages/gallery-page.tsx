"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointer2, Hand, X, Expand, ArrowLeft } from "lucide-react";
import { PageHero } from "../page-hero";
import { WorksWheel } from "../works-wheel";
import { GALLERY, WORKS } from "@/lib/site-data";

const ease = [0.16, 1, 0.3, 1] as const;

export function GalleryPage() {
  const [lightbox, setLightbox] = React.useState<number | null>(null);
  const [hint, setHint] = React.useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setHint(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // بستن لایت‌باکس با Escape
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <PageHero
        kicker="نمونه کارها و گالری"
        title={
          <>
            فضای مطب و جراحی‌ها،
            <span className="text-gradient-light block">از زاویه‌ای دیگر ببینید</span>
          </>
        }
        desc="چرخ سه‌بعدی تعاملی نمونه کارها + عکس‌های واقعی مطب در مرکز خرید پاسداران — برای آشنایی بیشتر قبل از مراجعه"
      />

      {/* چرخ سه‌بعدی — روی زمینه روشن (طراحی اصلی کامپوننت) */}
      <section className="relative bg-background py-14 lg:py-20" aria-label="چرخ نمونه کارها">
        <div className="mx-auto mb-8 max-w-7xl px-5 text-center lg:px-8">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">چرخ نمونه کارها</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            با اسکرول یا درگ، بین جراحی‌ها و فضای مطب بچرخید
          </p>
        </div>
        <div className="relative mx-auto h-[62svh] min-h-[420px] max-w-7xl px-2 lg:h-[74svh] lg:px-8">
          <WorksWheel
            items={WORKS.map((w) => ({ title: w.title, image: w.image }))}
            label="نمونه کارها"
            action="مشاهده"
            className="rounded-[2.5rem]"
          />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={hint ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-foreground/85 px-4 py-2 text-xs font-bold text-background backdrop-blur"
          >
            <MousePointer2 className="hidden h-3.5 w-3.5 sm:block" />
            <Hand className="h-3.5 w-3.5 sm:hidden" />
            اسکرول یا درگ کنید
          </motion.div>
        </div>
      </section>

      {/* عکس‌های واقعی مطب — پترول تیره */}
      <section className="bg-petrol-deep grain relative overflow-hidden py-16 lg:py-24" aria-label="عکس‌های مطب">
        <div className="aurora" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease }}
              className="text-3xl font-black tracking-tight text-background sm:text-[2.6rem]"
            >
              عکس‌های واقعی مطب
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
              className="mt-4 text-[15px] leading-8 text-background/65"
            >
              از گوگل مپ مراجعین — فضای مطب، اتاق جراحی و تجهیزات
            </motion.p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY.map((g, i) => (
              <motion.button
                key={g.image}
                type="button"
                onClick={() => setLightbox(i)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, ease, delay: (i % 3) * 0.1 }}
                className={`group relative overflow-hidden rounded-[1.75rem] border border-background/10 shadow-[0_24px_60px_-30px_oklch(0.08_0.02_205/0.9)] transition-all duration-500 hover:-translate-y-1.5 hover:border-background/25 cursor-pointer ${
                  i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-1" : ""
                }`}
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
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.13_0.02_205/0.85)] via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-background">{g.title}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background/20 text-background backdrop-blur transition-transform duration-300 group-hover:scale-110">
                    <Expand className="h-3.5 w-3.5" />
                  </span>
                </div>
              </motion.button>
            ))}

            {/* کارت CTA داخل گرید */}
            <motion.a
              href="#/contact"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
              className="glass-dark gold-top-line group relative flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-[1.75rem] p-8 text-center transition-all duration-500 hover:-translate-y-1.5 cursor-pointer"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-400/15">
                <ArrowLeft className="h-6 w-6 text-teal-300 transition-transform duration-300 group-hover:-translate-x-1" />
              </span>
              <p className="text-lg font-black text-background">بازدید حضوری از مطب</p>
              <p className="text-[13px] leading-6 text-background/60">
                برای مشاهده حضوری فضای مطب، نوبت مشاوره رزرو کنید
              </p>
            </motion.a>
          </div>
        </div>
      </section>

      {/* لایت‌باکس */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[oklch(0.1_0.02_205/0.92)] p-5 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label={GALLERY[lightbox].title}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="بستن"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-background/20 bg-background/10 text-background transition-colors hover:bg-background/20 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.figure
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              transition={{ duration: 0.4, ease }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-background/15 shadow-2xl">
                <Image
                  src={GALLERY[lightbox].image}
                  alt={GALLERY[lightbox].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 900px"
                  priority
                />
              </div>
              <figcaption className="mt-4 flex items-center justify-between">
                <span className="text-sm font-extrabold text-background">{GALLERY[lightbox].title}</span>
                <span className="text-xs tabular-nums text-background/50">
                  {(lightbox + 1).toLocaleString("fa-IR")} از {GALLERY.length.toLocaleString("fa-IR")}
                </span>
              </figcaption>

              {/* ناوبری */}
              <div className="mt-3 flex justify-center gap-2">
                {GALLERY.map((_, i) => (
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
              </div>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
