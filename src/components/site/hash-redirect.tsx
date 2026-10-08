"use client";

import * as React from "react";
import { LEGACY_ANCHOR_MAP } from "@/lib/site-data";

/**
 * ریدایرکت انکرها و هش‌های قدیمی (#/services، #contact) به URLهای واقعی
 * چون هش هرگز به سرور نمی‌رسد، این نگاشت باید سمت کلاینت انجام شود
 * تا لینک‌های ایندکس‌شده/بوکمارک‌شده قدیمی از کار نیفتند
 */
export function HashRedirect() {
  React.useEffect(() => {
    const raw = window.location.hash;
    if (!raw) return;
    const target = LEGACY_ANCHOR_MAP[raw];
    if (target && target !== "/") {
      window.location.replace(target);
    } else if (target === "/") {
      window.history.replaceState(null, "", "/");
    }
  }, []);
  return null;
}
