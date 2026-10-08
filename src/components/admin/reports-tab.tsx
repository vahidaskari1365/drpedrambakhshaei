"use client";

/** تب «گزارش‌ها» — چک‌لیست سئو/محتوا، کلیدواژه‌های بلاگ و لایه اسکیمای ساختاریافته */
import * as React from "react";
import { CheckCircle2, XCircle, AlertTriangle, Search, Braces, Bot, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { faNum, type Overview } from "./shared";
import { VolumeBars } from "./charts";
import type { SiteContent } from "@/lib/site-content";

export function ReportsTab({ overview, content }: { overview: Overview | null; content: SiteContent | null }) {
  if (!overview || !content) {
    return <p className="p-8 text-center text-sm text-white/40">در حال بارگذاری گزارش...</p>;
  }

  const maxWords = Math.max(...overview.volume.map((v) => v.words), 1);

  // کلیدواژه‌ها و محل استفاده در مقالات — پوشش در تیترها مهم‌ترین سیگنال است
  const keywordRows = content.blog.flatMap((a) => {
    const h2Texts = a.blocks.filter((b) => b.type === "h2").map((b) => (b as { text: string }).text);
    const qaTexts = a.quickAnswers.map((q) => q.q);
    return a.keywords.map((kw) => ({
      keyword: kw,
      article: a.h1,
      inTitle: a.metaTitle.includes(kw) || a.h1.includes(kw),
      inH2: h2Texts.some((h) => h.includes(kw)),
      inQA: qaTexts.some((q) => q.includes(kw)),
    }));
  });

  const coverage = keywordRows.length
    ? Math.round((keywordRows.filter((r) => r.inTitle || r.inH2 || r.inQA).length / keywordRows.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* امتیاز و چک‌لیست سلامت */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-4 flex items-center gap-2 text-[13px] font-black text-white">
            <Search className="h-4 w-4 text-gold" />
            چک‌لیست سلامت محتوا و سئو
          </h3>
          <div className="space-y-2">
            {overview.health.checks.map((c) => (
              <div
                key={c.id}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border px-4 py-3",
                  c.pass ? "border-teal-300/15 bg-teal-300/[0.05]" : c.warn ? "border-gold/25 bg-gold/[0.06]" : "border-red-400/25 bg-red-400/[0.06]"
                )}
              >
                {c.pass ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
                ) : c.warn ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                )}
                <div>
                  <p className="text-[12.5px] font-bold text-white/90">{c.label}</p>
                  <p className="mt-0.5 text-[11.5px] text-white/45">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-4">
          {/* اسکیما */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="mb-3 flex items-center gap-2 text-[13px] font-black text-white">
              <Braces className="h-4 w-4 text-violet-300" />
              لایه اسکیمای JSON-LD
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {overview.seo.jsonLdTypes.map((t) => (
                <span key={t} className="rounded-lg bg-violet-300/10 px-2.5 py-1 text-[10.5px] font-bold text-violet-200" dir="ltr">
                  {t}
                </span>
              ))}
            </div>
          </section>

          {/* GEO */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="mb-3 flex items-center gap-2 text-[13px] font-black text-white">
              <Bot className="h-4 w-4 text-teal-300" />
              آمادگی GEO / AEO
            </h3>
            <ul className="space-y-2.5 text-[12px] text-white/65">
              <li className="flex justify-between"><span>کرالرهای AI مجاز (robots)</span><b className="text-teal-200">{faNum(overview.seo.aiCrawlers)}</b></li>
              <li className="flex justify-between"><span>URLهای sitemap</span><b className="text-teal-200">{faNum(overview.seo.sitemapUrls)}</b></li>
              <li className="flex justify-between"><span>llms.txt + llms-full.txt</span><b className="text-teal-200">فعال</b></li>
              <li className="flex justify-between"><span>پاسخ سریع در مقالات</span><b className="text-teal-200">{faNum(content.blog.reduce((a, x) => a + x.quickAnswers.length, 0))} نکته</b></li>
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="mb-3 flex items-center gap-2 text-[13px] font-black text-white">
              <Map className="h-4 w-4 text-amber-300" />
              حجم محتوا (کلمه)
            </h3>
            <VolumeBars data={overview.volume.slice(0, 6)} max={maxWords} />
            <p className="mt-3 text-[11px] text-white/40">
              جمع کل: <b className="text-white/70">{faNum(overview.totalWords)}</b> کلمه در {faNum(overview.volume.length)} مجموعه
            </p>
          </section>
        </div>
      </div>

      {/* کلیدواژه‌ها */}
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-[13px] font-black text-white">
            <Search className="h-4 w-4 text-gold" />
            کلیدواژه‌های هدف بلاگ
          </h3>
          <span className="rounded-full bg-teal-300/10 px-3 py-1 text-[11px] font-bold text-teal-200">
            پوشش در تیترها/پاسخ‌ها: {faNum(coverage)}٪
          </span>
        </div>
        <div className="overflow-x-auto scrollbar-slim">
          <table className="w-full min-w-[640px] text-right">
            <thead>
              <tr className="border-b border-white/10 text-[10.5px] text-white/40">
                <th className="px-3 py-2.5 font-bold">کلیدواژه</th>
                <th className="px-3 py-2.5 font-bold">مقاله</th>
                <th className="px-3 py-2.5 font-bold">عنوان</th>
                <th className="px-3 py-2.5 font-bold">H2</th>
                <th className="px-3 py-2.5 font-bold">پاسخ سریع</th>
              </tr>
            </thead>
            <tbody>
              {keywordRows.map((r, i) => (
                <tr key={i} className="border-b border-white/5 text-[12px] transition-colors hover:bg-white/[0.04]">
                  <td className="px-3 py-2.5 font-bold text-white/85">{r.keyword}</td>
                  <td className="line-clamp-1 max-w-[280px] px-3 py-2.5 text-white/50">{r.article}</td>
                  {[r.inTitle, r.inH2, r.inQA].map((ok, j) => (
                    <td key={j} className="px-3 py-2.5">
                      {ok ? <CheckCircle2 className="h-4 w-4 text-teal-300" /> : <span className="text-white/15">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
