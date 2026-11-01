"use client";

/**
 * تب «پیامک» در پنل ادمین — تنظیمات سامانه SMS.ir
 * کلید API فقط در دیتابیس سرور ذخیره می‌شود (هرگز در گیت/باندل)؛
 * شماره مدیرها (چند شماره با کاما)، شناسه قالب کد ورود، خط ارسال و فعال/غیرفعال + ارسال تست.
 */
import * as React from "react";
import {
  KeyRound,
  Loader2,
  MessageSquare,
  Save,
  SendHorizonal,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "./shared";

type Settings = {
  configured: boolean;
  apiKeyMasked: string;
  adminMobiles: string;
  templateId: string;
  senderLine: string;
  enabled: boolean;
};

export function SmsTab({
  toast,
}: {
  toast: (msg: string, kind?: "ok" | "err") => void;
}) {
  const [s, setS] = React.useState<Settings | null>(null);
  const [apiKey, setApiKey] = React.useState("");
  const [adminMobiles, setAdminMobiles] = React.useState("");
  const [templateId, setTemplateId] = React.useState("");
  const [senderLine, setSenderLine] = React.useState("");
  const [enabled, setEnabled] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [testMobile, setTestMobile] = React.useState("");
  const [testing, setTesting] = React.useState(false);

  React.useEffect(() => {
    api<Settings>("/api/admin/sms-settings")
      .then((d) => {
        setS(d);
        setAdminMobiles(d.adminMobiles);
        setTemplateId(d.templateId);
        setSenderLine(d.senderLine);
        setEnabled(d.enabled);
      })
      .catch((e) => toast(e instanceof Error ? e.message : "خطا در دریافت تنظیمات", "err"));
  }, [toast]);

  const save = async () => {
    setSaving(true);
    try {
      await api("/api/admin/sms-settings", {
        method: "PUT",
        body: JSON.stringify({
          apiKey: apiKey.trim() || undefined,
          adminMobiles,
          templateId,
          senderLine,
          enabled,
        }),
      });
      setApiKey("");
      toast("تنظیمات پیامک ذخیره شد", "ok");
      const d = await api<Settings>("/api/admin/sms-settings");
      setS(d);
    } catch (e) {
      toast(e instanceof Error ? e.message : "خطا در ذخیره", "err");
    } finally {
      setSaving(false);
    }
  };

  const sendTest = async () => {
    setTesting(true);
    try {
      await api("/api/admin/sms-settings/test", {
        method: "POST",
        body: JSON.stringify({ mobile: testMobile }),
      });
      toast("پیامک تست ارسال شد ✅", "ok");
    } catch (e) {
      toast(e instanceof Error ? e.message : "ارسال تست ناموفق", "err");
    } finally {
      setTesting(false);
    }
  };

  if (!s) {
    return (
      <p className="flex items-center justify-center gap-2 py-16 text-sm text-white/50">
        <Loader2 className="h-4 w-4 animate-spin" />
        در حال بارگذاری…
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-black text-white">
          <MessageSquare className="h-5 w-5 text-emerald-300" />
          سامانه پیامک (SMS.ir)
        </h2>
        <p className="mt-1.5 text-[12.5px] leading-6 text-white/45">
          پیامک کد ورود، تایید نوبت به بیمار و اطلاع نوبت جدید به مدیرها از این سامانه ارسال می‌شود.
          کلید API فقط روی دیتابیس سرور ذخیره می‌شود و در هیچ فایل یا مخزنی قرار نمی‌گیرد.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* کلید */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <label className="mb-1.5 flex items-center gap-2 text-[12.5px] font-black text-white">
            <KeyRound className="h-4 w-4 text-emerald-300" />
            کلید وب‌سرویس (x-api-key)
          </label>
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={s.configured ? `ذخیره شده: ${s.apiKeyMasked} — برای تغییر کلید جدید بگذارید` : "کلید پنل SMS.ir را اینجا بچسبانید"}
            dir="ltr"
            type="password"
            autoComplete="off"
            className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-left text-[13px] text-white placeholder:text-white/25 outline-none transition focus:border-emerald-400/60"
          />
          <p className={cn("mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold", s.configured ? "text-emerald-300" : "text-amber-300")}>
            <ShieldCheck className="h-3.5 w-3.5" />
            {s.configured ? "کلید تنظیم شده است" : "هنوز کلیدی ذخیره نشده — نوبت‌دهی پیامکی غیرفعال است"}
          </p>
        </div>

        {/* مدیرها */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <label className="mb-1.5 flex items-center gap-2 text-[12.5px] font-black text-white">
            <Smartphone className="h-4 w-4 text-emerald-300" />
            شماره مدیرها (با کاما جدا کنید)
          </label>
          <input
            value={adminMobiles}
            onChange={(e) => setAdminMobiles(e.target.value)}
            placeholder="09302626021, 09xxxxxxxxx"
            dir="ltr"
            className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-left text-[13px] text-white placeholder:text-white/25 outline-none transition focus:border-emerald-400/60"
          />
          <p className="mt-2 text-[11px] text-white/40">
            با هر نوبت جدید، پیامک اطلاع‌رسانی به همه این شماره‌ها می‌رود.
          </p>
        </div>

        {/* قالب */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <label className="mb-1.5 block text-[12.5px] font-black text-white">شناسه قالب کد ورود (Template ID)</label>
          <input
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value.replace(/\D/g, ""))}
            dir="ltr"
            className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-left text-[13px] text-white outline-none transition focus:border-emerald-400/60"
          />
          <p className="mt-2 text-[11px] text-white/40">قالب تاییدشده «کد ورود نوبت‌دهی» — پیش‌فرض: ۱۳۸۶۹۳</p>
        </div>

        {/* خط */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <label className="mb-1.5 block text-[12.5px] font-black text-white">خط ارسال خدماتی</label>
          <input
            value={senderLine}
            onChange={(e) => setSenderLine(e.target.value.replace(/\D/g, ""))}
            dir="ltr"
            className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-left text-[13px] text-white outline-none transition focus:border-emerald-400/60"
          />
          <p className="mt-2 text-[11px] text-white/40">خط خدماتی پنل — پیش‌فرض: ۵۰۰۰۳۹۲۳۵۰۸۴۴۷۹</p>
        </div>
      </div>

      {/* فعال/غیرفعال + ذخیره */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setEnabled((v) => !v)}
          aria-pressed={enabled}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[12.5px] font-black transition",
            enabled ? "bg-emerald-300 text-[oklch(0.2_0.03_262)]" : "border border-white/20 text-white/60",
          )}
        >
          <span className={cn("h-2.5 w-2.5 rounded-full", enabled ? "bg-emerald-700" : "bg-white/30")} />
          {enabled ? "سامانه پیامک فعال است" : "سامانه پیامک غیرفعال است"}
        </button>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-[13px] font-black text-stone-900 transition hover:bg-white/85 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          ذخیره تنظیمات
        </button>
      </div>

      {/* تست */}
      <div className="rounded-3xl border border-dashed border-white/15 p-5">
        <p className="mb-3 text-[12.5px] font-black text-white/70">ارسال پیامک تست</p>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={testMobile}
            onChange={(e) => setTestMobile(e.target.value)}
            placeholder="09xxxxxxxxx"
            dir="ltr"
            className="w-44 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-left text-[13px] text-white placeholder:text-white/25 outline-none transition focus:border-emerald-400/60"
          />
          <button
            type="button"
            onClick={sendTest}
            disabled={testing || !testMobile}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 px-5 py-2.5 text-[12.5px] font-black text-emerald-200 transition hover:bg-emerald-300/10 disabled:opacity-50"
          >
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
            ارسال تست
          </button>
          <span className="text-[11px] text-white/35">پس از ذخیره کلید، یک بار تست بگیرید تا مطمئن شوید.</span>
        </div>
      </div>
    </div>
  );
}
