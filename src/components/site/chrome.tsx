"use client";

import * as React from "react";
import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { QuickDock } from "./quick-dock";
import { BookingModal } from "./booking-modal";

/**
 * پوسته مشترک همه صفحات — نوبار، فوتر، نوار پیشرفت اسکرول، داک تماس سریع
 * موشن‌گرافی و ناوبری بین روتهای واقعی App Router
 */
export function Chrome({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });

  return (
    <MotionConfig reducedMotion="user">
      {/* نوار پیشرفت اسکرول سینمایی */}
      <motion.div
        style={{ scaleX: progress }}
        className="scroll-progress"
        aria-hidden="true"
      />
      <Navbar />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      {/* داک شناور دسترسی سریع — Magic UI Dock */}
      <QuickDock />
      {/* مودال رزرو نوبت — سراسری؛ از همه دکمه‌های رزرو سایت باز می‌شود */}
      <BookingModal />
    </MotionConfig>
  );
}
