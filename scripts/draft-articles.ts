/**
 * draft-articles.ts — نگارش ۵ مقاله یکتای ۱۳۰۰+ کلمه‌ای برای سایت دکتر پدرام بخشایی
 *
 * اجرا:  bun scripts/draft-articles.ts <1..5>
 * خروجی: release-out/agent-articles/article-<n>-<slug>.json (payload آماده POST /api/blog/publish)
 *
 * نکات فنی:
 *  - تولید سه مرحله‌ای (p1: متادیتا + ۲ سکشن / p2: ۲ سکشن + list/table / p3: سکشن پایانی + faqs + بلوک‌های پایانی)
 *    چون خروجی یک‌مرحله‌ای به سقف توکن می‌خورد و JSON وسط راه بریده می‌شود.
 *  - آمار ساختگی (درصد، میلی‌متر و ...) ممنوع و در validate رد می‌شود — فقط حقایق مطب.
 *  - موضوع‌ها عمداً خارج از بانک ایده SEED_TOPICS ایجنت محتوا انتخاب شده‌اند تا مقاله‌های
 *    آینده ایجنت با این ۵ مقاله هیچ هم‌پوشانی موضوعی نداشته باشند.
 */
import ZAI from "z-ai-web-dev-sdk";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";

const DEBUG_RAW = process.env.DRAFT_DEBUG === "1";
const OUT_DIR = path.join(process.cwd(), "release-out", "agent-articles");
mkdirSync(OUT_DIR, { recursive: true });

/* ───────────────── حقایق مطب (تنها منبع آمار مجاز) ───────────────── */

const FACTS = `نام مطب: دکتر پدرام بخشایی — متخصص جراحی دهان، فک و صورت
اعتبار: رتبه ۲ بورد تخصصی جراحی فک و صورت کشور، عضو هیئت علمی دانشگاه شهید بهشتی
تماس: 09302626021 | آدرس: تهران، پاسداران، مرکز خرید پاسداران، طبقه ۲، واحد ۴
امتیاز گوگل: ۵ از ۵
آمار مطب: ۱۱+ سال تجربه، بیش از ۱۵٬۰۰۰ ایمپلنت، ۱۰۴ جراحی ارتوسرجری (ارتوگناتیک)، ۳۴۱ بازسازی فک و صورت
برندهای ایمپلنت مطب: Straumann (سوئیس)، Zimmer (آمریکا)، Osstem (کره)، Neodent، Bio3
خدمات اصلی: جراحی ارتوگناتیک (ارتوسرجری)، ایمپلنت دندان، جراحی دندان‌های نهفته، جراحی‌های ترمیمی فک و صورت، جنیوپلاستی
تعرفه‌ها: بازه‌های قیمت ۱۴۰۵ در صفحه /prices سایت — هر عدد قیمتی دقیق فقط پس از ویزیت اعلام می‌شود`;

const INTERNAL_LINKS = `- /services ← صفحه خدمات (شرح کامل هر خدمت)
- /prices ← تعرفه‌های ۱۴۰۵ (بازه‌های قیمتی)
- /contact ← رزرو نوبت و راه‌های تماس
- /about ← درباره دکتر (بیوگرافی و مدارک)
- /gallery ← نمونه کارهای واقعی قبل و بعد
- /faq ← سوالات متداول سایت
- /blog/orthognathic-surgery-guide ← مقاله راهنمای کامل جراحی ارتوگناتیک`;

/* ───────────────── ۵ موضوع — یکتا و غیرهم‌پوشان ───────────────── */

interface TopicSpec {
  n: number;
  slug: string;
  kicker: string;
  category: "جراحی فک و صورت" | "ایمپلنت دندان" | "دندان نهفته" | "سلامت دهان";
  cover: string;
  coverAlt: string;
  subject: string;
  angle: string;
  keywords: string[];
  sections: string[];
}

const TOPICS: TopicSpec[] = [
  {
    n: 1,
    slug: "digital-guided-implant-surgery",
    kicker: "ایمپلنت دیجیتال",
    category: "ایمپلنت دندان",
    cover: "/uploads/implant-real.jpg",
    coverAlt: "ایمپلنت دندان با جراحی راهنماشده دیجیتال — نمونه کار مطب دکتر پدرام بخشایی",
    subject: "ایمپلنت دیجیتال و جراحی راهنماشده (Guided Implant Surgery)",
    angle: "تفاوت واقعی ایمپلنت دیجیتال با روش سنتی: CBCT، برنامه‌ریزی سه‌بعدی، گاید چاپی، درد و تورم کمتر — بدون هیچ عدد ساختگی",
    keywords: [
      "ایمپلنت دیجیتال", "جراحی ایمپلنت با گاید", "گاید جراحی ایمپلنت چیست", "برنامه‌ریزی سه‌بعدی ایمپلنت",
      "CBCT برای ایمپلنت", "ایمپلنت با فلپ کمتر", "فلامپلس ایمپلنت", "ایمپلنت دقیق تهران", "مراحل ایمپلنت دیجیتال",
    ],
    sections: [
      "ایمپلنت دیجیتال دقیقاً با روش قدیمی چه فرقی دارد؟",
      "گاید جراحی چیست و چطور ساخته می‌شود؟",
      "چه کسی بیشترین سود را از ایمپلنت راهنماشده می‌برد؟",
      "مراحل ایمپلنت دیجیتال از اولین ویزیت تا روکش نهایی چیست؟",
      "آیا ایمپلنت دیجیتال یعنی بی‌درد و بدون تورم؟",
    ],
  },
  {
    n: 2,
    slug: "pericoronitis-wisdom-gum-infection",
    kicker: "پری‌کورونیت",
    category: "دندان نهفته",
    cover: "/uploads/wisdom-real.jpg",
    coverAlt: "عفونت لثه دور دندان عقل نیمه‌نهفته (پری‌کورونیت) — نمونه بالینی مطب دکتر پدرام بخشایی",
    subject: "پری‌کورونیت؛ عفونت دردناک لثه دور دندان عقل نیمه‌نهفته",
    angle: "چرا لثه دور دندان عقل نیمه‌رویش مکرراً عفونت می‌شود، علائم تریسموس و تورم گلو، درمان فوری موقت و قطعی، زمان جراحی",
    keywords: [
      "پری‌کورونیت چیست", "عفونت لثه دندان عقل", "تورم لثه دور دندان عقل", "درد دندان عقل نیمه‌نهفته",
      "تریسموس و مشکل باز کردن دهان", "شست‌وشوی دهان با کلرهگزیدین", "درمان پری‌کورونیت", "جراحی درپوش لثه",
    ],
    sections: [
      "پری‌کورونیت چیست و چرا مرتب برمی‌گردد؟",
      "علائمش چیست و کی خطرناک می‌شود؟",
      "تا رسیدن به پزشک چه کار کنیم و چه کار نکنیم؟",
      "درمان قطعی پری‌کورونیت چیست؟",
      "دندان عقل نیمه‌نهفته باید کشیده شود یا درپوش لثه برداشته شود؟",
    ],
  },
  {
    n: 3,
    slug: "dental-abscess-facial-space-infection",
    kicker: "عفونت فک و صورت",
    category: "سلامت دهان",
    cover: "/uploads/clinic-photo-3.jpg",
    coverAlt: "درمان آبسه دندانی و عفونت فضاهای فک در مطب دکتر پدرام بخشایی",
    subject: "آبسه دندانی و گسترش عفونت به فضاهای فک و صورت؛ اورژانس واقعی",
    angle: "مسیر گسترش عفونت دندان به گونه و گردن؛ علائم هشدار (تب، مشکل بلع، تنگی نفس)؛ چرا فقط آنتی‌بیوتیک کافی نیست؛ درناژ و درمان منبع",
    keywords: [
      "آبسه دندان", "عفونت دندان و تورم صورت", "تورم گونه از عفونت دندان", "تب و عفونت دندان",
      "درناژ آبسه فک", "عفونت فضای زیر فک", "اورژانس دندانپزشکی تهران", "آنتی‌بیوتیک برای عفونت دندان",
    ],
    sections: [
      "عفونت دندان چطور به گونه و گردن سرایت می‌کند؟",
      "کدام علائم یعنی اورژانس واقعی است؟",
      "چرا آنتی‌بیوتیک به‌تنهایی عفونت را ریشه‌کن نمی‌کند؟",
      "در مطب دقیقاً چه اتفاقی می‌افتد؟",
      "بعد از درناژ چه مراقبتی لازم است و چطور پیشگیری کنیم؟",
    ],
  },
  {
    n: 4,
    slug: "jaw-fracture-facial-trauma-surgery",
    kicker: "ترومای فک و صورت",
    category: "جراحی فک و صورت",
    cover: "/uploads/jaw-surgery-result.jpg",
    coverAlt: "جراحی شکستگی فک و صورت با پلاک تیتانیوم — تخصص مطب دکتر پدرام بخشایی",
    subject: "شکستگی فک و صورت (تروما)؛ از ضربه تا جراحی پلاک و بازگشت به زندگی عادی",
    angle: "علائم شکستگی فک و گونه، تصویربرداری CT، تایمینگ جراحی، پلاک و پیچ تیتانیوم، تغذیه و مراقبت، خطر بی‌عملی",
    keywords: [
      "شکستگی فک", "شکستگی گونه و زیگوماتیک", "جراحی شکستگی فک با پلاک", "تروما فک و صورت",
      "علائم شکستگی فک", "پلاک تیتانیوم فک", "درمان شکستگی چانه", "جراح فک و صورت برای تروما",
    ],
    sections: [
      "از کجا بفهمیم فک شکسته است یا فقط ضربه خورده؟",
      "شکستگی کدام استخوان‌های صورت شایع‌تر است؟",
      "جراحی شکستگی فک چطور انجام می‌شود و چه زمانی لازم است؟",
      "پلاک و پیچ تیتانیوم باید بعداً خارج شود؟",
      "دوره نقاهت و تغذیه بعد از جراحی تروما چیست و اگر عمل نشود چه می‌شود؟",
    ],
  },
  {
    n: 5,
    slug: "impacted-canine-exposure-surgery",
    kicker: "دندان نیش نهفته",
    category: "دندان نهفته",
    cover: "/uploads/clinic-photo-4.jpg",
    coverAlt: "جراحی باز کردن دندان نیش نهفته همراه با ارتودنسی — مطب دکتر پدرام بخشایی",
    subject: "دندان نیش نهفته (کانین)؛ جراحی باز کردن و هدایت به مسیر رویش همراه ارتودنسی",
    angle: "چرا نیش گیر می‌کند (دندان شیری مانده، مسیر انحرافی)، تشخیص با CBCT، جراحی باز کردن، براکت و زنجیر ارتودنسی، تایمینگ سن",
    keywords: [
      "دندان نیش نهفته", "کانین نهفته چیست", "جراحی باز کردن دندان نهفته", "دندان نهفته و ارتودنسی",
      "دندان شیری مانده در بزرگسالی", "براکت روی دندان نهفته", "جراحی دندان نیش", "بهترین سن درمان دندان نهفته",
    ],
    sections: [
      "دندان نیش چرا و کجا گیر می‌کند؟",
      "نهفته ماندن نیش چه خطراتی دارد؟",
      "چطور تشخیص داده می‌شود و بهترین سن اقدام کی است؟",
      "جراحی باز کردن نیش نهفته چطور انجام می‌شود؟",
      "بعد از جراحی در ارتودنسی چه می‌شود و اگر رها شود چه ریسکی هست؟",
    ],
  },
];

/* ───────────────── قواعد مشترک ───────────────── */

const ANTI_FAKE_STATS = `قاعده سخت ضد آمار ساختگی: هیچ درصدی (٪/درصد)، هیچ عدد میلی‌متری دقت، هیچ نرخ موفقیت و هیچ آمار پژوهشی از خودت نساز. فقط اعداد «حقایق مطب» مجازند. برای هر مقدار دیگر از عبارت توصیفی استفاده کن («به‌طور محسوس کمتر»، «معمولاً چند روز»، «متغیر است و پس از ویزیت اعلام می‌شود»). بازه‌های عمومی زمانی (مثل «۳ تا ۴ ماه»، «یک تا دو هفته») به‌عنوان دانش بالینی عمومی مجازند.`;

const SYSTEM = `تو نویسنده ارشد محتوای پزشکی فارسی برای وب‌سایت دکتر پدرام بخشایی (جراح دهان، فک و صورت، تهران) هستی.

قوانین غیرقابل‌اجتماع:
1. اورجینال مطلق — هر جمله از صفر نوشته می‌شود. کپی یا بازگویی نزدیک از هیچ منبعی ممنوع.
2. غیر خسته‌کننده: شروع با قلاب واقعی یک بیمار (بدون اختراع آمار)، جمله‌های کوتاه، پرسش‌محور، بدون کلی‌گویی.
3. قوانین محتوای مفید گوگل (E-E-A-T): تجربه اول‌شخص از مطب، پاسخ مستقیم در پاراگراف اول هر بخش، هیچ ادعای درمانی اثبات‌نشده، ذکر صادقانه محدودیت‌ها و ریسک‌ها.
4. ساختار AEO: هر h2 به شکل سوال واقعی کاربر؛ بلافاصله بعد از هر h2 یک بلوک p با پاسخ مستقیم ۲-۳ جمله‌ای؛ سپس توضیح کامل‌تر.
5. آمار فقط از «حقایق مطب»؛ هرگز ننویس «۹۵٪ موفقیت» یا «کمتر از ۰.۵ میلی‌متر» — به‌جایش بنویس «با مراقبت درست عمر ایمپلنت معمولاً طولانی است». توصیه دارویی مشخص (اسم و دوز دارو) ممنوع — فقط «طبق نسخه پزشک».
6. لحن احترام‌آمیز و آرامش‌بخش، بدون ترساندن بیمار.
7. فقط و فقط یک شیء JSON معتبر برگردان — بدون markdown، بدون backtick، بدون کامنت، بدون هیچ متن اضافه.
${ANTI_FAKE_STATS}`;

const SECTION_RULE = `برای هر سکشن دقیقاً سه بلوک می‌آید: h2 سوالی با id لاتین کوتاه، بعد p پاسخ مستقیم ۲-۳ جمله‌ای، بعد p توضیح کامل ۱۱۰ تا ۱۵۰ کلمه. عنوان h2 را عیناً کپی نکن — مفهوم را با عبارت‌پردازی خودت بیاور.`;

function prompt1(t: TopicSpec, corrective: string): string {
  const sections = t.sections.slice(0, 2).map((s) => `- ${s}`).join("\n");
  return `موضوع: «${t.subject}»
زاویه: ${t.angle}
کلیدواژه‌های هدف: ${t.keywords.join("، ")}

حقایق مطب (تنها منبع آمار مجاز):
${FACTS}

در این مرحله فقط بخش اول مقاله را تولید کن. خروجی دقیقاً این JSON باشد:
{
  "title": "حداکثر ۶۰ کاراکتر با کلیدواژه اصلی",
  "metaTitle": "حداکثر ۶۰ کاراکتر",
  "metaDesc": "حدود ۱۲۰ تا ۱۸۰ کاراکتر، وسوسه‌کننده",
  "h1": "عنوان اصلی مقاله",
  "excerpt": "حدود ۱۵۰ تا ۲۸۰ کاراکتر که مشکل واقعی کاربر را صدا بزند",
  "tags": ["۴ تا ۶ تگ فارسی، هر یک حداکثر ۵۰ کاراکتر"],
  "keywords": ["۸ تا ۱۲ کلیدواژه سئو فارسی، هر یک حداکثر ۷۰ کاراکتر"],
  "quickAnswers": [{"q":"سوال مستقیم","a":"پاسخ ۴۰-۷۰ کلمه‌ای، حداکثر ۵۰۰ کاراکتر"}],
  "blocksPart1": [
    {"type":"p","text":"قلاب آغازین — داستان کوتاه واقع‌نما، ۸۰ تا ۱۲۰ کلمه"},
    {"type":"quickAnswers"},
    {"type":"h2","id":"english-id","text":"..."},
    {"type":"p","text":"پاسخ مستقیم ۲-۳ جمله‌ای"},
    {"type":"p","text":"توضیح کامل ۱۱۰ تا ۱۵۰ کلمه"}
  ]
}

قواعد blocksPart1:
- دقیقاً برای این ۲ سکشن اول h2 بساز:
${sections}
- ${SECTION_RULE}
- داخل JSON هیچ کامنتی ننویس. quickAnswers دقیقاً ۴ مورد، سوال‌هایی که کاربر واقعاً در گوگل می‌پرسد.${corrective}`;
}

function prompt2(t: TopicSpec, doneH2s: string[], corrective: string): string {
  const sections = t.sections.slice(2, 4).map((s) => `- ${s}`).join("\n");
  const done = doneH2s.map((s) => `- ${s}`).join("\n");
  return `ادامه مقاله «${t.subject}» برای سایت دکتر پدرام بخشایی.

سکشن‌هایی که قبلاً پوشش داده شد (تکرارشان ممنوع):
${done}

حقایق مطب (تنها منبع آمار مجاز):
${FACTS}

در این مرحله فقط این JSON را برگردان:
{
  "blocksPart2": [
    {"type":"h2","id":"english-id","text":"..."},
    {"type":"p","text":"پاسخ مستقیم ۲-۳ جمله‌ای"},
    {"type":"p","text":"توضیح کامل ۱۱۰ تا ۱۵۰ کلمه"},
    {"type":"list","items":["حداقل ۶ آیتم کاربردی، هر آیتم ۸ تا ۲۰ کلمه"]},
    {"type":"table","caption":"...","head":["ستون ۱","ستون ۲","ستون ۳"],"rows":[["...","...","..."]]}
  ]
}

قواعد blocksPart2:
- دقیقاً برای این ۲ سکشن h2 بساز:
${sections}
- ${SECTION_RULE}
- بعد از سکشن‌ها: یک بلوک list (حداقل ۶ آیتم) و یک بلوک table (۳ ستون، ۴ تا ۶ ردیف با داده کاربردی مرتبط با موضوع).
- داخل JSON هیچ کامنتی ننویس.${corrective}`;
}

function prompt3(t: TopicSpec, doneH2s: string[], corrective: string): string {
  const section = `- ${t.sections[4]}`;
  const done = doneH2s.map((s) => `- ${s}`).join("\n");
  return `پایان‌بخشی مقاله «${t.subject}» برای سایت دکتر پدرام بخشایی.

سکشن‌هایی که قبلاً پوشش داده شد (تکرارشان ممنوع):
${done}

حقایق مطب (تنها منبع آمار مجاز):
${FACTS}

لینک‌های داخلی مجاز برای بلوک links (دقیقاً ۳ مورد انتخاب کن):
${INTERNAL_LINKS}

در این مرحله فقط این JSON را برگردان:
{
  "blocksPart3": [
    {"type":"h2","id":"english-id","text":"..."},
    {"type":"p","text":"پاسخ مستقیم ۲-۳ جمله‌ای"},
    {"type":"p","text":"توضیح کامل ۱۱۰ تا ۱۵۰ کلمه"},
    {"type":"callout","tone":"warn","title":"...","text":"هشدار مهم و صادقانه ۴۰ تا ۷۰ کلمه"},
    {"type":"links","title":"...","links":[{"href":"...","label":"...","desc":"..."}]},
    {"type":"cta"}
  ],
  "faqs": [{"q":"...","a":"پاسخ ۶۰-۱۱۰ کلمه‌ای، حداکثر ۹۰۰ کاراکتر"}]
}

قواعد blocksPart3:
- برای این سکشن پایانی h2 بساز:
${section}
- ${SECTION_RULE}
- سپس به همین ترتیب: callout (tone warn یا tip)، links (دقیقاً ۳ لینک از لیست مجاز)، و بلوک آخر حتماً {"type":"cta"} و هیچ بلوکی بعد از cta نباشد.
- faqs دقیقاً ۵ مورد، مکمل و بدون تکرار سوال‌های قبلی.
- داخل JSON هیچ کامنتی ننویس.${corrective}`;
}

/* ───────────────── ابزار ───────────────── */

interface BlockLike {
  type: string;
  text?: unknown;
  items?: unknown;
  head?: unknown;
  rows?: unknown;
  links?: unknown;
}

function extractJson(raw: string): Record<string, unknown> | null {
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
      } catch {
        return null;
      }
    }
    return null;
  }
}

/** کپی منطق articleWordCount سایت (src/lib/blog/posts.ts) — عدد باید با محاسبه سرور یکی باشد */
function wordCount(a: {
  blocks?: BlockLike[];
  quickAnswers?: { q: string; a: string }[];
  faqs?: { q: string; a: string }[];
  excerpt?: string;
}): number {
  const parts: string[] = [a.excerpt ?? ""];
  for (const b of a.blocks ?? []) {
    if ("text" in b && typeof b.text === "string") parts.push(b.text);
    if ("items" in b && Array.isArray(b.items)) parts.push(b.items.join(" "));
    if ("rows" in b && Array.isArray(b.rows)) parts.push((b.rows as string[][]).flat().join(" "));
    if ("head" in b && Array.isArray(b.head)) parts.push(b.head.join(" "));
  }
  for (const qa of a.quickAnswers ?? []) parts.push(qa.q, qa.a);
  for (const f of a.faqs ?? []) parts.push(f.q, f.a);
  return parts.join(" ").split(/\s+/).filter((w) => /[\u0600-\u06FFa-zA-Z0-9]/.test(w)).length;
}

function countType(blocks: BlockLike[], type: string): number {
  return blocks.filter((b) => b.type === type).length;
}

/** اسکن آمار ساختگی — درصد/میلی‌متر/نرخ موفقیت در هیچ متنی مجاز نیست */
function hasFakeStats(text: string): boolean {
  return /\d+\s*(٪|%|درصد)/.test(text) || /میلی‌متر/.test(text) || /نرخ موفقیت/.test(text);
}

function collectFakeStats(blocks: BlockLike[], quickAnswers: { a: string }[], faqs: { a: string }[]): boolean {
  const texts: string[] = [];
  for (const b of blocks) {
    if (typeof b.text === "string") texts.push(b.text);
    if (Array.isArray(b.items)) texts.push(b.items.join(" "));
    if (Array.isArray(b.rows)) texts.push((b.rows as string[][]).flat().join(" "));
  }
  for (const qa of quickAnswers) texts.push(qa.a);
  for (const f of faqs) texts.push(f.a);
  return texts.some(hasFakeStats);
}

function validate(raw: Record<string, unknown>): { issues: string[]; words: number } {
  const issues: string[] = [];
  const blocks = Array.isArray(raw.blocks) ? (raw.blocks as BlockLike[]) : [];
  const quickAnswers = Array.isArray(raw.quickAnswers) ? (raw.quickAnswers as { q: string; a: string }[]) : [];
  const faqs = Array.isArray(raw.faqs) ? (raw.faqs as { q: string; a: string }[]) : [];
  const metaDesc = String(raw.metaDesc ?? "");
  const excerpt = String(raw.excerpt ?? "");

  if (!raw.title || !raw.metaTitle || !raw.h1) issues.push("title/metaTitle/h1 missing");
  if (metaDesc.length < 100 || metaDesc.length > 210) issues.push(`metaDesc=${metaDesc.length} chars`);
  if (excerpt.length < 140 || excerpt.length > 330) issues.push(`excerpt=${excerpt.length} chars`);
  if (blocks.length < 14) issues.push(`blocks=${blocks.length}`);
  if (countType(blocks, "h2") !== 5) issues.push(`h2=${countType(blocks, "h2")}`);
  if (countType(blocks, "p") < 10) issues.push(`p=${countType(blocks, "p")}`);
  if (countType(blocks, "list") < 1) issues.push("list missing");
  if (countType(blocks, "table") < 1) issues.push("table missing");
  if (countType(blocks, "callout") < 1) issues.push("callout missing");
  if (countType(blocks, "links") !== 1) issues.push(`links=${countType(blocks, "links")}`);
  if (countType(blocks, "cta") !== 1 || blocks[blocks.length - 1]?.type !== "cta") issues.push("cta must be last");
  if (quickAnswers.length !== 4) issues.push(`quickAnswers=${quickAnswers.length}`);
  if (faqs.length !== 5) issues.push(`faqs=${faqs.length}`);
  for (const qa of quickAnswers) if (String(qa.a).length > 600) issues.push("quickAnswer >600 chars");
  for (const f of faqs) if (String(f.a).length > 1200) issues.push("faq >1200 chars");
  if (collectFakeStats(blocks, quickAnswers, faqs)) issues.push("آمار ساختگی (درصد/میلی‌متر) پیدا شد — حذف شود");
  const words = wordCount({ blocks, quickAnswers, faqs, excerpt });
  if (words < 1050) issues.push(`wordCount=${words}`);
  return { issues, words };
}

const withTimeout = <T,>(p: Promise<T>, ms: number, label: string): Promise<T> =>
  Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} بیش از ${Math.round(ms / 1000)} ثانیه طول کشید`)), ms)
    ),
  ]);

type ZAIInstance = Awaited<ReturnType<typeof ZAI.create>>;

async function callJson(
  zai: ZAIInstance,
  tag: string,
  system: string,
  user: string
): Promise<Record<string, unknown>> {
  const completion = await withTimeout(
    zai.chat.completions.create({
      messages: [
        { role: "assistant", content: system },
        { role: "user", content: user },
      ],
      thinking: { type: "disabled" },
    }),
    420_000,
    tag
  );
  const rawText = completion.choices[0]?.message?.content ?? "";
  if (DEBUG_RAW) writeFileSync(path.join(OUT_DIR, `raw-${tag}.txt`), rawText, "utf8");
  const parsed = extractJson(rawText);
  if (!parsed) throw new Error(`${tag}: پاسخ مدل JSON معتبر نبود`);
  return parsed;
}

function h2Texts(blocks: BlockLike[]): string[] {
  return blocks.filter((b) => b.type === "h2").map((b) => String(b.text ?? ""));
}

/* ───────────────── اجرا ───────────────── */

async function main() {
  const idx = Number(process.argv[2] ?? "0");
  const topic = TOPICS.find((t) => t.n === idx);
  if (!topic) {
    console.error("usage: bun scripts/draft-articles.ts <1..5>");
    process.exit(1);
  }

  const zai = await ZAI.create();
  let lastErr = "";

  for (let attempt = 1; attempt <= 5; attempt++) {
    const corrective =
      attempt === 1
        ? ""
        : `\n\nهشدار: تلاش قبلی رد شد (${lastErr}). حتماً یک شیء JSON واحد و کامل با تمام قواعد برگردان — خلاصه یا طرح‌واره ناقص قابل قبول نیست.`;
    try {
      console.log(`[draft ${topic.n}] attempt ${attempt} p1 — ${topic.subject}`);
      const part1 = await callJson(zai, `${topic.n}-a${attempt}-p1`, SYSTEM, prompt1(topic, corrective));
      const p1Blocks = Array.isArray(part1.blocksPart1) ? (part1.blocksPart1 as BlockLike[]) : [];
      const p1H2s = h2Texts(p1Blocks);
      if (p1H2s.length !== 2) throw new Error(`part1: ${p1H2s.length} سکشن h2 (باید ۲ باشد)`);
      if (!Array.isArray(part1.quickAnswers) || (part1.quickAnswers as unknown[]).length !== 4)
        throw new Error("part1: quickAnswers باید دقیقاً ۴ مورد باشد");
      const metaDesc = String(part1.metaDesc ?? "");
      if (metaDesc.length < 100 || metaDesc.length > 210)
        throw new Error(`part1: metaDesc=${metaDesc.length} chars (باید ۱۲۰-۱۸۰)`);

      console.log(`[draft ${topic.n}] attempt ${attempt} p2`);
      const part2 = await callJson(zai, `${topic.n}-a${attempt}-p2`, SYSTEM, prompt2(topic, p1H2s, corrective));
      const p2Blocks = Array.isArray(part2.blocksPart2) ? (part2.blocksPart2 as BlockLike[]) : [];
      if (h2Texts(p2Blocks).length !== 2) throw new Error("part2: باید دقیقاً ۲ سکشن h2 داشته باشد");

      console.log(`[draft ${topic.n}] attempt ${attempt} p3`);
      const part3 = await callJson(zai, `${topic.n}-a${attempt}-p3`, SYSTEM, prompt3(topic, [...p1H2s, ...h2Texts(p2Blocks)], corrective));
      const p3Blocks = Array.isArray(part3.blocksPart3) ? (part3.blocksPart3 as BlockLike[]) : [];
      if (h2Texts(p3Blocks).length !== 1) throw new Error("part3: باید دقیقاً ۱ سکشن h2 داشته باشد");
      if (!Array.isArray(part3.faqs) || (part3.faqs as unknown[]).length !== 5)
        throw new Error("part3: faqs باید دقیقاً ۵ مورد باشد");

      const merged = {
        ...part1,
        blocks: [...p1Blocks, ...p2Blocks, ...p3Blocks],
        faqs: part3.faqs,
      };
      delete (merged as Record<string, unknown>).blocksPart1;
      delete (merged as Record<string, unknown>).blocksPart2;
      delete (merged as Record<string, unknown>).blocksPart3;

      const { issues, words } = validate(merged);
      if (issues.length) throw new Error(issues.join("، "));

      /* فیلدهای مهارشده از spec ثابت می‌مانند تا با طرح کلی سایت یکی باشند */
      const payload = {
        slug: topic.slug,
        title: String(part1.metaTitle ?? part1.title),
        description: String(part1.metaDesc ?? ""),
        h1: String(part1.h1 ?? part1.title),
        kicker: topic.kicker,
        excerpt: String(part1.excerpt ?? ""),
        category: topic.category,
        published: true,
        tags: (part1.tags ?? []) as string[],
        keywords: (part1.keywords ?? topic.keywords) as string[],
        coverImage: topic.cover,
        coverAlt: topic.coverAlt,
        blocks: merged.blocks,
        quickAnswers: part1.quickAnswers,
        faqs: part3.faqs,
        source: "api",
      };

      const file = path.join(OUT_DIR, `article-${topic.n}-${topic.slug}.json`);
      writeFileSync(file, JSON.stringify(payload, null, 2), "utf8");
      console.log(`[draft ${topic.n}] OK — ${words} words → ${file}`);
      return;
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e);
      console.warn(`[draft ${topic.n}] attempt ${attempt} failed: ${lastErr}`);
      if (lastErr.includes("429")) {
        console.log(`[draft ${topic.n}] rate-limited — 30s backoff`);
        await new Promise((r) => setTimeout(r, 30_000));
      } else {
        await new Promise((r) => setTimeout(r, 5_000));
      }
    }
  }
  console.error(`[draft ${topic.n}] FAILED after 5 attempts — ${lastErr}`);
  process.exit(1);
}

main();
