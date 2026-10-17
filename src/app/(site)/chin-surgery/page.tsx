import type { Metadata } from "next";
import { ServiceLanding } from "@/components/site/pages/service-landing";
import { JsonLd, OG_IMAGE, ROBOTS_META, SITE_URL, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { CHIN_SURGERY, CONTENT_UPDATED } from "@/lib/landings";

const L = CHIN_SURGERY;

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

export default function ChinSurgeryPage() {
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
