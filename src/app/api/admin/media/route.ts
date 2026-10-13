import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/content-store";

export const dynamic = "force-dynamic";

/** فهرست رسانه‌های آپلودشده — کتابخانه رسانه پنل */
export async function GET(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;

  const rows = await db.media.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, filename: true, mime: true, size: true, createdAt: true },
  });
  return NextResponse.json({
    media: rows.map((r) => ({ ...r, url: `/api/media/${r.id}` })),
  });
}

/** حذف یک رسانه */
export async function DELETE(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "شناسه ارسال نشده" }, { status: 400 });

  try {
    const row = await db.media.delete({ where: { id } });
    await logActivity("delete", "media", `تصویر «${row.filename}» حذف شد`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "رسانه پیدا نشد" }, { status: 404 });
  }
}
