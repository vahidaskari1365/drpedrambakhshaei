import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { isSlotOpen, normalizePatientFields } from "@/lib/booking-constants";
import { jalaliDateLabel } from "@/lib/jalali";
import {
  getSmsConfig,
  sendSmsText,
  hashOtp,
  normalizeMobile,
  isIranMobile,
  patientSmsText,
  adminSmsText,
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
  code: z.string().trim().regex(/^\d{6}$/, "کد ۶ رقمی را وارد کنید"),
});

/** گام ۲ نوبت‌دهی — تایید کد، ثبت نوبت و ارسال پیامک به بیمار و مدیر */
export async function POST(req: Request) {
  try {
    const rl = rateLimit(req, "appt-confirm", 10, 10 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json({ error: "تعداد تلاش‌ها زیاد است؛ کمی بعد تلاش کنید" }, { status: 429 });
    }

    const parsed = schema.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "اطلاعات معتبر نیست" },
        { status: 400 },
      );
    }
    const { name, phone: rawPhone, service, date, time, note, code } = parsed.data;
    const phone = normalizeMobile(rawPhone);
    if (!isIranMobile(phone) || !isSlotOpen(date, time)) {
      return NextResponse.json({ error: "اطلاعات نوبت معتبر نیست" }, { status: 400 });
    }

    // فیلدهای پرونده بیمار — جنسیت الزامی است
    const patient = normalizePatientFields(parsed.data);
    if (!patient.ok) {
      return NextResponse.json({ error: patient.error }, { status: 400 });
    }

    // آخرین کد مصرف‌نشده این شماره
    const otp = await db.otpCode.findFirst({
      where: { phone, purpose: "booking", consumed: false },
      orderBy: { createdAt: "desc" },
    });
    if (!otp) {
      return NextResponse.json(
        { error: "کدی برای این شماره ارسال نشده؛ ابتدا کد بگیرید" },
        { status: 400 },
      );
    }
    if (otp.expiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "کد منقضی شده است؛ کد جدید بگیرید" },
        { status: 400 },
      );
    }
    if (otp.attempts >= 5) {
      return NextResponse.json(
        { error: "تلاش‌های زیاد؛ کد جدید بگیرید" },
        { status: 429 },
      );
    }
    if (otp.codeHash !== hashOtp(code)) {
      await db.otpCode.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
      return NextResponse.json({ error: "کد وارد شده اشتباه است" }, { status: 400 });
    }
    await db.otpCode.update({ where: { id: otp.id }, data: { consumed: true } });

    // کنترل مجدد ظرفیت (مسابقه دو درخواست همزمان)
    const taken = await db.appointment.findFirst({
      where: { date, time, status: { in: ["confirmed", "done"] } },
      select: { id: true },
    });
    if (taken) {
      return NextResponse.json(
        { error: "این ساعت همین الان رزرو شد؛ ساعت دیگری انتخاب کنید" },
        { status: 409 },
      );
    }

    const saved = await db.appointment.create({
      data: {
        name,
        phone,
        service,
        date,
        time,
        gender: patient.gender,
        latinName: patient.latinName,
        birthYear: patient.birthYear,
        note: note || "",
      },
    });

    // لاگ CRM
    await db.activityLog.create({
      kind: "appointment",
      entity: saved.id,
      summary: `نوبت جدید: ${name} — ${service} — ${jalaliDateLabel(date)} ساعت ${time}`,
    }).catch(() => undefined);

    // پیامک تایید به بیمار + اطلاع به مدیر — بهترین تلاش، مسیر نوبت را نمی‌شکند
    let patientSmsSent = false;
    let adminSmsSent = false;
    try {
      const config = await getSmsConfig();
      if (config.enabled && config.apiKey) {
        const jd = jalaliDateLabel(date);
        const p = await sendSmsText(
          config.apiKey,
          config.senderLine,
          patientSmsText(name, service, jd, time),
          [phone],
        );
        patientSmsSent = p.ok;
        const a = await sendSmsText(
          config.apiKey,
          config.senderLine,
          adminSmsText(name, phone, service, jd, time),
          config.adminMobiles.split(/[,،\s]+/).filter(Boolean),
        );
        adminSmsSent = a.ok;
        if (!p.ok || !a.ok) console.error("[appt-confirm] SMS partial:", p.message, a.message);
      }
    } catch (smsErr) {
      console.error("[appt-confirm] SMS error:", smsErr);
    }
    await db.appointment
      .update({ where: { id: saved.id }, data: { patientSmsSent, adminSmsSent } })
      .catch(() => undefined);

    return NextResponse.json(
      { ok: true, id: saved.id, patientSmsSent, adminSmsSent },
      { status: 201 },
    );
  } catch (e) {
    console.error("[appt-confirm]", e);
    return NextResponse.json({ error: "خطای سرور؛ لطفا بعدا تلاش کنید" }, { status: 500 });
  }
}
