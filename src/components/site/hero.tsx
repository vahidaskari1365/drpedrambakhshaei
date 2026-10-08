"use client";

import * as React from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import { ArrowDown, Phone, Star, CalendarCheck, ShieldCheck, Award } from "lucide-react";
import { SITE, STATS } from "@/lib/site-data";

const ease = [0.16, 1, 0.3, 1] as const;

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [n, setN] = React.useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);
  const started = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const dur = 1600;
          const tick = (t: number) => {
            const p = Math.min((t - t0) / dur, 1);
            setN(Math.round(value * (1 - Math.pow(1 - p, 4))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString("fa-IR")}
      {suffix}
    </span>
  );
}

/* ذرات معلق سینمایی — موقعیت قطعی برای جلوگیری از mismatch سرور/کلاینت */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  left: 3 + ((i * 7.3 + 11) % 94),
  top: 10 + ((i * 37 + 5) % 72),
  size: 2.5 + ((i * 13) % 4),
  dur: 9 + ((i * 17) % 9),
  delay: -1 * ((i * 1.37) % 9),
  dx: (i % 2 === 0 ? 1 : -1) * (6 + ((i * 5) % 9)),
  tone: i % 3 === 0 ? "gold" : i % 4 === 1 ? "teal" : "white",
}));

const TONE_BG: Record<string, string> = {
  gold: "bg-[oklch(0.8_0.13_85/0.75)]",
  teal: "bg-[oklch(0.78_0.09_185/0.6)]",
  white: "bg-white/70",
};

export function Hero() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 6]);
  const scaleImg = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  /* نورافکن دنبال‌کننده ماوس — فقط دسکتاپ */
  const mx = useMotionValue(50);
  const my = useMotionValue(36);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${sx}% ${sy}%, oklch(0.92 0.05 190 / 0.13), transparent 68%)`;
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={onMove}
      className="grain relative flex min-h-[100svh] flex-col overflow-hidden pt-28 lg:pt-32"
      aria-label="معرفی"
    >
      {/* پس‌زمینه سینمایی */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 -z-10">
        <motion.div style={{ scale: scaleImg }} className="relative h-full w-full">
          {/* کن بِرنِز — پن آرام و بی‌وقفه دوربین روی عکس (CSS کامپوزیتوری) */}
          <div className="kenburns absolute -inset-[4%]">
            <Image
              src="/uploads/hero-bg.png"
              alt=""
              fill
              priority
              loading="eager"
              className="object-cover opacity-90 dark:opacity-40"
              sizes="100vw"
            />
          </div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
      </motion.div>

      {/* شفق قطبی سینمایی — بلاب‌های شناور (تیل/طلایی/بنفشِ لوگو) */}
      <div className="pointer-events-none absolute inset-0 -z-[6] overflow-hidden" aria-hidden="true">
        <div className="orb-a absolute -top-[12%] right-[-10%] h-[44vw] max-h-[600px] w-[44vw] max-w-[600px] rounded-full bg-[oklch(0.6_0.1_190/0.32)] blur-[100px]" />
        <div className="orb-b absolute bottom-[-16%] left-[-8%] h-[38vw] max-h-[520px] w-[38vw] max-w-[520px] rounded-full bg-[oklch(0.8_0.12_85/0.2)] blur-[100px]" />
        <div className="orb-c absolute left-[16%] top-[28%] h-[30vw] max-h-[420px] w-[30vw] max-w-[420px] rounded-full bg-[oklch(0.58_0.16_295/0.16)] blur-[100px]" />
      </div>

      {/* ذرات معلق غبار طلایی */}
      <div className="pointer-events-none absolute inset-0 -z-[5]" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className={`particle absolute rounded-full blur-[1px] ${TONE_BG[p.tone]}`}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              "--px-dur": `${p.dur}s`,
              "--px-delay": `${p.delay}s`,
              "--px-x": `${p.dx}px`,
            }}
          />
        ))}
      </div>

      {/* نورافکن دنبال‌کننده ماوس (دسکتاپ) */}
      <motion.div
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 -z-[4] hidden [@media(pointer:fine)]:block"
        aria-hidden="true"
      />

      {/* پرتو نور عبوری از صحنه */}
      <div className="cinema-sweep -z-[3]" aria-hidden="true" />

      {/* وینیت سینمایی گوشه‌ها */}
      <div className="hero-vignette pointer-events-none absolute inset-0 -z-[2]" aria-hidden="true" />

      <motion.div style={{ opacity }} className="relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:px-8">
        {/* متن */}
        <motion.div style={{ y: yText }} className="text-center lg:text-right">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 py-1.5 pe-4 ps-2 backdrop-blur"
          >
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
              <Star className="h-3 w-3 fill-current" />
              {SITE.rating.score}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              رضایت {SITE.rating.count} مراجع در گوگل
            </span>
          </motion.div>

          <h1 className="text-[2.6rem] font-black leading-[1.12] tracking-tight sm:text-6xl lg:text-[4.2rem]">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 0.62 }}
              className="block"
            >
              دکتر پدرام بخشایی
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease, delay: 0.78 }}
              className="text-gradient text-shimmer mt-2 block text-[1.55rem] font-extrabold sm:text-4xl lg:text-[2.6rem]"
            >
              متخصص جراحی دهان، فک و صورت
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.92 }}
            className="mx-auto mt-6 max-w-xl text-[15px] leading-8 text-muted-foreground sm:text-lg lg:mx-0"
          >
            ارتوسرجری، جنیوپلاستی و ایمپلنت‌های پیشرفته با دانش روز دنیا،
            تکنولوژی نوین و رتبه ۲ بورد تخصصی کشور — در پاسداران تهران.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 1.05 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <a
              href="/contact"
              className="shimmer group inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-[0_16px_40px_-14px] shadow-primary/60 transition-all duration-300 hover:shadow-primary/80 hover:brightness-110 active:scale-95 cursor-pointer"
            >
              <CalendarCheck className="h-4.5 w-4.5 transition-transform duration-300 group-hover:-rotate-6" />
              رزرو نوبت و مشاوره
            </a>
            <a
              href={`tel:${SITE.phone}`}
              dir="ltr"
              className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/70 px-7 py-3.5 text-sm font-bold backdrop-blur transition-all duration-300 hover:bg-card active:scale-95 cursor-pointer"
            >
              <Phone className="h-4.5 w-4.5" />
              {SITE.phone}
            </a>
          </motion.div>

          {/* تضمین‌ها */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.25 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground lg:justify-start"
          >
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              هیئت علمی دانشگاه شهید بهشتی
            </li>
            <li className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-primary" />
              رتبه ۲ بورد تخصص
            </li>
          </motion.ul>
        </motion.div>

        {/* پرتره با تیلت سه‌بعدی */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 60 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.85 }}
          style={{ rotate }}
          className="relative mx-auto w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px]"
        >
          {/* قاب پرتره — ریرال سینمایی با کلیپ‌پات + زوم‌اوت تصویر */}
          <motion.div
            initial={{ clipPath: "inset(14% 14% 14% 14% round 3rem)", opacity: 0.4 }}
            animate={{ clipPath: "inset(0% 0% 0% 0% round 2.5rem)", opacity: 1 }}
            transition={{ duration: 1.25, ease, delay: 0.95 }}
            className="portrait-sheen relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-border/50 shadow-[0_40px_90px_-30px] shadow-foreground/30"
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.18 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.9, ease, delay: 0.95 }}
            >
              <Image
                src="/uploads/doctor-portrait.jpg"
                alt="دکتر پدرام بخشایی — متخصص جراحی دهان، فک و صورت"
                fill
                priority
                loading="eager"
                fetchPriority="high"
                className="object-cover object-top"
                sizes="(max-width: 1024px) 90vw, 440px"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent" />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-background/80 px-4 py-3 backdrop-blur-xl">
              <div>
                <p className="text-sm font-extrabold">Dr. Pedram Bakhshaei</p>
                <p className="text-[11px] font-medium text-muted-foreground">OMFS — Board Certified</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-bold text-primary">
                ۱۱+ سال تجربه
              </span>
            </div>
          </motion.div>

          {/* چیپ شناور */}
          <div className="animate-float absolute -right-3 top-8 rounded-2xl bg-card/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:-right-8">
            <p className="text-xl font-black text-primary tabular-nums">۱۵k+</p>
            <p className="text-[11px] font-medium text-muted-foreground">جراحی ایمپلنت</p>
          </div>
          <div className="animate-float-sm absolute -left-3 bottom-24 rounded-2xl bg-card/90 px-4 py-3 shadow-xl backdrop-blur-xl [animation-delay:1.2s] sm:-left-8">
            <p className="text-xl font-black tabular-nums">۳۴۱</p>
            <p className="text-[11px] font-medium text-muted-foreground">جراحی بازسازی پیشرفته</p>
          </div>
        </motion.div>
      </motion.div>

      {/* نوار آمار */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease, delay: 1.35 }}
        className="relative mx-auto w-full max-w-7xl px-5 pb-8 lg:px-8"
      >
        <dl className="grid grid-cols-2 gap-3 rounded-[2rem] border border-border/60 bg-card/70 p-4 backdrop-blur-xl sm:grid-cols-4 sm:p-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 1.5 + i * 0.1 }}
              className="text-center"
            >
              <dt className="order-2 mt-1 text-[11px] font-medium text-muted-foreground sm:text-xs">{s.label}</dt>
              <dd className="order-1 text-2xl font-black tracking-tight sm:text-3xl">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </motion.div>
          ))}
        </dl>
        <div className="mt-6 flex justify-center">
          <a
            href="/services"
            aria-label="رفتن به بخش خدمات"
            className="animate-bob flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card/60 text-muted-foreground backdrop-blur transition-colors hover:text-foreground cursor-pointer"
          >
            <ArrowDown className="h-4.5 w-4.5" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
