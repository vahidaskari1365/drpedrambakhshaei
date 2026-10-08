"use client";

/**
 * تب «محتوای سایت» — ویرایش ساختاریافته همه مجموعه‌ها با فرم عمومی
 * هر ذخیره در دیتابیس بازنویسی می‌شود و بلافاصله روی سایت زنده اعمال می‌گردد.
 */
import * as React from "react";
import { Save, RotateCcw, CheckCircle2, Loader2, Database, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CONTENT_KEYS, CONTENT_LABELS, type ContentKey, type SiteContent } from "@/lib/site-content";
import type { BlogArticle } from "@/lib/blog-data";
import { api, faNum, faTimeAgo } from "./shared";
import { FieldsEditor, ObjListField, type FieldDef } from "./fields";

/* ─────────── طرح فیلدهای هر مجموعه ─────────── */

const F = {
  text: (k: string, label: string): FieldDef => ({ k, label, type: "text" }),
  textarea: (k: string, label: string): FieldDef => ({ k, label, type: "textarea" }),
  number: (k: string, label: string): FieldDef => ({ k, label, type: "number" }),
  image: (k: string, label: string): FieldDef => ({ k, label, type: "image" }),
  url: (k: string, label: string): FieldDef => ({ k, label, type: "url" }),
  list: (k: string, label: string, itemLabel?: string): FieldDef => ({ k, label, type: "list", itemLabel }),
  kvlist: (k: string, label: string): FieldDef => ({ k, label, type: "kvlist" }),
  json: (k: string, label: string): FieldDef => ({ k, label, type: "json" }),
};

const SCHEMAS: Partial<Record<ContentKey, { kind: "list" | "object" | "stringlist" | "string"; fields?: FieldDef[]; titleKey?: string }>> = {
  site: {
    kind: "object",
    fields: [
      F.text("name", "نام دکتر"), F.text("role", "عنوان تخصص"),
      F.text("tagline", "شعار سایت"), F.text("phone", "تلفن نمایشی"),
      F.text("phoneIntl", "تلفن بین‌المللی"), F.text("hours", "ساعات کاری"),
      F.text("address", "آدرس کامل"), F.text("shortAddress", "آدرس کوتاه"),
      F.url("mapsUrl", "لینک گوگل مپ"), F.url("reviewsUrl", "لینک نظرات گوگل"),
      F.url("mapEmbed", "لینک embed نقشه"), F.text("rating.score", "امتیاز گوگل"),
      F.number("rating.count", "تعداد نظرات گوگل"),
      F.url("social.instagram", "اینستاگرام"), F.url("social.telegram", "تلگرام"),
      F.url("social.whatsapp", "واتسپ"), F.url("social.aparat", "آپارات"),
    ],
  },
  stats: {
    kind: "list",
    titleKey: "label",
    fields: [F.number("value", "عدد"), F.text("suffix", "پسوند"), F.text("label", "برچسب")],
  },
  skills: { kind: "list", titleKey: "label", fields: [F.text("label", "مهارت"), F.number("value", "درصد")] },
  credentials: { kind: "stringlist" },
  aboutBio: { kind: "stringlist" },
  aboutApproach: { kind: "string" },
  whyUs: {
    kind: "object",
    fields: [F.text("title", "عنوان"), F.textarea("text", "متن"), F.list("points", "دلایل", "دلیل")],
  },
  costFactors: {
    kind: "list",
    titleKey: "title",
    fields: [
      F.text("id", "شناسه"), F.text("title", "عنوان"),
      {
        k: "factors", label: "عوامل", type: "objlist", titleKey: "title",
        fields: [F.text("title", "عنوان عامل"), F.textarea("desc", "توضیح")],
      },
    ],
  },
  services: {
    kind: "list",
    titleKey: "title",
    fields: [
      F.text("id", "شناسه (انگلیسی)"), F.image("image", "تصویر خدمت"),
      F.text("title", "عنوان"), F.text("subtitle", "زیرعنوان"),
      F.textarea("desc", "توضیح کوتاه"), F.textarea("longDesc", "توضیح کامل"),
      F.list("items", "اقلام خدمت", "قلم"),
      F.kvlist("stats", "آمار شناور (برچسب/مقدار)"),
    ],
  },
  implantBrands: {
    kind: "list",
    titleKey: "name",
    fields: [F.text("name", "نام برند"), F.text("country", "کشور"), F.text("minPrice", "حداقل قیمت"), F.text("life", "طول عمر")],
  },
  priceTabs: {
    kind: "list",
    titleKey: "label",
    fields: [
      F.text("id", "شناسه"), F.text("label", "عنوان تب"),
      F.textarea("note", "یادداشت زیر جدول"),
      {
        k: "rows", label: "ردیف‌های قیمت", type: "objlist", titleKey: "item",
        fields: [F.text("item", "خدمت"), F.text("extra", "جزئیات"), F.text("price", "قیمت")],
      },
      {
        k: "extras", label: "هزینه‌های تکمیلی", type: "objlist", titleKey: "item",
        fields: [F.text("item", "خدمت"), F.text("price", "قیمت")],
      },
    ],
  },
  faq: { kind: "list", titleKey: "q", fields: [F.text("q", "سوال"), F.textarea("a", "پاسخ"), F.text("group", "گروه")] },
  priceFaqs: { kind: "list", titleKey: "q", fields: [F.text("q", "سوال"), F.textarea("a", "پاسخ"), F.text("group", "گروه")] },
  reviews: {
    kind: "list",
    titleKey: "author",
    fields: [
      F.text("author", "نام"), F.text("meta", "توضیح کوتاه"),
      F.text("time", "زمان"), F.number("stars", "ستاره (۱ تا ۵)"),
      F.text("source", "منبع"), F.textarea("text", "متن نظر"),
    ],
  },
  gallery: { kind: "list", titleKey: "title", fields: [F.text("title", "عنوان"), F.image("image", "تصویر")] },
  works: { kind: "list", titleKey: "title", fields: [F.text("title", "عنوان"), F.image("image", "تصویر")] },
  beforeAfter: {
    kind: "object",
    fields: [
      F.text("kicker", "برچسب بالا"), F.text("title", "عنوان"),
      F.textarea("desc", "توضیح"), F.image("before", "تصویر قبل"),
      F.image("after", "تصویر بعد"), F.text("beforeLabel", "برچسب قبل"),
      F.text("afterLabel", "برچسب بعد"),
    ],
  },
  caseSlides: {
    kind: "list",
    titleKey: "title",
    fields: [F.text("title", "عنوان"), F.text("subtitle", "زیرعنوان"), F.image("image", "تصویر"), F.text("tag", "برچسب")],
  },
  nav: {
    kind: "list",
    titleKey: "label",
    fields: [F.text("label", "برچسب"), F.url("href", "مسیر")],
  },
};

/* ─────────── تب محتوا ─────────── */

export function ContentTab({
  content,
  overrides,
  onSaved,
  toast,
}: {
  content: SiteContent;
  overrides: { key: string; updatedAt: string }[];
  onSaved: (c: SiteContent) => void;
  toast: (msg: string, kind?: "ok" | "err") => void;
}) {
  const editableKeys = CONTENT_KEYS.filter((k) => k !== "blog");
  const [activeKey, setActiveKey] = React.useState<ContentKey>("services");
  const [draft, setDraft] = React.useState<unknown>(content[activeKey]);
  const [dirty, setDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);

  React.useEffect(() => {
    setDraft(content[activeKey]);
    setDirty(false);
  }, [activeKey, content]);

  const overrideMap = new Map(overrides.map((o) => [o.key, o.updatedAt]));

  const save = async () => {
    setSaving(true);
    try {
      const res = await api<{ content: SiteContent; label: string }>("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({ key: activeKey, data: draft, summary: `ویرایش «${CONTENT_LABELS[activeKey]}» از پنل` }),
      });
      onSaved(res.content);
      setDirty(false);
      toast(`«${CONTENT_LABELS[activeKey]}» ذخیره شد و روی سایت اعمال شد`, "ok");
    } catch (e) {
      toast(e instanceof Error ? e.message : "ذخیره ناموفق بود", "err");
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!window.confirm(`«${CONTENT_LABELS[activeKey]}» به پیش‌فرض کد بازگردد؟ ویرایش‌های قبلی پاک می‌شود.`)) return;
    setResetting(true);
    try {
      const res = await api<{ content: SiteContent; label: string }>(`/api/admin/content?key=${activeKey}`, { method: "DELETE" });
      onSaved(res.content);
      setDirty(false);
      toast(`«${CONTENT_LABELS[activeKey]}» به پیش‌فرض بازگشت`, "ok");
    } catch (e) {
      toast(e instanceof Error ? e.message : "بازنشانی ناموفق بود", "err");
    } finally {
      setResetting(false);
    }
  };

  const schema = SCHEMAS[activeKey];
  const isOverridden = overrideMap.has(activeKey);

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
      {/* فهرست مجموعه‌ها */}
      <aside className="lg:sticky lg:top-4 lg:self-start">
        <p className="mb-3 px-1 text-[11px] font-black tracking-widest text-white/40">مجموعه‌های محتوا</p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-slim lg:flex-col lg:overflow-visible lg:pb-0">
          {editableKeys.map((key) => {
            const count = Array.isArray(content[key]) ? (content[key] as unknown[]).length : undefined;
            const active = key === activeKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveKey(key)}
                className={cn(
                  "group flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[12.5px] font-bold transition-all lg:w-full cursor-pointer",
                  active ? "bg-gradient-to-l from-teal-300/20 to-transparent text-teal-100 shadow-[inset_0_0_0_1px] shadow-teal-300/25" : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                {overrideMap.has(key) ? (
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold" aria-label="ویرایش‌شده" />
                ) : (
                  <Database className="h-3.5 w-3.5 shrink-0 opacity-40" />
                )}
                <span className="flex-1 text-right whitespace-nowrap">{CONTENT_LABELS[key]}</span>
                {count !== undefined && (
                  <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] tabular-nums", active ? "bg-teal-300/20 text-teal-100" : "bg-white/8 text-white/45")}>
                    {faNum(count)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* ویرایشگر */}
      <section className="min-w-0">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <div>
            <h2 className="text-[15px] font-black text-white">{CONTENT_LABELS[activeKey]}</h2>
            <p className="mt-0.5 text-[11px] text-white/45">
              {isOverridden ? `سفارشی‌شده — ${faTimeAgo(overrideMap.get(activeKey)!)}` : "مطابق پیش‌فرض کد"}
              {dirty && <span className="mr-2 font-bold text-gold">— ذخیره‌نشده</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={reset}
              disabled={resetting || saving}
              className="flex items-center gap-1.5 rounded-xl border border-white/15 px-3.5 py-2 text-[12px] font-bold text-white/65 transition-colors hover:bg-white/8 hover:text-white disabled:opacity-40 cursor-pointer"
            >
              {resetting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
              بازنشانی
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!dirty || saving}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-l from-teal-400 to-teal-300 px-4 py-2 text-[12.5px] font-black text-[oklch(0.2_0.03_205)] shadow-lg shadow-teal-400/25 transition-all hover:brightness-110 disabled:opacity-40 disabled:shadow-none cursor-pointer"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              ذخیره و اعمال روی سایت
            </button>
          </div>
        </header>

        <motion.div
          key={activeKey}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
        >
          {!schema && <p className="text-sm text-white/50">این مجموعه در تب «مقالات» ویرایش می‌شود.</p>}

          {schema?.kind === "string" && (
            <textarea
              value={String(draft ?? "")}
              rows={5}
              onChange={(e) => { setDraft(e.target.value); setDirty(true); }}
              className="w-full resize-y rounded-xl border border-white/12 bg-white/[0.06] px-3.5 py-3 text-[13px] leading-8 text-white outline-none focus:border-teal-300/50"
            />
          )}

          {schema?.kind === "stringlist" && (
            <div className="space-y-2">
              {(draft as string[]).map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/8 text-[10px] font-black text-white/50">{faNum(i + 1)}</span>
                  <textarea
                    value={item}
                    rows={2}
                    onChange={(e) => { setDraft((draft as string[]).map((x, j) => (j === i ? e.target.value : x))); setDirty(true); }}
                    className="w-full resize-y rounded-xl border border-white/12 bg-white/[0.06] px-3.5 py-2.5 text-[13px] leading-7 text-white outline-none focus:border-teal-300/50"
                  />
                  <button
                    type="button"
                    onClick={() => { setDraft((draft as string[]).filter((_, j) => j !== i)); setDirty(true); }}
                    aria-label="حذف"
                    className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/35 hover:bg-red-400/15 hover:text-red-300 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => { setDraft([...(draft as string[]), ""]); setDirty(true); }}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/20 py-2.5 text-[12px] font-bold text-white/50 hover:border-teal-300/40 hover:text-teal-200 cursor-pointer"
              >
                + افزودن پاراگراف
              </button>
            </div>
          )}

          {schema?.kind === "object" && schema.fields && (
            <FieldsEditor
              value={(draft ?? {}) as Record<string, unknown>}
              fields={schema.fields}
              onChange={(v) => { setDraft(v); setDirty(true); }}
            />
          )}

          {schema?.kind === "list" && schema.fields && (
            <ObjListField
              items={(draft ?? []) as Record<string, unknown>[]}
              fields={schema.fields}
              titleKey={schema.titleKey}
              onChange={(v) => { setDraft(v); setDirty(true); }}
              label="آیتم جدید"
            />
          )}
        </motion.div>

        <p className="mt-3 flex items-center gap-1.5 px-1 text-[11px] text-white/35">
          <CheckCircle2 className="h-3.5 w-3.5 text-teal-300/60" />
          بعد از ذخیره، صفحات سایت در بازدید بعدی (SSR) با محتوای جدید رندر می‌شوند.
        </p>
      </section>
    </div>
  );
}
