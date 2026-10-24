"use client";

/**
 * مودال رزرو نوبت — قلب سیستم نوبت‌دهی سایت
 * با کلیک روی هر دکمه «رزرو نوبت» در سایت، این مودال باز می‌شود و
 * بیمار مستقیماً بین دو پلتفرم نوبت‌دهی (دکترتو و نوبت) انتخاب می‌کند.
 * انتخاب هر پلتفرم = ثبت رویداد در داشبورد ادمین + انتقال به همان سامانه.
 */

import * as React from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarCheck, Phone, Stethoscope, ExternalLink, Clock3, ShieldCheck } from "lucide-react";
import { useSite } from "./content-provider";
import { trackSiteEvent } from "@/lib/track";

/* ─── پلتفرم‌های نوبت‌دهی — لینک‌های رسمی دکتر پدرام بخشایی ─── */
export const BOOKING_PLATFORMS = [
  {
    id: "doctoreto",
    name: "دکترتو",
    desc: "سامانه نوبت‌دهی آنلاین دکترتو — انتخاب زمان و رزرو فوری",
    url: "https://doctoreto.com/doctor/dr-pedram-bakhshaei-shahrebabaki/MkjPjG",
    Icon: Stethoscope,
    accent: "from-emerald-400/25 to-emerald-400/5 text-emerald-200",
    ring: "hover:border-emerald-300/50",
    btn: "bg-emerald-300 text-[oklch(0.2_0.03_262)] hover:bg-emerald-200",
  },
  {
    id: "nobat",
    name: "نوبت.آی‌آر",
    desc: "سامانه نوبت‌دهی آنلاین نوبت — مشاهده نوبت‌های آزاد",
    url: "https://nobat.ir/doctor/%D8%AF%DA%A9%D8%AA%D8%B1-%D9%BE%D8%AF%D8%B1%D8%A7%D9%85-%D8%A8%D8%AE%D8%B4%D8%A7%DB%8C%DB%8C-%D8%AA%D9%87%D8%B1%D8%A7%D9%86/dr-34312/",
    Icon: CalendarCheck,
    accent: "from-amber-400/25 to-amber-400/5 text-amber-200",
    ring: "hover:border-amber-300/50",
    btn: "bg-amber-300 text-[oklch(0.2_0.03_262)] hover:bg-amber-200",
  },
] as const;

/* ─── باس سبک باز/بسته شدن مودال — از هر جای سایت قابل فراخوانی ─── */
type Listener = (source: string) => void;
const listeners = new Set<Listener>();

/** باز کردن مودال رزرو نوبت — source = محل کلیک (hero، مقاله، تعرفه‌ها و ...) */
export function openBooking(source: string) {
  listeners.forEach((fn) => fn(source));
}

export function BookingModal() {
  const { site } = useSite();
  const [open, setOpen] = React.useState(false);
  const [source, setSource] = React.useState("");

  React.useEffect(() => {
    const fn: Listener = (s) => {
      setSource(s);
      setOpen(true);
    };
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);

  // ثبت رویداد باز شدن — هر بار که مودال واقعاً دیده می‌شود
  React.useEffect(() => {
    if (open) trackSiteEvent("booking_modal_open", { source });
  }, [open, source]);

  const pick = (platform: string, url: string) => {
    trackSiteEvent("booking_platform_click", { platform, source });
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      /* پنجره‌های مسدودشده را بی‌صدا رد می‌کنیم */
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[calc(100vw-1.5rem)] sm:max-w-md border-0 bg-[oklch(0.17_0.025_262)] p-0 text-white shadow-2xl outline-none sm:rounded-[2rem]">
          <DialogHeader className="relative px-6 pt-6 text-center sm:px-8">
            <DialogTitle className="flex items-center justify-center gap-2 text-lg font-black text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/25 to-amber-400/25">
                <CalendarCheck className="h-5 w-5 text-emerald-200" />
              </span>
              رزرو نوبت و مشاوره
            </DialogTitle>
            <DialogDescription className="mx-auto mt-2 max-w-xs text-[12.5px] leading-6 text-white/55">
              سامانه نوبت‌دهی مورد نظر خود را انتخاب کنید تا مستقیم به صفحه نوبت‌های آزاد منتقل شوید
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 px-6 pb-6 pt-4 sm:px-8">
            {BOOKING_PLATFORMS.map(({ id, name, desc, url, Icon, accent, ring, btn }, i) => (
              <motion.button
                key={id}
                type="button"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => pick(id, url)}
                className={`group flex w-full items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-right transition-all duration-300 hover:bg-white/[0.08] active:scale-[0.985] cursor-pointer ${ring}`}
                aria-label={`رزرو نوبت در سامانه ${name}`}
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accent}`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-black text-white">{name}</span>
                  <span className="mt-0.5 block text-[11.5px] leading-5 text-white/50">{desc}</span>
                </span>
                <span
                  className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[12px] font-black transition-colors ${btn}`}
                >
                  ادامه
                  <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </motion.button>
            ))}

            {/* گزینه جایگزین — تماس مستقیم با مطب */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-dashed border-white/12 p-4"
            >
              <p className="mb-3 flex items-center gap-2 text-[11.5px] font-bold text-white/45">
                <Clock3 className="h-3.5 w-3.5" />
                ترجیح می‌دهید تلفنی وقت بگیرید؟
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`tel:${site.phoneIntl}`}
                  onClick={() => trackSiteEvent("call_click", { source: "booking_modal" })}
                  dir="ltr"
                  className="inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-2 text-[12.5px] font-black text-white transition-colors hover:bg-white/14 cursor-pointer"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {site.phone}
                </a>
                <span className="flex items-center gap-1.5 text-[10.5px] text-white/35">
                  <ShieldCheck className="h-3 w-3" />
                  پاسخگویی در ساعات مطب
                </span>
              </div>
            </motion.div>
          </div>

      </DialogContent>
    </Dialog>
  );
}
