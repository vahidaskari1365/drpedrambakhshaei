#!/bin/bash
# ============================================================
# host-deploy v3 — نصب روی هاست ایران (cPanel) در ~/bin/deploy.sh
#
# معماری Pull: هاست خودش باندل را از GitHub Releases می‌کشد.
# باندل دو تکه است:
#   runtime-*.tar.gz  → node_modules (فقط وقتی وابستگی‌ها عوض شوند دانلود می‌شود)
#   app-*.tar.gz      → کد و صفحات (هر دیپلوی، فقط چند مگ)
# manifest.txt می‌گوید کدام فایل‌ها؛ دانلودها قابل ادامه (resume) هستند.
#
# v3: قفل ضداجرای همزمان (کرون + اجرای دستی روی یک فایل part می‌نوشتند و
#     tar با «trailing garbage» می‌مرد) + نام part یکتا برای هر اجرا +
#     تست سلامت gzip قبل از بازکردن + جایگزینی کامل node_modules
#     (ترمیم خرابی ناشی از npm install روی هاست)
# ============================================================
set -euo pipefail

REPO="${DEPLOY_REPO:-vahidaskari1365/drpedrambakhshaei}"
APP_DIR="$HOME/drpedram-app"
BASE_URL="https://github.com/$REPO/releases/latest/download"

mkdir -p "$APP_DIR/tmp"
cd "$APP_DIR"

# ۰) قفل ضداجرای همزمان — دو curl همزمان روی یک فایل = فایل خراب
if command -v flock >/dev/null 2>&1; then
  exec 9>"$APP_DIR/.deploy.lock"
  if ! flock -n 9; then
    echo "$(date '+%F %T') another deploy is running — skip this round"
    exit 0
  fi
else
  if ! mkdir "$APP_DIR/.deploy.lockdir" 2>/dev/null; then
    echo "$(date '+%F %T') another deploy is running — skip this round"
    exit 0
  fi
  trap 'rmdir "$APP_DIR/.deploy.lockdir" 2>/dev/null' EXIT
fi

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

# پاک‌سازی فایل‌های نیمه‌دانلود قدیمی (بیش از ۲ روز) — نام part الان یکتاست
find . -maxdepth 1 -name '.part-*' -mtime +2 -delete 2>/dev/null || true

# سازگاری با curl قدیمی (CentOS/CloudLinux 7.29): --retry-all-errors فقط در curl >= 7.71 هست
CURL_RETRY_FLAGS="--retry 5 --retry-delay 5"
CURL_VER=$(curl --version 2>/dev/null | head -1 | awk '{print $2}')
if [ -n "${CURL_VER:-}" ]; then
  CV_MAJ=${CURL_VER%%.*}
  CV_REST=${CURL_VER#*.}
  CV_MIN=${CV_REST%%.*}
  if [ "${CV_MAJ:-0}" -gt 7 ] 2>/dev/null || { [ "${CV_MAJ:-0}" = 7 ] && [ "${CV_MIN:-0}" -ge 71 ] 2>/dev/null; }; then
    CURL_RETRY_FLAGS="$CURL_RETRY_FLAGS --retry-all-errors"
  fi
fi

download_verified() { # $1=asset-name → مسیر فایل part سالم را «فقط» در stdout چاپ می‌کند
  local PART=".part-$1.$$"
  # پیام‌های پیشرفت باید به stderr بروند — اگر stdout بروند داخل نام فایل capture می‌شوند!
  echo "$(date '+%F %T') downloading $1 ..." >&2
  # shellcheck disable=SC2086
  curl -4 -L -C - $CURL_RETRY_FLAGS --max-time 2400 -o "$PART" "$BASE_URL/$1"
  # تست سلامت کل جریان گیزپ — فایل ناقص/دونوع‌نویسی‌شده هرگز باز نمی‌شود
  if ! gzip -t "$PART" 2>/dev/null; then
    echo "$(date '+%F %T') ERROR: $1 corrupt — دوباره deploy.sh بزنید (از سرعت کم ایران، دانلود از سر گرفته می‌شود)" >&2
    rm -f "$PART"
    exit 1
  fi
  printf '%s' "$PART"
}

pull() { # $1=asset-name — دانلود + تست + بازکردن
  local PART
  PART=$(download_verified "$1")
  tar -xzf "$PART" -C "$APP_DIR"
  # robots.txt استاتیکِ کهنه نباید بماند — مسیر داینامیک src/app/robots.ts (با Sitemap و کرالرهای AI) باید سرو شود
  rm -f "$APP_DIR/public/robots.txt"
  rm -f "$PART"
}

CHANGED=0

# ۲) runtime base — فقط وقتی وابستگی‌ها/اسکیمای دیتابیس عوض شده باشند
if [ "$RT_NEW" != "$RT_OLD" ]; then
  RT_PART=$(download_verified "$RT_NEW")
  # محافظ: مسیر part باید دقیقاً یک نام فایل تمیز باشد (نه حاوی پیام لاگ)
  case "$RT_PART" in
    .part-*tar.gz) ;;
    *) echo "$(date '+%F %T') ERROR: bad part path — bug guard" >&2; exit 1 ;;
  esac
  # فهرست کامل آرشیو را هم تست کن (علاوه بر gzip -t)
  if ! tar -tzf "$RT_PART" > /dev/null 2>&1; then
    echo "$(date '+%F %T') ERROR: $RT_PART tar listing failed — دوباره deploy.sh بزنید" >&2
    rm -f "$RT_PART"
    exit 1
  fi
  echo "$(date '+%F %T') runtime changed — clean replacing node_modules ..."
  # جایگزینی کامل نه ادغام: هر ردپای npm install دستی پاک می‌شود
  rm -rf "$APP_DIR/node_modules"
  tar -xzf "$RT_PART" -C "$APP_DIR"
  rm -f "$RT_PART"
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
