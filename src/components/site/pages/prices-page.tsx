"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronDown, CreditCard, PhoneCall, BadgeCheck } from "lucide-react";
import { Prices } from "../prices";
import { COST_FACTORS, PRICE_FAQS, WHY_US } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

function FaqRow({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = React.useState(index === 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease, delay: index * 0.04 }}
      className="glass-dark overflow-hidden rounded-2xl"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right cursor-pointer"
      >
        <span className="text-[14px] font-bold text-background/90">{q}</span>
        <ChevronDown
          className={cn("h-4.5 w-4.5 shrink-0 text-teal-300 transition-transform duration-300", open && "rotate-180")}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-5 text-[13px] leading-7 text-background/65">{a}</p>
      </motion.div>
    </motion.div>
  );
}

export function PricesPage() {
  return (
    <>
      <Prices />

      {/* عوامل مؤثر بر هزینه — از سایت قدیمی */}
      <section className="bg-petrol-deep relative overflow-hidden py-16 lg:py-24" aria-label="عوامل مؤثر بر هزینه">
        <div className="aurora" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease }}
              className="text-3xl font-black tracking-tight text-background sm:text-[2.4rem]"
            >
              چه عواملی روی هزینه تأثیر می‌گذارد؟
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
              className="mt-4 text-[15px] leading-8 text-background/65"
            >
              عوامل کلیدی که بر برآورد نهایی هزینه هر خدمت اثر می‌گذارند
            </motion.p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {COST_FACTORS.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease, delay: i * 0.1 }}
                className="glass-dark gold-top-line rounded-[1.75rem] p-6"
              >
                <h3 className="mb-5 text-center text-base font-black text-teal-300">{c.title}</h3>
                <ol className="space-y-4">
                  {c.factors.map((f, j) => (
                    <li key={f.title} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-[11px] font-black text-teal-300">
                        {(j + 1).toLocaleString("fa-IR")}
                      </span>
                      <div>
                        <p className="text-[13px] font-bold text-background/90">{f.title}</p>
                        <p className="mt-1 text-xs leading-6 text-background/60">{f.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>

          {/* پرداخت قسطی + تخفیف شهرستان */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2"
          >
            <div className="glass-dark flex items-start gap-3 rounded-2xl p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15">
                <CreditCard className="h-5 w-5 text-amber-300" />
              </span>
              <div>
                <p className="text-sm font-black text-background">پرداخت مرحله‌ای (قسطی)</p>
                <p className="mt-1 text-xs leading-6 text-background/60">
                  برای برخی طرح‌های درمانی امکان پرداخت مرحله‌ای وجود دارد؛ جزئیات را در مشاوره بپرسید.
                </p>
              </div>
            </div>
            <div className="glass-dark flex items-start gap-3 rounded-2xl p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-400/15">
                <BadgeCheck className="h-5 w-5 text-teal-300" />
              </span>
              <div>
                <p className="text-sm font-black text-background">تخفیف مراجعین شهرستانی</p>
                <p className="mt-1 text-xs leading-6 text-background/60">
                  ۲۰٬۰۰۰٬۰۰۰ تومان از مجموع هزینه جراحی فک، جهت تسهیل شرایط اسکان کسر می‌شود.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* چرا دکتر بخشایی */}
      <section className="bg-petrol relative overflow-hidden py-14 lg:py-18" aria-label="چرا دکتر بخشایی">
        <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
          >
            <h2 className="text-2xl font-black tracking-tight text-background sm:text-3xl">{WHY_US.title}</h2>
            <p className="mt-4 text-[14px] leading-8 text-background/70">{WHY_US.text}</p>
          </motion.div>
        </div>
      </section>

      {/* سوالات متداول هزینه‌ها */}
      <section className="bg-petrol-deep relative overflow-hidden py-16 lg:py-24" aria-label="سوالات متداول هزینه">
        <div className="relative mx-auto max-w-3xl px-5 lg:px-8">
          <div className="mb-10 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
              className="text-3xl font-black tracking-tight text-background sm:text-[2.4rem]"
            >
              سوالات متداول هزینه‌ها
            </motion.h2>
          </div>
          <div className="space-y-3">
            {PRICE_FAQS.map((f, i) => (
              <FaqRow key={f.q} q={f.q} a={f.a} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className="mt-12 text-center"
          >
            <p className="mb-5 text-sm text-background/60">برای برآورد دقیق هزینه شرایط خود، نوبت مشاوره بگیرید</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 text-sm font-black text-[oklch(0.2_0.03_205)] transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              <PhoneCall className="h-4 w-4" />
              رزرو نوبت و برآورد دقیق
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
