"use client";

import { Contact } from "../contact";
import { PageHero } from "../page-hero";

export function ContactPage() {
  return (
    <>
      <PageHero
        kicker="رزرو نوبت"
        title={
          <>
            درخواست سریع نوبت
            <span className="text-gradient-light block">و مشاوره</span>
          </>
        }
        desc="از طریق فرم، تماس تلفنی یا پیام‌رسان‌ها با ما در ارتباط باشید — پاسداران، مرکز خرید پاسداران، طبقه ۲ و ۴"
      />

      <div className="bg-sage">
        <Contact />
      </div>
    </>
  );
}
