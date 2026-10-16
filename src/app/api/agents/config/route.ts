/** تنظیمات ایجنت‌ها — POST/GET /api/agents/config (کلید ادمین) */
import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { getAgentsConfig, saveAgentsConfig, sanitizeAgentsConfig, type AgentsConfig } from "@/lib/agents/runner";
import { isAsciiSafe } from "@/lib/agents/zai-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const denied = checkAdmin(request);
  if (denied) return denied;
  try {
    const body = (await request.json()) as Partial<AgentsConfig> & { zaiKey?: string };

    /* کلید Z.AI — منطق ویژه: خالی = بدون تغییر؛ "__CLEAR__" = حذف */
    if (body.zaiKey !== undefined) {
      const key = body.zaiKey.trim();
      if (key === "") {
        delete body.zaiKey; // فیلد خالی یعنی کلید فعلی بماند
      } else if (key === "__CLEAR__") {
        body.zaiKey = "";
      } else {
        if (!isAsciiSafe(key)) {
          return NextResponse.json(
            { ok: false, error: "کلید نامعتبر است — کلید فقط باید شامل حروف و اعداد انگلیسی باشد (بدون فارسی و فاصله)" },
            { status: 400 }
          );
        }
        body.zaiKey = key;
      }
    }

    const config = await saveAgentsConfig(body);
    return NextResponse.json({ ok: true, config: sanitizeAgentsConfig(config) });
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
  return NextResponse.json({ ok: true, config: sanitizeAgentsConfig(await getAgentsConfig()) });
}
