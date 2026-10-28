import type { Metadata } from "next";
import { AboutPage } from "@/components/site/pages/about-page";
import { JsonLd, OG_IMAGE, ROBOTS_META, breadcrumbJsonLd } from "@/lib/seo";

const TITLE = "درباره دکتر پدرام بخشایی | رتبه ۲ بورد جراحی فک و صورت";
const DESC =
  "بیوگرافی دکتر پدرام بخشایی — متخصص جراحی دهان، فک و صورت از دانشگاه شهید بهشتی، رتبه ۲ بورد تخصصی کشور، هیئت علمی دانشگاه؛ مدال‌آور المپیاد جهانی شیمی با بیش از ۱۱ سال تجربه جراحی";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "دکتر پدرام بخشایی",
    "بیوگرافی جراح فک",
    "بهترین جراح فک تهران",
    "رتبه ۲ بورد جراحی فک",
    "هیئت علمی شهید بهشتی",
  ],
  alternates: { canonical: "/about" },
  robots: ROBOTS_META,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/about",
    images: [{ url: "/uploads/doctor-portrait.jpg", width: 1500, height: 1842 }],
  },
};

export default function AboutRoute() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "درباره من", path: "/about" },
        ])}
      />
      <AboutPage />
    </>
  );
}
