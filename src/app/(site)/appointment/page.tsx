import type { Metadata } from "next";
import { AppointmentPage } from "@/components/site/pages/appointment-page";
import { JsonLd, OG_IMAGE, ROBOTS_META, breadcrumbJsonLd } from "@/lib/seo";

const TITLE = "رزرو نوبت آنلاین دکتر پدرام بخشایی | تایید پیامکی";
const DESC =
  "رزرو نوبت آنلاین مطب دکتر پدرام بخشایی شهربابکی در تهران پاسداران — انتخاب خدمت، تاریخ و ساعت؛ تایید شماره موبایل با کد پیامکی و ثبت فوری نوبت. شنبه تا پنجشنبه ۱۶ تا ۲۰";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "رزرو نوبت آنلاین جراح فک",
    "نوبت دهی اینترنتی دکتر پدرام بخشایی",
    "رزرو سریع نوبت مطب پاسداران",
  ],
  alternates: { canonical: "/appointment" },
  robots: ROBOTS_META,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/appointment",
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
};

export default function AppointmentRoute() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "رزرو نوبت آنلاین", path: "/appointment" },
        ])}
      />
      <AppointmentPage />
    </>
  );
}
