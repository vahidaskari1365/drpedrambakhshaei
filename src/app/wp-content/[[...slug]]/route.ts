import { goneResponse } from "@/lib/gone-response";

/**
 * /wp-content/** — رسانه‌ها و فایل‌های وردپرس قدیمی
 *
 * سایت قبلاً وردپرس بود و گوگل هنوز URLهای /wp-content/uploads/... را می‌شناسد؛
 * حالا که Next.js است، این مسیرها ۴۰۴ می‌دادند و در گزارش Pages سرچ کنسول
 * به‌عنوان «یافت نشد (۴۰۴)» شمرده می‌شدند. با ۴۱۰ گوگل آن‌ها را سریع‌تر
 * و تمیز از ایندکس خارج می‌کند.
 *
 * [[...slug]] = اختیاری catch-all: /wp-content و /wp-content/uploads/2023/05/x.jpg و …
 */
export function GET() {
  return goneResponse();
}

export function HEAD() {
  return goneResponse();
}
