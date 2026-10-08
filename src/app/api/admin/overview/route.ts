import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { computeHealth, collectImages } from "@/lib/health";
import { getOverridesMap } from "@/lib/content-store";
import { CONTENT_KEYS, CONTENT_LABELS, countWords } from "@/lib/site-content";
import sitemapFn from "@/app/sitemap";

export const dynamic = "force-dynamic";

/** خروجی کلی داشبورد: شمارنده‌ها، سری‌های نمودار، سلامت محتوا، سئو */
export async function GET(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;

  try {
    const { score, checks, content } = await computeHealth();
    const { meta: overrides } = await getOverridesMap();

    // ─── شمارنده مجموعه‌ها ───
    const counts = {
      services: content.services.length,
      works: content.works.length,
      gallery: content.gallery.length,
      reviews: content.reviews.length,
      faq: content.faq.length + content.priceFaqs.length,
      priceRows: content.priceTabs.reduce((a, t) => a + t.rows.length, 0),
      priceExtras: content.priceTabs.reduce((a, t) => a + t.extras.length, 0),
      blog: content.blog.length,
      credentials: content.credentials.length,
      brands: content.implantBrands.length,
      images: collectImages(content).length,
    };

    const volume = CONTENT_KEYS.map((key) => ({
      key,
      label: CONTENT_LABELS[key],
      words: countWords(content[key]),
    })).sort((a, b) => b.words - a.words);
    const totalWords = volume.reduce((a, v) => a + v.words, 0);

    // ─── درخواست‌های تماس ───
    const requests = await db.contactRequest.findMany({ orderBy: { createdAt: "desc" } });
    const byStatus = { new: 0, contacted: 0, done: 0, archived: 0 };
    const byService = new Map<string, number>();
    for (const r of requests) {
      byStatus[r.status as keyof typeof byStatus] = (byStatus[r.status as keyof typeof byStatus] ?? 0) + 1;
      byService.set(r.service, (byService.get(r.service) ?? 0) + 1);
    }

    // ─── سری ۱۴ روز اخیر برای نمودارها ───
    const days: { iso: string; label: string; requests: number; activity: number }[] = [];
    const fmt = new Intl.DateTimeFormat("fa-IR", { month: "short", day: "numeric" });
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push({
        iso: d.toISOString().slice(0, 10),
        label: fmt.format(d),
        requests: 0,
        activity: 0,
      });
    }
    const dayIndex = new Map(days.map((d, i) => [d.iso, i]));
    for (const r of requests) {
      const idx = dayIndex.get(new Date(r.createdAt).toISOString().slice(0, 10));
      if (idx !== undefined) days[idx].requests += 1;
    }
    const logs = await db.activityLog.findMany({ where: { createdAt: { gte: new Date(Date.now() - 14 * 864e5) } } });
    for (const l of logs) {
      const idx = dayIndex.get(new Date(l.createdAt).toISOString().slice(0, 10));
      if (idx !== undefined) days[idx].activity += 1;
    }

    // ─── سئو ───
    let sitemapUrls = 0;
    try {
      sitemapUrls = (await sitemapFn()).length;
    } catch {
      sitemapUrls = 0;
    }
    const seo = {
      sitemapUrls,
      aiCrawlers: 14,
      jsonLdTypes: ["Physician", "WebSite", "MedicalWebPage", "FAQPage", "BreadcrumbList", "OfferCatalog", "Blog", "MedicalClinic"],
      healthScore: score,
    };

    const lastLogs = await db.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 });

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      counts,
      totalWords,
      volume,
      overrides,
      requests: {
        total: requests.length,
        ...byStatus,
        byService: [...byService.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
        latest: requests.slice(0, 5).map((r) => ({ name: r.name, service: r.service, createdAt: r.createdAt })),
      },
      series: days,
      health: { score, checks },
      seo,
      activity: lastLogs.map((l) => ({
        id: l.id,
        kind: l.kind,
        entity: l.entity,
        summary: l.summary,
        createdAt: l.createdAt,
      })),
    });
  } catch (e) {
    console.error("[admin/overview]", e);
    return NextResponse.json({ error: "خطا در ساخت گزارش داشبورد" }, { status: 500 });
  }
}
