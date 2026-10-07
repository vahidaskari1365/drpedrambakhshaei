"use client";

import { LogoFull } from "./logo";
import { Phone, MapPin, Instagram, SendHorizontal, MessageCircle, Play, Star } from "lucide-react";
import { SITE } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="mt-auto bg-[oklch(0.16_0.01_190)] text-background/85" role="contentinfo">
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* برند */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="rounded-full bg-background/95 p-1.5">
                <LogoFull className="[&_span]:text-foreground [&_span]:text-[13px]" />
              </span>
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-7 text-background/60">
              متخصص جراحی‌های دهان، فک و صورت — دانشیار دانشگاه شهید بهشتی، رتبه ۲ بورد تخصص؛
              ارتوسرجری، ایمپلنت و جراحی دندان‌های نهفته در پاسداران تهران.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Star className="h-3.5 w-3.5 fill-current" />
              امتیاز {SITE.rating.score} در گوگل ({SITE.rating.count} نظر)
            </div>
          </div>

          {/* دسترسی سریع */}
          <nav aria-label="دسترسی سریع">
            <h2 className="mb-4 text-sm font-black text-background">دسترسی سریع</h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13px]">
              {[
                { href: "#gallery", label: "گالری جراحی فک و صورت" },
                { href: "#gallery", label: "گالری ایمپلنت" },
                { href: "#gallery", label: "گالری جراحی دندان عقل" },
                { href: "#services", label: "ارتوسرجری" },
                { href: "#services", label: "جراحی چانه" },
                { href: "#prices", label: "تعرفه خدمات" },
                { href: "#faq", label: "سوالات متداول" },
                { href: "#contact", label: "رزرو نوبت" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-background/60 transition-colors hover:text-background cursor-pointer">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* تماس */}
          <div>
            <h2 className="mb-4 text-sm font-black text-background">تماس با ما</h2>
            <ul className="space-y-3 text-[13px]">
              <li>
                <a href={`tel:${SITE.phone}`} className="flex items-center gap-2.5 text-background/60 transition-colors hover:text-background cursor-pointer" dir="rtl">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span dir="ltr" className="tabular-nums font-bold">{SITE.phone}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-background/60">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="leading-6">{SITE.address}</span>
              </li>
            </ul>
            <div className="mt-5 flex gap-2">
              {[
                { href: SITE.social.instagram, label: "اینستاگرام", Icon: Instagram },
                { href: SITE.social.telegram, label: "تلگرام", Icon: SendHorizontal },
                { href: SITE.social.whatsapp, label: "واتسپ", Icon: MessageCircle },
                { href: SITE.social.aparat, label: "آپارات", Icon: Play },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-background/15 text-background/70 transition-all duration-300 hover:scale-110 hover:bg-background/10 hover:text-background cursor-pointer"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-background/10 pt-6 text-[11px] text-background/45 sm:flex-row">
          <p>© ۱۴۰۵ کلیه حقوق برای وبسایت دکتر پدرام بخشایی محفوظ است.</p>
          <p>طراحی‌شده با دقت — مطب دکتر پدرام بخشایی</p>
        </div>
      </div>
    </footer>
  );
}
