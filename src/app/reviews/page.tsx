import type { Metadata } from "next";
import { ReviewsPage } from "@/components/site/pages/reviews-page";
import { JsonLd, OG_IMAGE, ROBOTS_META, breadcrumbJsonLd, reviewsJsonLd } from "@/lib/seo";

const TITLE = "نظرات مراجعین | امتیاز ۵ از ۵ در گوگل";
const DESC =
  "نظرات واقعی بیماران دکتر پدرام بخشایی: جراحی ایمپلنت، پیوند استخوان، جراحی چانه و ارتوسرجری — امتیاز ۵٫۰ از ۹ نظر در گوگل مپ و نظرات تأییدشده دکترتو";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "نظرات دکتر پدرام بخشایی",
    "بهترین جراح فک از نظر بیماران",
    "تجربه ایمپلنت دندان",
    "نظر بیماران جراحی فک",
  ],
  alternates: { canonical: "/reviews" },
  robots: ROBOTS_META,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/reviews",
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
};

export default function ReviewsRoute() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "نظرات", path: "/reviews" },
        ])}
      />
      <JsonLd data={reviewsJsonLd()} />
      <ReviewsPage />
    </>
  );
}
