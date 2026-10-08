/**
 * کتابخانه SEO / GEO / AEO
 * ساخت‌وسازهای JSON-LD (اسکیمای ساختاریافته) + ثابت‌های مشترک متادیتا
 * برای درک کامل موتورهای جستجو و موتورهای مولد هوش مصنوعی (ChatGPT، Gemini، Perplexity)
 */
import { NAV_ITEMS, REVIEWS, SERVICES, SITE, SITE_URL, FAQ_ITEMS, PRICE_TABS } from "./site-data";

export { SITE_URL };

export const OG_IMAGE = "/uploads/og-image.jpg";

/** اسکیمای پزشک — هسته هویت سایت (E-E-A-T) */
export function physicianJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${SITE_URL}/#physician`,
    name: "دکتر پدرام بخشایی",
    alternateName: "Dr. Pedram Bakhshaei",
    givenName: "پدرام",
    familyName: "بخشایی",
    medicalSpecialty: "OralAndMaxillofacialSurgery",
    description:
      "متخصص جراحی دهان، فک و صورت، رتبه ۲ بورد تخصصی کشور، هیئت علمی دانشگاه شهید بهشتی؛ بیش از ۱۱ سال تجربه، ۱۵٬۰۰۰+ جراحی ایمپلنت و ۱۰۴ بیمار ارتوسرجری در تهران",
    url: SITE_URL,
    telephone: SITE.phoneIntl,
    image: `${SITE_URL}/uploads/doctor-portrait.jpg`,
    logo: `${SITE_URL}/icon-512.png`,
    priceRange: "$$$",
    currenciesAccepted: "IRR",
    paymentAccepted: "نقدی، کارت بانکی، پرداخت مرحله‌ای",
    address: {
      "@type": "PostalAddress",
      streetAddress: "خیابان پاسداران، مرکز خرید پاسداران، طبقه ۲ و ۴",
      addressLocality: "تهران",
      addressRegion: "تهران",
      postalCode: "1668834111",
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
    sameAs: [
      SITE.social.instagram,
      SITE.social.telegram,
      SITE.social.aparat,
      SITE.social.whatsapp.replace("09302626021", "+989302626021"),
      "https://doctoreto.com",
    ],
    knowsAbout: [
      "ارتوسرجری",
      "جراحی ارتوگناتیک فک",
      "جنیوپلاستی",
      "ایمپلنت دندان",
      "ایمپلنت یک‌روزه",
      "جراحی دندان عقل نهفته",
      "پیوند استخوان فک",
      "بازسازی کامل دهان",
    ],
    availableService: SERVICES.map((s) => ({
      "@type": "MedicalProcedure",
      name: s.title,
      description: s.desc,
      procedureType: "https://schema.org/SurgicalProcedure",
      howPerformed: s.subtitle,
    })),
  };
}

/** اسکیمای وب‌سایت — ارتباط کل دامنه با هویت پزشک */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "دکتر پدرام بخشایی — متخصص جراحی دهان، فک و صورت",
    inLanguage: "fa-IR",
    description:
      "مرجع خدمات جراحی فک و صورت، ایمپلنت دندان و جراحی دندان‌های نهفته در تهران — تعرفه ۱۴۰۵، نمونه کارهای واقعی و رزرو نوبت آنلاین",
    publisher: { "@id": `${SITE_URL}/#physician` },
    about: { "@id": `${SITE_URL}/#physician` },
  };
}

/** اسکیمای نان‌برکرامب — مسیر صفحات برای گوگل */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** اسکیمای FAQ — کارت‌های پاسخ مستقیم در گوگل و نقل‌قول در پاسخ‌های AI */
export function faqJsonLd(items: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** اسکیمای خدمات — فهرست MedicalProcedure با جزئیات */
export function servicesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "خدمات تخصصی جراحی دهان، فک و صورت دکتر پدرام بخشایی",
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MedicalProcedure",
        name: s.title,
        description: s.desc,
        procedureType: "https://schema.org/SurgicalProcedure",
        bodyLocation: "دهان، فک و صورت",
        performer: { "@id": `${SITE_URL}/#physician` },
        offers: {
          "@type": "Offer",
          priceCurrency: "IRR",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/prices`,
        },
      },
    })),
  };
}

/** اسکیمای نظرات — ریچ‌ریزالت ستاره در نتایج جستجو */
export function reviewsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${SITE_URL}/#physician`,
    name: "دکتر پدرام بخشایی",
    url: `${SITE_URL}/reviews`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "9",
      bestRating: "5",
    },
    review: REVIEWS.slice(0, 8).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(r.stars),
        bestRating: "5",
      },
      reviewBody: r.text,
      publisher: { "@type": "Organization", name: r.source },
    })),
  };
}

/** اسکیمای مطب — صفحه تماس با مختصات جغرافیایی دقیق (Local SEO) */
export function clinicJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${SITE_URL}/#clinic`,
    name: "مطب دکتر پدرام بخشایی — جراحی دهان، فک و صورت",
    image: `${SITE_URL}/uploads/clinic-photo-1.jpg`,
    url: `${SITE_URL}/contact`,
    telephone: SITE.phoneIntl,
    priceRange: "$$$",
    medicalSpecialty: "OralAndMaxillofacialSurgery",
    availableService: SERVICES.map((s) => ({
      "@type": "MedicalProcedure",
      name: s.title,
    })),
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
    hasMap: SITE.mapsUrl,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "16:00",
        closes: "20:00",
      },
    ],
    currenciesAccepted: "IRR",
    paymentAccepted: "نقدی، کارت بانکی، پرداخت مرحله‌ای",
  };
}

/** تعرفه‌ها به‌صورت ساختاریافته — برای پاسخ مستقیم AIها به «قیمت ایمپلنت در تهران» */
export function pricesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "تعرفه خدمات ۱۴۰۵ — دکتر پدرام بخشایی",
    url: `${SITE_URL}/prices`,
    itemListElement: PRICE_TABS.map((tab) => ({
      "@type": "OfferCatalog",
      name: tab.label,
      itemListElement: tab.rows.map((row) => ({
        "@type": "Offer",
        name: row.item,
        description: row.extra,
        priceCurrency: "IRR",
        priceSpecification: {
          "@type": "PriceSpecification",
          description: `از ${row.price} تومان`,
          valueAddedTaxIncluded: true,
        },
      })),
    })),
  };
}

/** لیبل مسیر هر صفحه برای نان‌برکرامب */
export function crumbFor(path: string) {
  const found = NAV_ITEMS.find((n) => n.href === path);
  return found ? { name: found.label, path } : { name: path, path };
}

/** JSON-LD را به تگ اسکریپت تبدیل می‌کند */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** متادیتای مشترک robots — حداکثر نمایانگری برای AI و گوگل */
export const ROBOTS_META = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};
