// GEO/HTML audit scanner for drpedrambakhshaei.com
const BASE = 'https://drpedrambakhshaei.com';
const PATHS = ['/', '/jaw-surgery', '/chin-surgery', '/dental-implant', '/implant-pasdaran', '/faq', '/prices', '/about'];

function extract(tag, html, attr = null) {
  const re = attr ? new RegExp(`<${tag}[^>]*${attr}=["']([^"']*)["'][^>]*>`, 'gi') : new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'gi');
  const out = [];
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

async function analyze(path) {
  const res = await fetch(BASE + path, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GeoAudit/1.0)' } });
  const html = await res.text();
  const title = (extract('title', html)[0] || '').trim();
  const desc = (html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) || [])[1] || '';
  const canonical = (html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) || [])[1] || '';
  const robotsMeta = (html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i) || [])[1] || '';
  const h1s = extract('h1', html).map(x => x.replace(/<[^>]+>/g, '').trim());
  const h2s = extract('h2', html).map(x => x.replace(/<[^>]+>/g, '').trim());
  const h3s = extract('h3', html).map(x => x.replace(/<[^>]+>/g, '').trim());
  const jsonLd = [];
  const ldRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = ldRe.exec(html))) {
    try { const j = JSON.parse(m[1].trim()); jsonLd.push(j['@graph'] ? j['@graph'].map(g => g['@type']) : j['@type']); } catch (e) { jsonLd.push('PARSE_ERROR'); }
  }
  const bodyHtml = (html.match(/<body[^>]*>([\s\S]*?)<\/body>/i) || [,''])[1];
  const text = bodyHtml.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text.split(' ').filter(w => w.length > 1).length;
  const imgs = extract('img', html, 'src').length;
  const imgAlt = (html.match(/<img[^>]*alt=["'][^"']{4,}["']/gi) || []).length;
  const videos = /<video|youtube|aparat\.com\/embed|player\.aparat/gi.test(html);
  const tables = (html.match(/<table/gi) || []).length;
  const uls = (html.match(/<ul/gi) || []).length;
  const faqBlocks = /FAQPage|سوالات متداول|پرسش‌های متداول/gi.test(html);
  const dates = { published: (html.match(/datePublished["']?\s*[:=]\s*["']([^"']+)["']/i) || [])[1] || '', modified: (html.match(/dateModified["']?\s*[:=]\s*["']([^"']+)["']/i) || [])[1] || '' };
  const author = (html.match(/"author"\s*:\s*\{[^}]*?"name"\s*:\s*"([^"]+)"/i) || [])[1] || '';
  const lang = (html.match(/<html[^>]*lang=["']([^"']*)["']/i) || [])[1] || '';
  const dir = (html.match(/<html[^>]*dir=["']([^"']*)["']/i) || [])[1] || '';
  const firstText = text.slice(0, 300);
  const paras = bodyHtml.replace(/<script[\s\S]*?<\/script>/gi, '').match(/<p[^>]*>[\s\S]*?<\/p>/gi) || [];
  const pWords = paras.map(p => p.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w.length > 1).length);
  const citable = pWords.filter(w => w >= 100 && w <= 200).length;
  const shortParas = pWords.filter(w => w >= 1 && w <= 60).length;

  return { path, status: res.status, title: title.slice(0, 90), desc: desc.slice(0, 120), canonical, robotsMeta, lang, dir, h1s: h1s.slice(0, 2), h2Count: h2s.length, h2s: h2s.slice(0, 12), h3Count: h3s.length, jsonLd, words, imgs, imgAlt, videos, tables, uls, faqBlocks, dates, author: String(author).slice(0, 60), citable, shortParas, firstText: firstText.slice(0, 200) };
}

for (const p of PATHS) {
  try {
    const r = await analyze(p);
    console.log(JSON.stringify(r, null, 1));
  } catch (e) {
    console.log(JSON.stringify({ path: p, error: e.message }));
  }
}
