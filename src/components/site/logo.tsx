import type { SVGProps } from "react";

/**
 * لوگوی دکتر پدرام بخشایی — مینیمال، اپل‌استایل
 * ترکیب خط نمای پروفایل صورت (جراحی فک و صورت) با فرم انتزاعی حرف «ب»
 */
export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* دایره زمینه */}
      <circle cx="24" cy="24" r="24" className="fill-current" opacity="0.08" />
      {/* خط پروفایل صورت — از پیشانی تا چانه */}
      <path
        d="M30 8c-6.5 1.2-11.4 5.6-12.6 11.2-.5 2.4-.2 4.8.8 7.1-1.6 2.2-2.4 4.6-2.2 6.6.3 3.6 3 6.2 6.9 7.1"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* فرم انتزاعی «ب» */}
      <path
        d="M33 14.5v13.2c0 4.4-2.9 7.6-7.2 8.3"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      <circle cx="33.2" cy="33.8" r="2.2" className="fill-teal-600 dark:fill-teal-400" />
    </svg>
  );
}

export function LogoFull({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className="h-10 w-10 shrink-0 text-foreground" />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-extrabold tracking-tight">
          دکتر پدرام بخشایی
        </span>
        <span className="mt-1 text-[10px] font-medium text-muted-foreground">
          متخصص جراحی دهان، فک و صورت
        </span>
      </span>
    </span>
  );
}
