import type { Metadata } from "next";
import { HomePage } from "@/components/site/pages/home";
import { faqJsonLd, JsonLd, ROBOTS_META } from "@/lib/seo";
import { FAQ_ITEMS } from "@/lib/site-data";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  robots: ROBOTS_META,
};

/** همان ۴ سؤالی که در صفحه اصلی نمایش داده می‌شوند — اسکیما باید دقیقاً محتوای صفحه را بازتاب دهد */
const HOME_FAQ_INDEXES = [0, 5, 1, 6];
const homeFaqItems = HOME_FAQ_INDEXES.map((i) => FAQ_ITEMS[i]).filter(
  (f): f is { q: string; a: string } => Boolean(f)
);

export default function Home() {
  return (
    <>
      <JsonLd data={faqJsonLd(homeFaqItems)} />
      <HomePage />
    </>
  );
}
