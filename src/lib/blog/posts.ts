/**
 * لایه مقاله‌های دیتابیس — انتشار API و ایجنت محتوا هر دو از همین هسته استفاده می‌کنند
 *
 * الگو (برگرفته از OpenClaw): یک owner برای وضعیت انتشار؛ idempotency با upsert
 * روی slug؛ ثبت فعالیت best-effort که هرگز خطا بالا نمی‌دهد.
 */
import { createHash } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/content-store";
import type { ArticleBlock, BlogArticle } from "../blog-data";

/* ───────────────── slug ───────────────── */

/** اسلاگ لاتین از عنوان/پایه — برای عنوان فارسی خالی، پسوند تاریخ می‌گذارد */
export function slugify(input: string): string {
  const base = (input || "")
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/[\u0600-\u06FF]/g, "") // اسلاگ باید لاتین باشد
    .replace(/^-+|-+$/g, "");
  if (base.length >= 3) return base.slice(0, 90);
  return `post-${new Date().toISOString().slice(0, 10)}-${hashOf(input || String(Date.now())).slice(0, 6)}`;
}

export function hashOf(value: unknown): string {
  return createHash("sha1").update(JSON.stringify(value) ?? "").digest("hex");
}

/* ───────────────── اعتبارسنجی ورودی انتشار ───────────────── */

const blockSchema: z.ZodType<ArticleBlock> = z.lazy(() =>
  z.union([
    z.object({ type: z.literal("h2"), id: z.string().default(""), text: z.string() }),
    z.object({ type: z.literal("h3"), text: z.string() }),
    z.object({ type: z.literal("p"), text: z.string() }),
    z.object({ type: z.literal("list"), ordered: z.boolean().optional(), items: z.array(z.string()) }),
    z.object({
      type: z.literal("table"),
      caption: z.string().optional(),
      head: z.array(z.string()),
      rows: z.array(z.array(z.string())),
    }),
    z.object({
      type: z.literal("callout"),
      tone: z.enum(["info", "warn", "tip"]).default("info"),
      title: z.string(),
      text: z.string(),
    }),
    z.object({ type: z.literal("image"), src: z.string(), alt: z.string(), caption: z.string().optional() }),
    z.object({ type: z.literal("quickAnswers") }),
    z.object({ type: z.literal("faq") }),
    z.object({
      type: z.literal("links"),
      title: z.string(),
      links: z.array(z.object({ href: z.string(), label: z.string(), desc: z.string() })),
    }),
    z.object({ type: z.literal("cta") }),
  ]) as z.ZodType<ArticleBlock>
);

export const publishSchema = z.object({
  slug: z.string().min(2).max(120).optional(),
  baseSlug: z.string().max(120).optional(),
  title: z.string().min(3).max(220),
  description: z.string().max(500).default(""),
  h1: z.string().max(220).optional(),
  kicker: z.string().max(120).optional(),
  excerpt: z.string().max(500).optional(),
  category: z.string().max(80).default("جراحی فک و صورت"),
  published: z.boolean().default(true),
  publishedAt: z.string().datetime().optional(),
  tags: z.array(z.string().max(60)).max(12).default([]),
  keywords: z.array(z.string().max(80)).max(20).default([]),
  readingTime: z.number().int().min(1).max(90).optional(),
  coverImage: z.string().max(300).default(""),
  coverAlt: z.string().max(300).default(""),
  schemaType: z.string().max(60).optional(),
  videoUrl: z.string().max(300).optional(),
  blocks: z.array(blockSchema).default([]),
  quickAnswers: z.array(z.object({ q: z.string().max(200), a: z.string().max(600) })).max(8).default([]),
  faqs: z.array(z.object({ q: z.string().max(200), a: z.string().max(1200) })).max(10).default([]),
  article: z.record(z.string(), z.unknown()).optional(), // JSON کامل BlogArticle — بر سایر فیلدها اولویت دارد
  contentHash: z.string().max(64).optional(),
  source: z.string().max(40).default("api"),
  // سازگاری با کلاینت‌های خارجی — ذخیره می‌شود ولی رندر از blocks است
  bodyHtml: z.string().max(200_000).optional(),
  seo: z.record(z.string(), z.unknown()).optional(),
  parsedSnapshot: z.boolean().optional(),
});

export type PublishInput = z.input<typeof publishSchema>;

/* ───────────────── شمارش کلمه ───────────────── */

export function articleWordCount(a: Pick<BlogArticle, "blocks" | "quickAnswers" | "faqs" | "excerpt">): number {
  const parts: string[] = [a.excerpt ?? ""];
  for (const b of a.blocks ?? []) {
    if ("text" in b && typeof b.text === "string") parts.push(b.text);
    if ("items" in b && Array.isArray(b.items)) parts.push(b.items.join(" "));
    if ("rows" in b && Array.isArray(b.rows)) parts.push(b.rows.flat().join(" "));
    if ("head" in b && Array.isArray(b.head)) parts.push(b.head.join(" "));
  }
  for (const qa of a.quickAnswers ?? []) parts.push(qa.q, qa.a);
  for (const f of a.faqs ?? []) parts.push(f.q, f.a);
  return parts.join(" ").split(/\s+/).filter((w) => /[\u0600-\u06FFa-zA-Z0-9]/.test(w)).length;
}

/* ───────────────── نرمال‌سازی بلوک‌ها ───────────────── */

/** خروجی AI همیشه تمیز نیست — بلوک‌ها را به ساختار امن رندر تبدیل می‌کنیم */
function sanitizeBlocks(blocks: ArticleBlock[]): ArticleBlock[] {
  return blocks
    .map((b): ArticleBlock => {
      if (b.type === "links") {
        const links = (b.links ?? [])
          .map((l) => ({
            href: String(l.href ?? (l as { url?: string }).url ?? ""),
            label: String(l.label ?? (l as { title?: string }).title ?? ""),
            desc: String(l.desc ?? ""),
          }))
          .filter((l) => l.href.length > 0)
          .slice(0, 6);
        return { ...b, links };
      }
      if (b.type === "h2") {
        return { ...b, id: b.id || slugify(String(b.text ?? "")) || "section" };
      }
      return b;
    })
    .filter((b) => (b.type === "links" ? b.links.length > 0 : true));
}

/* ───────────────── ساخت BlogArticle از ورودی انتشار ───────────────── */

function todayFa(): string {
  try {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
  } catch {
    return "";
  }
}

export function assembleArticle(input: PublishInput, coverImage: string): BlogArticle {
  const src = (input.article ?? {}) as Partial<BlogArticle>;
  const slug = slugify(input.baseSlug || input.slug || src.slug || input.title);
  const blocks = sanitizeBlocks((src.blocks?.length ? src.blocks : input.blocks ?? []) as ArticleBlock[]);
  const quickAnswers = src.quickAnswers?.length ? src.quickAnswers : input.quickAnswers ?? [];
  const faqs = src.faqs?.length ? src.faqs : input.faqs ?? [];
  const excerpt = src.excerpt || input.excerpt || input.description || "";
  const wordCount = articleWordCount({ blocks, quickAnswers, faqs, excerpt });

  return {
    slug,
    metaTitle: src.metaTitle || input.title,
    metaDesc: src.metaDesc || input.description || "",
    keywords: src.keywords?.length ? src.keywords : input.keywords ?? [],
    h1: src.h1 || input.h1 || input.title,
    kicker: src.kicker || input.kicker || "",
    excerpt,
    category: src.category || input.category || "جراحی فک و صورت",
    tags: src.tags?.length ? src.tags : input.tags ?? [],
    cover: src.cover || coverImage || input.coverImage || "/uploads/implant-art.jpg",
    coverAlt: src.coverAlt || input.coverAlt || input.title,
    readingMinutes: src.readingMinutes || input.readingTime || Math.max(2, Math.round(wordCount / 190)),
    wordCount,
    publishDate: (src.publishDate || input.publishedAt || new Date().toISOString()).slice(0, 10),
    publishDateFa: src.publishDateFa || todayFa(),
    author: src.author ?? {
      name: "دکتر پدرام بخشایی",
      role: "متخصص جراحی دهان، فک و صورت — رتبه ۲ بورد تخصصی کشور",
      avatar: "/uploads/doctor-portrait.jpg",
    },
    quickAnswers,
    faqs,
    blocks,
  };
}

/* ───────────────── انتشار (upsert) ───────────────── */

export interface PublishResult {
  ok: true;
  id: string;
  action: "created" | "updated";
  wordCount: number;
}

/** انتشار/به‌روزرسانی مقاله — idempotent روی slug */
export async function publishPost(input: PublishInput): Promise<PublishResult> {
  const article = assembleArticle(input, input.coverImage ?? "");
  const contentHash = input.contentHash || hashOf(article).slice(0, 16);
  const publishedAt = input.publishedAt ? new Date(input.publishedAt) : new Date();

  const existing = await db.blogPost.findUnique({ where: { id: article.slug }, select: { id: true } });
  const data = {
    title: input.title,
    description: input.description ?? "",
    published: input.published ?? true,
    publishedAt,
    tags: JSON.stringify(article.tags),
    keywords: JSON.stringify(article.keywords),
    readingTime: article.readingMinutes,
    coverImage: article.cover,
    article: JSON.stringify(article),
    contentHash,
    source: input.source ?? "api",
  };
  await db.blogPost.upsert({ where: { id: article.slug }, update: data, create: { id: article.slug, ...data } });

  await logActivity(
    existing ? "agent.post.updated" : "agent.post.published",
    article.slug,
    `${existing ? "به‌روزرسانی" : "انتشار"} مقاله «${input.title}» (${article.wordCount} کلمه) از مسیر ${input.source}`
  );
  return { ok: true, id: article.slug, action: existing ? "updated" : "created", wordCount: article.wordCount };
}

/* ───────────────── خواندن مقاله‌های دیتابیس ───────────────── */

/** مقاله‌های منتشرشده دیتابیس به شکل BlogArticle — برای ادغام در محتوای سایت */
export async function listDbArticles(): Promise<BlogArticle[]> {
  const rows = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 500,
  });
  const out: BlogArticle[] = [];
  for (const row of rows) {
    try {
      const parsed = JSON.parse(row.article) as Partial<BlogArticle>;
      if (parsed?.slug && Array.isArray(parsed.blocks)) {
        out.push({ ...parsed, slug: parsed.slug || row.id } as BlogArticle);
        continue;
      }
    } catch {
      /* JSON خراب → از فیلدهای پایه می‌سازیم */
    }
    out.push(
      assembleArticle(
        publishSchema.parse({
          title: row.title,
          description: row.description,
          tags: JSON.parse(row.tags || "[]"),
          keywords: JSON.parse(row.keywords || "[]"),
          readingTime: row.readingTime,
          coverImage: row.coverImage,
          article: {},
        }),
        row.coverImage
      )
    );
  }
  return out;
}
