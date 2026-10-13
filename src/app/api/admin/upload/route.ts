import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/content-store";

export const dynamic = "force-dynamic";

const MAX_BYTES = 4 * 1024 * 1024; // حداکثر ۴ مگابایت برای هر تصویر

/**
 * آپلود تصویر از پنل ادمین — multipart/form-data با فیلد «file»
 * خروجی: نشانی سرو تصویر /api/media/<id> که در هر فیلد تصویر سایت قابل استفاده است.
 */
export async function POST(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "فایلی ارسال نشده است" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "فقط فایل تصویری مجاز است" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "حجم تصویر بیش از ۴ مگابایت است" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const row = await db.media.create({
      data: {
        filename: (file.name || "image").slice(0, 180),
        mime: file.type,
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
