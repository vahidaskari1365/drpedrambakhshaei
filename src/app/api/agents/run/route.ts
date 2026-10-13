/**
 * اجرای دستی ایجنت‌ها — POST /api/agents/run
 * بدنه: { agent?: "content"|"aeo"|"geo"|"gsc"|"pipeline", skipWeeklyGate?: boolean }
 * پیش‌فرض: pipeline کامل
 */
import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { runPipeline } from "@/lib/agents/pipeline";
import type { AgentId } from "@/lib/agents/runner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const VALID: AgentId[] = ["content", "aeo", "geo", "gsc"];

export async function POST(request: Request) {
  const denied = checkAdmin(request);
  if (denied) return denied;
  try {
    const body = (await request.json().catch(() => ({}))) as {
      agent?: string;
      skipWeeklyGate?: boolean;
    };
    const only = body.agent && VALID.includes(body.agent as AgentId) ? [body.agent as AgentId] : undefined;
    const results = await runPipeline("manual", { only, skipWeeklyGate: Boolean(body.skipWeeklyGate) });
    return NextResponse.json({ ok: true, results });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "خطای ناشناخته" },
      { status: 500 }
    );
  }
}
