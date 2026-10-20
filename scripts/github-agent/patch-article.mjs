/**
 * اعمال پچ محتوای مقاله‌ها — فایل‌های JSON داخل scripts/github-agent/patches/
 *
 * هر فایل = بدنه کامل POST /api/blog/publish (idempotent روی slug —
 * مقاله موجود با همان اسلاگ به‌روزرسانی می‌شود، بدون ساخت ردیف تازه).
 *
 * استفاده (محلی یا workflow): SITE_URL + ADMIN_KEY → node scripts/github-agent/patch-article.mjs
 * الگوی امن: کلید فقط از env — هرگز در فایل یا گیت نمی‌رود.
 */
import { readFileSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = (process.env.SITE_URL || "").replace(/\/+$/, "");
const KEY = (process.env.ADMIN_KEY || "").trim();
const DIR = join(dirname(fileURLToPath(import.meta.url)), "patches");
const APPLY = (process.env.PATCH_APPLY ?? "1") !== "0"; // 0 = فقط خواندن و اعتبارسنجی

if (!SITE || !KEY) {
  console.error("ERROR: SITE_URL / ADMIN_KEY تنظیم نشده است");
  process.exit(1);
}

const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
if (files.length === 0) {
  console.log("هیچ فایل پچی در patches/ نیست — هیچ‌کاری نکردم");
  process.exit(0);
}

/**
 * fetch با retry — مسیر GitHub Runner → سرور ایران نوسان دارد (Connect Timeout
 * های کوتاه)؛ با ۵ تلاش و فاصله صعودی، خطای گذرا خنثی می‌شود.
 */
async function fetchRetry(url, options = {}, attempts = 5) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(60_000), // connect+read تا ۶۰ ثانیه
      });
    } catch (e) {
      lastErr = e;
      const wait = i * 10_000;
      console.log(`  تلاش ${i}/${attempts} ناموفق (${e?.cause?.code || e.code || e.message}) — ${wait / 1000} ثانیه صبر…`);
      if (i < attempts) await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

let failed = 0;
for (const f of files) {
  const path = join(DIR, f);
  let body;
  try {
    body = JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    console.error(`${f} → JSON نامعتبر: ${e.message}`);
    failed++;
    continue;
  }
  // حالت حذف: { "_delete": true, "slug": "..." } → DELETE /api/blog/publish
  if (body?._delete === true) {
    if (!body?.slug) {
      console.error(`${f} → پچ حذف بدون slug`);
      failed++;
      continue;
    }
    const res = await fetchRetry(`${SITE}/api/blog/publish`, {
      method: "DELETE",
      headers: { "content-type": "application/json", "x-admin-key": KEY },
      body: JSON.stringify({ slug: body.slug }),
    });
    const json = await res.json().catch(() => ({}));
    console.log(`${f} → DELETE ${body.slug} → HTTP ${res.status} ${JSON.stringify(json)}`);
    if (!res.ok || json?.ok !== true) {
      failed++;
      continue;
    }
    rmSync(path);
    console.log(`${f} → حذف انجام شد و از صف پچ حذف شد`);
    continue;
  }

  if (!body?.slug || !body?.article || !Array.isArray(body.article.blocks)) {
    console.error(`${f} → ساختار پچ نامعتبر (slug/article/blocks)`);
    failed++;
    continue;
  }
  const res = await fetchRetry(`${SITE}/api/blog/publish`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-admin-key": KEY },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  console.log(`${f} → HTTP ${res.status} ${JSON.stringify(json)}`);
  if (!res.ok || json?.ok !== true) {
    failed++;
    continue;
  }
  // پچ موفق از صف حذف می‌شود تا اجرای دوباره تصادفی کاری نکند
  rmSync(path);
  console.log(`${f} → اعمال شد و از صف پچ حذف شد`);
}

if (failed > 0) {
  console.error(`FAILED: ${failed} پچ اعمال نشد — workflow را red بگذار تا دیده شود`);
  process.exit(1);
}
console.log("ALL PATCHES APPLIED");
