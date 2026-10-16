/**
 * انتشار مقاله از بیرون — POST /api/agents/publish
 *
 * مصرف‌کننده: ورک‌فلو GitHub Actions (ایجنت محتوای رایگان — بدون نیاز به کلید Z.AI)
 * بدنه: همان PublishInput لایه انتشار (publishSchema) — اعتبارسنجی سخت‌گیرانه + انتشار idempotent
 * پاسخ: { ok, id (slug), action: created|updated, wordCount }
 */
import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { publishPost, publishSchema } from "@/lib/blog/posts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(request: Request) {
  const denied = checkAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const input = publishSchema.parse(body);
    const result = await publishPost({ ...input, source: input.source || "github-agent" });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("[agents/publish]", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "انتشار مقاله ناموفق بود" },
      { status: 400 }
    );
  }
}
