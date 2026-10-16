/**
 * رانر ایجنت‌ها — دفتر اجرا (job history) + تنظیمات + خط‌لوله
 *
 * الگوهای OpenClaw که اینجا پیاده شده:
 *  - Automations: هر اجرا ایزوله، با سابقه کامل در AgentRun
 *  - idempotency: قفل حافظه‌ای در برابر اجرای همزمان دوبار
 *  - best-effort recording: خطای ایجنت هرگز فرآیند را نمی‌کشد
 */
import { db } from "@/lib/db";
import { ensureZaiConfig, friendlyAgentError } from "./zai-config";

export type AgentId = "content" | "aeo" | "geo" | "gsc";

export interface AgentResult {
  summary: string;
  details?: Record<string, unknown>;
}

export interface AgentsConfig {
  enabled: Record<AgentId, boolean>;
  contentHour: number; // ساعت تهران برای ایجنت محتوا
  geoWeekday: number; // 0=یکشنبه ... 6=شنبه — روز اجرای هفتگی GEO
  gscWeekday: number;
  autoPublish: boolean;
  /** کلید Z.AI — از پنل ادمین ثبت می‌شود؛ هرگز به کلاینت فرستاده نمی‌شود */
  zaiKey?: string;
  /** اختیاری — نقطه پایانی سازگار با OpenAI (پیش‌فرض: api.z.ai/api/paas/v4) */
  zaiBaseUrl?: string;
}

export const DEFAULT_CONFIG: AgentsConfig = {
  enabled: { content: true, aeo: true, geo: true, gsc: true },
  contentHour: 7,
  geoWeekday: 3, // چهارشنبه
  gscWeekday: 6, // شنبه
  autoPublish: true,
};

const CONFIG_ID = "agents";

/* ───────────────── تنظیمات ───────────────── */

export async function getAgentsConfig(): Promise<AgentsConfig> {
  try {
    const row = await db.agentConfig.findUnique({ where: { id: CONFIG_ID } });
    if (!row) return { ...DEFAULT_CONFIG };
    const parsed = JSON.parse(row.data) as Partial<AgentsConfig>;
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      enabled: { ...DEFAULT_CONFIG.enabled, ...(parsed.enabled ?? {}) },
    };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export async function saveAgentsConfig(patch: Partial<AgentsConfig>): Promise<AgentsConfig> {
  const current = await getAgentsConfig();
  const next: AgentsConfig = {
    ...current,
    ...patch,
    enabled: { ...current.enabled, ...(patch.enabled ?? {}) },
  };
  const json = JSON.stringify(next);
  await db.agentConfig.upsert({ where: { id: CONFIG_ID }, update: { data: json }, create: { id: CONFIG_ID, data: json } });
  return next;
}

/** نسخه امن برای کلاینت — کلید هرگز لو نمی‌رود، فقط وضعیت و ماسک */
export function sanitizeAgentsConfig(config: AgentsConfig): AgentsConfig & { zaiKeySet: boolean; zaiKeyMasked: string } {
  const key = config.zaiKey ?? "";
  const masked = key ? `${key.slice(0, 3)}…${key.slice(-4)}` : "";
  const { zaiKey: _k, ...rest } = config;
  return { ...rest, zaiKeySet: key.length > 0, zaiKeyMasked: masked };
}

/* ───────────────── قفل ضد اجرای همزمان ───────────────── */

const g = globalThis as unknown as { __agentLocks?: Set<string> };
g.__agentLocks ??= new Set<string>();

function acquire(key: string): boolean {
  if (g.__agentLocks!.has(key)) return false;
  g.__agentLocks!.add(key);
  return true;
}
function release(key: string) {
  g.__agentLocks!.delete(key);
}

/* ───────────────── اجرا با دفتر ───────────────── */

export async function runAgent(
  agent: AgentId,
  trigger: "schedule" | "manual" | "hook",
  fn: () => Promise<AgentResult>
): Promise<{ id: string; status: string; summary: string; details: Record<string, unknown> }> {
  if (!acquire(agent)) {
    return { id: "", status: "skipped", summary: "اجرای قبلی همین ایجنت هنوز در جریان است", details: {} };
  }
  const startedAt = Date.now();
  const row = await db.agentRun.create({
    data: { agent, status: "running", trigger, summary: "", details: "{}" },
  });
  try {
    /* کلید Z.AI از تنظیمات پنل ← فایل SDK (اگر تغییر کرده باشد) */
    await ensureZaiConfig();
    const result = await fn();
    const durationMs = Date.now() - startedAt;
    const details = JSON.stringify(result.details ?? {});
    await db.agentRun.update({
      where: { id: row.id },
      data: { status: "success", summary: result.summary, details, durationMs },
    });
    return { id: row.id, status: "success", summary: result.summary, details: result.details ?? {} };
  } catch (e) {
    const durationMs = Date.now() - startedAt;
    const raw = e instanceof Error ? e.message : String(e);
    const message = friendlyAgentError(raw);
    console.error(`[agents:${agent}] failed:`, e);
    await db.agentRun.update({
      where: { id: row.id },
      data: { status: "failed", summary: message.slice(0, 500), details: "{}", durationMs },
    }).catch(() => {});
    return { id: row.id, status: "failed", summary: message, details: {} };
  } finally {
    release(agent);
  }
}

/* ───────────────── وضعیت برای داشبورد ───────────────── */

export interface AgentStatusItem {
  agent: AgentId;
  lastRun: { status: string; summary: string; at: string; durationMs: number; trigger: string } | null;
  success7d: number;
  failed7d: number;
}

export async function getAgentsStatus() {
  const config = await getAgentsConfig();
  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const runs = await db.agentRun.findMany({ where: { createdAt: { gte: since } }, orderBy: { createdAt: "desc" } });
  const last = await db.agentRun.findMany({
    orderBy: { createdAt: "desc" },
    take: 40,
  });

  const agents: AgentStatusItem[] = (["content", "aeo", "geo", "gsc"] as AgentId[]).map((agent) => {
    const mine = runs.filter((r) => r.agent === agent);
    const lastRun = last.find((r) => r.agent === agent);
    return {
      agent,
      lastRun: lastRun
        ? {
            status: lastRun.status,
            summary: lastRun.summary,
            at: lastRun.createdAt.toISOString(),
            durationMs: lastRun.durationMs,
            trigger: lastRun.trigger,
          }
        : null,
      success7d: mine.filter((r) => r.status === "success").length,
      failed7d: mine.filter((r) => r.status === "failed").length,
    };
  });

  const [topicTotal, topicUsed] = await Promise.all([
    db.topicIdea.count(),
    db.topicIdea.count({ where: { used: true } }),
  ]);

  return {
    config,
    agents,
    history: last.slice(0, 20).map((r) => ({
      id: r.id,
      agent: r.agent,
      status: r.status,
      trigger: r.trigger,
      summary: r.summary,
      durationMs: r.durationMs,
      at: r.createdAt.toISOString(),
    })),
    topics: { total: topicTotal, used: topicUsed, remaining: topicTotal - topicUsed },
  };
}
