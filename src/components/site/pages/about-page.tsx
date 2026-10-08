"use client";

import { About } from "../about";
import { PageHero } from "../page-hero";

export function AboutPage() {
  return (
    <>
      <PageHero
        kicker="درباره من"
        title={
          <>
            علم، هنر و دقت —
            <span className="text-gradient-light block">در خدمت لبخند شما</span>
          </>
        }
        desc="دکتر پدرام بخشایی — متخصص جراحی دهان، فک و صورت از دانشگاه شهید بهشتی؛ رتبه ۲ بورد تخصص کشور و هیئت علمی دانشگاه"
      />

      {/* محتوای درباره — روی زمینه سِیج رنگی */}
      <div className="bg-sage">
        <About />
      </div>
    </>
  );
}
