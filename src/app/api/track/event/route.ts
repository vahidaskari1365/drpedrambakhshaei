import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * ثبت رویداد تعاملی کاربر — نوبت‌دهی و تماس
 * بدون احراز هویت؛ سبک، مقاوم و ضد Flood (حداکثر ۶۰ رویداد در دقیقه از هر IP)
 * مسیرهای پنل ادمین ثبت نمی‌شوند تا آمار سایت واقعی بماند.
 */
const ALLOWED_TYPES = new Set(["booking_modal_open", "booking_platform_click", "call_click"]);
const ALLOWED_PLATFORMS = new Set(["doctoreto", "nobat"]);

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  try {
    const rl = rateLimit(req, "track-event", 60, 60 * 1000);
    if (!rl.ok) return NextResponse.json({ ok: false });

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;

    const type = clean(body?.type, 40);
    if (!ALLOWED_TYPES.has(type)) return NextResponse.json({ ok: false });

    const rawPlatform = clean(body?.platform, 40);
    const platform = ALLOWED_PLATFORMS.has(rawPlatform) ? rawPlatform : "";

    const source = clean(body?.source, 40).replace(/[^a-zA-Z0-9_-]/g, "");
    const path = clean(body?.path, 200);
    if (path.startsWith("/admin") || !path.startsWith("/")) {
      return NextResponse.json({ ok: false });
    }
    const vid = clean(body?.vid, 64);

    await db.trackEvent.create({ data: { type, platform, source, path, vid } });
    return NextResponse.json({ ok: true });
  } catch {
    // حتی در خطا هم کلاینت نباید متوجه شود
    return NextResponse.json({ ok: false });
  }
}
