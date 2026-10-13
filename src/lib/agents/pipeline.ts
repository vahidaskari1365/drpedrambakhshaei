/**
 * خط‌لوله ایجنت‌ها — ترتیب اجرا: محتوا → AEO (قلاب بعد از انتشار) → GEO → GSC
 * هر ایجنت مستقل ثبت می‌شود؛ شکست یکی بقیه را متوقف نمی‌کند (best-effort زنجیره)
 */
import { db } from "@/lib/db";
import { getAgentsConfig, runAgent, type AgentId } from "./runner";

/** آخرین اجرای موفق یک ایجنت — برای گیت هفتگی */
async function lastSuccessAt(agent: AgentId): Promise<Date | null> {
  const row = await db.agentRun.findFirst({
    where: { agent, status: "success" },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });
  return row?.createdAt ?? null;
}

export interface PipelineOptions {
  only?: AgentId[]; // فقط این‌ها
  skipWeeklyGate?: boolean; // GEO/GSC حتی اگر امروز نوبت‌شان نباشد
}

export async function runPipeline(trigger: "schedule" | "manual", opts: PipelineOptions = {}) {
  const config = await getAgentsConfig();
  const only = opts.only;
  const want = (a: AgentId) => config.enabled[a] && (!only || only.includes(a));
  const results: { agent: AgentId; status: string; summary: string }[] = [];

  /* ۱) ایجنت محتوا — تولید و انتشار مقاله روز */
  if (want("content")) {
    const { runContentAgent } = await import("./content-agent");
    const r = await runAgent("content", trigger, runContentAgent);
    results.push({ agent: "content", ...pick(r) });

    /* قلاب بعد از انتشار — AEO روی مقاله تازه و بایگانی */
    if (r.status === "success" && config.enabled.aeo && (!only || only.includes("aeo"))) {
      const { runAeoAgent } = await import("./aeo-agent");
      const a = await runAgent("aeo", "hook", () => runAeoAgent(r.details));
      results.push({ agent: "aeo", ...pick(a) });
    }
  } else if (want("aeo")) {
    const { runAeoAgent } = await import("./aeo-agent");
    const a = await runAgent("aeo", trigger, () => runAeoAgent({}));
    results.push({ agent: "aeo", ...pick(a) });
  }

  /* ۲) GEO — هفتگی یا اجباری */
  if (want("geo") && (opts.skipWeeklyGate || isDue(config.geoWeekday, await lastSuccessAt("geo")))) {
    const { runGeoAgent } = await import("./geo-agent");
    const geo = await runAgent("geo", trigger, runGeoAgent);
    results.push({ agent: "geo", ...pick(geo) });
  }

  /* ۳) GSC — هفتگی یا اجباری */
  if (want("gsc") && (opts.skipWeeklyGate || isDue(config.gscWeekday, await lastSuccessAt("gsc")))) {
    const { runGscAgent } = await import("./gsc-agent");
    const gsc = await runAgent("gsc", trigger, runGscAgent);
    results.push({ agent: "gsc", ...pick(gsc) });
  }

  return results;
}

function pick(r: { status: string; summary: string }) {
  return { status: r.status, summary: r.summary };
}

/** نوبت هفتگی: امروز روز تعیین‌شده است و امروز هنوز موفق اجرا نشده */
function isDue(weekday: number, lastSuccess: Date | null): boolean {
  const now = tehranNow();
  if (now.weekday !== weekday) return false;
  if (!lastSuccess) return true;
  const last = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran" }).format(lastSuccess);
  return last !== now.date;
}

/** زمان فعلی تهران — ساعت، روز هفته و تاریخ ISO (en-CA = yyyy-mm-dd) */
export function tehranNow(): { hour: number; minute: number; weekday: number; date: string } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    hour: "numeric",
    minute: "numeric",
    weekday: "short",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    hour: parseInt(get("hour"), 10) % 24,
    minute: parseInt(get("minute"), 10),
    weekday: weekdayMap[get("weekday")] ?? 0,
    date: new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran" }).format(new Date()),
  };
}

/** آیا امروز (تهران) اجرای زمان‌بندی‌شده انجام شده؟ */
export async function scheduledTodayDone(agent: AgentId): Promise<boolean> {
  const { date } = tehranNow();
  const start = new Date(`${date}T00:00:00+03:30`);
  const row = await db.agentRun.findFirst({
    where: { agent, trigger: "schedule", status: { not: "failed" }, createdAt: { gte: start } },
    select: { id: true },
  });
  return Boolean(row);
}
