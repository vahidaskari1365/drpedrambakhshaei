/**
 * تست جامع سمت سرور — POST /api/admin/test (کلید ادمین)
 *
 * باتری بررسی: زیرساخت (SQLite/Prisma)، سلامت ۱۰ بند محتوایی (موتور مشترک health.ts)،
 * فایل‌های سئو و GEO، اسکیماهای JSON-LD، و سایت‌مپ.
 * پروب مسیرها/تصاویر/قفل ۴۰۱ سمت مرورگر انجام می‌شود (tests-tab) — این مسیر فقط باتری سرور.
 * نکته: این مسیر قبلاً وجود نداشت و دکمه «تست جامع سایت» پنل همیشه خطا می‌داد — اکنون ترمیم شد.
 */
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { computeHealth, seoFileChecks } from "@/lib/health";
import {
  websiteJsonLd,
  clinicJsonLd,
  physicianJsonLd,
  faqJsonLd,
  servicesJsonLd,
  reviewsJsonLd,
  pricesJsonLd,
  blogJsonLd,
} from "@/lib/seo";
import sitemapFn from "@/app/sitemap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Row {
  id: string;
  group: string;
  label: string;
  pass: boolean;
  detail: string;
  ms: number;
}

type CheckOut = { pass: boolean; detail: string };

/** اجرای زمان‌گیر با اندازه‌گیری ms — خطای هر بند، بقیه را نمی‌کشد */
async function timed(id: string, group: string, label: string, fn: () => Promise<CheckOut>): Promise<Row> {
  const t0 = Date.now();
  try {
    const out = await fn();
    return { id, group, label, ...out, ms: Date.now() - t0 };
  } catch (e) {
    return {
      id,
      group,
      label,
      pass: false,
      detail: e instanceof Error ? e.message.slice(0, 160) : "خطای ناشناخته",
      ms: Date.now() - t0,
    };
  }
}

/** اعتبارسنجی خروجی سازنده اسکیما — باید JSON معتبر با حداقل یک @type باشد */
function jsonLdOk(data: object): CheckOut {
  try {
    const s = JSON.stringify(data);
    if (!s || s === "{}") return { pass: false, detail: "خروجی خالی" };
    JSON.parse(s);
    const nodes = (s.match(/"@type":"/g) ?? []).length;
    return nodes > 0
      ? { pass: true, detail: `JSON معتبر — ${nodes.toLocaleString("fa-IR")} گره @type` }
      : { pass: false, detail: "بدون فیلد @type" };
  } catch {
    return { pass: false, detail: "JSON نامعتبر" };
  }
}

export async function POST(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;

  const rows: Row[] = [];

  // ─── زیرساخت ───
  rows.push(
    await timed("db-ping", "زیرساخت", "اتصال دیتابیس (SQLite + Prisma)", async () => {
      await db.$queryRaw`SELECT 1`;
      return { pass: true, detail: "SELECT 1 موفق — پاسخ‌گوی سریع" };
    })
  );
  rows.push(
    await timed("db-tables", "زیرساخت", "جداول اصلی در دسترس‌اند", async () => {
      const [posts, media, runs, topics, contacts] = await Promise.all([
        db.blogPost.count(),
        db.media.count(),
        db.agentRun.count(),
        db.topicIdea.count(),
        db.contactRequest.count(),
      ]);
      return {
        pass: true,
        detail: `مقالات ${posts.toLocaleString("fa-IR")} · رسانه ${media.toLocaleString("fa-IR")} · اجراهای ایجنت ${runs.toLocaleString("fa-IR")} · ایده‌ها ${topics.toLocaleString("fa-IR")} · درخواست‌ها ${contacts.toLocaleString("fa-IR")}`,
      };
    })
  );

  // ─── سلامت محتوا (موتور مشترک داشبورد و تست) ───
  const { checks, content } = await computeHealth();
  for (const c of checks) {
    rows.push({
      id: `content-${c.id}`,
      group: "محتوا",
      label: c.label,
      pass: c.pass,
      detail: c.warn && !c.pass ? `${c.detail} (هشدار)` : c.detail,
      ms: 0,
    });
  }

  // ─── فایل‌های سئو و GEO ───
  for (const f of seoFileChecks()) {
    rows.push({
      id: `file-${f.label}`,
      group: "سئو و GEO",
      label: f.label,
      pass: f.pass,
      detail: f.pass ? "روی دیسک حاضر است" : "یافت نشد",
      ms: 0,
    });
  }
  rows.push(
    await timed("robots-sitemap-directive", "سئو و GEO", "robots.ts سیت‌مپ دارد و کرالرهای AI را اجازه می‌دهد", async () => {
      // robots.txt داینامیک از این سورس سرو می‌شود (نسخه استاتیک public حذف شده)
      const src = await fs.promises.readFile(path.join(process.cwd(), "src", "app", "robots.ts"), "utf-8");
      const hasSitemap = /sitemap/i.test(src);
      const crawlers = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"].filter((b) => src.includes(b));
      const ok = hasSitemap && crawlers.length >= 4;
      return {
        pass: ok,
        detail: `دستور Sitemap: ${hasSitemap ? "✓" : "✗"} — کرالرهای AI مجاز: ${crawlers.length.toLocaleString("fa-IR")} از ۴`,
      };
    })
  );

  // ─── اسکیماهای JSON-LD (سازنده‌های واقعی سایت با محتوای زنده) ───
  const schemas: [string, () => object][] = [
    ["WebSite", () => websiteJsonLd()],
    ["Dentist/Clinic", () => clinicJsonLd(content.site)],
    ["Physician", () => physicianJsonLd(content.site)],
    ["FAQPage", () => faqJsonLd(content.faq)],
    ["Service", () => servicesJsonLd(content.services)],
    ["Review", () => reviewsJsonLd(content.reviews)],
    ["PriceList", () => pricesJsonLd(content.priceTabs)],
    ["Blog", () => blogJsonLd(content.blog)],
  ];
  for (const [name, fn] of schemas) {
    rows.push(await timed(`schema-${name}`, "اسکیما JSON-LD", `اسکیمای ${name}`, async () => jsonLdOk(fn())));
  }

  // ─── سایت‌مپ ───
  rows.push(
    await timed("sitemap", "سایت‌مپ", "تولید سایت‌مپ زنده", async () => {
      const entries = await sitemapFn();
      const blogUrls = entries.filter((e) => String(e.url).includes("/blog/")).length;
      const ok = entries.length >= 10 && blogUrls >= 1;
      return {
        pass: ok,
        detail: `${entries.length.toLocaleString("fa-IR")} آدرس (${blogUrls.toLocaleString("fa-IR")} مقاله)${ok ? "" : " — کمتر از حد انتظار"}`,
      };
    })
  );

  const passed = rows.filter((r) => r.pass).length;
  return NextResponse.json({
    ok: true,
    rows,
    passed,
    total: rows.length,
    score: Math.round((passed / Math.max(rows.length, 1)) * 100),
    ranAt: new Date().toISOString(),
  });
}
