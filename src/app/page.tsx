import type { Metadata } from "next";
import { HomePage } from "@/components/site/pages/home";
import { JsonLd, ROBOTS_META } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  robots: ROBOTS_META,
};

export default function Home() {
  return <HomePage />;
}
