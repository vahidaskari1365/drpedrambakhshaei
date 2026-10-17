// ایجنت مانیتور — هر ۳۰ دقیقه (در گیت‌هاب اکشن)
// ① سلامت/سرعت ۵ صفحه کلیدی  ② وضعیت ایندکس ۴ لندینگ  ③ سلامت نقشه سایت
// خروجی: reports/monitor-latest.md — فقط وقتی تغییری باشد کامیت می‌شود (در workflow)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listSites, inspectUrl } from './gsc-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORT_DIR = path.resolve(__dirname, '../../reports');
const MONITOR = path.join(REPORT_DIR, 'monitor-latest.md');

const HOST = 'https://drpedrambakhshaei.com';
const LANDINGS = ['/jaw-surgery', '/chin-surgery', '/dental-implant', '/implant-pasdaran'];
const SITE = 'sc-domain:drpedrambakhshaei.com';

const verdictFa = { PASS: '✅ ایندکس شده', NEUTRAL: '⏳ در انتظار', FAIL: '❌ مشکل' };

function now() {
  return new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
}

// ① سلامت HTTP و زمان پاسخ
async function health(url) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000) });
    return { ok: res.ok, status: res.status, ms: Date.now() - t0 };
  } catch (e) {
    return { ok: false, status: 0, ms: Date.now() - t0, err: e.message.slice(0, 60) };
  }
}

async function main() {
  const lines = [];
  let problems = 0;

  lines.push(`# 🩺 مانیتور سایت — ${now()}`);

  // ① سلامت صفحات
  lines.push('');
  lines.push('## سلامت صفحات');
  lines.push('');
  lines.push('| صفحه | وضعیت | زمان پاسخ |');
  lines.push('|---|---|---|');
  for (const p of ['/', ...LANDINGS]) {
    const h = await health(`${HOST}${p}`);
    if (!h.ok) problems++;
    lines.push(`| ${p} | ${h.ok ? '✅ ' + h.status : '❌ ' + (h.status || h.err)} | ${h.ms}ms |`);
  }

  // ② وضعیت ایندکس لندینگ‌ها
  const sites = await listSites();
  if (!(sites.siteEntry || []).some((e) => e.siteUrl === SITE)) throw new Error('پراپرتی در دسترس نیست');
  lines.push('');
  lines.push('## وضعیت ایندکس لندینگ‌ها');
  lines.push('');
  lines.push('| لندینگ | وضعیت |');
  lines.push('|---|---|');
  for (const p of LANDINGS) {
    try {
      const r = await inspectUrl(SITE, `${HOST}${p}`);
      const idx = r.inspectionResult?.indexStatusResult || {};
      const v = idx.verdict || '?';
      if (v !== 'PASS') problems++;
      lines.push(`| ${p} | ${verdictFa[v] || v} |`);
    } catch (e) {
      lines.push(`| ${p} | خطا: ${e.message.slice(0, 60)} |`);
    }
  }

  // ③ نقشه سایت
  lines.push('');
  lines.push('## نقشه سایت');
  const sm = await health(`${HOST}/sitemap.xml`);
  const smText = sm.ok ? await fetch(`${HOST}/sitemap.xml`).then((r) => r.text()) : '';
  const missing = LANDINGS.filter((p) => !smText.includes(p));
  lines.push('');
  lines.push(`- دریافت نقشه سایت: ${sm.ok ? `✅ ${sm.status} (${sm.ms}ms)` : '❌ خطا'}`);
  lines.push(`- لندینگ‌های غایب در نقشه: ${missing.length ? '❌ ' + missing.join(', ') : '✅ هیچ'}`);
  if (missing.length) problems++;

  lines.push('');
  lines.push(`**جمع‌بندی:** ${problems === 0 ? '✅ همه‌چیز سالم' : `⚠️ ${problems} مشکل پیدا شد`}`);

  const md = lines.join('\n');
  const prev = fs.existsSync(MONITOR) ? fs.readFileSync(MONITOR, 'utf8') : '';
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(MONITOR, md, 'utf8');
  console.log(md);
  console.log(prev === md ? '\nبدون تغییر — کامیت لازم نیست' : '\nتغییر جدید — کامیت می‌شود');
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
