/**
 * پچ یک‌بارهٔ کاور مقاله‌های دیتابیس هاست — با API رسمی سایت
 *
 * استفاده (فقط در GitHub Actions با secret ADMIN_KEY):
 *   ADMIN_KEY=... SITE_URL=https://drpedrambakhshaei.com node scripts/github-agent/patch-covers.mjs
 *
 * برای هر slug فقط فیلدهای کاور (ستون coverImage + JSON مقاله) آپدیت می‌شود؛ متن مقاله دست نمی‌خورد.
 */
const SITE_URL = (process.env.SITE_URL || "https://drpedrambakhshaei.com").replace(/\/$/, "");
const ADMIN_KEY = (process.env.ADMIN_KEY || "").trim();
if (!ADMIN_KEY) {
  console.error("❌ ADMIN_KEY خالی است");
  process.exit(1);
}

/** slug → کاور موضوعی (تولیدشده با پالت برند، بدون متن/واترمارک) */
const PATCHES = [
  {
    slug: "immediate-implant-loading",
    coverImage: "/uploads/cover-immediate-implant.jpg",
    coverAlt: "ایمپلنت فوری در سوکت تازه کشیده‌شده دندان — نمای آموزشی",
  },
  {
    slug: "post-oral-surgery-care",
    coverImage: "/uploads/cover-aftercare.jpg",
    coverAlt: "اقلام مراقبت بعد از جراحی دهان — کیسه سرد، گاز، غذای نرم",
  },
  {
    slug: "hidden-molar-symptoms-surgery-necessity",
    coverImage: "/uploads/cover-hidden-molar.jpg",
    coverAlt: "بررسی دندان نهفته با ذره‌بین روی مدل فک",
  },
  {
    slug: "dental-implant-cost-1405",
    coverImage: "/uploads/cover-implant-cost.jpg",
    coverAlt: "فیکسچر ایمپلنت با تاج سرامیکی — مفهوم هزینه ایمپلنت دندان",
  },
  {
    slug: "jaw-fracture-facial-trauma-surgery",
    coverImage: "/uploads/cover-jaw-fracture.jpg",
    coverAlt: "فیکساسیون شکستگی فک با پلاک و پیچ تیتانیوم",
  },
  {
    slug: "dental-abscess-facial-space-infection",
    coverImage: "/uploads/cover-abscess.jpg",
    coverAlt: "آبسه در ریشه دندان — تصویر آموزشی مقطع دندان",
  },
  {
    slug: "pericoronitis-wisdom-gum-infection",
    coverImage: "/uploads/cover-pericoronitis.jpg",
    coverAlt: "پریکورونیت — التهاب لثه روی تاج دندان عقل نیمه‌نهفته",
  },
  {
    slug: "digital-guided-implant-surgery",
    coverImage: "/uploads/cover-guided-implant.jpg",
    coverAlt: "گاید جراحی دیجیتال ایمپلنت روی مدل فک",
  },
];

let ok = 0;
let fail = 0;
for (const p of PATCHES) {
  try {
    const res = await fetch(`${SITE_URL}/api/blog/publish`, {
      method: "PATCH",
      headers: { "content-type": "application/json", "x-admin-key": ADMIN_KEY },
      body: JSON.stringify(p),
      signal: AbortSignal.timeout(30_000),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.ok) {
      ok++;
      console.log(`✅ ${p.slug} → ${data.cover}`);
    } else {
      fail++;
      console.error(`❌ ${p.slug}: ${res.status} ${JSON.stringify(data).slice(0, 150)}`);
    }
  } catch (e) {
    fail++;
    console.error(`❌ ${p.slug}: ${String(e.message).slice(0, 120)}`);
  }
  await new Promise((r) => setTimeout(r, 1_500));
}
console.log(`\nنتیجه: ${ok} موفق، ${fail} ناموفق از ${PATCHES.length}`);
process.exit(fail > 0 && ok === 0 ? 1 : 0);
