"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MousePointer2, Hand } from "lucide-react";
import { WorksWheel } from "./works-wheel";
import { GALLERY } from "@/lib/site-data";

/**
 * گالری نمونه کارها — چرخ سه‌بعدی تعاملی
 * روی دسکتاپ: اسکرول یا درگ | روی موبایل: درگ عمودی
 */
export function GallerySection() {
  const [hint, setHint] = React.useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setHint(false), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="gallery"
      className="relative py-20 lg:py-28"
      aria-label="نمونه کارها و فضای مطب"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 text-center lg:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 text-xs font-bold tracking-widest text-primary"
          >
            گالری سینمایی
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="text-3xl font-black tracking-tight sm:text-[2.6rem]"
          >
            آشنایی با فضای مطب و
            <br className="hidden sm:block" /> نمونه جراحی‌ها
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
            className="mx-auto mt-4 max-w-xl text-[15px] leading-8 text-muted-foreground"
          >
            چرخ را بچرخانید تا عکس‌های واقعی مطب و انواع جراحی‌ها را ببینید —
            جهت کمک به تصمیم‌گیری آسان‌تر شما
          </motion.p>
        </div>
      </div>

      <div className="relative mx-auto h-[62svh] min-h-[420px] max-w-7xl px-2 lg:h-[74svh] lg:px-8">
        <WorksWheel
          items={GALLERY.map((g) => ({ title: g.title, image: g.image }))}
          label="نمونه کارها"
          action="مشاهده"
          className="rounded-[2.5rem]"
        />

        {/* راهنمای تعامل */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={hint ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-foreground/85 px-4 py-2 text-xs font-bold text-background backdrop-blur"
        >
          <MousePointer2 className="hidden h-3.5 w-3.5 sm:block" />
          <Hand className="h-3.5 w-3.5 sm:hidden" />
          اسکرول یا درگ کنید
        </motion.div>
      </div>
    </section>
  );
}
