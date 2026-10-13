import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { rateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/content-store";

export const dynamic = "force-dynamic";

const MAX_BYTES = 4 * 1024 * 1024; // حداکثر ۴ مگابایت برای هر تصویر

/**
 * آپلود تصویر از پنل ادمین — multipart/form-data با فیلد «file»
 *
 * لایه‌های دفاعی:
 * ۱. گارد کلید ادمین + محدودیت نرخ (۲۰ آپلود در ۱۰ دقیقه)
 * ۲. فقط تصویرهای raster مجاز — SVG ممنوع (می‌تواند جاوااسکریپت حمل کند = XSS)
 * ۳. بررسی Magic-Bytes واقعی فایل (نه فقط MIME ادعایی کلاینت)
 * ۴. سقف حجمی سخت
 */
export async function POST(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;

  const rl = rateLimit(req, "upload", 20, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "تعداد آپلودها زیاد است؛ کمی بعد تلاش کنید" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "فایلی ارسال نشده است" }, { status: 400 });
    }

    const mime = (file.type || "").toLowerCase();
    // SVG و هر تصویر اسکریپت‌پذیر ممنوع — ضد XSS ذخیره‌شده
    if (!mime.startsWith("image/") || mime === "image/svg+xml") {
      return NextResponse.json(
        { error: "فقط فایل تصویری (JPG/PNG/WebP/GIF) مجاز است" },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "حجم تصویر بیش از ۴ مگابایت است" }, { status: 400 });
    }

    // بررسی امضای بایت‌های واقعی فایل — ضد فایل جعلی با MIME دروغین
    const buf = Buffer.from(await file.arrayBuffer());
    if (!hasValidImageSignature(buf)) {
      return NextResponse.json(
        { error: "محتوای فایل تصویر معتبر نیست" },
        { status: 400 }
      );
    }

    const row = await db.media.create({
      data: {
        filename: (file.name || "image").slice(0, 180),
        mime,
        size: file.size,
        data: buf.toString("base64"),
      },
    });

    await logActivity("upload", "media", `تصویر «${row.filename}» آپلود شد`);

    return NextResponse.json({
      ok: true,
      id: row.id,
      url: `/api/media/${row.id}`,
      filename: row.filename,
      size: row.size,
    });
  } catch (e) {
    console.error("[admin/upload]", e);
    return NextResponse.json({ error: "آپلود ناموفق بود" }, { status: 500 });
  }
}

/** تشخیص امضای واقعی JPG / PNG / GIF / WebP از بایت‌های اول فایل */
function hasValidImageSignature(buf: Buffer): boolean {
  if (buf.length < 12) return false;
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  )
    return true;
  // GIF: GIF87a / GIF89a
  if (buf.subarray(0, 3).toString("ascii") === "GIF") return true;
  // WebP: RIFF....WEBP
  if (
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  )
    return true;
  return false;
}
