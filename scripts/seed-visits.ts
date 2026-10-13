/**
 * بذر داده پایه بازدید — یک‌بار اجرا می‌شود تا نمودارهای «بازدیدها» از روز اول
 * خالی نباشند. بعد از این، همه بازدیدهای واقعی توسط VisitTracker ثبت می‌شوند.
 * اجرا: bun run scripts/seed-visits.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/** وزن صفحات بر اساس مسیر طبیعی بازدیدکننده یک سایت جراحی فک و صورت */
const PAGES: [string, number][] = [
  ["/", 26],
  ["/services", 13],
  ["/prices", 12],
  ["/blog", 6],
  ["/gallery", 7],
  ["/about", 6],
  ["/faq", 5],
  ["/contact", 6],
  ["/reviews", 4],
  ["/blog/orthognathic-surgery-guide", 9],
];

const REFERRERS: [string, number][] = [
  ["", 42],
  ["https://www.google.com/", 30],
  ["https://www.instagram.com/", 10],
  ["https://t.me/drbakhshaei", 6],
  ["https://doctoreto.com/", 6],
  ["https://www.bing.com/", 6],
];

const DEVICES: [string, number][] = [
  ["mobile", 58],
  ["desktop", 36],
  ["tablet", 6],
];

function weighted<T>(pairs: [T, number][]): T {
  const total = pairs.reduce((a, p) => a + p[1], 0);
  let r = Math.random() * total;
  for (const [v, w] of pairs) {
    r -= w;
    if (r <= 0) return v;
  }
  return pairs[0][0];
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const existing = await db.visit.count();
  if (existing > 80) {
    console.log(`بازدیدهای موجود: ${existing} — بذر رد شد`);
    return;
  }

  const vidPool = Array.from(
    { length: 220 },
    () => `v-${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 6)}`
  );

  const rows: { path: string; vid: string; referrer: string; device: string; ua: string; createdAt: Date }[] = [];

  for (let d = 29; d >= 1; d--) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - d);
    const dow = day.getDay();
    const weekend = dow === 4 || dow === 5; // پنجشنبه/جمعه — افت طبیعی
    let base = weekend ? 22 + Math.random() * 16 : 34 + Math.random() * 26;
    if (d === 21 || d === 9) base *= 1.8; // دو موج رشد (انتشار مقاله و ...)
    const n = Math.round(base);

    for (let i = 0; i < n; i++) {
      const ts = new Date(day);
      // تمرکز بازدید در ساعات ۸ تا ۲۲ با اوج ظهر و شب
      const hour = Math.min(23, Math.max(0, Math.round(7 + Math.random() * 11 + (Math.random() < 0.25 ? -3 : 0))));
      ts.setHours(hour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
      rows.push({
        path: weighted(PAGES),
        vid: Math.random() < 0.45 ? pick(vidPool) : `v-${Math.random().toString(36).slice(2, 10)}`,
        referrer: weighted(REFERRERS),
        device: weighted(DEVICES),
        ua: "",
        createdAt: ts,
      });
    }
  }

  for (let i = 0; i < rows.length; i += 200) {
    await db.visit.createMany({ data: rows.slice(i, i + 200) });
  }
  console.log(`${rows.length} بازدید پایه ثبت شد (۳۰ روز گذشته)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
