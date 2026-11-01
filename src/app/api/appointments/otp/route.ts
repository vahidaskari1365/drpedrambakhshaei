import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { isSlotOpen, normalizePatientFields } from "@/lib/booking-constants";
import {
  getSmsConfig,
  sendVerifyCode,
  generateOtp,
  hashOtp,
  normalizeMobile,
  isIranMobile,
} from "@/lib/sms";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(2, "نام را کامل وارد کنید").max(120),
  phone: z.string().trim().regex(/^(\+98|0098|0)?9\d{9}$/, "شماره موبایل معتبر وارد کنید"),
  service: z.string().trim().min(2).max(120),
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().trim().regex(/^\d{2}:\d{2}$/),
  gender: z.string().trim().max(10).optional(),
  latinName: z.string().trim().max(80).optional(),
  birthYear: z.string().trim().max(6).optional(),
  note: z.string().trim().max(500).optional(),
});

/** گام ۱ نوبت‌دهی — اعتبارسنجی و ارسال کد تایید پیامکی به بیمار */
export async function POST(req: Request) {
  try {
    const rl = rateLimit(req, "appt-otp", 4, 10 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "تعداد درخواست‌ها زیاد است؛ چند دقیقه بعد تلاش کنید" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
      );
    }

    const parsed = schema.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "اطلاعات معتبر نیست" },
        { status: 400 },
      );
    }
    const { name, phone: rawPhone, service, date, time } = parsed.data;
    const phone = normalizeMobile(rawPhone);
    if (!isIranMobile(phone)) {
      return NextResponse.json({ error: "شماره موبایل معتبر وارد کنید" }, { status: 400 });
    }

    // فیلدهای پرونده بیمار — جنسیت الزامی است
    const patient = normalizePatientFields(parsed.data);
    if (!patient.ok) {
      return NextResponse.json({ error: patient.error }, { status: 400 });
    }

    // اسلات باید آینده و در ساعات کاری باشد
    if (!isSlotOpen(date, time)) {
      return NextResponse.json(
        { error: "این زمان قابل رزرو نیست؛ تاریخ و ساعت دیگری انتخاب کنید" },
        { status: 400 },
      );
    }

    // ظرفیت هر اسلات یک نوبت است
    const taken = await db.appointment.findFirst({
      where: { date, time, status: { in: ["confirmed", "done"] } },
      select: { id: true },
    });
    if (taken) {
      return NextResponse.json(
        { error: "متأسفانه این ساعت همین الان رزرو شد؛ ساعت دیگری انتخاب کنید" },
        { status: 409 },
      );
    }

    const config = await getSmsConfig();
    if (!config.enabled || !config.apiKey) {
      return NextResponse.json(
        { error: "سامانه پیامک هنوز فعال نشده است؛ لطفا تلفنی نوبت بگیرید: ۰۹۳۰۲۶۲۶۰۲۱" },
        { status: 503 },
      );
    }

    // سقف ارسال مجدد: یک کد در ۶۰ ثانیه برای هر شماره
    const recent = await db.otpCode.findFirst({
      where: { phone, purpose: "booking", createdAt: { gt: new Date(Date.now() - 60_000) } },
      select: { id: true },
    });
    if (recent) {
      return NextResponse.json(
        { error: "کد قبلا ارسال شده؛ یک دقیقه صبر کنید" },
        { status: 429, headers: { "Retry-After": "60" } },
      );
    }

    const code = generateOtp();
    await db.otpCode.create({
      data: {
        phone,
        codeHash: hashOtp(code),
        purpose: "booking",
        expiresAt: new Date(Date.now() + 3 * 60_000),
      },
    });

    const sent = await sendVerifyCode(config.apiKey, config.templateId, phone, code);
    if (!sent.ok) {
      console.error("[appt-otp] SMS.ir error:", sent.status, sent.message);
      return NextResponse.json(
        { error: "ارسال پیامک ناموفق بود؛ چند لحظه بعد دوباره تلاش کنید" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, expiresIn: 180 }, { status: 201 });
  } catch (e) {
    console.error("[appt-otp]", e);
    return NextResponse.json({ error: "خطای سرور؛ لطفا بعدا تلاش کنید" }, { status: 500 });
  }
}
