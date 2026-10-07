# Worklog — پروژه سایت دکتر پدرام بخشایی

---
Task ID: 1
Agent: main
Task: نصب اسکیل‌ها و استخراج کامل محتوای سایت قدیمی drpedrambakhshaei.com

Work Log:
- کلون ۷ اسکیل از GitHub به /home/z/my-project/skills/: taste-skill-plugin, impeccable, playwright-cli, awesome-design-md, img2threejs, ui-ux-pro-max-skill, claude-seo
- استخراج صفحه اصلی + ۱۰ صفحه وردپرس (درباره، خدمات، سوالات متداول، ۳ صفحه تعرفه) از REST API وردپرس
- decode محتوای vc_raw_html (base64 + URL encode) برای جداول قیمت
- استخراج ۵ عکس مطب از گوگل مپ (لایت موبایل) با کیفیت 900x1200
- استخراج نظرات گوگل: امتیاز ۵٫۰ از ۹ نظر + یک نظر کامل (masome roddehghan - ایمپلنت)
- پیدا کردن پرتره رسمی دکتر (لباس OMFS با نام Dr.Pedram Bakhshaei) از image-search
- استخراج لینک‌های سوشال: t.me/drbakhshaei, wa.me/09302626021, aparat.com/Drpedrambakhshaei, instagram.com/dr.bakhshaei.omfs
- داده‌های ذخیره شده در /home/z/my-project/download/ (old_site.html, all_pages.json, prices_final.txt, page_about.txt, page_faq.txt)

Stage Summary:
- محتوای کامل استخراج شد: بیوگرافی، خدمات (ارتوسرجری/ایمپلنت/دندان نهفته)، جداول قیمت ۱۴۰۵، FAQ، آمار (۱۱+ سال، 15k ایمپلنت، 104 ارتوسرجری، 341 بازسازی)، مهارت‌ها (98% ارتوگناتیک...)
- تلفن: 09302626021 | آدرس: پاسداران، مرکز خرید پاسداران، طبقه ۲ و ۴
- تصاویر در public/uploads/: clinic-photo-1..5.jpg, doctor-portrait.jpg
- لوگوی اصلی سایت قدیمی قابل دانلود نبود → لوگوی SVG مینیمال اپل-استایل ساخته می‌شود
- ۸ نظر باقی‌مانده پشت لاگین گوگل بود → ۱ نظر واقعی + CTA به گوگل مپ

---
Task ID: 2
Agent: main
Task: ساخت سایت جدید Next.js (RTL، اپل‌استایل، سینمایی، PWA)

Work Log:
- فایل داده مرکزی src/lib/site-data.ts با تمام محتوای استخراج‌شده (خدمات، تعرفه‌های ۱۴۰۵، FAQ، نظرات، آمار، گالری)
- layout.tsx: فونت وزیرمتن، RTL کامل، متادیتای SEO کامل (OpenGraph، Twitter، canonical)، JSON-LD Physician schema با aggregateRating 5.0/9
- globals.css: توکن‌های اپل‌استایل (پورسلین + تیل جراحی)، شیشه مات (glass)، گرین سینمایی (grain)، marquee، ریسپکت prefers-reduced-motion
- navbar.tsx: نوبار بیضی شیشه‌ای شناور + اسکرول‌اسپای (pill متحرک layoutId) + منوی موبایل فول‌اسکرین انیمیشنی
- hero.tsx: هیرو سینمایی با پارالاکس اسکرول، شمارنده‌های آماری، چیپ‌های شناور، پرتره واقعی دکتر
- services.tsx: ۳ کارت خدمات با تصاویر AI سینمایی + مارکی برندهای ایمپلنت (CORE1, OSSTEM, NEODENT, ITI, ZIMMER, BIO3)
- works-wheel.tsx + gallery-section.tsx: چرخ سه‌بعدی نمونه کارها (کامپوننت درخواستی کاربر) با ۵ عکس واقعی مطب
- about.tsx: بیوگرافی کامل، مدارک آکادمیک، نوارهای مهارت انیمیشنی، بنر رتبه ممتاز بورد
- prices.tsx: بخش تیره سینمایی با تب‌های قرصی و جدول‌های شیشه‌ای تعرفه ۱۴۰۵ (ایمپلنت/فک/دندان نهفته)
- faq.tsx: آکاردئون ۹ سوال واقعی سایت قدیمی
- reviews.tsx: کارت امتیاز ۵٫۰ گوگل (۹ نظر) + نظر واقعی masome roddehghan + ۳ نمونه placeholder + CTA به گوگل مپ
- contact.tsx: فرم رزرو نوبت (API + Prisma) + اطلاعات تماس + نقشه گوگل + ۴ شبکه اجتماعی واقعی
- footer.tsx: فوتر تیره چسبان (mt-auto) با دسترسی سریع
- API: src/app/api/contact/route.ts با zod validation + rate limiting؛ مدل ContactRequest در Prisma
- PWA: manifest.webmanifest + sw.js (network-first) + آیکون‌های 192/512/maskable با sharp از SVG لوگو
- لوگوی SVG مینیمال (پروفایل صورت + فرم «ب») چون لوگوی اصلی سایت قدیمی از سرور ایران قابل دانلود نبود
- ۴ تصویر سینمایی با AI تولید شد (hero-bg, jawline-art, implant-art, wisdom-art)
- تایید نهایی: lint پاس، بدون خطای کنسول، فرم end-to-end ثبت شد در DB، ریسپانسیو ۳۹۰/۷۶۸/۱۴۴۰ تایید شد

Stage Summary:
- سایت کامل و کارآمد روی پورت ۳۰۰۰ اجرا می‌شود
- تمام محتوای سایت قدیمی منتقل شد: بیوگرافی، خدمات، تعرفه‌های کامل ۱۴۰۵، FAQ، آمار، سوشال، تلفن، آدرس
- گالری چرخ سه‌بعدی با ۵ عکس واقعی مطب از گوگل مپ (شامل لوگوی طلایی واقعی مطب روی دیوار)
- نکته برای ادامه: ۸ نظر گوگل پشت لاگین است؛ ۳ نظر placeholder در site-data.ts (REVIEWS با real:false) قابل جایگزینی با نظرات واقعی هستند
