import { goneResponse } from "@/lib/gone-response";

/**
 * /wp-login.php — صفحه ورود وردپرس قدیمی؛ دیگر وجود ندارد.
 * هدف همیشگی ربات‌های اسکن است؛ ۴۱۰ هم گوگل را راضی می‌کند هم نویز لاگ کم می‌شود.
 */
export function GET() {
  return goneResponse();
}

export function HEAD() {
  return goneResponse();
}
