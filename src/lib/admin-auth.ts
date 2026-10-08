/**
 * احراز هویت ساده پنل ادمین — کلید در هدر x-admin-key
 * کلید پیش‌فرض برای محیط توسعه: drpedram (قابل تغییر با متغیر محیطی ADMIN_KEY)
 */
import { NextResponse } from "next/server";

export const ADMIN_KEY = process.env.ADMIN_KEY ?? "drpedram";

export function checkAdmin(req: Request): NextResponse | null {
  const key = req.headers.get("x-admin-key");
  if (key && key === ADMIN_KEY) return null;
  return NextResponse.json(
    { error: "دسترسی غیرمجاز — کلید مدیریت معتبر نیست" },
    { status: 401 }
  );
}
