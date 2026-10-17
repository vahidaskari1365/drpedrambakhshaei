import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-data";
import { getMergedContent } from "@/lib/content-store";
import { LANDING_LINKS } from "@/lib/landings";

/** زنده — مقاله‌های جدید پنل ادمین بلافاصله وارد نقشه سایت می‌شوند */
export const dynamic = "force-dynamic";

/** نقشه سایت — صفحات اصلی + مقالات بلاگ (شامل مقاله‌های جدید پنل ادمین) */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    // صفحات فرود کلیدواژه‌محور — اولویت بالا برای سئو و AEO
    ...LANDING_LINKS.map(
      (l) =>
        ({
          url: `${SITE_URL}${l.href}`,
          lastModified,
          changeFrequency: "weekly",
          priority: 0.95,
        }) as MetadataRoute.Sitemap[number],
    ),
  ];

  const content = await getMergedContent();
  const blogPages: MetadataRoute.Sitemap = content.blog.map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    lastModified: new Date(a.publishDate),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...mainPages, ...blogPages];
}
