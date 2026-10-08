import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-data";
import { ARTICLES } from "@/lib/blog-data";

/** نقشه سایت — صفحات اصلی + مقالات بلاگ با اولویت و تواتر به‌روزرسانی */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const mainPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/services`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/prices`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/gallery`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/reviews`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.9,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    lastModified: new Date(a.publishDate),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...mainPages, ...blogPages];
}
