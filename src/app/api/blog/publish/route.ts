/**
 * API انتشار مقاله — نقطه ورود خارجی برای ایجنت‌ها/ابزارهای دیگر
 *
 * POST /api/blog/publish
 * هدر: x-admin-key
 * بدنه: ساختار فیلدهای استاندارد (title, description, baseSlug, blocks, ...)
 * idempotent روی slug — تکرار همان اسلاگ = به‌روزرسانی مقاله موجود
 */
import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { publishPost, publishSchema } from "@/lib/blog/posts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const denied = checkAdmin(request);
  if (denied) return denied;
  try {
    const parsed = publishSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "ساختار داده نامعتبر است", issues: parsed.error.issues.slice(0, 6) },
        { status: 400 }
      );
    }
    const result = await publishPost({ ...parsed.data, source: parsed.data.source || "api" });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "خطای ناشناخته" },
      { status: 500 }
    );
  }
}

/** فهرست مقاله‌های دیتابیس (متادیتا) برای ابزارهای مدیریتی */
export async function GET(request: Request) {
  const denied = checkAdmin(request);
  if (denied) return denied;
  try {
    const { db } = await import("@/lib/db");
    const rows = await db.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
      take: 200,
      select: {
        id: true, title: true, published: true, publishedAt: true,
        readingTime: true, coverImage: true, source: true, contentHash: true,
      },
    });
    return NextResponse.json({ ok: true, count: rows.length, posts: rows });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "خطای ناشناخته" },
      { status: 500 }
    );
  }
}

/**
 * PATCH — به‌روزرسانی جزئی فیلدهای کاور مقاله موجود (بدون دست‌زدن به متن)
 * بدنه: { slug, coverImage, coverAlt? } — فقط slug و coverImage الزامی‌اند
 * کاور در دو لایه ذخیره می‌شود (ستون coverImage + JSON خود مقاله) و هر دو آپدیت می‌شوند
 */
export async function PATCH(request: Request) {
  const denied = checkAdmin(request);
  if (denied) return denied;
  try {
    const body = (await request.json()) as { slug?: string; coverImage?: string; coverAlt?: string };
    const slug = body.slug?.trim();
    const coverImage = body.coverImage?.trim();
    if (!slug || !coverImage || !/^\/[^\s]+$/u.test(coverImage)) {
      return NextResponse.json(
        { ok: false, error: "slug و coverImage (مسیر نسبی مثل /uploads/x.jpg) الزامی است" },
        { status: 400 }
      );
    }
    const { db } = await import("@/lib/db");
    const row = await db.blogPost.findUnique({ where: { id: slug } });
    if (!row) {
      return NextResponse.json({ ok: false, error: `مقاله «${slug}» پیدا نشد` }, { status: 404 });
    }
    const article = (JSON.parse(row.article || "{}") as Record<string, unknown>) ?? {};
    article.cover = coverImage;
    if (body.coverAlt?.trim()) article.coverAlt = body.coverAlt.trim();
    const updated = await db.blogPost.update({
      where: { id: slug },
      data: { coverImage, article: JSON.stringify(article) },
    });
    return NextResponse.json({
      ok: true,
      slug: updated.id,
      cover: updated.coverImage,
      action: "cover-patched",
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "خطای ناشناخته" },
      { status: 500 }
    );
  }
}
