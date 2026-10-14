/**
 * آپلود رسانه — POST /api/admin/upload (multipart/form-data، فیلد file)
 *
 * فایل به‌صورت base64 در جدول Media ذخیره و از /api/media/<id> سرو می‌شود.
 * مصرف‌کننده‌ها: فیلد تصویر ویرایشگر پنل (آپلود از دستگاه) + تب کتابخانه رسانه.
 * نکته: این مسیر قبلاً وجود نداشت و آپلود پنل همیشه خطا می‌داد — اکنون ترمیم شد.
 */
import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/content-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // ۵ مگابایت — برای کاور و گالری کافی است
/** فقط تصاویر امن (بدون SVG — ریسک XSS ذخیره‌شده) */
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

export async function POST(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "فایلی ارسال نشد" }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: "فقط تصویر JPEG، PNG، WebP، GIF یا AVIF پذیرفته می‌شود" },
        { status: 415 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "حجم فایل بیش از ۵ مگابایت است" }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length === 0) {
      return NextResponse.json({ error: "فایل خالی است" }, { status: 400 });
    }

    // نام فقط برای نمایش است؛ سرو بر اساس mime انجام می‌شود
    const safeName =
      (file.name || "upload").replace(/[^\w.\u0600-\u06FF-]+/g, "-").slice(0, 80) || "upload";

    const media = await db.media.create({
      data: {
        filename: safeName,
        mime: file.type,
        size: buffer.length,
        data: buffer.toString("base64"),
      },
    });

    await logActivity(
      "create",
      "media",
      `تصویر «${safeName}» آپلود شد (${Math.max(1, Math.round(buffer.length / 1024))} کیلوبایت)`
    );
    return NextResponse.json({ ok: true, id: media.id, url: `/api/media/${media.id}` });
  } catch (e) {
    console.error("[admin/upload]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "آپلود ناموفق بود" },
      { status: 500 }
    );
  }
}
