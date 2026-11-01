/**
 * تبدیل تاریخ میلادی به شمسی (جلالی) — بدون وابستگی به ICU
 * الگوریتم استاندارد jalaali-js؛ خروجی مثل «یکشنبه ۱۲ آبان ۱۴۰۵»
 */

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const fa = (n: number | string) => String(n).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

function div(a: number, b: number) {
  return Math.floor(a / b);
}

/** تبدیل گرجی به جلالی — [jy, jm, jd] */
export function toJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    div(gy2 + 3, 4) -
    div(gy2 + 99, 100) +
    div(gy2 + 399, 400) +
    gd +
    g_d_m[gm - 1];
  let jy = -1595 + 33 * div(days, 12053);
  days %= 12053;
  jy += 4 * div(days, 1461);
  days %= 1461;
  if (days > 365) {
    jy += div(days - 1, 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + div(days, 31) : 7 + div(days - 186, 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

const MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];
const WEEKDAYS = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];

/** «۱۲ آبان ۱۴۰۵» از رشته ISO 2026-11-02 */
export function jalaliDateLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  const [jy, jm, jd] = toJalali(y, m, d);
  return `${fa(jd)} ${MONTHS[jm - 1]} ${fa(jy)}`;
}

/** «یکشنبه ۱۲ آبان» — برچسب کوتاه چیپ‌های انتخاب تاریخ */
export function jalaliShortLabel(isoDate: string): { weekday: string; label: string } {
  const [y, m, d] = isoDate.split("-").map(Number);
  const [jy, jm, jd] = toJalali(y, m, d);
  const weekday = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  return { weekday, label: `${fa(jd)} ${MONTHS[jm - 1]}` };
}

/** ISO محلی yyyy-mm-dd از Date */
export function isoLocalDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
