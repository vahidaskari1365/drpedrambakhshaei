import React from "react";
import { cn } from "@/lib/utils";

/**
 * Magic UI — Orbiting Circles (نسخه CSS کامپوزیتوری)
 * آیکون‌های مداری دور یک مرکز — حلقه روی keyframe محلی
 */
export interface OrbitingCirclesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
}

export function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 22,
  radius = 160,
  path = true,
  iconSize = 44,
  speed = 1,
  ...props
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed;
  const count = React.Children.count(children);

  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
          aria-hidden="true"
        >
          <circle
            className="stroke-foreground/10 stroke-1"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}
      {React.Children.map(children, (child, index) => {
        const angle = (360 / count) * index;
        return (
          <div
            style={
              {
                "--mg-duration": calculatedDuration,
                "--mg-radius": radius,
                "--mg-angle": angle,
                "--mg-icon-size": `${iconSize}px`,
              } as React.CSSProperties
            }
            className={cn(
              "animate-mg-orbit absolute flex size-[var(--mg-icon-size)] transform-gpu items-center justify-center rounded-full",
              reverse && "[animation-direction:reverse]",
              className
            )}
            {...props}
          >
            {child}
          </div>
        );
      })}
    </>
  );
}
