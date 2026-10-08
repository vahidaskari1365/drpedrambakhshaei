import type { Metadata } from "next";
import { BlogPage } from "@/components/site/pages/blog-page";
import { JsonLd, OG_IMAGE, ROBOTS_META, breadcrumbJsonLd, blogJsonLd } from "@/lib/seo";
import { getMergedContent } from "@/lib/content-store";

const TITLE = "مقالات تخصصی جراحی فک و صورت و ایمپلنت دندان";
const DESC =
  "راهنماهای اورجینال و کاملاً اختصاصی درباره جراحی ارتوگناتیک، جراحی فک، ایمپلنت دندان و دندان نهفته — با کلیدواژه‌های دقیق و پاسخ مستقیم به پرسش‌های رایج مراجعان، توسط تیم دکتر پدرام بخشایی";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "مقالات جراحی فک",
    "راهنمای ارتوگناتیک",
    "آموزش جراحی فک و صورت",
    "بلاگ ایمپلنت دندان",
    "جراح فک تهران",
  ],
  alternates: { canonical: "/blog" },
  robots: ROBOTS_META,
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESC,
    url: "/blog",
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
};

export default async function BlogRoute() {
  const content = await getMergedContent();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "مقالات", path: "/blog" },
        ])}
      />
      <JsonLd data={blogJsonLd(content.blog)} />
      <BlogPage />
    </>
  );
}
