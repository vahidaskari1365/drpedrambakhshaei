/**
 * ایجنت ۲ — AEO (Answer Engine Optimization) — ممیزی و ترمیم پاسخ‌محورِ بایگانی
 *
 * وظیفه:
 *   ۱) ممیزی هر مقاله بر اساس ۵ معیار پاسخ‌محور با وزن‌دهی (امتیاز ۰ تا ۱۰۰)
 *   ۲) ترمیم خودکار مقاله‌های ضعیفِ دیتابیس (تولید پاسخ‌های سریع و سوالات متداول با LLM)
 *   ۳) مقاله‌های استاتیک فقط شمارش و گزارش می‌شوند (فایل کد، بدون upsert)
 *   ۴) کنترل گزارشی اسکیماهای AEO در src/lib/seo.tsx (بدون تغییر کد)
 *
 * سقف‌ها: مقاله تازه (قلاب) + ۱۵ مقاله جدید دیتابیس ممیزی کامل می‌شوند؛
 * حداکثر ۲ ترمیم LLM در هر اجرا (کنترل هزینه) — بقیه به صف «pending» می‌روند.
 * این ایجنت هرگز برای داده خالی خطا نمی‌دهد؛ خطای تک‌تک آیتم‌ها فقط warn می‌شود.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";
import { getMergedContent } from "@/lib/content-store";
import type { BlogArticle } from "@/lib/blog-data";
import { publishPost } from "@/lib/blog/posts";
import type { AgentResult } from "./runner";

/* ───────────────── ثابت‌ها ───────────────── */

/** حداقل پاسخ سریع و سوال متداول پس از ترمیم (هدف تولید) */
const TARGET_QUICK_ANSWERS = 3;
const TARGET_FAQS = 4;
/** آستانه ورود به صف ترمیم — زیر این امتیاز مقاله ترمیم می‌شود */
const BACKFILL_THRESHOLD = 70;
/** حداکثر ترمیم LLM در هر اجرا (کنترل هزینه) */
const MAX_BACKFILLS = 2;
/** تعداد مقاله‌های جدید دیتابیس که در هر اجرا ممیزی کامل می‌شوند */
const AUDIT_DB_CAP = 15;

type QaPair = { q: string; a: string };
type ZaiClient = Awaited<ReturnType<typeof ZAI.create>>;

/* ───────────────── ابزارها ───────────────── */

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** تبدیل رقم‌های لاتین به فارسی برای خلاصه‌های داشبورد */
function fa(value: number | string): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

/** یکسان‌سازی سوال برای حذف تکراری‌ها */
function normQ(q: string): string {
  return q.replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * استخراج مقاوم اولین بلاک JSON قابل تجزیه از پاسخ مدل:
 * حذف فنس‌های ``` و سپس اسکن متوازن همه بلاک‌های { } یا [ ] کاندید
 * (با توجه به رشته‌ها و آکولاد داخل متن فارسی) — اولین بلاک سالم برگشت داده می‌شود
 */
function extractJsonBlock(raw: string): unknown {
  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    /* ادامه — بلاک داخلی را پیدا می‌کنیم */
  }
  for (let start = 0; start < cleaned.length; start++) {
    const open = cleaned[start];
    if (open !== "{" && open !== "[") continue;
    const close = open === "{" ? "}" : "]";
    let depth = 0;
    let inStr = false;
    let esc = false;
    let end = -1;
    for (let i = start; i < cleaned.length; i++) {
      const ch = cleaned[i];
      if (inStr) {
        if (esc) esc = false;
        else if (ch === "\\") esc = true;
        else if (ch === '"') inStr = false;
        continue;
      }
      if (ch === '"') inStr = true;
      else if (ch === open) depth++;
      else if (ch === close) {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    if (end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        /* این بلاک JSON نبود — کاندید بعدی */
      }
    }
  }
  throw new Error("بلاک JSON قابل تجزیه در پاسخ مدل یافت نشد");
}

/** پاک‌سازی جفت‌های سوال/جواب تولیدی — فقط آیتم‌های سالم و در محدوده طول مجاز */
function sanitizePairs(raw: unknown, maxAnswerLen: number): QaPair[] {
  if (!Array.isArray(raw)) return [];
  const out: QaPair[] = [];
  for (const item of raw) {
    const rec = (item ?? {}) as Record<string, unknown>;
    const q = typeof rec.q === "string" ? rec.q.trim() : "";
    const a = typeof rec.a === "string" ? rec.a.trim() : "";
    if (q && a) out.push({ q: q.slice(0, 200), a: a.slice(0, maxAnswerLen) });
  }
  return out;
}

/** تجزیه خروجی LLM به پاسخ‌های سریع و سوالات متداول معتبر */
function parseAeoPayload(raw: string): { quickAnswers: QaPair[]; faqs: QaPair[] } {
  const parsed = extractJsonBlock(raw);
  const obj = (typeof parsed === "object" && parsed !== null ? parsed : {}) as Record<string, unknown>;
  return {
    quickAnswers: sanitizePairs(obj.quickAnswers, 600),
    faqs: sanitizePairs(obj.faqs, 1200),
  };
}

/** ادغام تولیدی با موجود — بدون تکرار سوال، تا سقف هدف */
function mergePairs(existing: QaPair[], generated: QaPair[], target: number): QaPair[] {
  const seen = new Set(existing.map((p) => normQ(p.q)));
  const merged = [...existing];
  for (const pair of generated) {
    if (merged.length >= target) break;
    const key = normQ(pair.q);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(pair);
  }
  return merged;
}

/* ───────────────── ممیزی تک‌مقاله ───────────────── */

interface ArticleAudit {
  score: number;
  issues: string[];
}

/**
 * امتیازدهی AEO مقاله (۰ تا ۱۰۰) — وزن‌ها: پاسخ سریع ۳۰، سوالات متداول ۲۵،
 * متادescription ۱۵، خوانایی (فهرست/جدول) ۲۰، h1 و alt کاور ۱۰
 */
function auditArticle(article: BlogArticle): ArticleAudit {
  const issues: string[] = [];
  let score = 0;

  // ۱) پاسخ‌های سریع — وزن ۳۰
  const qaCount = article.quickAnswers?.length ?? 0;
  if (qaCount >= 2) score += 30;
  else issues.push(`پاسخ‌های سریع ناکافی است (${fa(qaCount)} از ${fa(2)})`);

  // ۲) سوالات متداول — وزن ۲۵
  const faqCount = article.faqs?.length ?? 0;
  if (faqCount >= 3) score += 25;
  else issues.push(`سوالات متداول کمتر از ${fa(3)} است (${fa(faqCount)})`);

  // ۳) طول متادescription بین ۸۰ تا ۱۶۵ کاراکتر — وزن ۱۵
  const descLen = (article.metaDesc ?? "").length;
  if (descLen >= 80 && descLen <= 165) score += 15;
  else issues.push(`طول توضیح متا خارج از بازه ${fa(80)} تا ${fa(165)} کاراکتر است (${fa(descLen)})`);

  // ۴) خوانایی — حداقل یک بلوک فهرست یا جدول — وزن ۲۰
  const scannable = (article.blocks ?? []).some(
    (b) => b.type === "list" || b.type === "table"
  );
  if (scannable) score += 20;
  else issues.push("هیچ بلوک فهرست یا جدولی برای خوانایی وجود ندارد");

  // ۵) h1 و alt کاور — وزن ۱۰ (۵ + ۵)
  if ((article.h1 ?? "").trim()) score += 5;
  else issues.push("h1 مقاله خالی است");
  if ((article.coverAlt ?? "").trim()) score += 5;
  else issues.push("متن جایگزین تصویر کاور خالی است");

  return { score, issues };
}

/* ───────────────── تولید محتوای جایگزین (LLM) ───────────────── */

/**
 * تولید پاسخ‌های سریع و سوالات متداول جاافتاده یک مقاله و انتشار مجدد آن.
 * خروجی: true یعنی مقاله با موفقیت به‌روزرسانی و منتشر شد.
 */
async function backfillArticle(article: BlogArticle, zai: ZaiClient): Promise<boolean> {
  const haveQa = article.quickAnswers?.length ?? 0;
  const haveFaq = article.faqs?.length ?? 0;
  const needQa = Math.max(0, TARGET_QUICK_ANSWERS - haveQa);
  const needFaq = Math.max(0, TARGET_FAQS - haveFaq);
  if (!needQa && !needFaq) return false;

  const existingQuestions = [
    ...(article.quickAnswers ?? []).map((p) => p.q),
    ...(article.faqs ?? []).map((p) => p.q),
  ];

  const res = await zai.chat.completions.create({
    messages: [
      {
        role: "assistant",
        content:
          "تو متخصص AEO و ویرایشگر محتوای پزشکی سایت دکتر پدرام بخشایی (جراح دهان، فک و صورت در تهران) هستی. " +
          "وظیفه‌ات تولید سوال و جواب فارسی، دقیق، بی‌طرف و بدون آمار ساختگی برای موتورهای پاسخ‌محور (Google، ChatGPT، Perplexity) است. " +
          "پاسخ‌ها ۴۰ تا ۸۰ کلمه، مستقیم و قابل نقل‌قول باشند. از سوالات موجود تکرار نگیر. " +
          "فقط و فقط JSON معتبر برگردان؛ هیچ توضیح اضافه یا markdown ننویس.",
      },
      {
        role: "user",
        content: [
          `عنوان مقاله: ${article.h1 || article.metaTitle || article.slug}`,
          article.excerpt ? `چکیده: ${article.excerpt}` : "",
          existingQuestions.length
            ? `سوالات موجود (تکراری نساز): ${existingQuestions.join(" | ")}`
            : "مقاله فعلاً سوال و جواب ساختاریافته ندارد.",
          "",
          needQa > 0 ? `${fa(needQa)} پاسخ سریع جدید (سوال مستقیم کاربر + پاسخ ۴۰-۸۰ کلمه‌ای) تولید کن.` : "",
          needFaq > 0 ? `${fa(needFaq)} سوال متداول جدید (پاسخ ۶۰-۱۲۰ کلمه‌ای) تولید کن.` : "",
          "خروجی JSON دقیقاً با این ساختار:",
          '{"quickAnswers":[{"q":"...","a":"..."}],"faqs":[{"q":"...","a":"..."}]}',
          needQa === 0 ? '(آرایه quickAnswers را خالی "[]" برگردان)' : "",
          needFaq === 0 ? '(آرایه faqs را خالی "[]" برگردان)' : "",
        ]
          .filter(Boolean)
          .join("\n"),
      },
    ],
    thinking: { type: "disabled" },
  });

  const payload = parseAeoPayload(res.choices[0]?.message?.content ?? "");
  const quickAnswers = mergePairs(article.quickAnswers ?? [], payload.quickAnswers, TARGET_QUICK_ANSWERS);
  const faqs = mergePairs(article.faqs ?? [], payload.faqs, TARGET_FAQS);

  const improved =
    quickAnswers.length > haveQa || faqs.length > haveFaq;
  if (!improved) throw new Error("مدل محتوای قابل استفاده‌ای برگردان نکرد");

  const published = await publishPost({
    title: article.metaTitle || article.h1 || article.slug,
    description: article.metaDesc ?? "",
    slug: article.slug,
    article: { ...article, quickAnswers, faqs } as unknown as Record<string, unknown>,
    source: "aeo",
  });
  return published.ok;
}

/* ───────────────── کنترل اسکیما (فقط گزارش) ───────────────── */

interface SchemaChecks {
  speakable: boolean;
  faqPage: boolean;
  articleOrMedicalWebPage: boolean;
  breadcrumbList: boolean;
}

/**
 * خواندن متن src/lib/seo.tsx و بررسی وجود اسکیماهای AEO.
 * فقط گزارش است — هیچ تغییری در کد داده نمی‌شود. در محیط باندل‌شده ممکن است
 * فایل موجود نباشد؛ در آن صورت همه false و فقط warn می‌شود.
 */
async function checkSchemas(): Promise<SchemaChecks> {
  const checks: SchemaChecks = {
    speakable: false,
    faqPage: false,
    articleOrMedicalWebPage: false,
    breadcrumbList: false,
  };
  try {
    const source = await readFile(path.join(process.cwd(), "src", "lib", "seo.tsx"), "utf8");
    checks.speakable = source.includes("speakable");
    checks.faqPage = source.includes("FAQPage");
    checks.articleOrMedicalWebPage = source.includes("Article") || source.includes("MedicalWebPage");
    checks.breadcrumbList = source.includes("BreadcrumbList");
  } catch (e) {
    console.warn("[aeo-agent] خواندن src/lib/seo.tsx ممکن نشد؛ کنترل اسکیما رد شد:", e instanceof Error ? e.message : e);
  }
  return checks;
}

/* ───────────────── اجرای ایجنت ───────────────── */

export async function runAeoAgent(context: Record<string, unknown> = {}): Promise<AgentResult> {
  const freshSlug = typeof context.slug === "string" ? context.slug.trim() : "";
  const issues: string[] = [];
  const fixed: string[] = [];
  const pending: string[] = [];
  const scores: Record<string, number> = {};

  try {
    /* ۱) بارگذاری بایگانی merged + شناسایی مقاله‌های دیتابیس (قابل ترمیم) */
    const merged = await getMergedContent();
    const allArticles = (Array.isArray(merged.blog) ? merged.blog : []) as BlogArticle[];

    let dbSlugs = new Set<string>();
    let recentDbSlugs = new Set<string>();
    try {
      const rows = await db.blogPost.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take: 60,
        select: { id: true },
      });
      dbSlugs = new Set(rows.map((r) => r.id));
      recentDbSlugs = new Set(rows.slice(0, AUDIT_DB_CAP).map((r) => r.id));
    } catch (e) {
      console.warn("[aeo-agent] خواندن مقاله‌های دیتابیس ناموفق؛ همه مقاله‌ها گزارش‌فقط در نظر گرفته می‌شوند:", e instanceof Error ? e.message : e);
    }

    const staticCount = allArticles.filter((a) => !dbSlugs.has(a.slug)).length;

    /* ۲) بایگانی خالی → خروجی آرام بدون خطا */
    if (!allArticles.length) {
      return {
        summary: "ممیزی AEO: بایگانی مقاله خالی است؛ چیزی برای ممیزی وجود نداشت",
        details: { audited: 0, averageScore: 0, fixed, pending, issues, schemaChecks: await checkSchemas(), staticCount },
      };
    }

    /* ۳) مجموعه ممیزی: مقاله تازه (قلاب) + ۱۵ مقاله جدید دیتابیس — بقیه فقط شمارش */
    const auditSlugs = new Set(recentDbSlugs);
    if (freshSlug) auditSlugs.add(freshSlug);
    const auditedArticles = allArticles.filter((a) => auditSlugs.has(a.slug));

    /* ۴) امتیازدهی — خطای هر مقاله جریان را نمی‌شکند */
    for (const article of auditedArticles) {
      try {
        const audit = auditArticle(article);
        scores[article.slug] = audit.score;
        for (const issue of audit.issues) issues.push(`${article.slug}: ${issue}`);
      } catch (e) {
        console.warn(`[aeo-agent] ممیزی «${article.slug}» ناموفق بود:`, e instanceof Error ? e.message : e);
      }
    }

    /* ۵) کاندیدهای ترمیم: مقاله دیتابیس با امتیاز کمتر از آستانه و محتوای جاافتاده */
    const needsContent = (a: BlogArticle) =>
      (a.quickAnswers?.length ?? 0) < TARGET_QUICK_ANSWERS || (a.faqs?.length ?? 0) < TARGET_FAQS;
    const candidates = auditedArticles
      .filter((a) => (scores[a.slug] ?? 0) < BACKFILL_THRESHOLD && dbSlugs.has(a.slug) && needsContent(a))
      .sort((x, y) => Number(y.slug === freshSlug) - Number(x.slug === freshSlug));

    /* ۶) ترمیم با سقف ۲ مورد — مابقی به صف انتظار */
    let zai: ZaiClient | null = null;
    for (const candidate of candidates) {
      if (fixed.length >= MAX_BACKFILLS) {
        pending.push(candidate.slug);
        continue;
      }
      try {
        zai ??= await ZAI.create();
        const ok = await backfillArticle(candidate, zai);
        if (ok) fixed.push(candidate.slug);
        else pending.push(candidate.slug);
      } catch (e) {
        console.warn(`[aeo-agent] ترمیم «${candidate.slug}» ناموفق بود:`, e instanceof Error ? e.message : e);
        pending.push(candidate.slug);
      }
    }

    /* ۷) کنترل اسکیماهای AEO — فقط گزارش */
    const schemaChecks = await checkSchemas();

    /* ۸) خلاصه فارسی با رقم‌های فارسی */
    const auditedCount = auditedArticles.length;
    const averageScore = auditedCount
      ? Math.round(Object.values(scores).reduce((sum, s) => sum + s, 0) / auditedCount)
      : 0;
    let summary = `ممیزی AEO: ${fa(auditedCount)} مقاله؛ میانگین امتیاز ${fa(averageScore)}`;
    summary += fixed.length
      ? `؛ ${fa(fixed.length)} مقاله ترمیم شد (${fixed.join(", ")})`
      : "؛ بدون ترمیم";
    if (pending.length) summary += `؛ ${fa(pending.length)} مورد در صف انتظار`;
    if (freshSlug) summary += `؛ مقاله تازه: ${freshSlug}`;

    return {
      summary,
      details: {
        audited: auditedCount,
        averageScore,
        fixed,
        pending,
        issues,
        schemaChecks,
        scores,
        staticCount,
        freshSlug: freshSlug || null,
        backfillThreshold: BACKFILL_THRESHOLD,
        maxBackfills: MAX_BACKFILLS,
      },
    };
  } catch (e) {
    /* شکست کلی (مثلاً دسترسی دیتابیس) — باز هم AgentResult برمی‌گردیم، هرگز throw نمی‌کنیم */
    console.error("[aeo-agent] ممیزی کل بایگانی شکست خورد:", e);
    return {
      summary: "ممیزی AEO ناموفق بود؛ داده بایگانی خوانده نشد",
      details: { audited: 0, averageScore: 0, fixed, pending, issues, schemaChecks: await checkSchemas() },
    };
  }
}
