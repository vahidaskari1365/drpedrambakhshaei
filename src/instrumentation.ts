/**
 * هوک استارتاپ سرور Next.js — روی هاست واقعی (cPanel/Passenger) در اولین اجرا
 * دیتابیس را خودکار آماده می‌کند و زمان‌بند ایجنت‌ها را مسلح می‌کند.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { bootstrapDatabase } = await import("@/lib/db-bootstrap");
    await bootstrapDatabase();
    const { startScheduler } = await import("@/lib/agents/scheduler");
    startScheduler();
  }
}
