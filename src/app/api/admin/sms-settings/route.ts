import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkAdmin } from "@/lib/admin-auth";
import { getSmsConfig } from "@/lib/sms";

export const dynamic = "force-dynamic";

/** تنظیمات پیامک — کلید API به‌صورت ماسک برمی‌گردد */
export async function GET(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;
  try {
    const c = await getSmsConfig();
    return NextResponse.json({
      configured: Boolean(c.apiKey),
      apiKeyMasked: c.apiKey ? `••••••••${c.apiKey.slice(-4)}` : "",
      adminMobiles: c.adminMobiles,
      templateId: c.templateId,
      senderLine: c.senderLine,
      enabled: c.enabled,
    });
  } catch (e) {
    console.error("[sms-get]", e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

const putSchema = z.object({
  apiKey: z.string().trim().max(200).optional(), // خالی = بدون تغییر
  adminMobiles: z.string().trim().max(400),
  templateId: z.string().trim().regex(/^\d{1,10}$/, "شناسه قالب عددی است"),
  senderLine: z.string().trim().regex(/^\d{10,20}$/, "خط ارسال عددی است"),
  enabled: z.boolean(),
});

/** ذخیره تنظیمات پیامک — کلید فقط در دیتابیس سرور می‌ماند */
export async function PUT(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;
  try {
    const parsed = putSchema.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "داده نامعتبر" },
        { status: 400 },
      );
    }
    const { apiKey, adminMobiles, templateId, senderLine, enabled } = parsed.data;
    const data: Record<string, unknown> = { adminMobiles, templateId, senderLine, enabled };
    if (apiKey) data.apiKey = apiKey;
    await db.smsSetting.upsert({ where: { id: "sms" }, update: data, create: { ...data } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[sms-put]", e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
