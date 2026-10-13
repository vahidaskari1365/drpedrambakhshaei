import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * ثبت بازدید صفحه — بدون احراز هویت، سبک و مقاوم
 * مسیرهای پنل ادمین ثبت نمی‌شوند تا آمار سایت واقعی بماند.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      path?: unknown;
      vid?: unknown;
      device?: unknown;
      referrer?: unknown;
    } | null;

    const path = typeof body?.path === "string" ? body.path.slice(0, 200) : "";
    if (!path || path.startsWith("/admin") || !path.startsWith("/")) {
      return NextResponse.json({ ok: false });
    }

    const vid = typeof body?.vid === "string" ? body.vid.slice(0, 64) : "";
    const device = body?.device === "mobile" || body?.device === "tablet" ? body.device : "desktop";
    const referrer = typeof body?.referrer === "string" ? body.referrer.slice(0, 300) : "";
    const ua = (req.headers.get("user-agent") ?? "").slice(0, 300);

    await db.visit.create({ data: { path, vid, device, referrer, ua } });
    return NextResponse.json({ ok: true });
  } catch {
    // حتی در خطا هم کلاینت نباید متوجه شود
    return NextResponse.json({ ok: false });
  }
}
