import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** سرو تصویرهای آپلودشده از دیتابیس — کش ابدی چون محتوای id تغییر نمی‌کند */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const row = await db.media.findUnique({ where: { id } });
    if (!row) return new NextResponse("Not found", { status: 404 });

    const bytes = new Uint8Array(Buffer.from(row.data, "base64"));
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": row.mime || "image/jpeg",
        "Content-Length": String(bytes.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}
