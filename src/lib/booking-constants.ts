/** ثابت‌های مشترک نوبت‌دهی — بین UI صفحه /appointment و APIها */

/** اسلات‌های کاری مطب — شنبه تا پنجشنبه ۱۶ تا ۲۰ */
export const APPT_SLOTS = [
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
] as const;

export type ApptSlot = (typeof APPT_SLOTS)[number];

/** مطب جمعه‌ها بسته است (getDay: جمعه = ۵) */
export const CLOSED_WEEKDAY = 5;

/** چند روز آینده قابل رزرو است */
export const DAYS_AHEAD = 14;

/** حداقل فاصله رزرو از الان (ساعت) */
export const MIN_LEAD_HOURS = 2;

export function isValidSlot(time: string): time is ApptSlot {
  return (APPT_SLOTS as readonly string[]).includes(time);
}

export function isValidDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = new Date(`${iso}T00:00:00`);
  return !Number.isNaN(d.getTime());
}

/** آیا این تاریخ+ساعت قابل رزرو است؟ (جمعه/گذشته بودن را چک می‌کند) */
export function isSlotOpen(isoDate: string, time: string): boolean {
  if (!isValidDate(isoDate) || !isValidSlot(time)) return false;
  const d = new Date(`${isoDate}T00:00:00`);
  if (d.getDay() === CLOSED_WEEKDAY) return false;
  const slotAt = new Date(`${isoDate}T${time}:00`);
  return slotAt.getTime() >= Date.now() + MIN_LEAD_HOURS * 3600_000;
}

/* ─── فاکتور و ویزیت — ویزارد رزرو /appointment ─── */

/** تعرفه ویزیت (تومان) — فاکتور مرحله پرداخت */
export const VISIT_FEE = 900_000;

/** عنوان ردیف فاکتور */
export const VISIT_LABEL = "ویزیت تخصصی جراح فک و صورت";

/** برچسب خدمت در رکورد نوبت (مدل Appointment.service) و پیامک‌ها */
export const APPT_SERVICE_LABEL = "ویزیت حضوری — مطب";

/** روش پرداخت فعال — درگاه آنلاین هنوز فعال نیست */
export const PAYMENT_LABEL = "پرداخت در مطب";

/** افق رزرو از امروز (روز) — ناوبری تقویم تا ۲ ماه آینده */
export const BOOKING_HORIZON_DAYS = 60;

/** ظرفیت هر روز کاری = تعداد اسلات‌های ۳۰ دقیقه‌ای */
export const DAILY_CAPACITY = APPT_SLOTS.length;

/** برچسب بازه اسلات — «16:00» ← «۱۶:۰۰ تا ۱۶:۳۰» (ارقام فارسی برای نمایش) */
export function slotRangeLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const end = h * 60 + m + 30;
  const p = (n: number) => String(n).padStart(2, "0");
  const fa = (s: string) => s.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
  return fa(`${p(h)}:${p(m)} تا ${p(Math.floor(end / 60))}:${p(end % 60)}`);
}

/** گروه‌های کاری روز — مطب ۱۶ تا ۲۰ پذیرش دارد */
export const SLOT_GROUPS = [
  { id: "asr", label: "عصر — ۱۶ تا ۱۸", from: "16:00", to: "17:30" },
  { id: "shab", label: "شب — ۱۸ تا ۲۰", from: "18:00", to: "19:30" },
] as const;

/** گزینه‌های جنسیت */
export const GENDERS = ["آقا", "خانم"] as const;

/**
 * نرمال‌سازی و اعتبارسنجی فیلدهای پرونده بیمار (ویزارد رزرو)
 * ارقام فارسی سال تولد به انگلیسی تبدیل و بازه معتبر چک می‌شود
 */
export function normalizePatientFields(input: {
  gender?: string;
  latinName?: string;
  birthYear?: string;
}): { ok: true; gender: string; latinName: string; birthYear: string } | { ok: false; error: string } {
  const gender = input.gender === "آقا" || input.gender === "خانم" ? input.gender : "";
  if (!gender) return { ok: false, error: "جنسیت بیمار را مشخص کنید" };

  const latinName = (input.latinName ?? "").trim();
  if (latinName && !/^[A-Za-z][A-Za-z\s.'-]{1,79}$/.test(latinName)) {
    return { ok: false, error: "نام لاتین را فقط با حروف انگلیسی وارد کنید" };
  }

  const birthYear = (input.birthYear ?? "")
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/\D/g, "")
    .trim();
  if (birthYear && (/^\d{1,3}$/.test(birthYear) || Number(birthYear) < 1280 || Number(birthYear) > 1410)) {
    return { ok: false, error: "سال تولد را به‌صورت سال شمسی وارد کنید (مثل ۱۳۷۰)" };
  }

  return { ok: true, gender, latinName, birthYear };
}

