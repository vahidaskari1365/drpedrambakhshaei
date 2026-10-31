// ممیزی کامل ایندکس — بازرسی تک‌تک همه URLهای شناخته‌شده با URL Inspection API
// هدف: یافتن دلیل دقیق «صفحه‌های ایندکس‌نشده» در گزارش Pages سرچ کنسول
// اجرا: node scripts/gsc/audit-index.mjs
// خروجی: reports/index-audit-latest.md + stdout
//
// روش:
// ① دریافت نقشه سایت زنده از هاست
// ② ساخت فهرست کامل: همه URLهای نقشه + واریانت‌های http / www / اسلش انتهایی + صفحات دارای نمایش در ۹۰ روز
// ③ بازرسی هر URL (verdict / coverageState / کنونیکال گوگل / آخرین خزش)
// ④ گروه‌بندی بر اساس دلیل و تولید گزارش فارسی
import fs0 from 'node:fs';
import path0 from 'node:path';
import { fileURLToPath } from 'node:url';
import { listSites, inspectUrl, searchAnalytics, isoDaysAgo, resubmitSitemap } from './gsc-lib.mjs';

const SITE = 'sc-domain:drpedrambakhshaei.com';
const HOST = 'https://drpedrambakhshaei.com';
// مهم: هاست ایرانی درخواست بدون UA مرورگر را می‌بندد — درس ثبت‌شده در worklog
const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const REPORT_DIR = path0.resolve(path0.dirname(fileURLToPath(import.meta.url)), '../../reports');

// ترجمه وضعیت‌های coverage به فارسی
const COVERAGE_FA = {
  'SUBMITTED_AND_INDEXED': 'ارسال و ایندکس شده ✅',
  'CRAWLED_CURRENTLY_NOT_INDEXED': 'خزیده — فعلاً ایندکس نشده ⚠️',
  'DISCOVERED_CURRENTLY_NOT_INDEXED': 'کشف‌شده — فعلاً ایندکس نشده ⚠️',
  'PAGE_WITH_REDIRECT': 'صفحه با ریدایرکت (طبیعی)',
  'ALTERNATE_PAGE_WITH_PROPER_CANONICAL_TAG': 'صفحه جایگزین با کنونیکال صحیح (طبیعی)',
  'DUPLICATE_WITHOUT_USER_SELECTED_CANONICAL': 'تکراری بدون کنونیکال انتخابی ❗',
  'DUPLICATE_SUBMITTED_URL_NOT_SELECTED_AS_CANONICAL': 'ارسال‌شده اما کنونیکال انتخاب‌نشده ❗',
  'SOFT_404': 'سافت ۴۰۴ ❗',
  'NOT_FOUND': 'یافت نشد (۴۰۴) ❗',
  'BLOCKED_BY_ROBOTS_TXT': 'مسدود توسط robots.txt ❗',
  'EXCLUDED_BY_NOINDEX_TAG': 'منع ایندکس (noindex) ❗',
  'BLOCKED_DUE_TO_FORBIDDEN': 'دسترسی ممنوع (۴۰۳) ❗',
  'BLOCKED_DUE_TO_ACCESS_FORBIDDEN': 'دسترسی ممنوع (۴۰۳) ❗',
  'SERVER_ERROR': 'خطای سرور (۵xx) ❗',
  'REDIRECT_ERROR': 'خطای ریدایرکت ❗',
  'CRAWL_ERROR': 'خطای خزش ❗',
  'INTERNAL_ERROR': 'خطای داخلی گوگل ⚠️',
  'NEUTRAL': 'در انتظار تصمیم گوگل ⏳',
  'UNKNOWN': 'نامشخص',
};
const VERDICT_FA = { PASS: 'ایندکس شده ✅', NEUTRAL: 'خنثی/در انتظار ⏳', FAIL: 'ایندکس نشده ❌' };

function covFa(state) {
  if (!state) return '—';
  // API رشته فارسی/انگلیسی متنی برمی‌گرداند؛ کلیدها را با شامل‌شدن تطبیق می‌دهیم
  for (const [k, v] of Object.entries(COVERAGE_FA)) {
    if (state.includes(k)) return v;
  }
  // فال‌بک: تطبیق متنی
  const s = state.toLowerCase();
  if (s.includes('submitted and indexed')) return 'ارسال و ایندکس شده ✅';
  if (s.includes('crawled') && s.includes('not indexed')) return 'خزیده — فعلاً ایندکس نشده ⚠️';
  if (s.includes('discovered') && s.includes('not indexed')) return 'کشف‌شده — فعلاً ایندکس نشده ⚠️';
  if (s.includes('redirect')) return 'صفحه با ریدایرکت (طبیعی)';
  if (s.includes('alternate')) return 'صفحه جایگزین با کنونیکال صحیح (طبیعی)';
  if (s.includes('duplicate')) return 'تکراری ❗';
  if (s.includes('soft 404')) return 'سافت ۴۰۴ ❗';
  if (s.includes('not found') || s.includes('404')) return 'یافت نشد (۴۰۴) ❗';
  if (s.includes('robots.txt') && s.includes('blocked')) return 'مسدود توسط robots.txt ❗';
  if (s.includes('noindex')) return 'منع ایندکس (noindex) ❗';
  if (s.includes('server error') || s.includes('5xx')) return 'خطای سرور ❗';
  return state;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchLiveSitemap() {
  const res = await fetch(`${HOST}/sitemap.xml`, {
    headers: { 'User-Agent': BROWSER_UA },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`sitemap ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
}

async function inspectWithRetry(site, url, tries = 3) {
  for (let i = 1; i <= tries; i++) {
    try {
      const r = await inspectUrl(site, url);
      return r.inspectionResult?.indexStatusResult || {};
    } catch (e) {
      const msg = e.message || '';
      // خطای نرخ یا سرور گوگل → صبر و تلاش مجدد
      if ((msg.includes('429') || msg.includes('500') || msg.includes('503')) && i < tries) {
        await sleep(2000 * i);
        continue;
      }
      throw e;
    }
  }
}

async function main() {
  const sites = await listSites();
  if (!(sites.siteEntry || []).some((e) => e.siteUrl === SITE)) throw new Error('پراپرتی در دسترس نیست');

  // ① نقشه سایت زنده
  let sitemapUrls = [];
  try {
    sitemapUrls = await fetchLiveSitemap();
    console.log(`✅ نقشه سایت زنده: ${sitemapUrls.length} URL`);
  } catch (e) {
    console.log(`⚠️ دریافت نقشه سایت ناموفق (${e.message}) — ادامه با فهرست ثابت`);
  }

  // ② صفحاتی که در ۹۰ روز اخیر نمایش/کلیک داشته‌اند (برای یافتن URLهای خارج از نقشه)
  let perfPages = [];
  try {
    const r = await searchAnalytics(SITE, {
      startDate: isoDaysAgo(90),
      endDate: isoDaysAgo(1),
      dimensions: ['page'],
      rowLimit: 100,
    });
    perfPages = (r.rows || []).map((x) => x.keys[0]);
    console.log(`✅ صفحات دارای نمایش در ۹۰ روز: ${perfPages.length}`);
  } catch { /* غیربحرانی */ }

  // ③ فهرست نهایی — یکتا + واریانت‌های پرتکرار که گوگل معمولاً کشف می‌کند
  const base = sitemapUrls.length ? sitemapUrls : [
    `${HOST}/`, `${HOST}/services`, `${HOST}/prices`, `${HOST}/gallery`, `${HOST}/about`,
    `${HOST}/faq`, `${HOST}/blog`, `${HOST}/reviews`, `${HOST}/contact`,
    `${HOST}/jaw-surgery`, `${HOST}/chin-surgery`, `${HOST}/dental-implant`, `${HOST}/implant-pasdaran`,
  ];
  const all = new Set(base);
  for (const u of perfPages) all.add(u);
  // واریانت‌ها (نمونه‌ای از هر نوع خطای ساختاری که گوگل در Pages می‌بیند)
  all.add('http://drpedrambakhshaei.com/');
  all.add('https://www.drpedrambakhshaei.com/');
  all.add('http://www.drpedrambakhshaei.com/');
  all.add(`${HOST}/faq/`); // اسلش انتهایی
  all.add(`${HOST}/blog/`); // اسلش انتهایی
  all.add(`${HOST}/robots.txt`);
  all.add(`${HOST}/llms.txt`);
  all.add(`${HOST}/icon.svg`);

  const urls = [...all].sort();
  console.log(`🔎 بازرسی ${urls.length} URL...\n`);

  const results = [];
  for (const u of urls) {
    try {
      const idx = await inspectWithRetry(SITE, u);
      results.push({
        url: u,
        verdict: idx.verdict || '?',
        coverage: idx.coverageState || '',
        robots: idx.robotsTxtState || '',
        fetch: idx.pageFetchState || '',
        googleCanon: idx.googleCanonical || '',
        userCanon: idx.userCanonical || '',
        lastCrawl: idx.lastCrawlTime || '',
      });
      console.log(`  ${u.replace(HOST, '') || '/'} → ${VERDICT_FA[idx.verdict] || idx.verdict}`);
    } catch (e) {
      results.push({ url: u, verdict: 'ERROR', coverage: e.message.slice(0, 100) });
      console.log(`  ${u} → خطا: ${e.message.slice(0, 60)}`);
    }
    await sleep(250); // احترام به نرخ ۶۰۰ QPM
  }

  // ④ گزارش
  const passed = results.filter((r) => r.verdict === 'PASS');
  const failed = results.filter((r) => r.verdict === 'FAIL');
  const neutral = results.filter((r) => r.verdict === 'NEUTRAL');
  const errored = results.filter((r) => r.verdict === 'ERROR');

  const L = [];
  L.push(`# 🔎 ممیزی کامل ایندکس — ${new Date().toISOString().slice(0, 10)}`);
  L.push('');
  L.push(`- پراپرتی: \`${SITE}\``);
  L.push(`- تعداد URL بازرسی‌شده: ${results.length} (نقشه سایت: ${sitemapUrls.length} + صفحات دارای نمایش + واریانت‌ها)`);
  L.push('');
  L.push('## خلاصه');
  L.push('');
  L.push('| وضعیت | تعداد |');
  L.push('|---|---|');
  L.push(`| ✅ ایندکس شده | ${passed.length} |`);
  L.push(`| ❌ ایندکس نشده | ${failed.length} |`);
  L.push(`| ⏳ خنثی/در انتظار | ${neutral.length} |`);
  if (errored.length) L.push(`| ⚠️ خطای API | ${errored.length} |`);
  L.push('');

  const row = (r) => {
    const p = r.url.replace(HOST, '') || '/';
    const canon =
      r.googleCanon && r.userCanon && r.googleCanon !== r.userCanon
        ? `گوگل: \`${r.googleCanon.replace(HOST, '') || '/'}\` ≠ اعلامی`
        : r.googleCanon
          ? `\`${r.googleCanon.replace(HOST, '') || '/'}\``
          : '—';
    const crawl = r.lastCrawl ? String(r.lastCrawl).slice(0, 10) : '—';
    return `| \`${p}\` | ${VERDICT_FA[r.verdict] || r.verdict} | ${covFa(r.coverage)} | ${canon} | ${crawl} |`;
  };

  L.push('## ❌ ایندکس نشده‌ها (با دلیل دقیق)');
  L.push('');
  L.push('| URL | وضعیت | دلیل | کنونیکال گوگل | آخرین خزش |');
  L.push('|---|---|---|---|---|');
  for (const r of [...failed, ...neutral, ...errored]) L.push(row(r));
  L.push('');
  L.push('## ✅ ایندکس شده‌ها');
  L.push('');
  L.push('| URL | وضعیت | دلیل | کنونیکال گوگل | آخرین خزش |');
  L.push('|---|---|---|---|---|');
  for (const r of passed) L.push(row(r));
  L.push('');

  // ⑤ چک زنده HTTP برای URLهای مشکوک/قدیمی — تعیین ۲۰۰/ریدایرکت/۴۰۴
  const DIAG = [
    '/blog/immediate-implant-loading', // اسلاگ قدیمی مقاله ایمپلنت فوری (بدون پسوند dee79)
    '/blog/immediate-implant-loading-dee79',
    '/blog/implant-in-diabetic-patients', // مقاله جدید دیروز
    '/blog/implant-in-smokers', // مقاله سیگار و ایمپلنت
    '/wp-content/uploads/2023/05/test.jpg', // رسانه وردپرس قدیمی — باید ۴۱۰ شود
    '/wp-login.php', // وردپرس قدیمی — باید ۴۱۰ شود
    '/wishlist', // بقایای ووکامرس قدیمی — باید ۳۰۱ شود
    '/services/wisdom', // بقایای سایت قدیمی — باید ۳۰۱ شود
  ];
  const diag = [];
  L.push('## 🧪 چک زنده URLهای مشکوک');
  L.push('');
  L.push('| URL | وضعیت HTTP | مقصد ریدایرکت |');
  L.push('|---|---|---|');
  for (const p of DIAG) {
    let status = 'خطا', loc = '—';
    try {
      const res = await fetch(`${HOST}${p}`, {
        redirect: 'manual',
        signal: AbortSignal.timeout(20000),
        headers: { 'User-Agent': BROWSER_UA },
      });
      status = res.status;
      loc = res.headers.get('location') || '—';
      try { await res.body?.cancel(); } catch { /* بستن استریم */ }
    } catch (e) {
      status = `خطا: ${e.message.slice(0, 40)}`;
    }
    diag.push({ p, status, loc });
    L.push(`| \`${p}\` | ${status} | ${loc === '—' ? '—' : '`' + loc.replace(HOST, '') + '`'} |`);
  }
  L.push('');

  // ⑥ ری‌سابمیت نقشه سایت — برای کشف سریع‌تر صفحات جدید (مثل مقاله دیروز)
  let resub = 'خطا';
  try {
    await resubmitSitemap(SITE, `${HOST}/sitemap.xml`);
    resub = '✅ انجام شد';
  } catch (e) {
    resub = `❌ ${e.message.slice(0, 80)}`;
  }
  L.push(`## 🗺️ ری‌سابمیت نقشه سایت: ${resub}`);
  L.push('');

  // تحلیل گروهی — هر دلیل، چه URLهایی
  const byCoverage = new Map();
  for (const r of [...failed, ...neutral]) {
    const key = covFa(r.coverage);
    if (!byCoverage.has(key)) byCoverage.set(key, []);
    byCoverage.get(key).push(r.url.replace(HOST, '') || '/');
  }
  L.push('## 🧭 دسته‌بندی دلایل');
  L.push('');
  for (const [k, v] of byCoverage) {
    L.push(`- **${k}** (${v.length}): ${v.map((p) => '`' + p + '`').join('، ')}`);
  }
  L.push('');
  L.push('> راهنما: «صفحه با ریدایرکت» و «صفحه جایگزین با کنونیکال صحیح» طبیعی و بی‌ضررند (واریانت http/www/اسلش).');
  L.push('> «خزیده/کشف‌شده — فعلاً ایندکس نشده» یعنی گوگل محتوا را هنوز شایسته ایندکس نمی‌داند → تقویت محتوا و اعتبار لازم است.');
  L.push('> «تکراری بدون کنونیکال» و «سافت ۴۰۴» نیاز به اقدام فنی دارند.');

  const md = L.join('\n');
  fs0.mkdirSync(REPORT_DIR, { recursive: true });
  fs0.writeFileSync(path0.join(REPORT_DIR, 'index-audit-latest.md'), md, 'utf8');
  console.log('\n' + md);
  console.log(`\n✅ ذخیره شد: reports/index-audit-latest.md`);
}

main().catch((e) => {
  console.error('❌ خطا:', e.message);
  process.exit(1);
});
