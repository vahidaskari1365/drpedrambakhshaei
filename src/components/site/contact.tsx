"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Clock, Send, Loader2, CheckCircle2, Instagram, SendHorizontal, Play, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useSite } from "./content-provider";

const ease = [0.16, 1, 0.3, 1] as const;

const SERVICES_OPTIONS = [
  "مشاوره جراحی فک (ارتوسرجری)",
  "مشاوره ایمپلنت دندان",
  "مشاوره جراحی دندان نهفته",
  "جراحی زیبایی (جنیوپلاستی و ...)",
  "سایر موارد",
];

export function Contact() {
  const { site } = useSite();
  const [state, setState] = React.useState<"idle" | "loading" | "done">("idle");
  const formRef = React.useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state !== "idle") return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      service: String(fd.get("service") || ""),
      message: String(fd.get("message") || "").trim(),
    };
    if (!payload.name || !payload.phone) {
      toast.error("لطفا نام و شماره تماس را وارد کنید");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در ارسال");
      setState("done");
      toast.success("درخواست شما ثبت شد؛ به‌زودی با شما تماس می‌گیریم");
      formRef.current?.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در ارسال فرم");
      setState("idle");
    }
  }

  return (
    <section id="contact" className="relative py-20 lg:py-28" aria-label="تماس و رزرو نوبت">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          {/* اطلاعات تماس */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
            className="space-y-4"
          >
            <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-7">
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">شماره تماس مطب</p>
                    <a href={`tel:${site.phone}`} dir="ltr" className="mt-0.5 block text-lg font-black tabular-nums hover:text-primary cursor-pointer">
                      {site.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">آدرس مطب</p>
                    <p className="mt-0.5 text-sm font-bold leading-7">{site.address}</p>
                    <a
                      href={site.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      مسیریابی در گوگل مپ ←
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">ساعات کاری</p>
                    <p className="mt-0.5 text-sm font-bold">{site.hours}</p>
                  </div>
                </li>
              </ul>

              {/* شبکه‌های اجتماعی */}
              <div className="mt-7 grid grid-cols-4 gap-2 border-t border-border/60 pt-6">
                {[
                  { href: site.social.whatsapp, label: "واتسپ", Icon: MessageCircle },
                  { href: site.social.telegram, label: "تلگرام", Icon: SendHorizontal },
                  { href: site.social.instagram, label: "اینستاگرام", Icon: Instagram },
                  { href: site.social.aparat, label: "آپارات", Icon: Play },
                ].map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="group flex flex-col items-center gap-1.5 rounded-2xl border border-border/60 bg-background py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md cursor-pointer"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                    <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground">{label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* نقشه */}
            <div className="overflow-hidden rounded-3xl border border-border/60 shadow-sm">
              <iframe
                title="نقشه مطب دکتر پدرام بخشایی — پاسداران، مرکز خرید پاسداران"
                src={site.mapEmbed}
                width="100%"
                height="230"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full grayscale-[0.25]"
                allowFullScreen
              />
            </div>
          </motion.div>

          {/* فرم */}
          <motion.form
            ref={formRef}
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
            className="rounded-[2rem] border border-border/60 bg-card p-6 shadow-sm sm:p-8"
            aria-label="فرم رزرو نوبت"
          >
            {state === "done" ? (
              <div className="flex h-full min-h-[380px] flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
                >
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </motion.div>
                <h3 className="mt-5 text-xl font-black">درخواست شما ثبت شد!</h3>
                <p className="mt-2 max-w-xs text-sm leading-7 text-muted-foreground">
                  کارشناسان ما در ساعات کاری (۱۶ تا ۲۰) با شما تماس می‌گیرند. برای تسریع، می‌توانید از واتسپ هم استفاده کنید.
                </p>
                <button
                  type="button"
                  onClick={() => setState("idle")}
                  className="mt-6 rounded-full border border-border px-6 py-2.5 text-sm font-bold transition-colors hover:bg-muted cursor-pointer"
                >
                  ثبت درخواست جدید
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className="mb-2 block text-xs font-bold text-muted-foreground">
                      نام و نام خانوادگی *
                    </label>
                    <input
                      id="c-name"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="مثلا سارا محمدی"
                      className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
                    />
                  </div>
                  <div>
                    <label htmlFor="c-phone" className="mb-2 block text-xs font-bold text-muted-foreground">
                      شماره تماس *
                    </label>
                    <input
                      id="c-phone"
                      name="phone"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      dir="ltr"
                      placeholder="09xxxxxxxxx"
                      className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-left text-sm font-medium tabular-nums outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="c-service" className="mb-2 block text-xs font-bold text-muted-foreground">
                    موضوع مشاوره
                  </label>
                  <select
                    id="c-service"
                    name="service"
                    className="h-12 w-full appearance-none rounded-2xl border border-border bg-background px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15 cursor-pointer"
                  >
                    {SERVICES_OPTIONS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="c-msg" className="mb-2 block text-xs font-bold text-muted-foreground">
                    توضیحات
                  </label>
                  <textarea
                    id="c-msg"
                    name="message"
                    rows={4}
                    placeholder="شرح کوتاهی از مشکل یا سوال خود بنویسید..."
                    className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium leading-7 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
                  />
                </div>
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="group flex h-13 w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-black text-primary-foreground shadow-[0_16px_40px_-14px] shadow-primary/60 transition-all duration-300 hover:brightness-110 active:scale-[0.98] disabled:opacity-70 cursor-pointer"
                >
                  {state === "loading" ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <Send className="h-4.5 w-4.5 transition-transform group-hover:-translate-x-1" />
                  )}
                  {state === "loading" ? "در حال ارسال..." : "ارسال درخواست مشاوره"}
                </button>
                <p className="text-center text-[11px] leading-5 text-muted-foreground">
                  با ارسال این فرم، اجازه تماس تلفنی در ساعات کاری را می‌دهید.
                </p>
              </div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
