import { FileDown } from "lucide-react";
import { Chrome } from "@/components/site/chrome";
import { HashRedirect } from "@/components/site/hash-redirect";
import { ContentProvider } from "@/components/site/content-provider";
import { VisitTracker } from "@/components/site/visit-tracker";
import { JsonLd, physicianJsonLd, websiteJsonLd } from "@/lib/seo";
import { getMergedContent } from "@/lib/content-store";

/** رندر زنده در هر درخواست — ویرایش‌های پنل ادمین بلافاصله در SSR دیده می‌شوند */
export const dynamic = "force-dynamic";

/**
 * پوسته صفحات عمومی سایت — محتوای زنده (پیش‌فرض + ویرایش‌های پنل ادمین)
 * سمت سرور خوانده و به کل درخت کامپوننت تزریق می‌شود؛ یعنی SSR، SEO
 * و نمایش کاربر همیشه با پنل ادمین سینک است.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getMergedContent();

  return (
    <>
      {/* اسکیماهای سراسری — هویت پزشک و وب‌سایت */}
      <JsonLd data={physicianJsonLd(content.site, content.services, content.reviews)} />
      <JsonLd data={websiteJsonLd()} />
      <ContentProvider content={content}>
        <Chrome>{children}</Chrome>
      </ContentProvider>
      <VisitTracker />
      <HashRedirect />
      {/* موقت — فقط در حالت توسعه: دکمه دانلود گزارش پیشرفت برای کارفرما */}
      {process.env.NODE_ENV === "development" && (
        <a
          href="/report.pdf"
          download="گزارش پیشرفت سایت - دکتر پدرام بخشایی.pdf"
          aria-label="دانلود گزارش پیشرفت پروژه (PDF)"
          className="fixed bottom-24 left-3 z-50 flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-lg shadow-amber-500/30 transition hover:bg-amber-400 hover:shadow-xl active:scale-95"
        >
          <FileDown className="size-4" aria-hidden="true" />
          دانلود گزارش PDF
        </a>
      )}
    </>
  );
}
