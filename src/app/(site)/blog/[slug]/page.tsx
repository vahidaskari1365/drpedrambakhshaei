import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/site/pages/article-page";
import {
  JsonLd,
  ROBOTS_META,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import { getMergedContent } from "@/lib/content-store";

/**
 * صفحه مقاله — اول در دیتابیس (ویرایش‌های پنل ادمین) جستجو می‌شود و بعد در
 * مقالات پیش‌فرض کد. مقاله‌های جدید پنل بدون بیلد مجدد همین‌جا رندر می‌شوند.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getMergedContent();
  const article = content.blog.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: article.metaTitle,
    description: article.metaDesc,
    keywords: article.keywords,
    alternates: { canonical: `/blog/${article.slug}` },
    robots: ROBOTS_META,
    openGraph: {
      type: "article",
      title: article.metaTitle,
      description: article.metaDesc,
      url: `/blog/${article.slug}`,
      publishedTime: article.publishDate,
      modifiedTime: article.publishDate,
      authors: ["دکتر پدرام بخشایی"],
      section: article.category,
      tags: article.tags,
      images: [{ url: article.cover, width: 1200, height: 630, alt: article.coverAlt }],
    },
  };
}

export default async function ArticleRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getMergedContent();
  const article = content.blog.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd data={faqJsonLd(article.faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "مقالات", path: "/blog" },
          { name: article.category, path: `/blog/${article.slug}` },
        ])}
      />
      <ArticlePage article={article} />
    </>
  );
}
