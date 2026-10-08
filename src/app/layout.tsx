import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PwaRegister } from "@/components/site/pwa-register";
import { Chrome } from "@/components/site/chrome";
import { HashRedirect } from "@/components/site/hash-redirect";
import { JsonLd, OG_IMAGE, physicianJsonLd, websiteJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-data";

const vazir = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

/* استداد — فونت تیتراژ مدرن فارسی (متغیر، با ارقام فارسی) */
const estedad = localFont({
  src: "../fonts/Estedad-FD-VF.woff2",
  variable: "--font-estedad",
  weight: "100 900",
  display: "swap",
});

const TITLE = "دکتر پدرام بخشایی | متخصص جراحی دهان، فک و صورت";
const DESC =
  "دکتر پدرام بخشایی، متخصص جراحی‌های دهان، فک و صورت از دانشگاه شهید بهشتی — ارتوسرجری، جراحی فک، ایمپلنت دندان، جراحی دندان عقل نهفته، جنیوپلاستی؛ جراح فک در پاسداران تهران";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | دکتر پدرام بخشایی",
  },
  description: DESC,
  keywords: [
    "دکتر پدرام بخشایی",
    "جراح فک و صورت",
    "متخصص جراحی دهان فک و صورت",
    "ارتوسرجری تهران",
    "جراحی فک",
    "ایمپلنت دندان",
    "ایمپلنت یک روزه",
    "جراحی دندان عقل نهفته",
    "جنیوپلاستی",
    "جراح فک پاسداران",
    "OMFS تهران",
  ],
  authors: [{ name: "دکتر پدرام بخشایی", url: SITE_URL }],
  creator: "دکتر پدرام بخشایی",
  publisher: "مطب دکتر پدرام بخشایی",
  alternates: {
    canonical: "/",
    languages: { "fa-IR": "/" },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: SITE_URL,
    siteName: "دکتر پدرام بخشایی — جراح فک و صورت",
    title: TITLE,
    description: DESC,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "دکتر پدرام بخشایی — متخصص جراحی دهان، فک و صورت در تهران",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192" }],
  },
  manifest: "/manifest.webmanifest",
  applicationName: "دکتر پدرام بخشایی",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "دکتر بخشایی",
  },
  formatDetection: { telephone: true },
  other: {
    "geo.region": "IR-23",
    "geo.placename": "تهران، پاسداران",
    "geo.position": "35.7675574;51.4571543",
    ICBM: "35.7675574, 51.4571543",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#161513" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa-IR" dir="rtl" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${vazir.variable} ${estedad.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {/* اسکیماهای سراسری — هویت پزشک و وب‌سایت */}
        <JsonLd data={physicianJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <Chrome>{children}</Chrome>
        <Toaster />
        <PwaRegister />
        <HashRedirect />
      </body>
    </html>
  );
}
