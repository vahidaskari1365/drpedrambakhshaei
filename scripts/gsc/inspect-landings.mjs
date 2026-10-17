// بررسی وضعیت ایندکس صفحات هدف با URL Inspection API
import { listSites, inspectUrl } from './gsc-lib.mjs';

const SITE_CANDIDATES = ['sc-domain:drpedrambakhshaei.com'];
const PAGES = [
  'https://drpedrambakhshaei.com/jaw-surgery',
  'https://drpedrambakhshaei.com/chin-surgery',
  'https://drpedrambakhshaei.com/dental-implant',
  'https://drpedrambakhshaei.com/implant-pasdaran',
  'https://drpedrambakhshaei.com/',
];

async function main() {
  const sites = await listSites();
  const site = SITE_CANDIDATES.find((c) => (sites.siteEntry || []).some((e) => e.siteUrl === c));
  if (!site) throw new Error('پراپرتی یافت نشد');

  for (const url of PAGES) {
    try {
      const r = await inspectUrl(site, url);
      const idx = r.inspectionResult.indexStatusResult || {};
      const path = url.replace('https://drpedrambakhshaei.com', '/') || '/';
      const verdictMap = {
        PASS: '✅ ایندکس شده',
        NEUTRAL: '⏳ هنوز ایندکس نشده',
        FAIL: '❌ ایندکس نشده',
      };
      console.log(
        `${path}: ${verdictMap[idx.verdict] || idx.verdict} | crawlState=${idx.crawlingState || '?'} | userCanonical=${idx.userCanonical || '-'} | googleCanonical=${idx.googleCanonical || '-'}`,
      );
      const cover = idx.coverageState || '';
      if (cover) console.log(`   └ ${cover}`);
    } catch (e) {
      console.log(`${url}: خطا — ${e.message.slice(0, 200)}`);
    }
  }
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
