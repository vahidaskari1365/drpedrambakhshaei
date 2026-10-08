"use client";

/**
 * موتور ویرایشگر فرم عمومی — همه مجموعه‌های محتوا با همین سازوکار ویرایش می‌شوند.
 * انواع فیلد: متن، متن بلند، عدد، تصویر (با پیش‌نمایش)، فهرست رشته،
 * فهرست جفت کلید-مقدار، JSON و فهرست اشیا (بازگشتی با زیرفیلدها)
 */
import * as React from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Image as ImageIcon, Braces } from "lucide-react";
import { cn } from "@/lib/utils";
import { faNum } from "./shared";

/* ─────────── تعاریف فیلد ─────────── */

export type FieldDef = {
  k: string;
  label: string;
} & (
  | { type: "text" | "textarea" | "number" | "image" | "url" }
  | { type: "list"; itemLabel?: string }
  | { type: "kvlist" }
  | { type: "json" }
  | { type: "objlist"; fields: FieldDef[]; titleKey?: string; addTemplate?: () => Record<string, unknown> }
);

/* ─────────── دسترسی مسیر نقطه‌ای (مثل social.telegram) ─────────── */

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, k) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[k] : undefined), obj);
}

function setByPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const clone = structuredClone(obj) as Record<string, unknown>;
  let cur = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!cur[keys[i]] || typeof cur[keys[i]] !== "object") cur[keys[i]] = {};
    cur = cur[keys[i]] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
  return clone as unknown as T;
}

/* ─────────── ورودی‌های پایه ─────────── */

const inputCls =
  "w-full rounded-xl border border-white/12 bg-white/[0.06] px-3.5 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none transition-all focus:border-teal-300/50 focus:bg-white/[0.09] focus:ring-4 focus:ring-teal-300/10";

export function TextInput({
  value,
  onChange,
  placeholder,
  dir,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <input
      value={value}
      dir={dir}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(inputCls, dir === "ltr" && "text-left")}
    />
  );
}

export function NumberInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? value : 0}
      dir="ltr"
      onChange={(e) => onChange(Number(e.target.value))}
      className={cn(inputCls, "text-left tabular-nums")}
    />
  );
}

export function JsonInput({ value, onChange, label }: { value: unknown; onChange: (v: unknown) => void; label?: string }) {
  const [text, setText] = React.useState(() => JSON.stringify(value, null, 2));
  const [err, setErr] = React.useState<string | null>(null);
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    if (!dirty) setText(JSON.stringify(value, null, 2));
  }, [value, dirty]);

  return (
    <div>
      <textarea
        dir="ltr"
        value={text}
        rows={Math.min(14, Math.max(4, text.split("\n").length))}
        onChange={(e) => {
          setDirty(true);
          setText(e.target.value);
          try {
            const parsed = JSON.parse(e.target.value);
            setErr(null);
            onChange(parsed);
          } catch {
            setErr("JSON نامعتبر — تا اصلاح، ذخیره اعمال نمی‌شود");
          }
        }}
        className={cn(inputCls, "resize-y font-mono text-[11.5px] leading-6", err && "border-red-400/60")}
      />
      <p className={cn("mt-1 text-[10.5px]", err ? "text-red-300" : "text-white/35")}>
        <Braces className="ml-1 inline h-3 w-3" />
        {err ?? label ?? "JSON معتبر"}
      </p>
    </div>
  );
}

function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-white/12 bg-white/5">
        {value ? (
          <img src={value} alt="پیش‌نمایش" className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="absolute inset-0 m-auto h-5 w-5 text-white/25" />
        )}
      </div>
      <div className="flex-1">
        <TextInput value={value} onChange={onChange} dir="ltr" placeholder="/uploads/..." />
        <p className="mt-1 text-[10px] text-white/35">مسیر تصویر از پوشه public</p>
      </div>
    </div>
  );
}

/* ─────────── فیلدهای لیستی ─────────── */

function ListField({ items, onChange, itemLabel }: { items: string[]; onChange: (v: string[]) => void; itemLabel?: string }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/8 text-[10px] font-black text-white/50">
            {faNum(i + 1)}
          </span>
          <TextInput value={item} onChange={(v) => onChange(items.map((x, j) => (j === i ? v : x)))} />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            aria-label={`حذف ${itemLabel ?? "آیتم"}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/35 transition-colors hover:bg-red-400/15 hover:text-red-300 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="flex items-center gap-1.5 rounded-lg border border-dashed border-white/20 px-3 py-1.5 text-[11px] font-bold text-white/50 transition-colors hover:border-teal-300/40 hover:text-teal-200 cursor-pointer"
      >
        <Plus className="h-3 w-3" />
        افزودن {itemLabel ?? "آیتم"}
      </button>
    </div>
  );
}

function KvListField({ items, onChange }: { items: { label: string; value: string }[]; onChange: (v: { label: string; value: string }[]) => void }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2/5">
            <TextInput
              value={item.label}
              onChange={(v) => onChange(items.map((x, j) => (j === i ? { ...x, label: v } : x)))}
              placeholder="برچسب"
            />
          </div>
          <div className="flex-1">
            <TextInput
              value={item.value}
              onChange={(v) => onChange(items.map((x, j) => (j === i ? { ...x, value: v } : x)))}
              placeholder="مقدار"
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            aria-label="حذف ردیف"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/35 transition-colors hover:bg-red-400/15 hover:text-red-300 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { label: "", value: "" }])}
        className="flex items-center gap-1.5 rounded-lg border border-dashed border-white/20 px-3 py-1.5 text-[11px] font-bold text-white/50 transition-colors hover:border-teal-300/40 hover:text-teal-200 cursor-pointer"
      >
        <Plus className="h-3 w-3" />
        افزودن ردیف
      </button>
    </div>
  );
}

/* ─────────── فهرست اشیا (بازگشتی) ─────────── */

export function ObjListField({
  items,
  fields,
  onChange,
  titleKey,
  addTemplate,
  label,
}: {
  items: Record<string, unknown>[];
  fields: FieldDef[];
  onChange: (v: Record<string, unknown>[]) => void;
  titleKey?: string;
  addTemplate?: () => Record<string, unknown>;
  label?: string;
}) {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const title =
          (titleKey && typeof item[titleKey] === "string" && (item[titleKey] as string)) ||
          Object.values(item).find((v) => typeof v === "string" && v.length > 2) ||
          `آیتم ${faNum(i + 1)}`;
        const isOpen = open === i;
        return (
          <div key={i} className={cn("overflow-hidden rounded-2xl border transition-colors", isOpen ? "border-teal-300/25 bg-white/[0.05]" : "border-white/10 bg-white/[0.03]")}>
            <div className="flex items-center gap-2 px-3 py-2.5">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex flex-1 items-center gap-2 text-right cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-300/20 to-gold/20 text-[10px] font-black text-teal-200">
                  {faNum(i + 1)}
                </span>
                <span className="line-clamp-1 flex-1 text-[12.5px] font-bold text-white/85">{String(title).slice(0, 60)}</span>
                <ChevronUp className={cn("h-4 w-4 shrink-0 text-white/35 transition-transform", !isOpen && "rotate-180")} />
              </button>
              <button
                type="button"
                aria-label="انتقال به بالا"
                disabled={i === 0}
                onClick={() => {
                  if (i === 0) return;
                  const next = [...items];
                  [next[i - 1], next[i]] = [next[i], next[i - 1]];
                  onChange(next);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-white/8 hover:text-white/70 disabled:opacity-20 cursor-pointer"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="انتقال به پایین"
                disabled={i === items.length - 1}
                onClick={() => {
                  if (i === items.length - 1) return;
                  const next = [...items];
                  [next[i + 1], next[i]] = [next[i], next[i + 1]];
                  onChange(next);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-white/8 hover:text-white/70 disabled:opacity-20 cursor-pointer"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="حذف آیتم"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-red-400/15 hover:text-red-300 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            {isOpen && (
              <div className="border-t border-white/8 px-3 pb-4 pt-3">
                <FieldsEditor value={item} fields={fields} onChange={(v) => onChange(items.map((x, j) => (j === i ? v as Record<string, unknown> : x)))} />
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => {
          onChange([...items, addTemplate ? addTemplate() : Object.fromEntries(fields.map((f) => [f.k, f.type === "number" ? 0 : f.type === "list" ? [] : f.type === "objlist" ? [] : ""]))]);
          setOpen(items.length);
        }}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/20 py-2.5 text-[12px] font-bold text-white/50 transition-colors hover:border-teal-300/40 hover:text-teal-200 cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" />
        افزودن {label ?? "آیتم جدید"}
      </button>
    </div>
  );
}

/* ─────────── موتور اصلی ویرایش فیلدها ─────────── */

export function FieldsEditor({
  value,
  fields,
  onChange,
  compact,
}: {
  value: Record<string, unknown>;
  fields: FieldDef[];
  onChange: (v: Record<string, unknown>) => void;
  compact?: boolean;
}) {
  const set = (path: string, v: unknown) => onChange(setByPath(value, path, v));
  return (
    <div className={cn("grid gap-4", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
      {fields.map((f) => {
        const current = getByPath(value, f.k);
        const wide = f.type === "textarea" || f.type === "list" || f.type === "kvlist" || f.type === "objlist" || f.type === "json";
        return (
          <div key={f.k} className={cn(wide && "sm:col-span-2")}>
            <label className="mb-1.5 block text-[11px] font-bold text-white/55">{f.label}</label>
            {"type" in f && f.type === "text" && (
              <TextInput value={String(current ?? "")} onChange={(v) => set(f.k, v)} />
            )}
            {"type" in f && f.type === "url" && (
              <TextInput value={String(current ?? "")} onChange={(v) => set(f.k, v)} dir="ltr" />
            )}
            {"type" in f && f.type === "textarea" && (
              <textarea
                value={String(current ?? "")}
                rows={3}
                onChange={(e) => set(f.k, e.target.value)}
                className={cn(inputCls, "resize-y leading-7")}
              />
            )}
            {"type" in f && f.type === "number" && (
              <NumberInput value={Number(current ?? 0)} onChange={(v) => set(f.k, v)} />
            )}
            {"type" in f && f.type === "image" && (
              <ImageInput value={String(current ?? "")} onChange={(v) => set(f.k, v)} />
            )}
            {"type" in f && f.type === "list" && (
              <ListField
                items={Array.isArray(current) ? (current as string[]) : []}
                onChange={(v) => set(f.k, v)}
                itemLabel={f.type === "list" ? f.itemLabel : undefined}
              />
            )}
            {"type" in f && f.type === "kvlist" && (
              <KvListField
                items={Array.isArray(current) ? (current as { label: string; value: string }[]) : []}
                onChange={(v) => set(f.k, v)}
              />
            )}
            {"type" in f && f.type === "json" && (
              <JsonInput value={current} onChange={(v) => set(f.k, v)} />
            )}
            {"type" in f && f.type === "objlist" && (
              <ObjListField
                items={Array.isArray(current) ? (current as Record<string, unknown>[]) : []}
                fields={f.fields}
                titleKey={f.titleKey}
                addTemplate={f.addTemplate}
                onChange={(v) => set(f.k, v)}
                label={f.label}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
