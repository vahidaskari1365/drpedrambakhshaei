"use client";

import { motion } from "framer-motion";

/** ترنزیشن سینمایی ورود بین روتهای واقعی (هر ناوبری دوباره مونت می‌شود) */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.996 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
