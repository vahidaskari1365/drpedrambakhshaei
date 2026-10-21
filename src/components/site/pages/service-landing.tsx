"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHero } from "../page-hero";
import { useSite } from "../content-provider";
import {
  Check,
  ArrowLeft,
  Phone,
  MessageCircle,
  Lightbulb,
  Link2,
  MapPin,
  BadgeCheck,
  RefreshCw,
  Star,
  Clock,
} from "lucide-react";
import type { LandingConfig } from "@/lib/landings";
import { CONTENT_UPDATED } from "@/lib/landings";
import { openBooking } from "../booking-modal";
import { trackSiteEvent } from "@/lib/track";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * قالب مشترک صفحات فرود کلیدواژه‌محور — سئو/AEO
 * ساختار: هیرو → پاسخ کوتاه (استناد AI) → آمار → بخش‌های محتوا → تعرفه →
 * چرا این جراح → سوالات متداول → لینک‌های مرتبط → CTA
 */
export function ServiceLanding({ config }: { config: LandingConfig }) {
  const { priceTabs, site } = useSite();
  const priceTab = config.priceTabId
    ? priceTabs.find((t) => t.id === config.priceTabId)
    : undefined;

  return (
    <>
      <PageHero
        kicker={config.kicker}
        title={
          <>
            {config.h1}
            <span className="text-gradient-light block">{config.h1Accent}</span>
          </>
        }
        desc={config.heroDesc}
      >
        {/* بج امتیاز گوگل زیر H1 — سیگنال محلی برای Local/AIO */}
        {config.showRatingBadge && (
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1" aria-label="امتیاز ۵ از ۵">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" aria-hidden="true" />
              ))}
            </span>
            <span className="text-sm font-black text-background">{site.rating.score} از ۵</span>
            <span className="text-xs text-background/60">({site.rating.count} نظر گوگل)</span>
          </div>
        )}
      </PageHero>

      {/* پاسخ کوتاه — بخش طلایی AEO برای استناد موتورهای هوش مصنوعی */}
      <section className="bg-sage relative py-12 lg:py-16" aria-label="پاسخ کوتاه">
        <div className="aurora aurora-sage" />
        <div className="relative mx-auto max-w-4xl px-5 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="rounded-[2rem] border-2 border-primary/25 bg-card p-6 shadow-[0_30px_70px_-40px_oklch(0.4_0.06_152/0.45)] sm:p-8"
          >
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black text-primary">
              <Lightbulb className="h-3.5 w-3.5" />
              پاسخ کوتاه
            </p>
            <h2 className="text-lg font-black leading-8 text-foreground sm:text-xl">
              {config.quickAnswer.q}
            </h2>
            <p className="mt-3 text-[13.5px] leading-8 text-foreground/80">
              {config.quickAnswer.a}
            </p>
            {/* تاریخ به‌روزرسانی نمایشی — سیگنال freshness برای گوگل و AI (SXO/GEO) */}
            <p className="mt-4 flex items-center gap-1.5 border-t border-border/60 pt-3 text-[11.5px] font-medium text-muted-foreground">
              <RefreshCw className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              آخرین به‌روزرسانی محتوا: {CONTENT_UPDATED.fa}
            </p>
          </motion.div>

          {/* آمار شاخص */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {config.highlights.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, ease, delay: i * 0.07 }}
                className="card-sage rounded-2xl px-3 py-4 text-center"
              >
                <p className="text-lg font-black text-primary sm:text-xl">{h.value}</p>
                <p className="mt-1 text-[11px] font-medium leading-5 text-muted-foreground">
                  {h.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* بخش‌های محتوا */}
      <section className="relative py-16 lg:py-20" aria-label="شرح کامل">
        <div className="mx-auto max-w-7xl space-y-14 px-5 lg:px-8">
          {config.sections.map((sec, i) => (
            <motion.article
              key={sec.id}
              id={sec.id}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease }}
              className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <p className="mb-2 text-xs font-black tracking-widest text-primary">
                  ۰{i + 1} · بخش تخصصی
                </p>
                <h2 className="text-2xl font-black tracking-tight sm:text-[1.75rem] sm:leading-[1.3]">
                  {sec.title}
                </h2>
                <p className="mt-4 text-[14px] leading-8 text-muted-foreground">{sec.body}</p>
                {sec.bullets && (
                  <ul className="mt-5 grid gap-2.5">
                    {sec.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2.5 text-[13px] font-medium leading-7 text-foreground/85"
                      >
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Check className="h-3 w-3 text-primary" />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {sec.steps && (
                  <ol className="mt-6 space-y-4 border-r-2 border-primary/20 pr-5">
                    {sec.steps.map((st, j) => (
                      <li key={st.title} className="relative">
                        <span className="absolute -right-[27px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-black text-primary-foreground">
                          {j + 1}
                        </span>
                        <p className="text-[14px] font-black text-foreground">{st.title}</p>
                        <p className="mt-1 text-[12.5px] leading-7 text-muted-foreground">
                          {st.desc}
                        </p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              {sec.image && (
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] border border-[oklch(0.5_0.06_152/0.15)] shadow-[0_40px_90px_-40px_oklch(0.4_0.06_152/0.5)]">
                    <Image
                      src={sec.image}
                      alt={sec.imageAlt ?? sec.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.2_0.03_262/0.4)] via-transparent to-transparent" />
                  </div>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </section>

      {/* بلاک‌های قابل‌استناد ۱۳۰-۱۷۰ کلمه‌ای — استناد مستقیم AIO/ChatGPT/Perplexity (GEO) */}
      {config.citableBlocks && config.citableBlocks.length > 0 && (
        <section className="relative py-14 lg:py-16" aria-label="پاسخ‌های کامل قابل استناد">
          <div className="mx-auto max-w-4xl space-y-8 px-5 lg:px-8">
            {config.citableBlocks.map((b) => (
              <motion.article
                key={b.id}
                id={b.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease }}
                className="rounded-[2rem] border border-border/70 border-r-4 border-r-primary bg-card p-6 shadow-[0_24px_60px_-45px_oklch(0.4_0.06_152/0.45)] sm:p-8"
              >
                <h2 className="text-xl font-black tracking-tight sm:text-2xl">{b.title}</h2>
                <p className="mt-4 text-[14.5px] leading-9 text-foreground/85">{b.text}</p>
                <p className="mt-4 flex items-center gap-1.5 border-t border-border/50 pt-3 text-[11px] font-medium text-muted-foreground">
                  <RefreshCw className="h-3 w-3 text-primary" aria-hidden="true" />
                  به‌روزرسانی: {CONTENT_UPDATED.fa} · منبع: تعرفه رسمی مطب دکتر پدرام بخشایی
                </p>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {/* جدول مقایسه‌ای — فرمت مورد انتظار SERP (SXO) + فرمت طلایی استناد AIO */}
      {config.comparisonTable && (
        <section className="bg-sage relative py-14 lg:py-16" aria-label={config.comparisonTable.caption}>
          <div className="aurora aurora-sage" />
          <div className="relative mx-auto max-w-5xl px-5 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease }}
            >
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                {config.comparisonTable.caption}
              </h2>
              {config.comparisonTable.intro && (
                <p className="mt-3 max-w-3xl text-[13px] leading-7 text-muted-foreground">
                  {config.comparisonTable.intro}
                </p>
              )}
              <div className="mt-7 overflow-x-auto rounded-[2rem] border border-[oklch(0.5_0.06_152/0.15)] bg-card shadow-[0_30px_70px_-45px_oklch(0.4_0.06_152/0.5)]">
                <table className="w-full min-w-[620px] text-right text-[13px]">
                  <caption className="sr-only">{config.comparisonTable.caption}</caption>
                  <thead>
                    <tr className="bg-primary/10">
                      {config.comparisonTable.head.map((h, hi) => (
                        <th
                          key={h}
                          scope="col"
                          className={`px-4 py-4 font-black text-foreground sm:px-6 ${hi === 0 ? "" : "whitespace-nowrap"}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {config.comparisonTable.rows.map((row, ri) => (
                      <tr
                        key={row.label}
                        className={`border-t border-border/60 ${ri % 2 === 1 ? "bg-[oklch(0.97_0.01_150/0.6)]" : ""}`}
                      >
                        <th scope="row" className="px-4 py-4 font-black text-foreground sm:px-6">
                          {row.label}
                        </th>
                        {row.cells.map((c, ci) => (
                          <td
                            key={ci}
                            className={`px-4 py-4 leading-7 text-muted-foreground sm:px-6 ${ci === 0 ? "font-bold text-foreground" : ""}`}
                          >
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* تعرفه مرتبط — جدول واقعی HTML + بج تاریخ به‌روزرسانی (رفع MISMATCH فرمت SERP) */}
      {priceTab && (
        <section className="bg-sage relative py-16 lg:py-20" aria-label="تعرفه خدمات">
          <div className="aurora aurora-sage" />
          <div className="relative mx-auto max-w-4xl px-5 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                  تعرفه ۱۴۰۵ — {priceTab.label}
                </h2>
                {/* بج به‌روزرسانی تعرفه — فرمت مشترک نتایج برنده SERP برای کوئری‌های قیمت */}
                <p className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black text-primary">
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  به‌روزرسانی تعرفه: {CONTENT_UPDATED.monthFa}
                </p>
              </div>
              <p className="mt-3 text-[13px] leading-7 text-muted-foreground">{priceTab.note}</p>
              <div className="mt-7 overflow-x-auto rounded-[2rem] border border-[oklch(0.5_0.06_152/0.15)] bg-card shadow-[0_30px_70px_-45px_oklch(0.4_0.06_152/0.5)]">
                <table className="w-full min-w-[480px] text-right text-[13.5px]">
                  <caption className="sr-only">تعرفه ۱۴۰۵ — {priceTab.label}</caption>
                  <thead>
                    <tr className="bg-primary/10">
                      <th scope="col" className="px-5 py-4 font-black text-foreground sm:px-7">
                        خدمت
                      </th>
                      <th scope="col" className="px-5 py-4 text-left font-black whitespace-nowrap text-foreground sm:px-7">
                        قیمت (تومان)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceTab.rows.map((row, i) => (
                      <tr
                        key={row.item}
                        className={`border-t border-border/60 ${i % 2 === 1 ? "bg-[oklch(0.97_0.01_150/0.6)]" : ""}`}
                      >
                        <td className="px-5 py-4 sm:px-7">
                          <p className="text-[13.5px] font-black text-foreground">{row.item}</p>
                          {row.extra && (
                            <p className="mt-0.5 text-[11.5px] text-muted-foreground">{row.extra}</p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-left font-black whitespace-nowrap text-primary sm:px-7">
                          {row.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* خدمات تکمیلی مرتبط با همین تعرفه */}
              {priceTab.extras && priceTab.extras.length > 0 && (
                <div className="mt-4 overflow-x-auto rounded-[1.5rem] border border-border/70 bg-card/70">
                  <table className="w-full min-w-[420px] text-right text-[13px]">
                    <caption className="sr-only">خدمات تکمیلی — {priceTab.label}</caption>
                    <thead>
                      <tr className="bg-muted/60">
                        <th scope="col" className="px-5 py-3 font-black text-foreground sm:px-7">
                          خدمات تکمیلی
                        </th>
                        <th scope="col" className="px-5 py-3 text-left font-black whitespace-nowrap text-foreground sm:px-7">
                          هزینه
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {priceTab.extras.map((ex, i) => (
                        <tr
                          key={ex.item}
                          className={`border-t border-border/50 ${i % 2 === 1 ? "bg-[oklch(0.97_0.01_150/0.4)]" : ""}`}
                        >
                          <td className="px-5 py-3 font-medium text-foreground/90 sm:px-7">{ex.item}</td>
                          <td className="px-5 py-3 text-left font-bold whitespace-nowrap text-foreground/80 sm:px-7">
                            {ex.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="mt-5 text-center">
                <a
                  href="/prices"
                  className="inline-flex items-center gap-2 text-[13px] font-bold text-primary transition-opacity hover:opacity-75 cursor-pointer"
                >
                  مشاهده همه تعرفه‌ها
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* اعتبار جراح */}
      <section className="bg-petrol-deep relative overflow-hidden py-16 lg:py-20" aria-label="اعتبار علمی">
        <div className="aurora" />
        <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
          <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-amber-300">
            <BadgeCheck className="h-3.5 w-3.5" />
            اعتبار علمی
          </p>
          <h2 className="text-2xl font-black tracking-tight text-background sm:text-3xl">
            دکتر پدرام بخشایی — متخصص جراحی دهان، فک و صورت
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-8 text-background/70">
            رتبه ۲ بورد تخصصی جراحی دهان، فک و صورت کشور · عضو هیئت علمی دانشگاه شهید بهشتی ·
            بیش از ۱۵٬۰۰۰ جراحی ایمپلنت و ۱۰۴ بیمار ارتوسرجری · مطب پاسداران تهران
          </p>
          <a
            href="/about"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-background/25 bg-background/10 px-6 py-3 text-sm font-bold text-background backdrop-blur transition-all hover:bg-background/20 cursor-pointer"
          >
            بیوگرافی کامل
            <ArrowLeft className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* سوالات متداول — با اسکیمای FAQPage در page.tsx */}
      <section className="relative py-16 lg:py-20" aria-label="سوالات متداول">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease }}
            className="mb-8 text-center text-2xl font-black tracking-tight sm:text-3xl"
          >
            سوالات متداول
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
          >
            <Accordion type="single" collapsible className="grid gap-3">
              {config.faqs.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`faq-${i}`}
                  className="rounded-2xl border border-border/70 bg-card px-5"
                >
                  <AccordionTrigger className="text-right text-[14px] font-black leading-7 hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] leading-8 text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* لینک‌های مرتبط — مش لینک داخلی */}
      <section className="bg-sage relative py-14" aria-label="صفحات مرتبط">
        <div className="aurora aurora-sage" />
        <div className="relative mx-auto max-w-5xl px-5 lg:px-8">
          <p className="mb-6 flex items-center gap-2 text-sm font-black text-foreground">
            <Link2 className="h-4 w-4 text-primary" />
            صفحات مرتبط
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {config.related.map((r) => (
              <a
                key={r.href}
                href={r.href}
                className="group rounded-2xl border border-[oklch(0.5_0.06_152/0.15)] bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-25px_oklch(0.4_0.06_152/0.5)] cursor-pointer"
              >
                <p className="flex items-center gap-1.5 text-[13.5px] font-black text-primary">
                  {r.label}
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                </p>
                <p className="mt-2 text-[12px] leading-6 text-muted-foreground">{r.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* نقشه + بلوک NAP — سیگنال محلی (NAP عیناً هماهنگ با GBP) */}
      {config.showMap && (
        <section className="relative py-14 lg:py-16" aria-label="نقشه و آدرس مطب">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease }}
              className="text-2xl font-black tracking-tight sm:text-3xl"
            >
              نقشه و آدرس مطب — مرکز خرید پاسداران
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease, delay: 0.1 }}
              className="mt-7 grid gap-5 lg:grid-cols-5"
            >
              {/* بلوک NAP — Name / Address / Phone */}
              <div className="flex flex-col justify-between gap-4 rounded-[2rem] border border-border/70 bg-card p-6 sm:p-7 lg:col-span-2">
                <div className="grid gap-4">
                  <p className="flex items-start gap-3 text-[13.5px] font-bold leading-7 text-foreground">
                    <MapPin className="mt-1 h-4.5 w-4.5 shrink-0 text-primary" aria-hidden="true" />
                    {site.address}
                  </p>
                  <p className="flex items-start gap-3 text-[13.5px] font-bold leading-7 text-foreground">
                    <Clock className="mt-1 h-4.5 w-4.5 shrink-0 text-primary" aria-hidden="true" />
                    {site.hours}
                  </p>
                  <a
                    href={`tel:${site.phoneIntl}`}
                    onClick={() => trackSiteEvent("call_click", { source: "landing_nap" })}
                    dir="ltr"
                    className="flex items-start gap-3 text-[13.5px] font-bold leading-7 text-foreground transition-colors hover:text-primary"
                  >
                    <Phone className="mt-1 h-4.5 w-4.5 shrink-0 text-primary" aria-hidden="true" />
                    {site.phone}
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1" aria-label="امتیاز ۵ از ۵">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                        aria-hidden="true"
                      />
                    ))}
                  </span>
                  <span className="text-[13px] font-black text-foreground">
                    {site.rating.score} در گوگل ({site.rating.count} نظر)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openBooking("landing_nap")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-black text-primary-foreground transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                >
                  رزرو نوبت و مسیر مطب
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              {/* نقشه گوگل — مطابق CSP: frame-src google.com */}
              <div className="overflow-hidden rounded-[2rem] border border-[oklch(0.5_0.06_152/0.15)] shadow-[0_30px_70px_-45px_oklch(0.4_0.06_152/0.5)] lg:col-span-3">
                <iframe
                  src={site.mapEmbed}
                  title="نقشه مطب دکتر پدرام بخشایی — مرکز خرید پاسداران"
                  className="h-72 w-full border-0 lg:h-full lg:min-h-[320px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA نهایی */}
      <section className="relative overflow-hidden py-14" aria-label="رزرو مشاوره">
        <div className="gradient-petrol-cta absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
          <h2 className="text-2xl font-black tracking-tight text-background sm:text-3xl">
            برای بررسی وضعیت خود، مشاوره بگیرید
          </h2>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[13px] text-background/70">
            <MapPin className="h-4 w-4" />
            {site.address}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => openBooking("landing")}
              className="inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 text-sm font-black text-[oklch(0.2_0.03_262)] transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              رزرو نوبت
              <ArrowLeft className="h-4 w-4" />
            </button>
            <a
              href={`tel:${site.phoneIntl}`}
              onClick={() => trackSiteEvent("call_click", { source: "landing" })}
              dir="ltr"
              className="inline-flex items-center gap-2 rounded-full border border-background/25 bg-background/10 px-7 py-3.5 text-sm font-bold text-background backdrop-blur transition-all hover:bg-background/20 cursor-pointer"
            >
              <Phone className="h-4 w-4" />
              {site.phoneIntl}
            </a>
            <a
              href={site.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="inline-flex items-center gap-2 rounded-full border border-background/25 bg-background/10 px-7 py-3.5 text-sm font-bold text-background backdrop-blur transition-all hover:bg-background/20 cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
