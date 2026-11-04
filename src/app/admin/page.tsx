import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/admin-app";

/**
 * پنل مدیریت — از ایندکس موتورهای جستجو خارج است.
 * force-dynamic: این صفحه هرگز prerender/کش نمی‌شود — نسخه کهنه HTML با
 * s-maxage یک‌ساله در کش وب‌سرور هاست گیر کرده بود و پنل قدیمی (بدون تب
 * نوبت‌ها/پیامک) سرو می‌شد. خروجی داینامیک یعنی همیشه HTML تازه از باندل جاری.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "پنل مدیریت سایت",
  robots: { index: false, follow: false },
};

export default function AdminRoute() {
  return <AdminApp />;
}
