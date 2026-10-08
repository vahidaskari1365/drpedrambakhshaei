"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Quote,
  Phone,
  CalendarCheck,
  BadgeCheck,
  ChevronDown,
  Check,
  Camera,
  Sparkles,
  Stethoscope,
  Wallet,
  WalletCards,
  GraduationCap,
  Clock3,
} from "lucide-react";
import { Hero } from "../hero";
import { SectionHeading } from "../section-heading";
import { WorksSlider } from "../works-slider";
import { BeforeAfter } from "../before-after";
import { useSite } from "../content-provider";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

/** ردیف آکاردئون سوالات */
function FaqRow({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-card transition-all duration-300",
        open ? "border-primary/40 shadow-[0_16px_40px_-24px] shadow-primary/40" : "border-border/60"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start cursor-pointer"
      >
        <span className="text-[14px] font-extrabold leading-6">{q}</span>
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors",
            open ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
          >
            <p className="border-t border-border/50 px-5 py-4 text-[13px] leading-7 text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HomePage() {
  const { site, services, works, whyUs, reviews, priceTabs, faq, aboutBio, credentials, beforeAfter } = useSite();
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  /** پیش‌نمایش گالری صفحه اول — عکس‌های واقعی جراحی‌ها و مطب */
  const homeGallery = [works[2], works[5], works[0], works[6], works[7], works[8]];

  /** برجسته‌های تعرفه — از جداول اصلی */
  const priceHighlights = priceTabs.slice(0, 3).map((t, idx) => ({
    id: t.id,
    title: t.label,
    price: t.rows[idx === 1 ? 3 : 0].price,
    note: idx === 0 ? "شامل فیکسچر و اباتمنت" : idx === 1 ? "جراحی یک فک (MONOMAX)" : "با بی‌حسی موضعی",
  }));

  /** سوالات منتخب صفحه اول — ترکیبی از دو گروه */
  const homeFaqs = [faq[0], faq[5], faq[1], faq[6]].filter(Boolean);

  return (
    <>
      <Hero />

      {/* ═══ خدمات — پیش‌نمایش ۳ خدمت اصلی ═══ */}
      <section className="bg-sage relative overflow-hidden py-16 lg:py-24" aria-label="خدمات تخصصی">
        <div className="aurora aurora-sage" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            kicker="خدمات تخصصی"
            title={
              <>
                از ارتوسرجری تا ایمپلنت —
                <span className="text-gradient block">همه در یک مجموعه</span>
              </>
            }
            desc="حوزه‌های تخصصی جراحی دهان، فک و صورت با برنامه‌ریزی سه‌بعدی دیجیتال و تکنیک‌های کم‌تهاجمی"
          />

          <div className="grid gap-5 md:grid-cols-3">
            {services.map((s, i) => (
              <motion.a
                key={s.id}
                href="/services"
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease, delay: i * 0.1 }}
                className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-[oklch(0.5_0.06_175/0.12)] bg-card shadow-[0_24px_60px_-35px_oklch(0.4_0.05_175/0.5)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_36px_80px_-35px_oklch(0.4_0.06_175/0.6)] cursor-pointer"
                aria-label={s.title}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.03_205/0.55)] via-transparent to-transparent" />
                  <span className="absolute right-4 top-4 rounded-full bg-background/85 px-3 py-1 text-[11px] font-black text-primary backdrop-blur">
                    ۰{i + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[11px] font-bold tracking-wider text-primary">{s.subtitle}</p>
                  <h3 className="mt-1.5 text-lg font-black leading-7">{s.title}</h3>
                  <p className="mt-2.5 flex-1 text-[13px] leading-7 text-muted-foreground">{s.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-primary transition-all duration-300 group-hover:gap-3">
                    جزئیات و تعرفه
                    <ArrowLeft className="h-4 w-4" />
                  </span>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mt-10 text-center"
          >
            <a
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card px-7 py-3 text-sm font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground active:scale-95 cursor-pointer"
            >
              <Stethoscope className="h-4 w-4" />
              مشاهده توضیح کامل خدمات
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ نمونه جراحی‌ها — اسلایدر کشویی با عکس‌های واقعی (مثل سایت اصلی) ═══ */}
      <section className="relative bg-background py-16 lg:py-24" aria-label="نمونه جراحی‌ها">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            kicker="نمونه جراحی‌ها"
            title={
              <>
                نتیجه کارها را ببینید،
                <span className="text-gradient block">نه فقط حرف‌ها را</span>
              </>
            }
            desc="جهت کمک به شما مراجعین عزیز در روند تصمیم‌گیری و آشنایی بیشتر با انواع جراحی‌ها، علاوه بر نمونه کارها توضیحات هر جراحی نیز قرار داده شده — با سوایپ یا دکمه‌ها جابه‌جا شوید"
          />
          <WorksSlider />
        </div>
      </section>

      {/* ═══ مقایسه قبل/بعد — کیس واقعی ایمپلنت ═══ */}
      <section className="bg-petrol-deep grain relative overflow-hidden py-16 lg:py-24" aria-label="مقایسه قبل و بعد">
        <div className="aurora" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
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
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/gallery"
                  className="shimmer inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-bold text-[oklch(0.2_0.03_205)] transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
                >
                  همه نمونه کارها
                  <ArrowLeft className="h-4 w-4" />
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-background/25 bg-background/10 px-6 py-3 text-sm font-bold text-background backdrop-blur transition-all duration-300 hover:bg-background/20 active:scale-95 cursor-pointer"
                >
                  <CalendarCheck className="h-4 w-4" />
                  مشاوره حضوری
                </a>
              </div>
            </motion.div>
            <BeforeAfter
              before={beforeAfter.before}
              after={beforeAfter.after}
              beforeLabel={beforeAfter.beforeLabel}
              afterLabel={beforeAfter.afterLabel}
              alt="بازسازی کامل دهان با ایمپلنت"
            />
          </div>
        </div>
      </section>

      {/* ═══ چرا دکتر بخشایی — نوار تیره ═══ */}
      <section className="bg-petrol relative overflow-hidden py-16 lg:py-20" aria-label="چرا دکتر بخشایی">
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
              <h2 className="text-2xl font-black tracking-tight text-background sm:text-4xl sm:leading-[1.25]">
                {whyUs.title}
              </h2>
              <p className="mt-4 max-w-lg text-[14px] leading-8 text-background/70">{whyUs.text}</p>
              <a
                href="/about"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-teal-300 transition-all duration-300 hover:gap-3 cursor-pointer"
              >
                بیشتر درباره دکتر بخشایی
                <ArrowLeft className="h-4 w-4" />
              </a>
            </motion.div>
            <div className="grid gap-3 sm:grid-cols-2">
              {whyUs.points.map((p, i) => (
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

      {/* ═══ نمونه کارها — پیش‌نمایش گرید معمولی ═══ */}
      <section className="relative bg-background py-16 lg:py-24" aria-label="نمونه کارها">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease }}
                className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary"
              >
                <Camera className="h-3.5 w-3.5" />
                نمونه کارها
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease, delay: 0.08 }}
                className="text-2xl font-black tracking-tight sm:text-4xl"
              >
                جراحی‌ها و فضای مطب از نزدیک
              </motion.h2>
            </div>
            <motion.a
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              href="/gallery"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-5 py-2.5 text-[13px] font-bold transition-all hover:border-foreground/25 cursor-pointer"
            >
              مشاهده همه تصاویر
              <ArrowLeft className="h-3.5 w-3.5" />
            </motion.a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {homeGallery.map((g, i) => (
              <motion.a
                key={g.image}
                href="/gallery"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, ease, delay: (i % 4) * 0.08 }}
                className={cn(
                  "group relative overflow-hidden rounded-[1.75rem] border border-border/60 shadow-[0_24px_60px_-38px_oklch(0.4_0.05_205/0.55)] transition-all duration-500 hover:-translate-y-1.5 cursor-pointer",
                  i === 0 && "sm:col-span-2 lg:row-span-2"
                )}
                aria-label={`${g.title} — مشاهده در گالری`}
              >
                <div className={cn("relative", i === 0 ? "aspect-[4/3] lg:h-full lg:aspect-auto" : "aspect-[4/3]")}>
                  <Image
                    src={g.image}
                    alt={g.title}
                    fill
                    className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-108"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.16_0.03_205/0.8)] via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                <span className="absolute inset-x-4 bottom-3.5 text-[13px] font-extrabold text-background">{g.title}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ درباره دکتر — پیش‌نمایش ═══ */}
      <section className="bg-sage relative overflow-hidden py-16 lg:py-24" aria-label="درباره دکتر">
        <div className="aurora aurora-sage" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            {/* پرتره */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease }}
              className="relative mx-auto w-full max-w-[340px] lg:max-w-[380px]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-[oklch(0.5_0.06_175/0.15)] shadow-[0_40px_90px_-40px_oklch(0.4_0.06_175/0.55)]">
                <Image
                  src="/uploads/doctor-portrait.jpg"
                  alt="دکتر پدرام بخشایی — متخصص جراحی دهان، فک و صورت"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 90vw, 380px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.03_205/0.35)] via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-5 right-5 left-5 rounded-2xl bg-card/90 px-5 py-3.5 shadow-xl backdrop-blur-xl">
                <p className="text-sm font-black">Dr. Pedram Bakhshaei</p>
                <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                  متخصص جراحی دهان، فک و صورت — رتبه ۲ بورد
                </p>
              </div>
            </motion.div>

            {/* متن */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease, delay: 0.1 }}
            >
              <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary">
                <GraduationCap className="h-3.5 w-3.5" />
                درباره دکتر
              </p>
              <h2 className="text-2xl font-black tracking-tight sm:text-4xl sm:leading-[1.25]">
                تلفیق علم، هنر و دقت
                <span className="text-gradient block">در جراحی فک و صورت</span>
              </h2>
              <p className="mt-5 max-w-2xl text-[14px] leading-8 text-muted-foreground">
                {aboutBio[2]}
              </p>

              {/* مدارک منتخب */}
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {credentials.slice(4, 7).map((c) => (
                  <li key={c} className="flex items-start gap-2 text-[13px] font-medium leading-6 text-foreground/85">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </span>
                    {c}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-[0_14px_34px_-12px] shadow-primary/60 transition-all duration-300 hover:brightness-110 active:scale-95 cursor-pointer"
                >
                  بیوگرافی کامل و مدارک
                  <ArrowLeft className="h-4 w-4" />
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-6 py-3 text-sm font-bold transition-all duration-300 hover:bg-card/70 active:scale-95 cursor-pointer"
                >
                  <CalendarCheck className="h-4 w-4" />
                  رزرو نوبت
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ تعرفه‌ها — پیش‌نمایش تیره سینمایی ═══ */}
      <section className="bg-petrol-deep grain relative overflow-hidden py-16 lg:py-24" aria-label="تعرفه خدمات">
        <div className="aurora" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            dark
            kicker="تعرفه‌های ۱۴۰۵"
            title={
              <>
                هزینه شفاف،
                <span className="text-gradient-light block">بدون سوال بی‌جواب</span>
              </>
            }
            desc="جدول کامل تعرفه ایمپلنت، جراحی فک و دندان نهفته — قیمت دقیق پس از ویزیت و بررسی CBCT"
          />

          <div className="grid gap-4 md:grid-cols-3">
            {priceHighlights.map((p, i) => (
              <motion.a
                key={p.id}
                href="/prices"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.85, ease, delay: i * 0.1 }}
                className="glass-dark gold-top-line group relative flex flex-col rounded-[1.75rem] p-6 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                aria-label={`تعرفه ${p.title}`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-400/15">
                  <Wallet className="h-5 w-5 text-teal-300" />
                </span>
                <h3 className="mt-4 text-lg font-black text-background">{p.title}</h3>
                <p className="mt-3 text-2xl font-black tracking-tight text-teal-300 tabular-nums">{p.price} تومان</p>
                <p className="mt-1.5 flex-1 text-[12px] leading-6 text-background/55">{p.note}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-teal-300 transition-all duration-300 group-hover:gap-3">
                  جدول کامل تعرفه
                  <ArrowLeft className="h-4 w-4" />
                </span>
              </motion.a>
            ))}
          </div>

          {/* نوار قسطی */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-background/10 bg-background/[0.05] px-6 py-4 text-[13px] font-medium text-background/75 backdrop-blur"
          >
            <span className="inline-flex items-center gap-2">
              <WalletCards className="h-4 w-4 text-amber-300" />
              امکان پرداخت مرحله‌ای برای برخی طرح‌های درمانی
            </span>
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-amber-300" />
              تخفیف اسکان ۲۰ میلیونی مراجعین شهرستانی
            </span>
          </motion.div>
        </div>
      </section>

      {/* ═══ سوالات متداول — پیش‌نمایش ═══ */}
      <section className="relative bg-background py-16 lg:py-24" aria-label="سوالات متداول">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            kicker="سوالات متداول"
            title={
              <>
                هر سوالی دارید،
                <span className="text-gradient block">اینجا جوابش هست</span>
              </>
            }
            desc="پاسخ پرتکرارترین سوالات مراجعین درباره ارتوسرجری، ایمپلنت و دوره نقاهت"
          />

          <div className="mx-auto grid max-w-4xl gap-3 lg:grid-cols-2">
            {homeFaqs.map((f, i) => (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, ease, delay: i * 0.08 }}
                className={cn(i === 0 && "lg:row-span-1")}
              >
                <FaqRow q={f.q} a={f.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="/faq"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card px-6 py-3 text-sm font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground active:scale-95 cursor-pointer"
            >
              همه سوالات متداول
              <ArrowLeft className="h-4 w-4" />
            </a>
            <span className="inline-flex items-center gap-2 text-[13px] text-muted-foreground">
              <Clock3 className="h-4 w-4" />
              جواب سوال خود را پیدا نکردید؟ {site.phone} تماس بگیرید
            </span>
          </motion.div>
        </div>
      </section>

      {/* ═══ نظرات واقعی ═══ */}
      <section className="bg-petrol-deep relative overflow-hidden py-16 lg:py-24" aria-label="نگاهی به نظرات">
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease }}
                className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-300"
              >
                <Star className="h-3.5 w-3.5 fill-current" />
                {site.rating.score} در گوگل · {site.rating.count} نظر
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease, delay: 0.08 }}
                className="text-2xl font-black tracking-tight text-background sm:text-4xl"
              >
                حرف‌های مراجعین واقعی
              </motion.h2>
            </div>
            <motion.a
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              href="/reviews"
              className="inline-flex items-center gap-1.5 rounded-full border border-background/15 bg-background/[0.06] px-5 py-2.5 text-[13px] font-bold text-background/80 backdrop-blur transition-all hover:bg-background/15 hover:text-background cursor-pointer"
            >
              همه نظرات
              <ArrowLeft className="h-3.5 w-3.5" />
            </motion.a>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {reviews.slice(1, 4).map((r, i) => (
              <motion.figure
                key={r.author}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, ease, delay: i * 0.1 }}
                className="glass-dark relative flex flex-col rounded-3xl p-6"
              >
                <Quote className="mb-3 h-5 w-5 text-teal-300/50" />
                <blockquote className="flex-1 text-[13px] leading-7 text-background/85">{r.text}</blockquote>
                <figcaption className="mt-4 flex items-center justify-between gap-3 border-t border-background/10 pt-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-400/15 text-sm font-black text-teal-300">
                      {r.author.charAt(0)}
                    </span>
                    <div>
                      <p className="text-[13px] font-extrabold text-background">{r.author}</p>
                      <p className="text-[11px] text-background/50">{r.source} · {r.time}</p>
                    </div>
                  </div>
                  <span className="flex gap-0.5" aria-label="امتیاز ۵ از ۵">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA نهایی ═══ */}
      <section className="relative overflow-hidden py-16 lg:py-24" aria-label="رزرو نوبت">
        <div className="gradient-petrol-cta absolute inset-0" />
        <div className="aurora" />
        <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            className="text-3xl font-black tracking-tight text-background sm:text-5xl sm:leading-[1.2]"
          >
            مسیر لبخند شما از
            <span className="text-gradient-light block">یک مشاوره شروع می‌شود</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
            className="mx-auto mt-5 max-w-xl text-[15px] leading-8 text-background/70"
          >
            {site.hours} — {site.shortAddress}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="/contact"
              className="shimmer inline-flex items-center gap-2.5 rounded-full bg-background px-7 py-3.5 text-sm font-black text-[oklch(0.2_0.03_205)] shadow-[0_16px_40px_-14px_oklch(0.05_0.02_205/0.8)] transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              <CalendarCheck className="h-4.5 w-4.5" />
              رزرو نوبت و مشاوره
            </a>
            <a
              href={`tel:${site.phone}`}
              dir="ltr"
              className="inline-flex items-center gap-2.5 rounded-full border border-background/25 bg-background/10 px-7 py-3.5 text-sm font-bold text-background backdrop-blur transition-all duration-300 hover:bg-background/20 active:scale-95 cursor-pointer"
            >
              <Phone className="h-4.5 w-4.5" />
              {site.phone}
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
