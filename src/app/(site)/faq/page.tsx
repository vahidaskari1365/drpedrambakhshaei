import type { Metadata } from "next";
import { FaqPage } from "@/components/site/pages/faq-page";
import { JsonLd, OG_IMAGE, ROBOTS_META, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { getMergedContent } from "@/lib/content-store";

const TITLE = "سوالات متداول جراحی فک، ایمپلنت، پریکورونیت و دندان نهفته";
const DESC =
  "پاسخ تخصصی به ۲۴ سوال پرتکرار: ارتوسرجری چیست؟ پریکورونیت چیست و چه کسی درمانش می‌کند؟ قیمت ایمپلنت برزیلی؟ ایمپلنت درد دارد؟ نقاهت جراحی فک؟ — پاسخ مستقیم از دکتر پدرام بخشایی، جراح فک و صورت در تهران";

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
    "پریکورونیت چیست",
    "درمان پریکورونیت",
    "قیمت ایمپلنت برزیلی",
    "بهترین جراح فک و صورت تهران",
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

export default async function FaqRoute() {
  const content = await getMergedContent();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "سوالات متداول", path: "/faq" },
        ])}
      />
      <JsonLd data={faqJsonLd([...content.faq, ...content.priceFaqs])} />
      <FaqPage />
    </>
  );
}
