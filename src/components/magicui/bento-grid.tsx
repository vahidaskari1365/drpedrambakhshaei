import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Magic UI — Bento Grid (پایه لایه‌بندی)
 * گرید بنتو برای چیدمان کیت‌محور بخش‌ها
 */
interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className, ...props }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[minmax(13rem,auto)] grid-cols-1 gap-4 md:grid-cols-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className?: string;
  background?: ReactNode;
  icon?: ReactNode;
  description?: string;
  children?: ReactNode;
}

export function BentoCard({
  name,
  className,
  background,
  icon,
  description,
  children,
  ...props
}: BentoCardProps) {
  return (
    <div
      key={name}
      className={cn(
        "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-3xl border border-border/60 bg-card p-5 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transition-transform duration-300 hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {background && <div aria-hidden="true">{background}</div>}
      <div className="relative z-10">
        {icon && (
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-black">{name}</h3>
        {description && (
          <p className="mt-1.5 max-w-lg text-[13px] leading-7 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
