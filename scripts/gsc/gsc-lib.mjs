// اتصال به Google Search Console API با سرویس اکانت (JWT → Access Token)
// بدون هیچ وابستگی خارجی — فقط node:crypto و fetch
import crypto from 'node:crypto';
import fs from 'node:fs';

const KEY_PATH = process.env.GSC_KEY_PATH || '/home/z/my-project/secrets/gsc-service-account.json';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const API = 'https://searchconsole.googleapis.com/webmasters/v3';
const SCOPE = 'https://www.googleapis.com/auth/webmasters'; // خواندن + مدیریت نقشه سایت

let cachedToken = null; // { token, exp }

function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function loadKey() {
  return JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
}

export async function getToken() {
  if (cachedToken && cachedToken.exp > Date.now() / 1000 + 120) return cachedToken.token;
  const key = loadKey();
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(
    JSON.stringify({
      iss: key.client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(`${header}.${claim}`);
  const sig = b64url(signer.sign(key.private_key));
  const jwt = `${header}.${claim}.${sig}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`گرفتن توکن گوگل ناموفق بود (${res.status}): ${text}`);
  }
  const data = await res.json();
  cachedToken = { token: data.access_token, exp: now + (data.expires_in || 3600) };
  return cachedToken.token;
}

export async function gscFetch(url, options = {}) {
  const token = await getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GSC API ${res.status}: ${text}`);
  }
  return res.json();
}

export function listSites() {
  return gscFetch(`${API}/sites`);
}

export function searchAnalytics(siteUrl, body) {
  return gscFetch(`${API}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function listSitemaps(siteUrl) {
  return gscFetch(`${API}/sites/${encodeURIComponent(siteUrl)}/sitemaps`);
}

export function inspectUrl(siteUrl, url) {
  return gscFetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    body: JSON.stringify({ siteUrl, inspectionUrl: url, languageCode: 'fa' }),
  });
}

export function isoDaysAgo(n) {
  const d = new Date(Date.now() - n * 86400000);
  return d.toISOString().slice(0, 10);
}
