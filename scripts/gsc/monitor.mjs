// ایجنت مانیتور — هر ۳۰ دقیقه (در گیت‌هاب اکشن)
// ① سلامت/سرعت ۵ صفحه کلیدی  ② وضعیت ایندکس ۴ لندینگ  ③ سلامت نقشه سایت
// ④ سلامت JSON-LD (ریچ‌ریزالت: aggregateRating تکراری/Review خراب) + نظر گوگل برای /reviews
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
  lines.push('- لندینگ‌های غایب در نقشه: ' + (missing.length ? '❌ ' + missing.join(', ') : '✅ هیچ'));
  if (missing.length) problems++;

  // ④ سلامت JSON-LD — قواعد ریچ‌ریزالت گوگل (پیشگیری از خطاهای Search Console)
  // R1: بیش از یک aggregateRating در یک نود | R2: aggregateRating مستقیم داخل Review
  // R3: itemReviewed با @id که به نود دارای aggregateRating می‌رسد (تله ادغام @id گوگل)
  const ldNodes = (html) => {
    const nodes = [];
    for (const s of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      try {
        const j = JSON.parse(s[1]);
        nodes.push(...(j['@graph'] || [j]));
      } catch {
        nodes.push({ __parseError: true });
      }
    }
    return nodes;
  };
  const ldIssues = (nodes) => {
    const issues = [];
    const byId = new Map(nodes.filter((n) => n['@id']).map((n) => [n['@id'], n]));
    for (const n of nodes) {
      if (n.__parseError) { issues.push('JSON خراب در یکی از اسکریپت‌ها'); continue; }
      const types = (Array.isArray(n['@type']) ? n['@type'] : [n['@type']]).join(',');
      const aggCount = Array.isArray(n.aggregateRating) ? n.aggregateRating.length : n.aggregateRating ? 1 : 0;
      if (aggCount > 1) issues.push(`${types}: ${aggCount}× aggregateRating در یک نود (R1)`);
      if (types.includes('Review') && aggCount > 0) issues.push('Review: aggregateRating مستقیم غیرمجاز (R2)');
      if (n.itemReviewed?.['@id'] && byId.get(n.itemReviewed['@id'])?.aggregateRating) {
        issues.push(`${types}: itemReviewed به نود دارای aggregateRating ارجاع می‌دهد (R3 — تله multiple aggregate ratings)`);
      }
    }
    return issues;
  };
  lines.push('');
  lines.push('## سلامت JSON-LD');
  lines.push('');
  lines.push('| صفحه | نودها | مشکلات |');
  lines.push('|---|---|---|');
  for (const p of ['/', '/reviews', '/faq', ...LANDINGS]) {
    try {
      const res = await fetch(`${HOST}${p}`, { signal: AbortSignal.timeout(15000) });
      const nodes = ldNodes(await res.text());
      const issues = ldIssues(nodes);
      if (issues.length) problems++;
      lines.push(`| ${p} | ${nodes.length} | ${issues.length ? '❌ ' + issues.join('؛ ') : '✅ سالم'} |`);
    } catch (e) {
      lines.push(`| ${p} | ? | خطا: ${e.message.slice(0, 60)} |`);
    }
  }
  // نظر واقعی گوگل برای ریچ‌ریزالت /reviews — از آخرین خزش (ممکن است چند روز عقب باشد)
  try {
    const r = await inspectUrl(SITE, `${HOST}/reviews`);
    const rr = r.inspectionResult?.richResultsResult || {};
    const types = (rr.richResultTypes || []).map((t) => `${t.type || '?'}=${t.verdict || '?'}`).join('، ') || '—';
    lines.push('');
    lines.push(`- ریچ‌ریزالت /reviews از آخرین خزش گوگل: ${rr.verdict || '?'} (${types})`);
  } catch (e) {
    lines.push(`- ریچ‌ریزالت /reviews: خطا: ${e.message.slice(0, 60)}`);
  }

  lines.push('');
  lines.push(`**جمع‌بندی:** ${problems === 0 ? '✅ همه‌چیز سالم' : '⚠️ ' + problems + ' مشکل پیدا شد'}`);

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
