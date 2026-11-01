"use client";

/**
 * دکمه‌های «رزرو نوبت» سایت — دیگر به سامانه‌های خارجی (دکترتو/نوبت) منتقل
 * نمی‌شوند؛ کاربر مستقیم به ویزارد رزرو آنلاین خودِ سایت (/appointment) می‌رود.
 * openBooking از هر جای سایت با همین امضای قبلی کار می‌کند.
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { trackSiteEvent } from "@/lib/track";

type Listener = (source: string) => void;
const listeners = new Set<Listener>();

/** باز کردن رزرو نوبت — source = محل کلیک (hero، مقاله، تعرفه‌ها و ...) */
export function openBooking(source: string) {
  listeners.forEach((fn) => fn(source));
}

export function BookingModal() {
  const router = useRouter();

  React.useEffect(() => {
    const fn: Listener = (source) => {
      trackSiteEvent("appointment_open", { source });
      router.push("/appointment");
    };
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, [router]);

  return null;
}
