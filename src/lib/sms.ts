import { createHash, randomInt } from "node:crypto";

export async function getSmsConfig() {
  const { db } = await import("@/lib/db");
  const row = await db.smsSetting.upsert({
    where: { id: "sms" },
    update: {},
    create: {},
  });
  return {
    apiKey: process.env.SMSIR_API_KEY?.trim() || row.apiKey,
    // فال‌بک: فیلد خالی مدیرها هرگز نباید اطلاع‌رسانی نوبت جدید را قطع کند
    adminMobiles: row.adminMobiles?.trim() || DEFAULT_ADMIN_MOBILES,
    templateId: row.templateId,
    senderLine: row.senderLine,
    enabled: row.enabled,
  };
}
export type SmsConfig = Awaited<ReturnType<typeof getSmsConfig>>;

/** 09xxxxxxxxx را به هر ورودی می‌سازد */
export function normalizeMobile(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.startsWith("98")) return "0" + d.slice(2);
  if (d.startsWith("9") && d.length === 10) return "0" + d;
  return d;
}

/** فرمت API فای SMS.ir — بدون صفر ابتدا */
export function toApiMobile(raw: string): string {
  return normalizeMobile(raw).replace(/^0/, "");
}

export function isIranMobile(raw: string): boolean {
  return /^09\d{9}$/.test(normalizeMobile(raw));
}

export function hashOtp(code: string): string {
  return createHash("sha256").update(`otp:${code}`).digest("hex");
}

export function generateOtp(): string {
  return String(randomInt(100000, 1000000));
}

type SmsResult = { ok: boolean; status?: number; message?: string };

/* آدرس پایه REST API پیامک — v1 (بدون این ثابت callApi با ReferenceError می‌مُرد) */
const API = "https://api.sms.ir/v1";

async function callApi(
  path: string,
  apiKey: string,
  body: unknown,
): Promise<SmsResult & { data?: unknown }> {
  try {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12000),
      cache: "no-store",
    });
    const json = (await res.json().catch(() => ({}))) as {
      status?: number;
      message?: string;
      data?: unknown;
    };
    return { ok: res.ok && json.status === 1, status: json.status, message: json.message, data: json.data };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "network error" };
  }
}

/** ارسال کد تایید با قالب تاییدشده پنل — برای OTP نوبت‌دهی */
export async function sendVerifyCode(
  apiKey: string,
  templateId: string,
  phone: string,
  code: string,
): Promise<SmsResult> {
  return callApi("/send/verify", apiKey, {
    mobile: toApiMobile(phone),
    templateId: Number(templateId) || DEFAULT_TEMPLATE_ID_NUM,
    parameters: [{ name: "CODE", value: code }],
  });
}

/** ارسال متن آزاد از خط خدماتی — تایید نوبت به بیمار و اطلاع به مدیر */
export async function sendSmsText(
  apiKey: string,
  senderLine: string,
  messageText: string,
  mobiles: string[],
): Promise<SmsResult & { sentTo: string[] }> {
  const list = [...new Set(mobiles.map(normalizeMobile).filter(isIranMobile))].map(toApiMobile);
  if (!list.length) return { ok: false, message: "شماره معتبری نیست", sentTo: [] };
  const r = await callApi("/send/bulk", apiKey, {
    lineNumber: senderLine || DEFAULT_SENDER_LINE,
    messageText,
    mobiles: list,
  });
  return { ...r, sentTo: r.ok ? list : [] };
}

const DEFAULT_TEMPLATE_ID_NUM = 138693;
export const DEFAULT_SENDER_LINE = "500039235084479";

/** شماره اطلاع‌رسانی نوبت جدید به مطب — فال‌بک وقتی فیلد «شماره مدیرها» خالی است */
export const DEFAULT_ADMIN_MOBILES = "09302626021";

/* متن‌های استاندارد پیامک نوبت — در /api/appointments/confirm استفاده می‌شوند */
export function patientSmsText(name: string, service: string, jalaliDate: string, time: string): string {
  return `${name} عزیز؛ نوبت شما در مطب دکتر پدرام بخشایی ثبت شد.\nخدمت: ${service}\nزمان: ${jalaliDate} ساعت ${time}\nآدرس: پاسداران، مرکز خرید پاسداران، طبقه ۲، واحد ۴`;
}

export function adminSmsText(name: string, phone: string, service: string, jalaliDate: string, time: string): string {
  return `نوبت جدید از سایت:\n${name} — ${phone}\nخدمت: ${service}\n${jalaliDate} ساعت ${time}`;
}
