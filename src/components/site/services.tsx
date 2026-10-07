"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, ArrowLeft, Sparkles } from "lucide-react";
import { SERVICES, IMPLANT_BRANDS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

function SectionHeading({
  kicker,
  title,
  desc,
  dark = false,
}: {
  kicker: string;
  title: React.ReactNode;
  desc?: string;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease }}
        className={cn(
          "mb-3 inline-flex items-center gap-1.5 text-xs font-bold tracking-widest",
          dark ? "text-teal-600 dark:text-teal-400" : "text-primary"
        )}
      >
        <Sparkles className="h-3.5 w-3.5" />
        {kicker}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease, delay: 0.08 }}
        className={cn("text-3xl font-black tracking-tight sm:text-[2.6rem] sm:leading-[1.2]", dark && "text-background")}
      >
        {title}
      </motion.h2>
      {desc && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease, delay: 0.16 }}
          className={cn("mt-4 text-[15px] leading-8 text-muted-foreground", dark && "text-background/70")}
        >
          {desc}
        </motion.p>
      )}
    </div>
  );
}

export { SectionHeading };

export function Services() {
  return (
    <section id="services" className="relative py-20 lg:py-28" aria-label="خدمات">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          kicker="خدمات تخصصی"
          title={
            <>
              از ارتوسرجری تا ایمپلنت —
              <br className="hidden sm:block" /> همه در یک مجموعه
            </>
          }
          desc="حوزه‌های تخصصی فعالیت، با بالاترین استاندارد استریلیزاسیون و ایمنی بیمار"
        />

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {SERVICES.map((s, i) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease, delay: i * 0.12 }}
              className="group relative overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_-24px] hover:shadow-primary/25"
            >
              {/* تصویر سینمایی */}
              <div className="relative h-52 overflow-hidden sm:h-60">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <span className="absolute right-4 top-4 rounded-full bg-background/80 px-3 py-1 text-[11px] font-bold text-primary backdrop-blur">
                  ۰{i + 1}
                </span>
              </div>

              <div className="relative p-6 pt-2">
                <h3 className="text-xl font-extrabold tracking-tight">{s.title}</h3>
                <p className="mt-1 text-xs font-bold text-primary">{s.subtitle}</p>
                <p className="mt-3 min-h-[3.5rem] text-sm leading-7 text-muted-foreground">{s.desc}</p>

                <ul className="mt-4 space-y-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[13px] font-medium text-foreground/85">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3 w-3 text-primary" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-all duration-300 hover:gap-3 cursor-pointer"
                >
                  درخواست مشاوره
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* برندهای ایمپلنت */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
          className="mt-14"
        >
          <p className="mb-5 text-center text-xs font-bold tracking-widest text-muted-foreground">
            برندهای ایمپلنت مورد استفاده
          </p>
          <div className="mask-fade-x overflow-hidden">
            <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-4 hover:[animation-play-state:paused]">
              {[...IMPLANT_BRANDS, ...IMPLANT_BRANDS].map((b, i) => (
                <div
                  key={`${b.name}-${i}`}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-6 py-4"
                >
                  <span className="text-base font-black tracking-wide text-foreground/90" dir="ltr">
                    {b.name}
                  </span>
                  <span className="h-6 w-px bg-border" />
                  <span className="text-xs font-medium text-muted-foreground">{b.country}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
