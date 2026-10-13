"use client";

/**
 * تب «رسانه‌ها» — کتابخانه رسانه پنل مثل وردپرس
 * آپلود تصویر، کپی نشانی، حذف و پیش‌نمایش همه رسانه‌های سایت
 */
import * as React from "react";
import { motion } from "framer-motion";
import { Upload, Loader2, Copy, Trash2, Images, CheckCircle2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, getKey, faNum, faTimeAgo, type MediaRow } from "./shared";

export function MediaTab({
  toast,
}: {
  toast: (msg: string, kind?: "ok" | "err") => void;
}) {
  const [media, setMedia] = React.useState<MediaRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const dragRef = React.useRef<HTMLDivElement>(null);

  const load = React.useCallback(async () => {
    try {
      const res = await api<{ media: MediaRow[] }>("/api/admin/media");
      setMedia(res.media);
    } catch (e) {
      toast(e instanceof Error ? e.message : "خطا در بارگذاری رسانه‌ها", "err");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      // فراخوانی بعد از یک میکروتسک — بدون رندر آبشاری همگام
      await Promise.resolve();
      if (alive) await load();
    })();
    return () => {
      alive = false;
    };
  }, [load]);

  // بستن حالت تأیید حذف بعد از ۳ ثانیه
  React.useEffect(() => {
    if (!confirmId) return;
    const t = setTimeout(() => setConfirmId(null), 3000);
    return () => clearTimeout(t);
  }, [confirmId]);

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) {
      toast("فقط فایل تصویری (JPG، PNG، WebP و ...) مجاز است", "err");
      return;
    }
    setUploading(true);
    let ok = 0;
    for (const file of list) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "x-admin-key": getKey() },
          body: fd,
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(data.error || "آپلود ناموفق بود");
        ok += 1;
      } catch (e) {
        toast(`${file.name}: ${e instanceof Error ? e.message : "آپلود ناموفق"}`, "err");
      }
    }
    setUploading(false);
    if (ok > 0) {
      toast(`${faNum(ok)} تصویر آپلود شد و در کتابخانه رسانه آماده است`, "ok");
      load();
    }
  };

  const copyUrl = async (row: MediaRow) => {
    try {
      const absolute = `${window.location.origin}${row.url}`;
      await navigator.clipboard.writeText(absolute);
      setCopiedId(row.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      toast("کپی نشد — نشانی: " + row.url, "err");
    }
  };

  const remove = async (row: MediaRow) => {
    if (confirmId !== row.id) {
      setConfirmId(row.id);
      return;
    }
    setConfirmId(null);
    try {
      await api(`/api/admin/media?id=${row.id}`, { method: "DELETE" });
      toast(`«${row.filename}» حذف شد`, "ok");
      setMedia((m) => m.filter((x) => x.id !== row.id));
    } catch (e) {
      toast(e instanceof Error ? e.message : "حذف ناموفق بود", "err");
    }
  };

  return (
    <div className="space-y-4">
      {/* نوار آپلود */}
      <div
        ref={dragRef}
        onDragOver={(e) => {
          e.preventDefault();
          dragRef.current?.classList.add("border-teal-300/50", "bg-teal-300/5");
        }}
        onDragLeave={() => dragRef.current?.classList.remove("border-teal-300/50", "bg-teal-300/5")}
        onDrop={(e) => {
          e.preventDefault();
          dragRef.current?.classList.remove("border-teal-300/50", "bg-teal-300/5");
          if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
        }}
        className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-dashed border-white/20 bg-white/[0.03] p-5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400/25 to-gold/25">
            <Images className="h-5 w-5 text-teal-200" />
          </span>
          <div>
            <h2 className="text-[14px] font-black text-white">کتابخانه رسانه</h2>
            <p className="mt-0.5 text-[11px] text-white/45">
              تصویر را اینجا رها کنید یا دکمه آپلود را بزنید — حداکثر ۴ مگابایت
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) uploadFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-teal-400 to-teal-300 px-5 py-2.5 text-[13px] font-black text-[oklch(0.2_0.03_205)] shadow-lg shadow-teal-400/25 transition-all hover:brightness-110 disabled:opacity-50 cursor-pointer"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "در حال آپلود..." : "آپلود تصویر"}
          </button>
        </div>
      </div>

      {/* شبکه رسانه‌ها */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-teal-300/60" />
        </div>
      ) : media.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">
          <Images className="mx-auto mb-3 h-9 w-9 text-white/20" />
          <p className="text-sm text-white/60">هنوز تصویری آپلود نشده است</p>
          <p className="mt-1 text-[11.5px] text-white/35">
            تصاویر آپلودشده در ویرایشگرهای محتوا و مقالات قابل استفاده‌اند
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {media.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.4) }}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <a href={m.url} target="_blank" rel="noopener noreferrer" className="relative block h-28 w-full overflow-hidden bg-white/5">
                <img src={m.url} alt={m.filename} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute top-2 left-2 rounded-lg bg-black/55 p-1.5 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  <ExternalLink className="h-3.5 w-3.5 text-white/85" />
                </span>
              </a>
              <div className="p-2.5">
                <p className="truncate text-[11px] font-bold text-white/75" title={m.filename}>
                  {m.filename}
                </p>
                <p className="mt-0.5 text-[10px] text-white/35 tabular-nums">
                  {faNum(Math.max(1, Math.round(m.size / 1024)))} کیلوبایت · {faTimeAgo(m.createdAt)}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => copyUrl(m)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1 rounded-lg border py-1.5 text-[10.5px] font-bold transition-colors cursor-pointer",
                      copiedId === m.id
                        ? "border-teal-300/40 bg-teal-300/10 text-teal-200"
                        : "border-white/12 text-white/60 hover:bg-white/8 hover:text-white"
                    )}
                  >
                    {copiedId === m.id ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copiedId === m.id ? "کپی شد" : "کپی نشانی"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(m)}
                    aria-label={`حذف ${m.filename}`}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg transition-colors cursor-pointer",
                      confirmId === m.id
                        ? "bg-red-400/25 text-red-200"
                        : "text-white/35 hover:bg-red-400/15 hover:text-red-300"
                    )}
                    title={confirmId === m.id ? "برای تأیید دوباره بزنید" : "حذف"}
                  >
                    {confirmId === m.id ? <span className="text-[9.5px] font-black">تأیید؟</span> : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <p className="flex items-center gap-1.5 px-1 text-[10.5px] text-white/30">
        <Trash2 className="h-3 w-3" />
        اگر تصویری را حذف کنید که در محتوای سایت استفاده شده، آن بخش تصویر ندارد — قبل از حذف، نشانی را در ویرایشگرها جستجو کنید.
      </p>
    </div>
  );
}
