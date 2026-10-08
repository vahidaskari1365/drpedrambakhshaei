"use client";

/** تب «درخواست‌ها» — مدیریت درخواست‌های رزرو/مشاوره فرم تماس سایت */
import * as React from "react";
import { Phone, Loader2, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, faNum, faDate } from "./shared";
import type { ContactRequestRow } from "./shared";

const STATUS: Record<string, { label: string; cls: string }> = {
  new: { label: "جدید", cls: "bg-teal-300/15 text-teal-200 border-teal-300/30" },
  contacted: { label: "تماس گرفته شد", cls: "bg-gold/15 text-amber-200 border-gold/30" },
  done: { label: "انجام شد", cls: "bg-white/10 text-white/80 border-white/20" },
  archived: { label: "بایگانی", cls: "bg-white/5 text-white/40 border-white/10" },
};

export function RequestsTab({
  toast,
  refreshKey,
}: {
  toast: (msg: string, kind?: "ok" | "err") => void;
  refreshKey?: number;
}) {
  const [rows, setRows] = React.useState<ContactRequestRow[] | null>(null);
  const [filter, setFilter] = React.useState<string>("all");
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      const res = await api<{ requests: ContactRequestRow[] }>("/api/admin/requests");
      setRows(res.requests);
    } catch (e) {
      toast(e instanceof Error ? e.message : "بارگذاری ناموفق بود", "err");
      setRows([]);
    }
  }, [toast]);

  React.useEffect(() => {
    load();
  }, [load, refreshKey]);

  const setStatus = async (id: string, status: string) => {
    setBusyId(id);
    const prev = rows;
    setRows((r) => r?.map((x) => (x.id === id ? { ...x, status, statusLabel: STATUS[status].label } : x)) ?? null);
    try {
      await api("/api/admin/requests", { method: "PATCH", body: JSON.stringify({ id, status }) });
      toast("وضعیت درخواست به‌روزرسانی شد", "ok");
    } catch (e) {
      setRows(prev ?? null);
      toast(e instanceof Error ? e.message : "به‌روزرسانی ناموفق بود", "err");
    } finally {
      setBusyId(null);
    }
  };

  const filtered = rows?.filter((r) => filter === "all" || r.status === filter) ?? [];

  return (
    <div>
      {/* فیلترها */}
      <div className="mb-4 flex flex-wrap gap-2">
        {[["all", "همه"], ...Object.entries(STATUS)].map(([id, label]) => {
          const count = id === "all" ? rows?.length ?? 0 : rows?.filter((r) => r.status === id).length ?? 0;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-bold transition-colors cursor-pointer",
                filter === id ? "border-teal-300/40 bg-teal-300/10 text-teal-100" : "border-white/10 text-white/50 hover:bg-white/5"
              )}
            >
              {id === "new" && <Inbox className="h-3 w-3" />}
              {typeof label === "string" ? label : (label as { label: string }).label}
              <span className="rounded-full bg-white/10 px-1.5 text-[10px] tabular-nums">{faNum(count)}</span>
            </button>
          );
        })}
      </div>

      {rows === null ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-teal-300/60" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <Inbox className="mx-auto mb-3 h-8 w-8 text-white/25" />
          <p className="text-sm text-white/55">درخواستی در این وضعیت نیست.</p>
          <p className="mt-1 text-[11px] text-white/35">درخواست‌های فرم «تماس» سایت همین‌جا نمایش داده می‌شوند.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <article key={r.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.05]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[14px] font-black text-white">{r.name}</h3>
                    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold", STATUS[r.status]?.cls)}>
                      {STATUS[r.status]?.label ?? r.status}
                    </span>
                    <span className="rounded-full bg-white/6 px-2 py-0.5 text-[10px] font-bold text-white/50">{r.service}</span>
                  </div>
                  {r.message && <p className="mt-2 max-w-2xl text-[12.5px] leading-6 text-white/60">{r.message}</p>}
                  <p className="mt-2 text-[11px] text-white/35">{faDate(r.createdAt, true)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${r.phone}`}
                    dir="ltr"
                    className="flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-[12px] font-black tabular-nums text-teal-200 hover:bg-teal-300/10 cursor-pointer"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {r.phone}
                  </a>
                  <select
                    value={r.status}
                    disabled={busyId === r.id}
                    onChange={(e) => setStatus(r.id, e.target.value)}
                    aria-label="تغییر وضعیت"
                    className="h-9 rounded-xl border border-white/15 bg-[oklch(0.2_0.025_205)] px-2.5 text-[11.5px] font-bold text-white/80 outline-none cursor-pointer"
                  >
                    {Object.entries(STATUS).map(([id, s]) => (
                      <option key={id} value={id}>{s.label}</option>
                    ))}
                  </select>
                  {busyId === r.id && <Loader2 className="h-4 w-4 animate-spin text-teal-300" />}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
