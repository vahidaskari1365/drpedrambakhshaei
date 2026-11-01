import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { APPT_SLOTS, DAILY_CAPACITY } from "@/lib/booking-constants";

export const dynamic = "force-dynamic";

/**
 * اسلات‌های نوبت‌دهی:
 * GET /api/appointments/slots?date=2026-11-02            → booked/open یک روز مشخص
 * GET /api/appointments/slots?from=2026-10-23&to=2026-11-21 → ظرفیت باقی‌مانده هر روز بازه
 *   (بازه = یک ماه شمسی که روی دو ماه میلادی منطبق می‌شود — تقویم رزرو)
 */
export async function GET(req: Request) {
  try {
    const sp = new URL(req.url).searchParams;

    /* ─── حالت بازه: نقشه ظرفیت روزها برای تقویم ─── */
    const from = sp.get("from") ?? "";
    const to = sp.get("to") ?? "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(from) && /^\d{4}-\d{2}-\d{2}$/.test(to) && from <= to) {
      const spanDays = (new Date(`${to}T00:00:00`).getTime() - new Date(`${from}T00:00:00`).getTime()) / 86400_000;
      if (spanDays > 62) {
        return NextResponse.json({ error: "بازه نامعتبر است" }, { status: 400 });
      }
      const rows = await db.appointment.groupBy({
        by: ["date"],
        where: { date: { gte: from, lte: to }, status: { in: ["confirmed", "done"] } },
        _count: { _all: true },
      });
      const days: Record<string, number> = {};
      for (const r of rows) {
        days[r.date] = Math.max(0, DAILY_CAPACITY - r._count._all);
      }
      return NextResponse.json(
        { from, to, capacity: DAILY_CAPACITY, days },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    /* ─── حالت روز: اسلات‌های اشغال‌شده ─── */
    const date = sp.get("date") ?? "";
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
