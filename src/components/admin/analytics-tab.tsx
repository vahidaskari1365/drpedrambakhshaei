"use client";

/**
 * تب «بازدیدها» — آمار گرافیکی بازدیدکنندگان سایت
 * KPI + نمودار ساحتی ۳۰ روزه + صفحات پربازدید + دستگاه‌ها + ساعات + ارجاع‌دهنده‌ها
 */
import * as React from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, MousePointerClick, Smartphone, Monitor, Tablet, RefreshCw, Loader2, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, faNum, faTimeAgo, type Analytics } from "./shared";
import { Kpi } from "./kpi";
import { VisitsArea, PagesBars, SimpleDonut, HoursBars, VolumeBars } from "./charts";

const DEVICE_ICON = { mobile: Smartphone, tablet: Tablet, desktop: Monitor } as const;

export function AnalyticsTab({
  toast,
  refreshKey,
}: {
  toast: (msg: string, kind?: "ok" | "err") => void;
  refreshKey: number;
}) {
  const [data, setData] = React.useState<Analytics | null>(null);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    try {
      const res = await api<Analytics>("/api/admin/analytics");
      setData(res);
    } catch (e) {
      toast(e instanceof Error ? e.message : "خطا در بارگذاری آمار", "err");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await api<Analytics>("/api/admin/analytics");
        if (alive) setData(res);
      } catch (e) {
        toast(e instanceof Error ? e.message : "خطا در بارگذاری آمار", "err");
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
        <Loader2 className="h-7 w-7 animate-spin text-teal-300/60" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-dark rounded-3xl p-10 text-center">
        <EyeOff className="mx-auto mb-3 h-8 w-8 text-white/25" />
        <p className="text-sm text-white/60">آماری در دسترس نیست</p>
        <button type="button" onClick={load} className="mt-4 rounded-xl bg-teal-300 px-4 py-2 text-[12.5px] font-black text-[oklch(0.2_0.03_205)] cursor-pointer">
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
        <Kpi icon={CalendarDays} label="بازدید امروز" value={faNum(t.today)} sub={`دیروز: ${faNum(t.yesterday)}`} delay={0} />
        <Kpi icon={Eye} label="۷ روز اخیر" value={faNum(t.week)} sub="یک هفته گذشته" tone="gold" delay={0.05} />
        <Kpi icon={MousePointerClick} label="۳۰ روز اخیر" value={faNum(t.month)} sub="یک ماه گذشته" delay={0.1} />
        <Kpi icon={Eye} label="کل بازدید صفحه" value={faNum(t.all)} sub="از ابتدا" tone="violet" delay={0.15} />
        <Kpi icon={Eye} label="بازدیدکننده یکتا" value={faNum(t.unique)} sub="شناسه یکتای مرورگر" tone="gold" delay={0.2} />
        <Kpi
          icon={MousePointerClick}
          label="میانگین صفحه هر نفر"
          value={faNum(t.unique ? Math.round((t.all / t.unique) * 10) / 10 : 0)}
          sub="عمق بازدید"
          tone="violet"
          delay={0.25}
        />
      </div>

      {/* نمودار اصلی ۳۰ روزه */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="glass-dark rounded-3xl p-5"
      >
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-[13px] font-black text-white">۳۰ روز اخیر — بازدید صفحه و بازدیدکننده یکتا</h3>
          <span className="flex items-center gap-3 text-[10.5px] text-white/40">
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-teal-300" /> بازدید صفحه</span>
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-gold" /> یکتا</span>
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
        <VisitsArea data={data.daily} />
      </motion.section>

      {/* صفحات پربازدید + دستگاه‌ها */}
      <div className="grid gap-4 xl:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="glass-dark rounded-3xl p-5 xl:col-span-2"
        >
          <h3 className="mb-2 text-[13px] font-black text-white">پربازدیدترین صفحات</h3>
          {data.topPaths.length === 0 ? (
            <p className="py-10 text-center text-[12px] text-white/35">هنوز بازدیدی ثبت نشده</p>
          ) : (
            <PagesBars data={data.topPaths} />
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-dark rounded-3xl p-5"
        >
          <h3 className="mb-2 text-[13px] font-black text-white">نوع دستگاه بازدیدکننده</h3>
          <SimpleDonut data={data.devices} unit="بازدید ۳۰ روز" />
          <ul className="mt-2 space-y-1.5">
            {data.devices.map((d, i) => (
              <li key={d.label} className="flex items-center justify-between text-[11.5px]">
                <span className="flex items-center gap-2 text-white/65">
                  <i className="h-2 w-2 rounded-full" style={{ background: ["#5eead4", "#d9a83f", "#8b7cf6"][i % 3] }} />
                  {d.label}
                </span>
                <span className="tabular-nums text-white/45">
                  {faNum(d.value)} · {faNum(Math.round((d.value / Math.max(t.month, 1)) * 100))}٪
                </span>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>

      {/* ساعات پربازدید + ارجاع‌دهنده‌ها */}
      <div className="grid gap-4 xl:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="glass-dark rounded-3xl p-5 xl:col-span-2"
        >
          <h3 className="mb-2 text-[13px] font-black text-white">توزیع ساعتی بازدید (۳۰ روز)</h3>
          <HoursBars data={data.hours} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass-dark rounded-3xl p-5"
        >
          <h3 className="mb-3 text-[13px] font-black text-white">ارجاع‌دهنده‌ها</h3>
          {data.referrers.length === 0 ? (
            <p className="py-8 text-center text-[12px] text-white/35">داده‌ای نیست</p>
          ) : (
            <VolumeBars
              data={data.referrers.map((r) => ({ label: r.label, words: r.count }))}
              max={Math.max(...data.referrers.map((r) => r.count), 1)}
            />
          )}
        </motion.section>
      </div>

      {/* آخرین بازدیدها */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.55 }}
        className="glass-dark rounded-3xl p-5"
      >
        <h3 className="mb-3 text-[13px] font-black text-white">آخرین بازدیدهای ثبت‌شده</h3>
        {data.recent.length === 0 ? (
          <p className="py-6 text-center text-[12px] text-white/35">هنوز بازدیدی ثبت نشده</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {data.recent.map((v, i) => {
              const DeviceIcon = DEVICE_ICON[v.device as keyof typeof DEVICE_ICON] ?? Monitor;
              return (
                <li key={i} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] px-3.5 py-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-300/12 text-teal-200">
                    <DeviceIcon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-bold text-white/80">{v.label}</p>
                    <p className="mt-0.5 text-[10px] text-white/35">
                      {v.referrer} · {faTimeAgo(v.createdAt)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-4 flex items-center gap-1.5 text-[10.5px] text-white/30">
          <Eye className="h-3 w-3" />
          بازدیدها با هر ورود واقعی کاربر به صفحات سایت ثبت می‌شود؛ مسیرهای پنل ادمین شمرده نمی‌شوند.
        </p>
      </motion.section>
    </div>
  );
}
