/**
 * هوک استارتاپ سرور Next.js — روی هاست واقعی (cPanel/Passenger) در اولین اجرا
 * دیتابیس SQLite را خودکار آماده می‌کند؛ هیچ دستور دستی لازم نیست.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { bootstrapDatabase } = await import("@/lib/db-bootstrap");
    await bootstrapDatabase();
  }
}
