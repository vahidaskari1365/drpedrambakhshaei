"use client";

import * as React from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { HomePage } from "./pages/home";
import { ServicesPage } from "./pages/services-page";
import { GalleryPage } from "./pages/gallery-page";
import { AboutPage } from "./pages/about-page";
import { PricesPage } from "./pages/prices-page";
import { FaqPage } from "./pages/faq-page";
import { ReviewsPage } from "./pages/reviews-page";
import { ContactPage } from "./pages/contact-page";
import { LEGACY_ANCHOR_MAP, type RouteKey } from "@/lib/site-data";

const ROUTES: RouteKey[] = ["/", "/services", "/gallery", "/about", "/prices", "/faq", "/reviews", "/contact"];

const PAGES: Record<RouteKey, React.ComponentType> = {
  "/": HomePage,
  "/services": ServicesPage,
  "/gallery": GalleryPage,
  "/about": AboutPage,
  "/prices": PricesPage,
  "/faq": FaqPage,
  "/reviews": ReviewsPage,
  "/contact": ContactPage,
};

const TITLES: Record<RouteKey, string> = {
  "/": "دکتر پدرام بخشایی | متخصص جراحی دهان، فک و صورت",
  "/services": "خدمات تخصصی | دکتر پدرام بخشایی",
  "/gallery": "نمونه کارها و گالری مطب | دکتر پدرام بخشایی",
  "/about": "درباره دکتر پدرام بخشایی",
  "/prices": "تعرفه خدمات ۱۴۰۵ | دکتر پدرام بخشایی",
  "/faq": "سوالات متداول | دکتر پدرام بخشایی",
  "/reviews": "نظرات مراجعین | دکتر پدرام بخشایی",
  "/contact": "رزرو نوبت و تماس | دکتر پدرام بخشایی",
};

function parseHash(): { route: RouteKey; legacy: boolean } {
  const raw = typeof window === "undefined" ? "#/" : window.location.hash || "#/";
  if (LEGACY_ANCHOR_MAP[raw]) {
    return { route: (LEGACY_ANCHOR_MAP[raw].slice(1) || "/") as RouteKey, legacy: true };
  }
  const path = raw.startsWith("#/") ? raw.slice(1) : "/";
  const route = (ROUTES.includes(path as RouteKey) ? path : "/") as RouteKey;
  return { route, legacy: false };
}

/**
 * پوسته اپ — روتر هش‌محور با ترنزیشن سینمایی بین صفحات
 * هر تب نوبار یک صفحه اختصاصی دارد؛ انکرهای قدیمی (#contact) به صفحات جدید نگاشت می‌شوند.
 */
export function AppShell() {
  const [route, setRoute] = React.useState<RouteKey>("/");

  React.useEffect(() => {
    const apply = () => {
      const { route: r, legacy } = parseHash();
      if (legacy) {
        // نرمال‌سازی انکرهای قدیمی به مسیر صفحات
        window.history.replaceState(null, "", LEGACY_ANCHOR_MAP[window.location.hash] ?? "#/");
      }
      setRoute(r);
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  React.useEffect(() => {
    document.title = TITLES[route] ?? TITLES["/"];
  }, [route]);

  const Page = PAGES[route] ?? HomePage;

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col">
        <Navbar route={route} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={route}
            initial={{ opacity: 0, y: 28, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.995 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1"
          >
            <Page />
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
    </MotionConfig>
  );
}
