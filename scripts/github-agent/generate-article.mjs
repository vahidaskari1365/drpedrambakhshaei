#!/usr/bin/env node
/**
 * ایجنت محتوای رایگان — نسخه GitHub Actions
 *
 * کار: هر روز ۰۷:۰۰ تهران یک مقاله کامل و اورجینال درباره جراحی فک و صورت /
 * ایمپلنت تولید و در سایت منتشر می‌کند — «بدون هیچ هزینه‌ای»:
 *
 *   ۱) انتخاب موضوع از بانک topics.json (فقط موضوع تکراری نمی‌گیرد؛ state در مخزن ثبت می‌شود)
 *   ۲) نگارش مقاله با مدل رایگان GitHub Models (GITHUB_TOKEN — بدون کلید اضافه)
 *      در نبود آن: Pollinations (کاملاً رایگان و بدون کلید)
 *   ۳) تصویر کاور «مرتبط با همان موضوع» با تولید رایگان Pollinations image
 *      و آپلود در کتابخانه رسانه سایت (fallback: آدرس مستقیم یا گالری ثابت)
 *   ۴) انتشار از طریق POST /api/agents/publish با هدر x-admin-key
 *   ۵) ثبت وضعیت در scripts/github-agent/state.json (خودِ ورک‌فلو کامیت می‌کند)
 *
 * متغیرهای محیطی:
 *   SITE_URL    (پیش‌فرض https://drpedrambakhshaei.com)
 *   ADMIN_KEY   (اجباری برای انتشار)
 *   GITHUB_TOKEN (اختیاری — در Actions خودکار است؛ فعال‌کننده GitHub Models)
 *   FORCE=1     انتشار اجباری حتی اگر امروز مقاله منتشر شده باشد
 *   DRY_RUN=1   همه‌چیز اجرا می‌شود ولی انتشار و state انجام نمی‌شود
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

/* ───────────────── پیکربندی ───────────────── */

const SITE_URL = (process.env.SITE_URL || "https://drpedrambakhshaei.com").replace(/\/+$/, "");
const ADMIN_KEY = (process.env.ADMIN_KEY || "").trim();
const GH_TOKEN = (process.env.GITHUB_TOKEN || "").trim();
const FORCE = process.env.FORCE === "1" || process.env.FORCE === "true";
const DRY_RUN = process.env.DRY_RUN === "1";
const HERE = new URL(".", import.meta.url);
const TZ = "Asia/Tehran";
const MODEL = process.env.GH_MODEL || "openai/gpt-4o-mini";

const todayTehran = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date()); // YYYY-MM-DD

const faToday = () => {
  try {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      day: "numeric", month: "long", year: "numeric", timeZone: TZ,
    }).format(new Date());
  } catch { return ""; }
};

const sha = (s) => createHash("sha1").update(String(s)).digest("hex");
const log = (step, msg) => console.log(`[${step}] ${msg}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function loadJson(file, fallback) {
  try { return JSON.parse(readFileSync(new URL(file, HERE), "utf8")); }
  catch { return fallback; }
}

/* حقایق مطب — تنها منبع مجاز آمار و قیمت در مقاله (E-E-A-T) */
const CLINIC_FACTS = `نام مطب/پزشک: دکتر پدرام بخشایی — متخصص جراحی دهان، فک و صورت
تلفن: ۰۹۳۰۲۶۲۶۰۲۱ | آدرس: تهران، خیابان پاسداران، مرکز خرید پاسداران، طبقه ۲ و ۴
ساعات کاری: شنبه تا پنجشنبه — ۱۶:۰۰ تا ۲۰:۰۰
امتیاز گوگل: ۵ از ۵ (۹ نظر)
خدمات اصلی: جراحی زیبایی فک و صورت، ایمپلنت‌های پیشرفته دندانی، جراحی دندان‌های نهفته، ارتوسرجری فک، جنیوپلاستی
برندهای ایمپلنت و بازه قیمت (۱۴۰۵، تقریبی ±۵٪، تومان): CORE1 کره از ۲۵ میلیون | OSSTEM کره از ۳۵ میلیون | NEODENT برزیل از ۳۷ میلیون | ITI/STRAUMANN سوئیس از ۶۰ میلیون | ZIMMER آمریکا و BIO3 اروپا: مشاوره حضوری
تعرفه جراحی‌های دیگر ثابت اعلام نمی‌شود و پس از ویزیت و بررسی رادیوگرافی تعیین می‌گردد.`;

const STATIC_LINKS = [
  { href: "/services", label: "صفحه خدمات", desc: "فهرست کامل خدمات جراحی فک و صورت، ایمپلنت و دندان‌های نهفته" },
  { href: "/prices", label: "تعرفه‌های ۱۴۰۵", desc: "برندهای ایمپلنت و بازه‌های قیمت به‌روز" },
  { href: "/contact", label: "رزرو نوبت", desc: "ثبت درخواست مشاوره و نوبت‌دهی با دکتر بخشایی" },
  { href: "/about", label: "درباره دکتر بخشایی", desc: "رزومه، تخصص و تجربه جراح" },
];

/* ───────────────── LLM — زنجیره رایگان ───────────────── */

/** ترمیم‌های رایج JSON خراب مدل‌های کوچک (مثل جاافتادن {" قبل از type) */
function repairJson(text) {
  // الگوی «},{» بعدش یک کلید بدون باز شدن شیء جدید — در JSON سالم بعد از }  همیشه { می‌آید
  return text
    .replace(/\}\s*,\s*"(type|href|label|desc|q|a|head|rows|items)"/g, '},{"$1"')
    .replace(/,\s*([\]}])/g, "$1") // کامن انتهایی اضافه
    .trim();
}

function extractJson(raw) {
  const cleaned = String(raw || "").replace(/```json/gi, "").replace(/```/g, "").trim();
  try { return JSON.parse(cleaned); } catch { /* از اولین { تا آخرین } */ }
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) {
    const slice = cleaned.slice(start, end + 1);
    try { return JSON.parse(slice); } catch {
      try { return JSON.parse(repairJson(slice)); } catch { /* خطای اصلی زیر گزارش می‌شود */ }
    }
  }
  try { return JSON.parse(repairJson(cleaned)); } catch { /* خطای اصلی زیر گزارش می‌شود */ }
  throw new Error("پاسخ مدل JSON معتبر نبود");
}

async function callGithubModels(messages, maxTokens = 16000) {
  const res = await fetch("https://models.github.ai/inference/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "drpedram-content-agent",
    },
    body: JSON.stringify({ model: MODEL, messages, temperature: 0.7, max_tokens: maxTokens }),
    signal: AbortSignal.timeout(420_000),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`GitHub Models ${res.status}: ${raw.slice(0, 200)}`);
  if (!(res.headers.get("content-type") || "").includes("json")) {
    throw new Error(`GitHub Models پاسخ غیر JSON داد: ${raw.slice(0, 120)}`);
  }
  let data;
  try { data = JSON.parse(raw); } catch {
    throw new Error(`GitHub Models پاسخ JSON معتبر نداشت: ${raw.slice(0, 120)}`);
  }
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("GitHub Models: پاسخ خالی بود");
  return content;
}

async function callPollinations(messages, maxTokens = 16000) {
  const res = await fetch("https://text.pollinations.ai/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "openai-fast",
      reasoning_effort: "low", // بدون این، reasoning کل بودجه توکن را می‌خورد و content خالی می‌ماند
      messages,
      temperature: 0.7,
      max_tokens: maxTokens,
      private: true,
      referrer: "drpedrambakhshaei.com",
    }),
    signal: AbortSignal.timeout(420_000),
  });
  if (!res.ok) {
    const bodyText = (await res.text()).slice(0, 300);
    const retryAfter = Number(res.headers.get("retry-after")) || 0;
    const m = bodyText.match(/Retry after (\d+)/i);
    const waitSec = Math.max(retryAfter, m ? Number(m[1]) : 0);
    throw new Error(`POLLINATIONS_WAIT_${waitSec}|Pollinations ${res.status}: ${bodyText}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Pollinations: پاسخ خالی بود");
  return content;
}

/* ───────────────── مسیر جایگزین Markdown برای مدل‌های کوچک ───────────────── */

const SYSTEM_MD = `تو نویسنده ارشد محتوای پزشکی فارسی برای وب‌سایت دکتر پدرام بخشایی (جراح دهان، فک و صورت، تهران) هستی.

قوانین غیرقابل‌اجتماع:
1. اورجینال مطلق — هر جمله از صفر نوشته می‌شود. کپی/بازگویی نزدیک از هیچ منبعی ممنوع.
2. متن اصلی مقاله حداقل ۱۴۰۰ کلمه — کامل و بدون خلاصه‌نویسی.
3. غیر خسته‌کننده: شروع با قلاب واقعی یک بیمار (بدون اختراع آمار)، جمله‌های کوتاه، پرسش‌محور.
4. E-E-A-T: پاسخ مستقیم به سوال کاربر در پاراگراف اول هر بخش، هیچ ادعای اثبات‌نشده، ذکر ریسک‌ها.
5. آمار/هزینه فقط از «حقایق مطب»؛ برای بقیه هشدار «متغیر است، ویزیت لازم».
6. لحن احترام‌آمیز و امیدبخش، بدون ترساندن بیمار.

قالب پاسخ: دقیقاً همان قالبی که در پایان پیام کاربر آمده — بدون هیچ توضیح اضافه قبل یا بعد از آن.`;

const USER_MD = (topic, usedTitles) => `موضوع امروز: «${topic.title}»
زاویه پیشنهادی: ${topic.angle || "پاسخ جامع و کاربردی"}
کلیدواژه‌های هدف: ${(topic.keywords || []).join("، ")}

موضوع‌هایی که قبلاً منتشر شده‌اند — هیچ هم‌پوشانی نداشته باش:
${usedTitles.length ? usedTitles.map((t) => `- ${t}`).join("\n") : "(لیست خالی)"}

حقایق مطب (تنها منبع آمار مجاز):
${CLINIC_FACTS}

دقیقاً در این قالب پاسخ بده:

TITLE: (عنوان مقاله)
SLUG: (اسلاگ انگلیسی کوتاه مثل dental-implant-cost)
KICKER: (برچسب کوتاه فارسی)
META_TITLE: (حداکثر ۶۰ کاراکتر با کلیدواژه اصلی)
META_DESC: (۱۲۰ تا ۱۶۰ کاراکتر وسوسه‌کننده)
CATEGORY: (یکی از: جراحی فک و صورت | ایمپلنت دندان | دندان نهفته | سلامت دهان)
TAGS: (۴ تا ۶ تگ فارسی با ویرگول)
KEYWORDS: (۸ تا ۱۲ کلیدواژه سئو با ویرگول)
EXCERPT: (خلاصه ۲۰۰ تا ۲۸۰ کاراکتری)
====
(متن کامل مقاله با قواعد زیر — حداقل ۱۴۰۰ کلمه)
- پاراگراف اول: قلاب داستانی واقع‌نما از یک بیمار
- حداقل ۵ عنوان با ## که هر کدام یک سوال واقعی کاربر است
- بلافاصله بعد از هر ## یک پاراگراف پاسخ مستقیم ۲-۳ جمله‌ای، بعد توضیح کامل
- حداقل یک فهرست با - و حداقل یک جدول Markdown واقعی
- هشدار مهم با خط [WARN] عنوان: متن و نکته مفید با [TIP] عنوان: متن
- آخرین بخش، دقیقاً با این عنوان:
## سوالات متداول
Q: (سوال)
A: (پاسخ ۶۰ تا ۱۲۰ کلمه‌ای)
(حداقل ۴ جفت Q/A)`;

/** جدا کردن بخش سوالات متداول از بدنه */
function splitFaq(body) {
  const lines = String(body || "").split("\n");
  const keep = [];
  const faqs = [];
  let inFaq = false;
  let cur = null;
  for (const line of lines) {
    const t = line.trim();
    if (/^#{2,4}\s*(سوالات متداول|پرسش\u200cهای متداول|سوالات پرتکرار|پرسش های متداول)/.test(t)) {
      inFaq = true;
      cur = null;
      continue;
    }
    if (!inFaq) { keep.push(line); continue; }
    if (/^#{1,4}\s+/.test(t)) { inFaq = false; keep.push(line); continue; } // عنوان جدید بعد از FAQ
    const q = t.match(/^(?:Q|سوال|سؤال)\s*[:：]\s*(.+)/);
    const a = t.match(/^(?:A|پاسخ)\s*[:：]\s*(.+)/);
    if (q) { cur = { q: q[1].trim(), a: "" }; }
    else if (a && cur) { cur.a = a[1].trim(); faqs.push(cur); cur = null; }
    else if (cur && t && !/^[-*•]/.test(t)) cur.a += " " + t;
  }
  return { body: keep.join("\n").trim(), faqs };
}

/** Markdown بدنه → بلوک‌های مقاله — کاملاً قطعی و ضد خطا */
function mdToBlocks(md) {
  const blocks = [];
  let para = [];
  let list = null;
  let table = null;
  const flushPara = () => { if (para.length) { const t = para.join(" ").trim(); if (t) blocks.push({ type: "p", text: t }); para = []; } };
  const flushList = () => { if (list && list.items.length) blocks.push(list); list = null; };
  const flushTable = () => { if (table && table.rows.length) blocks.push(table); table = null; };
  const flushAll = () => { flushPara(); flushList(); flushTable(); };
  for (const rawLine of String(md || "").split("\n")) {
    const line = rawLine.trim();
    if (!line) { flushAll(); continue; }
    if (/^\|.*\|$/.test(line)) {
      flushPara(); flushList();
      const cells = line.split("|").slice(1, -1).map((c) => c.trim());
      if (cells.length >= 2 && cells.every((c) => /^:?-{2,}:?$/.test(c))) continue; // ردیف جداکننده
      if (!table) table = { type: "table", head: cells, rows: [] };
      else if (cells.length) table.rows.push(cells);
      continue;
    }
    if (/^[-*•]\s+/.test(line)) {
      flushPara(); flushTable();
      if (!list || list.ordered) { flushList(); list = { type: "list", ordered: false, items: [] }; }
      list.items.push(line.replace(/^[-*•]\s+/, "").trim());
      continue;
    }
    if (/^\d+[.)]\s+/.test(line)) {
      flushPara(); flushTable();
      if (!list || !list.ordered) { flushList(); list = { type: "list", ordered: true, items: [] }; }
      list.items.push(line.replace(/^\d+[.)]\s+/, "").trim());
      continue;
    }
    const call = line.match(/^\[(WARN|TIP|INFO|هشدار|نکته)\]\s*(.*)$/);
    if (call) {
      flushAll();
      const kind = call[1].toUpperCase();
      const rest = call[2].trim();
      const idx = rest.indexOf(":");
      const tone = kind === "WARN" || kind === "هشدار" ? "warn" : kind === "TIP" || kind === "نکته" ? "tip" : "info";
      const title = idx > 0 ? rest.slice(0, idx).trim() : tone === "warn" ? "هشدار مهم" : "نکته مفید";
      const text = idx > 0 ? rest.slice(idx + 1).trim() : rest;
      if (text) blocks.push({ type: "callout", tone, title, text });
      continue;
    }
    if (/^#{2}\s+/.test(line)) { flushAll(); blocks.push({ type: "h2", text: line.replace(/^#{2}\s+/, "").trim() }); continue; }
    if (/^#{1,6}\s+/.test(line)) { flushAll(); blocks.push({ type: "h3", text: line.replace(/^#{1,6}\s+/, "").trim() }); continue; }
    para.push(line);
  }
  flushAll();
  return blocks.filter((b) => b.type !== "p" || b.text.length > 15);
}

/** پاسخ Markdown مدل کوچک → ساختار کامل مقاله */
function parseMarkdownArticle(raw, topic, blogLinks) {
  const text = String(raw || "").replace(/```(?:markdown|md)?/gi, "").replace(/```/g, "").trim();
  const meta = {};
  let body = text;
  const sep = text.match(/^={3,}\s*$/m);
  if (sep) {
    for (const line of text.slice(0, sep.index).split("\n")) {
      const m = line.match(/^\s*([A-Z_]+)\s*:\s*(.+)$/);
      if (m) meta[m[1]] = m[2].trim();
    }
    body = text.slice(sep.index + sep[0].length).trim();
  }
  const { body: bodyNoFaq, faqs } = splitFaq(body);
  const blocks = mdToBlocks(bodyNoFaq).filter((b) => {
    /* مدل‌های کوچک گاهی خط‌های دستور را به‌عنوان عنوان تکرار می‌کنند — حذف */
    if (b.type === "h2" || b.type === "h3") {
      const t = b.text || "";
      return !/(قلاب داستانی|پاراگراف اول|حداقل ۵ عنوان|جدول Markdown|Markdown واقعی|\[WARN\]|\[TIP\]|قالب پاسخ|عنوان با ##)/.test(t);
    }
    return true;
  });
  blocks.push({ type: "links", title: "ادامه مطالعه", links: blogLinks.slice(0, 4) });
  blocks.push({ type: "faq" });
  blocks.push({ type: "cta" });

  const csv = (v) => String(v || "").split(/[,،]/).map((s) => s.trim()).filter(Boolean);
  const tags = csv(meta.TAGS).slice(0, 6);
  const keywords = csv(meta.KEYWORDS).slice(0, 12);
  const title = meta.TITLE || topic.title;
  return {
    slug: meta.SLUG && /^[a-z0-9-]{6,90}$/.test(meta.SLUG) ? meta.SLUG : "",
    title,
    h1: title,
    metaTitle: meta.META_TITLE || title,
    metaDesc: meta.META_DESC || "",
    kicker: meta.KICKER || "",
    excerpt: meta.EXCERPT || meta.META_DESC || "",
    category: meta.CATEGORY || topic.category || "جراحی فک و صورت",
    tags: tags.length ? tags : (topic.keywords || []).slice(0, 4),
    keywords: keywords.length ? keywords : (topic.keywords || []),
    quickAnswers: faqs.slice(0, 3),
    faqs: faqs.length ? faqs : [{ q: topic.title, a: "برای پاسخ دقیق و متناسب با شرایط شما، مشاوره حضوری با جراح لازم است." }],
    blocks,
  };
}

/* ───────────────── ساختار مقاله ───────────────── */

const SYSTEM_WRITER = `تو نویسنده ارشد محتوای پزشکی فارسی برای وب‌سایت دکتر پدرام بخشایی (جراح دهان، فک و صورت، تهران) هستی.

قوانین غیرقابل‌اجتماع:
1. اورجینال مطلق — هر جمله از صفر نوشته می‌شود. کپی/بازگویی نزدیک از هیچ منبعی ممنوع.
2. حداقل ۱۱۰۰ کلمه متن اصلی (مجموع بلوک‌های p و list و faqs).
3. غیر خسته‌کننده: شروع با قلاب واقعی یک بیمار (بدون اختراع آمار)، جمله‌های کوتاه، پرسش‌محور، تشبیه ساده، بدون کلی‌گویی.
4. قوانین محتوای مفید گوگل (E-E-A-T): پاسخ مستقیم به سوال کاربر در پاراگراف اول هر بخش، هیچ ادعای اثبات‌نشده، ذکر محدودیت‌ها و ریسک‌ها.
5. ساختار AEO: h2ها به شکل سوال واقعی کاربر، پاسخ کوتاه ۲-۳ جمله‌ای درست بعد از هر h2، سپس توضیح.
6. آمار/هزینه فقط از «حقایق مطب» که داده می‌شود؛ برای بقیه بازه هشدار «متغیر است، ویزیت لازم».
7. پایان با CTA تماس با مطب. لحن احترام‌آمیز و امیدبخش، بدون ترساندن بیمار.

فقط و فقط یک شیء JSON معتبر برگردان (بدون markdown، بدون توضیح اضافه).`;

const USER_TEMPLATE = (topic, usedTitles, blogLinks) => `موضوع امروز: «${topic.title}»
زاویه پیشنهادی: ${topic.angle || "پاسخ جامع و کاربردی"}
کلیدواژه‌های هدف: ${(topic.keywords || []).join("، ")}

موضوع‌هایی که قبلاً منتشر شده‌اند — هیچ هم‌پوشانی محتوایی با آن‌ها نداشته باش:
${usedTitles.length ? usedTitles.map((t) => `- ${t}`).join("\n") : "(لیست خالی)"}

حقایق مطب (تنها منبع آمار مجاز):
${CLINIC_FACTS}

لینک‌های داخلی مجاز برای بلوک links (۳ تا ۵ مورد انتخاب کن):
${blogLinks.map((l) => `- ${l.href} ← ${l.label}: ${l.desc}`).join("\n")}

خروجی JSON با دقیقاً این ساختار:
{
  "slug": "short-english-slug-words-only",
  "title": "عنوان مقاله — همان h1",
  "metaTitle": "حداکثر ۶۰ کاراکتر با کلیدواژه اصلی",
  "metaDesc": "۱۲۰ تا ۱۶۰ کاراکتر، وسوسه‌کننده و دقیق",
  "h1": "عنوان اصلی مقاله",
  "kicker": "برچسب کوتاه موضوع",
  "excerpt": "خلاصه ۲۰۰-۲۸۰ کاراکتری که مشکل کاربر را صدا بزند",
  "category": "یکی از: جراحی فک و صورت | ایمپلنت دندان | دندان نهفته | سلامت دهان",
  "tags": ["۴ تا ۶ تگ فارسی"],
  "keywords": ["۸ تا ۱۲ کلیدواژه سئو فارسی"],
  "quickAnswers": [{"q":"سوال مستقیم","a":"پاسخ ۴۰-۷۰ کلمه‌ای بی‌طرف"}] (حداقل ۳ مورد),
  "faqs": [{"q":"...","a":"پاسخ ۶۰-۱۲۰ کلمه‌ای"}] (حداقل ۴ مورد),
  "blocks": [
    {"type":"p","text":"قلاب آغازین — داستان کوتاه واقع‌نما از یک بیمار"},
    {"type":"h2","text":"سوال واقعی کاربر به شکل h2"},
    {"type":"p","text":"پاسخ مستقیم ۲-۳ جمله‌ای"},
    ... حداقل ۵ h2 سوالی با پاسخ مستقیم و توضیح کامل،
    {"type":"list","items":["...","..."]} (یک فهرست کاربردی),
    {"type":"table","caption":"...","head":["...","..."],"rows":[["...","..."],...]},
    {"type":"callout","tone":"warn یا tip","title":"...","text":"..."},
    {"type":"links","title":"ادامه مطالعه","links":[{"href":"...","label":"...","desc":"..."}]},
    {"type":"cta"}
  ]
}
تعداد کلمات بلوک‌های p و list و faqs باید مجموعاً ۱۱۰۰+ باشد. آخرین بلوک حتماً {"type":"cta"} باشد.`;

function validateDraft(raw) {
  const missing = [];
  const blocks = Array.isArray(raw.blocks) ? raw.blocks : [];
  const quickAnswers = Array.isArray(raw.quickAnswers) ? raw.quickAnswers : [];
  const faqs = Array.isArray(raw.faqs) ? raw.faqs : [];
  if (!raw.title && raw.metaTitle) raw.title = raw.metaTitle;
  if (!raw.title && raw.h1) raw.title = raw.h1;
  if (!raw.title) missing.push("title");
  if (!raw.h1) missing.push("h1");
  if (!raw.metaTitle) missing.push("metaTitle");
  if (blocks.length < 8) missing.push(`blocks=${blocks.length}`);
  if (!quickAnswers.length) missing.push("quickAnswers");
  if (!faqs.length) missing.push("faqs");
  if (missing.length) throw new Error(`ساختار مقاله ناقص است (${missing.join("، ")})`);
  return raw;
}

function wordCount(a) {
  const parts = [a.excerpt ?? ""];
  for (const b of a.blocks ?? []) {
    if ("text" in b && typeof b.text === "string") parts.push(b.text);
    if ("items" in b && Array.isArray(b.items)) parts.push(b.items.join(" "));
    if ("rows" in b && Array.isArray(b.rows)) parts.push(b.rows.flat().join(" "));
  }
  for (const qa of a.quickAnswers ?? []) parts.push(qa.q, qa.a);
  for (const f of a.faqs ?? []) parts.push(f.q, f.a);
  return parts.join(" ").split(/\s+/).filter((w) => /[\u0600-\u06FFa-zA-Z0-9]/.test(w)).length;
}

/* ───────────────── موضوع و لینک‌ها ───────────────── */

async function fetchExistingBlogSlugs() {
  try {
    const res = await fetch(`${SITE_URL}/sitemap.xml`, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) throw new Error(`sitemap ${res.status}`);
    const xml = await res.text();
    const slugs = [...xml.matchAll(/\/blog\/([a-z0-9-]+)/g)].map((m) => m[1]);
    return [...new Set(slugs)];
  } catch (e) {
    log("sitemap", `خواندن نقشه سایت ناموفق بود (${e.message}) — بدون حذف تکراری ادامه می‌دهیم`);
    return [];
  }
}

function pickTopic(bank, state) {
  const used = new Set(state.usedTopicIds || []);
  const fresh = bank.find((t) => !used.has(t.id));
  if (fresh) return fresh;
  /* همه بانک مصرف شده → چرخش دوباره از ابتدا (ترتیب ثابت) */
  log("topic", "کل بانک موضوع مصرف شده — چرخش جدید از ابتدا");
  return bank[0];
}

function buildBlogLinks(existingSlugs, currentSlug) {
  const others = existingSlugs.filter((s) => s && s !== currentSlug).slice(-4);
  const links = others.map((s) => ({
    href: `/blog/${s}`,
    label: s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    desc: "مقاله مرتبط دیگر در وبلاگ دکتر بخشایی",
  }));
  return [...links, ...STATIC_LINKS].slice(0, 7);
}

/* ───────────────── کاور — تصویر مرتبط با موضوع ───────────────── */

const FALLBACK_COVERS = [
  "/uploads/clinic-photo-1.jpg",
  "/uploads/clinic-photo-2.jpg",
  "/uploads/doctor-portrait.jpg",
];

/** تولید تصویر رایگان مرتبط با موضوع + آپلود در کتابخانه رسانه سایت */
async function makeCover(topic) {
  const prompt = `${topic.imageEn || "modern dental clinic, professional medical atmosphere"}, professional medical photography, clean bright clinical aesthetic, soft depth of field, no text, no watermark, no people faces visible`;
  const seed = Number.parseInt(sha(`${topic.id}:${todayTehran()}`).slice(0, 8), 16) % 1_000_000;
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1344&height=768&nologo=true&model=flux&seed=${seed}`;

  try {
    let buf = null;
    for (let attempt = 1; attempt <= 3 && !buf; attempt++) {
      try {
        log("cover", `تولید تصویر رایگان مرتبط با موضوع (seed=${seed}، تلاش ${attempt})`);
        const res = await fetch(imageUrl, { signal: AbortSignal.timeout(180_000) });
        const mime = (res.headers.get("content-type") || "").split(";")[0];
        if (!res.ok || !mime.startsWith("image/")) {
          const bodyText = (await res.text()).slice(0, 120);
          throw new Error(`image ${res.status} ${mime} ${bodyText}`);
        }
        const candidate = Buffer.from(await res.arrayBuffer());
        if (candidate.length < 15_000) throw new Error("تصویر تولیدی خیلی کوچک بود");
        buf = candidate;
      } catch (e) {
        log("cover", `تلاش ${attempt} ناموفق: ${String(e.message).slice(0, 100)}`);
        if (attempt < 3) await sleep(20_000);
      }
    }
    if (!buf) throw new Error("هر ۳ تلاش تولید تصویر ناموفق بود");
    log("cover", `تصویر ${(buf.length / 1024).toFixed(0)} کیلوبایت تولید شد`);

    if (!DRY_RUN) {
      const form = new FormData();
      form.append("file", new Blob([buf], { type: "image/jpeg" }), `agent-cover-${todayTehran()}.jpg`);
      const up = await fetch(`${SITE_URL}/api/admin/upload`, {
        method: "POST",
        headers: { "x-admin-key": ADMIN_KEY },
        body: form,
        signal: AbortSignal.timeout(60_000),
      });
      const data = await up.json().catch(() => ({}));
      if (!up.ok || !data?.url) throw new Error(`upload ${up.status}: ${JSON.stringify(data).slice(0, 150)}`);
      log("cover", `در رسانه سایت ذخیره شد: ${data.url}`);
      return { src: data.url, alt: `تصویر مقاله: ${topic.title}`, kind: "generated+uploaded" };
    }
    return { src: FALLBACK_COVERS[0], alt: `تصویر مقاله: ${topic.title}`, kind: "dry-run" };
  } catch (e) {
    log("cover", `تصویر تولیدی ناموفق (${String(e.message).slice(0, 120)}) — گالری ثابت`);
    const idx = Number.parseInt(sha(topic.id).slice(0, 6), 16) % FALLBACK_COVERS.length;
    return { src: FALLBACK_COVERS[idx], alt: `تصویر مقاله: ${topic.title}`, kind: "fallback" };
  }
}

/* ───────────────── انتشار ───────────────── */

async function publish(payload) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(`${SITE_URL}/api/agents/publish`, {
        method: "POST",
        headers: { "x-admin-key": ADMIN_KEY, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(90_000),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(`publish ${res.status}: ${JSON.stringify(data).slice(0, 200)}`);
      return data;
    } catch (e) {
      if (attempt === 2) throw e;
      log("publish", `تلاش اول ناموفق (${String(e.message).slice(0, 120)}) — ۱۰ ثانیه بعد دوباره`);
      await sleep(10_000);
    }
  }
}

/* ───────────────── خلاصه Actions ───────────────── */

function writeSummary(lines) {
  const file = process.env.GITHUB_STEP_SUMMARY;
  if (!file) return;
  try { appendFileSync(file, lines.join("\n") + "\n"); } catch { /* مهم نیست */ }
}

/* ───────────────── اجرای اصلی ───────────────── */

async function main() {
  const today = todayTehran();
  log("start", `ایجنت محتوای رایگان — ${today} (تهران) | سایت: ${SITE_URL}`);

  if (!ADMIN_KEY && !DRY_RUN) {
    throw new Error("ADMIN_KEY تنظیم نشده — در تنظیمات Actions سیکرت ADMIN_KEY را اضافه کنید");
  }

  const state = loadJson("./state.json", { lastPublishDate: "", usedTopicIds: [], published: [] });
  const bank = loadJson("./topics.json", { topics: [] }).topics;
  if (!bank.length) throw new Error("بانک موضوعات خالی است (topics.json)");

  if (state.lastPublishDate === today && !FORCE) {
    log("skip", `امروز (${today}) قبلاً مقاله منتشر شده — پایان بدون کار`);
    writeSummary([
      "## ایجنت محتوا",
      "",
      "✅ امروز قبلاً مقاله منتشر شده است — کاری انجام نشد.",
    ]);
    return;
  }

  /* ۱) موضوع + لینک‌های داخلی */
  const existingSlugs = await fetchExistingBlogSlugs();
  log("topic", `مقاله‌های موجود سایت: ${existingSlugs.length}`);
  const topic = pickTopic(bank, state);
  log("topic", `انتخاب شد: «${topic.title}»`);

  /* ۲) نگارش — تا ۳ تلاش با بازخورد اصلاحی */
  const usedTitles = (state.published || []).slice(-30).map((p) => p.title);
  const blogLinks = buildBlogLinks(existingSlugs, "");
  /* حالت SEED_DRAFT: پرش از مرحله LLM برای تست زنجیره انتشار یا اضطرار */
  let draft = null;
  let provider = "";
  let lastErr = "";
  if (process.env.SEED_DRAFT && existsSync(process.env.SEED_DRAFT)) {
    draft = validateDraft(JSON.parse(readFileSync(process.env.SEED_DRAFT, "utf8")));
    provider = "seed-draft";
    log("seed", `مقاله آماده از فایل بارگذاری شد: ${process.env.SEED_DRAFT}`);
  }
  for (let attempt = 1; attempt <= 5 && !draft; attempt++) {
    const corrective =
      attempt === 1
        ? ""
        : `\n\nهشدار: تلاش قبلی رد شد (${lastErr.replace(/POLLINATIONS_WAIT_\d+\|/, "")}). قالبی که در پیام آمده را دقیقاً و کامل رعایت کن — خلاصه یا طرح‌واره ناقص قابل قبول نیست.`;
    let rawText = "";
    try {
      /* مسیر ۱: GitHub Models با JSON ساختاریافته (مدل قوی) */
      let result = null;
      if (GH_TOKEN) {
        try {
          const text = await callGithubModels(
            [
              { role: "system", content: SYSTEM_WRITER },
              { role: "user", content: USER_TEMPLATE(topic, usedTitles, blogLinks) + corrective },
            ],
            16000
          );
          result = { text, provider: "github-models" };
          log(`write#${attempt}`, "تولید با GitHub Models موفق شد");
        } catch (e) {
          log(`write#${attempt}`, `GitHub Models ناموفق → Pollinations (${String(e.message).slice(0, 140)})`);
        }
      }
      /* مسیر ۲: Pollinations با Markdown (مدل کوچک — JSON ساختاریافته تولید نمی‌کند) */
      if (!result) {
        const text = await callPollinations(
          [
            { role: "system", content: SYSTEM_MD },
            { role: "user", content: USER_MD(topic, usedTitles) + corrective },
          ],
          16000
        );
        result = { text, provider: "pollinations-md" };
        log(`write#${attempt}`, "تولید با Pollinations موفق شد");
      }
      rawText = result.text;
      provider = result.provider;
      draft =
        result.provider === "github-models"
          ? validateDraft(extractJson(result.text))
          : validateDraft(parseMarkdownArticle(result.text, topic, blogLinks));
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e);
      log(`write#${attempt}`, `ناموفق: ${lastErr.slice(0, 180)}`);
      /* دیباگ: آخرین پاسخ خام برای بررسی */
      try { writeFileSync(new URL(`./last-raw-${attempt}.txt`, HERE), rawText); } catch { /* مهم نیست */ }
      if (attempt < 5) {
        /* Pollinations محدودیت «۱ پاسخ هر ۳۰ ثانیه برای هر IP» دارد — صبر هوشمند */
        const wait = lastErr.match(/POLLINATIONS_WAIT_(\d+)/);
        const sec = wait ? Math.max(35, Number(wait[1]) + 8) : 35;
        log(`write#${attempt}`, `${sec} ثانیه صبر برای عبور از محدودیت نرخ`);
        await sleep(sec * 1000);
      }
    }
  }
  if (!draft) throw new Error(`تولید مقاله پس از ۵ تلاش ناموفق بود — آخرین خطا: ${lastErr.replace(/POLLINATIONS_WAIT_\d+\|/, "")}`);

  /* ۳) کنترل کلمه — اگر زیر ۱۰۰۰ بود یک پاس توسعه (فقط با مدل قوی GitHub Models) */
  let words = wordCount(draft);
  if (words < 1000 && provider === "github-models") {
    log("extend", `مقاله ${words} کلمه است — پاس توسعه اجرا می‌شود`);
    try {
      const text = await callGithubModels(
        [
          { role: "system", content: SYSTEM_WRITER },
          {
            role: "user",
            content: `این مقاله فقط ${words} کلمه است. همان JSON را برگردان و فقط بخش‌های توضیحی (p و list و faqs) را با جزئیات کاربردی، مثال بالینی و توضیح ریسک‌ها غنی‌تر کن تا مجموعاً ۱۱۰۰+ کلمه شود. ساختار و عنوان‌ها را تغییر نده. فقط JSON:\n\n${JSON.stringify(draft)}`,
          },
        ],
        16000
      );
      log("extend", "توسعه با GitHub Models موفق شد");
      const ext = validateDraft(extractJson(text));
      if (wordCount(ext) > words) { draft = ext; words = wordCount(ext); }
    } catch (e) {
      log("extend", `توسعه ناموفق — نسخه فعلی حفظ می‌شود (${String(e.message).slice(0, 120)})`);
    }
  } else if (words < 1000) {
    /* مسیر Pollinations: یک پاس غنی‌سازی Markdown — همان مقاله، بلندتر */
    log("extend", `مقاله ${words} کلمه است — پاس غنی‌سازی Markdown اجرا می‌شود`);
    await sleep(35_000); // عبور از محدودیت نرخ
    try {
      const text = await callPollinations(
        [
          { role: "system", content: SYSTEM_MD },
          {
            role: "user",
            content: `این مقاله فقط ${words} کلمه است. همان مقاله را با همان قالب قبلی (بلوک متادیتا + ==== + متن Markdown + بخش سوالات متداول با Q/A) بازنویسی کن و فقط بخش‌های توضیحی را با جزئیات کاربردی، مثال بالینی، مراحل درمان و توضیح ریسک‌ها غنی‌تر کن تا متن اصلی حداقل ۱۴۰۰ کلمه شود. ساختار و عنوان‌ها را تغییر نده. موضوع: «${topic.title}»\n\nمتن فعلی:\n\n${String(rawText || "").slice(0, 12000)}`,
          },
        ],
        16000
      );
      log("extend", "غنی‌سازی با Pollinations موفق شد");
      rawText = text;
      const ext = validateDraft(parseMarkdownArticle(text, topic, blogLinks));
      const extWords = wordCount(ext);
      if (extWords > words) { draft = ext; words = extWords; log("extend", `کلمات: ${words}`); }
    } catch (e) {
      log("extend", `غنی‌سازی ناموفق — نسخه فعلی حفظ می‌شود (${String(e.message).slice(0, 120)})`);
    }
  }
  log("words", `تعداد کلمات: ${words}`);

  /* ۴) اسلاگ یکتا */
  let slug = typeof draft.slug === "string" && /^[a-z0-9-]{6,90}$/.test(draft.slug) ? draft.slug : "";
  if (!slug) {
    slug = String(draft.title || topic.title)
      .toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80);
  }
  const taken = new Set(existingSlugs);
  if (taken.has(slug)) slug = `${slug}-${sha(topic.id).slice(0, 5)}`;
  log("slug", slug);

  /* ۵) کاور */
  const cover = await makeCover(topic);

  /* ۶) انتشار */
  const payload = {
    title: String(draft.title),
    description: String(draft.metaDesc ?? ""),
    slug,
    article: { ...draft, slug },
    tags: Array.isArray(draft.tags) ? draft.tags : [],
    keywords: Array.isArray(draft.keywords) && draft.keywords.length ? draft.keywords : (topic.keywords || []),
    coverImage: cover.src,
    coverAlt: cover.alt,
    source: "github-agent",
  };

  let result = { id: slug, action: "dry-run", wordCount: words };
  if (DRY_RUN) {
    log("dry-run", "DRY_RUN فعال است — انتشار انجام نشد");
  } else {
    result = await publish(payload);
    log("publish", `✅ ${result.action} — ${result.id} (${result.wordCount} کلمه)`);
  }

  /* ۷) ثبت وضعیت + خلاصه */
  const entry = {
    date: today,
    slug: result.id,
    title: draft.title,
    words: result.wordCount ?? words,
    topicId: topic.id,
    provider,
    cover: cover.kind,
  };
  if (!DRY_RUN) {
    state.lastPublishDate = today;
    state.usedTopicIds = [...(state.usedTopicIds || []).filter((id) => id !== topic.id), topic.id];
    state.published = [...(state.published || []), entry].slice(-90);
    writeFileSync(new URL("./state.json", HERE), JSON.stringify(state, null, 2) + "\n");
    log("state", "state.json به‌روز شد (ورک‌فلو کامیت می‌کند)");
  }

  writeSummary([
    "## ایجنت محتوا — گزارش انتشار",
    "",
    `- **وضعیت:** ${DRY_RUN ? "تست (بدون انتشار)" : result.action === "created" ? "✅ مقاله جدید منتشر شد" : "♻️ مقاله به‌روز شد"}`,
    `- **عنوان:** ${draft.title}`,
    `- **آدرس:** ${SITE_URL}/blog/${result.id}`,
    `- **موضوع:** ${topic.title}`,
    `- **کلمات:** ${result.wordCount ?? words}`,
    `- **مدل:** ${provider || "—"} | **کاور:** ${cover.kind}`,
    `- **تاریخ تهران:** ${faToday()} (${today})`,
  ]);
}

main().catch((e) => {
  console.error("❌", e instanceof Error ? e.message : e);
  writeSummary(["## ایجنت محتوا", "", `❌ **خطا:** ${e instanceof Error ? e.message : e}`]);
  process.exit(1);
});
