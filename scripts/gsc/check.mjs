// گزارش روزانه سرچ کنسول — دکتر پدرام بخشایی
// اجرا: node scripts/gsc/check.mjs
// خروجی: reports/gsc-latest.md + reports/history/YYYY-MM-DD.md + خلاصه در stdout
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listSites, searchAnalytics, listSitemaps, inspectUrl, isoDaysAgo } from './gsc-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORT_DIR = path.resolve(__dirname, '../../reports');

const SITE_CANDIDATES = [
  'sc-domain:drpedrambakhshaei.com',
  'https://drpedrambakhshaei.com/',
  'http://drpedrambakhshaei.com/',
  'https://www.drpedrambakhshaei.com/',
];

// ۴ کلمه کلیدی هدف کمپین
const KEYWORDS = ['جراحی فک', 'جراحی چانه', 'ایمپلنت پاسداران', 'ایمپلنت دندان'];

// صفحات فرود هدف برای رصد روزانه ایندکس
const INSPECT_PAGES = [
  'https://drpedrambakhshaei.com/jaw-surgery',
  'https://drpedrambakhshaei.com/chin-surgery',
  'https://drpedrambakhshaei.com/dental-implant',
  'https://drpedrambakhshaei.com/implant-pasdaran',
];

const LATEST = path.join(REPORT_DIR, 'gsc-latest.md');
const HISTORY_DIR = path.join(REPORT_DIR, 'history');

const end = isoDaysAgo(2); // داده‌های گوگل ۱-۲ روز تأخیر دارند
const start28 = isoDaysAgo(29);
const start7 = isoDaysAgo(8);

function wImp(rows) {
  // میانگین رتبه وزن‌داده با تعداد نمایش
  let imp = 0,
    clicks = 0,
    wpos = 0;
  for (const r of rows) {
    imp += r.impressions || 0;
    clicks += r.clicks || 0;
    wpos += (r.position || 0) * (r.impressions || 0);
  }
  return { imp, clicks, pos: imp ? wpos / imp : 0 };
}

function fa(n, digits = 0) {
  return Number(n ?? 0).toLocaleString('fa-IR', { maximumFractionDigits: digits });
}

async function main() {
  // ۱) پیدا کردن پراپرتی
  const sites = await listSites();
  const entries = (sites.siteEntry || []).filter((s) => s.permissionLevel !== 'siteUnverifiedUser');
  const site = SITE_CANDIDATES.find((c) => entries.some((e) => e.siteUrl === c));
  if (!site) {
    console.log(JSON.stringify({ status: 'NO_SITE', available: entries.map((e) => e.siteUrl) }, null, 2));
    console.log('\n❌ هیچ پراپرتی تأییدشده‌ای در دسترس نیست. سرویس اکانت باید در سرچ کنسول Add user شود.');
    process.exit(2);
  }
  console.log(`✅ پراپرتی: ${site}`);

  // ۲) کل سایت ۲۸ روز
  const totals = await searchAnalytics(site, {
    startDate: start28,
    endDate: end,
    dimensions: [],
  });
  const T = wImp(totals.rows || []);

  // ۳) کوئری‌های برتر ۲۸ روز
  const queries = await searchAnalytics(site, {
    startDate: start28,
    endDate: end,
    dimensions: ['query'],
    rowLimit: 100,
  });
  const topQueries = (queries.rows || []).sort((a, b) => b.clicks - a.clicks).slice(0, 20);

  // ۴) صفحات برتر ۲۸ روز
  const pages = await searchAnalytics(site, {
    startDate: start28,
    endDate: end,
    dimensions: ['page'],
    rowLimit: 50,
  });
  const topPages = (pages.rows || []).sort((a, b) => b.clicks - a.clicks).slice(0, 12);

  // ۵) داده روزانه برای هر کلمه کلیدی (۲۸ روز)
  const kwData = [];
  for (const kw of KEYWORDS) {
    const daily = await searchAnalytics(site, {
      startDate: start28,
      endDate: end,
      dimensions: ['date'],
      rowLimit: 250,
      dimensionFilterGroups: [
        { filters: [{ dimension: 'query', operator: 'contains', expression: kw }] },
      ],
    });
    const rows = daily.rows || [];
    const all = wImp(rows);
    const recent = wImp(rows.filter((r) => r.keys[0] >= start7));
    kwData.push({ kw, all, recent, days: rows.length });
  }

  // ۶) نقشه‌های سایت
  let sitemaps = [];
  try {
    const sm = await listSitemaps(site);
    sitemaps = (sm.sitemap || []).map((s) => ({
      path: s.path,
      type: s.type,
      errors: s.errors || 0,
      pending: s.isPending ? 1 : 0,
      lastDownloaded: s.lastDownloaded,
    }));
  } catch (e) {
    sitemaps = [{ path: `خطا: ${e.message}` }];
  }

  // ۷) وضعیت ایندکس صفحات فرود
  const inspections = [];
  for (const url of INSPECT_PAGES) {
    try {
      const r = await inspectUrl(site, url);
      const idx = r.inspectionResult?.indexStatusResult || {};
      inspections.push({
        path: url.replace('https://drpedrambakhshaei.com', '/') || '/',
        verdict: idx.verdict || '?',
        coverage: idx.coverageState || '-',
      });
    } catch (e) {
      inspections.push({ path: url, verdict: `خطا: ${e.message.slice(0, 80)}`, coverage: '-' });
    }
  }

  // ۷) ساخت گزارش
  const today = new Date().toISOString().slice(0, 10);
  const report = [];
  report.push(`# 📊 گزارش سرچ کنسول — دکتر پدرام بخشایی`);
  report.push(``);
  report.push(`- تاریخ گزارش: ${today}`);
  report.push(`- پراپرتی: \`${site}\``);
  report.push(`- بازه داده: ${start28} تا ${end} (۲۸ روز)`);
  report.push(``);
  report.push(`## کل سایت (۲۸ روز اخیر)`);
  report.push(``);
  report.push(`| کلیک | نمایش | CTR | میانگین رتبه |`);
  report.push(`|---|---|---|---|`);
  report.push(`| ${fa(T.clicks)} | ${fa(T.imp)} | ${T.imp ? fa((T.clicks / T.imp) * 100, 1) + '%' : '0%'} | ${fa(T.pos, 1)} |`);
  report.push(``);
  report.push(`## 🎯 کلمات کلیدی هدف`);
  report.push(``);
  report.push(`| کلمه کلیدی | رتبه (۲۸ روز) | نمایش | کلیک | رتبه (۷ روز اخیر) | روزهای فعال |`);
  report.push(`|---|---|---|---|---|---|`);
  for (const k of kwData) {
    const pos28 = k.all.imp ? fa(k.all.pos, 1) : '—';
    const pos7 = k.recent.imp ? fa(k.recent.pos, 1) : '—';
    report.push(
      `| ${k.kw} | ${pos28} | ${fa(k.all.imp)} | ${fa(k.all.clicks)} | ${pos7} | ${fa(k.days)}/۲۸ |`,
    );
  }
  report.push(``);
  report.push(`## 🔍 کوئری‌های برتر (۲۸ روز)`);
  report.push(``);
  report.push(`| کوئری | کلیک | نمایش | رتبه |`);
  report.push(`|---|---|---|---|`);
  for (const q of topQueries) {
    report.push(`| ${q.keys[0]} | ${fa(q.clicks)} | ${fa(q.impressions)} | ${fa(q.position, 1)} |`);
  }
  report.push(``);
  report.push(`## 📄 صفحات برتر (۲۸ روز)`);
  report.push(``);
  report.push(`| صفحه | کلیک | نمایش | رتبه |`);
  report.push(`|---|---|---|---|`);
  for (const p of topPages) {
    report.push(`| ${p.keys[0].replace('https://drpedrambakhshaei.com', '')} | ${fa(p.clicks)} | ${fa(p.impressions)} | ${fa(p.position, 1)} |`);
  }
  report.push(``);
  report.push(`## 🗺️ نقشه‌های سایت`);
  report.push(``);
  for (const s of sitemaps) {
    report.push(`- ${s.path} — خطا: ${s.errors ?? '?'} — آخرین دریافت: ${s.lastDownloaded ?? '?'}`);
  }
  report.push(``);
  report.push(`## 🔎 وضعیت ایندکس صفحات فرود`);
  report.push(``);
  report.push(`| صفحه | وضعیت | توضیح |`);
  report.push(`|---|---|---|`);
  const verdictFa = { PASS: '✅ ایندکس شده', NEUTRAL: '⏳ در انتظار', FAIL: '❌ مشکل' };
  for (const i of inspections) {
    report.push(`| ${i.path} | ${verdictFa[i.verdict] || i.verdict} | ${i.coverage} |`);
  }
  report.push(``);

  fs.mkdirSync(HISTORY_DIR, { recursive: true });
  const md = report.join('\n');
  fs.writeFileSync(LATEST, md, 'utf8');
  fs.writeFileSync(path.join(HISTORY_DIR, `${today}.md`), md, 'utf8');

  // خلاصه برای چت
  console.log('\n📋 خلاصه کلمات هدف:');
  for (const k of kwData) {
    console.log(
      `  ${k.kw}: رتبه ۲۸روزه=${k.all.imp ? k.all.pos.toFixed(1) : 'ناموجود'} | نمایش=${k.all.imp} | کلیک=${k.all.clicks} | رتبه ۷روزه=${k.recent.imp ? k.recent.pos.toFixed(1) : 'ناموجود'}`,
    );
  }
  console.log(`\nکلی ۲۸روزه: کلیک=${T.clicks} نمایش=${T.imp} رتبه=${T.pos.toFixed(1)}`);
  console.log('\n🔎 وضعیت ایندکس لندینگ‌ها:');
  for (const i of inspections) {
    console.log(`  ${i.path}: ${verdictFa[i.verdict] || i.verdict}`);
  }
  console.log(`\n✅ گزارش ذخیره شد: ${LATEST}`);
}

main().catch((e) => {
  console.error('❌ خطا:', e.message);
  process.exit(1);
});
