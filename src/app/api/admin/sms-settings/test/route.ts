import { NextResponse } from "next/server";
import { z } from "zod";
import { checkAdmin } from "@/lib/admin-auth";
import { getSmsConfig, sendSmsText, normalizeMobile, isIranMobile } from "@/lib/sms";

export const dynamic = "force-dynamic";

const schema = z.object({ mobile: z.string().trim().max(20) });

/** ارسال پیامک تست با تنظیمات فعلی — برای اطمینان از اتصال پنل پیامک */
export async function POST(req: Request) {
  const denied = checkAdmin(req);
  if (denied) return denied;
  try {
    const parsed = schema.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success || !isIranMobile(parsed.data.mobile)) {
      return NextResponse.json({ error: "شماره موبایل معتبر وارد کنید" }, { status: 400 });
    }
    const c = await getSmsConfig();
    if (!c.apiKey) {
      return NextResponse.json({ error: "ابتدا کلید API را ذخیره کنید" }, { status: 400 });
    }
    const r = await sendSmsText(
      c.apiKey,
      c.senderLine,
      "پیامک تست سامانه نوبت‌دهی مطب دکتر پدرام بخشایی — تنظیمات صحیح است ✅",
      [normalizeMobile(parsed.data.mobile)],
    );
    if (!r.ok) {
      return NextResponse.json(
        { error: `ارسال ناموفق${r.message ? `: ${r.message}` : ""}` },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[sms-test]", e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
