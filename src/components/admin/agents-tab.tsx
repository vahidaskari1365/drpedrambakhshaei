"use client";

/**
 * تب ایجنت‌ها — کنترل‌.center مرکزی سیستم تولید و انتشار خودکار
 * وضعیت هر ایجنت، سوئیچ فعال/غیرفعال، اجرای دستی، پیکربندی ساعت/روز، تاریخچه اجرا
 */
import * as React from "react";
import { motion } from "framer-motion";
import {
  PenLine,
  MessageCircleQuestion,
  BrainCircuit,
  SearchCheck,
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Lightbulb,
  Clock,
  KeyRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api, faNum, faTimeAgo } from "./shared";

type Toast = (msg: string, kind?: "ok" | "err") => void;

interface AgentRunRow {
  id: string;
  agent: string;
  status: string;
  trigger: string;
  summary: string;
  durationMs: number;
  at: string;
}

interface StatusResponse {
  ok: boolean;
  config: {
    enabled: Record<string, boolean>;
    contentHour: number;
    geoWeekday: number;
    gscWeekday: number;
    autoPublish: boolean;
    zaiKeySet?: boolean;
    zaiKeyMasked?: string;
    zaiBaseUrl?: string;
  };
  agents: {
    agent: string;
    lastRun: { status: string; summary: string; at: string; durationMs: number; trigger: string } | null;
    success7d: number;
    failed7d: number;
  }[];
  history: AgentRunRow[];
  topics: { total: number; used: number; remaining: number };
  tehranNow: { hour: number; minute: number; weekday: number; date: string };
}

const AGENT_META: Record<string, { label: string; desc: string; icon: typeof PenLine; tint: string }> = {
  content: {
    label: "ایجنت محتوا",
    desc: "هر روز ۰۷:۰۰ یک مقاله ۱۰۰۰+ کلمه‌ای یکتا با کاور اختصاصی منتشر می‌کند",
    icon: PenLine,
    tint: "text-emerald-300 border-emerald-300/25 bg-emerald-300/5",
  },
  aeo: {
    label: "ایجنت AEO",
    desc: "پاسخ‌های سریع و FAQ را ممیزی و مقاله‌های ضعیف را ترمیم می‌کند",
    icon: MessageCircleQuestion,
    tint: "text-amber-300 border-amber-300/25 bg-amber-300/5",
  },
  geo: {
    label: "ایجنت GEO",
    desc: "llms.txt می‌سازد، موجودیت‌ها و نقل‌پذیری برای موتورهای AI را کنترل می‌کند",
    icon: BrainCircuit,
    tint: "text-violet-300 border-violet-300/25 bg-violet-300/5",
  },
  gsc: {
    label: "ایجنت Search Console",
    desc: "نقشه سایت را ثبت، کوئری‌ها را پایش و صفحات را برای ایندکس پیگیری می‌کند",
    icon: SearchCheck,
    tint: "text-emerald-300 border-emerald-300/25 bg-emerald-300/5",
  },
};

const WEEKDAYS = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];

const STATUS_META: Record<string, { icon: typeof CheckCircle2; cls: string; label: string }> = {
  success: { icon: CheckCircle2, cls: "text-emerald-300", label: "موفق" },
  failed: { icon: XCircle, cls: "text-red-300", label: "ناموفق" },
  running: { icon: Loader2, cls: "text-emerald-300 animate-spin", label: "در حال اجرا" },
  skipped: { icon: MinusCircle, cls: "text-zinc-400", label: "رد شد" },
};

export function AgentsTab({ toast }: { toast: Toast }) {
  const [data, setData] = React.useState<StatusResponse | null>(null);
  const [busy, setBusy] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  const [zaiKeyInput, setZaiKeyInput] = React.useState("");
  const [zaiBaseUrlInput, setZaiBaseUrlInput] = React.useState("");

  const load = React.useCallback(async () => {
    try {
      const res = await api<StatusResponse>("/api/agents/status");
      setData(res);
      setZaiBaseUrlInput(res.config.zaiBaseUrl || "");
    } catch (e) {
      toast(e instanceof Error ? e.message : "خطای دریافت وضعیت", "err");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    const t = setInterval(() => void load(), 30_000);
    // بارگذاری اولیه به‌صورت async — خارج از بدنه سنکرون اثر
    const first = setTimeout(() => void load(), 0);
    return () => {
      clearInterval(t);
      clearTimeout(first);
    };
  }, [load]);

  const run = async (agent: string) => {
    setBusy(agent);
    toast(agent === "pipeline" ? "خط‌لوله کامل آغاز شد — چند دقیقه طول می‌کشد…" : `اجرای ${AGENT_META[agent]?.label}…`, "ok");
    try {
      const res = await api<{ results: { agent: string; status: string; summary: string }[] }>("/api/agents/run", {
        method: "POST",
        body: JSON.stringify({ agent: agent === "pipeline" ? undefined : agent, skipWeeklyGate: true }),
      });
      for (const r of res.results) {
        toast(`${AGENT_META[r.agent]?.label ?? r.agent}: ${r.summary}`, r.status === "success" ? "ok" : "err");
      }
    } catch (e) {
      toast(e instanceof Error ? e.message : "اجرا ناموفق بود", "err");
    } finally {
      setBusy("");
      void load();
    }
  };

  const patchConfig = async (patch: Record<string, unknown>) => {
    try {
      await api("/api/agents/config", { method: "POST", body: JSON.stringify(patch) });
      await load();
      toast("تنظیمات ذخیره شد", "ok");
    } catch (e) {
      toast(e instanceof Error ? e.message : "ذخیره ناموفق", "err");
    }
  };

  /** ذخیره کلید Z.AI — فقط وقتی چیزی تایپ شده ارسال می‌شود */
  const saveZaiKey = async () => {
    const key = zaiKeyInput.trim();
    if (!key) {
      toast("اول کلید را در کادر بچسبانید", "err");
      return;
    }
    setBusy("zai-key");
    try {
      const patch: Record<string, unknown> = { zaiKey: key };
      if (zaiBaseUrlInput.trim()) patch.zaiBaseUrl = zaiBaseUrlInput.trim();
      await api("/api/agents/config", { method: "POST", body: JSON.stringify(patch) });
      setZaiKeyInput("");
      await load();
      toast("کلید Z.AI ذخیره شد — حالا «اجرای کامل خط‌لوله» را بزنید", "ok");
    } catch (e) {
      toast(e instanceof Error ? e.message : "ذخیره کلید ناموفق بود", "err");
    } finally {
      setBusy("");
    }
  };

  if (loading || !data) {
    return (
      <div className="flex h-64 items-center justify-center gap-3 text-zinc-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm font-bold">در حال دریافت وضعیت ایجنت‌ها…</span>
      </div>
    );
  }

  const { config, agents, history, topics, tehranNow } = data;

  return (
    <div className="space-y-6">
      {/* سربرگ — وضعیت زنده */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-3">
          <span className={cn("flex h-2.5 w-2.5 rounded-full", config.autoPublish ? "bg-emerald-400 animate-pulse" : "bg-zinc-500")} />
          <div>
            <p className="text-sm font-black text-white">
              اتوماسیون {config.autoPublish ? "فعال" : "متوقف"}
            </p>
            <p className="text-[11px] text-zinc-400">
              تهران — {faNum(tehranNow.hour)}:{String(tehranNow.minute).padStart(2, "0")} ({WEEKDAYS[tehranNow.weekday]}) · انتشار روزانه ساعت {faNum(config.contentHour)}:۰۰
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => void patchConfig({ autoPublish: !config.autoPublish })}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[12px] font-bold text-zinc-200 transition hover:bg-white/10"
          >
            {config.autoPublish ? "توقف موقت" : "فعال‌سازی"}
          </button>
          <button
            onClick={() => void run("pipeline")}
            disabled={busy !== ""}
            className="flex items-center gap-2 rounded-full bg-gradient-to-l from-emerald-500 to-emerald-400 px-4 py-2 text-[12px] font-black text-emerald-950 transition hover:brightness-110 disabled:opacity-50"
          >
            {busy === "pipeline" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            اجرای کامل خط‌لوله
          </button>
        </div>
      </div>

      {/* کارت‌های ایجنت */}
      <div className="grid gap-4 sm:grid-cols-2">
        {agents.map((a, i) => {
          const meta = AGENT_META[a.agent] ?? AGENT_META.content;
          const Icon = meta.icon;
          const enabled = config.enabled[a.agent] ?? false;
          return (
            <motion.div
              key={a.agent}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", meta.tint)}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[13.5px] font-black text-white">{meta.label}</p>
                    <p className="mt-0.5 max-w-[26ch] text-[11px] leading-5 text-zinc-400">{meta.desc}</p>
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={enabled}
                  aria-label={`${enabled ? "غیرفعال‌سازی" : "فعال‌سازی"} ${meta.label}`}
                  onClick={() => void patchConfig({ enabled: { ...config.enabled, [a.agent]: !enabled } })}
                  className={cn(
                    "relative h-6 w-11 shrink-0 rounded-full transition",
                    enabled ? "bg-emerald-400/90" : "bg-zinc-600/60"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                      enabled ? "right-0.5" : "right-[22px]"
                    )}
                  />
                </button>
              </div>

              <div className="mt-3 rounded-xl border border-white/5 bg-black/20 p-3">
                {a.lastRun ? (
                  <p className="line-clamp-2 text-[11.5px] leading-5 text-zinc-300">
                    <span className={cn("font-bold", STATUS_META[a.lastRun.status]?.cls ?? "text-zinc-300")}>
                      {STATUS_META[a.lastRun.status]?.label ?? a.lastRun.status}:
                    </span>{" "}
                    {a.lastRun.summary || "—"}
                    <span className="text-zinc-500"> · {faTimeAgo(a.lastRun.at)}</span>
                  </p>
                ) : (
                  <p className="text-[11.5px] text-zinc-500">هنوز اجرا نشده است</p>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-3 text-[11px] text-zinc-400">
                  <span>۷ روز: <b className="text-emerald-300">{faNum(a.success7d)}</b> موفق</span>
                  {a.failed7d > 0 && <span><b className="text-red-300">{faNum(a.failed7d)}</b> ناموفق</span>}
                </div>
                <button
                  onClick={() => void run(a.agent)}
                  disabled={busy !== ""}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11.5px] font-bold text-zinc-200 transition hover:bg-white/10 disabled:opacity-50"
                >
                  {busy === a.agent ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3 w-3" />}
                  اجرا
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* بانک ایده + پیکربندی */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-300" />
            <p className="text-[13px] font-black text-white">بانک ایده‌های محتوا</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-l from-amber-400 to-amber-300"
              style={{ width: `${topics.total ? Math.round((topics.used / topics.total) * 100) : 0}%` }}
            />
          </div>
          <p className="mt-2 text-[11.5px] text-zinc-400">
            {faNum(topics.used)} استفاده‌شده از {faNum(topics.total)} ایده — {faNum(topics.remaining)} موضوع آماده منتشر
            {topics.remaining === 0 && <span className="text-amber-300"> · ایجنت در اجرای بعدی ایده‌های تازه با جست‌وجوی وب تولید می‌کند</span>}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-300" />
            <p className="text-[13px] font-black text-white">زمان‌بندی هفتگی</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] text-zinc-400">ساعت انتشار مقاله (تهران)</span>
              <input
                type="number"
                min={0}
                max={23}
                value={config.contentHour}
                onChange={(e) => {
                  const v = Math.min(23, Math.max(0, Number(e.target.value) || 0));
                  void patchConfig({ contentHour: v });
                }}
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-[13px] font-bold text-white outline-none focus:border-emerald-400/50"
              />
            </label>
            <label className="block">
              <span className="text-[11px] text-zinc-400">روز اجرای GEO</span>
              <select
                value={config.geoWeekday}
                onChange={(e) => void patchConfig({ geoWeekday: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-[13px] font-bold text-white outline-none focus:border-emerald-400/50"
              >
                {WEEKDAYS.map((w, i) => (
                  <option key={w} value={i}>{w}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* کلید هوش مصنوعی Z.AI */}
      <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-amber-300" />
            <p className="text-[13px] font-black text-white">کلید هوش مصنوعی (Z.AI)</p>
            {config.zaiKeySet ? (
              <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-300">
                ثبت شده — {config.zaiKeyMasked}
              </span>
            ) : (
              <span className="rounded-full border border-red-300/25 bg-red-300/10 px-2.5 py-0.5 text-[10.5px] font-bold text-red-300">
                ثبت نشده — ایجنت‌ها کار نمی‌کنند!
              </span>
            )}
          </div>
          {config.zaiKeySet && (
            <button
              onClick={() => void patchConfig({ zaiKey: "__CLEAR__" })}
              disabled={busy !== ""}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-zinc-300 transition hover:bg-white/10 disabled:opacity-50"
            >
              حذف کلید
            </button>
          )}
        </div>
        <p className="mt-2 text-[11.5px] leading-5 text-zinc-400">
          کلید API از حساب <span className="font-bold text-zinc-200">z.ai</span> (بخش API Keys) را اینجا بچسبانید تا مقاله‌های خودکار
          ساخته شوند. پس از ذخیره، دکمه «اجرای کامل خط‌لوله» را بزنید تا اولین مقاله منتشر شود.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input
            type="password"
            dir="ltr"
            autoComplete="off"
            value={zaiKeyInput}
            onChange={(e) => setZaiKeyInput(e.target.value)}
            placeholder={config.zaiKeySet ? "کلید جدید (برای تغییر)" : "sk-... / کلید API خود را بچسبانید"}
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-[12.5px] text-white placeholder:text-zinc-500 outline-none focus:border-amber-300/50"
          />
          <input
            type="text"
            dir="ltr"
            autoComplete="off"
            value={zaiBaseUrlInput}
            onChange={(e) => setZaiBaseUrlInput(e.target.value)}
            placeholder="آدرس API (پیش‌فرض: https://api.z.ai/api/paas/v4)"
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-[12.5px] text-white placeholder:text-zinc-500 outline-none focus:border-amber-300/50"
          />
          <button
            onClick={() => void saveZaiKey()}
            disabled={busy !== "" || !zaiKeyInput.trim()}
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-l from-amber-500 to-amber-400 px-4 py-2 text-[12.5px] font-black text-amber-950 transition hover:brightness-110 disabled:opacity-50"
          >
            {busy === "zai-key" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}
            ذخیره کلید
          </button>
        </div>
      </div>

      {/* تاریخچه اجرا */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="mb-3 text-[13px] font-black text-white">تاریخچه اجرا (۲۰ اجرای اخیر)</p>
        {history.length === 0 ? (
          <p className="py-6 text-center text-[12px] text-zinc-500">هنوز هیچ اجرایی ثبت نشده — دکمه «اجرای کامل خط‌لوله» را بزنید.</p>
        ) : (
          <div className="max-h-96 space-y-2 overflow-y-auto pr-1 scroll-smooth">
            {history.map((h) => {
              const st = STATUS_META[h.status] ?? STATUS_META.skipped;
              const StIcon = st.icon;
              return (
                <div key={h.id} className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/20 p-3">
                  <StIcon className={cn("mt-0.5 h-4 w-4 shrink-0", st.cls)} />
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-baseline gap-x-2 text-[12px] font-bold text-zinc-200">
                      {AGENT_META[h.agent]?.label ?? h.agent}
                      <span className="text-[10.5px] font-normal text-zinc-500">
                        {h.trigger === "schedule" ? "زمان‌بندی" : h.trigger === "hook" ? "قلاب" : "دستی"} · {faTimeAgo(h.at)} · {(h.durationMs / 1000).toLocaleString("fa-IR", { maximumFractionDigits: 1 })} ثانیه
                      </span>
                    </p>
                    <p className="mt-1 break-words text-[11.5px] leading-5 text-zinc-400">{h.summary || "—"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
