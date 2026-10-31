// کشف بقایای وردپرس قدیمی در گوگل — چرا «صفحه‌های ایندکس‌نشده» گزارش Pages پر شده؟
// اجرا: node scripts/gsc/diag-wp-content.mjs
// خروجی: reports/wp-diag-latest.md + stdout
//
// روش:
// ① Search Analytics وب + تصویر برای ~۱۵ ماه → همه URLهایی که گوگل دیده و نمایش/کلیک داشته‌اند
// ② فیلتر الگوهای وردپرس قدیمی (wp-content، wp-login، محصول/سبد/برچسب/…) 
// ③ چک زنده HTTP برای هر URL (وضعیت فعلی: ۴۰۴؟ ۴۱۰؟ ریدایرکت؟)
// ④ URL Inspection برای ۱۵ مورد پربازدید → دلیل دقیق گوگل از خودش
// ⑤ گزارش فارسی + تطبیق با قوانین جدید ۴۱۰/۳۰۱
import fs0 from 'node:fs';
import path0 from 'node:path';
import { fileURLToPath } from 'node:url';
import { listSites, searchAnalytics, inspectUrl, isoDaysAgo } from './gsc-lib.mjs';

const SITE = 'sc-domain:drpedrambakhshaei.com';
const HOST = 'https://drpedrambakhshaei.com';
const REPORT_DIR = path0.resolve(path0.dirname(fileURLToPath(import.meta.url)), '../../reports');
// مهم: UA مرورگر — سرور ایرانی درخواست‌های بدون UA را می‌بندد
const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

// الگوهای بقایای وردپرس/سایت قدیمی که نباید در گوگل بمانند
const LEGACY_RE = /\/wp-content\/|\/wp-includes\/|\/wp-admin(\/|$)|\/wp-login\.php|\/xmlrpc\.php|\/wp-json\/|\/wishlist\/?$|\/cart\/?$|\/checkout\/?$|\/my-account\/?$|\/shop\/?$|\/product(-category)?\/|\/author\/|\/tag\/|\/category\/|\/feed\/?$|\/\?p=|\/%3Fp=|\/hello-world\/?$|\/sample-page\/?$/;

const COVERAGE_FA = {
  NOT_FOUND: 'یافت نشد (۴۰۴) ❗',
  SOFT_404: 'سافت ۴۰۴ ❗',
  PAGE_WITH_REDIRECT: 'صفحه با ریدایرکت (در حال خروج)',
  BLOCKED_BY_ROBOTS_TXT: 'مسدود robots.txt',
  EXCLUDED_BY_NOINDEX_TAG: 'noindex',
  CRAWLED_CURRENTLY_NOT_INDEXED: 'خزیده — ایندکس نشده',
  DISCOVERED_CURRENTLY_NOT_INDEXED: 'کشف‌شده — ایندکس نشده',
  SUBMITTED_AND_INDEXED: 'ایندکس شده ✅',
};

function covFa(state) {
  if (!state) return '—';
  for (const [k, v] of Object.entries(COVERAGE_FA)) {
    if (state.includes(k)) return v;
  }
  return state;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function liveStatus(url) {
  try {
    const res = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(20000),
      headers: { 'User-Agent': BROWSER_UA },
    });
    const status = res.status;
    const loc = res.headers.get('location') || '';
    try { await res.body?.cancel(); } catch { /* بستن استریم */ }
    return { status, loc };
  } catch (e) {
    return { status: `خطا: ${(e.message || '').slice(0, 40)}`, loc: '' };
  }
}

async function inspectWithRetry(url, tries = 3) {
  for (let i = 1; i <= tries; i++) {
    try {
      const r = await inspectUrl(SITE, url);
      return r.inspectionResult?.indexStatusResult || {};
    } catch (e) {
      const msg = e.message || '';
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

  // ① صفحات شناخته‌شده گوگل — وب + تصویر (رسانه‌های وردپرس عمدتاً در جستجوی تصویر بودند)
  const merged = new Map(); // url → { web, image, clicks }
  for (const type of ['web', 'image']) {
    try {
      const r = await searchAnalytics(SITE, {
        startDate: isoDaysAgo(450), // ~۱۵ ماه (حداکثر مجاز ~۱۶ ماه)
        endDate: isoDaysAgo(1),
        dimensions: ['page'],
        searchType: type,
        rowLimit: 25000,
      });
      for (const row of r.rows || []) {
        const u = row.keys[0];
        const cur = merged.get(u) || { web: 0, image: 0, clicks: 0 };
        cur[type] += row.impressions || 0;
        cur.clicks += row.clicks || 0;
        merged.set(u, cur);
      }
      console.log(`✅ جستجوی ${type}: ${(r.rows || []).length} صفحه`);
    } catch (e) {
      console.log(`⚠️ جستجوی ${type} ناموفق: ${e.message.slice(0, 80)}`);
    }
  }

  // ② فیلتر بقایای قدیمی
  const legacy = [...merged.entries()]
    .filter(([u]) => LEGACY_RE.test(u.replace(HOST, '')))
    .map(([u, v]) => ({ url: u, ...v, imp: v.web + v.image }))
    .sort((a, b) => b.imp - a.imp);

  const wpContent = legacy.filter((x) => x.url.includes('/wp-content/'));
  const otherLegacy = legacy.filter((x) => !x.url.includes('/wp-content/'));
  console.log(`🔎 بقایای قدیمی در گوگل: ${legacy.length} URL (wp-content: ${wpContent.length})\n`);

  // ③ چک زنده
  const live = new Map();
  for (const x of legacy.slice(0, 40)) {
    live.set(x.url, await liveStatus(x.url));
    await sleep(300);
  }

  // ④ بازرسی گوگل برای پربازدیدترین‌ها
  const inspected = [];
  for (const x of legacy.slice(0, 15)) {
    try {
      const idx = await inspectWithRetry(x.url);
      inspected.push({ url: x.url, verdict: idx.verdict || '?', coverage: idx.coverageState || '', lastCrawl: idx.lastCrawlTime || '' });
      console.log(`  🔍 ${x.url.replace(HOST, '')} → ${covFa(idx.coverageState || '')}`);
    } catch (e) {
      inspected.push({ url: x.url, verdict: 'ERROR', coverage: e.message.slice(0, 80) });
    }
    await sleep(300);
  }

  // ⑤ گزارش
  const L = [];
  L.push(`# 🧟 کشف بقایای وردپرس قدیمی در گوگل — ${new Date().toISOString().slice(0, 10)}`);
  L.push('');
  L.push(`- پنجره داده: ~۱۵ ماه اخیر (وب + تصویر)`);
  L.push(`- کل URLهای شناخته‌شده گوگل با نمایش: ${merged.size}`);
  L.push(`- بقایای الگوی قدیمی: **${legacy.length}** (wp-content: **${wpContent.length}**، بقیه: ${otherLegacy.length})`);
  L.push(`- مجموع نمایش این بقایا: ${legacy.reduce((s, x) => s + x.imp, 0)} (وب ${legacy.reduce((s, x) => s + x.web, 0)} + تصویر ${legacy.reduce((s, x) => s + x.image, 0)})`);
  L.push('');

  const table = (items) => {
    L.push('| URL | منبع نمایش | نمایش | کلیک | وضعیت زنده | مقصد ریدایرکت |');
    L.push('|---|---|---|---|---|---|');
    for (const x of items) {
      const lv = live.get(x.url) || { status: '—', loc: '' };
      const loc = lv.loc ? '`' + lv.loc.replace(HOST, '') + '`' : '—';
      const src = x.image > 0 ? (x.web > 0 ? 'وب+تصویر' : 'تصویر') : 'وب';
      L.push(`| \`${x.url.replace(HOST, '') || '/'}\` | ${src} | ${x.imp} | ${x.clicks ?? 0} | ${lv.status} | ${loc} |`);
    }
  };

  L.push('## 📸 بقایای /wp-content (رسانه وردپرس قدیمی)');
  L.push('');
  if (wpContent.length) table(wpContent); else L.push('چیزی یافت نشد.');
  L.push('');

  L.push('## 🗂️ بقیه بقایای قدیمی');
  L.push('');
  if (otherLegacy.length) table(otherLegacy); else L.push('چیزی یافت نشد.');
  L.push('');

  if (inspected.length) {
    L.push('## 🔍 نظر خود گوگل (URL Inspection)');
    L.push('');
    L.push('| URL | verdict | وضعیت ایندکس | آخرین خزش |');
    L.push('|---|---|---|---|');
    for (const r of inspected) {
      L.push(`| \`${r.url.replace(HOST, '') || '/'}\` | ${r.verdict} | ${covFa(r.coverage)} | ${r.lastCrawl ? String(r.lastCrawl).slice(0, 10) : '—'} |`);
    }
    L.push('');
  }

  L.push('## 🛠️ اقدام انجام‌شده در کد');
  L.push('');
  L.push('- `/wp-content/**` → **410 Gone** (route handler) — گوگل سریع‌تر از ۴۰۴ حذف می‌کند');
  L.push('- `/wp-login.php` و `/xmlrpc.php` → **410 Gone**');
  L.push('- `/wishlist` → **301** به `/`');
  L.push('- `/services/wisdom` → **301** به `/blog/hidden-molar-symptoms-surgery-necessity`');
  L.push('> توجه: robots.txt عمداً این مسیرها را نمی‌بندد؛ گوگل باید خودش ۴۱۰ را ببیند تا URL را از گزارش Pages خارج کند.');
  L.push('');

  const md = L.join('\n');
  fs0.mkdirSync(REPORT_DIR, { recursive: true });
  fs0.writeFileSync(path0.join(REPORT_DIR, 'wp-diag-latest.md'), md, 'utf8');
  console.log('\n' + md);
  console.log(`\n✅ ذخیره شد: reports/wp-diag-latest.md`);
}

main().catch((e) => {
  console.error('❌ خطا:', e.message);
  process.exit(1);
});
