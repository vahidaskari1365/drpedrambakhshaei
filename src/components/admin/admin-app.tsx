"use client";

/**
 * پنل مدیریت سایت — سینک کامل با همه محتواها
 * داشبورد گرافیکی + ویرایش محتوا + مقالات + درخواست‌ها + گزارش + تست جامع + فعالیت
 */
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Database,
  Newspaper,
  Inbox,
  BarChart3,
  ShieldCheck,
  History,
  LogOut,
  RefreshCw,
  ExternalLink,
  Lock,
  Loader2,
  Scissors,
  Stethoscope,
  Images,
  Star,
  CircleHelp,
  FileText,
  BellRing,
  CheckCircle2,
  XCircle,
  Eye,
  TrendingUp,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/lib/site-content";
import { api, getKey, setKey, clearKey, faNum, faTimeAgo, type Overview } from "./shared";
import { ActivityArea, DistributionDonut, ScoreRing, VolumeBars } from "./charts";
import { Kpi } from "./kpi";
import { ContentTab } from "./content-tab";
import { BlogTab } from "./blog-tab";
import { RequestsTab } from "./requests-tab";
import { ReportsTab } from "./reports-tab";
import { TestsTab } from "./tests-tab";
import { ActivityTab } from "./activity-tab";
import { AnalyticsTab } from "./analytics-tab";
import { MediaTab } from "./media-tab";
import { AgentsTab } from "./agents-tab";

type TabId = "dashboard" | "agents" | "analytics" | "content" | "media" | "blog" | "requests" | "reports" | "tests" | "activity";

const TABS: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "داشبورد", icon: LayoutDashboard },
  { id: "agents", label: "ایجنت‌ها", icon: Bot },
  { id: "analytics", label: "بازدیدها", icon: Eye },
  { id: "content", label: "محتوای سایت", icon: Database },
  { id: "media", label: "رسانه‌ها", icon: Images },
  { id: "blog", label: "مقالات بلاگ", icon: Newspaper },
  { id: "requests", label: "درخواست‌ها", icon: Inbox },
  { id: "reports", label: "گزارش‌ها", icon: BarChart3 },
  { id: "tests", label: "تست سایت", icon: ShieldCheck },
  { id: "activity", label: "فعالیت‌ها", icon: History },
];

/* ─────────── توست سبک داخلی ─────────── */

function Toasts({ items }: { items: { id: number; msg: string; kind: "ok" | "err" }[] }) {
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[200] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            className={cn(
              "flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-[12.5px] font-bold shadow-2xl backdrop-blur-xl",
              t.kind === "ok"
                ? "border-emerald-300/30 bg-[oklch(0.25_0.03_262/0.95)] text-emerald-100"
                : "border-red-400/30 bg-[oklch(0.28_0.05_25/0.95)] text-red-100"
            )}
          >
            {t.kind === "ok" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─────────── گیت ورود ─────────── */

function LoginGate({ onOk }: { onOk: () => void }) {
  const [key, setKeyState] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setKey(key.trim());
    try {
      await api("/api/admin/overview");
      onOk();
    } catch (e) {
      // پیام دقیق سرور (خطای کلید، قفل IP یا ...) نمایش داده می‌شود
      setError(e instanceof Error ? e.message : "کلید مدیریت درست نیست");
      clearKey();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-dark gold-top-line w-full max-w-sm rounded-[2rem] p-8"
      >
        <div className="mb-6 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/25 to-gold/25">
            <Lock className="h-6 w-6 text-emerald-200" />
          </span>
          <h1 className="text-xl font-black text-white">پنل مدیریت</h1>
          <p className="mt-1.5 text-[12px] text-white/50">سایت دکتر پدرام بخشایی</p>
        </div>
        <label htmlFor="admin-key" className="mb-2 block text-[11px] font-bold text-white/55">
          کلید مدیریت
        </label>
        <input
          id="admin-key"
          type="password"
          value={key}
          dir="ltr"
          onChange={(e) => setKeyState(e.target.value)}
          autoFocus
          className="w-full rounded-xl border border-white/12 bg-white/[0.06] px-4 py-3 text-center text-sm tracking-widest text-white outline-none transition-all focus:border-emerald-300/50 focus:ring-4 focus:ring-emerald-300/10"
          placeholder="••••••••"
        />
        {error && <p className="mt-2 text-center text-[11.5px] font-bold text-red-300">{error}</p>}
        <button
          type="submit"
          disabled={busy || !key.trim()}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-emerald-400 to-emerald-300 py-3 text-[13.5px] font-black text-[oklch(0.2_0.03_262)] shadow-lg shadow-emerald-400/25 transition-all hover:brightness-110 disabled:opacity-40 cursor-pointer"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          ورود به پنل
        </button>
        <p className="mt-4 text-center text-[10.5px] leading-5 text-white/30">
          <ShieldCheck className="mr-1 inline h-3 w-3 align-[-2px]" />
          کلید مدیریت محرمانه است و فقط نزد مدیر سایت
          <br />
          بعد از ۵ تلاش ناموفق، ورود موقتاً قفل می‌شود
        </p>
      </motion.form>
    </div>
  );
}

/* ─────────── داشبورد ─────────── */

function Dashboard({ overview, content, go }: { overview: Overview; content: SiteContent; go: (t: TabId) => void }) {
  const c = overview.counts;
  const maxWords = Math.max(...overview.volume.map((v) => v.words), 1);
  const v = overview.visits;
  return (
    <div className="space-y-5">
      {/* نوار بازدیدکنندگان */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="glass-dark relative overflow-hidden rounded-3xl p-5"
      >
        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-emerald-300/8 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/25 to-gold/25">
              <Eye className="h-5 w-5 text-emerald-200" />
            </span>
            <div>
              <h3 className="text-[14px] font-black text-white">بازدیدکنندگان سایت</h3>
              <p className="mt-0.5 text-[10.5px] text-white/40">آمار زنده از ورود واقعی کاربران به صفحات</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {[
              { label: "امروز", value: v.today },
              { label: "۷ روز اخیر", value: v.week },
              { label: "کل بازدید", value: v.total },
              { label: "بازدیدکننده یکتا", value: v.unique },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-black tabular-nums text-white">{faNum(s.value)}</p>
                <p className="text-[10px] font-bold text-white/40">{s.label}</p>
              </div>
            ))}
            <button
              type="button"
              onClick={() => go("analytics")}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-2.5 text-[12px] font-black text-emerald-100 transition-colors hover:bg-emerald-300/20 cursor-pointer"
            >
              <TrendingUp className="h-4 w-4" />
              گزارش گرافیکی بازدید ←
            </button>
          </div>
        </div>
      </motion.section>

      {/* KPIها */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <Kpi icon={Scissors} label="خدمات" value={faNum(c.services)} sub={`${faNum(c.brands)} برند ایمپلنت`} delay={0} />
        <Kpi icon={Images} label="نمونه کار + گالری" value={faNum(c.works + c.gallery)} sub={`${faNum(c.images)} تصویر`} tone="gold" delay={0.05} />
        <Kpi icon={Star} label="نظرات واقعی" value={faNum(c.reviews)} sub={`${content.site.rating.score} در گوگل`} tone="violet" delay={0.1} />
        <Kpi icon={CircleHelp} label="سوالات متداول" value={faNum(c.faq)} sub={`${faNum(c.priceRows)} ردیف تعرفه`} delay={0.15} />
        <Kpi icon={FileText} label="مقالات بلاگ" value={faNum(c.blog)} sub={`${faNum(overview.totalWords)} کلمه کل سایت`} tone="gold" delay={0.2} />
        <Kpi icon={BellRing} label="درخواست جدید" value={faNum(overview.requests.new)} sub={`از ${faNum(overview.requests.total)} درخواست`} tone="violet" delay={0.25} />
      </div>

      {/* نمودارها */}
      <div className="grid gap-4 xl:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-dark rounded-3xl p-5 xl:col-span-2"
        >
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[13px] font-black text-white">۱۴ روز اخیر — درخواست تماس و فعالیت پنل</h3>
            <span className="flex items-center gap-3 text-[10.5px] text-white/40">
              <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-emerald-300" /> درخواست</span>
              <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-gold" /> فعالیت</span>
            </span>
          </div>
          <ActivityArea data={overview.series} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="glass-dark flex flex-col items-center rounded-3xl p-5"
        >
          <h3 className="mb-2 self-start text-[13px] font-black text-white">امتیاز سلامت سایت</h3>
          <ScoreRing score={overview.health.score} />
          <button
            type="button"
            onClick={() => go("tests")}
            className="mt-2 rounded-xl border border-white/15 px-4 py-2 text-[11.5px] font-bold text-white/65 transition-colors hover:bg-white/8 hover:text-white cursor-pointer"
          >
            اجرای تست کامل سایت
          </button>
        </motion.section>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-dark rounded-3xl p-5"
        >
          <h3 className="mb-3 text-[13px] font-black text-white">توزیع حجم محتوا</h3>
          <DistributionDonut data={overview.volume.slice(0, 6)} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="glass-dark rounded-3xl p-5"
        >
          <h3 className="mb-3 text-[13px] font-black text-white">بزرگ‌ترین بخش‌های محتوا</h3>
          <VolumeBars data={overview.volume.slice(0, 5)} max={maxWords} />
          <button
            type="button"
            onClick={() => go("reports")}
            className="mt-4 text-[11.5px] font-bold text-emerald-300 hover:text-emerald-200 cursor-pointer"
          >
            مشاهده گزارش کامل سئو ←
          </button>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass-dark rounded-3xl p-5"
        >
          <h3 className="mb-3 text-[13px] font-black text-white">آخرین فعالیت‌ها</h3>
          {overview.activity.length === 0 ? (
            <p className="py-6 text-center text-[12px] text-white/35">هنوز فعالیتی ثبت نشده</p>
          ) : (
            <ul className="space-y-2.5">
              {overview.activity.slice(0, 5).map((a) => (
                <li key={a.id} className="rounded-xl bg-white/[0.04] px-3 py-2.5">
                  <p className="text-[11.5px] font-bold leading-5 text-white/75">{a.summary}</p>
                  <p className="mt-0.5 text-[10px] text-white/35">{faTimeAgo(a.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => go("activity")}
            className="mt-3 text-[11.5px] font-bold text-emerald-300 hover:text-emerald-200 cursor-pointer"
          >
            تایم‌لاین کامل ←
          </button>
        </motion.section>
      </div>

      {/* آخرین درخواست‌ها */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.55 }}
        className="glass-dark rounded-3xl p-5"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[13px] font-black text-white">آخرین درخواست‌های مشاوره</h3>
          <button type="button" onClick={() => go("requests")} className="text-[11.5px] font-bold text-emerald-300 hover:text-emerald-200 cursor-pointer">
            مدیریت درخواست‌ها ←
          </button>
        </div>
        {overview.requests.latest.length === 0 ? (
          <p className="py-6 text-center text-[12px] text-white/35">هنوز درخواستی از فرم تماس ثبت نشده است</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {overview.requests.latest.map((r, i) => (
              <div key={i} className="rounded-2xl bg-white/[0.04] px-4 py-3">
                <p className="text-[12.5px] font-bold text-white/85">{r.name}</p>
                <p className="mt-0.5 text-[11px] text-white/45">{r.service}</p>
                <p className="mt-0.5 text-[10px] text-white/30">{faTimeAgo(r.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}

/* ─────────── اپ اصلی پنل ─────────── */

export function AdminApp() {
  const [authed, setAuthed] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [tab, setTab] = React.useState<TabId>("dashboard");
  const [overview, setOverview] = React.useState<Overview | null>(null);
  const [content, setContent] = React.useState<SiteContent | null>(null);
  const [overrides, setOverrides] = React.useState<{ key: string; updatedAt: string }[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [dataVersion, setDataVersion] = React.useState(0);
  const [clock, setClock] = React.useState(() =>
    new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date())
  );
  const [toasts, setToasts] = React.useState<{ id: number; msg: string; kind: "ok" | "err" }[]>([]);

  const toast = React.useCallback((msg: string, kind: "ok" | "err" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);

  const loadAll = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const [o, c] = await Promise.all([
        api<Overview>("/api/admin/overview"),
        api<{ content: SiteContent; overrides: { key: string; updatedAt: string }[] }>("/api/admin/content"),
      ]);
      setOverview(o);
      setContent(c.content);
      setOverrides(c.overrides);
      setDataVersion((v) => v + 1);
    } catch (e) {
      toast(e instanceof Error ? e.message : "خطا در بارگذاری داده", "err");
    } finally {
      setRefreshing(false);
    }
  }, [toast]);

  // احراز هویت اولیه با کلید ذخیره‌شده — غیرهمگام (بدون setState همگام در اثر)
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    let alive = true;
    const validate = async () => {
      if (getKey()) {
        try {
          await api("/api/admin/overview");
          if (alive) setAuthed(true);
        } catch {
          clearKey();
        }
      }
      if (alive) setChecked(true);
    };
    const t = setTimeout(validate, 0);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, []);

  React.useEffect(() => {
    if (!authed) return;
    let alive = true;
    (async () => {
      // بعد از میکروتسک — بدون setState همگام در بدنه اثر
      await Promise.resolve();
      if (alive) await loadAll();
    })();
    return () => {
      alive = false;
    };
  }, [authed, loadAll]);

  // ساعت زنده — فقط با تایمر (بدون فراخوانی همگام اولیه)
  React.useEffect(() => {
    const fmt = new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const t = setInterval(() => setClock(fmt.format(new Date())), 1000);
    return () => clearInterval(t);
  }, []);

  if (!checked) {
    return (
      <div className="admin-root flex min-h-screen items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-emerald-300/60" />
      </div>
    );
  }

  if (!authed) return (
    <div className="admin-root">
      <LoginGate onOk={() => setAuthed(true)} />
    </div>
  );

  const images: string[] = [];
  if (content) {
    const walk = (v: unknown) => {
      if (typeof v === "string" && v.startsWith("/uploads/")) images.push(v);
      else if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") Object.values(v).forEach(walk);
    };
    walk(content);
  }

  return (
    <div className="admin-root relative flex min-h-screen flex-col">
      <Toasts items={toasts} />

      {/* چیدمان دسکتاپ: سایدبار + محتوا */}
      <div className="flex flex-1">
        {/* سایدبار */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-l border-white/8 bg-[oklch(0.15_0.022_262/0.7)] p-4 backdrop-blur-xl lg:flex">
          <div className="mb-6 flex items-center gap-2.5 px-1">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/25 to-gold/25">
              <Stethoscope className="h-5 w-5 text-emerald-200" />
            </span>
            <div>
              <p className="text-[13px] font-black text-white">پنل مدیریت</p>
              <p className="text-[10px] text-white/40">دکتر پدرام بخشایی</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1" aria-label="ناوبری پنل">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[12.5px] font-bold transition-colors cursor-pointer",
                    active ? "text-emerald-100" : "text-white/55 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="admin-pill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-l from-emerald-300/20 to-transparent shadow-[inset_0_0_0_1px] shadow-emerald-300/25"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <t.icon className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">{t.label}</span>
                  {t.id === "requests" && overview && overview.requests.new > 0 && (
                    <span className="relative z-10 ml-auto rounded-full bg-emerald-300/20 px-1.5 text-[10px] font-black tabular-nums text-emerald-100">
                      {faNum(overview.requests.new)}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          <div className="space-y-1 border-t border-white/8 pt-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[12.5px] font-bold text-white/55 transition-colors hover:bg-white/5 hover:text-white cursor-pointer"
            >
              <ExternalLink className="h-4 w-4" />
              مشاهده سایت
            </a>
            <button
              type="button"
              onClick={() => {
                clearKey();
                setAuthed(false);
                setOverview(null);
                setContent(null);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[12.5px] font-bold text-white/55 transition-colors hover:bg-red-400/10 hover:text-red-200 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              خروج
            </button>
          </div>
        </aside>

        {/* ستون اصلی */}
        <div className="min-w-0 flex-1">
          {/* نوار بالا */}
          <header className="sticky top-0 z-40 border-b border-white/8 bg-[oklch(0.15_0.022_262/0.75)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-slim lg:hidden">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-bold transition-colors cursor-pointer",
                      tab === t.id ? "bg-emerald-300/15 text-emerald-100" : "text-white/50 hover:bg-white/5"
                    )}
                  >
                    <t.icon className="h-3.5 w-3.5" />
                    {t.label}
                  </button>
                ))}
              </div>
              <h1 className="hidden text-[15px] font-black text-white lg:block">
                {TABS.find((t) => t.id === tab)?.label}
              </h1>
              <div className="flex shrink-0 items-center gap-2">
                <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold tabular-nums text-white/60 sm:block">
                  {clock}
                </span>
                <button
                  type="button"
                  onClick={loadAll}
                  aria-label="بارگذاری مجدد"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/55 transition-colors hover:bg-white/8 hover:text-white cursor-pointer"
                >
                  <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6">
            {!overview || !content ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-emerald-300/60" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {tab === "dashboard" && <Dashboard overview={overview} content={content} go={setTab} />}
                  {tab === "agents" && <AgentsTab toast={toast} />}
                  {tab === "analytics" && <AnalyticsTab toast={toast} refreshKey={dataVersion} />}
                  {tab === "content" && (
                    <ContentTab content={content} overrides={overrides} onSaved={setContent} toast={toast} />
                  )}
                  {tab === "media" && <MediaTab toast={toast} />}
                  {tab === "blog" && <BlogTab content={content} onSaved={setContent} toast={toast} />}
                  {tab === "requests" && <RequestsTab toast={toast} refreshKey={dataVersion} />}
                  {tab === "reports" && <ReportsTab overview={overview} content={content} />}
                  {tab === "tests" && <TestsTab overview={overview} contentImages={[...new Set(images)]} toast={toast} />}
                  {tab === "activity" && <ActivityTab overview={overview} />}
                </motion.div>
              </AnimatePresence>
            )}
          </main>

          {/* فوتر چسبان پنل */}
          <footer className="mt-auto border-t border-white/8 py-4 text-center text-[10.5px] text-white/30">
            پنل مدیریت سایت دکتر پدرام بخشایی — نسخه ۱٫۰ · محتوا، گزارش و تست در یک‌جا
          </footer>
        </div>
      </div>
    </div>
  );
}
