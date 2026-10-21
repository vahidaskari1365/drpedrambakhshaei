"use client";

/**
 * نمودارهای گزارش‌گیری پنل — recharts با تم پترول/طلایی/سِیج برند
 * (نمودار ساحتی فعالیت، دونات توزیع محتوا، حلقه امتیاز سلامت)
 */
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { faNum } from "./shared";

export const GOLD = "#d9a83f";
export const TEAL = "#5eead4";
export const PETROL = "#3a8a94";
export const SAGE = "#a7d7c5";
export const VIOLET = "#8b7cf6";
export const CHART_COLORS = [TEAL, GOLD, VIOLET, SAGE, PETROL, "#e8b4b8", "#c9b458"];

function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name?: string; value?: number | string; color?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-[oklch(0.2_0.025_262/0.95)] px-4 py-2.5 text-xs shadow-2xl backdrop-blur-xl">
      {label ? <p className="mb-1 font-bold text-white/90">{label}</p> : null}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2 text-white/70">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="font-bold text-white">{faNum(Number(p.value ?? 0))}</span>
        </p>
      ))}
    </div>
  );
}

/** نمودار ساحتی — درخواست‌های تماس و فعالیت ادمین در ۱۴ روز اخیر */
export function ActivityArea({ data }: { data: { label: string; requests: number; activity: number }[] }) {
  return (
    <div dir="ltr" className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="gReq" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TEAL} stopOpacity={0.5} />
              <stop offset="100%" stopColor={TEAL} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gAct" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GOLD} stopOpacity={0.45} />
              <stop offset="100%" stopColor={GOLD} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} tickLine={false} axisLine={false} width={34} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="requests" name="درخواست تماس" stroke={TEAL} strokeWidth={2.5} fill="url(#gReq)" />
          <Area type="monotone" dataKey="activity" name="فعالیت پنل" stroke={GOLD} strokeWidth={2} fill="url(#gAct)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** دونات توزیع حجم محتوا بین مجموعه‌ها */
export function DistributionDonut({ data }: { data: { label: string; words: number }[] }) {
  const total = data.reduce((a, d) => a + d.words, 0) || 1;
  return (
    <div className="relative h-[240px] w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<ChartTooltip />} />
          <Pie
            data={data}
            dataKey="words"
            nameKey="label"
            innerRadius="62%"
            outerRadius="86%"
            paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-black text-white tabular-nums">{faNum(total)}</p>
        <p className="text-[11px] text-white/50">کلمه محتوا</p>
      </div>
    </div>
  );
}

/** حلقه امتیاز سلامت محتوا */
export function ScoreRing({ score }: { score: number }) {
  const color = score >= 90 ? TEAL : score >= 70 ? GOLD : "#f87171";
  return (
    <div className="relative h-[190px] w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={[{ name: "score", value: score, fill: color }]}
          innerRadius="72%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar background={{ fill: "rgba(255,255,255,0.08)" }} dataKey="value" cornerRadius={999} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-4xl font-black tabular-nums" style={{ color }}>
          {faNum(score)}٪
        </p>
        <p className="mt-1 text-[11px] font-bold text-white/50">سلامت محتوا</p>
      </div>
    </div>
  );
}

/** میله‌های افقی حجم محتوا — سبک و بدون وابستگی */
export function VolumeBars({ data, max }: { data: { label: string; words: number }[]; max: number }) {
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between text-[11px]">
            <span className="font-bold text-white/75">{d.label}</span>
            <span className="tabular-nums text-white/45">{faNum(d.words)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.max(3, (d.words / Math.max(max, 1)) * 100)}%`,
                background: `linear-gradient(90deg, ${CHART_COLORS[i % CHART_COLORS.length]}cc, ${CHART_COLORS[i % CHART_COLORS.length]})`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────── نمودارهای بازدید ─────────── */

/** نمودار ساحتی بازدید ۳۰ روزه — بازدید صفحه و بازدیدکننده یکتا */
export function VisitsArea({ data }: { data: { label: string; visits: number; uniques: number }[] }) {
  return (
    <div dir="ltr" className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="gVisits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TEAL} stopOpacity={0.5} />
              <stop offset="100%" stopColor={TEAL} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gUniq" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GOLD} stopOpacity={0.45} />
              <stop offset="100%" stopColor={GOLD} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} tickLine={false} axisLine={false} width={34} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="visits" name="بازدید صفحه" stroke={TEAL} strokeWidth={2.5} fill="url(#gVisits)" />
          <Area type="monotone" dataKey="uniques" name="بازدیدکننده یکتا" stroke={GOLD} strokeWidth={2} fill="url(#gUniq)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** میله‌های افقی صفحات پربازدید */
export function PagesBars({ data }: { data: { label: string; count: number }[] }) {
  return (
    <div dir="ltr" className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 18, left: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.07)" horizontal={false} />
          <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="label"
            width={118}
            tick={{ fill: "rgba(255,255,255,0.62)", fontSize: 10.5 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="count" name="بازدید" radius={[0, 8, 8, 0]} barSize={16}>
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** دونات عمومی — توزیع دستگاه‌ها یا هر دسته دیگری */
export function SimpleDonut({ data, unit = "بازدید" }: { data: { label: string; value: number }[]; unit?: string }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  return (
    <div className="relative h-[240px] w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<ChartTooltip />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="62%"
            outerRadius="86%"
            paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-black text-white tabular-nums">{faNum(total)}</p>
        <p className="text-[11px] text-white/50">{unit}</p>
      </div>
    </div>
  );
}

/** میله‌های عمودی توزیع ساعتی بازدید */
export function HoursBars({ data }: { data: { label: string; count: number }[] }) {
  return (
    <div dir="ltr" className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9 }} tickLine={false} axisLine={false} interval={2} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} tickLine={false} axisLine={false} width={30} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="count" name="بازدید" radius={[6, 6, 0, 0]} fill={TEAL} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─────────── نمودارهای نوبت‌دهی و تماس ─────────── */

/** نمودار ساحتی رویدادهای ۳۰ روزه — باز شدن پنجره نوبت، انتخاب پلتفرم و کلیک تماس */
export function BookingArea({
  data,
}: {
  data: { label: string; opens: number; clicks: number; calls: number }[];
}) {
  return (
    <div dir="ltr" className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="gOpens" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TEAL} stopOpacity={0.5} />
              <stop offset="100%" stopColor={TEAL} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gPicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GOLD} stopOpacity={0.45} />
              <stop offset="100%" stopColor={GOLD} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gCalls" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={VIOLET} stopOpacity={0.45} />
              <stop offset="100%" stopColor={VIOLET} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} tickLine={false} axisLine={false} width={34} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="opens" name="باز شدن پنجره نوبت" stroke={TEAL} strokeWidth={2.5} fill="url(#gOpens)" />
          <Area type="monotone" dataKey="clicks" name="انتخاب پلتفرم" stroke={GOLD} strokeWidth={2.5} fill="url(#gPicks)" />
          <Area type="monotone" dataKey="calls" name="کلیک تماس" stroke={VIOLET} strokeWidth={2} fill="url(#gCalls)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** دونات تفکیک پلتفرم‌های نوبت‌دهی */
export function PlatformDonut({ data, unit = "انتخاب" }: { data: { label: string; value: number }[]; unit?: string }) {
  return <SimpleDonut data={data} unit={unit} />;
}
