"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { GraduationCap, Quote, FileBadge, Stethoscope } from "lucide-react";
import { ABOUT_BIO, ABOUT_APPROACH, CREDENTIALS, SKILLS } from "@/lib/site-data";
import { SectionHeading } from "./services";

const ease = [0.16, 1, 0.3, 1] as const;

function SkillBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [go, setGo] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (e) => e[0].isIntersecting && setGo(true),
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref}>
      <div className="mb-2 flex items-center justify-between text-[13px] font-bold">
        <span>{label}</span>
        <span className="tabular-nums text-primary">{value.toLocaleString("fa-IR")}٪</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={go ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 1.4, ease, delay }}
          className="h-full rounded-full bg-gradient-to-l from-primary to-teal-400"
        />
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="relative py-20 lg:py-28" aria-label="درباره دکتر">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          kicker="درباره من"
          title={
            <>
              علم، هنر و دقت —
              <br className="hidden sm:block" /> در خدمت لبخند شما
            </>
          }
        />

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* بیوگرافی */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
            className="order-2 lg:order-1"
          >
            <div className="space-y-5 text-[15px] leading-8 text-foreground/80">
              {ABOUT_BIO.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease, delay: i * 0.08 }}
                  className={i === 0 ? "font-medium text-foreground" : undefined}
                >
                  {p}
                </motion.p>
              ))}
            </div>

            {/* رویکرد */}
            <motion.blockquote
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
              className="relative mt-8 rounded-3xl border border-border/60 bg-card p-6 shadow-sm"
            >
              <Quote className="absolute -top-3 right-6 h-7 w-7 rounded-full bg-primary p-1.5 text-primary-foreground" />
              <p className="text-sm leading-8 text-foreground/85">{ABOUT_APPROACH}</p>
            </motion.blockquote>
          </motion.div>

          {/* مدارک و مهارت‌ها */}
          <div className="order-1 space-y-8 lg:order-2">
            {/* مدارک */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease }}
              className="rounded-[2rem] border border-border/60 bg-card p-6 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <GraduationCap className="h-5.5 w-5.5 text-primary" />
                </span>
                <div>
                  <h3 className="text-lg font-extrabold">مدارک علمی و آکادمیک</h3>
                  <p className="text-xs text-muted-foreground">دانشنامه‌ها و افتخارات</p>
                </div>
              </div>
              <ul className="space-y-3">
                {CREDENTIALS.map((c, i) => (
                  <motion.li
                    key={c}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease, delay: i * 0.06 }}
                    className="flex items-start gap-2.5 text-[13px] font-medium leading-6 text-foreground/85"
                  >
                    <FileBadge className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {c}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* مهارت‌ها */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease, delay: 0.1 }}
              className="rounded-[2rem] border border-border/60 bg-card p-6 shadow-sm sm:p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <Stethoscope className="h-5.5 w-5.5 text-primary" />
                </span>
                <div>
                  <h3 className="text-lg font-extrabold">حوزه‌های تجربه</h3>
                  <p className="text-xs text-muted-foreground">جراحی‌های مراجعین</p>
                </div>
              </div>
              <div className="space-y-5">
                {SKILLS.map((s, i) => (
                  <SkillBar key={s.label} label={s.label} value={s.value} delay={i * 0.1} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* تصویر مطب — نوار سینمایی */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease }}
          className="relative mt-14 overflow-hidden rounded-[2.5rem] shadow-[0_40px_90px_-36px] shadow-foreground/40"
        >
          <div className="relative h-64 sm:h-80 lg:h-96">
            <Image
              src="/uploads/clinic-photo-2.jpg"
              alt="فضای داخلی مطب دکتر پدرام بخشایی"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
            <div className="absolute bottom-5 right-6 left-6 flex flex-wrap items-end justify-between gap-4 sm:bottom-8">
              <div>
                <p className="text-xs font-bold tracking-widest text-background/70">متخصص جراحی‌های دهان، فک و صورت</p>
                <p className="mt-1 text-xl font-black text-background sm:text-2xl">
                  رتبه ممتاز بورد تخصص
                </p>
              </div>
              <a
                href="#prices"
                className="rounded-full bg-background px-5 py-2.5 text-sm font-bold text-foreground transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                مشاهده تعرفه‌ها
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
