"use client";

/**
 * ردیاب رویدادهای تعاملی کاربر — نوبت‌دهی و تماس
 * هر کلیک روی دکمه‌های نوبت/تماس یک رویداد سبک fire-and-forget ثبت می‌کند
 * تا داشبورد «نوبت و تماس» پنل ادمین نرخ تبدیل واقعی نشان دهد.
 * هیچ‌وقت تجربه کاربری را کند یا خراب نمی‌کند — خطاها بی‌صدا نادیده گرفته می‌شوند.
 */

export type SiteEventType = "booking_modal_open" | "booking_platform_click" | "call_click";

/** شناسه یکتای بازدیدکننده — همان vid ماژول VisitTracker (localStorage) */
export function getVid(): string {
  try {
    let vid = localStorage.getItem("v_id");
    if (!vid) {
      vid = `v-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
      localStorage.setItem("v_id", vid);
    }
    return vid;
  } catch {
    return "";
  }
}

/** مسیر فعلی بدون پارامتر — برای تحلیل «از کدام صفحه» */
export function currentPath(): string {
  try {
    return window.location.pathname.slice(0, 200);
  } catch {
    return "";
  }
}

/** ثبت یک رویداد تعاملی — fire-and-forget با keepalive (باقی‌ماندن در حین خروج از صفحه) */
export function trackSiteEvent(type: SiteEventType, extra?: { platform?: string; source?: string }) {
  try {
    if (typeof window === "undefined") return;
    const body = JSON.stringify({
      type,
      platform: extra?.platform ?? "",
      source: extra?.source ?? "",
      path: currentPath(),
      vid: getVid(),
    });
    fetch("/api/track/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ردیابی هرگز نباید خطای دیداری بسازد */
  }
}
