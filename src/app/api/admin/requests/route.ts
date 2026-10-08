import { NextResponse } from "next/server";
import { z } from "zod";
import { checkAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/content-store";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  id: z.string().min(5),
  status: z.enum(["new", "contacted", "done", "archived"]),
});

export const REQUEST_STATUS_LABEL: Record<string, string> = {
  new: "جدید",
  contacted: "تماس گرفته شد",
  done: "انجام شد",
  archived: "بایگانی",
};

/** فهرست درخواست‌های رزرو/مشاوره فرم تماس */
export async function GET(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;

  const rows = await db.contactRequest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({
    requests: rows.map((r) => ({
      ...r,
      statusLabel: REQUEST_STATUS_LABEL[r.status] ?? r.status,
    })),
  });
}

/** تغییر وضعیت پیگیری یک درخواست */
export async function PATCH(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;

  try {
    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "داده نامعتبر است" }, { status: 400 });
    }
    const { id, status } = parsed.data;
    const row = await db.contactRequest.update({ where: { id }, data: { status } });
    await logActivity(
      "request.status",
      status,
      `درخواست ${row.name} → «${REQUEST_STATUS_LABEL[status]}»`
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/requests PATCH]", e);
    return NextResponse.json({ error: "به‌روزرسانی ناموفق بود" }, { status: 500 });
  }
}
