/**
 * احراز هویت پنل ادمین — کلید در هدر x-admin-key
 *
 * لایه‌های دفاعی:
 * ۱. کلید فقط از متغیر محیطی ADMIN_KEY خوانده می‌شود (در پروداکشن بدون آن، پنل قفل است)
 * ۲. مقایسه Timing-safe (ضد حمله زمانی)
 * ۳. قفل خودکار IP بعد از ۵ تلاش ناموفق در ۱۰ دقیقه (ضد Brute-force)
 * ۴. سقف نرخ کلی روی هر تلاش (ضد سرریز)
 */
import { NextResponse } from "next/server";
import { timingSafeEqual, createHash } from "crypto";
import {
  clientIp,
  recordAdminFail,
  clearAdminFails,
  adminLocked,
  rateLimit,
} from "./rate-limit";

const ENV_KEY = process.env.ADMIN_KEY?.trim() ?? "";
const DEV_FALLBACK = "drpedram-dev-only";

/** کلید فعال — در پروداکشن حتماً از env؛ بدون آن پنل قفل می‌ماند */
export const ADMIN_KEY =
  ENV_KEY || (process.env.NODE_ENV === "production" ? "" : DEV_FALLBACK);

function safeEqual(a: string, b: string): boolean {
  // هش کردن هر دو طرف طولشان را یکسان می‌کند تا timingSafeEqual کرش نکند
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/** در صورت غیبت کلید در پروداکشن، همه درخواست‌ها رد می‌شوند */
function adminUnavailable(): NextResponse {
  return NextResponse.json(
    { error: "کلید مدیریت سرور تنظیم نشده است (ADMIN_KEY)" },
    { status: 503 }
  );
}

export function checkAdmin(req: Request): NextResponse | null {
  const ip = clientIp(req);

  // قفل Brute-force
  const lock = adminLocked(ip);
  if (lock) {
    return NextResponse.json(
      {
        error: `به‌دلیل تلاش‌های ناموفق زیاد، این IP موقتاً قفل شده است؛ ${Math.ceil(
          lock.retryAfterSec / 60
        )} دقیقه دیگر تلاش کنید`,
      },
      { status: 429, headers: { "Retry-After": String(lock.retryAfterSec) } }
    );
  }

  // سقف کلی تلاش (حتی با کلید درست، اسپم رد می‌شود)
  const rl = rateLimit(req, "admin-attempt", 60, 5 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "تعداد تلاش‌ها زیاد است؛ کمی بعد تلاش کنید" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  if (!ADMIN_KEY) return adminUnavailable();

  const key = req.headers.get("x-admin-key") ?? "";
  if (key && safeEqual(key, ADMIN_KEY)) {
    clearAdminFails(ip);
    return null;
  }

  recordAdminFail(ip);
  return NextResponse.json(
    { error: "دسترسی غیرمجاز — کلید مدیریت معتبر نیست" },
    { status: 401 }
  );
}
