import type { Metadata } from "next";
import { ServicesPage } from "@/components/site/pages/services-page";
import {
  JsonLd,
  OG_IMAGE,
  ROBOTS_META,
  breadcrumbJsonLd,
  faqJsonLd,
  servicesJsonLd,
} from "@/lib/seo";
import { FAQ_ITEMS } from "@/lib/site-data";

const TITLE = "خدمات جراحی فک و صورت، ایمپلنت دندان و دندان نهفته در تهران";
const DESC =
  "خدمات تخصصی دکتر پدرام بخشایی: جراحی ارتوگناتیک فک (ارتوسرجری)، جنیوپلاستی، ایمپلنت یک‌روزه و ایمپلنت‌های پیشرفته، جراحی دندان عقل نهفته — با رتبه ۲ بورد تخصصی کشور در پاسداران تهران";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "جراحی فک تهران",
    "ارتوسرجری",
    "جنیوپلاستی",
    "ایمپلنت یک روزه تهران",
    "ایمپلنت فوری دندان",
    "جراحی دندان عقل نهفته",
    "زاویه سازی فک",
    "متخصص جراحی فک پاسداران",
  ],
  alternates: { canonical: "/services" },
  robots: ROBOTS_META,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/services",
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
};

export default function ServicesRoute() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "خدمات", path: "/services" },
        ])}
      />
      <JsonLd data={servicesJsonLd()} />
      <JsonLd data={faqJsonLd(FAQ_ITEMS)} />
      <ServicesPage />
    </>
  );
}
