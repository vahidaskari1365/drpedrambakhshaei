/**
 * ایجنت ۴ — اتصال Google Search Console + تحلیل داخلی و ایندکس‌سازی
 *
 * دو حالت اجرا:
 *  - حالت API: با متغیرهای محیطی GSC_SERVICE_ACCOUNT_JSON (JSON کامل سرویس‌اکانت گوگل
 *    شامل client_email و private_key) و GSC_SITE_URL (پیش‌فرض https://drpedrambakhshaei.com/):
 *      ۱) ورود JWT-Bearer با node:crypto (بدون هیچ وابستگی خارجی)
 *      ۲) ثبت/به‌روزرسانی نقشه سایت (sitemap.xml) در سرچ کنسول
 *      ۳) دریافت ۱۰ کوئری برتر ۷ روز اخیر (Search Analytics API)
 *      ۴) بازرسی وضعیت ایندکس ۵ مقاله جدیدتر با URL Inspection API
 *  - حالت دستی: بدون اعتبارنامه — تحلیل داخلی بازدیدها (db.visit) + چک‌لیست
 *    ۴ مرحله‌ای سرچ کنسول + راهنمای دقیق فعال‌سازی حالت API در خلاصه
 *
 * قوانین سخت: هرگز خطا پرتاب نمی‌کند؛ خطای هر گام فقط console.warn و ادامه؛
 * خروجی همیشه AgentResult با خلاصه فارسی است.
 */
import { createSign } from "node:crypto";
import { db } from "@/lib/db";
import { getMergedContent } from "@/lib/content-store";
import type { AgentResult } from "./runner";

/* ───────────────── ثابت‌ها ───────────────── */

const SITE_ORIGIN = "https://drpedrambakhshaei.com";
const DEFAULT_SITE_URL = `${SITE_ORIGIN}/`;
const SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`;
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const WEBMASTERS_API = "https://www.googleapis.com/webmasters/v3";
const INSPECT_API = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";
const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters";
const FETCH_TIMEOUT_MS = 10_000;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** تبدیل ارقام لاتین به فارسی برای خلاصه‌ها */
const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
function faNum(n: number): string {
  return String(n).replace(/\d/g, (d) => FA_DIGITS.charAt(Number(d)));
}

/** تاریخ ISO (yyyy-mm-dd) برای پارامترهای startDate/endDate سرچ کنسول */
function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/* ───────────────── ابزار شبکه ───────────────── */

interface FetchOutcome {
  ok: boolean;
  status: number;
  body: unknown;
}

/** fetch با تایم‌اوت ۱۰ ثانیه (AbortController) — هرگز پرتاب نمی‌کند؛ خطا در نتیجه برمی‌گردد */
async function safeFetch(url: string, init: RequestInit = {}): Promise<FetchOutcome> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    const text = await res.text();
    let body: unknown = null;
    if (text) {
      try {
        body = JSON.parse(text) as unknown;
      } catch {
        body = text; // پاسخ غیر JSON (مثلاً HTML خطای سرور) عیناً نگه داشته می‌شود
      }
    }
    return { ok: res.ok, status: res.status, body };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, body: { error: msg } };
  } finally {
    clearTimeout(timer);
  }
}

/* ───────────────── اعتبارنامه و JWT (فقط node:crypto) ───────────────── */

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

/** پارس JSON سرویس‌اکانت از متغیر محیطی — هر خطا یعنی null (حالت دستی) */
function parseServiceAccount(raw: string | undefined): ServiceAccount | null {
  if (!raw || !raw.trim()) return null;
  try {
    const obj = JSON.parse(raw) as { client_email?: unknown; private_key?: unknown };
    if (typeof obj.client_email === "string" && obj.client_email && typeof obj.private_key === "string" && obj.private_key) {
      return { client_email: obj.client_email, private_key: obj.private_key };
    }
    console.warn("[gsc-agent] GSC_SERVICE_ACCOUNT_JSON فاقد client_email/private_key است → حالت دستی");
  } catch (e) {
    console.warn("[gsc-agent] GSC_SERVICE_ACCOUNT_JSON معتبر نیست → حالت دستی:", e instanceof Error ? e.message : e);
  }
  return null;
}

/** Base64url استاندارد JWT (Buffer با انکودینگ base64url) */
function b64u(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

/**
 * ورود JWT-Bearer به OAuth2 گوگل — امضای RS256 با crypto.createSign، بدون کتابخانه خارجی.
 * header {alg:RS256,typ:JWT} + claims {iss,scope,aud,exp,iat} → POST به endpoint توکن
 */
async function getAccessToken(sa: ServiceAccount): Promise<string | null> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const claims = {
      iss: sa.client_email,
      scope: GSC_SCOPE,
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    };
    const signingInput = `${b64u(JSON.stringify(header))}.${b64u(JSON.stringify(claims))}`;
    const signer = createSign("RSA-SHA256");
    signer.update(signingInput);
    const jwt = `${signingInput}.${b64u(signer.sign(sa.private_key))}`;

    const form = new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    });
    const res = await safeFetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    const token = (res.body as { access_token?: unknown } | null)?.access_token;
    if (res.ok && typeof token === "string" && token) return token;
    console.warn("[gsc-agent] دریافت توکن OAuth ناموفق بود:", res.status, JSON.stringify(res.body)?.slice(0, 400));
  } catch (e) {
    console.warn("[gsc-agent] خطای جریان JWT:", e instanceof Error ? e.message : e);
  }
  return null;
}

/* ───────────────── تحلیل پاسخ‌های API (تایپ امن روی unknown) ───────────────── */

interface TopQuery {
  keys: string[];
  clicks: number;
  impressions: number;
}

/** استخراج سطرهای Search Analytics از پاسخ ناشناخته */
function parseQueryRows(body: unknown): TopQuery[] {
  const rows = (body as { rows?: unknown } | null)?.rows;
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => {
    const row = r as { keys?: unknown; clicks?: unknown; impressions?: unknown };
    return {
      keys: Array.isArray(row.keys) ? row.keys.map(String) : [],
      clicks: typeof row.clicks === "number" ? row.clicks : 0,
      impressions: typeof row.impressions === "number" ? row.impressions : 0,
    };
  });
}

/** استخراج وضعیت ایندکس از پاسخ URL Inspection (verdict + توضیح coverageState) */
function parseIndexStatus(body: unknown): string {
  const status = (
    body as { inspectionResult?: { indexStatusResult?: { verdict?: unknown; coverageState?: unknown } } } | null
  )?.inspectionResult?.indexStatusResult;
  if (!status) return "نامشخص";
  const verdict = typeof status.verdict === "string" ? status.verdict : "";
  const coverage = typeof status.coverageState === "string" ? status.coverageState : "";
  return [verdict, coverage].filter(Boolean).join(" — ") || "نامشخص";
}

/* ───────────────── محتوای بلاگ (ادغام پیش‌فرض کد + دیتابیس) ───────────────── */

/** N اسلاگ جدیدترین مقاله‌ها بر اساس تاریخ انتشار */
async function newestBlogSlugs(limit: number): Promise<string[]> {
  const content = await getMergedContent();
  return [...content.blog]
    .sort((a, b) => (b.publishDate || "").localeCompare(a.publishDate || ""))
    .slice(0, limit)
    .map((a) => a.slug);
}

/* ───────────────── تحلیل داخلی (بدون API گوگل) ───────────────── */

interface InternalInsights {
  topPaths: { path: string; visits: number }[];
  zeroVisitSlugs: string[];
}

/** ۱۰ مسیر پرترافیک ۷ روز اخیر از db.visit + اسلاگ‌های مقاله بدون هیچ بازدیدی (کاندید ایندکس مجدد) */
async function collectInternalInsights(): Promise<InternalInsights> {
  const since = new Date(Date.now() - WEEK_MS);
  const grouped = await db.visit.groupBy({
    by: ["path"],
    where: { createdAt: { gte: since } },
    _count: { path: true },
  });
  const topPaths = grouped
    .map((r) => ({ path: r.path, visits: r._count.path }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10);
  const visited = new Set(grouped.map((r) => r.path));
  const slugs = await newestBlogSlugs(50);
  const zeroVisitSlugs = slugs.filter((slug) => !visited.has(`/blog/${slug}`));
  return { topPaths, zeroVisitSlugs };
}

/* ───────────────── چک‌لیست حالت دستی ───────────────── */

/** چک‌لیست ۴ مرحله‌ای دستی — لینک مستقیم هر مرحله در سرچ کنسول */
function buildManualChecklist(newestSlug?: string): { step: string; url: string }[] {
  const resource = encodeURIComponent("sc-domain:drpedrambakhshaei.com");
  const newestUrl = newestSlug ? `${SITE_ORIGIN}/blog/${newestSlug}` : `${SITE_ORIGIN}/`;
  return [
    {
      step: "ثبت/به‌روزرسانی نقشه سایت در سرچ کنسول",
      url: `https://search.google.com/search-console/sitemaps?resource_id=${resource}`,
    },
    {
      step: "درخواست ایندکس جدیدترین مقاله با ابزار URL Inspection",
      url: `https://search.google.com/search-console/inspect?resource_id=${resource}&id=${encodeURIComponent(newestUrl)}`,
    },
    {
      step: "بررسی گزارش پوشش ایندکس (Pages/Coverage) برای خطاهای ایندکس‌سازی",
      url: `https://search.google.com/search-console/index?resource_id=${resource}`,
    },
    {
      step: "بررسی robots.txt و اطمینان از بلاک نشدن صفحات مهم",
      url: `https://search.google.com/search-console/robots?resource_id=${resource}`,
    },
  ];
}

/* ───────────────── حالت API ───────────────── */

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

/** اجرای حالت API: توکن → ثبت نقشه سایت → کوئری‌های برتر → بازرسی ۵ URL */
async function runApiMode(sa: ServiceAccount, siteUrl: string): Promise<AgentResult> {
  const details: Record<string, unknown> = { mode: "api", siteUrl };
  const parts: string[] = [];
  let failures = 0;

  /* گام ۰ — توکن؛ در شکست، تحلیل داخلی به‌عنوان فال‌بک ارزشمند انجام می‌شود */
  const token = await getAccessToken(sa);
  if (!token) {
    details.error = "دریافت توکن OAuth ناموفق بود — client_email/private_key یا دسترسی سرویس‌اکانت به پراپرتی را بررسی کنید";
    try {
      const insights = await collectInternalInsights();
      details.topPaths = insights.topPaths;
      details.zeroVisitSlugs = insights.zeroVisitSlugs;
      return {
        summary: `GSC (حالت API): دریافت توکن ناموفق بود؛ تحلیل داخلی جایگزین شد — ${faNum(insights.topPaths.length)} مسیر پرترافیک، ${faNum(insights.zeroVisitSlugs.length)} صفحه بدون بازدید`,
        details,
      };
    } catch (e) {
      console.warn("[gsc-agent] فال‌بک تحلیل داخلی هم ناموفق بود:", e instanceof Error ? e.message : e);
      return { summary: "GSC (حالت API): دریافت توکن OAuth ناموفق بود — جزئیات در details", details };
    }
  }
  details.tokenOk = true;

  /* الف) ثبت نقشه سایت (PUT sitemaps با feedpath) */
  try {
    const url = `${WEBMASTERS_API}/sites/${encodeURIComponent(siteUrl)}/sitemaps?feedpath=${encodeURIComponent(SITEMAP_URL)}`;
    const res = await safeFetch(url, { method: "PUT", headers: authHeaders(token) });
    details.sitemap = { ok: res.ok, status: res.status, sitemap: SITEMAP_URL };
    if (res.ok) {
      parts.push("نقشه سایت ثبت شد");
    } else {
      failures++;
      console.warn("[gsc-agent] ثبت نقشه سایت ناموفق بود:", res.status, JSON.stringify(res.body)?.slice(0, 300));
    }
  } catch (e) {
    failures++;
    details.sitemap = { ok: false, error: e instanceof Error ? e.message : String(e) };
    console.warn("[gsc-agent] خطای گام نقشه سایت:", e instanceof Error ? e.message : e);
  }

  /* ب) ۱۰ کوئری برتر ۷ روز اخیر (Search Analytics) */
  try {
    const end = new Date();
    const start = new Date(end.getTime() - WEEK_MS);
    const res = await safeFetch(`${WEBMASTERS_API}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
      method: "POST",
      headers: { ...authHeaders(token), "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: isoDate(start), endDate: isoDate(end), dimensions: ["query"], rowLimit: 10 }),
    });
    const rows = parseQueryRows(res.body);
    details.topQueries = rows;
    if (!res.ok) {
      failures++;
      console.warn("[gsc-agent] دریافت کوئری‌های برتر ناموفق بود:", res.status, JSON.stringify(res.body)?.slice(0, 300));
    } else if (rows.length) {
      parts.push(`${faNum(rows.length)} کوئری برتر دریافت شد`);
    } else {
      parts.push("داده کوئری‌ای برای ۷ روز اخیر موجود نبود");
    }
  } catch (e) {
    failures++;
    console.warn("[gsc-agent] خطای گام کوئری‌های برتر:", e instanceof Error ? e.message : e);
  }

  /* ج) بازرسی وضعیت ایندکس ۵ مقاله جدیدتر (URL Inspection API) */
  try {
    const slugs = await newestBlogSlugs(5);
    const inspections: { url: string; indexStatus: string }[] = [];
    for (const slug of slugs) {
      const inspectionUrl = `${SITE_ORIGIN}/blog/${slug}`;
      try {
        const res = await safeFetch(INSPECT_API, {
          method: "POST",
          headers: { ...authHeaders(token), "Content-Type": "application/json" },
          body: JSON.stringify({ siteUrl, inspectionUrl }),
        });
        inspections.push({ url: inspectionUrl, indexStatus: parseIndexStatus(res.body) });
        if (!res.ok) {
          console.warn(`[gsc-agent] بازرسی ${inspectionUrl} ناموفق بود:`, res.status);
        }
      } catch (e) {
        inspections.push({ url: inspectionUrl, indexStatus: "خطا در بازرسی" });
        console.warn(`[gsc-agent] خطای بازرسی ${inspectionUrl}:`, e instanceof Error ? e.message : e);
      }
    }
    details.inspections = inspections;
    if (inspections.length) parts.push(`${faNum(inspections.length)} URL بازرسی شد`);
  } catch (e) {
    failures++;
    console.warn("[gsc-agent] خطای گام بازرسی URL:", e instanceof Error ? e.message : e);
  }

  const suffix = failures ? ` (${faNum(failures)} گام ناموفق — جزئیات در details)` : "";
  const summary = parts.length ? `GSC: ${parts.join("؛ ")}${suffix}` : `GSC (حالت API): هیچ گام موفقی ثبت نشد${suffix}`;
  return { summary, details };
}

/* ───────────────── حالت دستی (بدون اعتبارنامه) ───────────────── */

/** اجرای حالت دستی: تحلیل داخلی بازدیدها + چک‌لیست ۴ مرحله‌ای؛ هرگز پرتاب نمی‌کند */
async function runManualMode(): Promise<AgentResult> {
  const details: Record<string, unknown> = { mode: "manual" };
  let zeroCount = 0;
  let newestSlug: string | undefined;

  try {
    newestSlug = (await newestBlogSlugs(1))[0];
  } catch (e) {
    console.warn("[gsc-agent] دریافت مقاله‌های بلاگ ناموفق بود:", e instanceof Error ? e.message : e);
  }

  try {
    const insights = await collectInternalInsights();
    details.topPaths = insights.topPaths;
    details.zeroVisitSlugs = insights.zeroVisitSlugs;
    zeroCount = insights.zeroVisitSlugs.length;
  } catch (e) {
    console.warn("[gsc-agent] تحلیل داخلی بازدیدها ناموفق بود:", e instanceof Error ? e.message : e);
  }

  const checklist = buildManualChecklist(newestSlug);
  details.manualChecklist = checklist;

  return {
    summary: `GSC (حالت دستی): چک‌لیست ${faNum(checklist.length)} مرحله‌ای + ${faNum(zeroCount)} صفحه بدون بازدید شناسایی شد — برای فعال‌سازی حالت API، متغیرهای GSC_SERVICE_ACCOUNT_JSON (JSON کامل سرویس‌اکانت با client_email و private_key) و GSC_SITE_URL (پیش‌فرض ${DEFAULT_SITE_URL}) را تنظیم کنید`,
    details,
  };
}

/* ───────────────── نقطه ورود ایجنت ───────────────── */

/** تشخیص حالت و اجرا — هرگز خطا پرتاب نمی‌کند و همیشه AgentResult برمی‌گرداند */
export async function runGscAgent(): Promise<AgentResult> {
  try {
    const sa = parseServiceAccount(process.env.GSC_SERVICE_ACCOUNT_JSON);
    if (!sa) return await runManualMode();
    const siteUrl = process.env.GSC_SITE_URL?.trim() || DEFAULT_SITE_URL;
    return await runApiMode(sa, siteUrl);
  } catch (e) {
    console.warn("[gsc-agent] خطای غیرمنتظره ایجنت GSC:", e instanceof Error ? e.message : e);
    return {
      summary: "GSC: اجرا با خطای غیرمنتظره متوقف شد ولی ایجنت کرش نکرد — جزئیات در details",
      details: {
        mode: process.env.GSC_SERVICE_ACCOUNT_JSON ? "api" : "manual",
        error: e instanceof Error ? e.message : String(e),
      },
    };
  }
}
