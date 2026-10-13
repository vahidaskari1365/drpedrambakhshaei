import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().trim().min(2, "نام وارد شده کوتاه است").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^(\+98|0098|0)?9\d{9}$/, "شماره موبایل معتبر وارد کنید"),
  service: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
});

// ضد اسپم: حداکثر ۵ درخواست در ۱۰ دقیقه از هر IP (موتور مشترک با سقف حافظه)
export async function POST(req: Request) {
  try {
    const rl = rateLimit(req, "contact", 5, 10 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "تعداد درخواست‌ها زیاد است؛ کمی بعد تلاش کنید" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      const msg =
        parsed.error.issues[0]?.message || "اطلاعات وارد شده معتبر نیست";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { name, phone, service, message } = parsed.data;
    const saved = await db.contactRequest.create({
      data: {
        name,
        phone,
        service: service || "سایر موارد",
        message: message || "",
      },
    });

    return NextResponse.json({ ok: true, id: saved.id }, { status: 201 });
  } catch (e) {
    console.error("[contact]", e);
    return NextResponse.json(
      { error: "خطای سرور؛ لطفا بعدا تلاش کنید" },
      { status: 500 }
    );
  }
}
