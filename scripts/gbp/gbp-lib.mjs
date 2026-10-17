// اتصال به Google Business Profile API با OAuth2 (توکن رفرش دائمی)
// GBP با سرویس اکانت کار نمی‌کند — یک بار کاربر Allow می‌کند و refresh token می‌ماند.
//
// پیش‌نیاز: فایل secrets/gbp-oauth-client.json (دانلود OAuth Client از نوع Desktop)
//
// فرمان‌ها:
//   node scripts/gbp/gbp-lib.mjs url              ← ساخت لینک تأیید برای کاربر
//   node scripts/gbp/gbp-lib.mjs exchange <کد>    ← تبدیل کد به refresh token (یک بار)
//   node scripts/gbp/gbp-lib.mjs accounts         ← لیست اکانت‌های بیزینس
//   node scripts/gbp/gbp-lib.mjs locations        ← لیست شعب/مطب‌ها
//   node scripts/gbp/gbp-lib.mjs reviews          ← لیست نظرات
//   node scripts/gbp/gbp-lib.mjs reply <reviewName> <متن>  ← پاسخ به نظر
//   node scripts/gbp/gbp-lib.mjs post <متن پست>   ← انتشار پست محلی
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SECRET_DIR = path.resolve(__dirname, '../../secrets');
const CLIENT_FILE = path.join(SECRET_DIR, 'gbp-oauth-client.json');
const TOKEN_FILE = path.join(SECRET_DIR, 'gbp-refresh-token.json');

const REDIRECT_URI = 'http://localhost:1';
const SCOPE = 'https://www.googleapis.com/auth/business.manage';

function loadClient() {
  const raw = JSON.parse(fs.readFileSync(CLIENT_FILE, 'utf8'));
  const c = raw.installed || raw.web || raw;
  if (!c.client_id || !c.client_secret) throw new Error('فایل کلاینت OAuth معتبر نیست');
  return c;
}

function saveTokens(t) {
  fs.mkdirSync(SECRET_DIR, { recursive: true });
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(t, null, 2), { mode: 0o600 });
}

function loadTokens() {
  if (!fs.existsSync(TOKEN_FILE)) throw new Error('هنوز refresh token نداریم — اول مرحله exchange را اجرا کن');
  return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
}

export function consentUrl() {
  const c = loadClient();
  const p = new URLSearchParams({
    client_id: c.client_id,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline', // برای گرفتن refresh token
    prompt: 'consent',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${p.toString()}`;
}

export async function exchangeCode(codeOrUrl) {
  const m = String(codeOrUrl).match(/code=([^&\s]+)/);
  const code = m ? decodeURIComponent(m[1]) : String(codeOrUrl).trim();
  const c = loadClient();
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: c.client_id,
      client_secret: c.client_secret,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.refresh_token) {
    throw new Error(`تبدیل کد ناموفق (${res.status}): ${JSON.stringify(data).slice(0, 300)}`);
  }
  saveTokens({
    refresh_token: data.refresh_token,
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in || 3600) * 1000,
  });
  return '✅ refresh token ذخیره شد — از این به بعد همیشه وصلیم';
}

export async function getAccessToken() {
  const t = loadTokens();
  if (t.access_token && t.expires_at > Date.now() + 120_000) return t.access_token;
  const c = loadClient();
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: t.refresh_token,
      client_id: c.client_id,
      client_secret: c.client_secret,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`تجدید توکن ناموفق: ${JSON.stringify(data).slice(0, 200)}`);
  const fresh = { ...t, access_token: data.access_token, expires_at: Date.now() + (data.expires_in || 3600) * 1000 };
  saveTokens(fresh);
  return fresh.access_token;
}

export async function gbp(pathAndQuery, options = {}, version = 'mybusiness') {
  const token = await getAccessToken();
  const base = {
    mybusiness: 'https://mybusiness.googleapis.com/v4',
    account: 'https://mybusinessaccountmanagement.googleapis.com/v1',
    info: 'https://mybusinessbusinessinformation.googleapis.com/v1',
  }[version];
  const res = await fetch(`${base}${pathAndQuery}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`GBP ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}

export async function listAccounts() {
  return gbp('/accounts', {}, 'account');
}

export async function listLocations() {
  const acc = (await listAccounts()).accounts?.[0]?.name;
  if (!acc) throw new Error('هیچ اکانت بیزینسی پیدا نشد');
  return gbp(
    `${acc}/locations?readMask=name,title,metadata,profile,websiteUri,phoneNumbers&pageSize=50`,
    {},
    'info',
  );
}

export async function listReviews(locationName = null) {
  const loc = locationName || (await listLocations()).locations?.[0]?.name;
  if (!loc) throw new Error('هیچ مطبی پیدا نشد');
  return gbp(`${loc}/reviews?pageSize=50`);
}

export async function replyReview(reviewName, text) {
  return gbp(`${reviewName}/reply`, { method: 'PUT', body: JSON.stringify({ comment: text }) });
}

export async function createLocalPost(locationName, text, ctaUrl = 'https://drpedrambakhshaei.com/') {
  return gbp(
    `${locationName}/localPosts`,
    {
      method: 'POST',
      body: JSON.stringify({
        languageCode: 'fa',
        summary: text,
        callToAction: { actionType: 'LEARN_MORE', url: ctaUrl },
      }),
    },
  );
}

// CLI
if (process.argv[1] && process.argv[1].endsWith('gbp-lib.mjs')) {
  const [cmd, ...args] = process.argv.slice(2);
  const run = {
    url: () => console.log(consentUrl()),
    exchange: async () => console.log(await exchangeCode(args[0])),
    accounts: async () => console.log(JSON.stringify(await listAccounts(), null, 2)),
    locations: async () => console.log(JSON.stringify(await listLocations(), null, 2)),
    reviews: async () => console.log(JSON.stringify(await listReviews(), null, 2)),
    reply: async () => console.log(JSON.stringify(await replyReview(args[0], args[1]), null, 2)),
    post: async () => {
      const loc = (await listLocations()).locations?.[0]?.name;
      console.log(JSON.stringify(await createLocalPost(loc, args.join(' ')), null, 2));
    },
  }[cmd];
  if (!run) {
    console.log('فرمان نامعتبر. استفاده: url | exchange | accounts | locations | reviews | reply | post');
    process.exit(1);
  }
  run().catch((e) => {
    console.error('❌', e.message);
    process.exit(1);
  });
}
