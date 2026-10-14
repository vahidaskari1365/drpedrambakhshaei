#!/bin/bash
# ============================================================
# release.sh — سمتِ بیلدِ دیپلوی (اجرای دستی از سندباکس/لوکال)
#
# کاری که می‌کند:
#   ۱) کلاینت Prisma را موقتاً به PostgreSQL سوییچ می‌کند (اسکیمای موقت، بدون دست‌زدن به ریپو)
#   ۲) بیلد standalone می‌گیرد (bun run build)
#   ۳) دو باندل می‌سازد:
#        runtime-<ts>.tar.gz  = node_modules (خروجی tracing بیلد) + db/template.db
#        app-<ts>.tar.gz      = standalone بدون node_modules + public + package.json + prisma/schema.prisma
#        manifest.txt         = دو خط runtime= / app= که host-deploy.sh می‌خواند
#   ۴) فقط با RELEASE_CONFIRM=yes در GitHub Releases تگ auto-v<ts> را منتشر می‌کند؛
#      هاست ایران با scripts/host-deploy.sh از releases/latest/download آنها را می‌کشد.
#
# هشدار: آپلود LIVE است — هاست در چرخه کرون بعدی (تا ۲۰ دقیقه) دیپلوی می‌کند!
# انتشار واقعی:  RELEASE_CONFIRM=yes bash scripts/release.sh
# ============================================================
set -euo pipefail

REPO="vahidaskari1365/drpedrambakhshaei"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TS="$(date -u +%Y%m%d-%H%M%S)"
RT_NAME="runtime-$TS.tar.gz"
AP_NAME="app-$TS.tar.gz"
OUT_DIR="$ROOT/release-out"
STAGE="$(mktemp -d)"
# نسخه PG اسکیما — باید داخل پروژه باشد تا پرisma ریشه پروژه را پیدا کند؛ در trap حذف می‌شود
TMP_SCHEMA="$ROOT/prisma/schema.production.prisma"
mkdir -p "$OUT_DIR"

# پاک‌سازی در هر حالت (موفق/شکست/سیگنال): برگرداندن کلاینت SQLite برای سندباکس + حذف فایل‌های موقت
cleanup() {
  echo "» بازگردانی کلاینت Prisma به SQLite (حالت توسعه سندباکس)..."
  bunx prisma generate >/dev/null 2>&1 || echo "  WARN: بازگردانی ناموفق — دستی اجرا کنید: bunx prisma generate"
  rm -rf "$STAGE"
  rm -f "$TMP_SCHEMA"
}
trap cleanup EXIT

# ---------- دروازه امنیت: پیش‌فرض DRY-RUN ----------
MODE="DRY-RUN"
if [ "${RELEASE_CONFIRM:-}" = "yes" ]; then MODE="LIVE"; fi
if [ "$MODE" = "DRY-RUN" ]; then
  cat <<'EOF'

  ============================================================
  !!! حالت DRY-RUN — هیچ فایلی آپلود نمی‌شود !!!
  بیلد و باندل فقط محلی در release-out/ ساخته می‌شود.
  یادآوری: آپلود در Releases بلافاصله LIVE است و هاست ایران
  در چرخه کرون بعدی همان نسخه را pull و دیپلوی می‌کند.
  برای انتشار واقعی:  RELEASE_CONFIRM=yes bash scripts/release.sh
  ============================================================

EOF
fi

# ---------- ۱) سوییچ موقت Prisma به PostgreSQL ----------
echo "» [۱/۴] سوییچ موقت Prisma به PostgreSQL (کپی موقت اسکیما)..."
cp prisma/schema.prisma "$TMP_SCHEMA"
sed -i 's/provider = "sqlite"/provider = "postgresql"/' "$TMP_SCHEMA"
bunx prisma generate --schema "$TMP_SCHEMA"

# ---------- ۲) بیلد standalone ----------
echo "» [۲/۴] بیلد standalone (کلاینت PG؛ مثل CI)..."
DATABASE_URL="postgresql://build:build@localhost:5432/build" bun run build
test -f .next/standalone/server.js || { echo "ERR: .next/standalone/server.js نیست"; exit 1; }
test -d .next/standalone/.next/static || { echo "ERR: static assets نیست"; exit 1; }
test -d .next/standalone/public || { echo "ERR: public نیست"; exit 1; }

# ---------- ۳) اسمبل باندل‌ها (مدل‌گرفته از workflow فعلی) ----------
echo "» [۳/۴] اسمبل باندل‌ها..."
B="$STAGE/app"
mkdir -p "$B/tmp"
cp -a .next/standalone/. "$B/"
# tracing پوشه‌های غیرلازم ریپو را هم به standalone کشانده — حذف (تأییدشده در ران ۷: همه صفحات 200)
( cd "$B" && rm -rf skills tool-results tests examples scripts docs .github db prisma .agent* *.md )
# دو فایل سورس که geo-agent در اجرا با fs می‌خواند باید در باندل بمانند (بدون آن‌ها ممیزی GEO روی هاست ENOENT می‌دهد)
mkdir -p "$B/src/lib" "$B/src/app"
cp src/lib/site-data.ts "$B/src/lib/site-data.ts"
cp src/app/robots.ts "$B/src/app/robots.ts"
# موتورهای WASM دیتابیس‌های استفاده‌نشده (~۵۵MB) حذف؛ موتور واقعی .so.node می‌ماند
find "$B/node_modules/@prisma/client/runtime" -name '*wasm*' -delete 2>/dev/null || true
test -f "$B"/node_modules/.prisma/client/libquery_engine-*.so.node || { echo "ERR: موتور Prisma یافت نشد"; exit 1; }
# فایل‌های تعمدی برای هاست: اسکیمای PG + package.json
mkdir -p "$B/prisma" && cp "$TMP_SCHEMA" "$B/prisma/schema.prisma"
cp package.json "$B/package.json"
# مرحله runtime: node_modules و db/template.db جدا می‌شوند (هاست فقط با تغییر وابستگی‌ها runtime را می‌کشد)
mkdir -p "$STAGE/rt/db"
mv "$B/node_modules" "$STAGE/rt/node_modules"
cp db/template.db "$STAGE/rt/db/template.db"
tar -czf "$OUT_DIR/$RT_NAME" -C "$STAGE/rt" ./node_modules ./db
tar -czf "$OUT_DIR/$AP_NAME" -C "$B" .
printf 'runtime=%s\napp=%s\n' "$RT_NAME" "$AP_NAME" > "$OUT_DIR/manifest.txt"
echo "  runtime: $RT_NAME ($(du -h "$OUT_DIR/$RT_NAME" | cut -f1))"
echo "  app:     $AP_NAME ($(du -h "$OUT_DIR/$AP_NAME" | cut -f1))"

# ---------- ۴) انتشار (فقط در LIVE) ----------
if [ "$MODE" != "LIVE" ]; then
  echo "» [۴/۴] آپلود رد شد (DRY-RUN). خروجی: $OUT_DIR"
  echo "  انتشار واقعی:  RELEASE_CONFIRM=yes bash scripts/release.sh"
  exit 0
fi
echo "» [۴/۴] انتشار در GitHub Releases (تگ auto-v$TS)..."
# استخراج توکن از remote — هرگز چاپ/echo نمی‌شود
TOKEN="$(git remote get-url origin | sed -n 's#https://[^:]*:\([^@]*\)@.*#\1#p')"
[ -n "$TOKEN" ] || { echo "ERR: توکن در remote origin پیدا نشد"; exit 1; }
API="https://api.github.com/repos/$REPO"
RESP="$STAGE/rel.json"
CODE="$(curl -sS -o "$RESP" -w '%{http_code}' -X POST \
  -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
  "$API/releases" \
  -d "{\"tag_name\":\"auto-v$TS\",\"name\":\"auto-v$TS\",\"body\":\"auto build $(date -u +%F %T)\",\"draft\":false,\"prerelease\":false}")"
if [ "$CODE" = "422" ]; then
  # تگ از قبل وجود دارد — همان release آخر را ادامه می‌دهیم (آپلود assets روی آن)
  CODE="$(curl -sS -o "$RESP" -w '%{http_code}' -H "Authorization: Bearer $TOKEN" "$API/releases/latest")"
  [ "$CODE" = "200" ] || { echo "ERR: گرفتن release موجود ناموفق (HTTP $CODE)"; exit 1; }
elif [ "$CODE" != "201" ]; then
  echo "ERR: ساخت release ناموفق (HTTP $CODE)"; exit 1
fi
UP_RAW="$(sed -n 's/.*"upload_url"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$RESP" | head -1)"
UP="${UP_RAW%%\{*}"   # حذف {?name,label}
[ -n "$UP" ] || { echo "ERR: upload_url در پاسخ نبود"; exit 1; }

up() { # $1=فایل  $2=Content-Type
  C="$(curl -sS -o "$STAGE/up.json" -w '%{http_code}' -X POST \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: $2" \
    --data-binary @"$OUT_DIR/$1" "$UP?name=$1")"
  [ "$C" = "201" ] || { echo "ERR: آپلود $1 ناموفق (HTTP $C)"; exit 1; }
  echo "  asset آپلود شد: $1 ($(du -h "$OUT_DIR/$1" | cut -f1))"
}
up "$RT_NAME" application/gzip
up "$AP_NAME" application/gzip
up manifest.txt text/plain
echo "OK — منتشر شد: https://github.com/$REPO/releases/tag/auto-v$TS"
echo "هاست در چرخه کرون بعدی (تا ۲۰ دقیقه) آن را pull می‌کند."
