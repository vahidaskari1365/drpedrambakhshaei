"use client";

/**
 * صفحه رزرو نوبت آنلاین (/appointment) — ویزارد ۶ مرحله‌ای با طراحی کرم/طلایی:
 * خوش‌آمد ← ۱) تقویم شمسی ← ۲) ساعت ← ۳) پرداخت ← ۴) اطلاعات بیمار ← ۵) بررسی ← ۶) تأیید پیامکی
 * بدون سامانه واسط؛ شماره موبایل در پایان با کد پیامکی تایید و نوبت قطعی می‌شود.
 * ثبت نوبت فقط پس از تایید کد در سرور انجام می‌شود (Appointment + OtpCode).
 */

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Banknote,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  ClipboardList,
  Clock3,
  CreditCard,
  Info,
  Loader2,
  Lock,
  MessageSquare,
  MoonStar,
  Phone,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Sun,
  User,
  UserRound,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { useSite } from "../content-provider";
import { trackSiteEvent } from "@/lib/track";
import {
  addJalaliMonth,
  faNum,
  isoLocalDate,
  jalaliFullLabel,
  jalaliMonthInfo,
  jalaliToIso,
  jalaliToday,
  JALALI_MONTHS,
} from "@/lib/jalali";
import {
  APPT_SERVICE_LABEL,
  APPT_SLOTS,
  BOOKING_HORIZON_DAYS,
  GENDERS,
  normalizePatientFields,
  SLOT_GROUPS,
  VISIT_FEE,
  VISIT_LABEL,
  slotRangeLabel,
} from "@/lib/booking-constants";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const STEPS: { id: Step; label: string; Icon: typeof CalendarDays }[] = [
  { id: 1, label: "تقویم", Icon: CalendarDays },
  { id: 2, label: "ساعت", Icon: Clock3 },
  { id: 3, label: "پرداخت", Icon: Wallet },
  { id: 4, label: "اطلاعات", Icon: ClipboardList },
  { id: 5, label: "بررسی", Icon: ShieldCheck },
  { id: 6, label: "تأیید", Icon: MessageSquare },
];

/* پالت ویزارد — کرم/طلایی هماهنگ با برند */
const GOLD = "#B8912E";
const GOLD_DEEP = "#9E7A22";
const INK = "#241E12";

const WEEKDAYS_FA = [
  { short: "ش", full: "شنبه" },
  { short: "ی", full: "یکشنبه" },
  { short: "د", full: "دوشنبه" },
  { short: "س", full: "سه‌شنبه" },
  { short: "چ", full: "چهارشنبه" },
  { short: "پ", full: "پنجشنبه" },
  { short: "ج", full: "جمعه" },
];
const FEE_LABEL = `${VISIT_FEE.toLocaleString("fa-IR")} تومان`;
const CLINIC_ADDRESS = "تهران، پاسداران، مرکز خرید پاسداران، طبقه ۲، واحد ۴";

const pad = (n: number) => String(n).padStart(2, "0");
const maskPhone = (p: string) => (p.length === 11 ? `${p.slice(0, 4)}•••${p.slice(7)}` : p);

function isPastSlot(date: string, time: string): boolean {
  return new Date(`${date}T${time}:00`).getTime() < Date.now() + 2 * 3600_000;
}

type DayState = "past" | "closed" | "full" | "open";

function dayState(
  iso: string,
  todayIso: string,
  horizonIso: string,
  remaining: number | undefined,
  loading: boolean,
): DayState {
  if (new Date(`${iso}T00:00:00`).getDay() === 5) return "closed"; // جمعه
  if (iso < todayIso) return "past";
  if (iso > horizonIso) return "closed";
  if (!loading && remaining !== undefined && remaining <= 0) return "full";
  return "open";
}

export function AppointmentPage() {
  const { site } = useSite();

  /* ─── ناوبری اصلی ─── */
  const [view, setView] = React.useState<"welcome" | "wizard" | "success">("welcome");
  const [step, setStep] = React.useState<Step>(1);
  const [otpStage, setOtpStage] = React.useState<"phone" | "code">("phone");

  /* ─── انتخاب‌های رزرو ─── */
  const today = React.useMemo(() => jalaliToday(), []);
  const [jmonth, setJmonth] = React.useState({ jy: today.jy, jm: today.jm });
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [name, setName] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [latinName, setLatinName] = React.useState("");
  const [birthYear, setBirthYear] = React.useState("");
  const [note, setNote] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");

  /* ─── داده سرور ─── */
  const [monthData, setMonthData] = React.useState<{ key: number; days: Record<string, number> } | null>(
    null,
  );
  const monthKey = jmonth.jy * 12 + jmonth.jm;
  const monthLoading = !monthData || monthData.key !== monthKey;
  const monthDays = monthData && monthData.key === monthKey ? monthData.days : {};
  const [booked, setBooked] = React.useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = React.useState(false);

  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [resendIn, setResendIn] = React.useState(0);

  React.useEffect(() => {
    const t = setTimeout(() => trackSiteEvent("appointment_open", {}), 0);
    return () => clearTimeout(t);
  }, []);

  /* ظرفیت روزهای ماه نمایان — یک ماه شمسی دو ماه میلادی را می‌پوشاند */
  React.useEffect(() => {
    let alive = true;
    const info = jalaliMonthInfo(jmonth.jy, jmonth.jm);
    const from = jalaliToIso(jmonth.jy, jmonth.jm, 1);
    const to = jalaliToIso(jmonth.jy, jmonth.jm, info.length);
    fetch(`/api/appointments/slots?from=${from}&to=${to}`)
      .then((r) => r.json())
      .then((d: { days?: Record<string, number> }) => {
        if (alive) setMonthData({ key: monthKey, days: d.days && typeof d.days === "object" ? d.days : {} });
      })
      .catch(() => {
        if (alive) setMonthData({ key: monthKey, days: {} });
      });
    return () => {
      alive = false;
    };
  }, [monthKey, jmonth.jy, jmonth.jm]);

  const pickDate = React.useCallback((iso: string) => {
    setDate(iso);
    setTime("");
    setSlotsLoading(true);
    fetch(`/api/appointments/slots?date=${iso}`)
      .then((r) => r.json())
      .then((d: { booked?: string[] }) => setBooked(Array.isArray(d.booked) ? d.booked : []))
      .catch(() => setBooked([]))
      .finally(() => setSlotsLoading(false));
  }, []);

  /* شمارش معکوس ارسال مجدد کد */
  React.useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  /* ─── اعتبارسنجی اطلاعات بیمار (گام ۴) ─── */
  const validateInfo = (): string => {
    if (name.trim().length < 2) return "نام و نام خانوادگی بیمار را کامل وارد کنید";
    const patient = normalizePatientFields({ gender, latinName, birthYear });
    if (!patient.ok) return patient.error;
    return "";
  };

  /* ─── ارسال کد تایید ─── */
  const requestOtp = async () => {
    setError("");
    const infoError = validateInfo();
    if (infoError) {
      setStep(4);
      setError(infoError);
      return;
    }
    if (!/^(\+98|0098|0)?9\d{9}$/.test(phone.trim()))
      return setError("شماره موبایل معتبر وارد کنید (مثل ۰۹۱۲۳۴۵۶۷۸۹)");
    setBusy(true);
    try {
      const res = await fetch("/api/appointments/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          service: APPT_SERVICE_LABEL,
          date,
          time,
          gender,
          latinName,
          birthYear,
          note,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "ارسال کد ناموفق بود");
      setOtpStage("code");
      setResendIn(50);
      setCode("");
      trackSiteEvent("appointment_otp_sent", { source: "appointment_page" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطایی رخ داد");
    } finally {
      setBusy(false);
    }
  };

  /* ─── ثبت نهایی نوبت ─── */
  const confirmBooking = async () => {
    setError("");
    if (!/^\d{6}$/.test(code.trim())) return setError("کد ۶ رقمی پیامک‌شده را وارد کنید");
    setBusy(true);
    try {
      const res = await fetch("/api/appointments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          service: APPT_SERVICE_LABEL,
          date,
          time,
          gender,
          latinName,
          birthYear,
          note,
          code,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "ثبت نوبت ناموفق بود");
      setView("success");
      trackSiteEvent("appointment_booked", { source: "appointment_page" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "خطایی رخ داد";
      setError(msg);
      // اگر اسلات همزمان رزرو شده بود، ظرفیت‌ها تازه شوند
      if (msg.includes("رزرو شد") && date) pickDate(date);
    } finally {
      setBusy(false);
    }
  };

  /* ─── ناوبری گام‌ها ─── */
  const goStep = (s: Step) => {
    if (busy) return;
    setError("");
    if (s < step) {
      if (s < 6) setOtpStage("phone");
      setStep(s);
    }
  };
  const nextStep = () => {
    if (busy) return;
    setError("");
    setStep((s) => (s === 5 ? 6 : ((s + 1) as Step)));
    if (step === 5) setOtpStage("phone");
  };

  const restart = () => {
    setView("welcome");
    setStep(1);
    setOtpStage("phone");
    setDate("");
    setTime("");
    setName("");
    setGender("");
    setLatinName("");
    setBirthYear("");
    setNote("");
    setPhone("");
    setCode("");
    setError("");
  };

  /* ─── داده تقویم ─── */
  const monthInfo = React.useMemo(
    () => jalaliMonthInfo(jmonth.jy, jmonth.jm),
    [jmonth.jy, jmonth.jm],
  );
  const todayIso = React.useMemo(() => {
    const n = new Date();
    return isoLocalDate(n);
  }, []);
  const horizonIso = React.useMemo(
    () => isoLocalDate(new Date(Date.now() + BOOKING_HORIZON_DAYS * 86400_000)),
    [],
  );
  const minMonthKey = today.jy * 12 + today.jm;
  const maxMonthKey = React.useMemo(() => {
    const m = addJalaliMonth(today.jy, today.jm, 2);
    return m.jy * 12 + m.jm;
  }, [today.jy, today.jm]);
  const curMonthKey = jmonth.jy * 12 + jmonth.jm;
  const canPrev = curMonthKey > minMonthKey;
  const canNext = curMonthKey < maxMonthKey;

  const calCells = React.useMemo(() => {
    const cells: ({ jd: number; iso: string } | null)[] = Array(monthInfo.firstWeekIndex).fill(null);
    for (let jd = 1; jd <= monthInfo.length; jd++) {
      cells.push({ jd, iso: jalaliToIso(jmonth.jy, jmonth.jm, jd) });
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [monthInfo, jmonth.jy, jmonth.jm]);

  /* ─── صفحه موفقیت ─── */
  if (view === "success") {
    return (
      <div className="w-full bg-[#F5F0E5] pb-20 pt-10 sm:pt-16">
        <div className="mx-auto w-full max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[2rem] border border-[#EDE4CF] bg-white p-8 text-center shadow-[0_24px_70px_-32px_rgba(96,74,20,0.35)]"
          >
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FCF7EA] ring-4 ring-[#B8912E]/15">
              <CheckCircle2 className="h-10 w-10" style={{ color: GOLD }} />
            </span>
            <h1 className="mt-5 text-[22px] font-black" style={{ color: INK }}>
              نوبت شما قطعی شد
            </h1>
            <p className="mx-auto mt-2 max-w-xs text-[13px] leading-7 text-[#8A8271]">
              {name} عزیز، جزئیات نوبت با پیامک برایتان ارسال شد. روز مراجعه ۱۰ دقیقه زودتر در مطب
              تشریف داشته باشید.
            </p>
            <div className="mt-6 space-y-2.5 rounded-2xl bg-[#F8F4EA] p-4 text-right">
              <SuccessRow label="نام بیمار" value={name} />
              <SuccessRow label="روز مراجعه" value={date ? jalaliFullLabel(date) : "—"} />
              <SuccessRow label="ساعت مراجعه" value={time ? slotRangeLabel(time) : "—"} />
              <SuccessRow label="آدرس مطب" value={CLINIC_ADDRESS} />
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={restart}
                className="rounded-full bg-[#B8912E] px-6 py-3 text-[13px] font-black text-white shadow-lg shadow-[#B8912E]/25 transition hover:bg-[#9E7A22]"
              >
                رزرو نوبت جدید
              </button>
              <a
                href="/"
                className="rounded-full border border-[#E4DCC9] px-6 py-3 text-[13px] font-black text-[#6E6552] transition hover:bg-[#F8F4EA]"
              >
                بازگشت به صفحه اصلی
              </a>
              <a
                href={`tel:${site.phoneIntl}`}
                dir="ltr"
                className="inline-flex items-center gap-2 rounded-full border border-[#E4DCC9] px-5 py-3 text-[13px] font-black text-[#6E6552] transition hover:bg-[#F8F4EA]"
              >
                <Phone className="h-4 w-4" />
                {site.phone}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ─── صفحه خوش‌آمد ─── */
  if (view === "welcome") {
    return (
      <div className="w-full bg-[#F5F0E5] pb-20 pt-10 sm:pt-16">
        <div className="mx-auto w-full max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[2rem] border border-[#EDE4CF] bg-white p-7 text-center shadow-[0_24px_70px_-32px_rgba(96,74,20,0.35)] sm:p-9"
          >
            <div className="mx-auto w-56 overflow-hidden rounded-[1.75rem]">
              <Image
                src="/images/booking-welcome.webp"
                alt="پذیرش آنلاین مطب دکتر پدرام بخشایی"
                width={720}
                height={720}
                priority
                className="h-auto w-full"
              />
            </div>
            <h1 className="mt-6 text-[24px] font-black" style={{ color: INK }}>
              سلام! خوش آمدید
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-[13.5px] leading-7 text-[#8A8271]">
              رزرو نوبت مطب دکتر پدرام بخشایی آنلاین است؛ روز و ساعت مراجعه را انتخاب کنید و در
              پایان با یک پیامک، نوبت خود را قطعی کنید.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-2.5">
              {[
                { Icon: Clock3, label: "کمتر از ۱ دقیقه" },
                { Icon: ShieldCheck, label: "تأیید پیامکی" },
                { Icon: CalendarDays, label: "تقویم شمسی" },
              ].map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-[#F8F4EA] px-2 py-4"
                >
                  <Icon className="h-5 w-5" style={{ color: GOLD }} />
                  <span className="text-[10.5px] font-bold text-[#6E6552]">{label}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setView("wizard");
                trackSiteEvent("appointment_open", { source: "welcome_start" });
              }}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-black text-white shadow-lg shadow-[#B8912E]/30 transition hover:brightness-95 active:scale-[0.99]"
              style={{ backgroundColor: GOLD }}
            >
              <CalendarCheck className="h-5 w-5" />
              شروع رزرو نوبت
            </button>
            <p className="mt-5 text-[11px] leading-5 text-[#A79B7E]">
              شنبه تا پنجشنبه، ۱۶ تا ۲۰ — پاسداران، مرکز خرید پاسداران، طبقه ۲
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ─── ویزارد ─── */
  return (
    <div className="w-full bg-[#F5F0E5] pb-32 pt-8 sm:pt-12">
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="rounded-[2rem] border border-[#EDE4CF] bg-white p-5 shadow-[0_24px_70px_-32px_rgba(96,74,20,0.35)] sm:p-8">
          <Stepper step={step} onGo={goStep} />

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-center text-[13px] font-bold text-rose-700"
            >
              {error}
            </motion.p>
          )}

          <div className="mt-6">
            <AnimatePresence mode="wait">
              {/* ─────────── گام ۱: تقویم ─────────── */}
              {step === 1 && (
                <motion.section
                  key="calendar"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  transition={{ duration: 0.28 }}
                  aria-label="انتخاب تاریخ مراجعه"
                >
                  <h2 className="text-center text-[17px] font-black" style={{ color: INK }}>
                    تاریخ مراجعه خود را انتخاب کنید
                  </h2>
                  <p className="mt-1.5 text-center text-[12.5px] text-[#9A9080]">
                    روزی که پذیرش مطب است — تعرفه زیر روزهای آزاد درج شده است
                  </p>

                  <div className="mt-5 rounded-2xl border border-[#EDE4CF] bg-[#FBF8F1] p-4">
                    {/* هدر ماه */}
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setJmonth(addJalaliMonth(jmonth.jy, jmonth.jm, 1))}
                        disabled={!canNext || busy}
                        aria-label="ماه بعد"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EDE4CF] bg-white text-[#6E6552] transition hover:border-[#CBA94F] disabled:opacity-40"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <p className="text-[15.5px] font-black" style={{ color: INK }}>
                        {JALALI_MONTHS[jmonth.jm - 1]} {faNum(jmonth.jy)}
                      </p>
                      <button
                        type="button"
                        onClick={() => setJmonth(addJalaliMonth(jmonth.jy, jmonth.jm, -1))}
                        disabled={!canPrev || busy}
                        aria-label="ماه قبل"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EDE4CF] bg-white text-[#6E6552] transition hover:border-[#CBA94F] disabled:opacity-40"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    {/* روزهای هفته */}
                    <div
                      className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-[#A79B7E] sm:gap-1.5 sm:text-[10.5px]"
                      aria-hidden="true"
                    >
                      {WEEKDAYS_FA.map((w) => (
                        <span key={w.full}>
                          <span className="sm:hidden">{w.short}</span>
                          <span className="hidden sm:inline">{w.full}</span>
                        </span>
                      ))}
                    </div>

                    {/* شبکه روزها */}
                    <div
                      className={cn(
                        "mt-2 grid grid-cols-7 gap-1 transition-opacity sm:gap-1.5",
                        monthLoading && "opacity-50",
                      )}
                      aria-label="تقویم ماه"
                    >
                      {calCells.map((c, i) =>
                        c === null ? (
                          <span key={`e-${i}`} />
                        ) : (
                          <DayCell
                            key={c.iso}
                            jd={c.jd}
                            iso={c.iso}
                            state={dayState(
                              c.iso,
                              todayIso,
                              horizonIso,
                              monthDays[c.iso],
                              monthLoading,
                            )}
                            selected={date === c.iso}
                            isToday={c.iso === todayIso}
                            onSelect={(iso) => {
                              pickDate(iso);
                              setError("");
                            }}
                          />
                        ),
                      )}
                    </div>

                    <p className="mt-4 border-t border-dashed border-[#E8DFC9] pt-3 text-center text-[11px] leading-5 text-[#A79B7E]">
                      مطب شنبه تا پنجشنبه، ۱۶ تا ۲۰ پذیرش دارد — جمعه‌ها تعطیل است
                    </p>
                  </div>

                  <ContinueButton
                    label="ادامه"
                    disabled={!date || busy}
                    onClick={nextStep}
                  />
                </motion.section>
              )}

              {/* ─────────── گام ۲: ساعت ─────────── */}
              {step === 2 && (
                <motion.section
                  key="time"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  transition={{ duration: 0.28 }}
                  aria-label="انتخاب ساعت مراجعه"
                >
                  <h2 className="text-center text-[17px] font-black" style={{ color: INK }}>
                    ساعت مراجعه را انتخاب کنید
                  </h2>
                  <p className="mt-1.5 text-center text-[12.5px] text-[#9A9080]">
                    بازه‌های آزاد روز انتخابی — هر بازه یک نوبت اختصاصی است
                  </p>

                  {/* نوار تاریخ انتخاب‌شده */}
                  <div
                    className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl px-4 py-3 text-white"
                    style={{ backgroundColor: "#241E12" }}
                  >
                    <span className="flex items-center gap-2 text-[13px] font-black">
                      <CalendarDays className="h-4 w-4 text-[#E3C77F]" />
                      {date ? jalaliFullLabel(date) : "—"}
                    </span>
                    <span className="text-[12px] text-white/65">دکتر پدرام بخشایی</span>
                  </div>

                  {slotsLoading && (
                    <p className="mt-5 flex items-center justify-center gap-2 text-[12.5px] text-[#9A9080]">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      در حال دریافت بازه‌های آزاد…
                    </p>
                  )}

                  {!slotsLoading &&
                    SLOT_GROUPS.map((g) => {
                      const groupSlots = APPT_SLOTS.filter((t) => t >= g.from && t <= g.to);
                      return (
                        <div key={g.id} className="mt-6">
                          <p className="flex items-center gap-2 text-[13.5px] font-black" style={{ color: INK }}>
                            {g.id === "asr" ? (
                              <Sun className="h-4 w-4 text-[#D9A72E]" />
                            ) : (
                              <MoonStar className="h-4 w-4 text-[#8A7A4E]" />
                            )}
                            {g.label}
                          </p>
                          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                            {groupSlots.map((t) => {
                              const taken = booked.includes(t) || isPastSlot(date, t);
                              const sel = time === t;
                              return (
                                <button
                                  key={t}
                                  type="button"
                                  disabled={taken || busy}
                                  aria-label={`بازه ${slotRangeLabel(t)}${taken ? " — رزرو شده" : ""}`}
                                  aria-pressed={sel}
                                  onClick={() => {
                                    setTime(t);
                                    setError("");
                                  }}
                                  className={cn(
                                    "flex items-center justify-between gap-2 rounded-2xl border p-3.5 text-right transition-all",
                                    taken
                                      ? "cursor-not-allowed border-[#EFE9DA] bg-[#F7F3E9]"
                                      : sel
                                        ? "border-[#B8912E] bg-[#FCF7EA] ring-1 ring-[#B8912E]/40"
                                        : "border-[#EDE4CF] bg-white hover:border-[#CBA94F]",
                                  )}
                                >
                                  <span>
                                    <span
                                      className={cn(
                                        "block text-[13.5px] font-black",
                                        taken ? "text-[#C4BAA0]" : "text-[#241E12]",
                                      )}
                                    >
                                      {slotRangeLabel(t)}
                                    </span>
                                    <span
                                      className={cn(
                                        "mt-0.5 block text-[11.5px] font-bold",
                                        taken ? "text-[#C4BAA0]" : "text-[#B8912E]",
                                      )}
                                    >
                                      {taken ? "رزرو شده" : FEE_LABEL}
                                    </span>
                                  </span>
                                  {sel && !taken ? (
                                    <CircleCheck
                                      className="h-6 w-6 shrink-0"
                                      style={{ color: GOLD }}
                                    />
                                  ) : (
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8F4EA]">
                                      <Clock3
                                        className={cn("h-4 w-4", taken ? "text-[#C4BAA0]" : "text-[#A79B7E]")}
                                      />
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                  <ContinueButton
                    label="ادامه"
                    disabled={!time || busy}
                    onClick={nextStep}
                  />
                </motion.section>
              )}

              {/* ─────────── گام ۳: پرداخت ─────────── */}
              {step === 3 && (
                <motion.section
                  key="payment"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  transition={{ duration: 0.28 }}
                  aria-label="فاکتور و روش پرداخت"
                >
                  <h2 className="text-center text-[17px] font-black" style={{ color: INK }}>
                    فاکتور نوبت را بررسی کنید
                  </h2>
                  <p className="mt-1.5 text-center text-[12.5px] text-[#9A9080]">
                    تعرفه ویزیت و روش پرداخت را مشخص کنید
                  </p>

                  {/* فاکتور */}
                  <div className="mt-5 rounded-2xl border border-[#EDE4CF] bg-[#FBF8F1] p-4.5 px-4">
                    <p className="flex items-center gap-2 text-[13.5px] font-black" style={{ color: INK }}>
                      <ReceiptText className="h-4.5 w-4.5" style={{ color: GOLD }} />
                      فاکتور نوبت
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[13px]">
                      <span className="text-[#6E6552]">{VISIT_LABEL}</span>
                      <span className="font-black" style={{ color: INK }}>
                        {FEE_LABEL}
                      </span>
                    </div>
                    <div className="my-3 border-t border-dashed border-[#E0D6BC]" />
                    <div className="flex items-center justify-between text-[13.5px]">
                      <span className="font-black" style={{ color: INK }}>
                        قابل پرداخت
                      </span>
                      <span className="font-black" style={{ color: INK }}>
                        {FEE_LABEL}
                      </span>
                    </div>
                  </div>

                  {/* روش پرداخت */}
                  <p className="mt-5 text-[12.5px] font-black text-[#6E6552]">روش پرداخت</p>
                  <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
                    <div
                      className="flex items-center justify-between gap-2 rounded-2xl border-2 p-4"
                      style={{ borderColor: GOLD, backgroundColor: "#FCF7EA" }}
                    >
                      <span>
                        <span className="block text-[13.5px] font-black" style={{ color: INK }}>
                          پرداخت در مطب
                        </span>
                        <span className="mt-0.5 block text-[11px] text-[#9A9080]">
                          هنگام مراجعه — پرداخت با کارتخوان
                        </span>
                      </span>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                        <Banknote className="h-5 w-5" style={{ color: GOLD }} />
                      </span>
                    </div>
                    <div
                      className="flex cursor-not-allowed items-center justify-between gap-2 rounded-2xl border border-[#EDE4CF] bg-white p-4 opacity-60"
                      aria-disabled="true"
                    >
                      <span>
                        <span className="flex items-center gap-2 text-[13.5px] font-black text-[#8A8271]">
                          پرداخت آنلاین
                          <span className="rounded-full bg-[#F1EADA] px-2 py-0.5 text-[9.5px] font-bold text-[#8A8271]">
                            به‌زودی
                          </span>
                        </span>
                        <span className="mt-0.5 block text-[11px] text-[#A79B7E]">
                          درگاه بانکی به‌زودی فعال می‌شود
                        </span>
                      </span>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F4EA]">
                        <CreditCard className="h-5 w-5 text-[#A79B7E]" />
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-[#FBF6EA] p-3.5">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#B8912E]" />
                    <p className="text-[12px] leading-6 text-[#8A6D1F]">
                      ثبت نوبت بدون پرداخت آنلاین قطعی می‌شود؛ هزینه ویزیت هنگام مراجعه در مطب
                      دریافت می‌شود.
                    </p>
                  </div>

                  <ContinueButton label="ادامه" disabled={busy} onClick={nextStep} />
                </motion.section>
              )}

              {/* ─────────── گام ۴: اطلاعات بیمار ─────────── */}
              {step === 4 && (
                <motion.section
                  key="info"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  transition={{ duration: 0.28 }}
                  aria-label="اطلاعات بیمار"
                >
                  <h2 className="text-center text-[17px] font-black" style={{ color: INK }}>
                    اطلاعات رزرو را ثبت کنید
                  </h2>
                  <p className="mt-1.5 text-center text-[12.5px] text-[#9A9080]">
                    مشخصات بیمار برای پرونده مطب
                  </p>

                  {/* چیپ‌های خلاصه انتخاب */}
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    {date && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F4EA] px-3 py-1.5 text-[11.5px] font-black text-[#6E6552]">
                        <CalendarDays className="h-3.5 w-3.5" style={{ color: GOLD }} />
                        {jalaliFullLabel(date)}
                      </span>
                    )}
                    {time && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F4EA] px-3 py-1.5 text-[11.5px] font-black text-[#6E6552]">
                        <Clock3 className="h-3.5 w-3.5" style={{ color: GOLD }} />
                        {slotRangeLabel(time)}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F4EA] px-3 py-1.5 text-[11.5px] font-black text-[#6E6552]">
                      <Stethoscope className="h-3.5 w-3.5" style={{ color: GOLD }} />
                      دکتر پدرام بخشایی
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    <Field label="نام و نام خانوادگی بیمار" required>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="مثلاً سارا محمدی"
                        autoComplete="name"
                        className={inputCls}
                      />
                    </Field>

                    <Field label="جنسیت" required>
                      <div className="grid grid-cols-2 gap-2.5">
                        {GENDERS.map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g)}
                            aria-pressed={gender === g}
                            className={cn(
                              "flex items-center justify-center gap-2 rounded-xl border py-3 text-[13px] font-black transition",
                              gender === g
                                ? "border-[#B8912E] bg-[#FCF7EA] ring-1 ring-[#B8912E]/40"
                                : "border-[#EDE4CF] bg-white text-[#8A8271] hover:border-[#CBA94F]",
                            )}
                            style={gender === g ? { color: INK } : undefined}
                          >
                            {g === "آقا" ? <User className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}
                            {g}
                          </button>
                        ))}
                      </div>
                    </Field>

                    <Field label="نام لاتین (اختیاری)">
                      <input
                        value={latinName}
                        onChange={(e) => setLatinName(e.target.value)}
                        placeholder="Sara Mohammadi"
                        dir="ltr"
                        autoComplete="off"
                        className={cn(inputCls, "text-left")}
                      />
                    </Field>

                    <Field label="سال تولد (اختیاری)">
                      <input
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        placeholder="۱۳۷۰"
                        inputMode="numeric"
                        className={inputCls}
                      />
                    </Field>

                    <Field label="توضیح برای مطب (اختیاری)">
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        maxLength={500}
                        placeholder="مثلاً عکس رادیوگرافی دارم، یا درخواست مشاوره جراحی فک دارم..."
                        className={cn(inputCls, "resize-none leading-7")}
                      />
                    </Field>
                  </div>

                  <ContinueButton label="ادامه" disabled={busy} onClick={nextStep} />
                </motion.section>
              )}

              {/* ─────────── گام ۵: بررسی ─────────── */}
              {step === 5 && (
                <motion.section
                  key="review"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  transition={{ duration: 0.28 }}
                  aria-label="بررسی اطلاعات رزرو"
                >
                  <h2 className="text-center text-[17px] font-black" style={{ color: INK }}>
                    اطلاعات رزرو را بررسی کنید
                  </h2>
                  <p className="mt-1.5 text-center text-[12.5px] text-[#9A9080]">
                    از درستی اطلاعات اطمینان پیدا کنید؛ هر ردیف را می‌توانید ویرایش کنید
                  </p>

                  <div className="mt-5 rounded-2xl border border-[#EDE4CF] bg-[#FBF8F1] px-4">
                    <ReviewRow icon={User} label="نام بیمار" value={name} onEdit={() => goStep(4)} />
                    <ReviewRow icon={UserRound} label="جنسیت" value={gender} onEdit={() => goStep(4)} />
                    <ReviewRow icon={Stethoscope} label="پزشک" value="دکتر پدرام بخشایی" />
                    <ReviewRow
                      icon={CalendarDays}
                      label="روز مراجعه"
                      value={date ? jalaliFullLabel(date) : "—"}
                      onEdit={() => goStep(1)}
                    />
                    <ReviewRow
                      icon={Clock3}
                      label="ساعت مراجعه"
                      value={time ? slotRangeLabel(time) : "—"}
                      onEdit={() => goStep(2)}
                    />
                    <ReviewRow icon={Smartphone} label="نوع ویزیت" value="حضوری — مطب" />
                    <ReviewRow
                      icon={Wallet}
                      label="هزینه و پرداخت"
                      value={`${FEE_LABEL} — پرداخت در مطب`}
                      onEdit={() => goStep(3)}
                    />
                  </div>

                  <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-[#FBF6EA] p-3.5">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#B8912E]" />
                    <p className="text-[12px] leading-6 text-[#8A6D1F]">
                      پس از تأیید، کد ۶ رقمی به موبایل شما پیامک می‌شود؛ با واردکردن آن، نوبت
                      به‌صورت خودکار قطعی می‌شود.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={busy}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[14px] font-black text-white shadow-lg shadow-[#B8912E]/30 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
                    style={{ backgroundColor: GOLD }}
                  >
                    <ShieldCheck className="h-4.5 w-4.5" />
                    تأیید و ادامه — ثبت نهایی نوبت
                  </button>
                </motion.section>
              )}

              {/* ─────────── گام ۶: تأیید پیامکی ─────────── */}
              {step === 6 && otpStage === "phone" && (
                <motion.section
                  key="verify-phone"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  transition={{ duration: 0.28 }}
                  aria-label="تایید شماره موبایل"
                >
                  <h2 className="text-center text-[17px] font-black" style={{ color: INK }}>
                    تأیید شماره موبایل
                  </h2>
                  <p className="mt-1.5 text-center text-[12.5px] text-[#9A9080]">
                    برای قطعی‌شدن نوبت، کد ۶ رقمی پیامک‌شده را وارد کنید
                  </p>

                  <div className="mx-auto mt-6 max-w-md rounded-2xl border border-[#EDE4CF] bg-[#FBF8F1] p-5">
                    <label
                      htmlFor="booking-phone"
                      className="flex items-center gap-2 text-[13px] font-black"
                      style={{ color: INK }}
                    >
                      <Smartphone className="h-4 w-4" style={{ color: GOLD }} />
                      شماره موبایل خود را وارد کنید
                    </label>
                    <input
                      id="booking-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09123456789"
                      inputMode="tel"
                      dir="ltr"
                      autoComplete="tel"
                      className={cn(inputCls, "mt-3 bg-white text-left text-[15px] tracking-wide")}
                    />
                    <button
                      type="button"
                      onClick={requestOtp}
                      disabled={busy}
                      className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[14px] font-black text-white shadow-lg shadow-[#B8912E]/25 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
                      style={{ backgroundColor: GOLD }}
                    >
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                      {busy ? "در حال ارسال…" : "تأیید و ارسال کد"}
                    </button>
                  </div>

                  <p className="mt-5 text-center text-[11.5px] leading-6 text-[#A79B7E]">
                    شماره شما فقط برای هماهنگی همین نوبت استفاده می‌شود؛ بدون کد پیامکی، نوبت ثبت
                    نمی‌شود.
                  </p>
                </motion.section>
              )}

              {step === 6 && otpStage === "code" && (
                <motion.section
                  key="verify-code"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  transition={{ duration: 0.28 }}
                  aria-label="کد تایید پیامکی"
                >
                  <div className="mx-auto max-w-md text-center">
                    <span
                      className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FCF7EA]"
                      style={{ color: GOLD }}
                    >
                      <MessageSquare className="h-6 w-6" />
                    </span>
                    <h2 className="mt-4 text-[17px] font-black" style={{ color: INK }}>
                      کد تأیید را وارد کنید
                    </h2>
                    <p className="mt-1.5 text-[12.5px] text-[#9A9080]">
                      کد ۶ رقمی به شماره{" "}
                      <span dir="ltr" className="font-black text-[#6E6552]">
                        {maskPhone(phone)}
                      </span>{" "}
                      پیامک شد
                    </p>
                    <p className="mt-1 text-[11.5px] text-[#B0A88F]">
                      کد تا ۱۰ دقیقه اعتبار دارد؛ اگر پیامک با چند دقیقه تأخیر رسید، همان کد را وارد کنید
                    </p>

                    <div dir="ltr" className="mt-6 flex justify-center *:data-[slot=input-otp-slot]:border-[#E4DCC9] *:data-[slot=input-otp-slot]:bg-[#FBF8F1]">
                      <InputOTP maxLength={6} value={code} onChange={setCode} disabled={busy}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <div className="mt-5 flex items-center justify-center gap-3 text-[12px] text-[#A79B7E]">
                      <span>کد نرسید؟</span>
                      {resendIn > 0 ? (
                        <span className="font-black text-[#8A8271]">
                          ارسال مجدد تا {faNum(resendIn)} ثانیه
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={requestOtp}
                          disabled={busy}
                          className="inline-flex items-center gap-1.5 font-black disabled:opacity-50"
                          style={{ color: GOLD }}
                        >
                          <RefreshCw className={cn("h-3.5 w-3.5", busy && "animate-spin")} />
                          ارسال مجدد کد
                        </button>
                      )}
                      <span className="text-[#E4DCC9]">|</span>
                      <button
                        type="button"
                        onClick={() => setOtpStage("phone")}
                        className="font-black text-[#8A8271] hover:text-[#6E6552]"
                      >
                        ویرایش شماره
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={confirmBooking}
                      disabled={busy || code.length !== 6}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[14px] font-black text-white shadow-lg shadow-[#B8912E]/30 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
                      style={{ backgroundColor: GOLD }}
                    >
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                      {busy ? "در حال ثبت نوبت…" : "تأیید و ثبت نهایی نوبت"}
                    </button>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* پانویس ویزارد */}
        <p className="mt-4 text-center text-[11.5px] text-[#A79B7E]">
          نوبت پس از تأیید پیامکی قطعی می‌شود — اطلاعات شما فقط برای همین رزرو استفاده می‌شود
        </p>
        <p className="mt-1.5 text-center text-[11.5px] text-[#A79B7E]">
          برای رزرو تلفنی:{" "}
          <a
            href={`tel:${site.phoneIntl}`}
            dir="ltr"
            className="font-black hover:underline"
            style={{ color: GOLD }}
          >
            {site.phone}
          </a>
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────── اجزای کوچک ─────────────────────────── */

const inputCls =
  "w-full rounded-xl border border-[#EDE4CF] bg-[#FBF8F1] px-4 py-3 text-sm outline-none transition placeholder:text-[#B8AE97] focus:border-[#B8912E] focus:bg-white";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-black text-[#6E6552]">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

function ContinueButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[14px] font-black text-white shadow-lg shadow-[#B8912E]/25 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
      style={{ backgroundColor: GOLD }}
    >
      {label}
      <ChevronLeft className="h-4.5 w-4.5" />
    </button>
  );
}

function DayCell({
  jd,
  iso,
  state,
  selected,
  isToday,
  onSelect,
}: {
  jd: number;
  iso: string;
  state: DayState;
  selected: boolean;
  isToday: boolean;
  onSelect: (iso: string) => void;
}) {
  if (state === "past") {
    return (
      <span
        className="flex h-12 items-center justify-center text-[13px] font-black text-[#E88B8B] sm:h-[52px]"
        aria-disabled="true"
      >
        {faNum(jd)}
      </span>
    );
  }
  if (state === "closed") {
    return (
      <span
        className="flex h-12 items-start justify-center pt-2.5 text-[13px] font-bold text-[#D3C9B0] sm:h-[52px]"
        aria-disabled="true"
      >
        {faNum(jd)}
      </span>
    );
  }
  if (state === "full") {
    return (
      <span
        className="flex h-12 flex-col items-center justify-center gap-1 rounded-xl border border-[#EFE9DA] bg-[#F7F3E9] sm:h-[52px]"
        aria-disabled="true"
      >
        <span className="text-[13px] font-black leading-none text-[#C4BAA0]">{faNum(jd)}</span>
        <span className="text-[8px] font-bold leading-none text-[#C4BAA0]">تکمیل</span>
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={() => onSelect(iso)}
      aria-pressed={selected}
      aria-label={`${faNum(jd)} — ${FEE_LABEL}`}
      className={cn(
        "flex h-12 flex-col items-center justify-center gap-1 rounded-xl border transition-all sm:h-[52px]",
        selected
          ? "border-[#B8912E] text-white shadow-md shadow-[#B8912E]/30"
          : "border-[#EDE4CF] bg-white text-[#241E12] hover:border-[#CBA94F]",
      )}
      style={selected ? { backgroundColor: GOLD } : undefined}
    >
      <span className="relative text-[13px] font-black leading-none">
        {faNum(jd)}
        {isToday && !selected && (
          <span
            className="absolute -bottom-1.5 left-1/2 h-[2.5px] w-3.5 -translate-x-1/2 rounded-full"
            style={{ backgroundColor: GOLD }}
          />
        )}
      </span>
      <span
        className={cn("text-[8px] font-bold leading-none sm:text-[8.5px]", selected ? "text-white/85" : "")}
        style={!selected ? { color: GOLD } : undefined}
      >
        {VISIT_FEE.toLocaleString("fa-IR")}
      </span>
    </button>
  );
}

function ReviewRow({
  icon: Icon,
  label,
  value,
  onEdit,
}: {
  icon: typeof User;
  label: string;
  value: string;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-dashed border-[#EFE9DA] py-3 last:border-0">
      <span className="flex shrink-0 items-center gap-2 text-[12px] font-bold text-[#9A9080]">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span className="flex min-w-0 items-center gap-2.5 text-left">
        <span className="truncate text-[13px] font-black text-[#241E12]">{value}</span>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="shrink-0 text-[11px] font-black hover:underline"
            style={{ color: GOLD }}
          >
            ویرایش
          </button>
        )}
      </span>
    </div>
  );
}

function SuccessRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex items-start justify-between gap-3 text-[12.5px]">
      <span className="shrink-0 font-bold text-[#9A9080]">{label}:</span>
      <span className="text-left font-black leading-6 text-[#241E12]">{value}</span>
    </p>
  );
}

function Stepper({ step, onGo }: { step: Step; onGo: (s: Step) => void }) {
  return (
    <ol className="flex w-full items-start" aria-label="مراحل رزرو نوبت">
      {STEPS.map(({ id, label, Icon }, i) => {
        const active = step === id;
        const passed = step > id;
        return (
          <React.Fragment key={id}>
            {i > 0 && (
              <span
                aria-hidden="true"
                className={cn("mt-[18px] h-[2px] flex-1 rounded-full sm:mt-[19px]", passed ? "" : "bg-[#EDE6D3]")}
                style={passed ? { backgroundColor: GOLD } : undefined}
              />
            )}
            <li className="flex w-12 flex-none flex-col items-center gap-1.5 sm:w-14">
              <button
                type="button"
                onClick={() => onGo(id)}
                disabled={busySafe(id, step) || active}
                aria-current={active ? "step" : undefined}
                aria-label={`مرحله ${faNum(id)}: ${label}`}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-[12.5px] font-black transition-all sm:h-10 sm:w-10",
                  active && "bg-white",
                  passed && "text-white",
                  !active && !passed && "bg-[#EDE6D3] text-[#A79B7E]",
                )}
                style={
                  active
                    ? { color: INK, boxShadow: `0 0 0 2px ${GOLD_DEEP}` }
                    : passed
                      ? { backgroundColor: GOLD }
                      : undefined
                }
              >
                {passed ? <Check className="h-4 w-4" /> : active ? <Icon className="h-4 w-4" /> : faNum(id)}
              </button>
              <span
                className={cn(
                  "text-[10px] font-bold sm:text-[11px]",
                  active ? "" : passed ? "text-[#8A8271]" : "text-[#B3A88E]",
                )}
                style={active ? { color: INK } : undefined}
              >
                {label}
              </span>
            </li>
          </React.Fragment>
        );
      })}
    </ol>
  );
}

/** فقط به مراحل قبلی می‌شود برگشت */
function busySafe(id: Step, step: Step): boolean {
  return id > step;
}
