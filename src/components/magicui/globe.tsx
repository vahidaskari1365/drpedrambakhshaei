"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Magic UI — Globe (کره زمین WebGL با cobe v2)
 * مارکر تهران در مرکز — قابل درگ با ماوس/لمس — حلقه rAF خودکار
 */
const MOVEMENT_DAMPING = 1400;

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  phi: 0,
  theta: 0.28,
  dark: 0,
  diffuse: 0.5,
  mapSamples: 16000,
  mapBrightness: 1.15,
  baseColor: [0.96, 0.98, 0.98],
  markerColor: [0.18, 0.62, 0.6],
  glowColor: [0.85, 0.92, 0.92],
  devicePixelRatio: 2,
  markers: [
    { location: [35.7675, 51.4571], size: 0.14 }, // پاسداران، تهران
    { location: [32.4279, 53.688], size: 0.05 }, // ایران
    { location: [25.2048, 55.2708], size: 0.05 }, // دبی
    { location: [39.9042, 116.4074], size: 0.05 }, // پکن
    { location: [41.0082, 28.9784], size: 0.05 }, // استانبول
    { location: [51.5074, -0.1278], size: 0.05 }, // لندن
    { location: [40.7128, -74.006], size: 0.05 }, // نیویورک
  ],
};

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const pointerInteracting = useRef<number | null>(null);

  const r = useMotionValue(0);
  const rs = useSpring(r, { mass: 1, damping: 30, stiffness: 100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    widthRef.current = canvas.offsetWidth || 300;

    const globe = createGlobe(canvas, {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
    });

    // حلقه رندر — cobe v2 بدون حلقه داخلی است
    let raf = 0;
    const loop = () => {
      if (!pointerInteracting.current) phiRef.current += 0.004;
      globe.update({
        phi: phiRef.current + rs.get(),
        width: widthRef.current * 2,
        height: widthRef.current * 2,
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => {
      if (canvas) widthRef.current = canvas.offsetWidth || widthRef.current;
    };
    window.addEventListener("resize", onResize);

    canvas.style.opacity = "1";

    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [rs, config]);

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-square w-full max-w-[600px]",
        className
      )}
    >
      <canvas
        className="size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        ref={canvasRef}
        style={{ cursor: "grab" }}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            r.set(r.get() + (e.clientX - pointerInteracting.current) / MOVEMENT_DAMPING);
          }
        }}
        onTouchMove={(e) => {
          if (e.touches[0] && pointerInteracting.current !== null) {
            r.set(
              r.get() +
                (e.touches[0].clientX - pointerInteracting.current) / MOVEMENT_DAMPING
            );
          }
        }}
      />
    </div>
  );
}
