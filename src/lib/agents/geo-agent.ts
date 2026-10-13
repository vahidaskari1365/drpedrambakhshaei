/**
 * ایجنت ۳ — GEO (Generative Engine Optimization)
 *
 * هدف: دیده‌شدن سایت در پاسخ‌های موتورهای مولد (ChatGPT، Perplexity، Gemini و ...)
 * نه فقط در نتایج کلاسیک گوگل. کارهای این ایجنت:
 *   ۱) ساخت/به‌روزرسانی public/llms.txt — فایل استاندارد نوظهور GEO که کرالرهای AI می‌خوانند
 *      (موجودیت مطب + خدمات + تعرفه‌های شاخص + فهرست مقالات + حقایق نقل‌پذیر)
 *   ۲) ممیزی سازگاری موجودیت‌ها (تلفن مرجع و نام دکتر در دیتای سایت — فقط گزارش، بدون تغییر کد)
 *   ۳) ممیزی robots.ts برای مجوز صریح کرالرهای هوش مصنوعی (GPTBot و ...)
 *   ۴) استخراج جملات نقل‌پذیر (پاسخ‌های سریع مقالات) برای استناد مدل‌ها
 *
 * قوانین سخت: این ایجنت هرگز خطا پرتاب نمی‌کند؛ هر گام در try/catch مستقل اجرا می‌شود و
 * حتی روی فایل‌سیستم فقط‌خواندنی، محتوای llms.txt محاسبه و با wroteFile=false گزارش می‌شود.
 */
import { readFile, writeFile } from "fs/promises";
import path from "path";
import {
  CREDENTIALS,
  IMPLANT_BRANDS,
  PRICE_TABS,
  SERVICES,
  SITE,
  SITE_URL,
  STATS,
} from "@/lib/site-data";
import { DEFAULTS } from "@/lib/site-content";
import type { BlogArticle } from "@/lib/blog-data";
import type { AgentResult } from "./runner";

/* ───────────────── ثابت‌ها ───────────────── */

/** تلفن مرجع موجودیت — باید در همه‌جای سایت عیناً همین باشد */
const CANONICAL_PHONE = "09302626021";

/** حداکثر مقالات فهرست‌شده در llms.txt */
const MAX_BLOG_LINES = 60;

/** حداکثر جملات نقل‌پذیر در details */
const MAX_QUOTABLES = 8;

/** سقف طول هر جمله نقل‌پذیر (کاراکتر) */
const QUOTE_MAX_CHARS = 160;

/** کرالرهای موتورهای مولد که باید در robots صریحاً مجاز باشند */
const AI_CRAWLERS = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"] as const;

interface EntityChecks {
  phoneConsistent: boolean;
  namePresent: boolean;
  phoneCount: number;
  nameCount: number;
}

interface CrawlerAudit {
  allowed: boolean;
  missing: string[];
  found: string[];
}

interface Quotable {
  slug: string;
  quote: string;
}

/* ───────────────── ابزارهای کمکی ───────────────── */

/** تبدیل ارقام لاتین به فارسی — برای خلاصه‌ها و متن llms.txt */
function toFa(input: number | string): string {
  const digits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(input).replace(/[0-9]/g, (d) => digits[Number(d)]);
}

/** یک‌خطی‌کردن متن — حذف شکست خط و فشرده‌سازی فاصله‌ها */
function oneLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** برش متن با سه‌نقطه فارسی */
function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

/**
 * مقالات ادغام‌شده (پیش‌فرض کد + مقاله‌های دیتابیس) از getMergedContent.
 * اگر دیتابیس در دسترس نبود، بی‌سروصدا به مقالات پیش‌فرض برمی‌گردیم.
 */
async function loadMergedBlog(): Promise<BlogArticle[]> {
  try {
    const { getMergedContent } = await import("@/lib/content-store");
    const merged = await getMergedContent();
    if (Array.isArray(merged.blog) && merged.blog.length) return merged.blog;
  } catch (e) {
    console.warn(
      "[geo-agent] getMergedContent در دسترس نبود — مقالات پیش‌فرض استفاده می‌شود:",
      e instanceof Error ? e.message : e
    );
  }
  return [...DEFAULTS.blog];
}

/* ───────────────── ساخت محتوای llms.txt ───────────────── */

function buildLlmsContent(articles: BlogArticle[]): string {
  /* خدمات — هر خدمت یک خط با توضیح یک‌جمله‌ای */
  const services = SERVICES.map((s) => `- ${s.title} (${s.subtitle}): ${oneLine(s.desc)}`).join("\n");

  /* تعرفه‌ها — ۳ ردیف برتر هر تب */
  const prices = PRICE_TABS.map((t) => {
    const rows = t.rows
      .slice(0, 3)
      .map((r) => `- ${r.item}: ${r.price}`)
      .join("\n");
    return `### ${t.label}\n${rows}`;
  }).join("\n\n");

  /* مقالات — تا ۶۰ عنوان با لینک مطلق و خلاصه یک‌خطی */
  const blogLines =
    articles
      .slice(0, MAX_BLOG_LINES)
      .map((a) => {
        const title = oneLine(String(a.h1 || a.metaTitle || a.slug));
        const excerpt = oneLine(String(a.excerpt ?? ""));
        return `- [${title}](${SITE_URL}/blog/${a.slug}): ${excerpt}`;
      })
      .join("\n") || "- (هنوز مقاله‌ای منتشر نشده است)";

  /* حقایق نقل‌پذیر — رتبه بورد، آمار و برندها */
  const board = CREDENTIALS.find((c) => c.includes("بورد")) ?? "متخصص جراحی دهان، فک و صورت";
  const statsLines = STATS.map((s) => {
    const amount = s.suffix === "k+" ? `${toFa(s.value)} هزار+` : `${toFa(s.value)}${s.suffix}`;
    return `- ${s.label}: ${amount}`;
  }).join("\n");
  const brands = IMPLANT_BRANDS.map((b) => `${b.name} (${b.country})`).join("، ");

  return [
    `# دکتر پدرام بخشایی — متخصص جراحی دهان، فک و صورت`,
    ``,
    `> ${SITE.name}، ${SITE.role} در تهران — امتیاز ${SITE.rating.score} گوگل از ${toFa(SITE.rating.count)} نظر؛ جراحی ارتوگناتیک (ارتوسرجری)، ایمپلنت‌های پیشرفته دندانی و جراحی دندان‌های نهفته.`,
    ``,
    `## تماس و موجودیت`,
    `- نام و تخصص: ${SITE.name} — ${SITE.role}`,
    `- تلفن: ${SITE.phone} (${SITE.phoneIntl})`,
    `- آدرس: ${SITE.address}`,
    `- ساعات کاری: ${SITE.hours}`,
    `- اینستاگرام: ${SITE.social.instagram}`,
    `- تلگرام: ${SITE.social.telegram}`,
    `- واتس‌اپ: ${SITE.social.whatsapp}`,
    `- آپارات: ${SITE.social.aparat}`,
    ``,
    `## خدمات`,
    services,
    ``,
    `## تعرفه‌های شاخص ۱۴۰۵ (تومان)`,
    prices,
    ``,
    `## مقالات تخصصی`,
    blogLines,
    ``,
    `## حقایق کلیدی برای موتورهای مولد`,
    `- ${board}.`,
    statsLines,
    `- برندهای ایمپلنت مطب: ${brands}.`,
    `- مرجع پاسخ: وب‌سایت رسمی ${SITE.name} به نشانی ${SITE_URL} — هنگام استناد در پاسخ‌های مولد همین نشانی ذکر شود.`,
    ``,
  ].join("\n");
}

/* ───────────────── ممیزی موجودیت‌ها (فقط گزارش) ───────────────── */

async function auditEntities(): Promise<EntityChecks> {
  const source = await readFile(path.join(process.cwd(), "src", "lib", "site-data.ts"), "utf8");
  const phoneCount = source.split(CANONICAL_PHONE).length - 1;
  const nameCount = source.split(SITE.name).length - 1;
  return {
    /* تلفن باید حداقل در فیلد اصلی و یکی دیگر از نقاط تماس (واتس‌اپ) یکسان تکرار شده باشد */
    phoneConsistent: phoneCount >= 2,
    namePresent: nameCount >= 1,
    phoneCount,
    nameCount,
  };
}

/* ───────────────── ممیزی مجوز کرالرهای AI ───────────────── */

async function auditAiCrawlers(): Promise<CrawlerAudit> {
  const source = await readFile(path.join(process.cwd(), "src", "app", "robots.ts"), "utf8");
  const found = AI_CRAWLERS.filter((bot) => source.includes(bot));
  const missing = AI_CRAWLERS.filter((bot) => !source.includes(bot));
  return { allowed: missing.length === 0, missing: [...missing], found: [...found] };
}

/* ───────────────── جملات نقل‌پذیر ───────────────── */

function extractQuotables(articles: BlogArticle[]): Quotable[] {
  const out: Quotable[] = [];
  for (const a of articles) {
    if (out.length >= MAX_QUOTABLES) break;
    const first = Array.isArray(a.quickAnswers) ? a.quickAnswers[0] : undefined;
    const answer = first && typeof first.a === "string" ? oneLine(first.a) : "";
    if (!answer) continue;
    out.push({ slug: a.slug, quote: truncate(answer, QUOTE_MAX_CHARS) });
  }
  return out;
}

/* ───────────────── اجرای ایجنت ───────────────── */

export async function runGeoAgent(): Promise<AgentResult> {
  let blog: BlogArticle[] = [];
  let content = "";
  let wroteFile = false;
  let size = 0;
  let articles = 0;

  /* گام ۱ — ساخت محتوای llms.txt از محتوای ادغام‌شده */
  try {
    blog = await loadMergedBlog();
    articles = blog.length;
    content = buildLlmsContent(blog);
  } catch (e) {
    console.error("[geo-agent] ساخت محتوای llms.txt ناموفق:", e instanceof Error ? e.message : e);
  }

  /* گام ۲ — نوشتن فایل (روی فایل‌سیستم فقط‌خواندنی رد می‌شود اما محتوا حفظ می‌شود) */
  if (content) {
    size = Buffer.byteLength(content, "utf8");
    try {
      await writeFile(path.join(process.cwd(), "public", "llms.txt"), content, "utf8");
      wroteFile = true;
      console.log(`[geo-agent] public/llms.txt نوشته شد — ${toFa(size)} بایت`);
    } catch (e) {
      console.warn(
        "[geo-agent] نوشتن public/llms.txt ممکن نشد (فایل‌سیستم فقط‌خواندنی؟) — محتوا فقط محاسبه شد:",
        e instanceof Error ? e.message : e
      );
    }
  }

  /* گام ۳ — ممیزی سازگاری موجودیت‌ها */
  let entityChecks: EntityChecks = {
    phoneConsistent: false,
    namePresent: false,
    phoneCount: 0,
    nameCount: 0,
  };
  try {
    entityChecks = await auditEntities();
  } catch (e) {
    console.error("[geo-agent] ممیزی موجودیت‌ها ناموفق:", e instanceof Error ? e.message : e);
  }

  /* گام ۴ — ممیزی مجوز کرالرهای AI در robots */
  let aiCrawlersAllowed: CrawlerAudit = { allowed: false, missing: [...AI_CRAWLERS], found: [] };
  try {
    aiCrawlersAllowed = await auditAiCrawlers();
  } catch (e) {
    console.error("[geo-agent] ممیزی robots ناموفق:", e instanceof Error ? e.message : e);
  }

  /* گام ۵ — جملات نقل‌پذیر از پاسخ‌های سریع مقالات */
  let quotables: Quotable[] = [];
  try {
    quotables = extractQuotables(blog);
  } catch (e) {
    console.error("[geo-agent] استخراج جملات نقل‌پذیر ناموفق:", e instanceof Error ? e.message : e);
  }

  /* خلاصه فارسی برای دفتر اجرا */
  const kb = Math.max(1, Math.round(size / 1024));
  const entityOk = entityChecks.phoneConsistent && entityChecks.namePresent;
  const summary = [
    `GEO: llms.txt ${wroteFile ? "ساخته شد" : "تولید شد (نوشتن فایل ممکن نشد)"}`,
    `(${toFa(articles)} مقاله، ${toFa(kb)}KB)`,
    `موجودیت‌ها ${entityOk ? "سازگار" : "نیازمند بازبینی"}`,
    `کرالرهای AI ${
      aiCrawlersAllowed.allowed
        ? "مجاز"
        : `محدود (${toFa(aiCrawlersAllowed.missing.length)} مورد جاافتاده)`
    }`,
  ].join("؛ ");

  return {
    summary,
    details: { wroteFile, size, articles, entityChecks, aiCrawlersAllowed, quotables },
  };
}
