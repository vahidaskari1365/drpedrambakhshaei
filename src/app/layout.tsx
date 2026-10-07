import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PwaRegister } from "@/components/site/pwa-register";

const vazir = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const SITE_URL = "https://drpedrambakhshaei.com";
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
  authors: [{ name: "دکتر پدرام بخشایی" }],
  creator: "دکتر پدرام بخشایی",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: SITE_URL,
    siteName: "دکتر پدرام بخشایی — جراح فک و صورت",
    title: TITLE,
    description: DESC,
    images: [
      {
        url: "/uploads/doctor-portrait.jpg",
        width: 1500,
        height: 1842,
        alt: "دکتر پدرام بخشایی — متخصص جراحی دهان، فک و صورت",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/uploads/doctor-portrait.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
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
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${vazir.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {children}
        <Toaster />
        <PwaRegister />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Physician",
              name: "دکتر پدرام بخشایی",
              alternateName: "Dr. Pedram Bakhshaei",
              medicalSpecialty: "OralAndMaxillofacialSurgery",
              description: DESC,
              url: SITE_URL,
              telephone: "+989302626021",
              image: `${SITE_URL}/uploads/doctor-portrait.jpg`,
              address: {
                "@type": "PostalAddress",
                streetAddress: "خیابان پاسداران، مرکز خرید پاسداران، طبقه ۲ و ۴",
                addressLocality: "تهران",
                addressCountry: "IR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 35.7675574,
                longitude: 51.4571543,
              },
              sameAs: [
                "https://www.instagram.com/dr.bakhshaei.omfs",
                "https://t.me/drbakhshaei",
                "https://www.aparat.com/Drpedrambakhshaei",
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5.0",
                reviewCount: "9",
                bestRating: "5",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
