/** وضعیت ایجنت‌ها — GET /api/agents/status (کلید ادمین) */
import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { getAgentsStatus } from "@/lib/agents/runner";
import { tehranNow } from "@/lib/agents/pipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = checkAdmin(request);
  if (denied) return denied;
  try {
    const status = await getAgentsStatus();
    return NextResponse.json({ ok: true, ...status, tehranNow: tehranNow() });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "خطای ناشناخته" },
      { status: 500 }
    );
  }
}
