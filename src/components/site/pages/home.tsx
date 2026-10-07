"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Quote, Phone, CalendarCheck, BadgeCheck, Sparkles } from "lucide-react";
import { Hero } from "../hero";
import { SITE, REVIEWS, WHY_US } from "@/lib/site-data";

const ease = [0.16, 1, 0.3, 1] as const;

/** مقصدهای صفحه اول — هر کارت یک صفحه اختصاصی */
const DESTINATIONS = [
  {
    href: "#/services",
    title: "خدمات تخصصی",
    desc: "ارتوسرجری، ایمپلنت پیشرفته و جراحی دندان‌های نهفته",
    image: "/uploads/implant-art.png",
  },
  {
    href: "#/gallery",
    title: "نمونه کارها",
    desc: "گالری سینمایی سه‌بعدی و عکس‌های واقعی مطب",
    image: "/uploads/clinic-photo-3.jpg",
  },
  {
    href: "#/prices",
    title: "تعرفه‌های ۱۴۰۵",
    desc: "جدول شفاف هزینه ایمپلنت، جراحی فک و دندان نهفته",
    image: "/uploads/clinic-photo-5.jpg",
  },
  {
    href: "#/about",
    title: "درباره دکتر",
    desc: "بیوگرافی، مدارک آکادمیک و رتبه ۲ بورد تخصص کشور",
    image: "/uploads/doctor-portrait.jpg",
  },
] as const;

const SECONDARY_LINKS = [
  { href: "#/faq", label: "سوالات متداول" },
  { href: "#/reviews", label: "نظرات مراجعین" },
  { href: "#/contact", label: "رزرو نوبت" },
] as const;

export function HomePage() {
  return (
    <>
      <Hero />

      {/* مقصدها — بخش تیره سینمایی */}
      <section className="bg-petrol-deep grain relative overflow-hidden py-20 lg:py-28" aria-label="مسیرهای سایت">
        <div className="aurora" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease }}
              className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-teal-300"
            >
              <Sparkles className="h-3.5 w-3.5" />
              مسیرهای درمان
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease, delay: 0.08 }}
              className="text-3xl font-black tracking-tight text-background sm:text-[2.6rem] sm:leading-[1.2]"
            >
              هر سوال، صفحه‌ای
              <br className="hidden sm:block" /> از خودش
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease, delay: 0.16 }}
              className="mt-4 text-[15px] leading-8 text-background/65"
            >
              از خدمات و نمونه کارها تا تعرفه‌ها و رزرو نوبت — همه‌چیز در صفحه اختصاصی خودش
            </motion.p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DESTINATIONS.map((d, i) => (
              <motion.a
                key={d.href}
                href={d.href}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease, delay: i * 0.1 }}
                className="group relative flex h-80 flex-col justify-end overflow-hidden rounded-[2rem] border border-background/10 shadow-[0_30px_70px_-30px_oklch(0.08_0.02_205/0.8)] transition-all duration-500 hover:-translate-y-2 hover:border-background/25 cursor-pointer lg:h-[26rem]"
                aria-label={d.title}
              >
                <Image
                  src={d.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.02_205/0.95)] via-[oklch(0.17_0.025_205/0.35)] to-transparent" />
                <div className="relative p-6">
                  <span className="mb-2 inline-block rounded-full border border-background/20 bg-background/10 px-3 py-1 text-[10px] font-bold tracking-widest text-teal-200 backdrop-blur">
                    ۰{i + 1}
                  </span>
                  <h3 className="text-xl font-black text-background">{d.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-6 text-background/70">{d.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-teal-300 transition-all duration-300 group-hover:gap-3">
                    مشاهده صفحه
                    <ArrowLeft className="h-4 w-4" />
                  </span>
                </div>
              </motion.a>
            ))}
          </div>

          {/* لینک‌های ثانویه */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {SECONDARY_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-2 rounded-full border border-background/15 bg-background/[0.06] px-5 py-2.5 text-[13px] font-bold text-background/80 backdrop-blur transition-all duration-300 hover:bg-background/15 hover:text-background cursor-pointer"
              >
                {l.label}
                <ArrowLeft className="h-3.5 w-3.5" />
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* چرا دکتر بخشایی — نوار گلس‌دارک */}
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
                {WHY_US.title}
              </h2>
              <p className="mt-4 max-w-lg text-[14px] leading-8 text-background/70">{WHY_US.text}</p>
              <a
                href="#/about"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-teal-300 transition-all duration-300 hover:gap-3 cursor-pointer"
              >
                بیشتر درباره دکتر بخشایی
                <ArrowLeft className="h-4 w-4" />
              </a>
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

      {/* نگاهی به نظرات واقعی */}
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
                {SITE.rating.score} در گوگل · {SITE.rating.count} نظر
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
              href="#/reviews"
              className="inline-flex items-center gap-1.5 rounded-full border border-background/15 bg-background/[0.06] px-5 py-2.5 text-[13px] font-bold text-background/80 backdrop-blur transition-all hover:bg-background/15 hover:text-background cursor-pointer"
            >
              همه نظرات
              <ArrowLeft className="h-3.5 w-3.5" />
            </motion.a>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {REVIEWS.slice(1, 4).map((r, i) => (
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

      {/* CTA نهایی */}
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
            {SITE.hours} — {SITE.shortAddress}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#/contact"
              className="inline-flex items-center gap-2.5 rounded-full bg-background px-7 py-3.5 text-sm font-black text-[oklch(0.2_0.03_205)] shadow-[0_16px_40px_-14px_oklch(0.05_0.02_205/0.8)] transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              <CalendarCheck className="h-4.5 w-4.5" />
              رزرو نوبت و مشاوره
            </a>
            <a
              href={`tel:${SITE.phone}`}
              dir="ltr"
              className="inline-flex items-center gap-2.5 rounded-full border border-background/25 bg-background/10 px-7 py-3.5 text-sm font-bold text-background backdrop-blur transition-all duration-300 hover:bg-background/20 active:scale-95 cursor-pointer"
            >
              <Phone className="h-4.5 w-4.5" />
              {SITE.phone}
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
