import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * پاک‌سازی کش LiteSpeed/LSCache برای مسیرهای مشخص — GET /api/cache-purge?path=/admin
 * کاربرد یک‌باره: HTML کهنه پنل ادمین با s-maxage یک‌ساله در کش وب‌سرور گیر
 * کرده بود؛ هدر X-LiteSpeed-Purge از سمت بک‌اند، ورودی کش را پاک می‌کند.
 * فقط مسیرهای امن (بدون /api) مجازند و سقف نرخ دارد.
 */
export async function GET(req: Request) {
  const rl = rateLimit(req, "cache-purge", 6, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "تعداد درخواست‌ها زیاد است" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }
  const raw = new URL(req.url).searchParams.get("path") ?? "/admin";
  // فقط مسیرهای صفحه‌ای امن — جلوگیری از سوءاستفاده برای پاک‌سازی پیوسته کش کل سایت
  const allowed = new Map<string, string>([
    ["/admin", "/admin, /admin/"],
    ["/", "/"],
  ]);
  const purge = allowed.get(raw.replace(/\/+$/, "") || "/");
  if (!purge) {
    return NextResponse.json({ error: "مسیر مجاز نیست" }, { status: 400 });
  }
  return NextResponse.json(
    { ok: true, purged: purge },
    { headers: { "X-LiteSpeed-Purge": purge } },
  );
}
