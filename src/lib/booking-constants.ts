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
