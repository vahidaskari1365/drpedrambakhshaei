import type { Metadata } from "next";
import { GalleryPage } from "@/components/site/pages/gallery-page";
import { JsonLd, OG_IMAGE, ROBOTS_META, breadcrumbJsonLd } from "@/lib/seo";

const TITLE = "نمونه کارهای جراحی فک و ایمپلنت دندان | گالری مطب";
const DESC =
  "نمونه کارهای واقعی جراحی فک (ارتوسرجری)، جنیوپلاستی، ایمپلنت دندان و جراحی دندان نهفته — قبل و بعد واقعی بیماران + گالری عکس مطب دکتر پدرام بخشایی در پاسداران تهران";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "نمونه کار جراحی فک",
    "قبل و بعد ارتوسرجری",
    "نمونه ایمپلنت دندان",
    "گالری مطب دندانپزشکی",
    "جراحی چانه قبل بعد",
  ],
  alternates: { canonical: "/gallery" },
  robots: ROBOTS_META,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/gallery",
    images: [{ url: "/uploads/jaw-surgery-result.jpg", width: 1200, height: 800 }],
  },
};

export default function GalleryRoute() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "نمونه کارها", path: "/gallery" },
        ])}
      />
      <GalleryPage />
    </>
  );
}
