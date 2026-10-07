"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, MessageCircleQuestion, ArrowLeft } from "lucide-react";
import { PageHero } from "../page-hero";
import { FAQ_ITEMS, PRICE_FAQS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

const ALL_FAQS = [
  ...FAQ_ITEMS.map((f) => ({ q: f.q, a: f.a, group: f.group })),
  ...PRICE_FAQS.map((f) => ({ q: f.q, a: f.a, group: f.group })),
];

const GROUPS = ["همه", "ارتوسرجری", "ایمپلنت", "دندان نهفته", "هزینه‌ها"] as const;

function groupOf(g: string): string {
  if (g === "همه") return "all";
  if (g === "هزینه‌ها") return "cost";
  return g;
}

function matches(itemGroup: string, active: string): boolean {
  const key = groupOf(active);
  if (key === "all") return true;
  if (key === "cost") return itemGroup.startsWith("هزینه");
  return itemGroup === key;
}

function FaqItem({
  q,
  a,
  group,
  open,
  onToggle,
  index,
}: {
  q: string;
  a: string;
  group: string;
  open: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.55, ease, delay: Math.min(index * 0.04, 0.3) }}
      className="card-sage overflow-hidden rounded-3xl"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right cursor-pointer"
      >
        <span className="flex items-center gap-3">
          <span className="hidden rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary sm:inline-block">
            {group}
          </span>
          <span className="text-[15px] font-extrabold leading-7">{q}</span>
        </span>
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background transition-all duration-300",
            open && "rotate-45 border-primary/40 bg-primary/10"
          )}
        >
          <Plus className={cn("h-4 w-4", open ? "text-primary" : "text-muted-foreground")} />
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-6 text-[14px] leading-8 text-muted-foreground">{a}</p>
      </motion.div>
    </motion.div>
  );
}

export function FaqPage() {
  const [active, setActive] = React.useState<string>("همه");
  const [openIndex, setOpenIndex] = React.useState<number>(0);
  const filtered = ALL_FAQS.filter((f) => matches(f.group, active));

  return (
    <>
      <PageHero
        kicker="سوالات متداول"
        title={
          <>
            پاسخ شفاف به
            <span className="text-gradient-light block">پرسش‌های شما</span>
          </>
        }
        desc="مجموعه کامل سوالات متداول سایت — از ارتوسرجری و ایمپلنت تا هزینه‌ها و نقاهت پس از جراحی"
      />

      <section className="bg-sage relative overflow-hidden py-14 lg:py-20" aria-label="فهرست سوالات">
        <div className="aurora aurora-sage" />
        <div className="relative mx-auto max-w-3xl px-5 lg:px-8">
          {/* تب گروه‌ها */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mb-8 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-border/60 bg-card/80 p-1.5 shadow-sm backdrop-blur scrollbar-slim"
            role="tablist"
            aria-label="دسته‌بندی سوالات"
          >
            {GROUPS.map((g) => (
              <button
                key={g}
                role="tab"
                aria-selected={active === g}
                onClick={() => {
                  setActive(g);
                  setOpenIndex(0);
                }}
                className={cn(
                  "relative shrink-0 rounded-full px-4 py-2.5 text-[13px] font-bold transition-colors cursor-pointer",
                  active === g ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active === g && (
                  <motion.span
                    layoutId="faq-tab"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    className="absolute inset-0 rounded-full bg-primary"
                  />
                )}
                <span className="relative z-10">{g}</span>
              </button>
            ))}
          </motion.div>

          <motion.div layout className="space-y-3.5">
            <AnimatePresence mode="popLayout">
              {filtered.map((f, i) => (
                <FaqItem
                  key={f.q}
                  q={f.q}
                  a={f.a}
                  group={f.group}
                  index={i}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="mt-12 rounded-[2rem] border border-border/60 bg-card p-8 text-center shadow-sm"
          >
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <MessageCircleQuestion className="h-6.5 w-6.5 text-primary" />
            </span>
            <h2 className="text-xl font-black">سوالتان پیدا نشد؟</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-muted-foreground">
              سوال خود را مستقیم از مطب بپرسید — کارشناسان ما در ساعات کاری پاسخگو هستند.
            </p>
            <a
              href="#/contact"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all duration-300 hover:brightness-110 active:scale-95 cursor-pointer"
            >
              پرسیدن سوال
              <ArrowLeft className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
