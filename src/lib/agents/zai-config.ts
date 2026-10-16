/**
 * مدیریت کلید Z.AI — کلید واقعی از تنظیمات دیتابیس (پنل ادمین ← تب ایجنت‌ها) خوانده می‌شود
 * و فایل .z-ai-config کنار پروژه (اولویت اول SDK) پیش از هر اجرا به‌روزرسانی می‌شود.
 *
 * چرا؟ روی هاست cPanel دسترسی ترمینال آسان نیست؛ صاحب سایت کلید را از پنل وارد می‌کند و
 * همین ماژول آن را در فایل مخصوص SDK می‌نویسد — بدون نیاز به SSH.
 */
import fs from "node:fs";
import path from "node:path";

/** آدرس پیش‌فرض پلتفرم باز Z.AI — نقطه پایانی سازگار با OpenAI */
export const ZAI_DEFAULT_BASE_URL = "https://api.z.ai/api/paas/v4";

/** کلید فقط می‌تواند ASCII چاپ‌پذیر باشد — چون داخل هدر HTTP می‌نشیند (ByteString) */
export function isAsciiSafe(value: string): boolean {
  return /^[\x20-\x7E]+$/.test(value);
}

export function isNonAsciiError(message: string): boolean {
  return /ByteString|z-ai-config|Configuration file not found/i.test(message);
}

/** پیام خطای قابل‌فهم فارسی برای مدیر سایت */
export function friendlyAgentError(raw: string): string {
  if (/ByteString/i.test(raw)) {
    return "کلید API هوش مصنوعی نامعتبر است (متن فارسی/نمونه ثبت شده) — از پنل ادمین ← تب «ایجنت‌ها» ← کارت «کلید هوش مصنوعی» کلید واقعی Z.AI را وارد کنید";
  }
  if (/Configuration file not found|z-ai-config/i.test(raw)) {
    return "فایل کلید هوش مصنوعی یافت نشد — از پنل ادمین ← تب «ایجنت‌ها» ← کارت «کلید هوش مصنوعی» کلید Z.AI را ثبت کنید";
  }
  return raw;
}

/**
 * پیش از هر اجرای ایجنت: اگر کلید در تنظیمات ذخیره شده باشد فایل .z-ai-config
 * را می‌نویسد (در صورت تغییر). کلید نامعتبر (فارسی) خطای واضح می‌دهد.
 */
export async function ensureZaiConfig(): Promise<void> {
  let key = "";
  let baseUrl = "";
  try {
    const { getAgentsConfig } = await import("./runner");
    const cfg = await getAgentsConfig();
    key = (cfg.zaiKey ?? "").trim();
    baseUrl = (cfg.zaiBaseUrl ?? "").trim();
  } catch {
    return; // دیتابیس در دسترس نیست — فایل موجود باقی می‌ماند
  }
  if (!key) return; // کلیدی در پنل ثبت نشده — فایل موجود هاست به کار خود ادامه می‌دهد

  if (!isAsciiSafe(key)) {
    throw new Error(
      "کلید ذخیره‌شده Z.AI نامعتبر است (شامل حروف فارسی یا فاصله) — دوباره از پنل ادمین واردش کنید"
    );
  }

  const target = JSON.stringify({ baseUrl: baseUrl || ZAI_DEFAULT_BASE_URL, apiKey: key }, null, 2);
  const file = path.join(process.cwd(), ".z-ai-config");
  try {
    if (fs.readFileSync(file, "utf-8") === target) return; // بدون تغییر
  } catch {
    /* فایل نیست — در ادامه نوشته می‌شود */
  }
  fs.writeFileSync(file, target, { encoding: "utf-8", mode: 0o600 });
}
