"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { BookOpenText, Clock3, CalendarDays, ArrowLeft, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "../page-hero";
import { useSite } from "../content-provider";

const ease = [0.16, 1, 0.3, 1] as const;

/** صفحه فهرست مقالات — کارت ویژه اول + گرید بقیه */
export function BlogPage() {
  const { blog } = useSite();
  const [featured, ...rest] = blog;

  if (!featured) {
    return (
      <section className="bg-sage py-24 text-center" aria-label="بدون مقاله">
        <p className="text-muted-foreground">هنوز مقاله‌ای منتشر نشده است.</p>
      </section>
    );
  }

  return (
    <>
      <PageHero
        kicker="بلاگ تخصصی"
        title={
          <>
            دانستنی‌های
            <span className="text-gradient-light block">جراحی فک و صورت</span>
          </>
        }
        desc="راهنماهای اورجینال و بی‌تعارف درباره ارتوگناتیک، ایمپلنت و جراحی‌های فک — نوشته‌شده توسط تیم دکتر پدرام بخشایی، بدون کپی از هیچ منبعی"
      />

      <section className="bg-sage relative overflow-hidden py-14 lg:py-20" aria-label="فهرست مقالات">
        <div className="aurora aurora-sage" />
        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          {/* مقاله ویژه */}
          <motion.article
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="group card-sage overflow-hidden rounded-[2rem] shadow-sm"
          >
            <Link href={`/blog/${featured.slug}`} className="grid lg:grid-cols-2 cursor-pointer">
              <div className="relative min-h-56 overflow-hidden lg:min-h-full">
                <Image
                  src={featured.cover}
                  alt={featured.coverAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <span className="absolute top-4 right-4 rounded-full bg-foreground/85 px-3 py-1.5 text-[11px] font-bold text-background backdrop-blur">
                  {featured.category}
                </span>
              </div>
              <div className="flex flex-col justify-center gap-4 p-6 lg:p-10">
                <h2 className="text-xl font-black leading-8 transition-colors group-hover:text-primary lg:text-2xl lg:leading-10">
                  {featured.h1}
                </h2>
                <p className="text-sm leading-7 text-muted-foreground lg:text-[15px] lg:leading-8">
                  {featured.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {featured.publishDateFa}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    {featured.readingMinutes} دقیقه مطالعه
                  </span>
                </div>
                <span className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-bold text-primary-foreground transition-all duration-300 group-hover:gap-3.5 group-hover:brightness-110">
                  خواندن مقاله
                  <ArrowLeft className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.article>

          {/* کارت‌های بعدی */}
          {rest.length > 0 && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((a, i) => (
                <motion.article
                  key={a.slug}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease, delay: Math.min(i * 0.08, 0.3) }}
                  className="group card-sage overflow-hidden rounded-3xl shadow-sm"
                >
                  <Link href={`/blog/${a.slug}`} className="flex h-full flex-col cursor-pointer">
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={a.cover}
                        alt={a.coverAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute top-3 right-3 rounded-full bg-foreground/85 px-3 py-1 text-[10.5px] font-bold text-background backdrop-blur">
                        {a.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <h3 className="text-[15px] font-extrabold leading-7 transition-colors group-hover:text-primary">
                        {a.h1}
                      </h3>
                      <p className="line-clamp-2 text-[13px] leading-6 text-muted-foreground">{a.excerpt}</p>
                      <div className="mt-auto flex items-center gap-3 pt-1 text-[11.5px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {a.publishDateFa}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5" />
                          {a.readingMinutes} دقیقه
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}

          {/* نوار آماری بلاگ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="mt-10 grid gap-4 rounded-[2rem] border border-border/60 bg-card p-6 shadow-sm sm:grid-cols-3"
          >
            {[
              { icon: BookOpenText, label: "مقالات اورجینال", value: `${blog.length.toLocaleString("fa-IR")} مقاله` },
              { icon: Newspaper, label: "بدون کپی‌برداری", value: "۱۰۰٪ نگارش اختصاصی" },
              { icon: Clock3, label: "به‌روزرسانی منظم", value: "هر ماه موضوع جدید" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-2xl bg-background/60 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <s.icon className="h-5 w-5 text-primary" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[15px] font-extrabold">{s.value}</span>
                  <span className="text-[12px] text-muted-foreground">{s.label}</span>
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
