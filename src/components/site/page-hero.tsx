"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Breadcrumbs } from "./breadcrumbs";

const ease = [0.16, 1, 0.3, 1] as const;

/** سربرگ تیره سینمایی صفحات داخلی — پترول عمیق + شفق + گرین */
export function PageHero({
  kicker,
  title,
  desc,
  children,
}: {
  kicker: string;
  title: React.ReactNode;
  desc?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-petrol-deep grain relative overflow-hidden pt-28 pb-14 lg:pt-36 lg:pb-20" aria-label="سربرگ صفحه">
      <div className="aurora" />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(55% 60% at 85% 0%, oklch(0.42 0.07 195 / 0.5), transparent 70%), radial-gradient(45% 50% at 10% 100%, oklch(0.6 0.1 85 / 0.14), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <Breadcrumbs />
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-background/15 bg-background/10 px-4 py-1.5 text-xs font-bold tracking-widest text-teal-300 backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {kicker}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.18 }}
          className="max-w-3xl text-3xl font-black leading-[1.2] tracking-tight text-background sm:text-5xl sm:leading-[1.15]"
        >
          {title}
        </motion.h1>
        {desc && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.28 }}
            className="mt-5 max-w-2xl text-[15px] leading-8 text-background/65"
          >
            {desc}
          </motion.p>
        )}
        {children}
      </div>
    </section>
  );
}
