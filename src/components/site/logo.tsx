"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * لوگوی واقعی دکتر پدرام بخشایی — استخراج‌شده از سایت اصلی (drpedrambakhshaei.com)
 * مونوگرام «S» بنفش-آبی روی دایره کرم؛ فرآیندشده از cropped-logo.jpg اصلی
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/uploads/logo-badge.webp"
      alt=""
      width={144}
      height={144}
      draggable={false}
      className={`shrink-0 select-none object-cover ${className ?? ""}`}
    />
  );
}

/**
 * لوگوی متحرک سینمایی — موشن‌گرافی روی لوگوی اصلی:
 * ورود فنری با چرخش + هاله چرخان بنفش/آبی/طلایی (رنگ‌های خود برند)
 * + درخشش تنفسی پشت لوگو + پرتو نور عبوری
 */
export function AnimatedLogo({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="group/logo relative inline-flex shrink-0"
      initial={reduce ? false : { scale: 0.25, rotate: -130, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 230, damping: 15, delay: 0.35 }}
    >
      <span aria-hidden className="logo-glow" />
      <span aria-hidden className="logo-halo" />
      <img
        src="/uploads/logo-badge.webp"
        alt=""
        width={144}
        height={144}
        draggable={false}
        className={`relative shrink-0 select-none object-cover transition-transform duration-500 ease-out group-hover/logo:rotate-[10deg] group-hover/logo:scale-105 ${className ?? ""}`}
      />
      <span aria-hidden className="logo-shine" />
    </motion.span>
  );
}

export function LogoFull({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <AnimatedLogo className="h-10 w-10" />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-extrabold tracking-tight">
          دکتر پدرام بخشایی
        </span>
        <span className="mt-1 text-[10px] font-medium text-muted-foreground">
          متخصص جراحی دهان، فک و صورت
        </span>
      </span>
    </span>
  );
}
