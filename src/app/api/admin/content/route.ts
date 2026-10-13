import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { deleteOverride, getMergedContent, getOverridesMap, saveOverride } from "@/lib/content-store";
import { syncBlogFromPanel } from "@/lib/blog/posts";
import { CONTENT_LABELS, type ContentKey } from "@/lib/site-content";
import type { BlogArticle } from "@/lib/blog-data";

export const dynamic = "force-dynamic";

/** محتوای کامل سایت (پیش‌فرض + بازنویسی‌های ادمین) برای ویرایشگر پنل */
export async function GET(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;

  const { meta } = await getOverridesMap();
  const content = await getMergedContent();
  return NextResponse.json({ content, overrides: meta });
}

/** ذخیره بازنویسی یک مجموعه محتوا — برای بلاگ: همگام‌سازی دوسویه با جدول BlogPost */
export async function PUT(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;

  try {
    const body = (await req.json()) as {
      key?: string;
      data?: unknown;
      summary?: string;
      knownSlugs?: unknown;
    };
    if (!body.key || body.data === undefined) {
      return NextResponse.json({ error: "کلید یا داده ارسال نشده" }, { status: 400 });
    }
    // فقط کلیدهای شناخته‌شده مجموعه‌های محتوایی مجازند — ضد آلودگی دیتابیس
    if (!(body.key in CONTENT_LABELS)) {
      return NextResponse.json({ error: "کلید محتوای ناشناخته" }, { status: 400 });
    }

    let data = body.data;
    let summary = body.summary;

    // بلاگ: مقاله‌های دیتابیس (ایجنت/API) مستقیم روی جدول BlogPost نوشته/حذف
    // می‌شوند و از override خارج می‌شوند — ویرایش پنل، منبع حقیقت را می‌شکند
    if (body.key === "blog" && Array.isArray(body.data)) {
      const payload = body.data as BlogArticle[];
      const knownSlugs = Array.isArray(body.knownSlugs)
        ? (body.knownSlugs as unknown[]).filter((s): s is string => typeof s === "string").slice(0, 1000)
        : undefined;
      const sync = await syncBlogFromPanel(payload, knownSlugs);
      const written = new Set(sync.updated);
      data = payload.filter((a) => !written.has(a.slug));
      if (sync.updated.length > 0 || sync.deleted.length > 0) {
        const note = ` · همگام‌سازی: ${sync.updated.length.toLocaleString("fa-IR")} ویرایش دیتابیس، ${sync.deleted.length.toLocaleString("fa-IR")} حذف`;
        summary = summary ? `${summary}${note}` : `بلاگ ذخیره شد${note}`;
      }
    }

    const meta = await saveOverride(body.key, data, summary);
    const content = await getMergedContent();
    return NextResponse.json({
      ok: true,
      meta,
      label: CONTENT_LABELS[body.key as ContentKey] ?? body.key,
      content,
    });
  } catch (e) {
    console.error("[admin/content PUT]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "ذخیره محتوا ناموفق بود" },
      { status: 400 }
    );
  }
}

/** بازنشانی یک مجموعه به پیش‌فرض کد */
export async function DELETE(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;

  try {
    const key = new URL(req.url).searchParams.get("key");
    if (!key) return NextResponse.json({ error: "کلید ارسال نشده" }, { status: 400 });
    await deleteOverride(key);
    const content = await getMergedContent();
    return NextResponse.json({
      ok: true,
      label: CONTENT_LABELS[key as ContentKey] ?? key,
      content,
    });
  } catch (e) {
    console.error("[admin/content DELETE]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "بازنشانی ناموفق بود" },
      { status: 400 }
    );
  }
}
