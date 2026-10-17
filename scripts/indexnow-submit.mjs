// سابمیت Instant به IndexNow (Bing → Copilot، ChatGPT Search، DuckDuckGo، Yandex)
// اجرا: node scripts/indexnow-submit.mjs            → همه URLهای sitemap
//       node scripts/indexnow-submit.mjs URL1 URL2  → فقط URLهای مشخص
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEY = fs.readFileSync(path.resolve(__dirname, '../.indexnow-key'), 'utf8').trim();
const HOST = 'drpedrambakhshaei.com';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const args = process.argv.slice(2);
let urls = [];
if (args.length) {
  urls = args;
} else {
  // اولویت: ۴ لندینگ هدف + صفحه اصلی
  urls = [
    `https://${HOST}/`,
    `https://${HOST}/jaw-surgery`,
    `https://${HOST}/chin-surgery`,
    `https://${HOST}/dental-implant`,
    `https://${HOST}/implant-pasdaran`,
  ];
  // + همه URLهای نقشه سایت (در صورت دسترسی)
  try {
    const sm = await fetch(`https://${HOST}/sitemap.xml`).then((r) => r.text());
    const sitemapUrls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    urls = [...new Set([...urls, ...sitemapUrls])];
  } catch {
    // فقط لندینگ‌ها
  }
}

console.log(`سابمیت ${urls.length} URL به IndexNow...`);
const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  }),
});

// 200/202 = پذیرفته شد
const ok = res.status === 200 || res.status === 202;
console.log(`${ok ? '✅' : '❌'} وضعیت: ${res.status} ${res.statusText}`);
if (!ok) {
  console.log(await res.text());
  process.exit(1);
}
console.log('URLهای ارسال‌شده:');
for (const u of urls) console.log(`  - ${u}`);
