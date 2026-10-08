/**
 * موتور بررسی سلامت محتوا — مشترک بین داشبورد ادمین و تست جامع
 * خواندن محتوای merge‌شده + فایل‌ها روی دیسک + دیتابیس
 */
import fs from "fs";
import path from "path";
import { db } from "./db";
import {
  CONTENT_KEYS,
  CONTENT_LABELS,
  countWords,
  type ContentKey,
  type SiteContent,
} from "./site-content";
import { getMergedContent } from "./content-store";

export interface HealthCheck {
  id: string;
  label: string;
  pass: boolean;
  warn?: boolean;
  detail: string;
}

/** همه مسیرهای تصویر داخل محتوا */
export function collectImages(content: SiteContent): string[] {
  const set = new Set<string>();
  const push = (v: unknown) => {
    if (typeof v === "string" && v.startsWith("/uploads/")) set.add(v);
  };
  const walk = (v: unknown) => {
    if (v == null) return;
    if (Array.isArray(v)) return v.forEach(walk);
    if (typeof v === "object") return Object.values(v).forEach(walk);
    push(v);
  };
  walk(content);
  return [...set];
}

/** فایل‌های حیاتی سئو/PWA در public */
export function seoFileChecks(): { label: string; pass: boolean }[] {
  const files = [
    "manifest.webmanifest",
    "sw.js",
    "llms.txt",
    "llms-full.txt",
    "uploads/og-image.jpg",
    "icon-192.png",
    "icon-512.png",
  ];
  return files.map((f) => ({
    label: `فایل public/${f}`,
    pass: fs.existsSync(path.join(process.cwd(), "public", f)),
  }));
}

function wordsOf(v: unknown): number {
  return countWords(v);
}

/** بررسی‌های سلامت محتوا — خروجی برای حلقه امتیاز و چک‌لیست */
export async function computeHealth(): Promise<{
  score: number;
  checks: HealthCheck[];
  content: SiteContent;
}> {
  const content = await getMergedContent();
  const checks: HealthCheck[] = [];
  const add = (id: string, label: string, pass: boolean, detail: string, warn = false) =>
    checks.push({ id, label, pass, warn, detail });

  // ─── مجموعه‌های خالی نیستند ───
  const emptyKeys: string[] = [];
  for (const key of CONTENT_KEYS) {
    const v = content[key];
    const size = Array.isArray(v)
      ? v.length
      : typeof v === "object" && v !== null
        ? Object.keys(v).length
        : String(v ?? "").length;
    if (size === 0) emptyKeys.push(CONTENT_LABELS[key]);
  }
  add(
    "collections",
    "تمام مجموعه‌های محتوایی پر هستند",
    emptyKeys.length === 0,
    emptyKeys.length ? `خالی: ${emptyKeys.join("، ")}` : `${CONTENT_KEYS.length} مجموعه سالم`
  );

  // ─── اطلاعات مطب ───
  const s = content.site;
  const siteOk = Boolean(s.phone && s.address && s.hours && s.name);
  add("site-info", "اطلاعات تماس مطب کامل است", siteOk, siteOk ? `تلفن ${s.phone} — ${s.shortAddress}` : "فیلد تلفن/آدرس/ساعات خالی است");

  // ─── خدمات: تصویر و توضیح ───
  const missingService = content.services.filter((x) => !x.title || !x.desc || !x.image);
  add(
    "services",
    "هر خدمت عنوان، توضیح و تصویر دارد",
    content.services.length >= 3 && missingService.length === 0,
    `${content.services.length.toLocaleString("fa-IR")} خدمت${missingService.length ? ` — ناقص: ${missingService.length}` : ""}`
  );

  // ─── تعرفه‌ها ───
  const weakTabs = content.priceTabs.filter((t) => !t.rows || t.rows.length < 3);
  add(
    "prices",
    "جدول‌های تعرفه ۱۴۰۵ کامل‌اند",
    content.priceTabs.length >= 3 && weakTabs.length === 0,
    `${content.priceTabs.length.toLocaleString("fa-IR")} تب — ${content.priceTabs.reduce((a, t) => a + t.rows.length, 0).toLocaleString("fa-IR")} ردیف قیمت`
  );

  // ─── FAQ ───
  const shortAnswers = [...content.faq, ...content.priceFaqs].filter((f) => (f.a ?? "").length < 40);
  add(
    "faq",
    "پاسخ سوالات متداول به‌اندازه کافی مفصل است",
    shortAnswers.length === 0,
    `${(content.faq.length + content.priceFaqs.length).toLocaleString("fa-IR")} سوال${shortAnswers.length ? ` — کوتاه: ${shortAnswers.length}` : " — عمق مناسب برای AEO"}`
  );

  // ─── نظرات ───
  add(
    "reviews",
    "نظرات واقعی مراجعین ثبت شده",
    content.reviews.length >= 5,
    `${content.reviews.length.toLocaleString("fa-IR")} نظر واقعی`
  );

  // ─── تصاویر روی دیسک ───
  const images = collectImages(content);
  const missing = images.filter(
    (p) => !fs.existsSync(path.join(process.cwd(), "public", p))
  );
  add(
    "images",
    "همه تصاویر محتوا روی سرور موجودند",
    missing.length === 0,
    `${images.length.toLocaleString("fa-IR")} تصویر${missing.length ? ` — گم‌شده: ${missing.join("، ")}` : ""}`
  );

  // ─── فایل‌های سئو/PWA ───
  const fileChecks = seoFileChecks();
  const missingFiles = fileChecks.filter((f) => !f.pass);
  add(
    "seo-files",
    "فایل‌های سئو و PWA حاضرند",
    missingFiles.length === 0,
    missingFiles.length ? `ناقص: ${missingFiles.map((f) => f.label).join("، ")}` : `${fileChecks.length.toLocaleString("fa-IR")} فایل حیاتی`
  );

  // ─── بلاگ / AEO ───
  const blogIssues: string[] = [];
  for (const a of content.blog) {
    if (a.metaTitle.length < 15 || a.metaTitle.length > 70) blogIssues.push("عنوان متا");
    if (a.metaDesc.length < 80 || a.metaDesc.length > 200) blogIssues.push("توضیح متا");
    if (a.keywords.length < 5) blogIssues.push("کلیدواژه کم");
    if (a.quickAnswers.length < 3) blogIssues.push("پاسخ سریع کم");
    const h2s = a.blocks.filter((b) => b.type === "h2").length;
    if (h2s < 2) blogIssues.push("ساختار H2");
  }
  const totalBlogWords = content.blog.reduce((acc, a) => acc + (a.wordCount || 0), 0);
  add(
    "blog-aeo",
    "مقالات بلاگ استاندارد AEO را رعایت می‌کنند",
    content.blog.length >= 1 && blogIssues.length === 0,
    content.blog.length
      ? `${content.blog.length.toLocaleString("fa-IR")} مقاله — ${totalBlogWords.toLocaleString("fa-IR")} کلمه${blogIssues.length ? ` — هشدار: ${[...new Set(blogIssues)].join("، ")}` : ""}`
      : "هیچ مقاله‌ای منتشر نشده",
    content.blog.length === 0
  );

  // ─── دیتابیس ───
  let dbOk = true;
  try {
    await db.$queryRaw`SELECT 1`;
  } catch {
    dbOk = false;
  }
  add("db", "اتصال دیتابیس (SQLite + Prisma)", dbOk, dbOk ? "پاسخ‌گویی سریع" : "خطای اتصال");

  const passed = checks.filter((c) => c.pass).length;
  const warned = checks.filter((c) => c.warn && !c.pass).length;
  const score = Math.round(((passed + warned * 0.5) / checks.length) * 100);

  return { score, checks, content };
}
