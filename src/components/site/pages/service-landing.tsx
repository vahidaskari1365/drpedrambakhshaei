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
} from "lucide-react";
import type { LandingConfig } from "@/lib/landings";

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
      />

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

      {/* تعرفه مرتبط */}
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
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                تعرفه ۱۴۰۵ — {priceTab.label}
              </h2>
              <p className="mt-3 text-[13px] leading-7 text-muted-foreground">{priceTab.note}</p>
              <div className="mt-8 overflow-hidden rounded-[2rem] border border-[oklch(0.5_0.06_152/0.15)] bg-card">
                {priceTab.rows.map((row, i) => (
                  <div
                    key={row.item}
                    className={`flex flex-wrap items-center justify-between gap-2 px-5 py-4 sm:px-7 ${
                      i % 2 === 0 ? "bg-[oklch(0.97_0.01_150)]" : ""
                    }`}
                  >
                    <div>
                      <p className="text-[13.5px] font-black text-foreground">{row.item}</p>
                      {row.extra && (
                        <p className="mt-0.5 text-[11.5px] text-muted-foreground">{row.extra}</p>
                      )}
                    </div>
                    <p className="text-[14px] font-black text-primary">{row.price}</p>
                  </div>
                ))}
              </div>
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
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 text-sm font-black text-[oklch(0.2_0.03_262)] transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              رزرو نوبت
              <ArrowLeft className="h-4 w-4" />
            </a>
            <a
              href={`tel:${site.phoneIntl}`}
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
