"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageCircleQuestion } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./services";

const ease = [0.16, 1, 0.3, 1] as const;

function FaqItem({
  q,
  a,
  open,
  onToggle,
  index,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease, delay: index * 0.04 }}
      className={cn(
        "overflow-hidden rounded-3xl border transition-all duration-500",
        open
          ? "border-primary/30 bg-card shadow-[0_20px_50px_-24px] shadow-primary/25"
          : "border-border/60 bg-card/60 hover:border-border"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-6 py-5 text-right cursor-pointer"
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-500",
            open ? "rotate-45 bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}
        >
          <Plus className="h-4.5 w-4.5" />
        </span>
        <span className={cn("text-[15px] font-bold leading-7", open && "text-primary")}>{q}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
          >
            <p className="px-6 pb-6 pr-[4.75rem] text-sm leading-8 text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Faq() {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <section id="faq" className="relative py-20 lg:py-28" aria-label="سوالات متداول">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <SectionHeading
          kicker="سوالات متداول"
          title={
            <>
              آیا سوالی دارید؟
            </>
          }
          desc="پاسخ پرتکرارترین سوالات درباره جراحی‌های فک و صورت — اگر پاسخ خود را پیدا نکردید، از طریق فرم تماس بپرسید."
        />
        <div className="space-y-3">
          {FAQ_ITEMS.map((f, i) => (
            <FaqItem
              key={f.q}
              q={f.q}
              a={f.a}
              index={i}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="mt-10 flex justify-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-6 py-3 text-sm font-bold shadow-sm transition-all duration-300 hover:shadow-md active:scale-95 cursor-pointer"
          >
            <MessageCircleQuestion className="h-4.5 w-4.5 text-primary" />
            سوال خود را از دکتر بپرسید
          </a>
        </motion.div>
      </div>
    </section>
  );
}
