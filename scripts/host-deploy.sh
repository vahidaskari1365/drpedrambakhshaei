#!/bin/bash
# ============================================================
# host-deploy — نصب روی هاست ایران (cPanel)
# آخرین باندل منتشرشده در GitHub Releases را می‌کشد، استخراج
# می‌کند و با tmp/restart.txt به Passenger فرمان ری‌استارت می‌دهد.
#
# مسیر پایدار: هاست ← گیت‌هاب (دانلود از داخل ایران پایدار است؛
# برخلاف FTP از گیت‌هاب ← هاست که فایروال/مسیر بین‌الملل قطعش می‌کند)
# ============================================================
set -euo pipefail

REPO="vahidaskari1365/drpedrambakhshaei"
APP_DIR="$HOME/drpedram-app"
URL="https://github.com/$REPO/releases/latest/download/deploy-bundle.tar.gz"
MARK_FILE="$APP_DIR/.deploy-mark"

mkdir -p "$APP_DIR"
cd "$APP_DIR"

# نشانه‌ی نسخه = اندازه + تاریخ فایل باندل روی گیت‌هاب (بدون نیاز به هیچ توکنی)
NEW_MARK=$(curl -4 -sIL --max-time 30 "$URL" \
  | tr -d '\r' \
  | grep -iE '^(content-length|last-modified):' \
  | tr -d ' ' | tr 'A-Z' 'a-z' | sort | tr '\n' ' ' || true)

OLD_MARK=$(cat "$MARK_FILE" 2>/dev/null || echo "")

if [ -z "$NEW_MARK" ]; then
  echo "$(date '+%F %T') WARN: github unreachable — skip this round"
  exit 0
fi

if [ "$NEW_MARK" = "$OLD_MARK" ]; then
  echo "$(date '+%F %T') up-to-date"
  exit 0
fi

echo "$(date '+%F %T') new bundle detected -> downloading ..."
curl -4 -L --retry 3 --retry-delay 5 --max-time 2400 \
  -o "$APP_DIR/.bundle.part" "$URL"

tar -xzf "$APP_DIR/.bundle.part" -C "$APP_DIR"
rm -f "$APP_DIR/.bundle.part"
printf '%s' "$NEW_MARK" > "$MARK_FILE"
mkdir -p "$APP_DIR/tmp"
date +%s > "$APP_DIR/tmp/restart.txt"

echo "$(date '+%F %T') DEPLOYED OK  (mark: $NEW_MARK)"
