import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Magic UI — Marquee
 * نوار متحرک بی‌نهایت با CSS کامپوزیتوری (بدون framer)
 * حلقه روی keyframe محلی animate-mg-marquee تعریف شده در globals.css
 *
 * مکانیک حلقه باید LTR باشد (ریزین راست، خروج چپ، حلقه بی‌درز):
 * در صفحه RTL اگر track هم RTL باشد، کپی‌ها به سمت چپ سرریز می‌شوند و
 * حرکت به چپ حفره خالی از راست می‌سازد + پرش در پایان حلقه (باگ «با هم میان/می‌روند»)
 * ⇒ بیرونی dir="ltr" + هر کارت dir={contentDir} (پیش‌فرض rtl برای متن فارسی)
 */
interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  /** جهت محتوای داخل کارت‌ها — مستقل از مکانیک حرکت */
  contentDir?: "rtl" | "ltr";
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  contentDir = "rtl",
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      dir="ltr"
      className={cn(
        "group flex [gap:var(--mg-gap,1rem)] overflow-hidden p-2 [--mg-duration:40s]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          dir={contentDir}
          aria-hidden={i > 0 ? true : undefined}
          className={cn("flex shrink-0 justify-around [gap:var(--mg-gap,1rem)]", {
            "animate-mg-marquee flex-row": !vertical,
            "animate-mg-marquee-vertical flex-col": vertical,
            "group-hover:[animation-play-state:paused]": pauseOnHover,
            "[animation-direction:reverse]": reverse,
          })}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
