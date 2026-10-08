"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Home } from "lucide-react";
import { useSite } from "./content-provider";

/**
 * نان‌برکرامب دیداری — سئوی ساختاری + ناوبری
 * به‌همراه اسکیمای BreadcrumbList که در هر روت جداگانه تزریق می‌شود
 */
export function Breadcrumbs() {
  const { nav } = useSite();
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;
  const current = nav.find((n) => n.href === pathname);
  if (!current) return null;

  return (
    <nav
      aria-label="مسیر صفحه"
      className="mb-4 flex items-center gap-1.5 text-xs text-background/50"
    >
      <Link
        href="/"
        className="flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:text-background cursor-pointer"
      >
        <Home className="h-3.5 w-3.5" />
        خانه
      </Link>
      <ChevronLeft className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span aria-current="page" className="font-bold text-teal-300">
        {current.label}
      </span>
    </nav>
  );
}
