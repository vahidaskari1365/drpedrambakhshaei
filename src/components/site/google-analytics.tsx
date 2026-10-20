"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";

/**
 * گوگل آنالیتیکس ۴ (GA4) — اتصال سایت به analytics.google.com
 *
 * فعال‌سازی: فقط شناسه اندازه‌گیری (Measurement ID) را در GA_MEASUREMENT_ID
 * قرار بدهید — مثل "G-XXXXXXXXXX". تا وقتی خالی باشد هیچ اسکریپتی لود
 * نمی‌شود و هیچ تاثیری روی سرعت سایت ندارد.
 *
 * نکته‌ها:
 * - مسیرهای /admin عمداً ردیابی نمی‌شوند تا آمار بازدید واقعی بیماران تمیز بماند.
 * - با هر جابه‌جایی داخلی (Client Navigation) یک page_view تازه ارسال می‌شود.
 * - anonymize_ip روشن است؛ IP کاربران نزد گوگل بی‌نام‌سازی می‌شود.
 */

export const GA_MEASUREMENT_ID = "G-FN9XT2H1R3"; // ← شناسه GA4 اینجا قرار می‌گیرد

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !pathname) return;
    // پنل مدیریت ردیابی نمی‌شود
    if (pathname.startsWith("/admin")) return;

    // اولین رندر: page_view را خودِ gtag('config') می‌فرستد
    if (prevPath.current === null) {
      prevPath.current = pathname;
      return;
    }
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_title: document.title,
      page_location: window.location.origin + pathname,
    });
  }, [pathname]);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
