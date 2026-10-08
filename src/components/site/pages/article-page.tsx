"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock3,
  CalendarDays,
  ListTree,
  ArrowLeft,
  Phone,
  Plus,
  Info,
  AlertTriangle,
  Lightbulb,
  UserRoundCheck,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ArticleBlock, BlogArticle } from "@/lib/blog-data";
import { useSite } from "../content-provider";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

/* ---------- زیر‌بخش‌ها ---------- */

function QuickAnswers({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div id="quick-answers" className="my-8 rounded-[1.75rem] border border-primary/20 bg-primary/5 p-5 lg:p-7" aria-label="پاسخ‌های سریع">
      <p className="mb-4 flex items-center gap-2 text-sm font-black text-primary">
        <ListTree className="h-4.5 w-4.5" />
        پاسخ سریع — خلاصه مقاله در ۵ نکته
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <motion.div
            key={item.q}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease, delay: i * 0.05 }}
            className="rounded-2xl bg-background/80 p-4 shadow-sm"
          >
            <p className="text-[13.5px] font-extrabold leading-6">{item.q}</p>
            <p className="mt-1.5 text-[12.5px] leading-6 text-muted-foreground">{item.a}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const CALLOUT_STYLES = {
  info: { icon: Info, wrap: "border-primary/25 bg-primary/5", head: "text-primary" },
  warn: { icon: AlertTriangle, wrap: "border-amber-500/30 bg-amber-500/8", head: "text-amber-600 dark:text-amber-400" },
  tip: { icon: Lightbulb, wrap: "border-teal-500/30 bg-teal-500/8", head: "text-teal-600 dark:text-teal-400" },
} as const;

function Callout({ block }: { block: Extract<ArticleBlock, { type: "callout" }> }) {
  const s = CALLOUT_STYLES[block.tone];
  return (
    <aside className={cn("my-7 flex gap-3.5 rounded-2xl border p-5", s.wrap)} role="note">
      <s.icon className={cn("mt-0.5 h-5 w-5 shrink-0", s.head)} />
      <div>
        <p className={cn("text-[14px] font-extrabold", s.head)}>{block.title}</p>
        <p className="mt-1 text-[13.5px] leading-7 text-muted-foreground">{block.text}</p>
      </div>
    </aside>
  );
}

function FaqSection({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = React.useState(0);
  return (
    <div className="my-7 space-y-3">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="overflow-hidden rounded-2xl border border-border/60 bg-card">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right cursor-pointer"
            >
              <span className="text-[14px] font-extrabold leading-7">{f.q}</span>
              <span
                className={cn(
                  "flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full border border-border/70 transition-all duration-300",
                  isOpen && "rotate-45 border-primary/40 bg-primary/10"
                )}
              >
                <Plus className={cn("h-4 w-4", isOpen ? "text-primary" : "text-muted-foreground")} />
              </span>
            </button>
            <motion.div
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.35, ease }}
              className="overflow-hidden"
            >
              <p className="px-5 pb-5 text-[13.5px] leading-7.5 text-muted-foreground">{f.a}</p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

function CtaBox() {
  const { site } = useSite();
  return (
    <div className="my-9 overflow-hidden rounded-[1.75rem] bg-petrol-deep p-7 text-center shadow-lg lg:p-9 grain relative">
      <div className="aurora" />
      <div className="relative">
        <h2 className="text-xl font-black text-background lg:text-2xl">
          بررسی کنید که کاندید جراحی فک هستید یا نه
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-7 text-background/70">
          در یک جلسه مشاوره حضوری، آنالیز تخصصی صورت و فک انجام می‌شود و مسیر دقیق درمان شما
          شفاف می‌شود — بدون عجله، بدون اغراق.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`tel:${site.phone}`}
            dir="ltr"
            className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-bold text-[oklch(0.17_0.025_205)] transition-transform duration-300 hover:scale-[1.04] active:scale-95 cursor-pointer"
          >
            <Phone className="h-4 w-4" />
            {site.phone}
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-background/25 bg-background/10 px-6 py-3 text-sm font-bold text-background backdrop-blur transition-colors hover:bg-background/20 cursor-pointer"
          >
            رزرو مشاوره
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function AuthorBox({ article }: { article: BlogArticle }) {
  return (
    <aside className="my-9 flex flex-col gap-4 rounded-[1.75rem] border border-border/60 bg-card p-5 shadow-sm sm:flex-row sm:items-center" aria-label="درباره نویسنده">
      <Image
        src={article.author.avatar}
        alt={`دکتر پدرام بخشایی — نویسنده مقاله`}
        width={84}
        height={84}
        className="h-21 w-21 rounded-2xl object-cover"
      />
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-[11.5px] font-bold text-primary">
          <UserRoundCheck className="h-3.5 w-3.5" />
          نویسنده
        </p>
        <p className="mt-1 text-[15px] font-black">{article.author.name}</p>
        <p className="mt-1 text-[12.5px] leading-6 text-muted-foreground">{article.author.role}</p>
        <Link
          href="/about"
          className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-primary hover:underline cursor-pointer"
        >
          مشاهده رزومه کامل
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </aside>
  );
}

/* ---------- رندر بلاک‌ها ---------- */

function BlockRenderer({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={block.id}
          className="scroll-mt-28 pt-6 text-xl font-black leading-9 lg:text-[22px] lg:leading-10"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return <h3 className="pt-4 text-[16.5px] font-extrabold leading-8">{block.text}</h3>;
    case "p":
      return <p className="text-[14.5px] leading-8.5 text-foreground/85 lg:leading-9">{block.text}</p>;
    case "list":
      return block.ordered ? (
        <ol className="my-3 space-y-3.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-primary/12 text-[12px] font-black text-primary">
                {i + 1}
              </span>
              <span className="text-[14px] leading-8 text-foreground/85">{item}</span>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="my-3 space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-[14px] leading-8 text-foreground/85">{item}</span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="my-6 overflow-hidden rounded-2xl border border-border/60">
          <div className="overflow-x-auto scrollbar-slim">
            <table className="w-full min-w-[560px] border-collapse text-right">
              <thead>
                <tr className="bg-primary/10">
                  {block.head.map((h) => (
                    <th key={h} className="px-4 py-3 text-[13px] font-black text-primary">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr key={ri} className={cn("border-t border-border/50", ri % 2 === 1 && "bg-background/50")}>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={cn(
                          "px-4 py-3 align-top text-[13px] leading-6.5",
                          ci === 0 ? "font-bold" : "text-muted-foreground"
                        )}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <p className="border-t border-border/50 bg-background/60 px-4 py-2.5 text-[11.5px] text-muted-foreground">
              {block.caption}
            </p>
          )}
        </div>
      );
    case "callout":
      return <Callout block={block} />;
    case "image":
      return (
        <figure className="my-7 overflow-hidden rounded-[1.5rem] border border-border/60">
          <div className="relative aspect-[16/9]">
            <Image src={block.src} alt={block.alt} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
          </div>
          {block.caption && (
            <figcaption className="bg-background/60 px-4 py-2.5 text-center text-[11.5px] text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "quickAnswers":
    case "faq":
      // در ArticlePage قبل از رسیدن به اینجا با دیتای واقعی مقاله رندر می‌شوند
      return null;
    case "links":
      return (
        <div className="my-7 rounded-2xl border border-border/60 bg-card p-5">
          <p className="mb-3.5 text-[14px] font-black">{block.title}</p>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {block.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group rounded-xl bg-background/70 p-4 transition-colors hover:bg-primary/5 cursor-pointer"
              >
                <span className="flex items-center gap-1.5 text-[13px] font-extrabold text-primary">
                  {l.label}
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                </span>
                <span className="mt-1 block text-[12px] leading-6 text-muted-foreground">{l.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      );
    case "cta":
      return <CtaBox />;
    default:
      return null;
  }
}

/* ---------- صفحه مقاله ---------- */

export function ArticlePage({ article: articleProp }: { article: BlogArticle }) {
  const { site, blog } = useSite();
  // مقاله از محتوای زنده (شامل ویرایش‌های پنل ادمین) خوانده می‌شود؛ prop فقط پشتیبان است
  const article = blog.find((a) => a.slug === articleProp.slug) ?? articleProp;
  const toc = article.blocks.filter((b): b is Extract<ArticleBlock, { type: "h2" }> => b.type === "h2");

  return (
    <>
      {/* هیرو مقاله */}
      <section className="bg-petrol-deep grain relative overflow-hidden pt-28 pb-10 lg:pt-36 lg:pb-14" aria-label="سربرگ مقاله">
        <div className="aurora" />
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(55% 60% at 85% 0%, oklch(0.42 0.07 195 / 0.5), transparent 70%), radial-gradient(45% 50% at 10% 100%, oklch(0.6 0.1 85 / 0.14), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5 lg:px-8">
          {/* مسیر دستی — چون اسلاگ مقاله در NAV نیست */}
          <nav aria-label="مسیر صفحه" className="mb-4 flex items-center gap-1.5 text-xs text-background/50">
            <Link href="/" className="rounded-full px-2 py-1 transition-colors hover:text-background cursor-pointer">
              خانه
            </Link>
            <span aria-hidden>/</span>
            <Link href="/blog" className="rounded-full px-2 py-1 transition-colors hover:text-background cursor-pointer">
              مقالات
            </Link>
            <span aria-hidden>/</span>
            <span aria-current="page" className="font-bold text-teal-300">
              {article.category}
            </span>
          </nav>

          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.08 }}
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-background/15 bg-background/10 px-4 py-1.5 text-xs font-bold tracking-widest text-teal-300 backdrop-blur"
          >
            {article.kicker}
          </motion.span>

          <motion.h1
            id="article-h1"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease, delay: 0.16 }}
            className="text-2xl font-black leading-[1.35] tracking-tight text-background sm:text-4xl sm:leading-[1.3]"
          >
            {article.h1}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.26 }}
            className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-[12.5px] text-background/65"
          >
            <span className="flex items-center gap-2.5">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full border border-background/20 object-cover"
              />
              <span className="flex flex-col leading-tight">
                <span className="font-bold text-background/90">{article.author.name}</span>
                <span className="text-[11px]">{article.author.role}</span>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {article.publishDateFa}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              {article.readingMinutes} دقیقه مطالعه
            </span>
          </motion.div>
        </div>
      </section>

      {/* تصویر شاخص */}
      <div className="relative mx-auto -mt-4 max-w-4xl px-5 lg:px-8">
        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.3 }}
          className="overflow-hidden rounded-[1.75rem] border border-border/60 shadow-xl"
        >
          <div className="relative aspect-[21/9]">
            <Image
              src={article.cover}
              alt={article.coverAlt}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>
        </motion.figure>
      </div>

      {/* بدنه مقاله */}
      <section className="bg-sage relative overflow-hidden py-10 lg:py-14" aria-label="متن مقاله">
        <div className="aurora aurora-sage" />
        <div className="relative mx-auto max-w-3xl px-5 lg:px-8">
          {/* فهرست مطالب */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.4 }}
            aria-label="فهرست مطالب"
            className="mb-8 rounded-[1.5rem] border border-border/60 bg-card p-5 shadow-sm"
          >
            <p className="mb-3 flex items-center gap-2 text-[13.5px] font-black text-primary">
              <ListTree className="h-4 w-4" />
              فهرست مطالب
            </p>
            <ol className="space-y-2">
              {toc.map((t, i) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] leading-6 text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground cursor-pointer"
                  >
                    <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10.5px] font-black text-primary">
                      {i + 1}
                    </span>
                    {t.text}
                  </a>
                </li>
              ))}
            </ol>
          </motion.nav>

          {/* تگ‌ها */}
          <div className="mb-6 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-primary/8 px-3 py-1 text-[11.5px] font-bold text-primary">
                #{tag}
              </span>
            ))}
          </div>

          {/* بلاک‌ها */}
          <div className="space-y-4">
            <AnimatePresence>
              {article.blocks.map((block, i) => {
                // quickAnswers و faq در ArticlePage با دیتای واقعی رندر می‌شوند
                if (block.type === "quickAnswers") return <QuickAnswers key={`qa-${i}`} items={article.quickAnswers} />;
                if (block.type === "faq") return <FaqSection key={`faq-${i}`} faqs={article.faqs} />;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, ease, delay: 0.03 }}
                  >
                    <BlockRenderer block={block} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <AuthorBox article={article} />
        </div>
      </section>
    </>
  );
}
