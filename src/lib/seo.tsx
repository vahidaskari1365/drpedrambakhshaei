/**
 * کتابخانه SEO / GEO / AEO
 * ساخت‌وسازهای JSON-LD (اسکیمای ساختاریافته) + ثابت‌های مشترک متادیتا
 * برای درک کامل موتورهای جستجو و موتورهای مولد هوش مصنوعی (ChatGPT، Gemini، Perplexity)
 */
import { NAV_ITEMS, REVIEWS, SERVICES, SITE, SITE_URL, PRICE_TABS } from "./site-data";
import { ARTICLES, type BlogArticle } from "./blog-data";
import type { SiteContent } from "./site-content";

export { SITE_URL };

type SiteInfo = SiteContent["site"];
type ServiceItem = SiteContent["services"][number];
type ReviewItem = SiteContent["reviews"][number];
type PriceTab = SiteContent["priceTabs"][number];

export const OG_IMAGE = "/uploads/og-image.jpg";

/** اسکیمای پزشک — هسته هویت سایت (E-E-A-T) */
export function physicianJsonLd(site: SiteInfo = SITE, services?: ServiceItem[]) {
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
    telephone: site.phoneIntl,
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
    hasMap: site.mapsUrl,
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
      site.social.instagram,
      site.social.telegram,
      site.social.aparat,
      site.social.whatsapp.replace("09302626021", "+989302626021"),
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
    availableService: (services ?? (SERVICES as unknown as ServiceItem[])).map((s) => ({
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
export function servicesJsonLd(services: ServiceItem[] = SERVICES as unknown as ServiceItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "خدمات تخصصی جراحی دهان، فک و صورت دکتر پدرام بخشایی",
    itemListElement: services.map((s, i) => ({
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
export function reviewsJsonLd(reviews: ReviewItem[] = REVIEWS as unknown as ReviewItem[]) {
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
    review: reviews.slice(0, 8).map((r) => ({
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
export function clinicJsonLd(site: SiteInfo = SITE, services?: ServiceItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${SITE_URL}/#clinic`,
    name: "مطب دکتر پدرام بخشایی — جراحی دهان، فک و صورت",
    image: `${SITE_URL}/uploads/clinic-photo-1.jpg`,
    url: `${SITE_URL}/contact`,
    telephone: site.phoneIntl,
    priceRange: "$$$",
    medicalSpecialty: "OralAndMaxillofacialSurgery",
    availableService: (services ?? SERVICES).map((s) => ({
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
    hasMap: site.mapsUrl,
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
export function pricesJsonLd(tabs: PriceTab[] = PRICE_TABS as unknown as PriceTab[]) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "تعرفه خدمات ۱۴۰۵ — دکتر پدرام بخشایی",
    url: `${SITE_URL}/prices`,
    itemListElement: tabs.map((tab) => ({
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

/** اسکیمای بلاگ — Blog با فهرست پست‌ها برای موتورهای جستجو و AI */
export function blogJsonLd(articles: BlogArticle[] = ARTICLES) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    url: `${SITE_URL}/blog`,
    name: "بلاگ تخصصی جراحی فک و صورت — دکتر پدرام بخشایی",
    inLanguage: "fa-IR",
    description:
      "راهنماهای اورجینال و بدون کپی درباره جراحی ارتوگناتیک، ایمپلنت دندان و جراحی‌های فک و صورت — نگارش تیم تخصصی دکتر پدرام بخشایی",
    publisher: { "@id": `${SITE_URL}/#physician` },
    blogPost: articles.map((a) => ({
      "@type": "BlogPosting",
      headline: a.h1,
      alternativeHeadline: a.metaTitle,
      description: a.excerpt,
      url: `${SITE_URL}/blog/${a.slug}`,
      datePublished: a.publishDate,
      dateModified: a.publishDate,
      image: `${SITE_URL}${a.cover}`,
      wordCount: a.wordCount,
      keywords: a.tags.join("، "),
      inLanguage: "fa-IR",
      author: { "@id": `${SITE_URL}/#physician` },
      publisher: { "@id": `${SITE_URL}/#physician` },
    })),
  };
}

/**
 * اسکیمای مقاله — MedicalWebPage با about: MedicalProcedure + speakable
 * speakable برای موتورهای پاسخ‌دهی صوتی/متنی (AEO) است که خلاصه مقاله را مستقیم می‌خوانند
 */
export function articleJsonLd(article: BlogArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${SITE_URL}/blog/${article.slug}#webpage`,
    url: `${SITE_URL}/blog/${article.slug}`,
    name: article.metaTitle,
    headline: article.h1,
    description: article.metaDesc,
    inLanguage: "fa-IR",
    datePublished: article.publishDate,
    dateModified: article.publishDate,
    lastReviewed: article.publishDate,
    reviewAspect: "دقت پزشکی محتوا",
    wordCount: article.wordCount,
    image: `${SITE_URL}${article.cover}`,
    author: { "@id": `${SITE_URL}/#physician` },
    publisher: { "@id": `${SITE_URL}/#physician` },
    reviewedBy: { "@id": `${SITE_URL}/#physician` },
    audience: { "@type": "Patient" },
    about: {
      "@type": "MedicalProcedure",
      name: "جراحی ارتوگناتیک",
      alternateName: "ارتوسرجری",
      procedureType: "https://schema.org/SurgicalProcedure",
      bodyLocation: "فک و صورت",
      performer: { "@id": `${SITE_URL}/#physician` },
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#article-h1", "#quick-answers"],
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: article.quickAnswers.map((qa, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Question",
          name: qa.q,
          acceptedAnswer: { "@type": "Answer", text: qa.a },
        },
      })),
    },
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
