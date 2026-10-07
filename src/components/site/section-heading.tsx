"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

export function SectionHeading({
  kicker,
  title,
  desc,
  dark = false,
}: {
  kicker: string;
  title: React.ReactNode;
  desc?: string;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease }}
        className={cn(
          "mb-3 inline-flex items-center gap-1.5 text-xs font-bold tracking-widest",
          dark ? "text-teal-300" : "text-primary"
        )}
      >
        <Sparkles className="h-3.5 w-3.5" />
        {kicker}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease, delay: 0.08 }}
        className={cn("text-3xl font-black tracking-tight sm:text-[2.6rem] sm:leading-[1.2]", dark && "text-background")}
      >
        {title}
      </motion.h2>
      {desc && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease, delay: 0.16 }}
          className={cn("mt-4 text-[15px] leading-8 text-muted-foreground", dark && "text-background/70")}
        >
          {desc}
        </motion.p>
      )}
    </div>
  );
}
