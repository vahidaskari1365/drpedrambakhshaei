"use client";

/**
 * تب «تست سایت» — تست جامع دو لایه‌ای:
 * ۱) باتری سمت سرور (دیتابیس، محتوا، تصاویر، سئو، اسکیما، سایت‌مپ)
 * ۲) پروب سمت مرورگر (۲۰۰ همه روت‌ها با محتوای موردانتظار + تصاویر + قفل ۴۰۱ پنل)
 */
import * as React from "react";
import { Play, Loader2, CheckCircle2, XCircle, ExternalLink, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { api, faNum, type TestResult, type TestRow, type Overview } from "./shared";
import { ScoreRing } from "./charts";

interface RouteProbe {
  path: string;
  marker?: string;
  label: string;
}

const ROUTES: RouteProbe[] = [
  { path: "/", marker: "جراحی", label: "صفحه اصلی (هیرو)" },
  { path: "/services", marker: "ارتوسرجری", label: "خدمات" },
  { path: "/gallery", marker: "نمونه کارها", label: "گالری" },
  { path: "/about", marker: "المپیاد", label: "درباره دکتر" },
  { path: "/prices", marker: "تعرفه", label: "تعرفه‌ها" },
  { path: "/faq", marker: "سوالات", label: "سوالات متداول" },
  { path: "/blog", marker: "بلاگ", label: "فهرست مقالات" },
  { path: "/blog/orthognathic-surgery-guide", marker: "نقاهت", label: "مقاله ارتوگناتیک" },
  { path: "/reviews", marker: "تجربه واقعی", label: "نظرات" },
  { path: "/contact", marker: "رزرو نوبت", label: "تماس و رزرو" },
  { path: "/sitemap.xml", label: "sitemap.xml" },
  { path: "/robots.txt", marker: "Sitemap", label: "robots.txt" },
  { path: "/llms.txt", marker: "دکتر پدرام بخشایی", label: "llms.txt (GEO)" },
  { path: "/admin", marker: "پنل مدیریت", label: "ورود پنل ادمین" },
];

export function TestsTab({
  overview,
  contentImages,
  toast,
}: {
  overview: Overview | null;
  contentImages: string[];
  toast: (msg: string, kind?: "ok" | "err") => void;
}) {
  const [running, setRunning] = React.useState(false);
  const [serverRows, setServerRows] = React.useState<TestRow[] | null>(null);
  const [browserRows, setBrowserRows] = React.useState<TestRow[] | null>(null);
  const [progress, setProgress] = React.useState("");

  const run = async () => {
    setRunning(true);
    setServerRows(null);
    setBrowserRows(null);
    try {
      setProgress("اجرای باتری سرور (دیتابیس، محتوا، سئو)...");
      const server = await api<TestResult>("/api/admin/test", { method: "POST" });
      setServerRows(server.rows);

      // پروب روت‌ها
      const rows: TestRow[] = [];
      setProgress("بررسی پاسخ و محتوای ۱۴ مسیر سایت...");
      for (const r of ROUTES) {
        const t0 = performance.now();
        try {
          const res = await fetch(r.path, { cache: "no-store" });
          const text = res.ok ? await res.text() : "";
          const ok = res.ok && (!r.marker || text.includes(r.marker));
          rows.push({
            id: `route-${r.path}`,
            group: "مسیرها",
            label: r.label,
            pass: ok,
            detail: ok
              ? `HTTP ${faNum(res.status)} — محتوای «${r.marker ?? "فایل"}» تأیید شد (${faNum(Math.round(performance.now() - t0))}ms)`
              : `HTTP ${faNum(res.status)}${r.marker && !text.includes(r.marker) ? ` — عبارت «${r.marker}» در صفحه نبود` : ""}`,
            ms: Math.round(performance.now() - t0),
          });
        } catch (e) {
          rows.push({
            id: `route-${r.path}`,
            group: "مسیرها",
            label: r.label,
            pass: false,
            detail: e instanceof Error ? e.message : "خطای شبکه",
            ms: Math.round(performance.now() - t0),
          });
        }
        setBrowserRows([...rows]);
      }

      // پروب تصاویر محتوا
      setProgress(`بررسی دسترس‌پذیری ${contentImages.length} تصویر محتوا...`);
      const imgs = contentImages.slice(0, 24);
      const imgResults = await Promise.all(
        imgs.map(async (p) => {
          const t0 = performance.now();
          try {
            const res = await fetch(p, { method: "HEAD", cache: "no-store" });
            return { p, ok: res.ok, ms: Math.round(performance.now() - t0) };
          } catch {
            return { p, ok: false, ms: Math.round(performance.now() - t0) };
          }
        })
      );
      const imgFail = imgResults.filter((r) => !r.ok);
      rows.push({
        id: "images-http",
        group: "تصاویر",
        label: "پاسخ HTTP تصاویر محتوا",
        pass: imgFail.length === 0,
        detail: imgFail.length
          ? `خطا در: ${imgFail.map((f) => f.p).join("، ")}`
          : `${faNum(imgResults.length)} تصویر همه ۲۰۰ برگرداندند`,
        ms: Math.max(...imgResults.map((r) => r.ms), 0),
      });
      setBrowserRows([...rows]);

      // قفل احراز هویت پنل — بدون کلید باید ۴۰۱ بدهد
      setProgress("بررسی قفل امنیتی API پنل...");
      const t0 = performance.now();
      const res = await fetch("/api/admin/content", { cache: "no-store" });
      rows.push({
        id: "auth-guard",
        group: "امنیت",
        label: "API ادمین بدون کلید بسته است",
        pass: res.status === 401,
        detail: res.status === 401 ? "پاسخ ۴۰۱ غیرمجاز — درست" : `وضعیت غیرمنتظره ${faNum(res.status)}`,
        ms: Math.round(performance.now() - t0),
      });
      setBrowserRows([...rows]);

      const total = server.rows.length + rows.length;
      const passed = server.rows.filter((r) => r.pass).length + rows.filter((r) => r.pass).length;
      toast(`تست کامل شد: ${passed} از ${total} موفق`, passed === total ? "ok" : "err");
    } catch (e) {
      toast(e instanceof Error ? e.message : "اجرای تست ناموفق بود", "err");
    } finally {
      setRunning(false);
      setProgress("");
    }
  };

  const allRows = [...(serverRows ?? []), ...(browserRows ?? [])];
  const passed = allRows.filter((r) => r.pass).length;
  const failed = allRows.length - passed;
  const groups = [...new Set(allRows.map((r) => r.group))];

  return (
    <div>
      <div className="mb-5 grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <ScoreRing score={allRows.length ? Math.round((passed / allRows.length) * 100) : 0} />
          <div className="mt-1 flex justify-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-teal-300">
              <CheckCircle2 className="h-3.5 w-3.5" /> {faNum(passed)} موفق
            </span>
            <span className="flex items-center gap-1.5 text-red-300">
              <XCircle className="h-3.5 w-3.5" /> {faNum(failed)} خطا
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-lg font-black text-white">تست جامع سایت</h2>
          <p className="mt-2 max-w-xl text-[13px] leading-7 text-white/55">
            زیرساخت (SQLite/Prisma)، سلامت {faNum(overview?.health.checks.length ?? 0)} بند محتوایی، فایل‌های سئو و GEO،
            اسکیماهای JSON-LD، سایت‌مپ، پاسخ و محتوای {faNum(ROUTES.length)} مسیر سایت، تصاویر محتوا و قفل امنیتی API —
            همه با یک دکمه.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={run}
              disabled={running}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-l from-teal-400 to-gold px-6 py-3 text-[13.5px] font-black text-[oklch(0.2_0.03_205)] shadow-xl shadow-gold/20 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {running ? "در حال اجرا..." : "اجرای تست کامل"}
            </button>
            {progress && <p className="text-[12px] font-bold text-gold">{progress}</p>}
          </div>
        </div>
      </div>

      {allRows.length > 0 && (
        <div className="space-y-5">
          {groups.map((g) => (
            <section key={g}>
              <h3 className="mb-2.5 px-1 text-[12px] font-black tracking-widest text-white/40">{g}</h3>
              <div className="space-y-2">
                {allRows
                  .filter((r) => r.group === g)
                  .map((r, i) => (
                    <motion.div
                      key={r.id + String(i)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.04 }}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border px-4 py-3",
                        r.pass ? "border-teal-300/15 bg-teal-300/[0.05]" : "border-red-400/25 bg-red-400/[0.06]"
                      )}
                    >
                      {r.pass ? (
                        <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-teal-300" />
                      ) : (
                        <XCircle className="h-4.5 w-4.5 shrink-0 text-red-300" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-bold text-white/90">{r.label}</p>
                        <p className={cn("mt-0.5 text-[11.5px]", r.pass ? "text-white/45" : "text-red-200/80")}>{r.detail}</p>
                      </div>
                      <span className="shrink-0 text-[10.5px] tabular-nums text-white/35">{faNum(r.ms)}ms</span>
                      {r.id.startsWith("route-") && !r.id.includes(".xml") && !r.id.includes(".txt") && (
                        <a
                          href={r.id.replace("route-", "")}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="باز کردن مسیر"
                          className="shrink-0 text-white/30 hover:text-teal-200 cursor-pointer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </motion.div>
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {!allRows.length && !running && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <ShieldCheck className="mx-auto mb-3 h-9 w-9 text-white/20" />
          <p className="text-sm text-white/50">برای شروع، دکمه «اجرای تست کامل» را بزنید.</p>
        </div>
      )}
    </div>
  );
}
