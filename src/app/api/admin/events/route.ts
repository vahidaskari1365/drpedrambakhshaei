import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** برچسب فارسی منشأ رویدادها */
const SOURCE_LABELS: Record<string, string> = {
  hero: "صفحه اصلی (Hero)",
  article: "پایین مقاله‌ها",
  prices: "صفحه تعرفه‌ها",
  landing: "صفحات خدماتی",
  landing_nap: "صفحات خدماتی (بلوک آدرس)",
  dock: "داک شناور تماس",
  navbar: "دکمه تماس نوبار",
  navbar_mobile: "منوی موبایل",
  footer: "فوتر",
  booking_modal: "داخل پنجره نوبت",
};

function sourceLabel(s: string): string {
  if (SOURCE_LABELS[s]) return SOURCE_LABELS[s];
  return s ? `سایر (${s})` : "نامشخص";
}

/** برچسب فارسی نوع رویداد */
export const EVENT_TYPE_LABELS: Record<string, string> = {
  booking_modal_open: "باز شدن پنجره نوبت",
  booking_platform_click: "انتخاب پلتفرم نوبت",
  call_click: "کلیک تماس",
};

/**
 * آمار کامل نوبت‌دهی و تماس — سوخت تب «نوبت و تماس» پنل
 * KPI، سری ۳۰ روزه، تفکیک پلتفرم، منشأها و آخرین رویدادها
 */
export async function GET(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;

  try {
    const now = new Date();
    const startToday = new Date(now);
    startToday.setHours(0, 0, 0, 0);
    const start30 = new Date(startToday);
    start30.setDate(start30.getDate() - 29);

    const [
      modalOpenAll,
      modalOpenToday,
      doctoretoAll,
      nobatAll,
      doctoretoToday,
      nobatToday,
      callsAll,
      callsToday,
      formRequestsAll,
      formRequestsToday,
    ] = await Promise.all([
      db.trackEvent.count({ where: { type: "booking_modal_open" } }),
      db.trackEvent.count({ where: { type: "booking_modal_open", createdAt: { gte: startToday } } }),
      db.trackEvent.count({ where: { type: "booking_platform_click", platform: "doctoreto" } }),
      db.trackEvent.count({ where: { type: "booking_platform_click", platform: "nobat" } }),
      db.trackEvent.count({
        where: { type: "booking_platform_click", platform: "doctoreto", createdAt: { gte: startToday } },
      }),
      db.trackEvent.count({
        where: { type: "booking_platform_click", platform: "nobat", createdAt: { gte: startToday } },
      }),
      db.trackEvent.count({ where: { type: "call_click" } }),
      db.trackEvent.count({ where: { type: "call_click", createdAt: { gte: startToday } } }),
      db.contactRequest.count(),
      db.contactRequest.count({ where: { createdAt: { gte: startToday } } }),
    ]);

    const rows30 = await db.trackEvent.findMany({
      where: { createdAt: { gte: start30 } },
      select: { type: true, platform: true, source: true, path: true, createdAt: true },
    });

    // ─── سری ۳۰ روزه: باز شدن پنجره، انتخاب پلتفرم، کلیک تماس ───
    const fmt = new Intl.DateTimeFormat("fa-IR", { month: "short", day: "numeric" });
    const days: { iso: string; label: string; opens: number; clicks: number; calls: number }[] = [];
    const dayIndex = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(startToday);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      dayIndex.set(iso, days.length);
      days.push({ iso, label: fmt.format(d), opens: 0, clicks: 0, calls: 0 });
    }
    for (const r of rows30) {
      const iso = new Date(r.createdAt).toISOString().slice(0, 10);
      const idx = dayIndex.get(iso);
      if (idx === undefined) continue;
      if (r.type === "booking_modal_open") days[idx].opens += 1;
      else if (r.type === "booking_platform_click") days[idx].clicks += 1;
      else if (r.type === "call_click") days[idx].calls += 1;
    }

    // ─── تفکیک منشأ (کل دوره) ───
    const allRows = await db.trackEvent.findMany({ select: { type: true, source: true } });
    const srcCount = new Map<string, number>();
    for (const r of allRows) {
      const label = sourceLabel(r.source);
      srcCount.set(label, (srcCount.get(label) ?? 0) + 1);
    }
    const sources = [...srcCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7).map(([label, count]) => ({ label, count }));

    // ─── آخرین رویدادها ───
    const recent = await db.trackEvent.findMany({ orderBy: { createdAt: "desc" }, take: 24 });

    const platformClicks = doctoretoAll + nobatAll;
    const conversion = modalOpenAll > 0 ? Math.round((platformClicks / modalOpenAll) * 100) : 0;

    return NextResponse.json({
      generatedAt: now.toISOString(),
      totals: {
        modalOpenAll,
        modalOpenToday,
        doctoretoAll,
        nobatAll,
        doctoretoToday,
        nobatToday,
        callsAll,
        callsToday,
        formRequestsAll,
        formRequestsToday,
        platformClicks,
        conversion,
      },
      daily: days,
      platforms: [
        { label: "دکترتو", value: doctoretoAll },
        { label: "نوبت.آی‌آر", value: nobatAll },
      ],
      sources,
      recent: recent.map((r) => ({
        id: r.id,
        type: r.type,
        typeLabel: EVENT_TYPE_LABELS[r.type] ?? r.type,
        platform: r.platform,
        source: sourceLabel(r.source),
        path: r.path,
        createdAt: r.createdAt,
      })),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "خطای سرور در آمار رویدادها" },
      { status: 500 }
    );
  }
}
