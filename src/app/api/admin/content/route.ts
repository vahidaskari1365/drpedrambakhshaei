import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { deleteOverride, getMergedContent, getOverridesMap, saveOverride } from "@/lib/content-store";
import { CONTENT_LABELS, type ContentKey } from "@/lib/site-content";

export const dynamic = "force-dynamic";

/** محتوای کامل سایت (پیش‌فرض + بازنویسی‌های ادمین) برای ویرایشگر پنل */
export async function GET(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;

  const { meta } = await getOverridesMap();
  const content = await getMergedContent();
  return NextResponse.json({ content, overrides: meta });
}

/** ذخیره بازنویسی یک مجموعه محتوا */
export async function PUT(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;

  try {
    const body = (await req.json()) as { key?: string; data?: unknown; summary?: string };
    if (!body.key || body.data === undefined) {
      return NextResponse.json({ error: "کلید یا داده ارسال نشده" }, { status: 400 });
    }
    const meta = await saveOverride(body.key, body.data, body.summary);
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
