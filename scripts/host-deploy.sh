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
# v3.2: محافظ دانلود منجمد (--speed-limit/--speed-time) برای کرون ۳ دقیقه‌ای —
#     اگر سرعت زیر ۱۰KB/s افت کند بعد از ۶۰ ثانیه اتصال قطع و با resume تلاش
#     مجدد می‌شود؛ دیگر یک دانلود خواب‌مانده قفل را تا ۴۰ دقیقه نگه نمی‌دارد
# v3.3: ایندکس خودکار صفحات جدید — بعد از هر اجرا نقشه سایت زنده با نسخه قبلی
#     مقایسه می‌شود و فقط URLهای تازه به IndexNow سابمیت می‌شوند
#     (Bing/Copilot/ChatGPT Search/DuckDuckGo/Yandex). خطا فقط لاگ می‌شود و
#     هیچ‌وقت دیپلوی را نمی‌شکند.
# v3.4: کشف عملی — بینگ تا fetch نکردن فایل کلید روی endpoint مشترک 403 می‌دهد
#     (یاندکس همان کلید را 200/202 قبول می‌کند) → پس از ردشدن endpoint مشترک،
#     fallback به yandex.com/indexnow. baseline فقط در موفقیت جابه‌جا می‌شود
#     (در شکست، دفعه بعد همان URLها retry می‌شوند) + throttle ۳۰ دقیقه‌ای
#     ضداسپم روی کرون ۲ دقیقه‌ای + بوت‌استرپ: تا اولین سابمیت موفق، کل نقشه
#     سابمیت می‌شود (.indexnow-ok فقط بعد از اولین موفقیت ساخته می‌شود).
# v3.5: quota-fix — کشف عملی: «user block limit reached» یعنی سهمیه دیسک اکانت
#     پر شده؛ یکی از عوامل رشد دیسک، کش بیلد (‎.next/cache) بود که با هر استخراج
#     app انباشته می‌شد (tar ادغام می‌کند، فایل‌های قدیمی را حذف نمی‌کند).
#     قبل از هر استخراج app کش قدیمی کامل پاک می‌شود — روی هاست هیچ استفاده‌ای
#     ندارد (فقط برای بیلد مجدد مفید است که روی هاست هرگز رخ نمی‌دهد).
# ============================================================
set -euo pipefail

REPO="${DEPLOY_REPO:-vahidaskari1365/drpedrambakhshaei}"
APP_DIR="$HOME/drpedram-app"
BASE_URL="https://github.com/$REPO/releases/latest/download"
SITE="https://drpedrambakhshaei.com"
INKEY="f4d23335419cfecadfeb9086ec46de47"  # کلید عمومی IndexNow (فایل key.txt روی خود سایت است)

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
  # نام part پایدار (بدون PID) — پیشرفت دانلود بین اجراهای کرون ادامه می‌یابد
  # (v3 نام یکتا با $$ می‌گذاشت؛ نتیجه: هر اجرای کرون از صفر شروع می‌کرد و
  #  باندل‌های بزرگ مثل runtime ۳۰+ مگ هرگز کامل نمی‌شدند. قفل flock هم اجرای
  #  دستی و هم کرون را مهار می‌کند، پس نام پایدار امن است.)
  local PART=".part-$1"
  # پیام‌های پیشرفت باید به stderr بروند — اگر stdout بروند داخل نام فایل capture می‌شوند!
  echo "$(date '+%F %T') downloading $1 ..." >&2
  # محافظ کانکشن منجمد: زیر ۱۰KB/s برای ۶۰ ثانیه = قطع و retry با resume
  # (timeout جزو خطاهای transient است — با --retry حتی روی curl 7.29 هم retry می‌شود)
  # shellcheck disable=SC2086
  curl -4 -L -C - $CURL_RETRY_FLAGS --speed-limit 10240 --speed-time 60 --max-time 2400 -o "$PART" "$BASE_URL/$1"
  # تست سلامت کل جریان گیزپ — فایل ناقص/دونوع‌نویسی‌شده هرگز باز نمی‌شود
  if ! gzip -t "$PART" 2>/dev/null; then
    echo "$(date '+%F %T') ERROR: $1 corrupt — پارت ناقص حذف شد؛ اجرای بعدی از سر می‌گیرد" >&2
    rm -f "$PART"
    exit 1
  fi
  printf '%s' "$PART"
}

pull() { # $1=asset-name — دانلود + تست + بازکردن
  local PART
  PART=$(download_verified "$1")
  # v3.5: کش بیلد قبلی باید قبل از استخراج پاک شود — tar ادغام می‌کند و
  # فایل‌های cache کهنه باقی می‌مانند و دیسک را می‌خورند (quota reached)
  rm -rf "$APP_DIR/.next/cache"
  tar -xzf "$PART" -C "$APP_DIR"
  # robots.txt استاتیکِ کهنه نباید بماند — مسیر داینامیک src/app/robots.ts (با Sitemap و کرالرهای AI) باید سرو شود
  rm -f "$APP_DIR/public/robots.txt"
  rm -f "$PART"
}

# ── v3.3: ایندکس خودکار صفحات جدید ──────────────────────────────
# نقشه سایت زنده را می‌گیرد، با نسخه قبل مقایسه می‌کند و فقط URLهای تازه را
# به IndexNow می‌دهد. چون کرون هر ۲ دقیقه اجرا می‌شود، هر صفحه جدید (لندینگ
# جدید از دیپلوی یا مقاله جدید پنل ادمین) حداکثر چند دقیقه بعد سابمیت می‌شود.
ping_new_urls() {
  # throttle: حداکثر هر ۳۰ دقیقه یک تلاش سابمیت — کرون ۲ دقیقه‌ای است و در دوره
  # 403 بینگ نباید هر ۲ دقیقه کل نقشه را اسپم کنیم
  local NOW LAST
  NOW=$(date +%s)
  LAST=$(cat .indexnow-last 2>/dev/null || echo 0)
  if [ $((NOW - LAST)) -lt 1800 ]; then return 0; fi
  local SM=".sitemap.$$.xml"
  curl -4 -sL --max-time 60 -o "$SM" "$SITE/sitemap.xml" 2>/dev/null || { rm -f "$SM"; return 0; }
  grep -o '<loc>[^<]*</loc>' "$SM" | sed -e 's|^<loc>||' -e 's|</loc>$||' | sort -u > .sitemap-urls.new || true
  rm -f "$SM"
  [ -s .sitemap-urls.new ] || { rm -f .sitemap-urls.new; return 0; }
  # URLهای تازه = در نسخه قبل نبودند
  # بوت‌استرپ: تا اولین سابمیت «موفق» (.indexnow-ok) کل نقشه سابمیت می‌شود —
  # اگر اولین تلاش 403 بخورد، دفعه بعد دوباره کل نقشه تلاش می‌شود
  local NEW_LIST
  if [ -f .indexnow-ok ]; then
    NEW_LIST=$(comm -13 .sitemap-urls .sitemap-urls.new 2>/dev/null || cat .sitemap-urls.new)
  else
    NEW_LIST=$(cat .sitemap-urls.new)
  fi
  if [ -n "$NEW_LIST" ]; then
    local JSON=".indexnow.$$.json" FIRST=1 U CODE
    {
      printf '{"host":"drpedrambakhshaei.com","key":"%s","keyLocation":"https://drpedrambakhshaei.com/%s.txt","urlList":[' "$INKEY" "$INKEY"
      while IFS= read -r U; do
        [ -n "$U" ] || continue
        [ "$FIRST" -eq 1 ] || printf ','
        printf '"%s"' "$U"
        FIRST=0
      done <<< "$NEW_LIST"
      printf ']}'
    } > "$JSON"
    date +%s > .indexnow-last
    local EP CODE
    EP='https://api.indexnow.org/indexnow'
    CODE=$(curl -4 -sL --max-time 90 -o /dev/null -w '%{http_code}' -X POST \
      -H 'Content-Type: application/json; charset=utf-8' --data-binary @"$JSON" \
      "$EP" 2>/dev/null || echo 000)
    if [ "$CODE" != "200" ] && [ "$CODE" != "202" ]; then
      # endpoint مشترک رد کرد (تا validation کلید، بینگ 403 می‌دهد)
      # → همان درخواست با endpoint یاندکس (کلید را همین حالا قبول می‌کند)
      EP='https://yandex.com/indexnow'
      CODE=$(curl -4 -sL --max-time 90 -o /dev/null -w '%{http_code}' -X POST \
        -H 'Content-Type: application/json; charset=utf-8' --data-binary @"$JSON" \
        "$EP" 2>/dev/null || echo 000)
    fi
    if [ "$CODE" = "200" ] || [ "$CODE" = "202" ]; then
      echo "$(date '+%F %T') indexnow: $(printf '%s\n' "$NEW_LIST" | wc -l | tr -d ' ') new URL(s) submitted via $EP"
      date +%s > .indexnow-ok
      # baseline فقط در موفقیت جابه‌جا می‌شود — در شکست، دفعه بعد همان URLها retry می‌شوند
      mv .sitemap-urls.new .sitemap-urls
    else
      echo "$(date '+%F %T') WARN: indexnow ping failed (http $CODE) — retry in ~30min"
      rm -f .sitemap-urls.new
    fi
    rm -f "$JSON"
  else
    mv .sitemap-urls.new .sitemap-urls
  fi
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
    echo "$(date '+%F %T') ERROR: $RT_PART tar listing failed — پارت حذف شد؛ اجرای بعدی از سر می‌گیرد" >&2
    rm -f "$RT_PART"
    exit 1
  fi
  echo "$(date '+%F %T') runtime changed — clean replacing node_modules ..."
  # جایگزینی کامل نه ادغام: هر ردپای npm install دستی پاک می‌شود
  rm -rf "$APP_DIR/node_modules"
  tar -xzf "$RT_PART" -C "$APP_DIR"
  rm -f "$RT_PART"
  # commit فوری runtime در manifest محلی — اگر دانلود app بعدی شکست بخورد،
  # اجرای بعدی runtime تازه‌نصب را دوباره دانلود نمی‌کند (مسیر ایران هر مگ می‌ارزد)
  if [ -f .deploy-manifest ]; then
    sed -i "s|^runtime=.*|runtime=$RT_NEW|" .deploy-manifest
  else
    printf 'runtime=%s\n' "$RT_NEW" > .deploy-manifest
  fi
  CHANGED=1
fi

# ۳) app — در هر بیلد جدید
if [ "$AP_NEW" != "$AP_OLD" ]; then
  pull "$AP_NEW"
  if [ -f .deploy-manifest ]; then
    sed -i "s|^app=.*|app=$AP_NEW|" .deploy-manifest
  else
    printf 'runtime=%s\napp=%s\n' "$RT_NEW" "$AP_NEW" > .deploy-manifest
  fi
  CHANGED=1
fi

if [ "$CHANGED" = "0" ]; then
  echo "$(date '+%F %T') up-to-date"
  rm -f .manifest.new
  ping_new_urls
  exit 0
fi

# ۴) ری‌استارت Passenger (مانیفست قبلاً جزءبه‌جز به‌روز شده است)
rm -f .manifest.new
date +%s > "$APP_DIR/tmp/restart.txt"
echo "$(date '+%F %T') DEPLOYED OK  (runtime=$RT_NEW app=$AP_NEW)"
ping_new_urls
