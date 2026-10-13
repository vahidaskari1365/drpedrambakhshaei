"use client";

/**
 * ردیاب بازدید صفحات — با هر ناوبری، یک بازدید در دیتابیس ثبت می‌شود
 * تا داشبورد «بازدیدها» پنل ادمین آمار گرافیکی بازدیدکننده داشته باشد.
 * - vid: شناسه یکتای بازدیدکننده در localStorage (محاسبه بازدیدکننده یکتا)
 * - dedupe: ناوبری تکراری به یک مسیر در کمتر از ۱۵ ثانیه دوباره شمرده نمی‌شود
 * - fire-and-forget: هیچ‌وقت تجربه کاربری سایت را کند یا خراب نمی‌کند
 */
import * as React from "react";
import { usePathname } from "next/navigation";

export function VisitTracker() {
  const pathname = usePathname();

  React.useEffect(() => {
    if (!pathname) return;
    try {
      // شناسه یکتای بازدیدکننده
      let vid = localStorage.getItem("v_id");
      if (!vid) {
        vid = `v-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
        localStorage.setItem("v_id", vid);
      }

      // جلوگیری از شمارش دوباره در رفرش‌های پشت‌سرهم
      const dedupeKey = `vt:${pathname}`;
      const last = Number(sessionStorage.getItem(dedupeKey) ?? 0);
      if (Date.now() - last < 15_000) return;
      sessionStorage.setItem(dedupeKey, String(Date.now()));

      // نوع دستگاه از عرض صفحه
      const w = window.innerWidth;
      const device = w < 768 ? "mobile" : w < 1100 ? "tablet" : "desktop";

      const body = JSON.stringify({
        path: pathname,
        vid,
        device,
        referrer: document.referrer.slice(0, 300),
      });
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* ردیابی هرگز نباید خطای دیداری بسازد */
    }
  }, [pathname]);

  return null;
}
