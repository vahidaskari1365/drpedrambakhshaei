import type { ComponentProps, CSSProperties } from "react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * Magic UI — Glare Hover
 * انعکاس نور عبوری روی تصویر هنگام هاور — کاملاً CSS
 */
export interface GlareHoverProps extends ComponentProps<"div"> {
  color?: string;
  opacity?: number;
  angle?: number;
  size?: number;
  duration?: number;
}

type RGBA = `rgba(${number},${number},${number},${number})`;

function parseHEX(color: string, opacity: number): RGBA | string {
  const hex = color.replace("#", "");
  const parse = (h: string) => Number.parseInt(h, 16);
  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return `rgba(${parse(hex.slice(0, 2))},${parse(hex.slice(2, 4))},${parse(hex.slice(4, 6))},${opacity})` as RGBA;
  }
  if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
    return `rgba(${parse(hex[0] + hex[0])},${parse(hex[1] + hex[1])},${parse(hex[2] + hex[2])},${opacity})` as RGBA;
  }
  return color;
}

function GlareHover({
  children,
  color = "#f0c869",
  opacity = 0.35,
  angle = -45,
  size = 250,
  duration = 650,
  className,
  style,
  ...props
}: GlareHoverProps) {
  const rgba = useMemo(() => parseHEX(color, opacity), [color, opacity]);

  const cssVars = {
    "--gh-angle": `${angle}deg`,
    "--gh-duration": `${duration}ms`,
    "--gh-size": `${size}%`,
    "--gh-rgba": rgba,
    ...style,
  } as CSSProperties;

  return (
    <div
      {...props}
      className={cn(
        // نکته مهم: بدون size-fit و place-items-center — این دو باعث می‌شدند
        // فرزندِ aspect-ratio دار (مثل aspect-[4/3]) کشیده نشود و کارت‌ها
        // در گالری و خدمات تا ارتفاع ~۲ پیکسل جمع می‌شدند (باگ خاموش پروداکشن)
        "relative grid cursor-pointer overflow-hidden bg-transparent",
        "before:pointer-events-none before:absolute before:inset-0 before:z-10 before:bg-no-repeat before:content-['']",
        "before:[background-image:linear-gradient(var(--gh-angle),transparent_60%,var(--gh-rgba)_70%,transparent,transparent_100%)]",
        "before:[background-size:var(--gh-size)_var(--gh-size),100%_100%]",
        "before:[background-position:-100%_-100%,0_0]",
        "before:transition-[background-position] before:duration-[var(--gh-duration)] before:ease-in-out",
        "hover:before:[background-position:100%_100%,0_0]",
        className
      )}
      style={cssVars}
    >
      {children}
    </div>
  );
}

export { GlareHover };
