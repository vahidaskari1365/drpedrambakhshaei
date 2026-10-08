"use client";

/** ابزارهای مشترک پنل ادمین — کلید احراز، فراخوانی API، قالب‌بندی فارسی */

export function getKey(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_key") ?? "";
}

export function setKey(key: string) {
  sessionStorage.setItem("admin_key", key);
}

export function clearKey() {
  sessionStorage.removeItem("admin_key");
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": getKey(),
      ...(init?.headers ?? {}),
    },
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error || `خطای ${res.status.toLocaleString("fa-IR")}`);
  return data;
}

export const faNum = (n: number) => n.toLocaleString("fa-IR");

export function faDate(iso: string | Date, withTime = false): string {
  try {
    const d = typeof iso === "string" ? new Date(iso) : iso;
    return new Intl.DateTimeFormat(
      "fa-IR",
      withTime ? { dateStyle: "short", timeStyle: "short" } : { dateStyle: "medium" }
    ).format(d);
  } catch {
    return String(iso);
  }
}

export function faTimeAgo(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const diff = Date.now() - d.getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "همین حالا";
  if (m < 60) return `${faNum(m)} دقیقه پیش`;
  const h = Math.round(m / 60);
  if (h < 24) return `${faNum(h)} ساعت پیش`;
  const days = Math.round(h / 24);
  if (days < 30) return `${faNum(days)} روز پیش`;
  return faDate(d);
}

/* ─────────── اشکال داده API ─────────── */

export interface HealthCheck {
  id: string;
  label: string;
  pass: boolean;
  warn?: boolean;
  detail: string;
}

export interface Overview {
  generatedAt: string;
  counts: {
    services: number;
    works: number;
    gallery: number;
    reviews: number;
    faq: number;
    priceRows: number;
    priceExtras: number;
    blog: number;
    credentials: number;
    brands: number;
    images: number;
  };
  totalWords: number;
  volume: { key: string; label: string; words: number }[];
  overrides: { key: string; updatedAt: string; size: number }[];
  requests: {
    total: number;
    new: number;
    contacted: number;
    done: number;
    archived: number;
    byService: { name: string; count: number }[];
    latest: { name: string; service: string; createdAt: string }[];
  };
  series: { iso: string; label: string; requests: number; activity: number }[];
  health: { score: number; checks: HealthCheck[] };
  seo: { sitemapUrls: number; aiCrawlers: number; jsonLdTypes: string[]; healthScore: number };
  activity: { id: string; kind: string; entity: string; summary: string; createdAt: string }[];
}

export interface TestRow {
  id: string;
  group: string;
  label: string;
  pass: boolean;
  detail: string;
  ms: number;
}

export interface TestResult {
  rows: TestRow[];
  passed: number;
  total: number;
  score: number;
  ranAt: string;
}

export interface ContactRequestRow {
  id: string;
  name: string;
  phone: string;
  service: string;
  message: string;
  status: string;
  statusLabel: string;
  createdAt: string;
}
