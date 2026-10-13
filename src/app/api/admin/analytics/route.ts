import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** برچسب فارسی مسیرها برای نمودارها */
const PATH_LABELS: Record<string, string> = {
  "/": "صفحه اصلی",
  "/services": "خدمات",
  "/gallery": "نمونه کارها",
  "/about": "درباره من",
  "/prices": "تعرفه‌ها",
  "/faq": "سوالات متداول",
  "/reviews": "نظرات بیماران",
  "/blog": "بلاگ",
  "/contact": "تماس و نوبت",
};

function pathLabel(p: string): string {
  if (PATH_LABELS[p]) return PATH_LABELS[p];
  if (p.startsWith("/blog/")) {
    const slug = decodeURIComponent(p.replace("/blog/", ""));
    return `مقاله: ${slug.length > 16 ? slug.slice(0, 16) + "…" : slug}`;
  }
  return p;
}

function referrerLabel(ref: string): string {
  if (!ref) return "ورود مستقیم";
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    if (host.includes("google")) return "جستجوی گوگل";
    if (host.includes("instagram")) return "اینستاگرام";
    if (host.includes("t.me") || host.includes("telegram")) return "تلگرام";
    if (host.includes("doctoreto")) return "دکترتو";
    if (host.includes("paziresh24")) return "پذیرش۲۴";
    if (host.includes("aparat")) return "آپارات";
    return host;
  } catch {
    return "سایر";
  }
}

/**
 * آمار کامل بازدیدکنندگان — سوخت تب «بازدیدها» پنل
 * KPI، سری ۳۰ روزه، صفحات پربازدید، دستگاه‌ها، ساعات، ارجاع‌دهنده‌ها و آخرین بازدیدها
 */
export async function GET(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;

  try {
    const now = new Date();
    const startToday = new Date(now);
    startToday.setHours(0, 0, 0, 0);
    const startYesterday = new Date(startToday);
    startYesterday.setDate(startYesterday.getDate() - 1);
    const start7 = new Date(startToday);
    start7.setDate(start7.getDate() - 6);
    const start30 = new Date(startToday);
    start30.setDate(start30.getDate() - 29);

    const [totalAll, today, yesterday, week, distinctRows, recent] = await Promise.all([
      db.visit.count(),
      db.visit.count({ where: { createdAt: { gte: startToday } } }),
      db.visit.count({ where: { createdAt: { gte: startYesterday, lt: startToday } } }),
      db.visit.count({ where: { createdAt: { gte: start7 } } }),
      db.visit.findMany({ where: { vid: { not: "" } }, distinct: ["vid"], select: { vid: true } }),
      db.visit.findMany({ orderBy: { createdAt: "desc" }, take: 12 }),
    ]);

    const month = await db.visit.findMany({
      where: { createdAt: { gte: start30 } },
      select: { path: true, vid: true, device: true, referrer: true, createdAt: true },
    });

    // ─── سری ۳۰ روزه ───
    const fmt = new Intl.DateTimeFormat("fa-IR", { month: "short", day: "numeric" });
    const days: { iso: string; label: string; visits: number; uniques: number }[] = [];
    const dayIndex = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(startToday);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      dayIndex.set(iso, days.length);
      days.push({ iso, label: fmt.format(d), visits: 0, uniques: 0 });
    }
    const uniquePerDay = new Map<string, Set<string>>();
    for (const v of month) {
      const iso = new Date(v.createdAt).toISOString().slice(0, 10);
      const idx = dayIndex.get(iso);
      if (idx === undefined) continue;
      days[idx].visits += 1;
      if (v.vid) {
        const set = uniquePerDay.get(iso) ?? new Set<string>();
        set.add(v.vid);
        uniquePerDay.set(iso, set);
      }
    }
    for (const [iso, set] of uniquePerDay) {
      const idx = dayIndex.get(iso);
      if (idx !== undefined) days[idx].uniques = set.size;
    }

    // ─── صفحات پربازدید ───
    const pathCount = new Map<string, number>();
    for (const v of month) pathCount.set(v.path, (pathCount.get(v.path) ?? 0) + 1);
    const topPaths = [...pathCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([p, count]) => ({ path: p, label: pathLabel(p), count }));

    // ─── دستگاه‌ها ───
    const deviceCount = { desktop: 0, mobile: 0, tablet: 0 };
    for (const v of month) {
      if (v.device === "mobile") deviceCount.mobile += 1;
      else if (v.device === "tablet") deviceCount.tablet += 1;
      else deviceCount.desktop += 1;
    }

    // ─── توزیع ساعتی ───
    const hours = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      label: `${h.toLocaleString("fa-IR")}:۰۰`,
      count: 0,
    }));
    for (const v of month) hours[new Date(v.createdAt).getHours()].count += 1;

    // ─── ارجاع‌دهنده‌ها ───
    const refCount = new Map<string, number>();
    for (const v of month) {
      const label = referrerLabel(v.referrer);
      refCount.set(label, (refCount.get(label) ?? 0) + 1);
    }
    const referrers = [...refCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, count]) => ({ label, count }));

    return NextResponse.json({
      generatedAt: now.toISOString(),
      totals: {
        today,
        yesterday,
        week,
        month: month.length,
        all: totalAll,
        unique: distinctRows.length,
      },
      daily: days,
      topPaths,
      devices: [
        { label: "موبایل", value: deviceCount.mobile },
        { label: "دسکتاپ", value: deviceCount.desktop },
        { label: "تبلت", value: deviceCount.tablet },
      ],
      hours,
      referrers,
      recent: recent.map((v) => ({
        path: v.path,
        label: pathLabel(v.path),
        device: v.device,
        referrer: referrerLabel(v.referrer),
        createdAt: v.createdAt,
      })),
    });
  } catch (e) {
    console.error("[admin/analytics]", e);
    return NextResponse.json({ error: "خطا در ساخت آمار بازدید" }, { status: 500 });
  }
}
