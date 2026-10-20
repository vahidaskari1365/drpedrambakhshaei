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

---
Task ID: 11
Agent: Z.ai Code (main)
Task: عیب‌یابی 404 سایت پروداکشن — تحلیل خروجی ترمینال هاست (node Permission denied، کرش Prisma، curl 260 بایتی) و رفع مشکل موتور Prisma روی هاست cPanel

Work Log:
- تحلیل خروجی ترمینال کاربر: node در PATH ترمینال cPanel مجاز نیست (طبیعی) — نود واقعی در /home/drpedram/nodevenv/drpedram-app/22/bin/node پیدا شد و با آن اپ بوت شد: «✓ Next.js 16.4.0 Ready» یعنی node_modules و server.js سالم‌اند (npm install کاربر خرابکاری نکرده بود)
- خطای بحرانی کشف شد: PrismaClientInitializationError — «Prisma Client was generated for debian-openssl-3.0.x, but the actual deployment required debian-openssl-1.0.x» (هاست cPanel ایران OpenSSL 1.0.x دارد)
- fix: prisma/schema.prisma — binaryTargets = ["native", "debian-openssl-1.0.x"] به generator اضافه شد؛ bunx prisma generate موفق؛ هر دو موتور در node_modules/.prisma/client تأیید شد (libquery_engine-debian-openssl-1.0.x.so.node = 21.7MB)
- commit 5fc401b push شد → CI run #13 در جریان؛ چون schema.prisma در هش runtime bundle است، runtime جدید منتشر می‌شود و deploy.sh روی هاست node_modules را به‌صورت تمیز جایگزین می‌کند (خودترمیمی npm install کاربر)
- تحلیل curl -H "Host: ..." از سرور: HTTP 200 ولی Content-Length: 260 و Last-Modified: 2023 = صفحه پیش‌فرض cPanel ⇒ اپ هنوز به دامنه در Passenger وصل نیست (نیاز به SAVE+RESTART با Domain درست در Setup Node.js App)
- تحلیل هشدار «export: '=production': not a valid identifier» در wrapper نود: یکی از Environment variables ثبت‌شده در پنل cPanel Name خالی دارد (مقدار production) — باید در UI اصلاح شود
- DNS از سمت سندباکس چک شد: drpedrambakhshaei.com → A: 185.10.74.200 (هاست قدیمی ihglobaldns) + AAAA: 2a02:dfc0:3:2::116 (Roshangar AS61055)؛ سرور جدید linux503 = 213.176.126.133 ⇒ ترافیک اصلاً به سرور جدید نمی‌رسد؛ getent روی هاست کاربر هم هنوز 185.10.74.200 می‌دهد

Stage Summary:
- ریشه 404 سه‌لایه است: (۱) DNS به هاست قدیمی اشاره می‌کند (اصلی‌ترین)، (۲) اپ به دامنه در Passenger متصل نیست (صفحه پیش‌فرض cPanel)، (۳) موتور Prisma ناسازگار (فیکس شد و در رلیز جدید است)
- فیکس Prisma: binaryTargets ["native","debian-openssl-1.0.x"] — از این پس هر بیلد CI هر دو موتور را باندل می‌کند
- تعلیمات به کاربر: تغییر A/AAAA در پنل DNS، حذف متغیر بی‌نام در Node.js App، اجرای deploy.sh بعد از اتمام CI، SAVE+RESTART اپ

---
Task ID: 11-b
Agent: Z.ai Code (main)
Task: رفع شکست CI پس از فیکس Prisma و انتشار رلیز سالم

Work Log:
- CI run #13 شکست خورد در گام Assemble: چک قدیمی «test -f ...libquery_engine-*.so.node» با glob چندفایلی (حالا ۲ موتور) خطای «binary operator expected» می‌داد — باگ اسکریپت بود نه باندل (خبر خوب: هر دو موتور در standalone بودند)
- fix: .github/workflows/deploy.yml — چک به ls-based تغییر کرد + لاگ تعداد موتورها اضافه شد؛ chmod 644 برای بازگردانی mode
- commit 1f59061 push → CI run #14: completed success؛ «engines: 2» در لاگ تأیید شد
- رلیز منتشر شد: deploy-20261014-055203 | app-20261014-055156.tar.gz (7.9MB) | runtime-ff7a7b2d.tar.gz (39MB)
- runtime hash عوض شد (ff7a7b2d ≠ a06b23b6 قبلی) ⇒ deploy.sh روی هاست runtime را دانلود و node_modules را تمیز جایگزین می‌کند (خودترمیمی npm install کاربر + موتور 1.0.x)

Stage Summary:
- رلیز سالم روی releases/latest است؛ منتظر: کاربر deploy.sh بزند → تست standalone (انتظار: db-bootstrap موفق بدون خطای Prisma) → SAVE+RESTART اپ در cPanel → تغییر DNS (هنوز 185.10.74.200)

---
Task ID: 11-c
Agent: Z.ai Code (main)
Task: رفع ناسازگاری deploy.sh با curl قدیمی هاست (7.29) که مانع دانلود runtime بود

Work Log:
- خروجی کاربر: «curl: option --retry-all-errors: is unknown» در حین دانلود runtime-ff7a7b2d ⇒ دانلود قطع، node_modules جایگزین نشد، خطای Prisma باقی ماند (طبیعی)
- علت: --retry-all-errors فقط در curl >= 7.71 هست؛ هاست CentOS/CloudLinux با curl 7.29
- fix: scripts/host-deploy.sh — تشخیص نسخه curl (major/minor parsing) و افزودن شرطی فلگ؛ تست شبیه‌سازی برای 7.29/7.71/8.5/خالی = درست
- commit 6ed8248 push → CI run #15 (بیلد app جدید؛ runtime نامش تغییر نمی‌کند)
- راه‌حل فوری کاربر بدون دانلود مجدد: sed -i 's/ --retry-all-errors//' ~/bin/deploy.sh

Stage Summary:
- نسخه canonical اسکریپت در ریپو سازگار با curl قدیمی شد (کرون آینده هم امن است)
- منتظر: کاربر sed بزند → deploy.sh → DEPLOYED OK → تست standalone (انتظار db-bootstrap موفق) → SAVE+RESTART cPanel → DNS

---
Task ID: 11-d
Agent: Z.ai Code (main)
Task: رفع خرابی «trailing garbage» در دانلود runtime هاست — host-deploy v3

Work Log:
- تشخیص ریشه: دانلود دستی ۰۹:۳۲–۰۹:۴۸ (۱۶ دقیقه، ۲۵۲KB/s) با کرون */20 (شلیک ۰۹:۴۰) همپوشان شد؛ دو curl همزمان با -C - روی یک .part-*.tar.gz نوشتند ⇒ فایل دو-نویسی، gzip «decompression OK, trailing garbage ignored» و tar با status 2 مرد
- وضعیت هاست پس از شکست: node_modules = حاصل استخراج ناقص/ادغامی، .deploy-manifest به‌روز نشده، .part بزرگ باقی مانده
- host-deploy v3 نوشته شد: قفل flock (fallback: mkdir lockdir)، نام part یکتا با $$، download_verified با gzip -t (فایل خراب رد و exit 1)، تعویض کامل node_modules (rm -rf قبل از استخراج runtime — ردپای npm install هم پاک)، حفظ سازگاری curl 7.29 و resume
- تست محلی: bash -n OK؛ شبیه‌سازی تایید: فایل سالم ACCEPT، فایل با trailing garbage REJECT
- commit ec60feb push → CI بیلد app جدید؛ رفرش اسکریپت کاربر از raw.githubusercontent

Stage Summary:
- اسکریپت ضدگلوله شد: اجرای همزمان دیگر غیرممکن، دانلود خراب هرگز باز نمی‌شود، node_modules همیشه تمیز جایگزین می‌شود
- گام بعدی کاربر: curl از raw برای رفرش deploy.sh → bash ~/bin/deploy.sh (دانلود مجدد ۱۶ دقیقه‌ای) → DEPLOYED OK → تست standalone → cPanel (env var، Domain/SAVE/RESTART) → DNS

---
Task ID: 11-e
Agent: Z.ai Code (main)
Task: رفع باگ capture در host-deploy v3 (v3.1) + ترمیم وضعیت هاست (node_modules حذف‌شده)

Work Log:
- باگ v3: echo پیام «downloading...» در download_verified به stdout رفت و در $(...) capture شد ⇒ RT_PART = «خط لاگ\n.part-...» ⇒ tar اسم غلط گرفت و مرد؛ چون rm -rf node_modules قبل از tar بود، node_modules هاست حذف شد (Cannot find module 'next')
- نکتهٔ مثبت: فایل ۳۷MB دانلودشده gzip -t را رد کرده و سالم روی دیسک مانده (.part-runtime-ff7a7b2d.tar.gz.2146209) — دانلود مجدد لازم نیست اگر ترمیم دستی بخواهد
- خطر همزمان: کرون هر ۲۰ دقیقه با v3 معیوب، هر بار ۳۷MB دانلود و در tar می‌مرد (part ها انبار می‌شدند) — تا رفرش اسکریپت به v3.1 باید متوقف شود
- v3.1 (commit f09a1b2): پیام‌ها به stderr، stdout فقط نام فایل، محافظ case روی شکل مسیر part + tar -tzf کامل قبل از rm -rf
- تست: bash -n OK؛ شبیه‌سازی capture تمیز OK؛ محافظ مسیر آلوده را می‌گیرد OK
- راه ترمیم کاربر: رفرش deploy.sh از raw (v3.1) → bash ~/bin/deploy.sh (دانلود مجدد runtime + app → DEPLOYED OK) یا ترمیم دستی از part موجود

Stage Summary:
- v3.1 ضدگلوله: capture تمیز، دوباره تست سلامت، محافظ مسیر؛ کرون از این پس امن
- وضعیت هاست: node_modules حذف شده، منتظر اجرای موفق v3.1؛ app bundle قدیمی ولی کامل روی دیسک

---
Task ID: 11-f
Agent: Z.ai Code (main)
Task: تشخیص فقط-خواندنی لاگ پروڈاکشن هاست (خروجی پیست‌شده کاربر) — نگاشت هر خط لاگ به کد

Work Log:
- خبر بزرگ در خود لاگ: اپ روی هاست زنده است — scheduler مسلح، دیتابیس وصل، ایجنت‌ها اجرا می‌شوند ⇒ node_modules ترمیم شده و Passenger اپ را بالا آورده
- خط ۱ «export: =production: not a valid identifier» ← متغیر env بدون Name در cPanel (آیتم معلق لیست 11) — wrapper nodevenv خط ۱۰ export خراب می‌زند؛ ریسک: NODE_ENV درست ست نشده باشد
- «Configuration file not found or invalid. Please create .z-ai-config» ← ریشه اصلی: .z-ai-config در .gitignore است (خط ۵۶) ⇒ هیچ‌وقت با باندل به هاست نرسیده؛ SDK ترتیب جستجو: project → home → /etc
- content-agent: webResearch و idea-generation با catch آرام skip می‌شوند (دو خط warn لاگ) ولی گام ۳ ZAI.create() بدون try/catch است ⇒ throw ⇒ «[agents:content] failed»
- اسپم تکراری: scheduledTodayDone وضعیت failed را قبول نمی‌کند ⇒ scheduler هر ۶۰ ثانیه دوباره تلاش می‌کند (طراحی: retry تا موفقیت) — با ساختن کانفیگ خودش خودترمیم می‌شود
- GEO ENOENT site-data.ts / robots.ts ← release.sh خط ۷۸ عمداً src/ را از باندل حذف می‌کند؛ geo-agent fail-safe است (هرگز throw نمی‌کند)، llms.txt ساخته و در public/ نوشته می‌شود (fs هاست نوشتنی است) — فقط ممیزی‌ها گزارش خطا می‌دهند؛ کنترل: rg «server.close» در کل پروژه = هیچ ⇒ خطای داخلی Next standalone هنگام خاموش‌شدن/ری‌استارت Passenger است، بی‌ضرر
- robots زنده: public/robots.txt سرو می‌شود (Allow: / برای همه شامل کرالرهای AI) ⇒ از نظر GEO سایت الان هم آزاد است؛ شکست ممیزی صرفاً گزارشی است
- aeo-agent هم ZAI.create دارد (lazy، خط ۳۵۹) ⇒ کانفیگ برایش الزامی؛ gsc-agent وابسته به ZAI نیست
- کانفیگ سندباکس (internal-api.z.ai + توکن chat-scoped) قابل انتقال به هاست نیست — کاربر باید API Key خودش از پلتفرم Z.AI بسازد

Stage Summary:
- تشخیص کامل بدون هیچ تغییر در ریپو/هاست (احترام به دستور توقف کاربر)
- مسیر ترمیم محتوا: (۱) cPanel: حذف سطر env بدون Name + اطمینان از NODE_ENV=production، (۲) ساخت ~/drpedram-app/.z-ai-config با کلید خود کاربر + chmod 600، (۳) ری‌استارت اپ ⇒ scheduler ≤۶۰ ثانیه بعد مقاله امروز را منتشر می‌کند
- پس از اجازه کاربر: release.sh دو فایل src/lib/site-data.ts و src/app/robots.ts را به باندل برگرداند (رفع ENOENT جیو) + می‌توان v3.2 گارد host-deploy.sh را در همان push برد
- معلق‌های قبلی پابرجا: حذف A رکورد ۱۳۳ (IP بانک)، AutoSSL، تأیید DEPLOYED OK

---
Task ID: 11-g
Agent: Z.ai Code (main)
Task: توقف فوری ایجنت‌های زمان‌بندی‌شده در پروڈاکشن (دستور صریح کاربر)

Work Log:
- مسیر اجرا: POST /api/agents/config با هدر x-admin-key از سندباکس (curl --resolve به 213.176.126.163 + -k برای گواهی self-signed)
- GET اولیه: کانفیگ فعلی خوانده شد — همه ایجنت‌ها enabled و autoPublish=true
- POST {"autoPublish":false} → پاسخ ok:true؛ GET تأییدی: autoPublish=false روی هاست (ذخیره در جدول AgentConfig دیتابیس — ماندگار روی ری‌استارت و دیپلوی)
- اثر: تیک ۶۰ ثانیه‌ای scheduler همچنان می‌چرخد ولی هر سه مسیر زمان‌بندی (content/geo/gsc) به autoPublish وابسته‌اند ⇒ دیگر هیچ اجرایی شروع نمی‌شود؛ اسپم لاگ تا یک دقیقه قطع می‌شود
- اجراهای دستی از پنل ادمین همچنان فعال‌اند (autoPublish فقط اتوماسیون را می‌بندد)
- فعال‌سازی مجدد در آینده: سوییچ «انتشار خودکار» در تب Agents پنل، یا POST {"autoPublish":true}

Stage Summary:
- اتوماسیون ایجنت‌ها در پروڈاکشن خاموش شد (تأییدشده با GET دوم)؛ کانفیگ در DB ماندگار است
- مشکل ریشه‌ای (نبودن .z-ai-config روی هاست) پابرجاست — قبل از روشن‌کردن مجدد باید ساخته شود وگرنه دوباره اسپم خطا برمی‌گردد

---
Task ID: 12
Agent: Z.ai Code (main)
Task: نگارش و انتشار ۵ مقاله ۱۰۰۰+ کلمه‌ای + ۵ کار AEO + ۵ کار GEO + فعال‌سازی مجدد ایجنت‌ها (دستور کاربر)

Work Log:
- قرارداد انتشار خوانده شد: POST /api/blog/publish با publishSchema (zod) — بلوک‌ها، شمارش کلمه، upsert روی slug
- scripts/draft-articles.ts نوشته شد: تولید سه‌مرحله‌ای (p1 متادیتا+۲ سکشن / p2 دو سکشن+list/table / p3 سکشن پایانی+faqs+cta) چون خروجی تک‌مرحله‌ای به سقف توکن می‌خورد و JSON بریده می‌شد
- اعتبارسنجی محلی: کپی دقیق articleWordCount سایت + قاعده سخت ضد آمار ساختگی (درصد/میلی‌متر ممنوع) + ساختار بلوک‌ها
- درس‌ها: اجرای موازی ۴تایی → 429؛ job پس‌زمینه بین فراخوانی‌های Bash کشته می‌شود → دو subagent موازی با اجرای سنکرون (Task 2-b: مقاله ۲+۳، Task 2-c: مقاله ۴+۵)
- ۵ مقاله یکتا ساخته شد (موضوع‌ها عمداً خارج از SEED_TOPICS ایجنت محتوا تا مقاله‌های آینده تکراری نشوند):
  1) digital-guided-implant-surgery — ۱۲۷۳ کلمه (ایمپلنت دیجیتال/گاید جراحی)
  2) pericoronitis-wisdom-gum-infection — ۱۰۹۶ کلمه (پری‌کورونیت)
  3) dental-abscess-facial-space-infection — ۱۱۲۶ کلمه (آبسه و عفونت فضاهای فک)
  4) jaw-fracture-facial-trauma-surgery — ۱۲۳۶ کلمه (شکستگی فک/تروما)
  5) impacted-canine-exposure-surgery — ۱۲۵۴ کلمه (نیش نهفته+ارتودنسی)
- انتشار روی هاست ایران: هر ۵ مقاله POST به /api/blog/publish → همه ok:true با wordCount دقیقاً برابر محاسبه محلی
- تأیید زنده: هر ۵ صفحه 200؛ همه در /blog فهرست شده‌اند؛ sitemap از ۱۰ به ۱۵ URL رسید و مقالات جدید داخلش هستند
- کارهای AEO (تأیید روی صفحه زنده): ۱) ساختار پاسخ‌محور ۵ h2 سوالی + پاسخ مستقیم بعد از هر h2 ۲) بلوک quickAnswers (۴ مورد) در هر مقاله و رندر واقعی ۳) FAQPage JSON-LD زنده ✓ ۴) MedicalWebPage + Physician + BreadcrumbList JSON-LD زنده ✓ ۵) title/metaDesc/canonical/og:image یکتا برای هر مقاله ✓
- کارهای GEO: ۱) اجرای دستی geo-agent روی هاست با skipWeeklyGate → llms.txt بازسازی شد (۶ مقاله، ۶.۴KB) ۲) تأیید زنده /llms.txt شامل هر ۵ URL جدید ۳) ممیزی موجودیت: تلفن 09302626021 در صفحه اصلی (گزارش «نیازمند بازبینی» صرفاً به‌خاطر ENOENT شناخته‌شده src/ در باندل است) ۴) ممیزی robots زنده: Allow:/ برای همه شامل کرالرهای AI ۵) jumle-quote: ۴ پاسخ سریع قابل استناد در هر مقاله (۲۰ جمله نقل‌پذیر جدید)
- فعال‌سازی مجدد ایجنت‌ها: POST autoPublish:true → تأیید GET؛ تیک بعدی اجرا شد
- وضعیت پس از فعال‌سازی: geo=success (اجرای دستی)؛ content=failed «Configuration file not found... .z-ai-config» → کانفیگ Z.AI هنوز روی هاست ساخته نشده؛ scheduler هر ۶۰ ثانیه retry می‌کند تا فایل ساخته شود

Stage Summary:
- ۵ مقاله ۱۰۰۰+ کلمه‌ای اورجینال روی سایت زنده است + sitemap/llms.txt به‌روز؛ پشته JSON-LD کامل (Physician/WebSite/MedicalWebPage/FAQPage/Breadcrumb)
- ایجنت‌ها فعال‌اند (autoPublish=true)؛ تنها گمشده: ~/drpedram-app/.z-ai-config روی هاست — به محض ساخته‌شدن، ایجنت محتوا خودکار مقاله می‌سازد و اسپم قطع می‌شود
- معلق‌های قبلی پابرجا: حذف A رکورد ۱۳۳، AutoSSL، متغیر env بدون Name در cPanel، اتصال GSC (منتظر JSON سرویس‌اکانت کاربر)

---
Task ID: 12-b
Agent: Z.ai Code (main)
Task: راستی‌آزمایی وضعیت زنده پروداکشن بعد از ساخت .z-ai-config توسط کاربر + پاسخ «کجای کار را ببینیم»

Work Log:
- کاربر فایل ~/drpedram-app/.z-ai-config را ساخت ولی با متن جای‌نگه‌دار فارسی «کلید_API_خودت» (نه کلید واقعی)
- GET /api/agents/status پروداکشن: autoPublish=true؛ geo=success (llms.txt با ۶ مقاله)؛ content=failed با خطای «Cannot convert argument to a ByteString» — ریشه: کاراکتر غیرASCII در هدر Authorization ⇒ تأیید قطعی که کلید واقعی هنوز ست نشده؛ history پر از رکوردهای failed تیک‌های ۶۰ ثانیه‌ای
- تأیید زنده تحویل‌دادنی‌های Task 12: هر ۵ مقاله HTTP 200، sitemap=15 URL، llms.txt زنده
- بررسی کد SDK (node_modules/z-ai-web-dev-sdk/dist/index.js): loadConfig در هر ZAI.create() فایل را از نو می‌خواند، بدون کش ⇒ پس از جایگزینی کلید، ری‌استارت اپ لازم نیست؛ تیک بعدی خودترمیم است
- مسیرهای مانیتورینگ شناسایی و به کاربر داده شد: پنل /admin → تب «ایجنت‌ها» (وضعیت هر ایجنت + آخرین اجرا + تاریخچه ۲۰ اجرای اخیر + اجرای دستی + سوییچ انتشار خودکار)، /blog، sitemap.xml، llms.txt، لاگ خطای cPanel

Stage Summary:
- همه تحویل‌دادنی‌های Task 12 روی پروداکشن زنده و تأییدشده‌اند؛ ایجنت‌ها فعال‌اند (autoPublish=true)
- تنها گام باقی‌مانده سمت کاربر: جایگزینی متن جای‌نگه‌دار با کلید واقعی Z.AI با یک خط sed (کلید از کنسول z.ai)؛ تا ۶۰ ثانیه بعد content agent خودترمیم می‌شود
- هیچ تغییری در ریپو یا هاست لازم نبود؛ خطای ByteString تا اصلاح کلید هر تیک تکرار می‌شود (بی‌خطر برای سایت، فقط رکورد failed در AgentRun)

---
Task ID: 13
Agent: Z.ai Code (main)
Task: تغییر کاور مقاله «دندان نیش نهفته» با عکس پانورامیک کاربر + ترمیم ریشه‌ای آپلود خراب پنل ادمین

Work Log:
- گزارش کاربر: تغییر عکس مقاله نیش نهفته از پنل «نشد» — ریشه پیدا شد: فیلد تصویر ویرایشگر بلاگ (fields.tsx ImageInput) و تب رسانه (media-tab.tsx) هر دو POST /api/admin/upload صدا می‌زنند ولی این مسیر در src/app/api اصلاً وجود نداشت ⇒ آپلود پنل همیشه ۴۰۴
- مسیر POST /api/admin/upload ساخته شد: checkAdmin، فقط تصاویر JPEG/PNG/WebP/GIF/AVIF (SVG ممنوع — XSS)، سقف ۵MB، ذخیره base64 در جدول Media (همان الگوی content-agent)، پاسخ {ok,id,url:"/api/media/<id>"} که دقیقاً همان چیزی است که ImageInput انتظار دارد، logActivity
- تست محلی: آپلود سالم → ok+url؛ کلید غلط → 401؛ نوع غیرتصویری → 415 با پیام فارسی؛ سرو /api/media/<id> → 200 با همان بایت‌های فایل (34719)؛ lint تمیز
- عکس کاربر (پانورامیک با نیش نهفته هایلایت قرمز، 753x407 JPEG، 34KB) در upload/ است — پس از دیپلوی به پروداکشن آپلود و کاور مقاله impacted-canine-exposure-surgery می‌شود (کاور فعلی: clinic-photo-4.jpg عمومی)
- JSON کامل مقاله از /api/admin/content پروداکشن گرفته شد (/tmp/canine-article.json — ۲۴ بلوک، ۴ quickAnswers، ۵ faq) + publishedAt اصلی 2026-10-14T11:38:53.355Z برای حفظ تاریخ
- دو اصلاح باندل هم‌سفر: release.sh و deploy.yml دیگر src/ را کامل حذف نمی‌کنند — دو فایل src/lib/site-data.ts و src/app/robots.ts برگردانده می‌شوند (رفع ENOENT ممیزی geo-agent روی هاست، بند معلق Task 11-f)
- نکته تشخیصی: خروجی «ain]» در نمایش deploy.yml خرابی ترمینال بود (بلعیده‌شدن [m از [main])؛ od -c تأیید کرد فایل از ابتدا branches: [main] درست بوده
- وضعیت گیت: ۶ کامیت قبلی worklog/اسکریپت پیش‌نویس/مجوز فایل هم‌راها push شدند (بی‌خطر — بدون تغییر سورس اپ)

Stage Summary:
- ریشه «نشد» کاربر ترمیم شد: آپلود پنل ادمین (فیلد تصویر بلاگ + کتابخانه رسانه) از این پس کار می‌کند
- کاور نیش نهفته پس از دیپلوی خودکار کرون هاست (≤۲۰ دقیقه پس از سبز شدن CI) با عکس پانورامیک واقعی جایگزین و راستی‌آزمایی زنده می‌شود
- pending پس از دیپلوی: آپلود عکس به پروداکشن، انتشار مجدد مقاله با حفظ publishedAt، چک og:image و کتابخانه رسانه

---
Task ID: 13-b
Agent: Z.ai Code (main)
Task: دیپلوی، انتشار کاور جدید و راستی‌آزمایی زنده (ادامه Task 13)

Work Log:
- push 34d4836 → CI run 38565401268 در ~۲ دقیقه completed/success → Release منتشر شد
- پروب هاست: ۴ بار 409 «Server Action unavailable» (پاسخ باندل قدیم به POST مسیر ناشناخته)؛ در پروب ۵ (~۱۰ دقیقه) باندل جدید لایو شد و آپلود پروب 200 داد
- آپلود عکس پانورامیک واقعی (34KB) به پروداکشن → /api/media/cmv8453wc00035xmeix8cs7cj (سرو 200 با همان بایت‌ها)
- انتشار مجدد مقاله impacted-canine-exposure-surgery: action=updated، wordCount=1254 (بدون تغییر محتوا)، publishedAt اصلی حفظ شد؛ هر coverImage و article.cover/coverAlt ست شد (src.cover در assembleArticle اولویت دارد)
- راستی‌آزمایی زنده: صفحه مقاله 200 و URL جدید در HTML؛ og:image مطلق به دامنه خود سایت؛ بهینه‌ساز next/image روی /_next/image 200 image/jpeg؛ /blog هم کاور جدید را نشان می‌دهد؛ رد clinic-photo-4 در صفحه فقط از داده گالری مطب است (بی‌ربط به کاور)
- پروب.png از کتابخانه رسانه پروداکشن حذف شد (تمیزکاری)
- رندر بصری با agent-browser: DNS واقعی از سندباکس unreachable بود (IPv6 تایم‌اوت) و /etc/hosts هم قفل ⇒ آینه محلی (curl با resolve + python http.server + agent-browser در یک فراخوانی) ⇒ عنوان، H1، بردکرامب، نویسنده و کاور پانورامیک به‌درستی رندر شد (screenshot)
- کارهای ریز: کلید GITHUB token از remote بدون چاپ استخراج و برای پولینگ CI استفاده شد

Stage Summary:
- کاور مقاله نیش نهفته روی پروداکشن به رادیوگرافی پانورامیک واقعی (نیش هایلایت قرمز) تغییر کرد — عکس روی دامنه خود سایت سرو می‌شود (SEO سالم) و og:image هم به‌روز است
- آپلود پنل ادمین (فیلد تصویر بلاگ + تب رسانه) از این پس کار می‌کند؛ کاربر می‌تواند خودش از دکمه «آپلود از دستگاه» استفاده کند
- ENOENT ممیزی geo-agent هم با این دیپلوی رفع شد (دو فایل src به باندل برگشتند) — در اجرای بعدی GEO باید «موجودیت‌ها» کامل گزارش شود
- معلق: کلید واقعی Z.AI در .z-ai-config هاست (هنوز placeholder)؛ JSON سرویس‌اکانت GSC؛ حذف A رکورد ۱۳۳؛ AutoSSL

---
Task ID: 14
Agent: Z.ai Code (main)
Task: عکس بی‌ربط مقاله آبسه + دستور کاربر برای انتخاب عکس موضوعی توسط ایجنت‌ها + ترمیم «تست جامع سایت»

Work Log:
- عکس مقاله آبسه (clinic-photo-3 عمومی) با جست‌وجوی تصویر واقعی جایگزین شد: z-ai image-search، ۱۲ کاندید دیدitas شده بصری، انتخاب عکس کلینیکی تک‌فریم آبسه داخل دهانی (1280×720، بدون واترمارک) → آپلود به Media پروداکشن → انتشار مجدد (wordCount 1126 و publishedAt حفظ شد) → تأیید زنده صفحه + og:image + رندر بصری با agent-browser
- جست‌وجوی شکستگی فک هم انجام شد ولی همه کاندیدها ژورنالی/واترمارک‌دار/عکس-صفحه‌نمایش بودند → فعلاً ماند؛ از کاربر عکس خودش خواسته شد (اصالت کلینیکی بهتر از عکس وب)
- content-agent بازنویسی کاور (دستور مدیر): گام ۱ جست‌وجوی وب — LLM از عنوان فارسی کوئری انگلیسی ۵-۸ کلمه‌ای می‌سازد → zai.images.search.create (count 8, gl us) → فیلتر: افقی ≥700×400 + حذف سایت‌های استوک (alamy/shutterstock/...) → دانلود ۳ کاندید اول با اعتبارسنجی mime/حجم → ذخیره در Media. گام ۲ تولید AI خنثی. گام ۳ گالری ثابت. summary اجرا نوع کاور را گزارش می‌کند (جست‌وجوی وب/تولید AI/گالری) — با کلید واقعی Z.AI فعال می‌شود
- ریشه «تست جامع سایت»: .gitignore الگوی لخت `test` (خط ۶۰) هر پوشه test در هر عمقی را می‌بلعید ⇒ مسیر src/app/api/admin/test هرگز کامیت نشده بود؛ پنل به POST /api/admin/test وصل بود که وجود نداشت (هم‌خانواده باگ upload)
- /test و /prompt در .gitignore به ریشه آنکور شدند؛ POST /api/admin/test ساخته شد: باتری سرور (SELECT 1 + شمارش جداول، ۱۰ بند computeHealth، فایل‌های سئو/GEO، ۸ سازنده JSON-LD با محتوای زنده، سایت‌مپ) → تست محلی 29/29
- کشف تست: public/robots.txt استاتیک (بدون Sitemap و بدون Disallow /api و /admin) روی مسیر داینامیک robots.ts سایه می‌انداخت؛ حذف استاتیک + خط rm در host-deploy.sh — ولی چون اسکریپت هاست کهنه است (کاربر باید از raw رفرش کند) و tar روی پوشه کهنه استخراج می‌کند، محتوای دقیق داینامیک به‌صورت استاتیک شپ شد تا در همین دیپلوی بازنویسی شود
- دیپلوی‌ها: 6955eed (test endpoint + agent covers) لایو با پروب 404→200، تست زنده پروداکشن 29/29 امتیاز 100؛ 3570b63 (robots استاتیک) لایو — Sitemap در /robots.txt زنده تأیید شد

Stage Summary:
- دکمه «تست جامع سایت» پنل ادمین حالا کار می‌کند (سرور ۲۹ بند + پروب مرورگر ۱۴ مسیر + تصاویر + قفل ۴۰۱) — زنده: 29/29
- ایجنت محتوا از این پس عکس کاور را از وب با موضوع تطبیق می‌دهد (نیازمند کلید واقعی Z.AI که هنوز placeholder است)
- مقاله آبسه عکس واقعی کلینیکی گرفت؛ مقاله‌های شکستگی/ارتوگناتیک هنوز عکس مشترک دارند (منتظر عکس از کاربر)
- robots.txt زنده حالا Sitemap + بستن /api و /admin + ۱۴ کرالر AI دارد
- یادآوری پابرجا: کلید Z.AI واقعی، JSON سرویس‌اکانت GSC، رفرش deploy.sh هاست از raw، حذف A رکورد ۱۳۳، AutoSSL
---
Task ID: 15
Agent: Z.ai Code (main)
Task: تغییر پالت رنگی سایت به سبز + سرمه‌ای (درخواست مستقیم کاربر)

Work Log:
- ریشه‌یابی: پالت قدیمی «پترول/تیل» (oklch hue ۱۹۰-۲۰۵) در دو لایه بود: (۱) متغیرهای :root/.dark و کلاس‌های برند petrol/sage/gold در globals.css — همه کامپوننت‌ها از همین متغیرها تغذیه می‌شدند، (۲) ده‌ها مقدار hardcode oklch و کلاس‌های teal-* داخل خود فایل‌های کامپوننت
- globals.css: primary/accent/ring/chart/sidebar به سبز جراحی oklch(0.5 0.115 152)؛ خانواده petrol به سرمه‌ای (petrol=oklch(0.23 0.05 262), petrol-deep=0.16, petrol-soft=0.31)؛ sage به سبز روشن hue 150؛ طلا دست‌نخورده (هارمونی با سبز+سرمه‌ای)؛ dark mode با زمینه سرمه‌ای‌فام بازنویسی شد
- ابزارهای CSS داخل globals.css: selection، اسکرول‌بار، text-gradient (تیره/روشن)، aurora، glass-dark، card-sage، scroll-progress، divider-fade، logo-halo و logo-glow (بنفش/آبی → سبز/سرمه‌ای)، cinema-sweep، vignette، admin-root پنل مدیریت
- ۳۰+ فایل کامپوننت: همه teal-* → emerald-* (سایت + پنل ادمین)؛ تمام oklchهای hardcode قدیمی (hue 190/185/175/180/192/200/205/210/295/255/300) به 152/155/150 (سبز) یا 262/264 (سرمه‌ای) شیفت — کلید و tone «teal» هیرو به «green»
- layout.tsx themeColor: روشن #f7fbf7 (سبزفام) / تیره #151721 (سرمه‌ای‌فام)
- گار باگ‌یابی جانبی: قبل از شروع، فایل src/app/api/admin/upload/route.ts در working tree حذف شده بود (دستکاری خارج از جلسه) → git checkout HEAD بازگرداند؛ کامیت c76520e فقط فیکس .gitignore را شامل بود (سالم)
- راستی‌آزمایی زنده (agent-browser): صفحه اصلی — هیرو سبز (دکمه‌ها/پیل منوی فعال/متن گرادیانی سبز)، CTA و فوتر سرمه‌ای عمیق، نوار پیشرفت سبز→طلا؛ صفحه /blog — هیرو سرمه‌ای + تیتر گرادیانی سبز؛ dev.log بدون خطا؛ lint تمیز
- دیپلوی: کامیت 5b3cd98 → CI completed/success

Stage Summary:
- سایت حالا سبز (primary/دکمه‌ها/لینک‌ها) + سرمه‌ای (بخش‌های تیره، هیرو صفحات، فوتر، پنل ادمین) است؛ طلای متناسب به‌عنوان اکسنت ثابت ماند
- کل تغییرات متغیرمحور بود → بدون تغییر یک خط در منطق کامپوننت‌ها؛ فقط رنگ‌ها
- معلق پابرجا: کلید واقعی Z.AI در .z-ai-config هاست (هنوز placeholder)، JSON سرویس‌اکانت GSC، حذف A رکورد ۱۳۳، AutoSSL
---
Task ID: 16
Agent: Z.ai Code (main)
Task: رفع باگ «نظرات همه با هم میان/می‌روند» — جریان پیوسته دونه‌دونه راست‌به‌چپ با حلقه بی‌نهایت

Work Log:
- ریشه باگ: صفحه dir=rtl است؛ مکانیک Magic UI Marquee برای LTR طراحی شده — در RTL کپی‌های track به سمت چپ سرریز می‌شوند، حرکت translateX منفی حفره خالیِ بزرگ از سمت راست می‌سازد و در پایان سیکل همه‌چیز پرش می‌کند ⇒ حس «همه با هم میان و همه با هم می‌روند». دو ردیف (یکی reverse) این حس را دوچندان می‌کرد
- فیکس ریشه‌ای در marquee.tsx: بیرونی dir="ltr" (مکانیک: سرریز به راست، حرکت به چپ، حلقه بی‌درز) + هر کپی dir={contentDir} با پیش‌فرض "rtl" تا متن فارسی کارت‌ها جهت درست بماند؛ پراپ جدید contentDir
- home.tsx: دو ردیف ۴ کارتی (با جهت مخالف) → یک ردیف پیوسته با هر ۱۲ نظر (repeat=2؛ عرض هر کپی ۴٫۸ متر > هر ویوپورت ⇒ بی‌درز تضمینی)، سیکل ۱۵۰ ثانیه، gap 1.25rem
- دو مصرف‌کننده دیگر (brands صفحه خدمات + نظرات صفحه reviews) با همین فیکس کامپوننتی خودکار درست شدند
- راستی‌آزمایی زنده با agent-browser: سرعت اندازه‌گیری‌شده ۳۲٫۵px/s (دقیقاً 4780px÷150s)، دو اسکرین‌شات با فاصله ۶ ثانیه: کارت جدید از لبه راست وارد، کارت قدیمی از چپ محو (mask-fade-x)؛ بدون حفره خالی؛ متن فارسی RTL سالم داخل کارت‌ها؛ برندهای ایمپلنت (ZIMMER/ITI/...) هم درست جریان دارند؛ lint تمیز
- دیپلوی: c7eb33c → CI success

Stage Summary:
- نظرات صفحه اول حالا دونه‌دونه از راست وارد و از چپ خارج می‌شوند، پیوسته و بی‌نهایت؛ pauseOnHover هم فعال است
- باگ جهت Marquee برای کل سایت (هر سه مصرف‌کننده) ریشه‌ای رفع شد

---
Task ID: 16
Agent: Z.ai Code (main)
Task: حذف نشان «۵٫۰ در گوگل · ۹ نظر» از صفحه اول + رفع توقف کامل نوار نظرات (نظرات حرکت نمی‌کردند)

Work Log:
- بازرسی تولید (prod HTML/CSS): مارک‌آپ marquee و keyframes درست بودند؛ در مرورگر واقعی نوار با سرعت ۳۳px/s حرکت می‌کرد ⇒ مشکل سمت دستگاه کاربر بود، نه کد
- ریشه‌یابی: قانون سراسری prefers-reduced-motion در globals.css با animation-duration:.01ms!important و animation-iteration-count:1!important حلقه‌ی ۱۵۰ ثانیه‌ای را روی گوشی‌هایی که «حذف انیمیشن‌ها» فعال است (باتری‌سیور اندروید / Reduce Motion iOS) کاملاً متوقف می‌کرد — علت قطعی یخ‌زدگی
- ریسک دوم: group-hover:[animation-play-state:paused] در موبایل بعد از یک تپ، :hover گیر می‌کند و نوار برای همیشه pause می‌شود
- حذف نشان امتیاز: motion.p «{score} در گوگل · {count} نظر» از بخش نظرات home.tsx حذف شد (Star هنوز در ReviewCard استفاده می‌شود)
- globals.css: استثنای marquee داخل همان بلاک reduced-motion اضافه شد — .animate-mg-marquee(-vertical) با specificity بالاتر و ترتیب بعدی: animation-duration:var(--mg-duration,40s)!important + iteration-count:infinite!important
- marquee.tsx: توقف با هاور فقط روی دستگاه‌های دارای ماوس: [@media(hover:hover)]:group-hover:[animation-play-state:paused]
- نکته فنی: Turbopack dev پس از ویرایش‌های سریع globals.css/marquee.tsx ری‌کامپایل نکرد؛ با append یک کامنت (تغییر اندازه فایل) watcher بیدار شد
- تأیید مرورگر (agent-browser): نشان حذف شد؛ حرکت ۶۶px در ۲ ثانیه؛ قواعد جدید در CSS کامپایل‌شده بررسی شد (ترتیب cascade + @media(hover:hover))
- lint گذشت؛ commit efa197c (به‌همراه 4361640 فقط worklog) push شد؛ CI: success

Stage Summary:
- تولید: نشان «۵٫۰ در گوگل · ۹ نظر» حذف می‌شود و نوار نظرات دیگر روی هیچ دستگاهی نمی‌ایستد (حتی با Reduce Motion فعال)
- فایل‌ها: src/components/site/pages/home.tsx، src/components/magicui/marquee.tsx، src/app/globals.css
- باقی‌مانده (خواسته قبلی کاربر): تطبیق خودکار عکس بلاگ‌ها با موضوع (جستجوی گوگل) + رفع دکمه «تست جامع سایت» پنل ادمین

---
Task ID: 17
Agent: Z.ai Code (main)
Task: علت نبود مقاله جدید (دیروز/امروز) — عیب‌یابی و رفع کامل زنجیره ایجنت محتوا

Work Log:
- /api/agents/status روی تولید: content failed7d=2676 — خطا «Cannot convert argument to a ByteString ... value of 1705» (۱۷۰۵ = حرف «ک» فارسی)
- ریشه: فایل .z-ai-config روی هاست همچنان متن فارسی placeholder است؛ SDK کلید را در هدر Authorization می‌گذارد و fetch مقدار غیر Latin-1 را نمی‌پذیرد ⇒ ZAI.create() در ۸ms شکست می‌خورد
- چون scheduledTodayDone فقط «success» را می‌شمارد، زمان‌بند هر ۶۰ ثانیه دوباره تلاش می‌کرد ⇒ طوفان ۲۶۷۶ شکست در ۷ روز (≈ هر دقیقه)
- ماژول جدید src/lib/agents/zai-config.ts: ensureZaiConfig() کلید را از تنظیمات دیتابیس (AgentConfig JSON) می‌خواند و پیش از هر اجرا .z-ai-config (cwd، mode 0600) را می‌نویسد؛ کلید غیرASCII خطای فارسی واضح می‌دهد؛ friendlyAgentError خطای ByteString را به راهنمای فارسی پنل ترجمه می‌کند
- runner.ts: AgentsConfig += zaiKey/zaiBaseUrl (هرگز به کلاینت نمی‌رود)؛ sanitizeAgentsConfig (فقط zaiKeySet + zaiKeyMasked)؛ runAgent ← ensureZaiConfig
- scheduler.ts: سقف ۵ تلاش زمان‌بندی در روز برای محتوا + هرس شکست‌های قدیمی‌تر از ۳ روز
- agents-tab.tsx: کارت «کلید هوش مصنوعی (Z.AI)» — ورودی کلید (password)، آدرس API اختیاری (پیش‌فرض https://api.z.ai/api/paas/v4)، ذخیره/حذف، نشان ثبت‌شده/ثبت‌نشده
- API config: POST اعتبارسنجی ASCII، خالی=بدون تغییر، __CLEAR__=حذف
- تست محلی کامل: ذخیره/ماسک/حذف کلید، رد کلید فارسی (۴۰۰)، محتوای فایل نوشته‌شده، پرتاب خطای فارسی، جریان UI پنل (نشان + توست)
- حادثه: git add -A src/ حذف session-outside مسیر upload را کامیت کرد ⇒ فوراً با checkout HEAD~1 و amend اصلاح شد (کامیت نهایی فقط ۷ فایل موردنظر)
- commit eddc8bc ← CI success

Stage Summary:
- کاربر باید فقط از پنل ادمین ← ایجنت‌ها ← «کلید هوش مصنوعی» کلید واقعی Z.AI را وارد کند و «اجرای کامل خط‌لوله» بزند — بدون SSH
- طوفان شکست هر دقیقه متوقف شد (سقف ۵/روز)؛ پیام خطاها در پنل فارسی و قابل‌اقدام است
- نکته برای کلید: هر سرویس سازگار با OpenAI (z.ai رسمی: api.z.ai/api/paas/v4)

---
Task ID: 18
Agent: Z.ai Code (main)
Task: «چون پول ندارم و API پولی هست نمی‌تونم — بکنش ورک‌فلو گیت‌هاب، اگه رایگان هست بگو» — ساخت ایجنت محتوای کاملاً رایگان روی GitHub Actions + عیب‌یابی ریشه نبود مقاله جدید (کلید Z.AI placeholder در هاست)

Work Log:
- تأیید عیب‌یابی قبلی: عامل محتوای درون‌برنامه‌ای به کلید Z.AI پولی نیاز دارد که کاربر ندارد ⇒ کل زنجیره به بستر رایگان GitHub Actions منتقل شد (خواسته صریح کاربر: «ورک‌فلو گیت‌هاب»)
- زیرساخت: ریپو عمومی است (Actions رایگان نامحدود)، SSL هاست الان معتبر است (Let's Encrypt، بدون -k)، DNS عمومی درست رزلو می‌شود ⇒ Actions می‌تواند مستقیم به API سایت منتشر کند
- API جدید POST /api/agents/publish (x-admin-key + publishSchema + publishPost idempotent) — درگاه انتشار از بیرون برای اسکریپت Actions
- اسکریپت scripts/github-agent/generate-article.mjs (Node خالص بدون وابستگی): انتخاب موضوع از بانک ۳۴ تایی topics.json (عنوان + زاویه + کلیدواژه + پرامپت تصویر موضوع‌محور برای هر کدام) + state.json ضد تکرار (خود ورک‌فلو کامیتش می‌کند) + حذف تکراری با sitemap سایت
- زنجیره LLM رایگان: ۱) GitHub Models با GITHUB_TOKEN (models:read) ۲) endpoint قدیمی با PAT (سیکرت GH_MODELS_PAT ست شد) ۳) Pollinations مارک‌داونی (بدون هیچ کلیدی) — کشف: models.github.ai در ۲۰۲۶ به همه درخواست‌ها «OK» متنی برمی‌گرداند (حتی بدون auth، حتی از شبکه ثالث) و legacy هم down است ⇒ عملاً Pollinations ارائه‌دهنده اصلی است
- کشف مهم Pollinations: مدل «openai-fast» = gpt-oss-20b با reasoning؛ بدون reasoning_effort:low کل بودجه توکن را reasoning می‌خورد و content خالی می‌ماند (finish:length)؛ JSON ساختاریافته هم هر بار به شکل متفاوت خراب می‌کند ⇒ مسیر Markdown مقاوم ساخته شد: قالب متادیتا (TITLE/SLUG/...) + ==== + بدنه Markdown + بخش «سوالات متداول» Q/A → پارسر قطعی mdToBlocks (h2/h3/list/table/callout/cta) + splitFaq + repairJson برای JSON خراب + فیلتر تکرار دستورالعمل + ضد placeholder متادیتا
- محدودیت نرخ Pollinations («۱ پاسخ هر ۳۰ ثانیه در هر IP»): صبر هوشمند بر اساس Retry-After + تا ۵ تلاش؛ روی IP مشترک سندباکس مدام 402 می‌داد ولی روی رانر اختصاصی Actions بدون مشکل
- کاور «مرتبط با موضوع»: تصویر رایگان image.pollinations.ai (پرامپت انگلیسی موضوع‌محور هر موضوع در topics.json) → آپلود در رسانه سایت (مولتی‌پارت /api/admin/upload) → fallback گالری ثابت — خواسته قدیمی «عکس مرتبط با موضوع» این‌جا محقق شد (به‌جای جستجوی گوگل که کپی‌رایت دارد)
- ورک‌فلو .github/workflows/content-agent.yml: cron 30 3 * * * (۰۷:۰۰ تهران — ایران دیگر ساعت تابستانی ندارد) + workflow_dispatch با گزینه force + permissions (contents:write, models:read) + concurrency + کامیت state.json با github-actions[bot]
- سیکرت‌های ریپو: ADMIN_KEY (با libsodium sealed box از API ست شد) + GH_MODELS_PAT
- تست: اجرای کامل محلی (DRY_RUN و واقعی روی dev) → انتشار موفق «dental-implant-cost-1405» در dev؛ سپس در Actions دو اجرای موفق روی تولید: مقاله «هزینه ایمپلنت دندان ۱۴۰۵» (۶۳۳ کلمه) و «نشانه‌های دندان عقل نهفته» (۷۱۹ کلمه) — هر دو با کاور تولیدی آپلودشده
- باگ حین کار: rawText خارج از scope در پاس غنی‌سازی (ReferenceError گرفته می‌شد) ⇒ lastRawArticle در سطح تابع؛ گسترش پاس توسعه برای هر دو ارائه‌دهنده GitHub
- راستی‌آزمایی تولید با agent-browser: صفحه مقاله کامل رندر می‌شود (تیتر، kicker، نویسنده، زمان مطالعه، h2 سوالی + پاسخ مستقیم، فهرست، فهرست هشدار، سوالات متداول، CTA، جعبه نویسنده)، هر دو مقاله در sitemap.xml و صفحه /blog هستند؛ CI هر دو push سبز
- CI push سوم (08b6e43): سخت‌سازی پرامپت (الزام بخش Q/A، ممنوعیت تکرار دستورالعمل) — برای اجرای روزانه فردا

Stage Summary:
- از فردا ۰۷:۰۰ تهران هر روز خودکار یک مقاله رایگان منتشر می‌شود — هزینه: صفر (Actions رایگان + Pollinations رایگان)، بدون نیاز به کلید Z.AI
- اجرای دستی: تب Actions ریپو ← «ایجنت محتوا» ← Run workflow (با force برای انتشار اجباری)
- گزارش هر اجرا در Summary خود job (فارسی) + فعالیت انتشار در پنل ادمین دیده می‌شود (ActivityLog از مسیر publishPost)
- کلید Z.AI پنل ادمین همچنان کارساز است (مسیر درون‌برنامه‌ای) ولی دیگر ضروری نیست
- نکته: کیفیت متن Pollinations (gpt-oss-20b) حدود ۶۰۰-۹۰۰ کلمه است؛ اگر روزی خواست کیفیت بالاتر رفت، فقط کافی است endpoint جدید GitHub Models/سرویس رایگان دیگر به زنجیره اضافه شود

---
Task ID: 19
Agent: Z.ai Code (main)
Task: رفع خطای سرچ کنسول «Affected pages were found — Item: دکتر پدرام بخشایی» در صفحه /reviews (اسکیمای Structured Data)

Work Log:
- استخراج و تحلیل ۴ بلوک JSON-LD صفحه زنده /reviews در پروداکشن
- یافتن ۳ ایراد: ①دو نود Physician با @id یکسان #physician اما داده متفاوت (layout + reviewsJsonLd) ②reviewCount=9 ولی فقط ۸ نظر درج‌شده (slice(0,8)) ③نبود datePublished و worstRating در نظرات
- بازنویسی reviewsJsonLd در src/lib/seo.tsx: حذف تعریف تکراری Physician، خروجی @graph از Review مستقل با itemReviewed مرجع، افزودن worstRating، درج همه نظرات
- افزودن reviewDateIso(): تبدیل تاریخ نمایشی فارسی («بهمن ۱۴۰۴»، «۷ ماه قبل») به ISO معتبر با جدول anchors ۱۴۰۰-۱۴۰۸ + کلمپ ضد تاریخ آینده
- کشف در پروداکشن: ادمین ۳ نظر اضافه کرده (۱۲ نظر کل) → physicianJsonLd امضای (site, services?, reviews?) گرفت و reviewCount از داده زنده محاسبه می‌شود؛ layout و admin/test پاس دادن content.reviews
- commit 2b9501e (اصلاح اسکیما) و efddc75 (تطابق reviewCount=12) → هر دو CI success
- تأیید زنده پروداکشن: یک تعریف Physician، reviewCount=12، ۱۲ نظر با datePublished/worstRating/itemReviewed — صفر مشکل

Stage Summary:
- اسکیمای نظرات اکنون کاملاً سازگار با الزامات Google Review Snippet است
- کاربر باید در سرچ کنسول روی «VALIDATE FIX» (اعتبارسنجی مجدد) کلیک کند
- نکته سیاستی: گوگل برای Organization/LocalBusiness نظرات خودسایت (self-serving) ستاره نمایش نمی‌دهد؛ مارکاپ درست است ولی ستاره در SERP تضمینی نیست

---
Task ID: 20
Agent: Z.ai Code (main)
Task: استراتژی کلیدواژه‌محور برای ۴ عبارت هدف کاربر: جراحی فک، جراحی چانه، ایمپلنت پاسداران، ایمپلنت دندان — صفحات فرود SEO/AEO

Work Log:
- آدیت پوشش فعلی: services/prices/بلاگ/FAQ — کشف شکاف کامل برای «جراحی چانه» و «ایمپلنت پاسداران»
- ساخت src/lib/landings.ts: ۴ کانفیگ لندینگ کامل (متا، پاسخ کوتاه AEO، بخش‌ها، مراحل، FAQ، تعرفه مرتبط، مش لینک)
- ساخت src/components/site/pages/service-landing.tsx: قالب مشترک (هیرو → پاسخ کوتاه → آمار → بخش‌ها → جدول تعرفه زنده از priceTabs پنل → اعتبار جراح → FAQ آکاردئون → لینک‌های مرتبط → CTA)
- ۴ route جدید: /jaw-surgery، /chin-surgery، /dental-implant، /implant-pasdaran با اسکیمای MedicalProcedure + FAQPage + BreadcrumbList
- لینک‌سازی داخلی: ستون «صفحات تخصصی» فوتر (sitewide)، دکمه لندینگ روی کارت‌های صفحه خدمات، نان‌برکرامب لندینگ‌ها
- sitemap.xml (+۴ با اولویت ۰٫۹۵)، llms.txt (بخش صفحات تخصصی برای AIها)
- commit e3de6fd → CI success → تأیید پروداکشن با agent-browser (۴ صفحه، FAQ کلیک، ناوبری فوتر، موبایل ۳۹۰px بدون overflow، اسکیمای ۵گانه در هر صفحه)

Stage Summary:
- هر ۴ کلیدواژه هدف اکنون صفحه اختصاصی با title/H1/FAQ/اسکیما و پاسخ کوتاه قابل استناد AI دارند
- تعرفه‌ها از داده زنده پنل ادمین می‌آیند (priceTabs) — تغییر قیمت در پنل خودکار روی لندینگ‌ها اعمال می‌شود
- کاربر باید ۴ URL جدید را در سرچ کنسول ثبت/ایندکس کند؛ رتبه‌گیری واقعی چند هفته زمان می‌برد

---
Task ID: 21
Agent: Z.ai Code (main)
Task: اتصال مستقیم به Google Search Console از طریق سرویس اکانت + اتوماسیون گزارش روزانه

Work Log:
- کاربر سرویس اکانت گوگل (project: armanhamrah) ساخت و JSON کلید را تحویل داد
- ذخیره امن کلید در secrets/gsc-service-account.json (chmod 600) + gitignore کامل (پوشه secrets/)
- ساخت scripts/gsc/gsc-lib.mjs: احراز JWT (RS256 با node:crypto) → توکن OAuth → فراخوانی Search Console API بدون هیچ وابستگی خارجی
- ساخت scripts/gsc/check.mjs: گزارش کامل (کلی/نمایش/رتبه ۲۸روزه + ۴ کلمه هدف + کوئری‌ها/صفحات برتر + نقشه سایت + وضعیت ایندکس ۴ لندینگ با URL Inspection API)
- ذخیره کلید به‌صورت رمزنگاری‌شده (libsodium sealed box با pynacl) به‌عنوان سکرت GSC_KEY_JSON در گیت‌هاب
- ساخت .github/workflows/gsc-daily.yml: cron «30 4 * * *» = ۰۸:۰۰ تهران + workflow_dispatch؛ گزارش را در reports/gsc-latest.md کامیت می‌کند ([skip ci])
- رفع باگ مسیر مطلق کلید (روی رانر گیت‌هاب ENOENT) → مسیر نسبی به import.meta.url
- ران آزمایشی: بار اول fail، بار دوم success ✅
- کشف مهم: ۳ لندینگ (jaw-surgery/chin-surgery/dental-implant) ایندکس شده‌اند؛ implant-pasdaran هنوز «URL is unknown to Google»
- نقشه سایت دوباره با API سابمیت شد (PUT sitemaps) تا گوگل implant-pasdaran را سریع‌تر ببیند

Stage Summary:
- ایجنت سرچ کنسول کاملاً فعال شد: هر روز ۰۸:۰۰ تهران گزارش خودکار در مخزن + امکان اجرای دستی لحظه‌ای
- داده اولیه: کل سایت ۱۷ کلیک/۲۷۰ نمایش (فقط صفحه اصلی)؛ جراحی فک رتبه ۵٫۹ با ۳۳ نمایش؛ ۳ کلمه دیگر هنوز داده ندارند (لندینگ‌ها تازه ایندکس شده‌اند)
- حالا می‌توان ایندکس/رتبه/کوئری‌ها را بدون دسترسی کاربر مستقیم از API رصد و مدیریت کرد

---
Task ID: 22
Agent: Z.ai Code (main)
Task: ایجنت مانیتور ۳۰ دقیقه‌ای + IndexNow + فیکس عامل محتوا + نقشه پلتفرم‌های SEO/AEO/GEO

Work Log:
- کشف: کامیت‌های [skip ci] دیپلوی را هم می‌بستند → کامیت خالی بدون skip برای فعال‌سازی دیپلوی
- IndexNow راه‌اندازی شد: کلید f4d23335... (public/{key}.txt) + scripts/indexnow-submit.mjs → سابمیت ۲۲ URL موفق (202) به Bing/Copilot/ChatGPT Search/DuckDuckGo
- گلوگاه دیپلوی فهمیده شد: گیت‌هاب فقط Release منتشر می‌کند، کرون هاست از releases/latest می‌کشد → فایل کلید بعد از pull هاست زنده شد
- مانیتور ۳۰ دقیقه‌ای: scripts/gsc/monitor.mjs + .github/workflows/gsc-monitor.yml (cron */30) — سلامت ۵ صفحه، ایندکس ۴ لندینگ، سلامت sitemap؛ کامیت فقط در صورت تغییر؛ run آزمایشی success
- implant-pasdaran ایندکس شد ✅ (بعد از سابمیت مجدد sitemap) — هر ۴ لندینگ الان داخل گوگل است
- عامل محتوا امروز کرونش اجرا نشده بود → dispatch دستی → فیلدهای شکست: GitHub Models پاسخ «OK» (موقتی) + Pollinations بدون quickAnswers → fallback ساخت quickAnswers از FAQ + مرحله پینگ IndexNow بعد از انتشار → dispatch مجدد: success، مقاله امروز post-oral-surgery-care منتشر و 200
- ربات‌های AI در robots.txt همگی مجاز بودند (GPTBot/OAI-SearchBot/PerplexityBot/ClaudeBot/...)

Stage Summary:
- زیرساخت کامل شد: گزارش روزانه ۰۸:۰۰ + مانیتور هر ۳۰ دقیقه + IndexNow فوری + عامل محتوا روزانه ۰۷:۰۰ با پینگ خودکار
- برای کاربر بعدی: ثبت‌نام‌های دستی لازم = Bing Webmaster (کلید API)، Google Business Profile (وریفای)، GA4 (اختیاری)، دایرکتوری‌های پزشکی (دکترتو/نی‌نی‌سایت/پذیرش۲۴)

---
Task ID: 23
Agent: Z.ai Code (main)
Task: آنالیز AIO/GEO و SXO برای drpedrambakhshaei.com به درخواست کاربر

Work Log:
- اسکیل‌های seo-geo و seo-sxo لود و طبق pipeline اجرا شد
- اسکن ۸ صفحه سایت با scripts/seo/geo-scan.mjs (ساخته شد): status/titles/H1-H2/JSON-LD/word count/citable paragraphs/images/dates
- بررسی robots.txt (۱۴ ربات AI همه Allow) و llms.txt (موجود، 200، غنی)
- SERP live برای ۴ کلمه کلیدی با web_search (serp-*.json ذخیره شد)
- بررسی JSON-LD کامل jaw-surgery: Physician با address/geo/aggregateRating/sameAs + MedicalProcedure/FAQPage/BreadcrumbList
- بررسی مقاله بلاگ: datePublished/dateModified/Article/author ✅ ولی citable blocks صفر

Stage Summary:
- GEO Score: 63/100 (Citability 45، Multimodal 40 گپ اصلی؛ Technical 95 قوت)
- SXO: jaw 56، chin 55، dental-implant 52 (MISMATCH HIGH: SERP جدول قیمت می‌خواهد)، implant-pasdaran 60
- گزارش‌ها ذخیره شد: docs/GEO-ANALYSIS.md و docs/SXO-ANALYSIS.md
- ۶ اولویت اجرا مشخص شد (جدول قیمت در dental-implant، dateModified لندینگ‌ها، بلاک‌های ۱۳۴-۱۶۷ کلمه‌ای، جدول مقایسه، سیگنال محلی، embed آپارات)

---
Task ID: 24
Agent: Z.ai Code (main)
Task: ساخت PDF گزارش پیشرفت پروژه برای کارفرما (فارسی RTL)

Work Log:
- جمع‌آوری کل تاریخچه از worklog (۲۴ تسک) + داده‌های زنده (sitemap ۲۲ URL، ۹ مقاله، GSC)
- لود اسکیل pdf + brief creative-flow + fonts.md + overflow.md؛ مسیر RTL → HTML dir=rtl + Playwright
- ساخت docs/report-src/report.html: ۹ صفحه A4 (کاور + ۷ بخش محتوا + پایان) با فونت Vazirmatn/Estedad و پالت برند سبز/سرمه‌ای/طلایی
- رفع تداخل‌های cover_validate (خطوط تزئینی → ضخامت ۶-۹px، حلقه‌ها → گرادیان پس‌زمینه بدون overflow)
- رفع false positive های Pass 2 (تگ‌های inline تو در تو حذف شدند؛ کاور ایزوله: هر دو Pass پاس)
- Paged.js با RTL محتوا را می‌برید → سوئیچ به --nopaged (Chromium native) → ۹ صفحه کامل
- QA: pdf_qa.py → PASS کامل (فونت embed، بدون صفحه خالی، بدون overflow، حاشیه متقارن)
- خروجی: docs/گزارش-پیشرفت-سایت-drpedrambakhshaei.pdf (+ کپی drpedrambakhshaei-progress-report-fa.pdf) — ۸۸۶KB، وکتور

Stage Summary:
- گزارش کارفرما آماده است: زیرساخت فنی، کلمات کلیدی، کارهای SEO/AEO/GEO/AIO/SXO با امتیازها، اتوماسیون‌ها و نقشه راه ۶ اولویتی
- HTML منبع قابل‌ویرایش در docs/report-src/report.html نگهداری شد

---
Task ID: 24
Agent: Z.ai Code (main)
Task: پاسخ به «گزارش را از کجا دانلود کنم؟» — در دسترس کردن PDF گزارش کارفرما از طریق Preview

Work Log:
- بررسی docs/: PDF گزارش قبلاً تولید شده بود (drpedrambakhshaei-progress-report-fa.pdf، ۹۰۷KB، ۹ صفحه + نسخه با نام فارسی)
- کپی PDF به public/report.pdf تا Next.js به‌صورت فایل استاتیک سرو کند
- تست curl: HTTP 206/200 با هدرهای امنیتی سالم، بایت‌های %PDF-1.7 معتبر
- افزودن دکمه شناور «دانلود گزارش PDF» (کهربایی، bottom-left) در src/app/(site)/layout.tsx — فقط با شرط NODE_ENV=development، یعنی در بیلد پروداکشن هرگز رندر نمی‌شود
- تأیید با Agent Browser: PDF در ویوئر مرورگر ۹ صفحه رندر می‌شود (RTL فارسی صحیح)، دکمه روی صفحه اصلی نمایش داده می‌شود، کلیک → GET /report.pdf → 200
- صفحه اصلی سالم (title: دکتر پدرام بخشایی)، بدون خطای کنسول

Stage Summary:
- دانلود PDF برای کارفرما از دو راه: ① دکمه «دانلود گزارش PDF» پایین چپ صفحه اصلی Preview ② افزودن /report.pdf به انتهای URL پیش‌نمایش
- دکمه فقط در dev نمایش داده می‌شود؛ خطر انتشار عمومی در دامین اصلی = صفر
- فایل‌ها: public/report.pdf (وب) + docs/گزارش-پیشرفت-سایت-drpedrambakhshaei.pdf (نام فارسی)

---
Task ID: 25
Agent: Z.ai Code (main)
Task: اجرای ۵ اولویت از ۶ اولویت SXO/GEO (اولویت ۶ ویدیو آپارات منتظر لینک کاربر)

Work Log:
- اولویت ۱ (رفع MISMATCH HIGH dental-implant): ارتقای بخش تعرفه service-landing.tsx به جدول واقعی HTML (<table>+thead+tbody+caption sr-only) + جدول دوم «خدمات تکمیلی» (سینوس لیفت/پیوند استخوان) + بج «به‌روزرسانی تعرفه: مهر ۱۴۰۵» کنار H2
- اولویت ۲ (dateModified): const CONTENT_UPDATED {iso:2026-10-17, fa:۲۵ مهر ۱۴۰۵} در landings.ts؛ افزودن dateModified به MedicalProcedure + نود WebPage جدید در هر ۴ page.tsx لندینگ؛ خط نمایشی «آخرین به‌روزرسانی محتوا» در کارت پاسخ کوتاه
- اولویت ۳ (بلوک‌های قابل‌استناد): فیلد citableBlocks در LandingConfig + رندر کارت‌های حاشیه-سبز با پاورقی منبع/تاریخ؛ quickAnswer هر ۴ لندینگ به ۱۴۰-۱۶۰ کلمه گسترش یافت؛ شمارش نهایی: implant-cost ۱۵۱، implant-quick ۱۴۲، implant-sameday ۱۳۴، jaw-recovery ۱۳۹، pasdaran-why ۱۶۶ کلمه (همه در بازه ۱۳۴-۱۶۷)
- اولویت ۴ (جدول مقایسه): jaw = جدول تفکیک هزینه (نوع/کل/بیمارستان/پلاک ۵ ردیف)؛ chin = جدول فیلر vs پروتز vs جنیوپلاستی (۷ معیار)
- اولویت ۵ (سیگنال محلی پاسداران): ۵ ستاره کهربایی + «۵٫۰ از ۵ (۹ نظر گوگل)» زیر H1؛ بخش نقشه گوگل embed (مطابق CSP frame-src) + بلوک NAP هماهنگ با GBP (آدرس/ساعات/تلفن SITE)؛ اسکیمای MedicalClinic صفحه‌ای با aggregateRating 5.0/9 + geo + openingHours
- رفع باگ: ۵۰۰ TypeError «Cannot read properties of undefined (reading 'fa')» = کش خراب HMR توربوپک → پاک‌سازی .next + ری‌استارت dev server حل شد
- تأیید با Agent Browser: هر ۴ صفحه ۲۰۰؛ جدول‌ها/بج/ستاره/نقشه در دسکتاپ و iPhone 14 رندر صحیح؛ صفر خطای کنسول
- lint پاک؛ IndexNow دستی ۴ لندینگ → ۴۰۳ SiteVerificationNotCompleted (موقتی؛ ورک‌فلوی روزانه ۰۷:۰۰ خودکار سابمیت می‌کند)

Stage Summary:
- ۵/۶ اولویت اجرا و راستی‌آزمایی شد؛ اولویت ۶ (ویدیو آپارات) منتظر لینک embed از کاربر
- فایل‌های تغییر یافته: src/lib/landings.ts، src/components/site/pages/service-landing.tsx، ۴ فایل page.tsx لندینگ‌ها
- جداول: ۰→۳ جدول در jaw و chin، ۰→۲ جدول در dental-implant و implant-pasdaran (رفع «tables: 0» از geo-scan)
- ۸ بلاک قابل‌استناد جدید + ۴ quickAnswer گسترش‌یافته = Citability از ۴۵ به سمت ۸۵+

---
Task ID: 25
Agent: Z.ai Code (main)
Task: کوتاه‌کردن زمان دیپلوی از ~۳۰ دقیقه به ~۳ دقیقه (درخواست کاربر)

Work Log:
- تشخیص: زمان دیپلوی = بیلد CI (۴-۶ دقیقه) + انتظار کرون هاست */20 (تا ۲۰ دقیقه) + دانلود app چندمگ (۱-۲ دقیقه) ⇒ گلوگاه اصلی فاصله کرون است نه دانلود
- commit c7f090c: scripts/host-deploy.sh → v3.2 با محافظ دانلود منجمد (--speed-limit 10240 --speed-time 60): زیر ۱۰KB/s برای ۶۰ ثانیه = قطع و retry با resume؛ دیگر دانلود خواب‌مانده قفل flock را تا ۴۰ دقیقه (max-time) نگه نمی‌دارد — پیش‌نیاز امن برای کرون ۳ دقیقه‌ای
- commit c7f090c: deploy.yml کش Bun (~/.bun/install/cache) + کش .next/cache اضافه شد ⇒ هر بیلد CI حدود ۱-۲ دقیقه سریع‌تر
- git pull --rebase لازم شد (کامیت‌های ۵تایی بات content-agent جلوتر بود)؛ push موفق
- دستورات ترمینال هاست به کاربر داده شد: crontab -l | sed 's|^\*/20|*/3|' | crontab - + رفرش deploy.sh از raw (v3.2) + اجرای دستی bash ~/bin/deploy.sh برای انتشار فوری

Stage Summary:
- معماری دیپلوی دست‌نخورده ماند (Pull از Releases)؛ فقط فاصله کرون ۲۰→۳ دقیقه و مقاوم‌سازی دانلود
- زمان جدید مورد انتظار: بیلد CI ~۳-۵ دقیقه + کش/انتظار کرون ≤۳ دقیقه + دانلود چندمگ ~۱ دقیقه ⇒ push→live حدود ۵-۷ دقیقه (قبلاً تا ۳۰)
- trigger دستی موجود است: بعد از سبز شدن CI، اجرای bash ~/bin/deploy.sh روی هاست = انتشار بدون انتظار کرون
- ۶ اولویت SEO (جدول قیمت، بلوک‌های قابل‌استناد، dateModified و...) همچنان pending — بعد از این تسک شروع می‌شود

---
Task ID: 26
Agent: Z.ai Code (main)
Task: افزودن BingSiteAuth.xml (Bing Webmaster Tools) + ایندکس خودکار هر صفحه جدید

Work Log:
- فایل آپلودی کاربر upload/BingSiteAuth.xml (کلید 306F5F0994C4D8BA07AB3FD1BA21C554) به public/ کپی شد
- scripts/host-deploy.sh → v3.3: تابع ping_new_urls — هر اجرای کرون نقشه سایت زنده را با baseline (.sitemap-urls) مقایسه و «فقط URLهای تازه» را با POST به api.indexnow.org سابمیت می‌کند (بار اول bootstrap کل sitemap)؛ خطا فقط WARN و هیچ‌وقت دیپلوی را نمی‌شکند
- تست شبیه‌سازی ۴ سناریو (bootstrap/بدون‌تغییر/صفحه‌جدید/بدون‌تغییر) + اعتبارسنجی JSON payload با node — همه سبز
- commit e9e9ebf push شد؛ CI رلیز ۰۳:۵۳ UTC را منتشر کرد؛ هاست پول کرد و BingSiteAuth.xml روی پروداکشن 200 شد (تأیید curl)
- کشف مهم: سابمیت IndexNow الان 403 SiteVerificationNotCompleted برمی‌گرداند (کلید فایل 200/۰.۸s سالم است) — بینگ در حال پردازش تأیید تازه است؛ کرون ۳ دقیقه‌ای v3.3 خودش retry و ترمیم می‌کند
- لینک دانلود manifest از releases/latest (بدون rate limit API) برای تشخیص انتشار رلیز استفاده شد چون api.github.com برای IP سندباکس rate-limit بود

Stage Summary:
- تأیید مالکیت Bing با فایل زنده شد: https://drpedrambakhshaei.com/BingSiteAuth.xml → 200
- ایندکس خودکار: هر صفحه جدید (لندینگ از دیپلوی یا مقاله از پنل ادمین) حداکثر ~۳ دقیقه بعد از دیده‌شدن در sitemap به IndexNow (Bing/Copilot/ChatGPT Search/DuckDuckGo/Yandex) سابمیت می‌شود — مشروط به رفرش deploy.sh روی هاست به v3.3 (دستور curl از raw به کاربر داده شد)
- pending کاربر: تأیید Verify در پورتال Bing Webmaster + سابمیت sitemap.xml در پورتال + رفرش deploy.sh
- گوگل سمت GSC از قبل اتومات است (gsc-daily/monitor)؛ این تسک سمت Bing/موتورهای IndexNow را کامل کرد

---
Task ID: 27
Agent: Z.ai Code (main)
Task: افزودن متاتگ تأیید Bing (msvalidate.01) به head سایت — درخواست کاربر

Work Log:
- کاربر کد متاتگ msvalidate.01 پورتال Bing را فرستاد (همان کلید فایل XML: 306F5F0994C4D8BA07AB3FD1BA21C554)
- src/app/layout.tsx: فیلد verification.other با «msvalidate.01» به metadata روت اضافه شد → روی همه صفحات رندر می‌شود (نکته کامنت: متاتگ حذف نشود)
- bun run lint پاک؛ رندر dev با curl تأیید شد؛ commit 0ff2c28 push شد
- رلیز ۰۵:۰۴ UTC منتشر شد؛ هاست ~۱۴ دقیقه بعد پول کرد (الگوی */20 — تغییر کرون ۳ دقیقه‌ای هنوز توسط کاربر اعمال نشده به نظر می‌رسد)
- تأیید زنده پروداکشن: <meta name="msvalidate.01" content="..."/> در HTML صفحه اصلی 200

Stage Summary:
- هر دو روش تأیید Bing هم‌زمان فعال است: فایل (BingSiteAuth.xml → 200) + متاتگ (msvalidate.01 در head همه صفحات) — کاربر فقط باید در پورتال Verify بزند
- یادآوری پابرجا به کاربر: crontab */3 + رفرش deploy.sh v3.3 هنوز روی هاست اعمال نشده (پول ۱۴ دقیقه‌ای، فاصله کرون هنوز ۲۰ دقیقه)؛ تا اعمال نشود ایندکس خودکار v3.3 هم ران نمی‌شود

---
Task ID: 28
Agent: Z.ai Code (main)
Task: افزودن ۱۰ کلمه کلیدی کاربر با سیاست SEO/GEO/AEO/AIO/SXO (کلیک‌گیری)

Work Log:
- تشخیص: متاتگ keywords به‌تنهایی برای گوگل بی‌اثر است ⇒ کلمات باید در محتوای واقعی و FAQ بنشینند؛ ۸ کلمه جدید به keywords روت + ۲ کلمه تکراری (جراح فک و صورت، دکتر پدرام بخشایی) از قبل موجود
- site-data.ts: ۳ سوال جدید — «پریکورونیت چیست» (بلاک تعریفی ~۱۵۰ کلمه قابل‌استناد GEO، تب دندان نهفته)، «بهترین جراح فک و صورت در تهران چطور انتخاب کنیم» (تب جدید «عمومی» + توضیح صادقانه فوق تخصص/OMFS بورد — بدون ادعای دروغین)، «قیمت ایمپلنت برزیلی» (پاسخ صادقانه بدون قیمت جعلی، تب هزینه‌ها) — هر ۳ خودکار به FAQPage JSON-LD و /faq و llms.txt جریان می‌یابند
- faq-page.tsx: تب «عمومی» به GROUPS اضافه شد (منطق matches موجود ساپورت می‌کند)
- faq/page.tsx: title/desc به‌روز (۲۱→۲۴ سوال) + keywords جدید (پریکورونیت چیست، درمان پریکورونیت، ...)
- hero.tsx: عبارت «جراح فک و صورت در پاسداران تهران» + about-page.tsx: «دکتر پدرام بخشایی — جراح فک و صورت و متخصص ...»
- commit 55c4c96 push؛ رلیز ۰۵:۲۹ UTC؛ هاست ~۱۶ دقیقه بعد پول کرد؛ ۷ چک پروداکشن همه سبز (faq/hero/keywords/about)
- IndexNow دوباره 403 SiteVerificationNotCompleted — کاربر هنوز Verify پورتال را نزده؛ سابمیت ۲۳ URL (sitemap یک URL بزرگ‌تر شده — مقاله جدید ایجنت)

Stage Summary:
- هر ۱۰ کلمه کلیدی کاربر الان یا در محتوای واقعی‌اند یا در keywords متا؛ پریکورونیت از صفر تا FAQ تعریفی AEO/GEO رفت (بالاترین پتانسیل کلیک — کوئری اطلاعاتی با رقابت کم در حوزه OMFS)
- هشدار صداقت: «فوق تخصص» به‌عنوان عنوان دکتر ادعا نشد (در ایران OMFS تخصص است) — در پاسخ FAQ عرف جست‌وجو با مدرک بورد تطبیق داده شد؛ هم E-E-A-T سالم ماند هم کوئری پوشش داده شد
- pending: Verify پورتال Bing توسط کاربر → بعدش IndexNow سبز می‌شود؛ ۶ اولویت SEO هنوز در صف

---
Task ID: 29
Agent: Z.ai Code (main)
Task: رفع خطای Search Console «Review has multiple aggregate ratings» (۱۰ آیتم نامعتبر در /reviews) + اتومات‌سازی کشف این خطاها

Work Log:
- ریشه‌یابی با آنالیز JSON-LD زنده /reviews: layout هر صفحه #physician را با aggregateRating منتشر می‌کند و ۱۲ نود Review در /reviews با itemReviewed @id:#physician به آن ارجاع می‌دادند؛ گوگل نودها را با @id ادغام و امتیاز تجمیعی را وارد هر Review می‌کرد ⇒ «multiple aggregate ratings» ×۱۰
- fix (commit 07ae4d6): reviewsJsonLd — @id از itemReviewed حذف شد (الگوی استاندارد Google: Review مستقل + itemReviewed فقط type/name)؛ aggregateRating واحد روی #physician layout محفوظ ماند (ستاره SERP صفحه اصلی)
- implant-pasdaran: reviewCount کلینیک که hardcoded «۹» بود با تعداد واقعی نظرات (۱۲) از getMergedContent همگام شد؛ صفحه async شد
- monitor.mjs بخش ④: لینت JSON-LD روی / و /reviews و /faq و ۴ لندینگ با ۳ قاعده (R1: چند aggregateRating در یک نود، R2: aggregateRating داخل Review، R3: itemReviewed→@id→نود دارای aggregateRating = تله ادغام) + وردیکت ریچ‌ریزالت /reviews از URL Inspection API — از این پس هر ۳۰ دقیقه رگرسیون اسکیما خودکار کشف می‌شود
- تست لینت روی dev: هر ۴ صفحه ✅ (۱۵ نود /reviews سالم)؛ lint پاک

Stage Summary:
- اسکیمای /reviews دیگر هیچ مسیری برای رسیدن aggregateRating به Review ندارد؛ پس از خزش مجدد گوگل، ۱۰ آیتم نامعتبر VALID می‌شوند (کاربر باید Validate Fix بزند)
- پاسخ سوال کاربر: ایجنت GSC قبلاً فقط پرفورمنس روزانه + سلامت/ایندکس ۳۰دقیقه‌ای بود؛ از این پس چک اسکیمای ساختاریافته هم اتومات است — خطا زودتر از ایمیل گوگل در reports/monitor-latest.md دیده می‌شود
- پاک‌سازی کامل گزارش GSC به خزش مجدد گوگل وابسته است (معمولاً ۲-۴ هفته؛ با Validate Fix سریع‌تر)

---
Task ID: 30
Agent: Z.ai Code (main)
Task: پیگیری اسکرین‌شات GSC «Review snippets: 10 Invalid» — بررسی چرا هنوز نامعتبر است

Work Log:
- تشخیص: این همان ۱۰ آیتم Task 29 است؛ داده گوگل «Last update: 10/16/26» یعنی از خزشِ قبل از فیکس (فیکس ۲۰۲۶-۱۰-۱۸ ۰۵:۵۹ UTC کامیت 07ae4d6) — گزارش UI گوگل فقط با خزش مجدد رفرش می‌شود
- راستی‌آزمایی لایو پروداکشن: /reviews دارد ۱۲ نود Review مستقل با itemReviewed/author/reviewRating کامل و بدون @id و بدون aggregateRating داخلی — صفر مشکل ساختاری طبق قواعد Google Review snippet
- aggregateRating روی صفحات دیگر: / فقط ×۱ (نود #physician)؛ implant-pasdaran ×۲ روی دو نود مجزا (پزشک/کلینیک) — هر دو مجاز
- sitemap lastmod /reviews تازه (۲۰۲۶-۱۰-۱۸)
- مانیتور ۳۰دقیقه‌ای (ران ۰۶:۴۴): هر ۷ صفحه JSON-LD سالم + verdict گوگل برای /reviews = PASS از آخرین خزش
- monitor.mjs: خط جدید اضافه شد — lastCrawlTime گوگل برای /reviews + مقایسه خودکار با زمان فیکس (بعد از این، لحظه‌ای که گوگل دوباره بخزد در گزارش مشخص می‌شود)؛ commit 3269b9d

Stage Summary:
- هیچ باگ باقی‌مانده‌ای وجود ندارد؛ ۱۰ آیتم Invalid فقط «داده قدیمی» است و با خزش مجدد یا Validate Fix سبز می‌شود
- اقدام لازم کاربر (فقط از UI ممکن است، API ندارد): در GSC → Review snippets → کلیک روی کادر قرمز 10 → دکمه VALIDATE FIX
- مانیتور از این پس زمان آخرین خزش گوگل /reviews را گزارش می‌کند — سبز شدن گزارش را خودکار ردیابی می‌کنیم

---
Task ID: 31
Agent: Z.ai Code (main)
Task: ۵ اصلاح محتوایی درخواستی کاربر — عکس‌های موضوعی، حذف تخفیف اسکان، عکس دکتر در about، کاورهای بلاگ، حذف نوار آماری

Work Log:
- تولید ۵ عکس با image-generation (سبک یکسان پالت سِیج/پیترول سایت): service-ortho-art (مدل جبس + کولیس جراحی)، service-implant-art (مدل فک با ایمپلنت و بریج)، service-wisdom-art (مدل با دندان نهفته هایلایت + ابزار)، blog-ortho-cover (جراح و رادیوگرافی جمجمه روی مانیتور)، blog-wisdom-cover (مدل فک در کلینیک) — ۲ تلاش برای ارتوسرجری (جمجمه روبه‌رو تند بود → مدل جبس + کولیس)
- site-data.ts: عکس ۳ کارت خدمات صفحه اول عوض شد (hero-bg.png → service-ortho-art، implant-art → service-implant-art، wisdom-art → service-wisdom-art) — هم‌زمان /services و لندینگ‌ها هم فیکس شدند
- حذف «تخفیف اسکان ۲۰ میلیونی» از ۳ نقطه: WHY_US.points در site-data.ts، بولت هاردکد home.tsx (نوار قسطی)، و بنر پایین prices.tsx (کشف دیرهنگام با اسکن همه صفحات — کامیت دوم 0f1213b)
- about.tsx: نوار پایین صفحه «درباره» از عکس مطب (clinic-photo-2) به عکس خود دکتر (dr-pedram-omfs) تبدیل شد — گرید دو ستونه: پرتره دکتر + پنل پترول با عنوان و CTA تعرفه
- کاور بلاگ: مقاله ارتوگناتیک (static) از عکس قبل/بعد گرافیکی به blog-ortho-cover + آپدیت coverAlt؛ مقاله دندان عقل (DB) کاور داخل JSON خود مقاله هم override می‌شد → هر دو فیلد row.coverImage و article.cover آپدیت شدند
- blog-page.tsx: نوار آماری «مقالات اورجینال/بدون کپی‌برداری/به‌روزرسانی منظم» حذف + ایمپورت‌های بلااستفاده پاک شد
- لینت پاک؛ تأیید مرورگر (agent-browser) روی / و /about و /blog — همه ۵ مورد رندر درست؛ اسکان=۰ روی ۷ صفحه dev
- commit 3871d7a + 0f1213b push؛ رلیز app-20261018-145131 منتشر شد

Stage Summary:
- هر ۵ درخواست کاربر اعمال شد؛ عکس‌های جدید AI-generated ولی موضوع‌مرتبط و هم‌سبک با برند (بدون متن واترمارک)
- نکته فنی برای آینده: کاور مقاله‌های دیتابیسی در دو لایه ذخیره می‌شود (row.coverImage + article JSON) — تغییر کاور باید هر دو را آپدیت کند
- هاست با کرون قدیمی */20 پول می‌کند؛ تأیید نهایی پروداکشن در انتظار پول بعدی (تا ۲۰ دقیقه)

---
Task ID: 32
Agent: Z.ai Code (main)
Task: فاز ۲ اصلاح تصاویر — کاور ۱۰ مقاله دیتابیس هاست + فیکس ریشه‌ای ایجنت محتوا

Work Log:
- کشف: کاورهای واقعی بلاگ پروداکشن (۹ مقاله DB هاست + ۱ استاتیک) عمدتاً نامناسب بودند — ۲ کاور انتزاعی بی‌معنی با واترمارک pollinations.ai، ۳ کاور خونی/گرافیکی (دندان کشیده، آبسه واقعی، قبل/بعد ایمپلنت)، ۲ کاور داخل مطب بی‌ربط، ۱ کاور قبل/بعد چهره
- تولید ۸ + ۱ کاور موضوعی جدید (پالت برند سِیج/پیترول، بدون متن و واترمارک): cover-immediate-implant / cover-aftercare / cover-hidden-molar / cover-implant-cost / cover-jaw-fracture / cover-abscess / cover-pericoronitis / cover-guided-implant / cover-canine
- API جدید: PATCH /api/blog/publish با x-admin-key — آپدیت جزئی فقط کاور (ستون coverImage + JSON مقاله همزمان) بدون بازنویسی متن مقاله (کاور در DB دو لایه ذخیره می‌شود)
- workflow یک‌باره patch-covers.yml (workflow_dispatch) با secret ADMIN_KEY → هر ۱۰ کاور روی DB هاست اعمال شد (۲ ران؛ ران اول ۸ تا، ران دوم کانین)
- فیکس ریشه‌ای ایجنت (generate-article.mjs): FALLBACK_COVERS از عکس‌های مطب به کاورهای موضوعی جدید؛ suffix پرامپت قوی‌تر (موضوع دندانی قابل‌تشخیص، بدون لیبل/لوگو)؛ seed متفاوت در هر تلاش برای جلوگیری از خروجی تکراری
- تأیید نهایی پروداکشن: ۱۰/۱۰ کاور موضوعی + اسکان=۰ روی ۹ صفحه + نوار آماری حذف + عکس دکتر در about
- کامیت‌ها: cb199d3 (covers+API+agent) و 994dc2a (canine)؛ ران‌های workflow: 15:51 و بعد از پول app-20261018-155600

Stage Summary:
- مشکل «عکس‌های بی‌ربط بلاگ» ریشه‌ای حل شد — هم کاورهای موجود، هم فال‌بک‌ها و پرامپت مقاله‌های آینده ایجنت
- زیرساخت جدید ماندگار: PATCH API برای آپدیت کاور بدون دست‌زدن به متن + workflow قابل استفاده مجدد
- کل پنج درخواست کاربر (Task 31+32) روی پروداکشن سبز است

---
Task ID: 33
Agent: Z.ai Code (main)
Task: کرون ۲ دقیقه‌ای هاست + تشخیص و رفع 403 ایندکس‌نو (host-deploy v3.4)

Work Log:
- کاربر کرون */2 + رفرش deploy.sh + اجرای دستی را زد: up-to-date ولی WARN indexnow 403
- تشخیص با تست دستی سه endpoint: فایل کلید روی سایت 200 و درست؛ api.indexnow.org=403؛ bing.com/indexnow=403؛ yandex.com/indexnow GET=202 و POST=200 ⇒ کلید معتبر است، بینگ فقط هنوز فایل کلید را fetch/validate نکرده (رفتار شناخته‌شده بینگ: تا validation، 403)
- باگ v3.3 کشف شد: در 403 هم baseline جابه‌جا می‌شد ⇒ URLها برای همیشه از قلم می‌افتادند؛ به‌علاوه بوت‌استرپِ 403‌خورده دیگر retry نمی‌شد
- host-deploy.sh → v3.4: fallback به yandex.com/indexnow بعد از رد شدن endpoint مشترک؛ baseline فقط در موفقیت (200/202) جابه‌جا می‌شود؛ throttle ۳۰ دقیقه‌ای (.indexnow-last) برای کرون ۲ دقیقه‌ای؛ بوت‌استرپ با .indexnow-ok — تا اولین سابمیت موفق، کل نقشه هر تلاش سابمیت می‌شود
- تست: bash -n OK + شبیه‌سازی تابع واقعی در /tmp — بوت‌استرپ ۲۳ URL از مسیر یاندکس موفق، throttle بی‌صدا، run بدون URL جدید بی‌صدا
- commit + push → CI رلیز می‌کند → هاست با کرون */2 خودکار می‌کشد (نیازی به اقدام کاربر نیست)

Stage Summary:
- ایندکس‌نو دیگر تک‌نقطه‌سنگال نیست: مسیر یاندکس فعال است و URLها از همین حالا سابمیت می‌شوند؛ بینگ خودش بعد از validation کلید (چند ساعت تا ~۱ روز) 200 می‌دهد و مسیر اصلی برمی‌گردد
- در deploy.log هاست از این به بعد: «submitted via https://yandex.com/indexnow» یا «submitted via https://api.indexnow.org/indexnow»
- یادآوری پابرجا: Verify در پورتال Bing Webmaster + سابمیت sitemap.xml هنوز کار نشده است

---
Task ID: 33-b
Agent: Z.ai Code (main)
Task: تأیید نهایی اجرای host-deploy v3.4 روی هاست

Work Log:
- کاربر رفرش deploy.sh را زد؛ خروجی هاست: دانلود app-20261019-054325 (10.1MB در ۱۹ ثانیه) → DEPLOYED OK → «indexnow: 23 new URL(s) submitted via https://yandex.com/indexnow»
- یعنی بوت‌استرپ کامل نقشه سایت (۲۳ URL) با موفقیت از مسیر fallback یاندکس سابمیت شد — مسیر 403 بینگ دور زده شد
- چک سلامت پروداکشن بعد از دیپلوی: / و /blog و /reviews و /about و /dental-implant و /jaw-surgery و sitemap.xml همگی 200

Stage Summary:
- چرخه کامل کار کرد: push → CI → release → هاست (کرون */2) → IndexNow خودکار
- از این به بعد هر URL جدید حداکثر ~۳۰ دقیقه بعد (throttle) سابمیت می‌شود؛ وقتی بینگ کلید را validate کند خودکار به endpoint مشترک برمی‌گردد
- باقی‌مانده کاربر: Verify پورتال Bing + سابمیت sitemap، GSC (TEST LIVE URL + REQUEST INDEXING برای /reviews)، GBP

---
Task ID: 34
Agent: Z.ai Code (main)
Task: رفع هشدار Bing Site Scan — Alt attribute for images is missing

Work Log:
- اسکن هر ۲۳ URL نقشه سایت: در همه صفحات ۲-۳ تگ img با alt="" خالی — سه منبع مشترک: hero-bg.png (hero.tsx) و logo-badge.webp ×۲ (LogoMark/AnimatedLogo در logo.tsx)
- alt توصیفی فارسی اضافه شد: لوگو = «لوگوی دکتر پدرام بخشایی»، hero = «مطب دکتر پدرام بخشایی، متخصص جراحی دهان، فک و صورت در تهران» (پشتیبان کلمات برند + تخصص + موقعیت)
- مورد چهارم alt="" در admin/blog-tab.tsx بدون تغییر ماند — پنل ادمین با robots مسدود است و اسکن نمی‌شود
- (در همان بازه: کاربر سایت را از GSC به Bing Webmaster import کرد — sitemap سابمیت شد، Status=Processing؛ AI Performance نشان داد Copilot ۳ بار صفحه اصلی را cite کرده)

Stage Summary:
- هشدار Alt missing بینگ پس از دیپلوی رفع می‌شود؛ Re-scan بعدی بینگ باید صفر برگرداند
- نکته: alt="" برای تصاویر تزئینی از نظر a11y درست است ولی اسکنر بینگ آن را هشدار می‌دهد — از این به بعد alt توصیفی حتی برای دکوراتیوها

---
Task ID: 35
Agent: Z.ai Code (main)
Task: رفع بخش خالی «چگونه می‌توانیم ریسک‌ها را کاهش دهیم؟» در مقاله ایمپلنت فوری

Work Log:
- کاربر گزارش داد: تیتر بخش در /blog/immediate-implant-loading-dee79 هست ولی بدنه ندارد
- اسکن: مقاله DB هاست، بلوک ۲۴ (h2) مستقیم به «ادامه مطالعه» وصل بود — بدنه هرگز تولید نشده (نقص ایجنت محتوا)
- کل BlogArticle (۲۸ بلوک) از RSC payload صفحه استخراج و بازسازی شد
- بدنه بخش نوشته شد: p مقدمه + لیست ۷ گانه (CBCT، پایداری اولیه ~۳۵ Ncm، کنترل عفونت، ترک سیگار، کنترل دیابت، پروتز بدون فشار اکلوزالی، پیگیری منظم) + p پایانی به سبک روایی مقاله (سارا/دکتر بخشایی)
- بونوس: جمله هالوسینه «پروتئین (کاتیک) و نوتروپیک» در بلوک ۴ با جمله درست جایگزین شد
- زیرساخت ماندگار: scripts/github-agent/patch-article.mjs + patches/*.json + workflow patch-article.yml (workflow_dispatch با ADMIN_KEY secret) — پچ موفق خودش از صف حذف می‌شود؛ برای هر فیکس مقاله آینده فقط فایل JSON بینداز و workflow را بزن
- push → dispatch workflow → تأیید صفحه زنده

Stage Summary:
- زیرساخت پچ مقاله بدون دست‌زدن به متن/تاریخ/کاور (assembleArticle از article کامل با اولویت src استفاده می‌کند؛ publishDateFa و cover حفظ می‌شود)
- یادآوری: کیفیت خروجی ایجنت محتوا باید بررسی شود — این مقاله ۶۰۱ کلمه چند خطای محتوایی دیگر هم دارد (ریسک کلی ایجنت)

---
Task ID: 35-b
Agent: Z.ai Code (main)
Task: حذف ردیف تکراری قدیمی مقاله + پارسر **بولد** رندر مقاله

Work Log:
- کشف حین تأیید: مقاله /blog/immediate-implant-loading (نسخه کهنه ۱۰-۱۸ با متن هالوسینه) با آدرس جدا زنده است — محتوای تکراری SEO + در flight payload همه صفحات هم تزریق می‌شد؛ هیچ لینک داخلی به آن نیست (حذف امن)
- DELETE /api/blog/publish (x-admin-key) اضافه شد — حذف ردیف برای تکراری‌ها/کهنه‌ها
- patch-article.mjs پشتیبانی {"_delete":true,"slug":...} گرفت؛ فایل پچ delete-immediate-implant-loading.json ساخته شد
- رندر مقاله: پارسر withBold اضافه شد — **بولد** مارک‌داون خروجی ایجنت در p و آیتم‌های لیست به <strong> تبدیل می‌شود (قبلاً ستاره‌ها خام نمایش داده می‌شدند)
- نکته ریشه‌ای کشف‌شده: publishPost idempotent است ولی ایجنت محتوا در هر اجرای مجدد slug با پسوند جدید می‌سازد (immediate-implant-loading ← immediate-implant-loading-dee79) ⇒ ردیف تکراری؛ باید در نسخه بعدی generate-article.mjs از baseSlug پایدار استفاده کند

Stage Summary:
- /blog/immediate-implant-loading بعد از اجرای workflow باید 404 شود و رشته‌های کهنه از payload همه صفحات پاک شوند
- رندر **بولد** روی همه مقاله‌های DB اعمال می‌شود (فیکس عمومی، نه فقط این مقاله)

---
Task ID: 35-c
Agent: Z.ai Code (main)
Task: فیکس «بخش خالی ریسک‌ها» از دید کاربر + زیرساخت GA4

Work Log:
- بررسی لایو: محتوای بخش «چگونه می‌توانیم ریسک‌ها را کاهش دهیم» در HTML صفحه هست ولی دو مشکل واقعی پیدا شد:
  1) متن H2 خود پچ نصفه بود («کاهش ده» بدون «یم») → در پچ اصلاح شد به «چگونه می‌توانیم ریسک‌ها را کاهش دهیم؟» + یک callout «جمع‌بندی عملی» به انتهای بخش اضافه شد
  2) ریشه اصلی شکایت کاربر: بلاک‌های مقاله با framer-motion whileInView + initial opacity:0 + margin -40px رندر می‌شدند؛ بلاک‌های انتهای مقاله در برخی شرایط (پرش با لینک فهرست، اسکرول سریع) هرگز تریگر نمی‌شوند و برای کاربر/خزنده «نوشته‌نشده» دیده می‌شوند → انیمیشن ورود بلاک‌ها کامل حذف شد (محتوای مقاله همیشه بلافاصله visible)
- فایل پچ کهنه delete-immediate-implant-loading.json حذف شد (اسلاگ قدیمی از قبل 404 است؛ اجرای دوباره workflow را red می‌کرد)
- GA4: کامپوننت src/components/site/google-analytics.tsx ساخته شد (next/script afterInteractive + page_view روی مسیرهای client + استثنای /admin + anonymize_ip) و در layout ریشه سوار شد؛ GA_MEASUREMENT_ID فعلاً خالی → بدون شناسه هیچ اسکریپتی لود نمی‌شود؛ با دادن شناسه G-… یک‌خطی فعال می‌شود
- منتظر: کاربر شناسه G-XXXXXXX را بدهد → فعال‌سازی + dispatch workflow پچ برای H2 مقاله

Stage Summary:
- فیکس‌های آماده push: article-page.tsx (visible-always)، پچ H2 مقاله، حذف پچ کهنه، GA4 skeleton
- آموزش: محتوای پشت انیمیشن whileInView برای صفحات محتوایی/SEO ممنوع — فقط انیمیشن‌های mount-time (animate) مجاز است

---
Task ID: 36-a
Agent: Z.ai Code (main)
Task: فعال‌سازی GA4 با شناسه کاربر

Work Log:
- کاربر Measurement ID را فرستاد: G-FN9XT2H1R3 (Stream ID 16163728211، Stream: Dr Pedram Bakhshaei)
- GA_MEASUREMENT_ID در src/components/site/google-analytics.tsx از "" به "G-FN9XT2H1R3" تغییر کرد
- push → CI → release → cron هاست (*/2) → باید تگ gtag روی همه صفحات لایو شود

Stage Summary:
- GA4 فعال شد؛ تست: Reports → Realtime باید بازدید را نشان دهد؛ قدم بعدی کاربر: لینک GA4↔Search Console از Admin → Product links

---
Task ID: 37-a
Agent: Z.ai Code (main)
Task: انتشار مقاله «کیست فک» (t-jaw-cyst) با استانداردهای کامل SEO/AEO/GEO/AIO/SXO + کاور 3D

Work Log:
- کاور 3D با image-generation تولید شد (۶ تلاش؛ نهایی: ریشه دندان شناور در حفره کیست داخل استخوان — هم‌استایل کاورهای قبلی، 1344x768) → public/uploads/cover-jaw-cyst.jpg
- مقاله کامل نوشته شد: scripts/github-agent/build-jaw-cyst-article.mjs (بیلدر قابل استفاده مجدد) → پچ jaw-cyst-symptoms-treatment.json
  - ۲۱۷۶ کلمه | 38 بلاک | 8 پاسخ سریع واقعی (AEO) | 8 FAQ واقعی | 2 جدول مقایسه (فیتچرد اسنیپت) | 3 callout | 5 لینک داخلی با لیبل فارسی
  - اصلاح خطاهای مقاله قبلی: QA/FAQ جای‌نگه‌دار خالی نماند، لیبل لینک‌ها فارسی شد
  - بخش هزینه: صادقانه (بدون عدد جعلی — تعیین بعد از ویزیت + عوامل موثر) = E-E-A-T + SXO trust
- پابلیش: push → dispatch patch-article workflow
- ۲ بار failure: ConnectTimeout از GitHub Runner به هاست ایران (نوسان مسیر) → patch-article.mjs مجهز شد به fetchRetry (۵ تلاش، بک‌آف) → اجرای سوم success
- محتوای مقاله لایو تأیید شد (H1، جدول‌ها، QA، FAQ، Article+FAQPage schema، لینک‌های داخلی) — کاور هنوز 404 بود چون ریلیز جدید هنوز با cron هاست pull نشده (نوسان شبکه هاست→گیت‌هاب؛ خودکار جبران می‌شود)

Stage Summary:
- مقاله یازدهم سایت منتشر شد: /blog/jaw-cyst-symptoms-treatment
- درس: مسیر GitHub↔Iran دوطرفه نوسان دارد؛ همه اسکریپت‌های شبکه‌ای workflowها باید retry داشته باشند
- باقی‌مانده تأیید: serve شدن cover-jaw-cyst.jpg بعد از pull بعدی cron (خودکار)
