/**
 * بوت‌استرپ دیتابیس در سرور واقعی (cPanel) — صفر تنظیم دستی:
 * ۱. ساخت پوشه db در صورت نبود
 * ۲. کپی قالب خالی اسکیمادار (db/template.db) در اولین اجرا
 * ۳. فعال‌سازی WAL برای همزمانی امن بین پروسس‌های Passenger
 * ۴. پاکسازی بازدیدهای قدیمی‌تر از ۱۲۰ روز (جلوگیری از رشد بی‌رویه فایل)
 */
import fs from "node:fs";
import path from "node:path";

let done = false;

export async function bootstrapDatabase(): Promise<void> {
  if (done) return;
  done = true;
  try {
    const url = process.env.DATABASE_URL ?? "";
    if (!url.startsWith("file:")) return;

    const raw = url.slice("file:".length);
    const dbPath = path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw);
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });

    if (!fs.existsSync(dbPath)) {
      const template = path.join(process.cwd(), "db", "template.db");
      if (!fs.existsSync(template)) {
        console.warn("[db-bootstrap] نه فایل دیتابیس و نه قالب پیدا نشد:", template);
        return;
      }
      fs.copyFileSync(template, dbPath);
      console.log("[db-bootstrap] دیتابیس از قالب ساخته شد:", dbPath);
    }

    const { db } = await import("@/lib/db");
    await db.$queryRawUnsafe("PRAGMA journal_mode=WAL;");
    await db.$queryRawUnsafe("PRAGMA busy_timeout=5000;");
    const removed = await db.$executeRawUnsafe(
      'DELETE FROM "Visit" WHERE "createdAt" < datetime(\'now\',\'-120 days\')'
    );
    if (removed > 0) console.log(`[db-bootstrap] ${removed} بازدید قدیمی پاک شد`);
  } catch (error) {
    console.error("[db-bootstrap] خطا:", error);
  }
}
