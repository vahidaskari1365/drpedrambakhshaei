import { NextResponse } from "next/server";

/* اندپوینت موقت برای تشخیص IP خروجی سرور (برای وایت‌لیست SMS.ir) — بعد از استفاده حذف می‌شود */
export const dynamic = "force-dynamic";

async function grab(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!r.ok) return null;
    const t = (await r.text()).trim();
    try {
      const j = JSON.parse(t);
      return typeof j.ip === "string" ? j.ip : null;
    } catch {
      return /^\d+\.\d+\.\d+\.\d+$/.test(t) ? t : null;
    }
  } catch {
    return null;
  }
}

export async function GET() {
  const [v4, v6, v4b] = await Promise.all([
    grab("https://api.ipify.org?format=json"),
    grab("https://api6.ipify.org?format=json"),
    grab("https://checkip.amazonaws.com"),
  ]);
  return NextResponse.json(
    { egress: { ipv4: v4 ?? v4b, ipv6: v6 }, at: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
