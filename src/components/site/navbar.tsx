"use client";

import * as React from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Phone, Star } from "lucide-react";
import { LogoMark } from "./logo";
import { NAV_ITEMS, SITE, type RouteKey } from "@/lib/site-data";
import { cn } from "@/lib/utils";

/**
 * نوبار بیضی (اوال) مدرن — شیشه‌ای، اپل‌استایل
 * route-aware: هر تب یک صفحه اختصاصی + منوی موبایل فول‌اسکرین
 * مخفی‌شدن با اسکرول به پایین و بازگشت با اسکرول به بالا
 */
export function Navbar({ route }: { route: RouteKey }) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const { scrollY } = useScroll();
  const lastY = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 40);
    const goingDown = y > lastY.current;
    // فقط بعد از عبور از هیرو مخفی شود
    setHidden(goingDown && y > 480 && !open);
    lastY.current = y;
  });

  // بستن منو با تغییر مسیر
  React.useEffect(() => {
    setOpen(false);
  }, [route]);

  // قفل اسکرول در منوی موبایل
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -130 : 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-3 left-0 right-0 z-50 flex justify-center px-4"
      >
        <nav
          aria-label="ناوبری اصلی"
          className={cn(
            "glass flex w-full max-w-5xl items-center gap-1 rounded-full transition-all duration-500",
            scrolled ? "py-1.5 pl-2 pr-3 shadow-lg" : "py-2.5 pl-2.5 pr-4"
          )}
        >
          <a
            href="#/"
            aria-label="صفحه اصلی"
            className="flex items-center gap-2 rounded-full py-1 pl-2 cursor-pointer"
          >
            <LogoMark className={cn("text-foreground transition-all", scrolled ? "h-8 w-8" : "h-9 w-9")} />
            <span className={cn("flex flex-col leading-none transition-all", scrolled ? "opacity-0 w-0 overflow-hidden" : "opacity-100")}>
              <span className="text-[13px] font-extrabold tracking-tight whitespace-nowrap">دکتر پدرام بخشایی</span>
            </span>
          </a>

          <ul className="mr-auto hidden items-center lg:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={route === item.href.slice(1) ? "page" : undefined}
                  className={cn(
                    "relative block whitespace-nowrap rounded-full px-2.5 py-2 text-[12.5px] font-medium transition-colors duration-300 xl:px-3.5 xl:text-[13px] cursor-pointer",
                    route === item.href.slice(1)
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {route === item.href.slice(1) && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-primary"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mr-auto lg:mr-2 flex items-center gap-2">
            <a
              href={`tel:${SITE.phone}`}
              className="hidden sm:flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-bold text-background transition-transform duration-300 hover:scale-[1.04] active:scale-95 cursor-pointer"
              dir="ltr"
            >
              <Phone className="h-3.5 w-3.5" />
              {SITE.phone}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="باز کردن منو"
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/60 transition-colors hover:bg-card lg:hidden cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* منوی موبایل فول‌اسکرین */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] flex flex-col bg-petrol-frost backdrop-blur-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="منوی اصلی"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <LogoMark className="h-10 w-10 text-background" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="بستن منو"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-background/20 bg-background/10 text-background cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav aria-label="ناوبری موبایل" className="flex flex-1 flex-col justify-center px-8">
              <ul className="space-y-1">
                {NAV_ITEMS.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i + 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group flex items-center justify-between rounded-2xl px-4 py-3.5 text-2xl font-extrabold tracking-tight transition-colors cursor-pointer",
                        route === item.href.slice(1) ? "text-teal-300" : "text-background/80 hover:text-background"
                      )}
                    >
                      {item.label}
                      <span className="text-xs font-medium text-background/40 opacity-0 transition-opacity group-hover:opacity-100">
                        ۰{i + 1}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3 px-8 pb-10"
            >
              <div className="flex items-center gap-2 text-sm text-background/60">
                <span className="flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-1 text-amber-300">
                  <Star className="h-3.5 w-3.5 fill-current" /> {SITE.rating.score}
                </span>
                <span>{SITE.rating.count} نظر در گوگل</span>
              </div>
              <a
                href={`tel:${SITE.phone}`}
                dir="ltr"
                className="flex items-center justify-center gap-2 rounded-full bg-background py-4 text-base font-bold text-[oklch(0.17_0.025_205)] cursor-pointer"
              >
                <Phone className="h-4 w-4" />
                {SITE.phone}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
