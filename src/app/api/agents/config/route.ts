/** تنظیمات ایجنت‌ها — POST /api/agents/config (کلید ادمین) */
import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { getAgentsConfig, saveAgentsConfig, type AgentsConfig } from "@/lib/agents/runner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const denied = checkAdmin(request);
  if (denied) return denied;
  try {
    const body = (await request.json()) as Partial<AgentsConfig>;
    const config = await saveAgentsConfig(body);
    return NextResponse.json({ ok: true, config });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "خطای ناشناخته" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const denied = checkAdmin(request);
  if (denied) return denied;
  return NextResponse.json({ ok: true, config: await getAgentsConfig() });
}
