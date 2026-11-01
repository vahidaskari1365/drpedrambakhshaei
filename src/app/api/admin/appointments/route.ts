import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/** لیست نوبت‌ها برای CRM پنل ادمین — GET /api/admin/appointments?status= */
export async function GET(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;
  try {
    const status = new URL(req.url).searchParams.get("status") ?? "";
    const where = status && status !== "all" ? { status } : {};
    const [items, total, confirmed, done, cancelled] = await Promise.all([
      db.appointment.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 }),
      db.appointment.count({ where }),
      db.appointment.count({ where: { status: "confirmed" } }),
      db.appointment.count({ where: { status: "done" } }),
      db.appointment.count({ where: { status: "cancelled" } }),
    ]);
    const todayIso = new Date().toLocaleDateString("en-CA"); // yyyy-mm-dd محلی سرور
    const today = await db.appointment.count({ where: { date: todayIso, status: "confirmed" } });
    return NextResponse.json({
      items,
      total,
      stats: { confirmed, done, cancelled, today },
    });
  } catch (e) {
    console.error("[admin-appts]", e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

const patchSchema = z.object({
  id: z.string().min(3),
  status: z.enum(["confirmed", "done", "cancelled", "no_show"]),
});

/** تغییر وضعیت نوبت — PATCH */
export async function PATCH(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;
  try {
    const parsed = patchSchema.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
      return NextResponse.json({ error: "داده نامعتبر" }, { status: 400 });
    }
    const { id, status } = parsed.data;
    const updated = await db.appointment.update({ where: { id }, data: { status } });
    await db.activityLog.create({
      kind: "appointment",
      entity: id,
      summary: `تغییر وضعیت نوبت ${updated.name} به «${status}»`,
    }).catch(() => undefined);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin-appts-patch]", e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
