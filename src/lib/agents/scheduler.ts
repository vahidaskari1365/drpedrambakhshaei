/**
 * زمان‌بند ایجنت‌ها — تیک هر ۶۰ ثانیه؛ انتشار روزانه ۰۷:۰۰ تهران (الگوی Automations/OpenClaw)
 * با گارد globalThis در برابر HMR و بوت دوباره؛ بدون وابستگی به cron خارجی
 */
import { db } from "@/lib/db";
import { getAgentsConfig, runAgent } from "./runner";
import { runPipeline, scheduledTodayDone, tehranNow } from "./pipeline";

const g = globalThis as unknown as { __agentScheduler?: NodeJS.Timeout };

const TICK_MS = 60_000;

async function tick() {
  try {
    /* پاک‌سازی اجراهای هنگ‌کرده — running بیشتر از ۳۰ دقیقه = شکست */
    await db.agentRun
      .updateMany({
        where: { status: "running", createdAt: { lt: new Date(Date.now() - 30 * 60_000) } },
        data: { status: "failed", summary: "اجرای هنگ‌کرده — به‌طور خودکار بسته شد (تایم‌اوت ۳۰ دقیقه)" },
      })
      .catch(() => {});

    const config = await getAgentsConfig();
    const now = tehranNow();

    /* ایجنت محتوا — از ساعت تعیین‌شده به بعد، اگر امروز انجام نشده */
    if (config.enabled.content && config.autoPublish && now.hour >= config.contentHour) {
      if (!(await scheduledTodayDone("content"))) {
        console.log(`[scheduler] daily pipeline start (Tehran ${now.hour}:${String(now.minute).padStart(2, "0")})`);
        await runPipeline("schedule");
      }
    }

    /* GEO/GSC — مستقل از ساعت مقاله، در نوبت هفتگی خودشان (چون content شامل‌شان نمی‌شود اگر disabled) */
    if (config.enabled.geo && config.autoPublish && now.hour >= 3 && !(await scheduledTodayDone("geo"))) {
      if (now.weekday === config.geoWeekday) {
        const { runGeoAgent } = await import("./geo-agent");
        await runAgent("geo", "schedule", runGeoAgent);
      }
    }
    if (config.enabled.gsc && config.autoPublish && now.hour >= 4 && !(await scheduledTodayDone("gsc"))) {
      if (now.weekday === config.gscWeekday) {
        const { runGscAgent } = await import("./gsc-agent");
        await runAgent("gsc", "schedule", runGscAgent);
      }
    }
  } catch (e) {
    console.error("[scheduler] tick failed:", e);
  }
}

export function startScheduler() {
  if (g.__agentScheduler) return; // همین بوت/هات‌ریلود قبلاً شروع کرده
  g.__agentScheduler = setInterval(tick, TICK_MS);
  // تیک اول با تأخیر کوتاه تا دیتابیس/سرور جا بیفتد
  setTimeout(tick, 15_000).unref?.();
  console.log("[scheduler] agents scheduler armed — daily content at 07:00 Tehran");
  // اجازه نده تایمر پردازش را زنده نگه دارد مگر خود سرور
  g.__agentScheduler.unref?.();
}
