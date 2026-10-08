import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/admin-app";

/** پنل مدیریت — از ایندکس موتورهای جستجو خارج است */
export const metadata: Metadata = {
  title: "پنل مدیریت سایت",
  robots: { index: false, follow: false },
};

export default function AdminRoute() {
  return <AdminApp />;
}
