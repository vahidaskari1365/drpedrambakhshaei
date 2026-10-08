import Link from "next/link";
import { Compass, Phone } from "lucide-react";
import { NAV_ITEMS, SITE } from "@/lib/site-data";

/** صفحه ۴۰۴ — یافت نشد */
export default function NotFound() {
  return (
    <section className="bg-petrol-deep grain relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
      <div className="aurora" />
      <div className="relative">
        <p className="text-7xl font-black tracking-tight text-teal-300 sm:text-8xl">۴۰۴</p>
        <h1 className="mt-4 text-2xl font-black text-background sm:text-3xl">
          این صفحه پیدا نشد
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-background/60">
          صفحه‌ای که دنبالش بودید جابه‌جا شده یا وجود ندارد. از مسیرهای زیر
          می‌توانید ادامه دهید یا مستقیم با مطب تماس بگیرید.
        </p>
        <nav aria-label="دسترسی سریع" className="mt-7 flex flex-wrap items-center justify-center gap-2">
          {NAV_ITEMS.filter((n) => n.href !== "/")
            .slice(0, 6)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-background/15 bg-background/10 px-4 py-2 text-[13px] font-bold text-background/80 backdrop-blur transition-colors hover:bg-background/20 hover:text-background cursor-pointer"
              >
                {item.label}
              </Link>
            ))}
        </nav>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-bold text-[oklch(0.17_0.025_205)] transition-transform hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            <Compass className="h-4 w-4" />
            بازگشت به صفحه اصلی
          </Link>
          <a
            href={`tel:${SITE.phone}`}
            dir="ltr"
            className="inline-flex items-center gap-2 rounded-full border border-background/25 px-6 py-3 text-sm font-bold text-background transition-colors hover:bg-background/10 cursor-pointer"
          >
            <Phone className="h-4 w-4" />
            {SITE.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
