"use client";

/**
 * صفحه رزرو نوبت آنلاین (/appointment) — ویزارد ۴ مرحله‌ای روی سایت خودمان:
 * خدمت ← تاریخ و ساعت ← اطلاعات تماس ← کد تایید پیامکی
 * بدون انتقال به سامانه‌های خارجی؛ پیامک تایید و یادآوری خودکار.
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Loader2,
  MessageSquare,
  Phone,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSite } from "../content-provider";
import { trackSiteEvent } from "@/lib/track";
import { jalaliShortLabel } from "@/lib/jalali";

type Step = 1 | 2 | 3 | 4;

const STEPS: { id: Step; label: string; Icon: typeof Stethoscope }[] = [
  { id: 1, label: "خدمت", Icon: Stethoscope },
  { id: 2, label: "زمان", Icon: CalendarDays },
  { id: 3, label: "اطلاعات", Icon: User },
  { id: 4, label: "کد تایید", Icon: MessageSquare },
];

const SLOTS = ["16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"];
const DAYS_AHEAD = 14;
const fa = (n: number) => n.toLocaleString("fa-IR");

/* ---------- تاریخ‌های قابل رزرو (بدون جمعه) ---------- */
function buildDates(): string[] {
  const out: string[] = [];
  const p = (n: number) => String(n).padStart(2, "0");
  const base = new Date();
  for (let i = 0; i < DAYS_AHEAD + 4 && out.length < DAYS_AHEAD; i++) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
    if (d.getDay() === 5) continue; // جمعه
    out.push(`${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`);
  }
  return out;
}

function isPastSlot(date: string, time: string): boolean {
  return new Date(`${date}T${time}:00`).getTime() < Date.now() + 2 * 3600_000;
}

const maskPhone = (p: string) =>
  p.length === 11 ? `${p.slice(0, 4)}•••${p.slice(7)}` : p;

export function AppointmentPage() {
  const { site } = useSite();

  const [step, setStep] = React.useState<Step>(1);
  const [service, setService] = React.useState("");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [note, setNote] = React.useState("");
  const [code, setCode] = React.useState("");

  const [booked, setBooked] = React.useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = React.useState(false);

  // اسلات‌های اشغال‌شده هر تاریخ — از رویداد انتخاب کاربر (نه افکت)
  const pickDate = (d: string) => {
    setDate(d);
    setTime("");
    setSlotsLoading(true);
    fetch(`/api/appointments/slots?date=${d}`)
      .then((r) => r.json())
      .then((data: { booked?: string[] }) => setBooked(Array.isArray(data.booked) ? data.booked : []))
      .catch(() => setBooked([]))
      .finally(() => setSlotsLoading(false));
  };
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [done, setDone] = React.useState<null | { time: string; date: string }>(null);
  const [resendIn, setResendIn] = React.useState(0);

  const dates = React.useMemo(() => buildDates(), []);

  React.useEffect(() => {
    const t = setTimeout(() => trackSiteEvent("appointment_open", {}), 0);
    return () => clearTimeout(t);
  }, []);

  // شمارش معکوس ارسال مجدد کد
  React.useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const requestOtp = async () => {
    setError("");
    if (name.trim().length < 2) return setError("نام و نام خانوادگی را کامل وارد کنید");
    if (!/^(\+98|0098|0)?9\d{9}$/.test(phone.trim()))
      return setError("شماره موبایل معتبر وارد کنید (مثل ۰۹۱۲۳۴۵۶۷۸۹)");
    setBusy(true);
    try {
      const res = await fetch("/api/appointments/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, service, date, time, note }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "ارسال کد ناموفق بود");
      setStep(4);
      setResendIn(60);
      setCode("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطایی رخ داد");
    } finally {
      setBusy(false);
    }
  };

  const confirmBooking = async () => {
    setError("");
    if (!/^\d{6}$/.test(code.trim())) return setError("کد ۶ رقمی پیامک‌شده را وارد کنید");
    setBusy(true);
    try {
      const res = await fetch("/api/appointments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, service, date, time, note, code }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "ثبت نوبت ناموفق بود");
      setDone({ date, time });
      trackSiteEvent("appointment_booked", { service, source: "appointment_page" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطایی رخ داد");
    } finally {
      setBusy(false);
    }
  };

  const goStep = (s: Step) => {
    if (busy) return;
    setError("");
    if (s === 2 && !service) return;
    if (s === 3 && (!service || !date || !time)) return;
    setStep(s);
  };

  /* ─── صفحه موفقیت ─── */
  if (done) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-14 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[2rem] border border-emerald-200 bg-white p-8 text-center shadow-xl shadow-emerald-900/5"
        >
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </span>
          <h1 className="mt-5 text-2xl font-black text-stone-900">نوبت شما ثبت شد ✅</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-stone-500">
            {name} عزیز، جزئیات نوبت با پیامک برایتان ارسال شد. روز مراجعه، ۱۰ دقیقه زودتر در مطب تشریف داشته باشید.
          </p>
          <div className="mx-auto mt-6 max-w-sm space-y-2 rounded-2xl bg-stone-50 p-4 text-right">
            <Row label="خدمت" value={service} />
            <Row label="زمان" value={`${jalaliShortLabel(done.date).weekday} ${jalaliShortLabel(done.date).label} — ساعت ${fa(Number(done.time.slice(0, 2)))}:${done.time.slice(3)}`} />
            <Row label="آدرس" value="پاسداران، مرکز خرید پاسداران، طبقه ۲، واحد ۴" />
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a href="/" className="rounded-full bg-stone-900 px-6 py-3 text-sm font-black text-white transition hover:bg-stone-700">
              بازگشت به صفحه اصلی
            </a>
            <a href={`tel:${site.phoneIntl}`} dir="ltr" className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-3 text-sm font-black text-stone-700 transition hover:bg-stone-50">
              <Phone className="h-4 w-4" />
              {site.phone}
            </a>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-10 sm:pt-14">
      {/* هیرو */}
      <header className="text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-[12px] font-black text-emerald-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          رزرو روی سایت مطب — بدون سامانه واسط
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">
          رزرو نوبت آنلاین
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-stone-500">
          کمتر از یک دقیقه: خدمت، تاریخ و ساعت را انتخاب کنید؛ شماره‌تان را با یک کد پیامکی تایید کنید و نوبت‌تان ثبت می‌شود.
        </p>
      </header>

      {/* استپر */}
      <ol className="mt-8 flex items-center justify-center gap-1.5 sm:gap-3" aria-label="مراحل رزرو">
        {STEPS.map(({ id, label, Icon }, i) => {
          const active = step === id;
          const passed = step > id;
          return (
            <li key={id} className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => goStep(id)}
                disabled={busy}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-black transition-colors sm:px-4 sm:text-[13px]",
                  active && "bg-stone-900 text-white",
                  passed && "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
                  !active && !passed && "bg-stone-100 text-stone-400",
                )}
              >
                {passed ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                {label}
              </button>
              {i < STEPS.length - 1 && <ChevronLeft className="h-4 w-4 text-stone-300" />}
            </li>
          );
        })}
      </ol>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="mx-auto mt-5 max-w-xl rounded-2xl bg-rose-50 px-4 py-3 text-center text-[13px] font-bold text-rose-700"
        >
          {error}
        </motion.p>
      )}

      <div className="mt-6">
        <AnimatePresence mode="wait">
          {/* ─── گام ۱: خدمت ─── */}
          {step === 1 && (
            <motion.section
              key="s1"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 18 }}
              transition={{ duration: 0.3 }}
              aria-label="انتخاب خدمت"
            >
              <h2 className="mb-4 text-center text-sm font-black text-stone-500">
                برای چه خدمتی نوبت می‌خواهید؟
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {(site as unknown as { services?: { title: string; subtitle?: string }[] }).services?.map((s) => (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => {
                      setService(s.title);
                      setStep(2);
                    }}
                    className={cn(
                      "group rounded-3xl border p-5 text-right transition-all duration-200 hover:shadow-lg hover:shadow-stone-900/5 active:scale-[0.985]",
                      service === s.title
                        ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                        : "border-stone-200 bg-white hover:border-emerald-300",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-50">
                        <Stethoscope className="h-5 w-5 text-emerald-700" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-black text-stone-900">{s.title}</span>
                        <span className="mt-0.5 block truncate text-[11.5px] text-stone-500">{s.subtitle}</span>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </motion.section>
          )}

          {/* ─── گام ۲: تاریخ و ساعت ─── */}
          {step === 2 && (
            <motion.section
              key="s2"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 18 }}
              transition={{ duration: 0.3 }}
              aria-label="انتخاب تاریخ و ساعت"
            >
              <h2 className="mb-4 text-center text-sm font-black text-stone-500">
                روز مراجعه را انتخاب کنید <span className="font-normal">(شنبه تا پنجشنبه، ۱۶ تا ۲۰)</span>
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-2" role="listbox" aria-label="تاریخ">
                {dates.map((d) => {
                  const { weekday, label } = jalaliShortLabel(d);
                  const sel = date === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      role="option"
                      aria-selected={sel}
                      onClick={() => pickDate(d)}
                      className={cn(
                        "flex w-[88px] shrink-0 flex-col items-center rounded-2xl border px-2 py-3 transition-all",
                        sel
                          ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                          : "border-stone-200 bg-white text-stone-700 hover:border-emerald-300",
                      )}
                    >
                      <span className={cn("text-[10.5px] font-bold", sel ? "text-white/80" : "text-stone-400")}>{weekday}</span>
                      <span className="mt-1 text-[13px] font-black">{label}</span>
                    </button>
                  );
                })}
              </div>

              {date && (
                <div className="mt-5 rounded-3xl border border-stone-200 bg-white p-5">
                  <p className="mb-3 flex items-center gap-2 text-[12.5px] font-black text-stone-600">
                    <Clock3 className="h-4 w-4 text-emerald-600" />
                    ساعت مراجعه
                    {slotsLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-stone-400" />}
                  </p>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                    {SLOTS.map((t) => {
                      const taken = booked.includes(t) || isPastSlot(date, t);
                      const sel = time === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={taken || busy}
                          aria-label={`ساعت ${t}${taken ? " — پر شده" : ""}`}
                          onClick={() => setTime(t)}
                          dir="ltr"
                          className={cn(
                            "rounded-xl border py-2.5 text-[12.5px] font-black transition-all",
                            taken && "cursor-not-allowed border-stone-100 bg-stone-50 text-stone-300 line-through",
                            !taken && sel && "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/25",
                            !taken && !sel && "border-stone-200 bg-white text-stone-700 hover:border-emerald-400 hover:text-emerald-700",
                          )}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <StepNav
                onBack={() => setStep(1)}
                onNext={() => goStep(3)}
                nextDisabled={!date || !time || busy}
                nextLabel="مرحله بعد"
              />
            </motion.section>
          )}

          {/* ─── گام ۳: اطلاعات ─── */}
          {step === 3 && (
            <motion.section
              key="s3"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 18 }}
              transition={{ duration: 0.3 }}
              aria-label="اطلاعات تماس"
            >
              <div className="rounded-3xl border border-stone-200 bg-white p-6">
                <Summary service={service} date={date} time={time} />
                <div className="mt-5 space-y-4">
                  <Field label="نام و نام خانوادگی">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثلا سارا محمدی"
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                    />
                  </Field>
                  <Field label="شماره موبایل" hint="کد تایید به همین شماره پیامک می‌شود">
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09xxxxxxxxx"
                      inputMode="tel"
                      dir="ltr"
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-left text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                    />
                  </Field>
                  <Field label="توضیحات (اختیاری)">
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      maxLength={500}
                      placeholder="مثلا توضیح کوتاه درباره مشکل"
                      className="w-full resize-none rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                    />
                  </Field>
                </div>
              </div>
              <StepNav onBack={() => setStep(2)} onNext={requestOtp} nextDisabled={busy} nextLabel={busy ? "در حال ارسال…" : "دریافت کد تایید"} busy={busy} />
            </motion.section>
          )}

          {/* ─── گام ۴: کد تایید ─── */}
          {step === 4 && (
            <motion.section
              key="s4"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 18 }}
              transition={{ duration: 0.3 }}
              aria-label="کد تایید"
            >
              <div className="rounded-3xl border border-stone-200 bg-white p-6 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                  <MessageSquare className="h-7 w-7 text-emerald-600" />
                </span>
                <h2 className="mt-4 text-lg font-black text-stone-900">کد تایید را وارد کنید</h2>
                <p className="mt-1 text-[13px] leading-6 text-stone-500">
                  کد ۶ رقمی به شماره <span dir="ltr" className="font-black text-stone-700">{maskPhone(phone)}</span> پیامک شد
                </p>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="––––––"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  dir="ltr"
                  aria-label="کد ۶ رقمی تایید"
                  className="mx-auto mt-5 block w-48 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3.5 text-center text-2xl font-black tracking-[0.5em] outline-none transition focus:border-emerald-400 focus:bg-white"
                />
                <div className="mt-4 flex items-center justify-center gap-3 text-[12px] text-stone-400">
                  <span>کد نرسید؟</span>
                  {resendIn > 0 ? (
                    <span className="font-black text-stone-500">ارسال مجدد تا {fa(resendIn)} ثانیه</span>
                  ) : (
                    <button
                      type="button"
                      onClick={requestOtp}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 font-black text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                    >
                      <RefreshCw className={cn("h-3.5 w-3.5", busy && "animate-spin")} />
                      ارسال مجدد کد
                    </button>
                  )}
                </div>
                <Summary service={service} date={date} time={time} className="mt-5 text-right" />
              </div>
              <StepNav
                onBack={() => setStep(3)}
                onNext={confirmBooking}
                nextDisabled={busy || code.length !== 6}
                nextLabel={busy ? "در حال ثبت…" : "تایید و ثبت نوبت"}
                busy={busy}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* تماس جایگزین */}
      <p className="mt-10 text-center text-[12px] leading-6 text-stone-400">
        برای رزرو تلفنی هم می‌توانید تماس بگیرید:{" "}
        <a href={`tel:${site.phoneIntl}`} dir="ltr" className="font-black text-emerald-600 hover:text-emerald-700">
          {site.phone}
        </a>
        {" — "}
        شنبه تا پنجشنبه ۱۶ تا ۲۰
      </p>
    </main>
  );
}

/* ─── اجزای کوچک ─── */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex items-start justify-between gap-3 text-[13px]">
      <span className="shrink-0 font-bold text-stone-400">{label}:</span>
      <span className="text-left font-black leading-6 text-stone-700">{value}</span>
    </p>
  );
}

function Summary({ service, date, time, className }: { service: string; date: string; time: string; className?: string }) {
  const jl = date ? jalaliShortLabel(date) : null;
  return (
    <div className={cn("space-y-1.5 rounded-2xl bg-stone-50 p-4 text-[12.5px]", className)}>
      <Row label="خدمت" value={service} />
      {jl && <Row label="زمان" value={`${jl.weekday} ${jl.label} — ساعت ${time}`} />}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-black text-stone-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-stone-400">{hint}</span>}
    </label>
  );
}

function StepNav({
  onBack,
  onNext,
  nextDisabled,
  nextLabel,
  busy,
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel: string;
  busy?: boolean;
}) {
  return (
    <div className="mt-5 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onBack}
        disabled={busy}
        className="rounded-full border border-stone-200 px-5 py-2.5 text-[13px] font-black text-stone-500 transition hover:bg-stone-50 disabled:opacity-50"
      >
        مرحله قبل
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3 text-[13.5px] font-black text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {busy ? "لطفا صبر کنید" : nextLabel}
        {!busy && <CalendarCheck className="h-4 w-4" />}
      </button>
    </div>
  );
}
