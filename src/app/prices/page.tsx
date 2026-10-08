import type { Metadata } from "next";
import { PricesPage } from "@/components/site/pages/prices-page";
import {
  JsonLd,
  OG_IMAGE,
  ROBOTS_META,
  breadcrumbJsonLd,
  faqJsonLd,
  pricesJsonLd,
} from "@/lib/seo";
import { PRICE_FAQS } from "@/lib/site-data";

const TITLE = "تعرفه خدمات ۱۴۰۵ | قیمت ایمپلنت دندان و جراحی فک در تهران";
const DESC =
  "تعرفه رسمی ۱۴۰۵ مطب دکتر پدرام بخشایی: قیمت ایمپلنت دندان (کره‌ای از ۲۵ میلیون، سوئیسی از ۶۰ میلیون)، هزینه جراحی فک و ارتوسرجری، قیمت جراحی دندان عقل نهفته + امکان پرداخت قسطی";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "قیمت ایمپلنت دندان ۱۴۰۵",
    "هزینه جراحی فک",
    "تعرفه ارتوسرجری",
    "قیمت جراحی دندان عقل نهفته",
    "هزینه جنیوپلاستی",
    "ایمپلنت قسطی تهران",
  ],
  alternates: { canonical: "/prices" },
  robots: ROBOTS_META,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/prices",
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
};

export default function PricesRoute() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "تعرفه‌ها", path: "/prices" },
        ])}
      />
      <JsonLd data={pricesJsonLd()} />
      <JsonLd data={faqJsonLd(PRICE_FAQS)} />
      <PricesPage />
    </>
  );
}
