import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-data";

/**
 * robots.txt — اجازه کامل به موتورهای جستجو و مهم‌تر:
 * اجازه صریح به کرالرهای هوش مصنوعی برای GEO/AEO
 * (ChatGPT، Claude، Perplexity، Gemini، Meta AI و ...)
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin"],
      },
      {
        // کرالرهای موتورهای مولد هوش مصنوعی — برای استناد در پاسخ‌ها
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "CCBot",
          "Meta-ExternalAgent",
          "Bytespider",
          "Amazonbot",
        ],
        allow: "/",
        disallow: ["/api/", "/admin"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
