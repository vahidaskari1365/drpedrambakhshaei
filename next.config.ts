import type { NextConfig } from "next";

/**
 * هدرهای امنیتی سراسری — ضد هک، ضد کلیک‌جکینگ، ضد XSS، ضد اسنیفینگ
 * CSP برای این اپ تنظیم شده: اسکریپت‌های اینلاین Next.js، استایل‌های framer-motion،
 * iframe نقشه گوگل در صفحه تماس و فونت‌های سلف‌هاست.
 */
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  // dev: unsafe-eval برای React Refresh؛ پروداکشن بدون آن
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://www.google.com https://maps.google.com https://www.aparat.com",
  "media-src 'self'",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async redirects() {
    return [
      // اسلاگ قدیمی مقاله «ایمپلنت فوری» — قبلاً ایندکس شده بود و اکنون ۴۰۴ می‌داد؛
      // ۳۰۱ دائمی اعتبار لینک را به اسلاگ رسمی منتقل و ۴۰۴ را از گزارش سرچ کنسول پاک می‌کند
      {
        source: "/blog/immediate-implant-loading",
        destination: "/blog/immediate-implant-loading-dee79",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
