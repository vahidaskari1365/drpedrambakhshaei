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
        desc="از طریق فرم، تماس تلفنی یا پیام‌رسان‌ها با ما در ارتباط باشید — پاسداران، بالاتر از برج سفید، مرکز خرید پاسداران، طبقه ۲، واحد ۴"
      />

      <div className="bg-sage">
        <Contact />
      </div>
    </>
  );
}
