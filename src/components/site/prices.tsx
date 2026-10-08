"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Info, PhoneCall, BadgeCheck } from "lucide-react";
import { useSite } from "./content-provider";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

export function Prices() {
  const { priceTabs } = useSite();
  const [tab, setTab] = React.useState(0);
  const current = priceTabs[tab];

  return (
    <section id="prices" className="relative py-20 lg:py-28" aria-label="تعرفه خدمات">
      {/* زمینه تیره سینمایی */}
      <div className="absolute inset-0 -z-10 bg-[oklch(0.19_0.01_190)] dark:bg-[oklch(0.12_0.01_190)]" />
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 0%, oklch(0.4 0.07 190 / 0.55), transparent 70%), radial-gradient(50% 40% at 90% 100%, oklch(0.35 0.06 185 / 0.45), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        {/* تب‌ها — قرصی */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="mx-auto mb-8 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-background/15 bg-background/10 p-1.5 backdrop-blur-xl scrollbar-slim"
          role="tablist"
          aria-label="دسته‌بندی تعرفه‌ها"
        >
          {priceTabs.map((t, i) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
              className={cn(
                "relative shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-colors cursor-pointer",
                tab === i ? "text-[oklch(0.19_0.01_190)]" : "text-background/70 hover:text-background"
              )}
            >
              {tab === i && (
                <motion.span
                  layoutId="price-tab"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  className="absolute inset-0 rounded-full bg-background"
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </motion.div>

        {/* جدول */}
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="overflow-hidden rounded-[2rem] border border-background/15 bg-background/[0.07] backdrop-blur-2xl"
        >
          <div className="overflow-x-auto scrollbar-slim">
            <table className="w-full min-w-[560px] text-right">
              <thead>
                <tr className="border-b border-background/10 text-xs text-background/60">
                  <th className="px-6 py-4 font-bold">خدمت</th>
                  <th className="px-6 py-4 font-bold">جزئیات</th>
                  <th className="px-6 py-4 font-bold whitespace-nowrap">محدوده قیمت</th>
                </tr>
              </thead>
              <tbody>
                {current.rows.map((r, i) => (
                  <motion.tr
                    key={r.item}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease, delay: i * 0.06 }}
                    className="border-b border-background/8 text-background transition-colors hover:bg-background/10"
                  >
                    <td className="px-6 py-4 text-sm font-bold">{r.item}</td>
                    <td className="px-6 py-4 text-xs leading-6 text-background/70">{r.extra}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-black tabular-nums text-teal-200">{r.price}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* هزینه‌های تکمیلی */}
          <div className="border-t border-background/10 px-6 py-6">
            <p className="mb-4 text-xs font-bold tracking-widest text-background/60">
              هزینه‌های تکمیلی احتمالی
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {current.extras.map((e, i) => (
                <motion.div
                  key={e.item}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.15 + i * 0.05 }}
                  className="flex items-center justify-between rounded-2xl border border-background/10 bg-background/5 px-4 py-3"
                >
                  <span className="text-[13px] font-medium text-background/85">{e.item}</span>
                  <span className="text-xs font-black tabular-nums text-teal-200">{e.price}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-background/10 px-6 py-6 sm:flex-row sm:items-center">
            <p className="flex-1 text-xs leading-6 text-background/60">
              <Info className="ml-1 inline h-3.5 w-3.5 -translate-y-px" />
              {current.note}
            </p>
            <a
              href="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-black text-[oklch(0.19_0.01_190)] transition-transform duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              <PhoneCall className="h-4 w-4" />
              دریافت برآورد دقیق
            </a>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mx-auto mt-8 flex max-w-2xl items-center justify-center gap-2 text-center text-xs leading-6 text-background/50"
        >
          <BadgeCheck className="h-4 w-4 shrink-0" />
          برای مراجعین شهرستانی ۲۰ میلیون تومان تخفیف اسکان در جراحی فک اعمال می‌شود
        </motion.p>
      </div>
    </section>
  );
}
