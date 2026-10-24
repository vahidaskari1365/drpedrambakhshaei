"use client";

/**
 * تب «نوبت و تماس» — آمار گرافیکی کامل نوبت‌دهی و تماس‌ها
 * KPI (پنجره نوبت، دکترتو، نوبت، تماس، فرم مشاوره، نرخ تبدیل)
 * + نمودار ساحتی ۳۰ روزه + تفکیک پلتفرم + منشأ درخواست‌ها + آخرین رویدادها
 */
import * as React from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  PhoneCall,
  Phone,
  Stethoscope,
  Inbox,
  Percent,
  RefreshCw,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api, faNum, faTimeAgo, type EventStats } from "./shared";
import { Kpi } from "./kpi";
import { BookingArea, PlatformDonut, VolumeBars } from "./charts";

const TYPE_ICON: Record<string, typeof CalendarCheck> = {
  booking_modal_open: CalendarCheck,
  booking_platform_click: Stethoscope,
  call_click: Phone,
};

export function BookingTab({
  toast,
  refreshKey,
}: {
  toast: (msg: string, kind?: "ok" | "err") => void;
  refreshKey: number;
}) {
  const [data, setData] = React.useState<EventStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    try {
      const res = await api<EventStats>("/api/admin/events");
      setData(res);
    } catch (e) {
      toast(e instanceof Error ? e.message : "خطا در بارگذاری آمار نوبت", "err");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await api<EventStats>("/api/admin/events");
        if (alive) setData(res);
      } catch (e) {
        toast(e instanceof Error ? e.message : "خطا در بارگذاری آمار نوبت", "err");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [toast, refreshKey]);

  if (loading && !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-emerald-300/60" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-dark rounded-3xl p-10 text-center">
        <CalendarCheck className="mx-auto mb-3 h-8 w-8 text-white/25" />
        <p className="text-sm text-white/60">آمار نوبت‌دهی در دسترس نیست</p>
        <button type="button" onClick={load} className="mt-4 rounded-xl bg-emerald-300 px-4 py-2 text-[12.5px] font-black text-[oklch(0.2_0.03_262)] cursor-pointer">
          تلاش دوباره
        </button>
      </div>
    );
  }

  const t = data.totals;

  return (
    <div className="space-y-5">
      {/* KPIها */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <Kpi icon={CalendarCheck} label="باز شدن پنجره نوبت" value={faNum(t.modalOpenAll)} sub={`امروز: ${faNum(t.modalOpenToday)}`} delay={0} />
        <Kpi icon={Stethoscope} label="انتخاب دکترتو" value={faNum(t.doctoretoAll)} sub={`امروز: ${faNum(t.doctoretoToday)}`} tone="gold" delay={0.05} />
        <Kpi icon={ExternalLink} label="انتخاب نوبت.آی‌آر" value={faNum(t.nobatAll)} sub={`امروز: ${faNum(t.nobatToday)}`} tone="violet" delay={0.1} />
        <Kpi icon={Phone} label="کلیک تماس" value={faNum(t.callsAll)} sub={`امروز: ${faNum(t.callsToday)}`} delay={0.15} />
        <Kpi icon={Inbox} label="فرم درخواست مشاوره" value={faNum(t.formRequestsAll)} sub={`امروز: ${faNum(t.formRequestsToday)}`} tone="gold" delay={0.2} />
        <Kpi icon={Percent} label="نرخ تبدیل پنجره" value={`${faNum(t.conversion)}٪`} sub="از پنجره تا انتخاب پلتفرم" tone="violet" delay={0.25} />
      </div>

      {/* نمودار اصلی ۳۰ روزه */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="glass-dark rounded-3xl p-5"
      >
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-[13px] font-black text-white">۳۰ روز اخیر — قیف نوبت و تماس</h3>
          <span className="flex items-center gap-3 text-[10.5px] text-white/40">
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-emerald-300" /> باز شدن پنجره</span>
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-gold" /> انتخاب پلتفرم</span>
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-violet-400" /> کلیک تماس</span>
            <button
              type="button"
              onClick={load}
              aria-label="به‌روزرسانی آمار"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/12 text-white/50 transition-colors hover:bg-white/8 hover:text-white cursor-pointer"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            </button>
          </span>
        </div>
        <BookingArea data={data.daily} />
        <p className="mt-3 flex items-center gap-1.5 text-[10.5px] text-white/30">
          <PhoneCall className="h-3 w-3" />
          هر ردیف روزانه: باز شدن پنجره نوبت، انتخاب پلتفرم (رفتن به دکترتو/نوبت) و کلیک روی دکمه‌های تماس
        </p>
      </motion.section>

      {/* پلتفرم‌ها + منشأ */}
      <div className="grid gap-4 xl:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="glass-dark rounded-3xl p-5"
        >
          <h3 className="mb-2 text-[13px] font-black text-white">بیمارها کدام پلتفرم را انتخاب کردند؟</h3>
          {t.platformClicks === 0 ? (
            <p className="py-8 text-center text-[12px] text-white/35">هنوز انتخابی ثبت نشده</p>
          ) : (
            <>
              <PlatformDonut data={data.platforms} unit="انتخاب پلتفرم" />
              <ul className="mt-2 space-y-1.5">
                {data.platforms.map((p, i) => (
                  <li key={p.label} className="flex items-center justify-between text-[11.5px]">
                    <span className="flex items-center gap-2 text-white/65">
                      <i className="h-2 w-2 rounded-full" style={{ background: ["#5eead4", "#d9a83f"][i % 2] }} />
                      {p.label}
                    </span>
                    <span className="tabular-nums text-white/45">
                      {faNum(p.value)} · {faNum(Math.round((p.value / Math.max(t.platformClicks, 1)) * 100))}٪
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-dark rounded-3xl p-5 xl:col-span-2"
        >
          <h3 className="mb-3 text-[13px] font-black text-white">منشأ درخواست‌ها — کاربر از کجا کلیک کرده؟</h3>
          {data.sources.length === 0 ? (
            <p className="py-10 text-center text-[12px] text-white/35">هنوز رویدادی ثبت نشده</p>
          ) : (
            <VolumeBars data={data.sources.map((s) => ({ label: s.label, words: s.count }))} max={Math.max(...data.sources.map((s) => s.count), 1)} />
          )}
        </motion.section>
      </div>

      {/* آخرین رویدادها */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="glass-dark rounded-3xl p-5"
      >
        <h3 className="mb-3 text-[13px] font-black text-white">آخرین رویدادهای نوبت و تماس</h3>
        {data.recent.length === 0 ? (
          <p className="py-6 text-center text-[12px] text-white/35">هنوز رویدادی ثبت نشده</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {data.recent.map((r) => {
              const Icon = TYPE_ICON[r.type] ?? CalendarCheck;
              return (
                <li key={r.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] px-3.5 py-2.5">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                      r.type === "call_click" ? "bg-violet-400/12 text-violet-200" : r.type === "booking_platform_click" ? "bg-amber-300/12 text-amber-200" : "bg-emerald-300/12 text-emerald-200"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-bold text-white/80">
                      {r.typeLabel}
                      {r.platform ? ` — ${r.platform === "doctoreto" ? "دکترتو" : "نوبت.آی‌آر"}` : ""}
                    </p>
                    <p className="mt-0.5 text-[10px] text-white/35">
                      {r.source} · {r.path} · {faTimeAgo(r.createdAt)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-4 flex items-center gap-1.5 text-[10.5px] text-white/30">
          <CalendarCheck className="h-3 w-3" />
          «درخواست وقت و مشاوره» فرم‌های ثبت‌شده در صفحه تماس هم شمرده می‌شوند و جزئیاتشان در تب «درخواست‌ها» دیده می‌شود.
        </p>
      </motion.section>
    </div>
  );
}
