/**
 * لایه محتوای سایت — منبع واحد حقیقت (Single Source of Truth)
 *
 * پیش‌فرض‌ها از site-data.ts و blog-data.ts می‌آیند و پنل ادمین می‌تواند
 * برای هر کلید یک «بازنویسی» (Override) کامل در دیتابیس ذخیره کند.
 * mergeContent پیش‌فرض‌ها را با بازنویسی‌ها ادغام می‌کند؛ نتیجه هم به صفحات
 * SSR تزریق می‌شود (ContentProvider) و هم به پنل ادمین می‌رود — یعنی سینک کامل.
 */
import {
  ABOUT_APPROACH,
  ABOUT_BIO,
  BEFORE_AFTER,
  CASE_SLIDES,
  COST_FACTORS,
  CREDENTIALS,
  FAQ_ITEMS,
  GALLERY,
  IMPLANT_BRANDS,
  NAV_ITEMS,
  PRICE_FAQS,
  PRICE_TABS,
  REVIEWS,
  SERVICES,
  SITE,
  SKILLS,
  STATS,
  WHY_US,
  WORKS,
} from "./site-data";
import { ARTICLES } from "./blog-data";

/** تمام مجموعه‌های محتوایی سایت — کلیدها همان کلیدهای Override در دیتابیس‌اند */
export const DEFAULTS = {
  nav: NAV_ITEMS,
  site: SITE,
  stats: STATS,
  skills: SKILLS,
  credentials: CREDENTIALS,
  aboutBio: ABOUT_BIO,
  aboutApproach: ABOUT_APPROACH,
  whyUs: WHY_US,
  costFactors: COST_FACTORS,
  services: SERVICES,
  implantBrands: IMPLANT_BRANDS,
  priceTabs: PRICE_TABS,
  faq: FAQ_ITEMS,
  priceFaqs: PRICE_FAQS,
  reviews: REVIEWS,
  gallery: GALLERY,
  works: WORKS,
  beforeAfter: BEFORE_AFTER,
  caseSlides: CASE_SLIDES,
  blog: ARTICLES,
} as const;

/** تبدیل عمیق readonly به mutable — خروجی JSON همیشه قابل ویرایش است */
export type DeepMutable<T> = T extends readonly (infer U)[]
  ? DeepMutable<U>[]
  : T extends object
    ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
    : T;

export type SiteContent = DeepMutable<typeof DEFAULTS>;
export type ContentKey = keyof typeof DEFAULTS;

export const CONTENT_KEYS = Object.keys(DEFAULTS) as ContentKey[];

/** برچسب فارسی هر مجموعه — در پنل ادمین و گزارش‌ها */
export const CONTENT_LABELS: Record<ContentKey, string> = {
  nav: "آیتم‌های ناوبری",
  site: "اطلاعات مطب",
  stats: "آمار دستاوردها",
  skills: "نوارهای مهارت",
  credentials: "مدارک و افتخارات",
  aboutBio: "بیوگرافی دکتر",
  aboutApproach: "رویکرد درمانی",
  whyUs: "چرا دکتر بخشایی",
  costFactors: "عوامل هزینه",
  services: "خدمات",
  implantBrands: "برندهای ایمپلنت",
  priceTabs: "تعرفه‌های ۱۴۰۵",
  faq: "سوالات متداول",
  priceFaqs: "سوالات هزینه",
  reviews: "نظرات مراجعین",
  gallery: "گالری مطب",
  works: "نمونه کارها",
  beforeAfter: "مقایسه قبل/بعد",
  caseSlides: "اسلایدر جراحی‌ها",
  blog: "مقالات بلاگ",
};

/** ادغام امن پیش‌فرض‌ها با بازنویسی‌های ادمین */
export function mergeContent(
  overrides: Record<string, unknown> | null | undefined
): SiteContent {
  const merged = JSON.parse(JSON.stringify(DEFAULTS)) as SiteContent;
  if (!overrides) return merged;

  for (const key of Object.keys(overrides)) {
    if (!(key in merged)) continue; // کلید ناشناخته → نادیده
    const value = overrides[key];
    if (value === null || value === undefined) continue;
    const current = (merged as Record<string, unknown>)[key];
    // اشیای ساده (site، whyUs، beforeAfter) را مچ می‌کنیم تا فیلدهای جامانده از پیش‌فرض بیایند
    if (
      !Array.isArray(value) &&
      typeof value === "object" &&
      current &&
      !Array.isArray(current) &&
      typeof current === "object"
    ) {
      (merged as Record<string, unknown>)[key] = {
        ...(current as object),
        ...(value as object),
      };
    } else {
      (merged as Record<string, unknown>)[key] = value;
    }
  }
  return merged;
}

/** شمارش تقریبی کلمات فارسی یک مقدار JSON — برای نمودار حجم محتوا */
export function countWords(value: unknown): number {
  const text = JSON.stringify(value) ?? "";
  const clean = text.replace(/[{}[\]",:]/g, " ");
  return clean.split(/\s+/).filter((w) => /[\u0600-\u06FF]/.test(w)).length;
}
