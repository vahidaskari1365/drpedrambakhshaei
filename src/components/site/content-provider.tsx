"use client";

/**
 * تأمین‌کننده محتوای سایت — محتوای merge‌شده سمت سرور (پیش‌فرض + ادمین)
 * را در Context می‌گذارد تا همه کامپوننت‌ها با useSite() بخوانند.
 * مقدار اولیه از layout سرور می‌آید؛ یعنی SSR و SEO همیشه محتوای
 * به‌روز را می‌بینند و بعد از ذخیره در پنل ادمین، سایت سینک می‌ماند.
 */
import { createContext, useContext, useMemo } from "react";
import { DEFAULTS, type SiteContent } from "@/lib/site-content";

const ContentCtx = createContext<SiteContent>(DEFAULTS as unknown as SiteContent);

export function ContentProvider({
  content,
  children,
}: {
  content?: SiteContent;
  children: React.ReactNode;
}) {
  const value = useMemo(
    () => content ?? (DEFAULTS as unknown as SiteContent),
    [content]
  );
  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>;
}

/** هوک خواندن هر بخش از محتوای زنده سایت */
export function useSite(): SiteContent {
  return useContext(ContentCtx);
}
