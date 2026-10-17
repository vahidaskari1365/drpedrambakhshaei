import type { Metadata } from "next";
import { ServiceLanding } from "@/components/site/pages/service-landing";
import { JsonLd, OG_IMAGE, ROBOTS_META, SITE_URL, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { IMPLANT_PASDARAN } from "@/lib/landings";

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
