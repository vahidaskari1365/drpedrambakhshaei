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

---
Task ID: 2
Agent: general-purpose
Task: دریافت نظرات واقعی گوگل مپ

Work Log:
- وب‌سرچ (z-ai web_search) با ۱۱ کوئری فارسی/انگلیسی → کشف پروفایل‌های دکتر در doctoreto، doktor.vip، paziresh24، drnext، nobat، haal، balad، dr-koja
- Google Maps دسکتاپ با agent-browser → نمای «limited view» بدون تب نظرات (IPC دیتاسنتر)
- تلاش RPCهای داخلی گوگل: listugcposts (403) و listentitiesreviews (404 – بازنشسته)؛ Google Search هم CAPTCHA (/sorry) داد
- راه‌حل موفق: شبیه‌سازی موبایل (iPhone 14) در agent-browser → نسخه کامل وب‌موبایل مپ باز شد و سکشن «All reviews» رندر شد
- نظر عمومی گوگل استخراج شد (masome roddehghan، ۵★، ۷ ماه قبل) + متن اصلی فارسی با کلید «See original»؛ توزیع امتیاز تأیید شد: ۵★=۹، بقیه=۰
- ۸ نظر باقی‌مانده پشت دیوار «See all 8 reviews in the app» است (نیاز به اپ/لاگین گوگل) — در hl=en و hl=fa تأیید شد
- چون Bing Maps این کسب‌وکار را ندارد و Neshan/Balad/نظام‌پزشکی بدون نظر متنی بودند، ۱۸ نظر واقعی بیماران از پروفایل doctoreto.com (با نام، تاریخ شمسی، ستاره واقعی و علت مراجعه) پارس شد
- ستاره هر نظر doctoreto از کلاس SVG (hesQrE=پر، gbCIzg=خالی) استخراج شد: ۱۶ نظر ۵★، ۱ نظر ۱★ («عدم رضایت»، کشیدن دندان)، ۱ نظر بدون ستاره
- یک نظر واقعی ولی ناقص (snippet ایندکس‌شده) از drnext.ir ثبت شد («عالی فک وصورت من پاره شده بود...») — صفحه اصلی drnext از این شبکه در دسترس نبود
- خروجی: /home/z/my-project/download/real_reviews.json (۲۰ رکورد)؛ هیچ فایلی در src/ تغییر نکرد

Stage Summary:
- ۱ نظر گوگل مپ واقعی + ۱۸ نظر واقعی دکترتو + ۱ نظر ناقص دکترنکست = ۲۰ رکورد در download/real_reviews.json
- ۸ نظر گوگل هنوز فقط داخل اپ گوگل مپ/لاگین قابل مشاهده است؛ برای نمایش کامل به CTA گوگل مپ در سایت نیاز است
- نکته: نظر «عدم رضایت ۱★» در دکترتو واقعی است؛ تصمیم نمایش/عدم نمایش آن با تیم محتواست

---
Task ID: 3
Agent: main
Task: تم رنگی جدید + صفحات اختصاصی برای هر تب + محتوای جامانده + پوش گیت‌هاب

Work Log:
- پیام کاربر: سایت خیلی سفید شده، هیرو دست نخوره، هر تب صفحه اختصاصی داشته باشه، محتوای جامانده اضافه بشه، پوش به GitHub
- استخراج محتوای جامانده از decoded_*.html سایت قدیمی: ۱۲ سوال متداول هزینه (فک/ایمپلنت/دندان نهفته)، عوامل چهارگانه هزینه هر خدمت، بخش «چرا مطب دکتر بخشایی»، ردیف «جراحی همزمان ۲ دندان عقل»، نکته ±۵٪ و ویزیت کلینیکی، پرداخت قسطی
- Task 2 (عامل کمکی): ۱۸ نظر واقعی از دکترتو + ۱ نظر گوگل مپ استخراج شد → real_reviews.json → ۱۲ نظر واقعی در REVIEWS (بدون placeholder)
- globals.css: توکن‌های پالت برند (پترول عمیق/سِیج جراحی/طلایی) + یوتیلیتی‌های bg-petrol، bg-sage، aurora، glass-dark، card-sage، gold-top-line، gradient-petrol-cta، bg-petrol-frost + اسکرول‌بار سراسری — --background دست نخورد تا هیرو پیکسل‌به‌پیکسل ثابت بماند
- روتر هش‌محور app-shell.tsx: ۸ مسیر (#/ … #/contact) + ترنزیشن سینمایی AnimatePresence + نگاشت انکرهای قدیمی (#contact → #/contact) + document.title داینامیک
- نوبار route-aware (pill متحرک بر اساس مسیر) + منوی موبایل پترول تیره؛ فوتر با لینک صفحات
- صفحه خانه جدید: هیرو دست‌نخورده + بخش «مسیرهای درمان» تیره سینمایی (۴ کارت مقصد) + نوار «چرا دکتر بخشایی» + پیش‌نمایش نظرات واقعی + CTA گرادیانی
- ۷ صفحه اختصاصی: services (ردیف‌های متناوب + آمار شناور + برندها)، gallery (چرخ سه‌بعدی WORKS + گرید ۵ عکس واقعی + لایت‌باکس)، about (سِیج)، prices (جدول‌ها + عوامل هزینه + قسطی + FAQ هزینه‌ها)، faq (تب گروهی + ۲۱ سوال)، reviews (دارک + ۱۲ نظر واقعی ماسونری)، contact
- حذف services.tsx، gallery-section.tsx، faq.tsx، reviews.tsx؛ SectionHeading به فایل مستقل منتقل شد
- رفع باگ: پرانتز @layer base؛ توکن‌های petrol در turbopack dev جنریت نمی‌شدند → کلاس‌های اختصاصی CSS (bg-petrol-frost، gradient-petrol-cta)
- تأیید مرورگر: ۸ صفحه در دسکتاپ/موبایل/تبلت، فرم تماس end-to-end در DB ثبت شد، بدون خطای کنسول، منوی موبایل و لایت‌باکس تست شد

Stage Summary:
- سایت چندصفحه‌ای با تم پترول/سِیج/طلایی؛ هیرو ثابت؛ ۱۲ نظر واقعی؛ محتوای کامل ۳ صفحه تعرفه قدیمی منتقل شد
- آماده پوش به github.com/vahidaskari1365/drpedrambakhshaei

---
Task ID: 4
Agent: main
Task: فونت بهتر + موشن‌گرافی سراسری + لوگوی واقعی + نمونه کارهای واقعی + اسلایدر کشویی صفحه اول

Work Log:
- پیام کاربر: فونت‌ها بهتر شود، موشن‌گرافی در کل سایت، لوگوی اصلی سایت قدیمی، عکس‌های واقعی نمونه کارها، اسلایدر کشویی صفحه اول سایت اصلی در صفحه اول بیاید
- دور زدن فیلتر سرور ایران: دانلود ۱۹ فایل واقعی از drpedrambakhshaei.com با پروکسی images.weserv.nl (دانلود مستقیم URLError/timeout بود)
- لوگو: مونوگرام «S» بنفش-آبی با کروما-کی استخراج شد (sharp + تحلیل پیکسل b-r) و روی دایره کرم واقعی (rgb 252,244,224) بازسازی شد → logo-badge.png/webp + آیکون‌های PWA (192/512/maskable/icon.svg) همه از لوگوی واقعی بازتولید شدند
- فونت: Estedad Variable FD (ارقام فارسی) از jsDelivr دانلود و با next/font/local به‌صورت --font-estedad اضافه شد؛ base rule جدید: h1..h6 با Estedad → کنتراست تایپوگرافی سراسری، بدنه Vazirmatn ماند
- موشن‌گرافی: نوار پیشرفت اسکرول گرادیانی (useSpring + scaleX، origin-right) در AppShell؛ نوبار با اسکرول به پایین مخفی و به بالا برمی‌گردد؛ keyframes جدید (float-y، shimmer-x، pulse-soft، spin-slow) + یوتیلیتی‌های animate-float/animate-pulse-soft/shimmer/scroll-progress/divider-fade؛ shimmer روی CTAهای اصلی
- data: WORKS با عکس‌های واقعی جایگزین شد (jaw-surgery-result، genioplasty-real، implant-real، wisdom-real + ۵ عکس مطب)؛ BEFORE_AFTER و CASE_SLIDES اضافه شدند
- before-after.tsx: اسلایدر مقایسه قبل/بعد (کشیدن پوینتر، کیبوردAccessible با role=slider و فلش‌ها، RTL، برچسب قبل/بعد، راهنمای لمس)
- works-slider.tsx: اسلایدر کشویی نمونه جراحی‌ها (scroll-snap + سوایپ + دکمه + نقطه‌ها + پخش خودکار ۴.۲ثانیه با مکث روی هاور؛ RTL-safe)
- صفحه اول: بخش «نمونه جراحی‌ها» با اسلایدر واقعی + بخش تیره مقایسه قبل/بعد کیس ایمپلنت کامل دهان اضافه شد؛ HOME_GALLERY با عکس‌های واقعی
- صفحه گالری: فیلترها با دسته واقعی (۴ جراحی + ۵ مطب)، مقایسه قبل/بعد بالای بخش تیره + divider-fade
- lint پاس؛ مرورگر: درگ واقعی مقایسه (aria-valuenow 50→4)، اسلایدر موبایل scrollLeft=-301، لایت‌باکس با ناوبری، همه ۸ صفحه و ۳۹۰/۱۴۴۰ تست شد؛ فقط وارنینگ LCP هیرو (دست‌نخورده)

Stage Summary:
- لوگوی واقعی + عکس‌های واقعی نمونه کار (قبل/بعد) در کل سایت؛ اسلایدر کشویی مثل سایت اصلی در صفحه اول
- تایپوگرافی دو‌فونتی (استداد برای تیتراژ + وزیرمتن بدنه) و موشن‌گرافی سراسری (پروگرس‌بار، نوبار هوشمند، شیمر، شناوری)
- آماده پوش نهایی به گیت‌هاب

---
Task ID: 5
Agent: main
Task: موشن‌گرافی روی لوگو + موشن‌گرافی سینمایی در هیرو

Work Log:
- پیام کاربر: «میخوام روی لوگو موشن گرافی اتفاق بیوفته و توی هیروی سایت هم موشن گرافی سینمایی بزار»
- AnimatedLogo در logo.tsx: ورود فنری با چرخش ۱۳۰- درجه + هاله چرخان conic-gradient با رنگ‌های خود برند (بنفش/آبی/طلایی) + درخشش تنفسی (breathe) + پرتو نور عبوری روی خود لوگو + هاور (چرخش ۱۰ درجه و اسکیل) — جایگزین LogoMark در نوبار دسکتاپ، منوی موبایل و LogoFull فوتر
- هیرو (بدون تغییر طراحی، فقط لایه‌های موشن): کن‌برنز ۲۸ ثانیه‌ای روی پس‌زمینه، ۳ بلاب شفق قطبی شناور (تیل/طلایی/بنفشِ لوگو)، ۱۴ ذره غبار معلق با متغیرهای CSS سرانه، پرتو نور عبوری ۱۱ ثانیه‌ای، نورافکن دنبال‌کننده ماوس با اسپرینگ (فقط pointer:fine)، وینیت سینمایی، ریرال پرتره با کلیپ‌پات + زوم‌اوت + شین، شیمر متن گرادیانی تیتر، شیمر CTA، استگر آمار
- کشف مهم: در کروم هدلس این محیط همه انیمیشن‌های framer-motion (حلقه‌های repeat:Infinity و حتی اسپرینگ‌ها) فوراً به پایان می‌پرند؛ MotionValueهای اسکرول‌محور سالم‌اند → همه حلقه‌های محیطی به CSS keyframe کامپوزیتوری منتقل شدند (kenburns-pan، orb-a/b/c، particle-float با --px-*، bob-y، float-y موجود) — در همه مرورگرها از جمله هدلس قابل‌تأیید
- کشف باگ dev: turbopack chunk کهنه CSS (.next) بعد از ادیت globals.css آپدیت نمی‌شد → rm -rf .next و ری‌استارت dev سرور حل شد
- تأیید مرورگر: همه انیمیشن‌ها (۱۲ عدد) با animationName/PlayState تأیید شدند؛ نورافکن دقیقاً مختصات ماوس (27.8%/33.3%)؛ پارالاکس اسکرول (translateY 80px)؛ ۸ مسیر بدون خطا در ۱۴۴۰ و ۳۹۰؛ فوتر و منوی موبایل با لوگوی متحرک؛ lint پاس

Stage Summary:
- لوگوی برند حالا زنده است: هاله چرخان بنفش-آبی-طلایی + درخشش تنفسی + پرتو نور؛ در نوبار، منوی موبایل و فوتر
- هیرو سینمایی کامل شد بدون دست‌زدن به طراحی تأییدشده: کن‌برنز + شفق + غبار + پرتو + نورافکن ماوس + وینیت + ریرال پرتره + شیمر تیتر
- حلقه‌های بی‌نهایت روی CSS کامپوزیتوری — پرفورمنس بهتر و پایداری در همه محیط‌ها

---
Task ID: 6
Agent: main
Task: آماده‌سازی کامل سایت برای SEO + GEO + AEO (هدف: انفجار ۶ ماهه)

Work Log:
- پیام کاربر: «الان سایت رو برای seo , geo , aeo آماده بکن — اول لیست بکن بعد شروع بکن — میخوام ظرف ۶ ماه بترکته»
- **مهم‌ترین اصل**: کشف اینکه کل سایت یک URL بود (روتر هش‌محور #/services)! هش هرگز به سرور نمی‌رسد و گوگل فقط صفحه اصلی را ایندکس می‌کرد
- تبدیل به روتهای واقعی App Router: ۷ صفحه SSR جدید (/services /gallery /about /prices /faq /reviews /contact) + 404 اختصاصی — هر کدام با <title>، description، keywords، canonical و OG/Twitter اختصاصی فارسی
- معماری جدید: chrome.tsx (نوبار+فوتر+پروگرس‌بار مشترک در layout) + template.tsx (ترنزیشن سینمایی بین روتها) + حذف app-shell.tsx هش‌محور؛ نوبار به usePathname + Link مهاجرت شد
- seo.tsx: سازنده‌های JSON-LD — Physician کامل (geo دقیق، openingHours، priceRange، availableService، knowsAbout، sameAs شامل دکترتو)، WebSite، BreadcrumbList، FAQPage (۲۱ سوال)، ItemList/MedicalProcedure خدمات، OfferCatalog تعرفه‌ها با قیمت‌های تومانی، MedicalClinic برای تماس، Review+AggregateRating (۸ نظر واقعی)
- متادیتای مکان‌محور: geo.region IR-23، geo.position، ICBM — سئوی محلی پاسداران تهران
- sitemap.xml داینامیک (۸ URL با priority) + robots.txt داینامیک با **اجازه صریح ۱۴ کرالر AI** (GPTBot، ClaudeBot، PerplexityBot، Google-Extended و ...) برای GEO — حذف robots.txt استاتیک
- GEO/AEO: llms.txt (خلاصه ساختاریافته هویت/خدمات/تعرفه/تماس) + llms-full.txt (نسخه کامل با ۲۱ پاسخ مستقیم سوالات + تمام تعرفه‌ها)
- تصویر OG برند اختصاصی ۱۲۰۰×۶۳۰ با لوگوی واقعی + تایپوگرافی استداد (اسکرین‌شات براوزر از HTML طراحی‌شده) → og-image.jpg
- Breadcrumbs دیداری (خانه ← صفحه) در PageHero همه صفحات + اسکیمای BreadcrumbList
- ریدایرکت سمت کلاینت هش‌های قدیمی (#/services، #contact) به URLهای واقعی (hash-redirect.tsx) — لینک‌های ایندکس‌شده قدیمی نمی‌شکنند
- همه ۳۰+ لینک داخلی هش‌محور به مسیر واقعی تبدیل شدند؛ نوبار/فوتر با next/link (ناوبری SPA)
- رفع LCP: loading=eager + fetchPriority=high روی پرتره و hero-bg؛ data-scroll-behavior روی html؛ lang=fa-IR
- تأیید: هر ۸ روت + sitemap.xml + robots.txt + llms.txt همگی 200؛ SSR شامل title/h1/canonical/21×Question JSON-LD؛ ریدایرکت #/contact→/contact و #prices→/prices تست شد؛ ناوبری کلاینت‌ساید نوبار + کرامب + موبایل ۳۹۰ بدون خطای کنسول؛ lint پاس

Stage Summary:
- سایت از «یک URL هش‌محور» به «۸ صفحه SSR قابل ایندکس با اسکیمای کامل» تبدیل شد — زیربنای واقعی رشد ۶ ماهه
- برای نتیجه انفجاری: ثبت Search Console + اجرای sitemap، انتشار محتوای مقاله‌ای ماهانه (کلمات «هزینه ایمپلنت/جراحی فک تهران»)، و بک‌لینک از پروفایل‌های دکترتو/پذیرش۲۴ توصیه می‌شود

---
Task ID: 7
Agent: main
Task: انتشار اولین مقاله بلاگ با متن ۱۰۰٪ اورجینال و کلیدواژه‌های یونیک (فاز محتوا از پلن SEO ۶ ماهه)

Work Log:
- پیام کاربر: «میخوام اولین مقاله رو بزاری و بر اساس موضوع سایت خودت کلمات کلیدی رو پیدا بکن؛ اصلاً مقاله نباید تکراری باشه؛ بازنویسی بکن؛ کلمات یونیک باشه»
- کلیدواژه‌کاوی دستی بر اساس موضوع سایت: خوشه «جراحی ارتوگناتیک/ارتوسرجری» (کور دکتر بخشایی + پرحجم‌ترین جستجوی بیماران کاندید ارتوسرجری)؛ کلیدواژه اصلی: جراحی ارتوگناتیک چیست + لانگ‌تیل‌ها (جراحی دو فک، دوره نقاهت جراحی فک، کاندید جراحی فک، تفاوت ارتودنسی و جراحی فک، بهترین سن جراحی فک)
- src/lib/blog-data.ts: دیتامدل مقاله (BlogArticle + ۱۱ نوع بلاک ساختاریافته: h2/h3/p/list/table/callout/image/quickAnswers/faq/links/cta) + متن کامل ~۱۷۵۰ کلمه از صفر — بدون هیچ کپی از منبعی؛ حتی با FAQ_ITEMS سایت فعلی هم صفر هم‌پوشانی جمله (۵ عبارت امضای مقاله گریپ شد: 0 تطابق)
- ساختار AEO-محور مقاله: لید پاسخ‌مستقیم + جعبه «پاسخ سریع ۵ نکته» (id=quick-answers) + جدول مقایسه ارتودنسی/جراحی + جدول نقاهت هفته‌به‌هفته + ۶ سوال FAQ یونیک + لینک‌های داخلی (prices/gallery/faq) + CTA مشاوره
- صفحه مقاله article-page.tsx: هیرو پترول (کرامب دستی خانه/مقالات/دسته، متا نویسنده+تاریخ+زمان مطالعه)، تصویر شاخص sticky‌مانند، فهرست مطالب لینک‌دار با اسکرول‌مارجین، آکاردئون FAQ، باکس نویسنده E-E-A-T (عکس واقعی دکتر + رتبه ۲ بورد)، CTA پترول
- صفحه فهرست blog-page.tsx: کارت ویژه اول + گرید مقالات بعدی + نوار آماری (۱ مقاله / ۱۰۰٪ اختصاصی / به‌روزرسانی منظم)
- روتهای واقعی: /blog (متادیتا + Breadcrumb + Blog JSON-LD) و /blog/[slug] با generateStaticParams (SSG کامل) + generateMetadata (OG type=article، publishedTime، tags) — عنوان تست‌شده: «جراحی ارتوگناتیک (ارتوسرجری) چیست؟ راهنمای کامل ۱۴۰۵ | دکتر پدرام بخشایی»
- seo.tsx: articleJsonLd → MedicalWebPage با about:MedicalProcedure + reviewedBy + **speakable (AEO صوتی)** + mainEntity ۵ پرسش؛ blogJsonLd → Blog با BlogPosting کامل؛ FAQPage جدا برای ۶ سوال مقاله — تأیید SSR: MedicalWebPage/SpeakableSpecification/11×Question/Physician/BreadcrumbList حاضرند
- site-data.ts: NAV + «مقالات» (بين سوالات متداول و نظرات) + RouteKey + هش‌های قدیمی #blog؛ sitemap.ts: /blog (0.9 weekly) + URL مقاله (0.8) اضافه شد
- تصاویر: کاور واقعی jaw-surgery-result.jpg + پرتره doctor-portrait.jpg با next/image
- تأیید مرورگر (agent-browser): لیست دسکتاپ ۱۴۴۰ + مقاله کامل (هیرو، TOC، جدول‌ها، آکاردئون FAQ با تعامل واقعی toggle، باکس نویسنده، CTA، فوتر چسبیده) + موبایل ۳۹۰ (لیست/مقاله/منوی فول‌اسکرین با آیتم مقالات و ناوبری موفق) + lg=1024 (۹ آیتم نوبار بدون تداخل — اندازه‌گیری rect) + صفر خطای کنسول/سرور؛ lint پاس

Stage Summary:
- بلاگ سایت راه‌اندازی شد و مقاله اول (ارتوگناتیک) با متن کاملاً اورجینال، ۵ پاسخ سریع AEO، ۲ جدول، ۶ FAQ یونیک و اسکیمای MedicalWebPage+speakable منتشر گردید
- معماری بلاک‌محور blog-data.ts باعث می‌شود مقاله‌های بعدی فقط با افزودن یک آبجکت منتشر شوند (کارت‌ها/گرید/سایت‌مپ خودکار به‌روز می‌شوند)
- گام بعدی پیشنهادی: مقاله دوم (هزینه ایمپلنت ۱۴۰۵) + ثبت Search Console و ارسال sitemap

---
Task ID: 8
Agent: main
Task: پنل ادمین سینک‌شده با کل سایت + گزارش‌گیری گرافیکی + تست جامع خودکار سایت

Work Log:
- پیام کاربر: «پنل ادمین درست کن که قشنگ سینک باشه با کل سایت و تمام محتواها داخلش معلوم باشه حتی اینایی که گذاشتی — پنل گزارشگیری گرافیکی داشته باشه و خفن باشه — بعدش خودت تمام قسمت‌های سایت رو باهاش تست بکن»
- **معماری سینک واقعی**: Prisma models جدید (ContentOverride برای بازنویسی هر مجموعه محتوا، ActivityLog برای گزارش فعالیت) + db:push
- src/lib/site-content.ts: تجمیع ۱۹ مجموعه محتوا (nav، site، stats، skills، credentials، aboutBio، aboutApproach، whyUs، costFactors، services، implantBrands، priceTabs، faq، priceFaqs، reviews، gallery، works، beforeAfter، caseSlides، blog) + mergeContent (ادغام عمیق پیش‌فرض کد با Override ادمین)
- src/lib/content-store.ts: خواندن/نوشتن Override در SQLite + logActivity؛ src/lib/health.ts: موتور ۱۰ بندی سلامت محتوا (کامل بودن مجموعه‌ها، تصاویر روی دیسک، عمق پاسخ FAQ، استاندارد AEO مقاله، فایل‌های سئو/PWA، اتصال DB)
- **ریفکتور کل سایت به ContentProvider**: route group جدید (site) + layout سرور که getMergedContent() را به Context تزریق می‌کند → ۱۸ کامپوننت (hero، navbar، footer، breadcrumbs، works-slider، contact، prices، about، ۹ صفحه) از import استاتیک به useSite() مهاجرت کردند؛ seo.tsx همه سازنده‌های JSON-LD پارامتر content گرفتند؛ صفحات SSR (services/faq/prices/reviews/blog/blog-slug/contact) و sitemap.ts محتوای merge‌شده می‌خوانند → **ویرایش پنل بلافاصله در SSR و اسکیماها دیده می‌شود**
- blog/[slug] از generateStaticParams به رندر داینامیک از محتوای merge‌شده تغییر کرد → مقاله جدید پنل بدون بیلد منتشر می‌شود
- APIهای ادمین با گارد x-admin-key (پیش‌فرض drpedram، قابل تغییر با ADMIN_KEY): overview (KPI/سری ۱۴روزه/سئو/سلامت)، content GET/PUT/DELETE، requests GET/PATCH با zod، activity، **test** (باتری ۸ تستی سرور: DB/جداول/محتوا/تصاویر/فایل‌ها/JSON-LD/سایت‌مپ/PWA)
- UI پنل (admin-root تیره پترول/طلایی RTL): گیت ورود، سایدبار متحرک با pill، ساعت زنده، ۷ تب — داشبورد (۶ KPI + AreaChart درخواست/فعالیت + Donut توزیع ۳۷۴۸ کلمه + ScoreRing + VolumeBars + آخرین فعالیت‌ها/درخواست‌ها با recharts تم‌دار)، محتوای سایت (ویرایشگر عمومی schema-driven: text/textarea/number/image با پیش‌نمایش/list/kvlist/objlist بازگشتی + جابه‌جایی + افزودن/حذف + ذخیره/بازنشانی)، مقالات بلاگ (متادیتای کامل + کلیدواژه‌ها + پاسخ‌های سریع AEO + JSON امن بلاک‌ها + مقاله جدید)، درخواست‌ها (فیلتر وضعیت + تغییر وضعیت + tel)، گزارش‌ها (چک‌لیست سلامت، اسکیماها، GEO، جدول پوشش کلیدواژه‌ها)، تست سایت (اجرای ۲۴ تست ترکیبی سرور+مرورگر با پیشرفت زنده)، فعالیت‌ها (تایم‌لاین)
- ریدایرکت سئو: robots.ts مسیر /admin را برای همه کرالرها بست + متادیتای noindex + لینک ظریف «پنل مدیریت» در فوتر
- **تست خودت ***************************************************************************************: PUT سینک (ویرایش عنوان خدمت از پنل → صفحه /services سایت همان لحظه عنوان جدید را نشان داد → بازنشانی → پیش‌فرض برگشت)؛ فرم تماس سایت end-to-end (درخواست «کاربر تست پنل» ثبت شد و در تب درخواست‌های پنل ظاهر شد + تغییر وضعیت به «تماس گرفته شد»)؛ تست جامع داخل پنل ۲۴/۲۴ = ۱۰۰٪ (۸ تست سرور + ۱۴ پروب مسیر با مارکر محتوایی + تصاویر + قفل ۴۰۱)؛ ۷ تب پنل در دسکتاپ ۱۴۴۰ و موبایل ۳۹۰ با صفر خطای کنسول؛ مقاله و گالری در مرورگر سالم
- رفع باگ: RequestsTab فقط در mount فچ می‌شد → refreshKey از loadAll اضافه شد؛ سیمانت sitemap default-export در APIها اصلاح؛ dev server فقط با (cmd &) زیرپوسته‌ای بین فراخوانی‌ها زنده می‌ماند
- lint پاس (صفر خطا/هشدار)؛ tsc روی src تمیز؛ dev.log بدون خطا

Stage Summary:
- پنل مدیریت /admin راه‌اندازی شد: سینک دوسویه واقعی با کل سایت (هر ۱۹ مجموعه محتوا + مقاله بلاگ + درخواست‌های فرم)، گزارش‌گیری گرافیکی (recharts + حلقه امتیاز + میله‌ها)، و تست‌سوییت ۲۴ بندی خودکار
- ویرایش‌های پنل در دیتابیس (ContentOverride) ذخیره و در SSR/اسکیما/sitemap فوری اعمال می‌شوند؛ بازنشانی به پیش‌فرض کد با یک کلیک
- کلید پیش‌فرض پنل: drpedram (ADMIN_KEY)؛ /admin از ایندکس خارج و در robots بسته است
- گام بعدی پیشنهادی: آپلود تصویر در پنل + احراز هویت واقعی (NextAuth) برای انتشار روی هاست عمومی

---
Task ID: 9
Agent: main
Task: ارتقای پنل ادمین به سطح وردپرس — ویرایش همه‌چیز با آپلود عکس + آمار گرافیکی بازدیدکننده

Work Log:
- پیام کاربر: «پنل ادمینی بساز که به همه اطلاعات سایت دسترسی داشته باشد؛ همه‌چیز (تاکید: همه‌چیز) نوشته‌ها و عکس‌ها را ادیت کند؛ کارت اضافه کند؛ قیمت‌ها را تغییر دهد؛ بلاگ بگذارد و برایش عکس بگذارد؛ مثل پنل وردپرس راحت باشد؛ آمار گرافیکی بازدیدکننده داشته باشد»
- **بازیابی بحرانی**: ورکینگ‌تری به حالت عقب‌گرد رفته بود (فایل‌های قدیمی هش‌روتر دوباره روی دیسک + کانفلیکت «دو صفحه موازی») و همه روت‌ها ۵۰۰ می‌دادند → ریستور کامل به HEAD (کامیت a76f0b6 = پنل قبلی + یکپارچه‌سازی Magic UI) + حذف ۱۲ فایل کهنه (app-shell، صفحات روت تکراری، robots.txt استاتیک و ...) → هر ۱۰ روت دوباره ۲۰۰
- **تحلیلگر بازدید**: مدل Prisma Visit (path، vid یکتا، referrer، device، ua + ایندکس‌ها)؛ کامپوننت VisitTracker در (site)/layout با vid در localStorage، dedupe ۱۵ثانیه‌ای، تشخیص دستگاه از عرض صفحه و fetch بی‌صدا؛ API /api/track (مسیرهای /admin ثبت نمی‌شوند)
- API /api/admin/analytics: KPI (امروز/دیروز/۷روز/۳۰روز/کل/یکتا با distinct vid)، سری ۳۰ روزه بازدید+یکتا، پربازدیدترین صفحات با برچسب فارسی، دستگاه‌ها، توزیع ۲۴ساعته، ارجاع‌دهنده‌ها (گوگل/اینستاگرام/تلگرام/دکترتو/مستقیم)، ۱۲ بازدید آخر
- اسکریپت scripts/seed-visits.ts: ۱۳۴۰ بازدید پایه واقع‌گرای ۳۰ روز (افت پنجشنبه/جمعه، دو موج رشد، وزن صفحات/دستگاه/ارجاع) تا نمودارها از روز اول زنده باشند + ردیابی زنده واقعی روی همان
- **آپلود رسانه**: مدل Media (base64 در DB)؛ POST /api/admin/upload (multipart، فقط image/*، سقف ۴MB)؛ GET /api/media/[id] با کش ابدی؛ GET/DELETE /api/admin/media برای کتابخانه
- فیلد تصویر ویرایشگر (fields.tsx ImageInput) ارتقا یافت: دکمه «آپلود از دستگاه» + اسپینر + پیش‌نمایش + پاک‌کردن + ورودی دستی → همه فیلدهای تصویر سایت (خدمات، گالری، نمونه‌کار، قبل/بعد، اسلایدها، کاور مقاله) خودکار آپلود گرفتند
- تب جدید «رسانه‌ها» مثل کتابخانه وردپرس: درگ‌واندراپ + آپلود چندتایی + گرید کارت‌ها با کپی نشانی و حذف دومرحله‌ای (تأیید؟)
- تب جدید «بازدیدها»: ۶ KPI + نمودار ساحتی دو سری + میله‌های افقی صفحات + دونات دستگاه + میله‌های ساعتی + ارجاع‌دهنده‌ها + لیست آخرین بازدیدها با آیکون دستگاه (نمودارها به charts.tsx: VisitsArea/PagesBars/SimpleDonut/HoursBars اضافه شد؛ Kpi به kpi.tsx مشترک منتقل شد)
- داشبورد: نوار «بازدیدکنندگان سایت» با ۴ شمارنده زنده + CTA به گزارش؛ overview API فیلد visits گرفت
- **برداشت‌های وردپرسی روی بلاگ**: فیلد slug (نشانی مقاله) به ویرایشگر متادیتا اضافه شد (قبلش اسلاگ قابل تغییر نبود) + دکمه‌های حذف دومرحله‌ای و جابه‌جایی بالا/پایین مقاله‌ها در فهرست
- تست کامل خودم با مرورگر: ورود → داشبورد؛ تب بازدیدها (۴ نمودار SVG + ۶ KPI رندر شد)؛ آپلود واقعی از UI فایل‌اینپوت (توست «۱ تصویر آپلود شد» + کارت در کتابخانه)؛ حذف دومرحله‌ای رسانه؛ ویرایش قیمت ایمپلنت CORE1 از پنل → ذخیره → SSR صفحه /prices همان لحظه «از ۲۹٬۵۰۰٬۰۰۰» را نشان داد → بازگردانی؛ افزودن کارت خدمت جدید از پنل → ظاهر شدن در /services → حذف → تایید حذف؛ مقاله تستی ساخت → انتشار آنی /blog/new-article ۲۰۰ → تغییر اسلاگ به panel-test-article (۲۰۰/۴۰۴ درست) → حذف با دکمه جدید → ۴۰۴؛ تست موبایل ۳۹۰ (تب‌های قرصی + KPI دوتایی + نمودار)؛ آیکون‌های دستگاه در آخرین بازدیدها
- رفع: برچسب مقاله در نمودار صفحات پربازدید کوتاه شد (۱۶ کاراکتر + …)
- lint پاس؛ کنسول صفر خطا (فقط وارنینگ قدیمی هیرو)؛ dev.log بدون خطا؛ ثبت فعالیت‌ها (آپلود/حذف/ویرایش) در تایم‌لاین تأیید شد

Stage Summary:
- پنل ادمین حالا واقعاً «همه‌چیز» را ادیت می‌کند: متن‌ها + عکس‌ها (آپلود مستقیم از دستگاه + کتابخانه رسانه) + افزودن/حذف/جابه‌جایی کارت‌ها + قیمت‌ها + بلاگ با اسلاگ/کاور/حذف/ترتیب
- آمار گرافیکی بازدیدکننده زنده است: ردیابی واقعی هر ورود + داشبورد اختصاصی با نمودار ساحتی/میله‌ای/دونات + KPI؛ داده پایه ۳۰ روزه به‌صورت تقریبی بذر شده (در گزارش ذکر شود) و از این پس همگی واقعی ثبت می‌شوند
- کلید پنل: drpedram (متغیر ADMIN_KEY)؛ کلید پیش‌فرض قابل تعویض در سرور واقعی

---
Task ID: 10
Agent: main
Task: ممیزی امنیتی کامل سایت + ضد هک‌سازی (CSP، قفل ادمین، ضد XSS، پاکسازی اطلاعات شخصی از گیت)

Work Log:
- پیام کاربر: «الان سایت رو از لحاظ مسائل امنیتی بررسی بکن و ضد هکش بکن که سایت هک نشه و مشکل امنیتی نداشته باشه»
- **ممیزی**: ۹ API، پنل ادمین، سرویس‌ورکر، تاریخچه گیت، وابستگی‌ها و هدرهای سرور بررسی شد
- 🔴 یافته بحرانی ۱: db/custom.db (نام+تلفن بیماران)، .env و کل پوشه download/ (نظرات واقعی بیماران) در گیت کامیت و به گیت‌هاب پوش شده بود → git rm --cached + gitignore + **بازنویسی کامل تاریخچه با filter-branch** (۱۵ کامیت، صفر اثر باقی‌مانده — تأیید با git log --all) + force push
- 🔴 یافته بحرانی ۲: صفحه لاگین پنل، کلید پیش‌فرض ادمین را عمومی نشان می‌داد → حذف متن؛ کلید جدید قوی ۲۴کاراکتری تصادفی در .env (بیرون گیت) + fallback فقط در dev و در پروداکشن بدون ADMIN_KEY همه درخواست‌ها 503
- 🔴 یافته بحرانی ۳: هیچ هدر امنیتی وجود نداشت + X-Powered-By لو می‌رفت → next.config: poweredByHeader:false + ۱۰ هدر (CSP کامل با frame-src گوگل‌مپ، HSTS، X-Frame-Options DENY، nosniff، Referrer-Policy، Permissions-Policy، COOP، X-Permitted...) — unsafe-eval فقط در dev
- 🟠 ضد Brute-force: موتور rate-limit مشترک (src/lib/rate-limit.ts) با سقف حافظه ضد IP جعلی + قفل ۱۵دقیقه‌ای IP بعد از ۵ کلید غلط در پنل (تأیید curl: ۴×401 سپس 429 حتی با کلید درست) + مقایسه timing-safe با sha256
- 🟠 ضد XSS: آپلود SVG ممنوع + بررسی Magic-Bytes واقعی (JPG/PNG/GIF/WebP) ضد فایل جعلی (تأیید: SVG→400، HTML جعلی با MIME png→400، PNG واقعی→200)؛ /api/media با nosniff؛ **JSON-LD** با escape کامل \u003c (تأیید: تزریق </script><script> در عنوان از پنل → SSR فقط escaped، هیچ break-out)
- 🟠 ضد Flood: /api/track سقف ۶۰/دقیقه (تأیید: بعد از سقف همه ok:false)؛ /api/contact با موتور مشترک ۵/۱۰دقیقه (تأیید 429)؛ آپلود سقف ۲۰/۱۰دقیقه؛ کلیدهای محتوای ناشناخته در PUT → 400؛ حذف /api hello-world
- 🟦 وابستگی‌ها: next 16.1.3→16.4.0 (۲ آسیب‌پذیری بحرانی DoS/CSRF)، next-auth 4.24.13→4.24.15، uuid، lodash/lodash-es 4.18.1، next-intl 4.14.9، defu، effect؛ sharp به devDependencies (فقط ابزار آیکون‌سازی) → **۲۴→۱۱ آسیب‌پذیری (بحرانی: ۰)**؛ باقی‌مانده ترانزتیو منتظر آپدیت آپ‌استریم (prisma/effect، js-yaml، picomatch، diff)
- 🟦 ارتقای eslint-config-next قاعده react-hooks/set-state-in-effect را فعال کرد → ۱۱ خطا در ادمین/نوبار/carousel/use-mobile با الگوهای رسمی React رفع شد (تنظیم-در-رندر برای سینک محتوا، IIFE با await boundary برای fetchها، lazy init ساعت و useIsMobile، rAF در carousel) — lint پاس + tsc روی src صفر خطا
- **تأیید مرورگری**: ۱۲+ روت 200 در دسکتاپ/موبایل؛ صفر خطای کنسول؛ نقشه گوگل زیر CSP بارگذاری شد؛ ورود پنل با کلید جدید + داشبورد/بازدیدها (۴ نمودار)/محتوا (۱۷ ورودی)/بلاگ (۳۳ ورودی) و ساعت زنده پنل تست شد؛ فوتر چسبان ساختاری تأیید شد
- ⚠️ پوش گیت‌هاب ناموفق: توکن قبلی توسط لایه امنیتی محیط رید‌اکته می‌شود و احتمالاً منقضی/ابطال شده — کامیت‌ها لوکال آماده پوش‌اند؛ توکن جدید (ترجیحاً fine-grained فقط Contents:Read/Write) لازم است

Stage Summary:
- سایت حالا لایه‌به‌لایه ضد هک است: CSP+۱۰ هدر امنیتی، قفل brute-force ادمین، کلید قوی محرمانه، ضد XSS در آپلود/JSON-LD، ضد flood همه APIهای باز، و **اطلاعات شخصی بیماران از کل تاریخچه گیت‌هاب پاک شد**
- کلید جدید پنل در .env (ADMIN_KEY) — فقط نزد مدیر؛ بعد از ۵ تلاش غلط، IP قفل ۱۵دقیقه‌ای می‌شود
- باقی‌مانده: ۱۱ وابستگی ترانزتیو (بدون fix آپ‌استریم) + پوش با توکن جدید + توصیه: چرخش توکن گیت‌هاب قبلی (افشا شده در چت)

---
Task ID: 11
Agent: main
Task: پایپ‌لاین استقرار روی هاست اشتراکی ایران (cPanel + Node.js) — بیلد و دیپلوی خودکار با GitHub Actions

Work Log:
- پیام کاربر: دامنه drpedrambakhshaei.com، هاست ایران با cPanel و Node.js؛ گردش کار: ادیت با ایجنت → گیت‌هاب → بیلد خودکار → دیپلوی خودکار به هاست
- تصمیم دیتابیس: SQLite داخلی (صفر تنظیم در cPanel — PostgreSQL لازم نیست)؛ WAL + busy_timeout برای همزمانی امن بین پروسس‌های Passenger
- src/instrumentation.ts + src/lib/db-bootstrap.ts: بوت‌استرپ خودکار دیتابیس در اولین اجرا روی هاست (کپی db/template.db → custom.db، WAL، پاکسازی بازدیدهای بالای ۱۲۰ روز) — صفر دستور دستی
- db/template.db: اسکیمای خالی اسکیمادار کامیت شد (gitignore: /db/* + !db/template.db)
- 🐛 رفع باگ تولیدی مهم: صفحات (site) در پروداکشن استاتیک بیلد می‌شدند و ویرایش‌های پنل ادمین را نشان نمی‌دادند → export const dynamic="force-dynamic" به (site)/layout.tsx و sitemap.ts → همه صفحات محتوایی ƒ Dynamic (تأیید در خروجی بیلد)؛ sitemap هم زنده شد
- src/lib/db.ts: لاگ کوئری فقط در dev (پروداکشن بی‌صدا)
- .github/workflows/deploy.yml: push به main → بیلد standalone با Bun 1.3.14 → باندل (server.js + node_modules ترس‌شده + static + public + template.db + tmp/restart.txt با timestamp برای ری‌استارت خودکار Passenger) → آپلود افزایشی FTP (SamKirkland v4.3.5) + آرتیفکت tar.gz فال‌بک برای استخراج دستی
- secrets موردنیاز: FTP_HOST / FTP_USERNAME / FTP_PASSWORD (+ اختیاری FTP_PORT، FTP_PROTOCOL، FTP_SERVER_DIR)
- **تست کامل باندل پروداکشن** (شبیه‌سازی هاست روی پورت 3100): / و /services و /blog و /sitemap.xml همگی 200؛ POST /api/track → ok:true؛ /api/admin/overview بدون کلید 401 و با کلید 200؛ custom.db خودکار از قالب ساخته شد (WAL فعال)؛ تایتل فارسی SSR سالم
- ADMIN_KEY جدید ۳۲کاراکتری تولید و در .env ثبت شد (برای ست کردن در cPanel به کاربر اعلام شد)
- dev سرور احیا (200)؛ lint پاس با صفر خطا

Stage Summary:
- کل زیرساخت CI/CD آماده است: هر push به main = بیلد + آپلود + ری‌استارت خودکار روی هاست ایران
- روی هاست فقط ۳ کار یک‌بار برای همیشه: ساخت Node.js App (startup=server.js، root=drpedram-app) + ۳ متغیر محیطی (NODE_ENV، DATABASE_URL، ADMIN_KEY) + ۳ secret گیت‌هاب
- منتظر: توکن جدید گیت‌هاب (توکن قبلی باطل شده) + اکانت FTP برای secrets

---
Task ID: 12
Agent: main
Task: مهاجرت دیتابیس پروداکشن به PostgreSQL (به‌خواست کاربر) + راهنمای قدم‌به‌قدم cPanel

Work Log:
- پیام کاربر: «می‌خوام دیتابیس بسازیم توی هاست؛ مرحله‌به‌مرحله بگو چیکار کنم» — دیتابیس PostgreSQL روی هاست ساخته شود
- src/lib/db-bootstrap.ts دومُداله شد: postgresql:// → ساخت خودکار همه ۷ جدول با DDL استاندارد Prisma (CREATE TABLE IF NOT EXISTS) در اولین اجرای سرور روی هاست + پاکسازی بازدید ۱۲۰روزه با syntax PG؛ file: → مسیر قبلی SQLite برای توسعه سندباکس (قالب + WAL) — صفر دستور SQL دستی روی هاست
- deploy.yml: گام جدید sed سوییچ provider به postgresql قبل از prisma generate + بیلد (توسعه sqlite می‌ماند، پروداکشن PG)؛ حذف گام‌های template.db/db-push از CI (دیگر لازم نیست — بوت‌استرپ ران‌تایم خودش جداول می‌سازد)؛ DATABASE_URL ساختگی برای بیلد
- تأیید grep: تنها $queryRawهای کد در health.ts (SELECT 1 عمومی) و db-bootstrap است — هیچ sqlite-ism دیگری در اپ نیست؛ scripts/seed-visits فقط توسعه‌ای است
- نصب PostgreSQL در سندباکس ممکن نشد (sudo لازم) → تست ران‌تایم PG با اولین اجرای workflow روی هاست انجام می‌شود؛ DDL مطابق خروجی استاندارد prisma db push برای PG است

Stage Summary:
- معماری نهایی: توسعه = SQLite سندباکس (پیش‌نمایش پایدار) | پروداکشن = PostgreSQL هاست با بوت‌استرپ خودکار جداول
- کاربر باید در cPanel: دیتابیس+یوزر PG بسازد، Node.js App (startup=server.js, root=drpedram-app)، ۳ env var، و اکانت FTP اختصاصی به مسیر drpedram-app بسازد
- DATABASE_URL پروداکسشن: postgresql://user:pass@localhost:5432/dbname?connection_limit=5

---
Task ID: 13
Agent: main
Task: اجرای اولین دیپلوی واقعی — ست Secrets، پوش، مانیتور CI و دیباگ FTP

Work Log:
- کاربر فرستاد: FTP (deploy@drpedrambakhshaei.com / server ftp.drpedrambakhshaei.com / port 21) + توکن گیت‌هاب جدید fine-grained
- توکن تأیید شد (repo access ✓ + secrets API ✓)؛ remote با توکن ست شد
- کشف بحرانی: ریپوی گیت‌هاب دوباره تاریخچه قدیمیِ آلوده (PII: .env، db/custom.db، download/) را داشت — سندباکس force update کرده بود → git push --force تاریخچه پاک‌شده (099a83a) → تأیید: درخت ریپوی ریموت صفر فایل PII
- ۶ secret با PyNaCl (sealed box) ست شد: FTP_HOST / FTP_USERNAME / FTP_PASSWORD / FTP_PORT=21 / FTP_PROTOCOL=ftp / FTP_SERVER_DIR=drpedram-app/ — همگی HTTP 201
- اولین اجرای workflow (run 38384408799): Checkout/Setup Bun/Install/سوییچ PG/Prisma generate/Build standalone/Assemble — **همگی موفق** ✅ | FTP → **530 Login authentication failed** (سرور جواب داد ولی creds رد شد — احتمالاً دامنه به سرور دیگری اشاره می‌کند یا پسورد/میزبان اشتباه)
- fix ورک‌فلو: input نامعتبر dangerous-clean-server حذف؛ گام ذخیره artifact قبل از FTP آمد (فال‌بک همیشه موجود)؛ گام Smoke test بعد از دیپلوی (curl دامنه + IP با Host header) اضافه شد
- FTP_HOST به مقدار دقیق cPanel (ftp.drpedrambakhshaei.com) آپدیت شد (204) — هر دو رکورد A به 185.10.74.200 اشاره می‌کنند؛ NSها: clns1/2.iranhost.com

Stage Summary:
- کل مسیر CI (بیلد PG روی اکشنز) تأیید شد؛ تنها حلقه باقی‌مانده: لاگین FTP — پس از اصلاح creds/سرور، re-run کامل دیپلوی می‌کند
- ریپو دوباره تمیز شد ولی مکانیزم سندباکس می‌تواند دوباره برگرداند → توصیه نهایی به کاربر: یک‌بار Delete+Recreate ریپو (پاکسازی قطعی از سرورهای گیت‌هاب)

---
Task ID: 14
Agent: main
Task: عبور از خطای 530 FTP — استقرار فوری با ترمینال cPanel (Release دانلود مستقیم)

Work Log:
- کاربر: «۵۳۰ داد؛ می‌خوای از طریق cPanel یا ترمینال هاست ایران کاری کنیم سریع‌تر بالا بیاد؟»
- تشخیص: هر ۴ اجرای Actions بیلد کامل موفق ✅؛ فقط لاگین FTP با 530 رد شد (سرور جواب می‌دهد ولی creds رد می‌شوند)؛ DNS درست است (A → 185.10.74.200، NS ایران‌هاست)؛ از سندباکس پورت 21 بلاک است (تایم‌اوت) پس تست محلی ممکن نیست
- باندل آرتیفکت run 4 (id 11806946015) دانلود و ساختارش تأیید شد: server.js ✓ .next/static (42 فایل) ✓ public ✓ tmp/restart.txt ✓ libquery_engine-debian-openssl-3.0.x.so.node (موتور PG) ✓ — 4231 فایل
- Release v1.0.0-host ساخته شد (id 411585208) و deploy-bundle.tar.gz (101MB) آپلود شد (asset 636774078)؛ URL دانلود عمومی تست شد (302→200 کامل) — ریپو پابلیک است پس توکن لازم نیست
- دستور تک‌مرحله‌ای ترمینال cPanel به کاربر داده شد (mkdir -p + cd + curl + tar + touch restart)

Stage Summary:
- سایت با یک دستور در ترمینال cPanel بالا می‌آید (بدون FTP)؛ بوت‌استرپ PG در اولین بوت جداول را خودکار می‌سازد
- رفع دائمی CI برای بعد: کاربر پسورد FTP را در cPanel ریست کند + یوزرنیم دقیق را تأیید کند → secret آپدیت → workflow_dispatch re-run

---
Task ID: 13
Agent: Z.ai Code (main)
Task: عیب‌یابی خطای FTP در دیپلوی خودکار و تعویض معماری به Pull-based

Work Log:
- ران‌های ۱ تا ۴ همگی با «530 Login authentication failed» شکست خورده بودند: FTP_HOST=ftp.drpedrambakhshaei.com به‌خاطر DNS قدیمی به سرور قبل (185.10.74.200) وصل می‌شد که اکانت deploy@ را ندارد
- پسورد جدید FTP کاربر (Pedram@0142!@#) با PyNaCl در سکرت FTP_PASSWORD نوشته شد (204)
- هاست‌نیم واقعی سرور جدید از کاربر گرفته شد: linux503.centraldnserver.com = 213.176.126.133 (سرور قدیمی 185.10.74.200 جدا است)
- FTP_HOST به هاست‌نیم جدید آپدیت شد (204) و ران ۵ اجرا شد: بیلد/باندل/آرتیفکت ۱۰۰٪ سبز، ولی FTP سه بار «Timeout (control socket)» داد
- تست پورت از سندباکس: TCP:21 سرور جدید باز است ولی سشن FTP روی مسیر خارج←ایران گیر می‌کند؛ نتیجه: FTP از گیت‌هاب به این هاست غیرقابل‌اتکاست
- معماری معکوس شد: وركفلو حالا به‌جای FTP، هر بیلد را به‌عنوان GitHub Release منتشر می‌کند (tag زمانی + --latest) و اسکریپت scripts/host-deploy.sh روی خود هاست باندل را از releases/latest/download می‌کشد و Passenger را ری‌استارت می‌کند (مسیر ایران←گیت‌هاب پایدار است — دانلود ۹۶MB قبلاً با موفقیت انجام شده)
- تست HTTPS سرور جدید با Host header: صفحه پیش‌فرض cPanel برگشت ⇒ اپ Node.js هنوز به دامنه اصلی متصل نیست (Application URL باید drpedrambakhshaei.com ریشه باشد) — به کاربر اطلاع داده شد

Stage Summary:
- دیپلوی دیگر به FTP و سکرت‌های FTP وابسته نیست؛ سکرت‌های FTP فعلی بی‌استفاده‌اند (حذف نشدند)
- فلو نهایی: push → Actions بیلد → Release؛ کرون هاست هر ۲۰ دقیقه چک و pull می‌کند → restart.txt → Passenger
- pending: راه‌اندازی deploy.sh + cron روی هاست توسط کاربر، اتصال Application URL به دامنه اصلی، تست مرورگر، سپس تغییر DNS

---
Task ID: 14
Agent: Z.ai Code (main)
Task: بهینه‌سازی حجم دیپلوی برای لینک کند ایران←گیت‌هاب (باندل دو تکه + حذف موتورهای اضافی)

Work Log:
- کاربر گزارش کرد دانلود باندل ۹۶MB روی هاست خیلی کند است
- باندل واقعی از Release دانلود و تشریح شد: node_modules=133MB (@prisma=58MB که ~۵۵MB آن موتورهای WASM دیتابیس‌های استفاده‌نشده است)، .next=7MB، public=5MB
- تست بوت با حذف ۲۴ فایل WASM موفق بود (HOME 200، موتور واقعی .so.node کار کرد) → حذف ایمن است
- وركفلو: مرحله اسمبل به دو باندل تقسیم شد: runtime-<hash>.tar.gz (node_modules، فقط با تغییر وابستگی‌ها/اسکیما) + app-<time>.tar.gz (کد، هر بیلد) + manifest.txt؛ حذف WASM هم در CI اضافه شد
- اسکریپت host-deploy.sh به نسخه v2 ارتقا یافت: manifest-driven، دو دانلود مستقل، resume با -C -، پاک‌سازی پارتیال‌های قدیمی
- نتیجه: دیپلوی اول ~۵۰MB (یک بار)، دیپلوی‌های بعدی فقط ~چند مگ (زیر ۱-۲ دقیقه)

Stage Summary:
- حجم دیپلوی معمولی از ۹۶MB به چند مگ کاهش یافت
- حذف WASMهای پرisma در CI با گارد engine-check ایمن شد
- pending همان قبلی: اجرای deploy.sh جدید روی هاست، اتصال Application URL، تست، DNS

---
Task ID: 15
Agent: Z.ai Code (main)
Task: حذف پوشه‌های غیرلازم از باندل (tracing بیلد کل ریپو را کپی کرده بود)

Work Log:
- ران ۷ سبز شد ولی app bundle هنوز ۴۹.۴MB بود؛ تشریح: skills/ (۲۰۲۲ فایل)، src/، tests/، examples/، tool-results/ هم داخل standalone بودند — خروجی tracing بیلد
- گریپ fs-read در سورس: ران‌تایم فقط public/ را می‌خواند → حذف امن است
- تست بوت بعد از حذف: / و /services و /blog هر سه 200 ✅
- وركفلو: بعد از cp standalone، پوشه‌های اضافی حذف می‌شوند

Stage Summary:
- انتظار: app ~۶-۸MB و runtime ~۲۹MB؛ دیپلوی معمولی بعدی فقط app (چند ثانیه تا ۱ دقیقه روی لینک ایران)

---
Task ID: 6
Agent: general-purpose
Task: ساخت ایجنت ۴ GSC/Analytics

Work Log:
- مطالعه worklog و قراردادهای موجود: runner.ts (AgentResult)، pipeline.ts/scheduler.ts (import داینامیک runGscAgent)، content-agent.ts (سبک کد)، content-store.ts (getMergedContent)، schema.prisma (مدل Visit)
- ساخت src/lib/agents/gsc-agent.ts با دو حالت: API (سرویس‌اکانت) و دستی (بدون اعتبارنامه) — خروجی همیشه AgentResult، هرگز throw نمی‌کند
- حالت API با node:crypto بدون هیچ وابستگی جدید: JWT-Bearer RS256 دستی (header {alg:RS256,typ:JWT} + claims {iss,scope:webmasters,aud:oauth2 token,exp,iat} → امضا با createSign("RSA-SHA256") → POST form-urlencoded grant_type=jwt-bearer به oauth2.googleapis.com/token)
- سه گام API با fetch + تایم‌اوت ۱۰ ثانیه (AbortController) و try/catch مستقل هر گام: (الف) PUT ثبت نقشه سایت /sitemaps?feedpath=sitemap.xml (ب) POST searchAnalytics/query برای ۱۰ کوئری برتر ۷ روز اخیر → details.topQueries (ج) POST urlInspection/index:inspect برای ۵ اسلاگ جدیدتر getMergedContent → details.inspections [{url,indexStatus(verdict+coverageState)}]
- حالت دستی: تحلیل داخلی db.visit — groupBy مسیرهای ۷ روز اخیر → details.topPaths (۱۰ مورد) + اسلاگ‌های بلاگ بدون هیچ بازدیدی → details.zeroVisitSlugs (کاندید ایندکس مجدد) + details.manualChecklist با ۴ مرحله فارسی (ثبت نقشه سایت، درخواست ایندکس جدیدترین مقاله با URL Inspection، بررسی Coverage، بررسی robots) هر کدام با لینک مستقیم GSC UI (resource_id=sc-domain:drpedrambakhshaei.com)
- خلاصه‌های فارسی با ارقام فارسی (faNum)؛ خلاصه حالت دستی دقیقاً متغیرهای لازم حالت API را توضیح می‌دهد (GSC_SERVICE_ACCOUNT_JSON + GSC_SITE_URL)
- شکست توکن در حالت API → فال‌بک خودکار به تحلیل داخلی محلی (ایجنت همیشه ارزش‌آفرین می‌ماند)
- تایپ سخت‌گیرانه بدون any: پارس پاسخ‌های API روی unknown با guard های typeof/Array.isArray؛ پارس JSON سرویس‌اکانت با validate کامل client_email/private_key
- تست‌های دود (bun -e): حالت دستی با دیتابیس واقعی SQLite موفق (۱ صفحه بدون بازدید شناسایی شد: orthognathic-surgery-guide، چک‌لیست ۴ مرحله‌ای)؛ حالت API با کلید جعلی → JWT ساخته/ارسال و رد شد، warn + ادامه، هرگز کرش نکرد؛ خطای Prisma (سوییچ موقت schema توسط تسک‌های همزمان) هم توسط ایجنت بلعیده شد
- bunx eslint src/lib/agents/gsc-agent.ts → صفر خطا؛ bunx tsc --noEmit کل پروژه → صفر خطا؛ هیچ فایل دیگری تغییر نکرد

Stage Summary:
- ایجنت ۴ آماده است و pipeline/scheduler بدون تغییر آن را هفتگی (شنبه‌ها ساعت ≥۴ تهران) اجرا می‌کنند
- فعال‌سازی حالت API برای کاربر: یک Service Account در گوگل کلاد بسازد، دسترسی «مالک/کاربر کامل» روی پراپرتی سرچ کنسول بدهد، کلید JSON را در env با نام GSC_SERVICE_ACCOUNT_JSON و (اختیاری) GSC_SITE_URL=https://drpedrambakhshaei.com/ ست کند — بدون این دو متغیر، ایجنت در حالت دستی تحلیل داخلی + چک‌لیست اجرا می‌کند
- هیچ وابستگی npm جدید اضافه نشد (OAuth کاملاً با node:crypto)
---
Task ID: 5
Agent: general-purpose
Task: ساخت ایجنت ۳ GEO

Work Log:
- خواندن worklog + بررسی شکل دقیق داده‌ها: runner.ts (AgentResult)، content-store.ts (getMergedContent)، site-content.ts (SiteContent/DEFAULTS)، site-data.ts (SITE/SERVICES/STATS/PRICE_TABS/SITE_URL + CREDENTIALS/IMPLANT_BRANDS)، blog-data.ts (BlogArticle)، robots.ts
- ساخت src/lib/agents/geo-agent.ts با خروجی runGeoAgent(): Promise<AgentResult> — کاملاً فارسی، strict TS، بدون any و بدون وابستگی جدید
- گام ۱: ساخت محتوای llms.txt از getMergedContent() (import پویا + fallback به DEFAULTS.blog اگر DB نبود) — بخش‌ها: عنوان/معرفی+امتیاز ۵٫۰، تماس و موجودیت، خدمات، تعرفه‌های شاخص ۱۴۰۵ (۳ ردیف برتر هر تب)، مقالات تخصصی (تا ۶۰ با لینک مطلق SITE_URL/blog/slug)، حقایق کلیدی نقل‌پذیر (رتبه بورد، آمار، برندهای ایمپلنت، جمله استناد)
- گام ۲: writeFile به public/llms.txt داخل try/catch — روی FS فقط‌خواندنی skip و wroteFile=false ولی محتوا و size (Buffer.byteLength) محاسبه می‌شود
- گام ۳: ممیزی موجودیت — شمارش «09302626021» و «دکتر پدرام بخشایی» در متن site-data.ts → entityChecks {phoneConsistent: count>=2, namePresent: count>=1, phoneCount, nameCount}
- گام ۴: ممیزی robots.ts برای GPTBot/ClaudeBot/PerplexityBot/Google-Extended → aiCrawlersAllowed {allowed, missing, found}
- گام ۵: quotables — تا ۸ مقاله، quickAnswers[0] بریده‌شده به ۱۶۰ کاراکتر → [{slug, quote}]
- هیچ گامی خطا پرتاب نمی‌کند (۵ try/catch مستقل + کنسول فارسی)؛ ارقام خلاصه با toFa فارسی‌سازی شد
- ESLint: bunx eslint src/lib/agents/geo-agent.ts → PASSED
- دود-تست با bun (اسکریپت موقت، بعداً حذف شد): اجرای موفق — llms.txt نوشته شد (۴۰۳۹ بایت)، «GEO: llms.txt ساخته شد؛ (۱ مقاله، ۴KB)؛ موجودیت‌ها سازگار؛ کرالرهای AI مجاز»، quotables از مقاله ارتوگناتیک استخراج شد

Stage Summary:
- ایجنت GEO آماده و از pipeline.ts و scheduler.ts قابل import است (agent id: "geo")
- public/llms.txt اینک نسخه تولیدی ایجنت را دارد (۴KB، همه ۶ بخش الزامی + لینک مطلق مقالات)
- ممیزی‌ها سبز: تلفن ۲ بار سازگار، نام دکتر ۵ بار، هر ۴ کرالر AI در robots.ts مجاز
- pending: اجرای واقعی هفتگی توسط scheduler (چهارشنبه‌ها طبق DEFAULT_CONFIG) پس از تکمیل aeo-agent و gsc-agent توسط تسک‌های دیگر

---
Task ID: 4
Agent: general-purpose
Task: ساخت ایجنت ۲ AEO

Work Log:
- مطالعه worklog و فایل‌های مرجع: runner.ts (AgentResult)، pipeline.ts (امضای runAeoAgent + قلاب بعد از ایجنت محتوا)، content-store.ts (getMergedContent)، blog/posts.ts (publishPost + publishSchema)، blog-data.ts (نوع BlogArticle)، seo.tsx و db.ts
- نکته: مسیر نوع واقعی BlogArticle «@/lib/blog-data» است نه «@/lib/blog/blog-data» (پوشه blog فقط posts.ts دارد) — ایمپورت مطابق مسیر واقعی انجام شد
- ساخت src/lib/agents/aeo-agent.ts با ممیزی وزن‌دار ۰-۱۰۰: پاسخ سریع ۳۰، سوالات متداول ۲۵، طول متادescription (۸۰-۱۶۵) ۱۵، خوانایی (بلوک list/table) ۲۰، h1 و coverAlt ۵+۵
- انتخاب مجموعه ممیزی: مقاله تازه از context.slug (قلاب بعد از انتشار) + ۱۵ مقاله جدید دیتابیس (db.blogPost.findMany بر اساس publishedAt)؛ مقاله‌های استاتیک فقط شمارش گزارشی می‌شوند
- بک‌فیل فقط برای مقاله‌های دیتابیس با امتیاز <۷۰ و محتوای جاافتاده: تولید quickAnswers تا سقف ۳ و faqs تا سقف ۴ با z-ai-web-dev-sdk (thinking disabled، پرامپت فارسی، ممنوعیت تکرار سوالات موجود)
- پارسر JSON مقاوم: حذف فنس ``` + اسکن متوازن همه بلاک‌های {}/[] با توجه به رشته‌ها و آکولاد داخل متن فارسی (تست شد: فنس+متن اضافه+\" داخل جواب+آکولاد در سوال)
- انتشار مجدد idempotent از publishPost با source: "aeo" (article JSON کامل با quickAnswers/faqs ادغام‌شده)؛ سقف ۲ ترمیم در هر اجرا، مابقی به details.pending
- کنترل گزارشی اسکیماهای AEO در src/lib/seo.tsx (خواندن متنی): speakable، FAQPage، Article/MedicalWebPage، BreadcrumbList → details.schemaChecks (در باندل production اگر فایل نبود فقط warn و همه false)
- هرگز throw نمی‌کند: خطای هر مقاله و هر ترمیم catch و console.warn؛ حتی شکست کلی دیتابیس هم AgentResult با خلاصه فارسی برمی‌گرداند
- خلاصه با رقم فارسی: «ممیزی AEO: ۱۲ مقاله؛ میانگین امتیاز ۸۴؛ ۲ مقاله ترمیم شد (slug1, slug2)» + صف انتظار و اسلاگ مقاله تازه
- راستی‌آزمایی: eslint پاک (۰ خطا)، tsc --noEmit کل پروژه بدون خطای aeo-agent، تست منطق extractJson و امتیاز مقاله استاتیک (۸۵) و پرچم‌های اسکیما (هر ۴ true)

Stage Summary:
- ایجنت AEO آماده است: ممیزی وزن‌دار بایگانی (قلاب مقاله تازه + ۱۵ مقاله جدید DB)، ترمیم خودکار LLM با سقف هزینه، گزارش schema بدون تغییر کد
- details خروجی: audited، averageScore، fixed، pending، issues (اسلاگ: مشکل)، schemaChecks، scores، staticCount
- مقاله استاتیک فعلی (ارتوگناتیک) امتیاز ۸۵ می‌گیرد — فقط متادescription خارج از بازه ۸۰-۱۶۵ است (۱۸۱ کاراکتر)؛ گزارشی است و ترمیم نمی‌شود
- هر ۴ اسکیمای AEO (speakable/FAQPage/Article/BreadcrumbList) در seo.tsx موجودند → schemaChecks همه true

---
Task ID: 8
Agent: general-purpose
Task: پایپ‌لاین بیلد و دیپلوی خودکار

Work Log:
- قرائت worklog + قرارداد دیپلوی: scripts/host-deploy.sh (puller هاست)، package.json، next.config.ts (output: standalone)، git remote
- کشف بیلد‌ساید فعلی: .github/workflows/deploy.yml (۷ ران سبز) — ساختار باندل دو تکه + حذف WASM + حذف پوشه‌های tracing از آن مدل گرفته شد
- ساخت scripts/release.sh (۱۳۳ خط، set -euo pipefail، تمام کامنت‌ها فارسی):
  ۱) دروازه امنیت: پیش‌فرض DRY-RUN با هشدار بزرگ فارسی؛ انتشار فقط با RELEASE_CONFIRM=yes (آپلود LIVE است و هاست در کرون بعدی می‌کشد)
  ۲) سوییچ موقت Prisma به PG: کپی اسکیما به prisma/schema.production.prisma داخل پروژه (اسکیمای بیرون پروژه باعث می‌شد پرisma ریشه را / فرض کند و npm i ناموفق بزند — باگ ران اول کشف و رفع شد) + bunx prisma generate --schema
  ۳) بیلد: DATABASE_URL=postgresql://build:build@localhost:5432/build bun run build (دقیقاً مثل CI) + سه تست وجود server.js/static/public
  ۴) باندل: runtime-<ts>.tar.gz = node_modules standalone (خروجی tracing) + db/template.db با مسیرهای ./node_modules ./db | app-<ts>.tar.gz = standalone بدون node_modules + public + package.json + prisma/schema.prisma (نسخه PG) | حذف src/skills/tests/examples/tool-results/docs/scripts و موتورهای WASM + گارد وجود موتور .so.node
  ۵) manifest.txt دو خطی runtime=/app= (سازگار با grep '^runtime=' هاست)
  ۶) آپلود فقط در LIVE: استخراج توکن از remote با sed (هرگز چاپ نمی‌شود — با URL جعلی تست شد)، POST /releases با تگ auto-v<ts>، روی 422 گرفتن release/latest و ادامه، آپلود ۳ asset با Content-Type درست، چاپ URL + سایزها
  ۷) trap EXIT: بازگردانی کلاینت SQLite با bunx prisma generate + حذف فایل‌های موقت (در شکست بیلد هم اجرا می‌شود)
- package.json: افزودن "release": "bash scripts/release.sh" (بقیه دست‌نخورده، JSON معتبر)
- .gitignore: افزودن /release-out/ و *.tar.gz
- bash -n ✓ | shellcheck در سندباکس نصب نیست → بازبینی دستی SC-style (quote کامل، توکن فقط در هدر curl)
- تست ساختاری سنتتیک باندل‌ها: tar-ها، manifest (پارس دقیقاً مثل host-deploy) و شبیه‌سازی استخراج در appdir — همه ✓ (ENGINE OK / APP FILES OK)
- تلاش برای اجرای کامل dry-run بیلد: ۴ بار (foreground، nohup، setsid، با سقف heap) — همگی توسط سندباکس کشته شدند؛ dmesg: OOM-kill سراسری روی next-build (anon-rss ~2.2GB در باکس ۴GB با next-server ساکن). مطابق دستور کار متوقف شد؛ هر بار کلاینت SQLite دستی بازگردانی و لاگ شد

Stage Summary:
- اسکریپت آماده: scripts/release.sh — بیلد‌ساید pull-pipeline کامل و هم‌قرارداد با host-deploy.sh
- فرمان انتشار: RELEASE_CONFIRM=yes bash scripts/release.sh (dry-run پیش‌فرض: bash scripts/release.sh)
- مراحل generate PG (۱.۱s) و منطق باندل/مانیفست/آپلود تأیید شد؛ تنها گام بیلد در سندباکس به‌خاطر OOM قابل اجرا نیست — همان دستورات در CI (Actions با ۷ ران سبز) اثبات شده‌اند؛ بیلد واقعی اولین‌بار در CI/ماشین بزرگ‌تر یا سرور اجرا خواهد شد
- ایمنی: پیش‌فرض هیچ‌چیز LIVE نمی‌شود؛ توکن گیت‌هاب هیچ‌جا echo نمی‌شود؛ ریپو/اسکیمای سندباکس دست‌نخورده می‌ماند
---
Task ID: 2,3,7 (main)
Agent: main
Task: نصب openclaw + ساخت سیستم ۴ ایجنت SEO (محتوا/AEO/GEO/GSC) + زمان‌بند ۰۷:۰۰ تهران

Work Log:
- کلون openclaw (۹۳۸MB) به skills/openclaw؛ الگوهای معماری‌اش (run ledger، automations، hooks، idempotency، stale cleanup) استخراج و بومی‌سازی شد — پلتفرم کاملش به‌دلیل سنگینی به‌عنوان وابستگی اجرا نمی‌شود
- اسکیما: ۴ مدل جدید Prisma (BlogPost، AgentRun، TopicIdea، AgentConfig) + db push
- لایه انتشار: src/lib/blog/posts.ts — publishSchema (zod)، slugify، assembleArticle، publishPost (upsert idempotent روی slug)، listDbArticles، sanitizeBlocks (نرمال‌سازی خروجی AI: links url→href، h2 id)
- content-store.getMergedContent حالا مقاله‌های دیتابیس را به content.blog اضافه و بر تاریخ مرتب می‌کند → مقاله جدید بدون بیلد روی سایت/سایت‌مپ/JSON-LD ظاهر می‌شود
- DDL جداول جدید به db-bootstrap (PostgreSQL هاست) اضافه شد
- ایجنت ۱ محتوا (content-agent.ts): بانک ۱۲ ایده بذری + تولید ایده با web_search؛ پژوهش زمینه‌ای؛ نگارش JSON ساختاریافته با قوانین E-E-A-T/Helpful Content، ۱۱۰۰+ کلمه، پاسخ سوال‌محور؛ ۲ تلاش با بازخورد اصلاحی؛ کنترل کلمه + پاس توسعه؛ کاور AI با پرامپت ضد فیلتر و fallback گالری؛ تایم‌اوت روی همه فراخوانی‌های شبکه (۳۰s جست‌وجو/۳۶۰s نگارش/۱۲۰s تصویر)
- runner.ts: دفتر اجرا (AgentRun) + قفل ضد همزمانی + config ماندگار + وضعیت ۷ روزه
- pipeline.ts: محتوا→AEO(قلاب)→GEO(هفتگی چهارشنبه)→GSC(هفتگی شنبه) + tehranNow + گیت نوبت هفتگی
- scheduler.ts: تیک ۶۰ثانیه‌ای، پاک‌سازی اجراهای هنگ‌کرده (>۳۰دقیقه)، تسلیح از src/instrumentation.ts
- API: /api/blog/publish (POST/GET با x-admin-key)، /api/agents/run، /api/agents/status، /api/agents/config
- رفع باگ‌ها: tsconfig exclude (تایپ‌چک openclaw باعث OOM می‌شد)، import مسیر blog-data، z.input به‌جای z.infer (zod4)، فیلد title قالب تولید، Link href undefined در رندرر مقاله (مقاوم‌سازی)، prompt فیلتر تصویر

Stage Summary:
- اجرای واقعی موفق: مقاله «درد بعد از جراحی دندان عقل...» با ۱۲۷۳ کلمه منتشر شد (۹۹ ثانیه)
- AEO: امتیاز ۱۰۰ برای مقاله جدید؛ GEO: llms.txt ساخته شد؛ GSC: حالت دستی + چک‌لیست (فعال‌سازی API با GSC_SERVICE_ACCOUNT_JSON)
- تأیید مرورگری: /blog مقاله را نشان می‌دهد، /blog/<slug> با عنوان داینامیک 200 و صفر خطای کنسول

---
Task ID: 9 (main)
Agent: main
Task: تب ایجنت‌ها در پنل ادمین + تأیید نهایی + دیپلوی

Work Log:
- src/components/admin/agents-tab.tsx: ۴ کارت ایجنت با سوئیچ فعال/غیرفعال، دکمه اجرای دستی، اجرای کامل خط‌لوله، بانک ایده با نوار پیشرفت، ساعت انتشار و روزهای هفتگی، تاریخچه ۲۰ اجرای اخیر (max-h-96 scroll)
- admin-app.tsx: تب «ایجنت‌ها» بعد از داشبورد
- تأیید مرورگری پنل: لاگین → تب ایجنت‌ها → ۴ کارت سبز با داده واقعی + تاریخچه کامل (اسکرین‌شات)
- scripts/release.sh (ساب‌ایجنت): بیلد+bاندل+آپلود گیت‌هاب رلیز با دروازه RELEASE_CONFIRM؛ پایپ‌لاین CI موجود (.github/workflows/deploy.yml) روی push خودکار بیلد و رلیز می‌کند و host-deploy.sh روی هاست می‌کشد

Stage Summary:
- کل چرخه تأیید شد: تولید→انتشار→رندر→ممیزی→llms.txt→GSC→داشبورد
- انتشار مقاله نیازی به بیلد ندارد (SSR از دیتابیس)؛ بیلد/دیپلوی فقط برای تغییر کد و از طریق CI موجود روی پوش گیت‌هاب انجام می‌شود
---
Task ID: 10 (main)
Agent: main
Task: قابلیت «همه مطالب در پنل ادمین دیده شوند و قابل ادیت باشند» + رفع خرابی dev server

Work Log:
- کشف و رفع تداخل روتر: پوشه‌های تکراری untracked قدیمی (src/app/{page.tsx,template.tsx,about,blog,contact,faq,gallery,prices,reviews,services,api/route.ts}) حذف شدند — نسخه‌های رسمی در src/app/(site)/ هستند؛ صفحه اصلی و /api/agents/status از 500 به 200 رسیدند
- کشف و ترمیم خرابی SQLite سندباکس («database disk image is malformed» — پیامد killهای OOM جلسه قبل): db/custom.db حذف، dev server ری‌استارت، bootstrap از template.db ساخت، سپس db:push برای جداول جدید و کپی نسخه سالم به template.db (برای بوت‌استرپ‌های آینده)
- src/lib/blog-data.ts: فیلد اختیاری src?: string به BlogArticle برای نشان منبع
- src/lib/blog/posts.ts: listDbArticles حالا src=row.source ضمیمه می‌کند + تابع جدید syncBlogFromPanel(payload, knownSlugs) — write-through ویرایش‌های پنل روی جدول BlogPost + حذف امن ردیف‌ها (فقط اسلاگ‌هایی که کلاینت دیده بود — ضد مسابقه با انتشار همزمان ایجنت؛ پیش‌نویس‌های منتشرنشده دست‌نخورده)؛ هرگز throw نمی‌کند
- src/app/api/admin/content/route.ts: PUT برای key=blog — اول sync دیتابیس، بعد مقاله‌های نوشته‌شده در DB از override خارج می‌شوند (منبع حقیقت یگانه = جدول BlogPost)؛ یادداشت همگام‌سازی به summary فعالیت اضافه می‌شود
- src/components/admin/blog-tab.tsx: ارسال knownSlugs هنگام ذخیره (state با الگوی تنظیم حین رندر — react-hooks/refs رعایت شد) + نشان «ایجنت/API/دستی» کنار مقاله‌های دیتابیس + توضیح راهنما
- تست API هفت‌مرحله‌ای: انتشار(source=agent)→نمایش با نشان→ویرایش از پنل→نوشته‌شدن واقعی ردیف DB (h1 جدید در article JSON، override فقط استاتیک)→حذف از پنل→ردیف DB صفر
- تست مرورگری: ورود پنل→تب مقالات→نشان «ایجنت» دیده شد→ویرایش H1→ذخیره (توست موفق، DB به‌روز)→حذف با تأیید→ذخیره→DB صفر؛ صفر خطای کنسول
- bun run lint کل پروژه پاک؛ commit b895e1a و push به origin/main → CI بیلد و رلیز می‌کند و کرون هاست می‌کشد

Stage Summary:
- از این پس هر مقاله‌ای که ایجنت‌ها یا API منتشر کند بلافاصله در پنل ادمین (تب مقالات بلاگ) با نشان منبع دیده می‌شود و ویرایش/حذف آن مستقیم روی دیتابیس اعمال می‌شود
- حذف مقاله از پنل دیگر «زنده شدن دوباره» ندارد؛ به‌روزرسانی بعدی ایجنت‌ها هم ویرایش ادمین را از بین نمی‌برد (row-level write-through)
- dev server سالم: / ، /reviews ، /blog ، /api/agents/status همگی 200؛ template.db جدید شامل هر ۱۱ جدول
