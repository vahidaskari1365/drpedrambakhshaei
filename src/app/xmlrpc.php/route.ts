import { goneResponse } from "@/lib/gone-response";

/**
 * /xmlrpc.php — XML-RPC وردپرس قدیمی؛ دیگر وجود ندارد.
 * هدف رایج حملات brute-force؛ ۴۱۰ پاسخ نهایی و همیشگی است.
 */
export function GET() {
  return goneResponse();
}

export function HEAD() {
  return goneResponse();
}
