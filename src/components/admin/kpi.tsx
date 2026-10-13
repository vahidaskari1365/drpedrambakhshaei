"use client";

/**
 * کارت KPI مشترک پنل — در داشبورد و تب بازدیدها استفاده می‌شود
 */
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Kpi({
  icon: Icon,
  label,
  value,
  sub,
  tone = "teal",
  delay = 0,
}: {
  icon: typeof import("lucide-react").LayoutDashboard;
  label: string;
  value: string;
  sub?: string;
  tone?: "teal" | "gold" | "violet";
  delay?: number;
}) {
  const tones = {
    teal: "from-teal-400/25 to-teal-400/5 text-teal-200",
    gold: "from-gold/25 to-gold/5 text-amber-200",
    violet: "from-violet-400/25 to-violet-400/5 text-violet-200",
  } as const;
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className="glass-dark relative overflow-hidden rounded-3xl p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold text-white/45">{label}</p>
          <p className="mt-1.5 text-2xl font-black tabular-nums text-white">{value}</p>
          {sub && <p className="mt-0.5 text-[10.5px] text-white/35">{sub}</p>}
        </div>
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br", tones[tone])}>
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
    </motion.div>
  );
}
