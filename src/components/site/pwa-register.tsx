"use client";

import * as React from "react";

/** ثبت Service Worker برای قابلیت PWA (نصب روی گوشی و آفلاین‌سازی سبک) */
export function PwaRegister() {
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {
          /* ساکت — PWA اختیاری است */
        });
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);
  return null;
}
