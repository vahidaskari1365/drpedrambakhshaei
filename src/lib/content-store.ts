/**
 * لایه سرور محتوا — خواندن/نوشتن بازنویسی‌های پنل ادمین در دیتابیس
 * فقط در سمت سرور import شود (Prisma دارد).
 */
import { db } from "./db";
import {
  CONTENT_KEYS,
  CONTENT_LABELS,
  mergeContent,
  type ContentKey,
  type SiteContent,
} from "./site-content";

export interface OverrideMeta {
  key: ContentKey;
  updatedAt: string;
  size: number;
}

/** نقشه بازنویسی‌های فعلی (کلید → مقدار JSON) */
export async function getOverridesMap(): Promise<{
  map: Record<string, unknown>;
  meta: OverrideMeta[];
}> {
  try {
    const rows = await db.contentOverride.findMany();
    const map: Record<string, unknown> = {};
    const meta: OverrideMeta[] = [];
    for (const row of rows) {
      try {
        map[row.key] = JSON.parse(row.data);
        meta.push({
          key: row.key as ContentKey,
          updatedAt: row.updatedAt.toISOString(),
          size: row.data.length,
        });
      } catch {
        // رکورد خراب → نادیده (پیش‌فرض می‌ماند)
      }
    }
    return { map, meta };
  } catch (e) {
    console.error("[content-store] getOverridesMap failed:", e);
    return { map: {}, meta: [] };
  }
}

/** محتوای نهایی سایت = پیش‌فرض‌ها + بازنویسی‌های ادمین */
export async function getMergedContent(): Promise<SiteContent> {
  try {
    const { map } = await getOverridesMap();
    return mergeContent(map);
  } catch (e) {
    console.error("[content-store] merge failed, using defaults:", e);
    return mergeContent(null);
  }
}

/** ذخیره بازنویسی یک مجموعه + ثبت فعالیت */
export async function saveOverride(
  key: string,
  data: unknown,
  summary?: string
): Promise<OverrideMeta> {
  if (!(CONTENT_KEYS as string[]).includes(key)) {
    throw new Error(`کلید نامعتبر: ${key}`);
  }
  const json = JSON.stringify(data);
  if (json.length > 1_500_000) {
    throw new Error("حجم محتوا بیش از حد مجاز است");
  }
  const row = await db.contentOverride.upsert({
    where: { key },
    update: { data: json },
    create: { key, data: json },
  });
  await logActivity(
    "content.update",
    key,
    summary ?? `ویرایش «${CONTENT_LABELS[key as ContentKey]}» ذخیره شد`
  );
  return { key: row.key as ContentKey, updatedAt: row.updatedAt.toISOString(), size: json.length };
}

/** حذف بازنویسی (بازگشت به پیش‌فرض کد) + ثبت فعالیت */
export async function deleteOverride(key: string): Promise<void> {
  if (!(CONTENT_KEYS as string[]).includes(key)) {
    throw new Error(`کلید نامعتبر: ${key}`);
  }
  await db.contentOverride.deleteMany({ where: { key } });
  await logActivity(
    "content.reset",
    key,
    `«${CONTENT_LABELS[key as ContentKey]}» به پیش‌فرض بازگشت`
  );
}

/** ثبت رویداد در گزارش فعالیت — هرگز خطا بالا نمی‌دهد */
export async function logActivity(kind: string, entity: string, summary: string) {
  try {
    await db.activityLog.create({ data: { kind, entity, summary } });
  } catch (e) {
    console.error("[content-store] logActivity failed:", e);
  }
}
