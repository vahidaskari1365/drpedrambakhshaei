import type { Metadata } from "next";
import { ServiceLanding } from "@/components/site/pages/service-landing";
import { JsonLd, OG_IMAGE, ROBOTS_META, SITE_URL, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { IMPLANT_PASDARAN, CONTENT_UPDATED } from "@/lib/landings";
import { SITE } from "@/lib/site-data";

const L = IMPLANT_PASDARAN;

export const metadata: Metadata = {
  title: L.metaTitle,
  description: L.metaDescription,
  keywords: L.keywords,
  alternates: { canonical: `${SITE_URL}${L.path}` },
  openGraph: {
    title: L.metaTitle,
    description: L.metaDescription,
    url: `${SITE_URL}${L.path}`,
    images: [{ url: OG_IMAGE }],
  },
  robots: ROBOTS_META,
};

export default function ImplantPasdaranPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalProcedure",
          name: L.procedure.name,
          description: L.metaDescription,
          procedureType: "https://schema.org/SurgicalProcedure",
          bodyLocation: L.procedure.bodyLocation,
          howPerformed: L.procedure.howPerformed,
          url: `${SITE_URL}${L.path}`,
          performer: { "@id": `${SITE_URL}/#physician` },
          dateModified: CONTENT_UPDATED.iso,
        }}
      />
      {/* WebPage با dateModified — تازگی محتوا برای AI Mode و استنادهای AIO */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${SITE_URL}${L.path}#webpage`,
          url: `${SITE_URL}${L.path}`,
          name: L.metaTitle,
          description: L.metaDescription,
          inLanguage: "fa-IR",
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: { "@id": `${SITE_URL}/#physician` },
          dateModified: CONTENT_UPDATED.iso,
        }}
      />
      {/* MedicalClinic محلی — سیگنال محلی پاسداران (NAP + امتیاز ۵٫۰ گوگل) */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalClinic",
          "@id": `${SITE_URL}${L.path}#clinic`,
          name: "مطب دکتر پدرام بخشایی — پاسداران",
          url: `${SITE_URL}${L.path}`,
          telephone: SITE.phoneIntl,
          image: `${SITE_URL}/uploads/clinic-photo-1.jpg`,
          medicalSpecialty: "OralAndMaxillofacialSurgery",
          priceRange: "$$$",
          currenciesAccepted: "IRR",
          paymentAccepted: "نقدی، کارت بانکی، پرداخت مرحله‌ای",
          address: {
            "@type": "PostalAddress",
            streetAddress: "خیابان پاسداران، مرکز خرید پاسداران، طبقه ۲ و ۴",
            addressLocality: "تهران",
            addressRegion: "تهران",
            addressCountry: "IR",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 35.7675574,
            longitude: 51.4571543,
          },
          hasMap: SITE.mapsUrl,
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
              opens: "16:00",
              closes: "20:00",
            },
          ],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5.0",
            reviewCount: "9",
            bestRating: "5",
            worstRating: "1",
          },
        }}
      />
      <JsonLd data={faqJsonLd(L.faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "خدمات", path: "/services" },
          { name: L.label, path: L.path },
        ])}
      />
      <ServiceLanding config={L} />
    </>
  );
}
