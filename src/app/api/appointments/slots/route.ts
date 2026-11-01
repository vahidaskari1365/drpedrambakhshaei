import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { APPT_SLOTS } from "@/lib/booking-constants";

export const dynamic = "force-dynamic";

/** اسلات‌های اشغال‌شده یک تاریخ — GET /api/appointments/slots?date=2026-11-02 */
export async function GET(req: Request) {
  try {
    const date = new URL(req.url).searchParams.get("date") ?? "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "تاریخ نامعتبر" }, { status: 400 });
    }
    const rows = await db.appointment.findMany({
      where: { date, status: { in: ["confirmed", "done"] } },
      select: { time: true },
    });
    const booked = [...new Set(rows.map((r) => r.time))];
    const open = APPT_SLOTS.filter((t) => !booked.includes(t));
    return NextResponse.json({ date, booked, open }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("[appt-slots]", e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
