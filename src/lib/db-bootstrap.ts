/**
 * بوت‌استرپ دیتابیس — صفر تنظیم دستی روی هاست:
 *
 * - PostgreSQL (هاست ایران): در اولین اجرا همه جداول خودکار با DDL ساخته
 *   می‌شوند + پاکسازی بازدیدهای قدیمی. هیچ دستور SQL دستی لازم نیست.
 * - SQLite (محیط توسعه سندباکس): ساخت از قالب db/template.db + WAL
 */
import fs from "node:fs";
import path from "node:path";

let done = false;

/** DDL کامل مطابق prisma/schema.prisma — برای PostgreSQL هاست */
const PG_DDL = `
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE TABLE IF NOT EXISTS "Post" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "content" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "authorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE TABLE IF NOT EXISTS "ContactRequest" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "service" TEXT NOT NULL DEFAULT 'سایر موارد',
  "message" TEXT NOT NULL DEFAULT '',
  "status" TEXT NOT NULL DEFAULT 'new',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "ContentOverride" (
  "key" TEXT NOT NULL PRIMARY KEY,
  "data" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE TABLE IF NOT EXISTS "ActivityLog" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "kind" TEXT NOT NULL,
  "entity" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "Visit" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "path" TEXT NOT NULL,
  "vid" TEXT NOT NULL DEFAULT '',
  "referrer" TEXT NOT NULL DEFAULT '',
  "device" TEXT NOT NULL DEFAULT 'desktop',
  "ua" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Visit_createdAt_idx" ON "Visit"("createdAt");
CREATE INDEX IF NOT EXISTS "Visit_path_idx" ON "Visit"("path");
CREATE INDEX IF NOT EXISTS "Visit_vid_idx" ON "Visit"("vid");
CREATE TABLE IF NOT EXISTS "Media" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "filename" TEXT NOT NULL,
  "mime" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "data" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

export async function bootstrapDatabase(): Promise<void> {
  if (done) return;
  done = true;
  try {
    const url = process.env.DATABASE_URL ?? "";
    const { db } = await import("@/lib/db");

    // ─── PostgreSQL هاست: ساخت خودکار جداول در اولین اجرا ───
    if (url.startsWith("postgresql:")) {
      for (const stmt of PG_DDL.split(";")) {
        const sql = stmt.trim();
        if (sql) await db.$executeRawUnsafe(sql);
      }
      await db.$executeRawUnsafe(
        'DELETE FROM "Visit" WHERE "createdAt" < now() - interval \'120 days\''
      );
      console.log("[db-bootstrap] PostgreSQL ready — tables ensured");
      return;
    }

    // ─── SQLite محیط توسعه ───
    if (url.startsWith("file:")) {
      const raw = url.slice("file:".length);
      const dbPath = path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw);
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
      if (!fs.existsSync(dbPath)) {
        const template = path.join(process.cwd(), "db", "template.db");
        if (!fs.existsSync(template)) {
          console.warn("[db-bootstrap] نه دیتابیس و نه قالب پیدا نشد:", template);
          return;
        }
        fs.copyFileSync(template, dbPath);
        console.log("[db-bootstrap] SQLite از قالب ساخته شد:", dbPath);
      }
      await db.$queryRawUnsafe("PRAGMA journal_mode=WAL;");
      await db.$queryRawUnsafe("PRAGMA busy_timeout=5000;");
      await db.$executeRawUnsafe(
        'DELETE FROM "Visit" WHERE "createdAt" < datetime(\'now\',\'-120 days\')'
      );
      return;
    }
  } catch (error) {
    console.error("[db-bootstrap] خطا:", error);
  }
}
