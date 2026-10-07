import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(2, "نام وارد شده کوتاه است").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^(\+98|0098|0)?9\d{9}$/, "شماره موبایل معتبر وارد کنید"),
  service: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
});

// شماره‌های تکراری در بازه کوتاه را محدود می‌کند (ضد اسپم ساده)
const rate = new Map<string, { count: number; reset: number }>();
const LIMIT = 5;
const WINDOW = 10 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const now = Date.now();
    const entry = rate.get(ip);
    if (entry && now < entry.reset) {
      if (entry.count >= LIMIT) {
        return NextResponse.json(
          { error: "تعداد درخواست‌ها زیاد است؛ کمی بعد تلاش کنید" },
          { status: 429 }
        );
      }
      entry.count += 1;
    } else {
      rate.set(ip, { count: 1, reset: now + WINDOW });
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
