"use client";

/**
 * تب «مقالات بلاگ» — ویرایش ساختاریافته متادیتا + JSON امن برای بلاک‌ها
 * مقاله جدید از همین‌جا منتشر می‌شود و مسیر /blog/<slug> بلافاصله فعال است.
 */
import * as React from "react";
import Image from "next/image";
import { Save, RotateCcw, Loader2, Plus, FileText, ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { BlogArticle } from "@/lib/blog-data";
import type { SiteContent } from "@/lib/site-content";
import { api, faNum } from "./shared";
import { FieldsEditor, JsonInput } from "./fields";

const META_FIELDS = [
  { k: "metaTitle", label: "عنوان سئو (Title)", type: "text" as const },
  { k: "h1", label: "تیتر اصلی مقاله (H1)", type: "text" as const },
  { k: "kicker", label: "برچسب بالای تیتر", type: "text" as const },
  { k: "category", label: "دسته", type: "text" as const },
  { k: "publishDateFa", label: "تاریخ انتشار (فارسی)", type: "text" as const },
  { k: "publishDate", label: "تاریخ انتشار (ISO)", type: "text" as const },
  { k: "readingMinutes", label: "زمان مطالعه (دقیقه)", type: "number" as const },
  { k: "wordCount", label: "تعداد کلمات", type: "number" as const },
  { k: "cover", label: "تصویر کاور", type: "image" as const },
];

export function BlogTab({
  content,
  onSaved,
  toast,
}: {
  content: SiteContent;
  onSaved: (c: SiteContent) => void;
  toast: (msg: string, kind?: "ok" | "err") => void;
}) {
  const [blog, setBlog] = React.useState<BlogArticle[]>(content.blog);
  const [idx, setIdx] = React.useState(0);
  const [dirty, setDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setBlog(content.blog);
    setDirty(false);
  }, [content]);

  const article = blog[Math.min(idx, blog.length - 1)];

  const patch = (updater: (a: BlogArticle) => BlogArticle) => {
    setBlog((prev) => prev.map((a, i) => (i === idx ? updater(a) : a)));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await api<{ content: SiteContent }>("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({ key: "blog", data: blog, summary: `بلاگ ذخیره شد (${blog.length} مقاله)` }),
      });
      onSaved(res.content);
      setDirty(false);
      toast("بلاگ ذخیره شد و مقاله‌ها روی سایت اعمال شدند", "ok");
    } catch (e) {
      toast(e instanceof Error ? e.message : "ذخیره ناموفق بود", "err");
    } finally {
      setSaving(false);
    }
  };

  const addArticle = () => {
    const slugBase = "new-article";
    let slug = slugBase;
    let n = 2;
    while (blog.some((a) => a.slug === slug)) slug = `${slugBase}-${n++}`;
    const fresh: BlogArticle = {
      slug,
      metaTitle: "عنوان مقاله جدید — راهنمای تخصصی",
      metaDesc: "توضیح متای مقاله — بین ۸۰ تا ۲۰۰ کاراکتر که خلاصه مقاله را برای نتایج جستجو توضیح می‌دهد.",
      keywords: ["کلیدواژه اول", "کلیدواژه دوم", "کلیدواژه سوم", "کلیدواژه چهارم", "کلیدواژه پنجم"],
      h1: "عنوان اصلی مقاله جدید",
      kicker: "بلاگ تخصصی",
      excerpt: "خلاصه جذاب مقاله برای کارت‌ها و پیش‌نمایش.",
      category: "جراحی فک و صورت",
      tags: ["برچسب ۱", "برچسب ۲"],
      cover: "/uploads/clinic-photo-3.jpg",
      coverAlt: "توضیح تصویر کاور",
      readingMinutes: 5,
      wordCount: 800,
      publishDate: new Date().toISOString().slice(0, 10),
      publishDateFa: new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date()),
      author: {
        name: "دکتر پدرام بخشایی",
        role: "متخصص جراحی دهان، فک و صورت — رتبه ۲ بورد تخصصی کشور",
        avatar: "/uploads/doctor-portrait.jpg",
      },
      quickAnswers: [{ q: "پرسش سریع؟", a: "پاسخ کوتاه و مستقیم برای AEO." }],
      faqs: [{ q: "سوال متداول؟", a: "پاسخ کامل." }],
      blocks: [
        { type: "p", text: "پاراگراف اول مقاله..." },
        { type: "h2", id: "section-1", text: "بخش اول" },
        { type: "p", text: "متن بخش اول..." },
        { type: "cta" },
      ],
    };
    setBlog([fresh, ...blog]);
    setIdx(0);
    setDirty(true);
    toast("پیش‌نویس مقاله جدید ساخته شد — پس از تکمیل، ذخیره کنید", "ok");
  };

  if (!article) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
        <FileText className="mx-auto mb-3 h-8 w-8 text-white/25" />
        <p className="text-sm text-white/60">هنوز مقاله‌ای وجود ندارد.</p>
        <button type="button" onClick={addArticle} className="mt-4 rounded-xl bg-teal-300 px-4 py-2 text-[12.5px] font-black text-[oklch(0.2_0.03_205)] cursor-pointer">
          ساخت اولین مقاله
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      {/* فهرست مقالات */}
      <aside className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-140px)] lg:self-start lg:overflow-y-auto scrollbar-slim">
        <button
          type="button"
          onClick={addArticle}
          className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-teal-300/30 py-2.5 text-[12px] font-black text-teal-200 transition-colors hover:bg-teal-300/10 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          مقاله جدید
        </button>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-slim lg:flex-col lg:overflow-visible">
          {blog.map((a, i) => (
            <button
              key={a.slug}
              type="button"
              onClick={() => setIdx(i)}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-2xl border p-2.5 text-right transition-all lg:w-full cursor-pointer",
                i === idx ? "border-teal-300/30 bg-teal-300/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
              )}
            >
              <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl">
                <Image src={a.cover} alt="" fill sizes="64px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1 block text-[12px] font-bold text-white/85">{a.h1}</span>
                <span className="mt-0.5 block text-[10px] text-white/40">
                  {faNum(a.wordCount)} کلمه · {faNum(a.keywords.length)} کلیدواژه
                </span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* ویرایشگر مقاله */}
      <section className="min-w-0">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <div>
            <h2 className="flex items-center gap-2 text-[15px] font-black text-white">
              <Sparkles className="h-4 w-4 text-gold" />
              ویرایش مقاله
            </h2>
            <p className="mt-0.5 text-[11px] text-white/45" dir="ltr">
              /blog/{article.slug}
              {dirty && <span className="mr-2 font-bold text-gold" dir="rtl">— ذخیره‌نشده</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/blog/${article.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-white/15 px-3.5 py-2 text-[12px] font-bold text-white/65 hover:bg-white/8 hover:text-white cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              بازدید
            </a>
            <button
              type="button"
              onClick={save}
              disabled={!dirty || saving}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-l from-teal-400 to-teal-300 px-4 py-2 text-[12.5px] font-black text-[oklch(0.2_0.03_205)] shadow-lg shadow-teal-400/25 transition-all hover:brightness-110 disabled:opacity-40 disabled:shadow-none cursor-pointer"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              ذخیره و انتشار
            </button>
          </div>
        </header>

        <motion.div
          key={article.slug}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {/* متادیتا */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <h3 className="mb-4 text-[12px] font-black tracking-widest text-white/40">سئو و متادیتا</h3>
            <FieldsEditor
              value={article as unknown as Record<string, unknown>}
              fields={[
                ...META_FIELDS.map((f) =>
                  f.type === "number"
                    ? ({ k: f.k, label: f.label, type: "number" } as const)
                    : f.type === "image"
                      ? ({ k: f.k, label: f.label, type: "image" } as const)
                      : ({ k: f.k, label: f.label, type: "text" } as const)
                ),
                { k: "keywords", label: "کلیدواژه‌های هدف", type: "list" as const, itemLabel: "کلیدواژه" },
                { k: "tags", label: "برچسب‌ها", type: "list" as const, itemLabel: "برچسب" },
                {
                  k: "quickAnswers", label: "پاسخ‌های سریع AEO", type: "objlist" as const, titleKey: "q",
                  fields: [
                    { k: "q", label: "پرسش", type: "text" as const },
                    { k: "a", label: "پاسخ مستقیم", type: "textarea" as const },
                  ],
                },
                {
                  k: "faqs", label: "سوالات متداول مقاله", type: "objlist" as const, titleKey: "q",
                  fields: [
                    { k: "q", label: "سوال", type: "text" as const },
                    { k: "a", label: "پاسخ", type: "textarea" as const },
                  ],
                },
                { k: "excerpt", label: "خلاصه (کارت‌ها)", type: "textarea" as const },
                { k: "metaDesc", label: "توضیح متا (Description)", type: "textarea" as const },
              ]}
              onChange={(v) => patch((a) => v as unknown as BlogArticle)}
            />
          </div>

          {/* بدنه مقاله */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <h3 className="mb-1 text-[12px] font-black tracking-widest text-white/40">بدنه مقاله (بلاک‌های ساختاریافته)</h3>
            <p className="mb-3 text-[11px] text-white/35">
              بلاک‌ها: h2، h3، p، list، table، callout، image، quickAnswers، faq، links و cta
            </p>
            <JsonInput
              value={article.blocks}
              label={dirty ? "JSON بلاک‌ها (ویرایش‌شده)" : "JSON بلاک‌ها"}
              onChange={(v) => patch((a) => ({ ...a, blocks: v as BlogArticle["blocks"] }))}
            />
          </div>
        </motion.div>

        <p className="mt-3 flex items-center gap-1.5 px-1 text-[11px] text-white/35">
          <RotateCcw className="h-3 w-3" />
          مسیر مقاله از slug ساخته می‌شود؛ بعد از تغییر slug و ذخیره، مسیر جدید فعال و مسیر قبلی ۴۰۴ می‌شود.
        </p>
      </section>
    </div>
  );
}
