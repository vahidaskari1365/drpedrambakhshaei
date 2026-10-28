// استخراج کامل داده کوئری×صفحه برای تحلیل کنیبالیزیشن و فرصت‌ها
// خروجی: مارک‌داون که به reports/gsc-qlp-dump.md کامیت می‌شود
import { searchAnalytics, listSites, isoDaysAgo } from './gsc-lib.mjs';

const SITE_CANDIDATES = ['sc-domain:drpedrambakhshaei.com'];

function fmt(n) {
  return Number(n || 0).toLocaleString('fa-IR');
}

async function main() {
  const sites = await listSites();
  const site = SITE_CANDIDATES.find((c) => (sites.siteEntry || []).some((e) => e.siteUrl === c));
  if (!site) throw new Error('پراپرتی یافت نشد');

  async function q(body) {
    const r = await searchAnalytics(site, body);
    return r.rows || [];
  }

  // ۹۰ روزه — داده بیشتر برای تحلیل روندها
  const startDate = isoDaysAgo(90);
  const endDate = isoDaysAgo(1);

  // ۱) کوئری×صفحه (۲۰۰ ردیف برتر بر اساس کلیک)
  const qlp = await q({
    startDate,
    endDate,
    dimensions: ['query', 'page'],
    rowLimit: 250,
  });

  // ۲) کوئری بر اساس نمایش (برای دیدن کلمات پرنمایش بی‌کلیک)
  const byImp = await q({
    startDate,
    endDate,
    dimensions: ['query'],
    rowLimit: 250,
  });
  byImp.sort((a, b) => b.impressions - a.impressions);

  // ۳) صفحه بر اساس نمایش
  const byPage = await q({
    startDate,
    endDate,
    dimensions: ['page'],
    rowLimit: 100,
  });
  byPage.sort((a, b) => b.impressions - a.impressions);

  // ۴) بر اساس دستگاه
  const byDevice = await q({
    startDate,
    endDate,
    dimensions: ['device'],
    rowLimit: 10,
  });

  console.log('# GSC QLP Dump — ۹۰ روزه (' + startDate + ' تا ' + endDate + ')\n');

  console.log('## 📱 دستگاه‌ها\n');
  console.log('| دستگاه | کلیک | نمایش | CTR | رتبه |');
  console.log('|---|---|---|---|---|');
  for (const r of byDevice)
    console.log(`| ${r.keys[0]} | ${fmt(r.clicks)} | ${fmt(r.impressions)} | ${r.impressions ? ((r.clicks / r.impressions) * 100).toFixed(1) : 0}% | ${r.position?.toFixed(1) ?? '-'} |`);

  console.log('\n## 🔑 کوئری‌ها بر اساس نمایش (۲۵۰ تا)\n');
  console.log('| کوئری | کلیک | نمایش | CTR | رتبه |');
  console.log('|---|---|---|---|---|');
  for (const r of byImp)
    console.log(`| ${r.keys[0]} | ${fmt(r.clicks)} | ${fmt(r.impressions)} | ${r.impressions ? ((r.clicks / r.impressions) * 100).toFixed(1) : 0}% | ${r.position?.toFixed(1) ?? '-'} |`);

  console.log('\n## 📄 صفحات بر اساس نمایش\n');
  console.log('| صفحه | کلیک | نمایش | CTR | رتبه |');
  console.log('|---|---|---|---|---|');
  for (const r of byPage)
    console.log(`| ${r.keys[0].replace('https://drpedrambakhshaei.com', '') || '/'} | ${fmt(r.clicks)} | ${fmt(r.impressions)} | ${r.impressions ? ((r.clicks / r.impressions) * 100).toFixed(1) : 0}% | ${r.position?.toFixed(1) ?? '-'} |`);

  console.log('\n## 🧩 کوئری×صفحه (۲۵۰ ردیف برتر)\n');
  console.log('| کوئری | صفحه | کلیک | نمایش | CTR | رتبه |');
  console.log('|---|---|---|---|---|---|');
  for (const r of qlp)
    console.log(`| ${r.keys[0]} | ${r.keys[1].replace('https://drpedrambakhshaei.com', '') || '/'} | ${fmt(r.clicks)} | ${fmt(r.impressions)} | ${r.impressions ? ((r.clicks / r.impressions) * 100).toFixed(1) : 0}% | ${r.position?.toFixed(1) ?? '-'} |`);
}

main().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
