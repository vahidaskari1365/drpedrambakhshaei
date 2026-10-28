import type { Metadata } from "next";
import { FaqPage } from "@/components/site/pages/faq-page";
import { JsonLd, OG_IMAGE, ROBOTS_META, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { FAQ_ITEMS, PRICE_FAQS } from "@/lib/site-data";

const TITLE = "سوالات متداول جراحی فک، ایمپلنت و دندان نهفته";
const DESC =
  "پاسخ تخصصی به ۲۱ سوال پرتکرار: ارتوسرجری چیست و چقدر طول می‌کشد؟ ایمپلنت درد دارد؟ نقاهت جراحی فک چند روز است؟ هزینه‌ها چگونه محاسبه می‌شود؟ — پاسخ مستقیم از دکتر پدرام بخشایی";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "ارتوسرجری چیست",
    "سوالات متداول ایمپلنت",
    "نقاهت جراحی فک",
    "درد ایمپلنت دندان",
    "طول عمر ایمپلنت",
    "جراحی دندان نهفته درد دارد",
  ],
  alternates: { canonical: "/faq" },
  robots: ROBOTS_META,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/faq",
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
};

export default function FaqRoute() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "سوالات متداول", path: "/faq" },
        ])}
      />
      <JsonLd data={faqJsonLd([...FAQ_ITEMS, ...PRICE_FAQS])} />
      <FaqPage />
    </>
  );
}
