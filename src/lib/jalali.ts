/**
 * تبدیل تاریخ میلادی به شمسی (جلالی) — بدون وابستگی به ICU
 * الگوریتم استاندارد jalaali-js؛ خروجی مثل «یکشنبه ۱۲ آبان ۱۴۰۵»
 */

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const fa = (n: number | string) => String(n).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

function div(a: number, b: number) {
  // الگوریتم مرجع jalaali-js از تفریق رند به سمت صفر استفاده می‌کند (~~)؛
  // با Math.floor برای آرگومان‌های منفی (مثل div(gm-8,6) در g2d) نتیجه یک روز خطا می‌گیرد
  return Math.trunc(a / b);
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

/** ماه‌های شمسی برای تقویم رزرو */
export const JALALI_MONTHS = MONTHS;
/** ارقام فارسی برای نمایش */
export const faNum = fa;

/* ─── الگوریتم کامل jalaali-js — چرخه‌های ۳۳ ساله دقیق ─── */

const BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210,
  1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178,
];

function jalCal(jy: number): { leap: number; gy: number; march: number } {
  const bl = BREAKS.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = BREAKS[0];
  let jump = 0;
  for (let i = 1; i < bl; i += 1) {
    const jm = BREAKS[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(jump % 33, 4);
    jp = jm;
  }
  let n = jy - jp;
  leapJ = leapJ + div(n, 33) * 8 + div((n % 33) + 3, 4);
  if (jump % 33 === 4 && jump - n === 4) leapJ += 1;
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = (((n + 1) % 33) - 1) % 4;
  if (leap === -1) leap = 4;
  return { leap, gy, march };
}

function g2d(gy: number, gm: number, gd: number): number {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * ((gm + 9) % 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number): [number, number, number] {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return [gy, gm, gd];
}

function mod(a: number, b: number): number {
  return a - b * Math.floor(a / b);
}

/** تبدیل جلالی به گرجی — [gy, gm, gd] */
export function toGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  const r = jalCal(jy);
  return d2g(g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1);
}

/** کبیسه بودن سال شمسی */
export function isJalaliLeap(jy: number): boolean {
  return jalCal(jy).leap === 0;
}

/** طول ماه شمسی — ۳۱/۳۰/۲۹ */
export function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isJalaliLeap(jy) ? 30 : 29;
}

/** اطلاعات شبکه تقویم یک ماه — firstWeekIndex: ۰=شنبه تا ۶=جمعه */
export function jalaliMonthInfo(jy: number, jm: number): { length: number; firstWeekIndex: number } {
  const [gy, gm, gd] = toGregorian(jy, jm, 1);
  const firstWeekIndex = (new Date(gy, gm - 1, gd).getDay() + 1) % 7;
  return { length: jalaliMonthLength(jy, jm), firstWeekIndex };
}

/** امروز به تاریخ شمسی */
export function jalaliToday(): { jy: number; jm: number; jd: number } {
  const n = new Date();
  const [jy, jm, jd] = toJalali(n.getFullYear(), n.getMonth() + 1, n.getDate());
  return { jy, jm, jd };
}

/** تاریخ شمسی → رشته ISO میلادی 2026-11-02 */
export function jalaliToIso(jy: number, jm: number, jd: number): string {
  const [gy, gm, gd] = toGregorian(jy, jm, jd);
  return isoLocalDate(new Date(gy, gm - 1, gd));
}

/** جابه‌جایی بین ماه‌های شمسی — delta می‌تواند منفی باشد */
export function addJalaliMonth(jy: number, jm: number, delta: number): { jy: number; jm: number } {
  const total = jy * 12 + (jm - 1) + delta;
  return { jy: div(total, 12), jm: mod(total, 12) + 1 };
}

/** برچسب کامل «سه‌شنبه ۱۹ آبان ۱۴۰۵» از رشته ISO */
export function jalaliFullLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  const weekday = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  const [jy, jm, jd] = toJalali(y, m, d);
  return `${weekday} ${fa(jd)} ${MONTHS[jm - 1]} ${fa(jy)}`;
}


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
