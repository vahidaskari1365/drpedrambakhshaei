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
    </>
  );
}
