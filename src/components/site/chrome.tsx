"use client";

import * as React from "react";
import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

/**
 * پوسته مشترک همه صفحات — نوبار، فوتر، نوار پیشرفت اسکرول
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
    </MotionConfig>
  );
}
