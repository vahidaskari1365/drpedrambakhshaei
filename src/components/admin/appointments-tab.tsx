"use client";

/**
 * تب «نوبت‌ها» در پنل ادمین — CRM نوبت‌دهی سایت
 * لیست نوبت‌های ثبت‌شده از /appointment + تغییر وضعیت (انجام شد/لغو/عدم حضور)
 * + KPI امروز، تاییدشده، انجام‌شده، لغوشده
 */
import * as React from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Loader2,
  MessageSquare,
  MessageSquareOff,
  RefreshCw,
  XCircle,
  UserX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api, faNum, faTimeAgo } from "./shared";
import { Kpi } from "./kpi";

type Appt = {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  note: string;
  status: string;
  patientSmsSent: boolean;
  adminSmsSent: boolean;
  createdAt: string;
};

type Payload = {
  items: Appt[];
  total: number;
  stats: { confirmed: number; done: number; cancelled: number; today: number };
};

const STATUS_LABEL: Record<string, string> = {
  confirmed: "تایید شده",
  done: "انجام شد",
  cancelled: "لغو شد",
  no_show: "عدم حضور",
};

const STATUS_STYLE: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-700",
  done: "bg-stone-200 text-stone-700",
  cancelled: "bg-rose-100 text-rose-700",
  no_show: "bg-amber-100 text-amber-700",
};

/** تاریخ شمسی سبک — همان فرمت UI سایت */
function faDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", { dateStyle: "full" }).format(new Date(`${iso}T00:00:00`));
  } catch {
    return iso;
  }
}

export function AppointmentsTab({
  toast,
  refreshKey,
}: {
  toast: (msg: string, kind?: "ok" | "err") => void;
  refreshKey?: number;
}) {
  const [data, setData] = React.useState<Payload | null>(null);
  const [status, setStatus] = React.useState("all");
  const [loading, setLoading] = React.useState(true);
  const [patching, setPatching] = React.useState("");

  const load = React.useCallback(
    (st: string) => {
      return api<Payload>(`/api/admin/appointments?status=${st}`)
        .then((d) => {
          setData(d);
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          toast(e instanceof Error ? e.message : "خطا در بارگذاری نوبت‌ها", "err");
        });
    },
    [toast],
  );

  React.useEffect(() => {
    let alive = true;
    api<Payload>(`/api/admin/appointments?status=${status}`)
      .then((d) => {
        if (alive) {
          setData(d);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (alive) {
          setLoading(false);
          toast(e instanceof Error ? e.message : "خطا در بارگذاری نوبت‌ها", "err");
        }
      });
    return () => {
      alive = false;
    };
  }, [status, refreshKey, toast]);

  const patch = async (id: string, next: string) => {
    setPatching(id + next);
    try {
      await api("/api/admin/appointments", {
        method: "PATCH",
        body: JSON.stringify({ id, status: next }),
      });
      toast("وضعیت نوبت به‌روزرسانی شد", "ok");
      await load(status);
    } catch (e) {
      toast(e instanceof Error ? e.message : "خطا در تغییر وضعیت", "err");
    } finally {
      setPatching("");
    }
  };

  const s = data?.stats;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-black text-white">
          <CalendarCheck className="h-5 w-5 text-emerald-300" />
          نوبت‌های رزرو‌شده از سایت
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="فیلتر وضعیت"
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-[12.5px] font-bold text-white outline-none"
          >
            <option value="all">همه</option>
            <option value="confirmed">تایید شده</option>
            <option value="done">انجام شد</option>
            <option value="cancelled">لغو شد</option>
            <option value="no_show">عدم حضور</option>
          </select>
          <button
            type="button"
            onClick={() => load(status)}
            aria-label="به‌روزرسانی"
            className="rounded-xl border border-white/15 bg-white/5 p-2.5 text-white/70 transition hover:text-white"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* KPIها */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon={CalendarClock} label="نوبت امروز" value={s ? faNum(s.today) : "—"} />
        <Kpi icon={CheckCircle2} label="تاییدشده (فعال)" value={s ? faNum(s.confirmed) : "—"} />
        <Kpi icon={UserX} label="انجام‌شده" value={s ? faNum(s.done) : "—"} />
        <Kpi icon={XCircle} label="لغوشده" value={s ? faNum(s.cancelled) : "—"} />
      </div>

      {/* لیست */}
      {loading && !data ? (
        <p className="flex items-center justify-center gap-2 py-16 text-sm text-white/50">
          <Loader2 className="h-4 w-4 animate-spin" />
          در حال بارگذاری…
        </p>
      ) : !data || data.items.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/12 py-16 text-center text-sm text-white/40">
          هنوز نوبتی ثبت نشده است
        </p>
      ) : (
        <div className="space-y-3">
          {data.items.map((a, i) => (
            <motion.article
              key={a.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-[14.5px] font-black text-white">
                    {a.name}
                    <a href={`tel:${a.phone}`} dir="ltr" className="text-[13px] font-bold text-emerald-300 hover:text-emerald-200">
                      {a.phone}
                    </a>
                    <span className={cn("rounded-full px-2.5 py-1 text-[10.5px] font-black", STATUS_STYLE[a.status] ?? "bg-white/10 text-white/60")}>
                      {STATUS_LABEL[a.status] ?? a.status}
                    </span>
                  </p>
                  <p className="mt-1.5 text-[12.5px] leading-6 text-white/60">
                    {a.service} — <span className="font-bold text-white/80">{faDate(a.date)}</span> — ساعت <span dir="ltr" className="font-bold">{a.time}</span>
                  </p>
                  {a.note && <p className="mt-1 text-[11.5px] leading-5 text-white/40">یادداشت بیمار: {a.note}</p>}
                  <p className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-white/35">
                    <span>ثبت: {faTimeAgo(a.createdAt)}</span>
                    <span className={cn("inline-flex items-center gap-1", a.patientSmsSent ? "text-emerald-300/70" : "text-rose-300/60")}>
                      {a.patientSmsSent ? <MessageSquare className="h-3 w-3" /> : <MessageSquareOff className="h-3 w-3" />}
                      پیامک بیمار {a.patientSmsSent ? "ارسال شد" : "نرسید"}
                    </span>
                    <span className={cn("inline-flex items-center gap-1", a.adminSmsSent ? "text-emerald-300/70" : "text-rose-300/60")}>
                      {a.adminSmsSent ? <MessageSquare className="h-3 w-3" /> : <MessageSquareOff className="h-3 w-3" />}
                      پیامک مدیر {a.adminSmsSent ? "ارسال شد" : "نرسید"}
                    </span>
                  </p>
                </div>

                {a.status !== "done" && a.status !== "cancelled" && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => patch(a.id, "done")}
                      disabled={patching === a.id + "done"}
                      className="rounded-full bg-emerald-300 px-3.5 py-2 text-[11.5px] font-black text-[oklch(0.2_0.03_262)] transition hover:bg-emerald-200 disabled:opacity-50"
                    >
                      انجام شد
                    </button>
                    <button
                      type="button"
                      onClick={() => patch(a.id, "no_show")}
                      disabled={patching === a.id + "no_show"}
                      className="rounded-full border border-amber-300/40 px-3.5 py-2 text-[11.5px] font-black text-amber-200 transition hover:bg-amber-300/10 disabled:opacity-50"
                    >
                      عدم حضور
                    </button>
                    <button
                      type="button"
                      onClick={() => patch(a.id, "cancelled")}
                      disabled={patching === a.id + "cancelled"}
                      className="rounded-full border border-rose-300/40 px-3.5 py-2 text-[11.5px] font-black text-rose-200 transition hover:bg-rose-300/10 disabled:opacity-50"
                    >
                      لغو
                    </button>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
