import type { Metadata } from "next";
import { ContactPage } from "@/components/site/pages/contact-page";
import { JsonLd, OG_IMAGE, ROBOTS_META, breadcrumbJsonLd, clinicJsonLd } from "@/lib/seo";
import { getMergedContent } from "@/lib/content-store";

const TITLE = "رزرو نوبت و آدرس مطب | پاسداران، تهران";
const DESC =
  "رزرو نوبت دکتر پدرام بخشایی — تلفن ۰۹۳۰۲۶۲۶۰۲۱، آدرس: تهران، پاسداران، مرکز خرید پاسداران، طبقه ۲ و ۴؛ شنبه تا پنجشنبه ۱۶ تا ۲۰ + نقشه گوگل و راه‌های ارتباطی";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "رزرو نوبت جراح فک",
    "آدرس مطب دکتر بخشایی",
    "نوبت دهی ایمپلنت تهران",
    "جراح فک پاسداران تلفن",
  ],
  alternates: { canonical: "/contact" },
  robots: ROBOTS_META,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/contact",
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
};

export default async function ContactRoute() {
  const content = await getMergedContent();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "تماس", path: "/contact" },
        ])}
      />
      <JsonLd data={clinicJsonLd(content.site, content.services)} />
      <ContactPage />
    </>
  );
}
