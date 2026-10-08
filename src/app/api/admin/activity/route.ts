import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** گزارش فعالیت‌های پنل — آخرین رویدادها */
export async function GET(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;

  const limit = Math.min(Number(new URL(req.url).searchParams.get("limit") ?? 60), 200);
  const rows = await db.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return NextResponse.json({ activity: rows });
}
