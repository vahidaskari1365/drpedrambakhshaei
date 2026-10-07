"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, ArrowLeft, Phone, BadgeCheck } from "lucide-react";
import { PageHero } from "../page-hero";
import { SectionHeading } from "../section-heading";
import { SERVICES, IMPLANT_BRANDS, WHY_US } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

export function ServicesPage() {
  return (
    <>
      <PageHero
        kicker="خدمات تخصصی"
        title={
          <>
            از ارتوسرجری تا ایمپلنت —
            <span className="text-gradient-light block">همه در یک مجموعه</span>
          </>
        }
        desc="حوزه‌های تخصصی فعالیت دکتر پدرام بخشایی با بالاترین استاندارد استریلیزاسیون، برنامه‌ریزی سه‌بعدی دیجیتال و تکنیک‌های کم‌تهاجمی"
      />

      {/* خدمات — ردیف‌های متناوب */}
      <section className="relative bg-sage py-16 lg:py-24" aria-label="شرح خدمات">
        <div className="aurora aurora-sage" />
        <div className="relative mx-auto max-w-7xl space-y-16 px-5 lg:space-y-24 lg:px-8">
          {SERVICES.map((s, i) => (
            <motion.article
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 56 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease }}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
            >
              {/* تصویر سینمایی */}
              <div className={cn("relative", i % 2 === 1 && "lg:order-2")}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] border border-[oklch(0.5_0.06_175/0.15)] shadow-[0_40px_90px_-40px_oklch(0.4_0.06_175/0.5)]">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.2_0.03_205/0.5)] via-transparent to-transparent" />
                  <span className="absolute right-5 top-5 rounded-full bg-background/85 px-3.5 py-1.5 text-xs font-black text-primary backdrop-blur">
                    ۰{i + 1}
                  </span>
                </div>
                {/* آمار شناور خدمت */}
                <div className="relative z-10 -mt-8 grid grid-cols-3 gap-2 px-2 sm:gap-3 sm:px-6">
                  {s.stats.map((st) => (
                    <div
                      key={st.label}
                      className="card-sage rounded-2xl px-2 py-3 text-center backdrop-blur"
                    >
                      <p className="text-[13px] font-black leading-6 text-primary sm:text-sm">{st.value}</p>
                      <p className="mt-0.5 text-[10px] font-medium leading-4 text-muted-foreground sm:text-[11px]">{st.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* محتوا */}
              <div className={cn(i % 2 === 1 && "lg:order-1")}>
                <p className="mb-2 text-xs font-bold tracking-widest text-primary">{s.subtitle}</p>
                <h2 className="text-2xl font-black tracking-tight sm:text-[2rem] sm:leading-[1.25]">{s.title}</h2>
                <p className="mt-4 text-[14px] leading-8 text-muted-foreground">{s.desc}</p>
                <p className="mt-3 rounded-2xl border border-[oklch(0.55_0.06_175/0.12)] bg-[oklch(0.97_0.01_180)] p-4 text-[13px] leading-7 text-foreground/75">
                  {s.longDesc}
                </p>

                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[13px] font-medium text-foreground/85">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3 w-3 text-primary" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="#/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-[0_14px_34px_-12px] shadow-primary/60 transition-all duration-300 hover:brightness-110 active:scale-95 cursor-pointer"
                  >
                    درخواست مشاوره
                    <ArrowLeft className="h-4 w-4" />
                  </a>
                  <a
                    href="#/prices"
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-6 py-3 text-sm font-bold transition-all duration-300 hover:bg-card/70 active:scale-95 cursor-pointer"
                  >
                    تعرفه این خدمت
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* برندهای ایمپلنت — نوار تیره */}
      <section className="bg-petrol relative overflow-hidden py-14" aria-label="برندهای ایمپلنت">
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <p className="mb-6 text-center text-xs font-bold tracking-widest text-background/60">
            برندهای ایمپلنت مورد استفاده
          </p>
          <div className="mask-fade-x overflow-hidden">
            <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-4 hover:[animation-play-state:paused]">
              {[...IMPLANT_BRANDS, ...IMPLANT_BRANDS].map((b, i) => (
                <div key={`${b.name}-${i}`} className="glass-dark flex items-center gap-3 rounded-2xl px-6 py-4">
                  <span className="text-base font-black tracking-wide text-background/90" dir="ltr">
                    {b.name}
                  </span>
                  <span className="h-6 w-px bg-background/15" />
                  <span className="text-xs font-medium text-background/60">{b.country}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* چرا دکتر بخشایی */}
      <section className="bg-petrol-deep relative overflow-hidden py-16 lg:py-20" aria-label="چرا دکتر بخشایی">
        <div className="aurora" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease }}
            >
              <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-amber-300">
                <BadgeCheck className="h-3.5 w-3.5" />
                اعتبار علمی
              </p>
              <h2 className="text-2xl font-black tracking-tight text-background sm:text-4xl">{WHY_US.title}</h2>
              <p className="mt-4 max-w-lg text-[14px] leading-8 text-background/70">{WHY_US.text}</p>
            </motion.div>
            <div className="grid gap-3 sm:grid-cols-2">
              {WHY_US.points.map((p, i) => (
                <motion.div
                  key={p}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, ease, delay: i * 0.08 }}
                  className="glass-dark gold-top-line flex items-start gap-3 rounded-2xl p-4"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-xs font-black text-teal-300">
                    ۰{i + 1}
                  </span>
                  <p className="text-[13px] font-medium leading-6 text-background/85">{p}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-14" aria-label="رزرو مشاوره">
        <div className="gradient-petrol-cta absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            className="text-2xl font-black tracking-tight text-background sm:text-4xl"
          >
            برای انتخاب درست مسیر درمان، مشاوره بگیرید
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease, delay: 0.12 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#/contact"
              className="inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 text-sm font-black text-[oklch(0.2_0.03_205)] transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              رزرو نوبت
              <ArrowLeft className="h-4 w-4" />
            </a>
            <a
              href="#/prices"
              dir="ltr"
              className="inline-flex items-center gap-2 rounded-full border border-background/25 bg-background/10 px-7 py-3.5 text-sm font-bold text-background backdrop-blur transition-all hover:bg-background/20 cursor-pointer"
            >
              <Phone className="h-4 w-4" />
              مشاهده تعرفه‌ها
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
