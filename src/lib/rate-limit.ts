/**
 * محدودکننده نرخ درخواست در حافظه — مشترک بین همه APIها
 * ضد حمله Brute-force روی پنل ادمین، ضد اسپم فرم تماس و ضد Flood ردیاب بازدید.
 * ایمن در برابر رشد بی‌رویه حافظه: سقف تعداد کلیدها + پاکسازی خودکار.
 */

interface Bucket {
  count: number;
  reset: number;
}

interface Attempt {
  fails: number;
  firstFail: number;
  blockedUntil: number;
}

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10_000; // سقف کل حافظه — در حمله با IP جعلی هم حافظه ترک نمی‌خورد

function prune() {
  const now = Date.now();
  if (buckets.size > MAX_KEYS * 0.8) {
    for (const [k, v] of buckets) {
      if (now >= v.reset) buckets.delete(k);
      if (buckets.size <= MAX_KEYS * 0.5) break;
    }
  }
  if (buckets.size > MAX_KEYS) {
    // سرریز اضطراری — قدیمی‌ترین‌ها حذف می‌شوند (ساده: پاکسازی کامل منقضی‌ها و سپس تصادفی)
    const keys = [...buckets.keys()];
    for (let i = 0; i < keys.length / 2; i++) buckets.delete(keys[i]);
  }
}

/** آدرس واقعی کلاینت (با پشتیبانی از پروکسی معکوس) */
export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "local"
  );
}

/**
 * آیا این کلاینت مجاز است؟
 * @returns null یعنی مجاز؛ در غیر این صورت رشته‌ی خطا با وضعیت HTTP
 */
export function rateLimit(
  req: Request,
  scope: string,
  limit: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfterSec: number } {
  const ip = clientIp(req);
  const key = `${scope}:${ip}`;
  const now = Date.now();

  const entry = buckets.get(key);
  if (entry && now < entry.reset) {
    if (entry.count >= limit) {
      return { ok: false, retryAfterSec: Math.max(1, Math.ceil((entry.reset - now) / 1000)) };
    }
    entry.count += 1;
  } else {
    prune();
    buckets.set(key, { count: 1, reset: now + windowMs });
  }
  return { ok: true };
}

/* ─────────── قفل ورود ادمین (Lockout) ─────────── */

const attempts = new Map<string, Attempt>();
const MAX_ATTEMPT_KEYS = 2_000;
const MAX_FAILS = 5; // بعد از ۵ تلاش ناموفق
const BLOCK_MS = 15 * 60 * 1000; // ۱۵ دقیقه قفل
const FAIL_WINDOW = 10 * 60 * 1000; // پنجره ۱۰ دقیقه‌ای شمارش خطاها

/** ثبت یک تلاش ناموفق ورود ادمین برای این IP */
export function recordAdminFail(ip: string) {
  const now = Date.now();
  const a = attempts.get(ip);
  const withinWindow = a && now - a.firstFail < FAIL_WINDOW;
  const fails = withinWindow ? a.fails + 1 : 1;
  if (attempts.size > MAX_ATTEMPT_KEYS) attempts.clear();
  attempts.set(ip, {
    fails,
    firstFail: withinWindow ? a.firstFail : now,
    blockedUntil: fails >= MAX_FAILS ? now + BLOCK_MS : 0,
  });
}

/** پاک کردن خطاهای یک IP بعد از ورود موفق */
export function clearAdminFails(ip: string) {
  attempts.delete(ip);
}

/**
 * آیا این IP به‌خاطر تلاش‌های ناموفق قفل شده؟
 * @returns null یعنی آزاد؛ در غیر این صورت رشته قفل با ثانیه‌های باقی‌مانده
 */
export function adminLocked(ip: string): { retryAfterSec: number } | null {
  const a = attempts.get(ip);
  if (!a) return null;
  const now = Date.now();
  if (a.blockedUntil > now) {
    return { retryAfterSec: Math.ceil((a.blockedUntil - now) / 1000) };
  }
  return null;
}
