/**
 * لوگوی واقعی دکتر پدرام بخشایی — استخراج‌شده از سایت اصلی (drpedrambakhshaei.com)
 * مونوگرام «S» بنفش-آبی روی دایره کرم؛ فرآیندشده از cropped-logo.jpg اصلی
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/uploads/logo-badge.webp"
      alt=""
      width={144}
      height={144}
      draggable={false}
      className={`shrink-0 select-none object-cover ${className ?? ""}`}
    />
  );
}

export function LogoFull({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className="h-10 w-10" />
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
