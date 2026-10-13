#!/bin/bash
# ============================================================
# host-deploy v2 — نصب روی هاست ایران (cPanel) در ~/bin/deploy.sh
#
# معماری Pull: هاست خودش باندل را از GitHub Releases می‌کشد.
# باندل دو تکه است:
#   runtime-*.tar.gz  → node_modules (فقط وقتی وابستگی‌ها عوض شوند دانلود می‌شود)
#   app-*.tar.gz      → کد و صفحات (هر دیپلوی، فقط چند مگ)
# manifest.txt می‌گوید کدام فایل‌ها؛ دانلودها قابل ادامه (resume) هستند.
# ============================================================
set -euo pipefail

REPO="vahidaskari1365/drpedrambakhshaei"
APP_DIR="$HOME/drpedram-app"
BASE_URL="https://github.com/$REPO/releases/latest/download"

mkdir -p "$APP_DIR/tmp"
cd "$APP_DIR"

# ۱) مانيفست نسخه فعلی گیت‌هاب (چند صد بایت)
if ! curl -4 -sL --retry 3 --retry-delay 5 --max-time 60 -o .manifest.new "$BASE_URL/manifest.txt"; then
  echo "$(date '+%F %T') WARN: github unreachable — skip this round"
  exit 0
fi
RT_NEW=$(grep '^runtime=' .manifest.new | cut -d= -f2)
AP_NEW=$(grep '^app='     .manifest.new | cut -d= -f2)
if [ -z "${RT_NEW:-}" ] || [ -z "${AP_NEW:-}" ]; then
  echo "$(date '+%F %T') WARN: bad manifest — skip this round"
  exit 0
fi
RT_OLD=$(grep '^runtime=' .deploy-manifest 2>/dev/null | cut -d= -f2 || echo "")
AP_OLD=$(grep '^app='     .deploy-manifest 2>/dev/null | cut -d= -f2 || echo "")

# پاک‌سازی فایل‌های نیمه‌دانلود قدیمی (بیش از ۲ روز)
find . -maxdepth 1 -name '.part-*' -mtime +2 -delete 2>/dev/null || true

pull() { # $1=asset-name
  echo "$(date '+%F %T') downloading $1 ..."
  curl -4 -L -C - --retry 5 --retry-delay 5 --retry-all-errors --max-time 2400 \
    -o ".part-$1" "$BASE_URL/$1"
  tar -xzf ".part-$1" -C "$APP_DIR"
  rm -f ".part-$1"
}

CHANGED=0

# ۲) runtime base — فقط وقتی وابستگی‌ها/اسکیمای دیتابیس عوض شده باشند
if [ "$RT_NEW" != "$RT_OLD" ]; then
  pull "$RT_NEW"
  CHANGED=1
fi

# ۳) app — در هر بیلد جدید
if [ "$AP_NEW" != "$AP_OLD" ]; then
  pull "$AP_NEW"
  CHANGED=1
fi

if [ "$CHANGED" = "0" ]; then
  echo "$(date '+%F %T') up-to-date"
  rm -f .manifest.new
  exit 0
fi

# ۴) ثبت نسخه نصب‌شده و ری‌استارت Passenger
cp .manifest.new .deploy-manifest
rm -f .manifest.new
date +%s > "$APP_DIR/tmp/restart.txt"
echo "$(date '+%F %T') DEPLOYED OK  (runtime=$RT_NEW app=$AP_NEW)"
