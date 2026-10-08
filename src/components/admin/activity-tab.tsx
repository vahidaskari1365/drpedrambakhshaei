"use client";

/** تب «فعالیت» — تایم‌لاین تغییرات محتوا و درخواست‌ها */
import * as React from "react";
import { motion } from "framer-motion";
import { PencilLine, RotateCcw, UserCheck, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, faDate, faTimeAgo, type Overview } from "./shared";

const KIND_META: Record<string, { icon: typeof PencilLine; cls: string; label: string }> = {
  "content.update": { icon: PencilLine, cls: "bg-teal-300/12 text-teal-200", label: "ویرایش محتوا" },
  "content.reset": { icon: RotateCcw, cls: "bg-gold/12 text-amber-200", label: "بازنشانی" },
  "request.status": { icon: UserCheck, cls: "bg-violet-300/12 text-violet-200", label: "پیگیری درخواست" },
};

export function ActivityTab({ overview }: { overview: Overview | null }) {
  const [rows, setRows] = React.useState<Overview["activity"] | null>(overview?.activity ?? null);

  React.useEffect(() => {
    api<{ activity: Overview["activity"] }>("/api/admin/activity?limit=80")
      .then((r) => setRows(r.activity))
      .catch(() => setRows(overview?.activity ?? []));
  }, [overview?.activity]);

  return (
    <div>
      {rows === null ? (
        <p className="p-8 text-center text-sm text-white/40">در حال بارگذاری...</p>
      ) : rows.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <History className="mx-auto mb-3 h-8 w-8 text-white/25" />
          <p className="text-sm text-white/55">هنوز فعالیتی ثبت نشده — اولین ویرایش را در تب «محتوای سایت» انجام دهید.</p>
        </div>
      ) : (
        <div className="relative space-y-3 before:absolute before:right-[22px] before:top-2 before:h-[calc(100%-24px)] before:w-px before:bg-white/8">
          {rows.map((a, i) => {
            const meta = KIND_META[a.kind] ?? { icon: History, cls: "bg-white/10 text-white/60", label: a.kind };
            const Icon = meta.icon;
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
                className="relative flex items-start gap-3.5 pr-1"
              >
                <span className={cn("relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", meta.cls)}>
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div className="flex-1 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[12.5px] font-bold text-white/85">{a.summary}</p>
                    <span className="text-[10.5px] text-white/35" title={faDate(a.createdAt, true)}>
                      {faTimeAgo(a.createdAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10.5px] text-white/35">
                    {meta.label} · <span dir="ltr">{a.entity}</span>
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
