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
