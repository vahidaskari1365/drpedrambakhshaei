/**
 * ایجنت ۱ — نویسنده محتوای روزانه
 *
 * وظیفه: هر روز ۰۷:۰۰ تهران یک مقاله ۱۰۰۰+ کلمه‌ای «کاملاً یکتا» درباره تخصص سایت
 * (جراحی فک و صورت / ایمپلنت / دندان نهفته) تولید و منتشر کند:
 *   ۱) انتخاب موضوع از بانک ایده (در نبود ایده، تولید ایده‌های تازه با جست‌وجوی وب)
 *   ۲) پژوهش سریع (web_search) برای استناد و تازگی — به‌عنوان زمینه، نه کپی
 *   ۳) نگارش JSON ساختاریافته مطابق BlogArticle + تبعیت از قوانین محتوای مفید گوگل
 *   ۴) کنترل طول (۱۰۰۰+ کلمه) و در صورت کمبود، یک پاس توسعه
 *   ۵) تولید کاور اختصاصی با هوش مصنوعی (fallback: تصاویر موجود)
 *   ۶) انتشار idempotent از مسیر publishPost
 *
 * قوانین سخت: هیچ جمله‌ای از منبع دیگر کپی نمی‌شود؛ آمارِ بدون منبع از مقاله حذف می‌شود؛
 * لحن حرفه‌ای و غیر خسته‌کننده؛ ساختار پاسخ‌محور (AEO) از لحظه تولد.
 */
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";
import type { AgentResult } from "./runner";
import { publishPost, slugify, hashOf, articleWordCount, type PublishInput } from "@/lib/blog/posts";
import { DEFAULTS } from "@/lib/site-content";
import { SITE, SERVICES, STATS, PRICE_TABS } from "@/lib/site-data";
import type { BlogArticle } from "@/lib/blog-data";

/* ───────────────── زمینه سایت (E-E-A-T) ───────────────── */

function siteFacts(): string {
  const services = SERVICES.map((s) => `- ${s.title}${s.subtitle ? ` (${s.subtitle})` : ""}`).join("\n");
  const stats = STATS.map((s) => `${s.value}${s.suffix} ${s.label}`).join("، ");
  const prices = PRICE_TABS.map((t) => {
    const rows = t.rows.slice(0, 4).map((r) => `${r.item}: ${r.price}`);
    return `${t.label}: ${rows.join(" | ")}`;
  }).join("\n");
  return [
    `نام مطب: ${SITE.name}`,
    `پزشک: ${SITE.name} — ${SITE.role}`,
    `تماس: ${SITE.phone} | آدرس: ${SITE.address} | ساعات: ${SITE.hours}`,
    `امتیاز گوگل: ${SITE.rating.score} از ۵ (${SITE.rating.count} نظر)`,
    `آمار: ${stats}`,
    "خدمات اصلی:",
    services,
    "تعرفه‌های شاخص ۱۴۰۵ (تومان، تقریبی ±۵٪):",
    prices,
  ].join("\n");
}

function existingLinks(): string {
  return DEFAULTS.blog
    .map((a) => `- /blog/${a.slug} ← «${a.h1}»`)
    .concat([
      "- /services ← صفحه خدمات",
      "- /prices ← تعرفه‌های ۱۴۰۵",
      "- /contact ← رزرو نوبت",
      "- /about ← درباره دکتر",
    ])
    .join("\n");
}

/* ───────────────── ابزار تایم‌اوت ───────────────── */

/** هر فراخوانی شبکه‌ای ممکن است بی‌پایان هنگ کند — با تایم‌اوت قطع می‌کنیم (الگوی OpenClaw: real failures) */
function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} بیش از ${Math.round(ms / 1000)} ثانیه طول کشید`)), ms)
    ),
  ]);
}

/* ───────────────── جست‌وجوی وب (اختیاری) ───────────────── */

interface SearchFact {
  title: string;
  snippet: string;
  url: string;
}

async function webResearch(query: string, num = 5): Promise<SearchFact[]> {
  try {
    const zai = await ZAI.create();
    const result = (await withTimeout(
      zai.functions.invoke("web_search", { query, num }) as Promise<unknown[]>,
      30_000,
      "جست‌وجوی وب"
    )) as unknown[];
    return result
      .map((r) => {
        const item = r as Record<string, string>;
        return {
          title: item.title || item.name || "",
          snippet: (item.snippet || item.description || "").slice(0, 300),
          url: item.url || item.link || "",
        };
      })
      .filter((f) => f.title || f.snippet)
      .slice(0, num);
  } catch (e) {
    console.warn("[content-agent] web research skipped:", e instanceof Error ? e.message : e);
    return [];
  }
}

/* ───────────────── بانک ایده ───────────────── */

const SEED_TOPICS: { title: string; angle: string; keywords: string[]; priority: number }[] = [
  { title: "درد بعد از جراحی دندان عقل؛ چه زمانی طبیعی است و چه زمانی خطر؟", angle: "جدول روزهای ۱ تا ۷ + علائم عفونت", keywords: ["درد بعد از کشیدن دندان عقل", "عفونت بعد از جراحی دندان عقل", "نقاهت دندان عقل"], priority: 90 },
  { title: "ایمپلنت فوری در یک روز چقدر واقعی است؟ (Immediate Loading)", angle: "شرایط کاندید، مزایا/ریسک‌ها، مقایسه با ایمپلنت دو مرحله‌ای", keywords: ["ایمپلنت فوری", "ایمپلنت یک روزه", "بارگذاری فوری ایمپلنت"], priority: 88 },
  { title: "بررسی بایت قبل از ارتوسرجری؛ چرا بدون آن جراحی فک ریسکی است؟", angle: "نقش رادیوگرافی سفالومتری و شبیه‌سازی سه‌بعدی", keywords: ["بررسی بایت", "ارزیابی قبل از جراحی فک", "سفالومتری"], priority: 80 },
  { title: "جراحی دندان نهفته با بی‌حسی موضعی یا بیهوشی؟ انتخاب درست", angle: "جدول مقایسه + مواردی که بیهوشی لازم است", keywords: ["جراحی دندان نهفته", "بی‌حسی یا بیهوشی دندان عقل"], priority: 82 },
  { title: "خارج شدن لثه از روی ایمپلنت (Recession)؛ علل و پیشگیری", angle: "نقش استخوان و بافت نرم، درمان لیزری", keywords: ["عقب رفتن لثه ایمپلنت", "تورم لثه دور ایمپلنت"], priority: 70 },
  { title: "تغذیه بعد از جراحی فک؛ برنامه غذایی هفته اول تا ماه اول", angle: "جدول رژیم مایع تا جامع + مکمل‌های ترمیم استخوان", keywords: ["تغذیه بعد از جراحی فک", "رژیم بعد از ارتوسرجری"], priority: 75 },
  { title: "اسپلینت بعد از جراحی فک چیست و چقدر باید بسته بماند؟", angle: "نقش اسپلینت در ثبات نتیجه + نگهداری", keywords: ["اسپلینت جراحی فک", "مراقبت بعد از ارتوسرجری"], priority: 68 },
  { title: "هزینه ایمپلنت در تهران ۱۴۰۵؛ چه چیزهایی قیمت را تعیین می‌کند؟", angle: "برند ایمپلنت، پیوند استخوان، CT سه‌بعدی — با جدول", keywords: ["هزینه ایمپلنت دندان", "قیمت ایمپلنت تهران"], priority: 85 },
  { title: "اصلاح چانه عقب‌رفته (Retrognathism)؛ از علامت تا جراحی", angle: "تأثیر روی خروپف و آپنه خواب + مسیر درمان", keywords: ["چانه عقب رفته", "جراحی پیشروی فک", "آپنه خواب"], priority: 72 },
  { title: "سیست و تومور فک؛ چرا نباید ضایعه کوچک را جدی نگرفتیم؟", angle: "علائم هشدار، بیوپسی، جراحی انکولوژیک", keywords: ["کیست فک", "تومور فک", "ضایعه فک"], priority: 65 },
  { title: "کاشت استخوان قبل از ایمپلنت (Bone Graft)؛ چه کسی نیاز دارد؟", angle: "انواع گرافت، زمان انتظار، هزینه", keywords: ["پیوند استخوان ایمپلنت", "bone graft ایمپلنت"], priority: 78 },
  { title: "دندان قروچه و درد فک (TMD)؛ درمان بدون جراحی ممکن است؟", angle: "اسپلینت شبانه، فیزیوتراپی، ورزش فک", keywords: ["درد مفصل فک", "دندان قروچه", "TMD"], priority: 62 },
];

async function pickTopic(): Promise<{ id: string; title: string; angle: string; keywords: string[] }> {
  const unused = await db.topicIdea.findMany({ where: { used: false }, orderBy: [{ priority: "desc" }, { createdAt: "asc" }] });
  if (unused.length) {
    const t = unused[0];
    return { id: t.id, title: t.title, angle: t.angle, keywords: JSON.parse(t.keywords || "[]") as string[] };
  }

  /* بانک خالی → بذر اولیه + تولید ایده تازه با پژوهش وب */
  await db.topicIdea.createMany({ data: SEED_TOPICS.map((t) => ({ ...t, keywords: JSON.stringify(t.keywords) })) });
  const facts = await webResearch("ترندهای جدید جراحی فک و صورت و ایمپلنت دندان ایران ۱۴۰۵", 6);
  try {
    const zai = await ZAI.create();
    const res = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: "تولیدکننده ایده محتوای سئو برای سایت یک جراح فک و صورت در تهران هستی. فقط JSON برگردان." },
        {
          role: "user",
          content: `بر اساس این نشانه‌های جست‌وجو، ۴ موضوع مقاله جدید (که در این لیست نباشند) پیشنهاد بده:\n${facts
            .map((f) => `- ${f.title}`)
            .join("\n")}\n\nساختار خروجی: {"ideas":[{"title":"...","angle":"...","keywords":["...","..."],"priority":60}]}`,
        },
      ],
      thinking: { type: "disabled" },
    });
    const parsed = JSON.parse((res.choices[0]?.message?.content ?? "").replace(/```json?|```/g, "").trim()) as {
      ideas?: { title: string; angle?: string; keywords?: string[]; priority?: number }[];
    };
    if (parsed.ideas?.length) {
      await db.topicIdea.createMany({
        data: parsed.ideas.slice(0, 4).map((i) => ({
          title: i.title,
          angle: i.angle ?? "",
          keywords: JSON.stringify(i.keywords ?? []),
          priority: i.priority ?? 60,
        })),
      });
    }
  } catch (e) {
    console.warn("[content-agent] idea generation skipped:", e instanceof Error ? e.message : e);
  }
  const fresh = await db.topicIdea.findFirst({ where: { used: false }, orderBy: [{ priority: "desc" }, { createdAt: "asc" }] });
  if (!fresh) throw new Error("هیچ موضوعی برای تولید مقاله وجود ندارد");
  return { id: fresh.id, title: fresh.title, angle: fresh.angle, keywords: JSON.parse(fresh.keywords || "[]") as string[] };
}

/* ───────────────── مولد JSON مقاله ───────────────── */

const SYSTEM_WRITER = `تو نویسنده ارشد محتوای پزشکی فارسی برای وب‌سایت دکتر پدرام بخشایی (جراح دهان، فک و صورت، تهران) هستی.

قوانین غیرقابل‌اجتماع:
1. اورجینال مطلق — هر جمله از صفر نوشته می‌شود. کپی/بازگویی نزدیک از هیچ منبعی ممنوع. نتایج جست‌وجو فقط «زمینه دانشی» است.
2. حداقل ۱۱۰۰ کلمه متن اصلی (بدون جدول).
3. غیر خسته‌کننده: شروع با قلاب واقعی یک بیمار (بدون اختراع آمار)، جمله‌های کوتاه، پرسش‌محور، تشبیه ساده، بدون کلی‌گویی.
4. قوانین محتوای مفید گوگل (Helpful Content / E-E-A-T): تجربه اول‌شخص از مطب، تخصص واقعی، پاسخ مستقیم به سوال کاربر در پاراگراف اول هر بخش، هیچ ادعای اثبات‌نشده، ذکر محدودیت‌ها و ریسک‌ها.
5. ساختار AEO: h2ها به شکل سوال واقعی کاربر، پاسخ کوتاه ۲-۳ جمله‌ای درست بعد از هر h2، سپس توضیح.
6. آمار/هزینه فقط از «حقایق مطب» که داده می‌شود؛ برای بقیه بازه هشدار «متغیر است، ویزیت لازم».
7. پایان با CTA تماس با مطب. لحن احترام‌آمیز، بدون ترساندن بیمار.

فقط و فقط JSON معتبر برگردان (بدون markdown).`

const USER_TEMPLATE = (topic: { title: string; angle: string; keywords: string[] }, facts: string, factsWeb: SearchFact[], links: string) => `موضوع امروز: «${topic.title}»
زاویه پیشنهادی: ${topic.angle || "پاسخ جامع و کاربردی"}
کلیدواژه‌های هدف: ${topic.keywords.join("، ")}

حقایق مطب (تنها منبع آمار مجاز):
${facts}

نشانه‌های جست‌وجوی امروز (فقط زمینه؛ هرگز جمله کپی نکن):
${factsWeb.map((f) => `- ${f.title}: ${f.snippet}`).join("\n") || "(در دسترس نبود — از دانش عمومی پزشکی استفاده کن، بدون آمار ساختگی)"}

لینک‌های داخلی مجاز برای بلوک links:
${links}

خروجی JSON با دقیقاً این ساختار:
{
  "slug": "english-slug-words-only",
  "title": "عنوان مقاله — همان h1",
  "metaTitle": "حداکثر ۶۰ کاراکتر با کلیدواژه اصلی",
  "metaDesc": "۱۲۰ تا ۱۶۰ کاراکتر، وسوسه‌کننده و دقیق",
  "h1": "عنوان اصلی مقاله",
  "kicker": "برچسب کوتاه موضوع",
  "excerpt": "خلاصه ۲۰۰-۲۸۰ کاراکتری که مشکل کاربر را صدا بزند",
  "category": "یکی از: جراحی فک و صورت | ایمپلنت دندان | دندان نهفته | سلامت دهان",
  "tags": ["۴ تا ۶ تگ فارسی"],
  "keywords": ["۸ تا ۱۲ کلیدواژه سئو فارسی"],
  "quickAnswers": [{"q":"سوال مستقیم","a":"پاسخ ۴۰-۷۰ کلمه‌ای بی‌طرف"}] (حداقل ۳),
  "faqs": [{"q":"...","a":"پاسخ ۶۰-۱۲۰ کلمه‌ای"}] (حداقل ۴),
  "blocks": [
    {"type":"p","text":"قلاب آغازین - داستان کوتاه واقع‌نما"},
    {"type":"h2","id":"slug-id","text":"سوال کاربر به شکل h2"},
    {"type":"p","text":"پاسخ مستقیم ۲-۳ جمله‌ای"},
    {"type":"h2","id":"...","text":"..."},
    ... شامل: حداقل ۵ h2 سوالی، ۶ p، یک list، یک table با head و rows واقعی، یک callout(tone: warn یا tip)، یک quickAnswers بلوک بی‌فیلد، یک faq بلوک بی‌فیلد، یک links بلوک با ۳-۴ لینک از لیست بالا، و آخرین بلوک {"type":"cta"}
  ]
}
تعداد کلمات بلوک‌های p و list و faqs باید مجموعاً ۱۱۰۰+ باشد.`;

function extractJson(raw: string): Record<string, unknown> {
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
    throw new Error("پاسخ مدل JSON معتبر نبود");
  }
}

/** صحت‌سنجی ساختاری مقاله تولیدی — با پیام تشخیصی دقیق */
function validateArticle(raw: Record<string, unknown>): PublishInput["article"] & { slug: string } {
  const slug = typeof raw.slug === "string" && /^[a-z0-9-]{6,90}$/.test(raw.slug) ? raw.slug : "";
  const blocks = Array.isArray(raw.blocks) ? raw.blocks : [];
  const quickAnswers = Array.isArray(raw.quickAnswers) ? raw.quickAnswers : [];
  const faqs = Array.isArray(raw.faqs) ? raw.faqs : [];
  const missing: string[] = [];
  // عنوان از هر یک از title/metaTitle/h1 قابل استخراج است
  if (!raw.title && raw.metaTitle) raw.title = raw.metaTitle;
  if (!raw.title && raw.h1) raw.title = raw.h1;
  if (!raw.title) missing.push("title");
  if (!raw.h1) missing.push("h1");
  if (!raw.metaTitle) missing.push("metaTitle");
  if (blocks.length < 8) missing.push(`blocks=${blocks.length}`);
  if (!quickAnswers.length) missing.push("quickAnswers");
  if (!faqs.length) missing.push("faqs");
  if (missing.length) {
    console.warn("[content-agent] draft issues:", missing.join(","), "| raw head:", JSON.stringify(raw).slice(0, 200));
    throw new Error(`ساختار مقاله ناقص است (${missing.join("، ")})`);
  }
  return raw as PublishInput["article"] & { slug: string };
}

/* ───────────────── کاور ───────────────── */

const FALLBACK_COVERS = [
  "/uploads/implant-art.jpg",
  "/uploads/jawline-art.jpg",
  "/uploads/wisdom-art.jpg",
  "/uploads/clinic-photo-1.jpg",
  "/uploads/clinic-photo-2.jpg",
];

async function generateCover(topic: string): Promise<{ src: string; alt: string; ai: boolean }> {
  const alt = `تصویر اختصاصی مقاله: ${topic}`;
  // پرامپت اول ممکن است فیلتر محتوای تصویری (کدهای ۱۳xx) را فعال کند — نسخه خنثی جایگزین
  const prompts = [
    `Elegant modern medical clinic editorial illustration, soft studio light, teal and porcelain color palette, abstract clean shapes, calm professional atmosphere, no text, no watermark, photorealistic 3D render`,
    `Minimal abstract 3D render of a bright modern dental clinic interior, teal and cream palette, soft light, no people, no text, no watermark`,
  ];
  try {
    const zai = await ZAI.create();
    for (const prompt of prompts) {
      try {
        const res = await withTimeout(
          zai.images.generations.create({ prompt, size: "1344x768" }) as Promise<{ data?: { base64?: string }[] }>,
          120_000,
          "تولید تصویر"
        );
        const base64 = res.data?.[0]?.base64;
        if (base64) {
          const buffer = Buffer.from(base64, "base64");
          const media = await db.media.create({
            data: { filename: `agent-cover-${Date.now()}.png`, mime: "image/png", size: buffer.length, data: base64 },
          });
          return { src: `/api/media/${media.id}`, alt, ai: true };
        }
      } catch (e) {
        console.warn("[content-agent] cover prompt rejected, trying neutral:", e instanceof Error ? e.message.slice(0, 120) : e);
      }
    }
  } catch (e) {
    console.warn("[content-agent] cover generation failed, using fallback:", e instanceof Error ? e.message.slice(0, 120) : e);
  }
  const idx = hashOf(topic).charCodeAt(0) % FALLBACK_COVERS.length;
  return { src: FALLBACK_COVERS[idx], alt, ai: false };
}

/* ───────────────── اجرای ایجنت ───────────────── */

export async function runContentAgent(): Promise<AgentResult> {
  /* ۱) موضوع */
  const topic = await pickTopic();

  /* ۲) پژوهش زمینه‌ای */
  const factsWeb = await webResearch(`${topic.keywords[0] ?? topic.title} راهنما`, 5);

  /* ۳) نگارش — تا ۲ تلاش؛ تلاش دوم با بازخورد اصلاحی */
  const zai = await ZAI.create();
  let draft: ReturnType<typeof validateArticle> | null = null;
  let lastErr = "";
  for (let attempt = 1; attempt <= 2 && !draft; attempt++) {
    const corrective =
      attempt === 1
        ? ""
        : `\n\nهشدار: تلاش قبلی رد شد (${lastErr}). حتماً یک شیء JSON واحد با حداقل ۱۲ بلوک در آرایه blocks، title، h1، metaTitle، quickAnswers و faqs کامل برگردان. خلاصه یا طرح‌واره اولیه قابل قبول نیست.`;
    try {
      const completion = await withTimeout(
        zai.chat.completions.create({
          messages: [
            { role: "assistant", content: SYSTEM_WRITER },
            { role: "user", content: USER_TEMPLATE(topic, siteFacts(), factsWeb, existingLinks()) + corrective },
          ],
          thinking: { type: "disabled" },
        }),
        360_000,
        "نگارش مقاله"
      );
      const raw = extractJson(completion.choices[0]?.message?.content ?? "");
      draft = validateArticle(raw);
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e);
      console.warn(`[content-agent] attempt ${attempt} failed: ${lastErr}`);
    }
  }
  if (!draft) throw new Error(`تولید مقاله پس از ۲ تلاش ناموفق بود — آخرین خطا: ${lastErr}`);

  /* ۴) کنترل کلمه — اگر زیر ۱۰۰۰ بود، پاس توسعه */
  let articleData = draft;
  let words = articleWordCount({
    blocks: (draft.blocks ?? []) as BlogArticle["blocks"],
    quickAnswers: (draft.quickAnswers ?? []) as BlogArticle["quickAnswers"],
    faqs: (draft.faqs ?? []) as BlogArticle["faqs"],
    excerpt: String(draft.excerpt ?? ""),
  });
  if (words < 1000) {
    const extend = await withTimeout(
    zai.chat.completions.create({
      messages: [
        { role: "assistant", content: SYSTEM_WRITER },
        {
          role: "user",
          content: `این مقاله فقط ${words} کلمه است. همان JSON را برگردان و فقط بخش‌های توضیحی (p و list و faqs) را با جزئیات کاربردی، مثال بالینی و توضیح ریسک‌ها غنی‌تر کن تا مجموعاً ۱۱۰۰+ کلمه شود. ساختار و عنوان‌ها را تغییر نده. فقط JSON:\n\n${JSON.stringify(draft)}`,
        },
      ],
      thinking: { type: "disabled" },
      }),
      240_000,
      "توسعه مقاله"
    );
    try {
      const ext = extractJson(extend.choices[0]?.message?.content ?? "");
      articleData = validateArticle(ext);
      words = articleWordCount({
        blocks: (articleData.blocks ?? []) as BlogArticle["blocks"],
        quickAnswers: (articleData.quickAnswers ?? []) as BlogArticle["quickAnswers"],
        faqs: (articleData.faqs ?? []) as BlogArticle["faqs"],
        excerpt: String(articleData.excerpt ?? ""),
      });
    } catch {
      /* نسخه اول حفظ می‌شود */
    }
  }

  /* ۵) اسلاگ یکتا — تکراری نباشد (پیش‌فرض کد یا دیتابیس) */
  let slug = articleData.slug || slugify(String(articleData.title ?? topic.title));
  const takenStatic = new Set(DEFAULTS.blog.map((a) => a.slug));
  if (takenStatic.has(slug) || (await db.blogPost.findUnique({ where: { id: slug }, select: { id: true } }))) {
    slug = `${slug}-${hashOf(topic.title).slice(0, 5)}`;
  }

  /* ۶) کاور */
  const cover = await generateCover(topic.title);

  /* ۷) انتشار */
  const result = await publishPost({
    title: String(articleData.title ?? topic.title),
    description: String(articleData.metaDesc ?? ""),
    slug,
    article: {
      ...articleData,
      slug,
      title: String(articleData.title ?? topic.title),
    } as unknown as Record<string, unknown>,
    tags: (articleData.tags ?? []) as string[],
    keywords: (articleData.keywords ?? topic.keywords) as string[],
    coverImage: cover.src,
    coverAlt: cover.alt,
    source: "agent",
  });
  if (!result.ok) throw new Error("انتشار مقاله ناموفق بود");

  /* ۸) بستن موضوع */
  await db.topicIdea.update({ where: { id: topic.id }, data: { used: true, usedAt: new Date() } }).catch(() => {});

  return {
    summary: `مقاله «${articleData.title}» منتشر شد — ${result.wordCount} کلمه، ${Math.max(2, Math.round(result.wordCount / 190))} دقیقه مطالعه، کاور ${cover.ai ? "تولید AI" : "از گالری"}`,
    details: {
      slug: result.id,
      title: articleData.title,
      words: result.wordCount,
      action: result.action,
      topic: topic.title,
      cover: cover.src,
      coverAi: cover.ai,
      research: factsWeb.length,
    },
  };
}
