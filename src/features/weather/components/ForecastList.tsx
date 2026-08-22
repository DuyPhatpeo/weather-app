import { useWeatherStore } from "@/store/weatherStore";

const DAY_NAMES = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const W = 700;
const H = 90;

export default function ForecastList() {
  const { daily, selectedDate, setSelectedDate, unit, theme } = useWeatherStore();

  if (!daily?.length) return null;

  const lineColor = theme === "dark" ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.25)";
  const dotColor = theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.3)";
  const guideColor = theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(15,23,42,0.15)";

  const days = daily.slice(1, 7);
  const temps = days.map((d) => d.tempMax);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const range = max - min || 1;
  const step = W / (days.length - 1 || 1);

  const points = temps.map((t, i) => [i * step, H - ((t - min) / range) * (H - 20) - 10] as const);
  const path = buildSmoothPath(points);

  const convertTemp = (t: number) => (unit === "fahrenheit" ? Math.round((t * 9) / 5 + 32) : Math.round(t));

  const areaPath = `${path} L${points[points.length - 1][0]},${H} L${points[0][0]},${H} Z`;

  return (
    <div className="mt-10">
      <div className="section-label mb-3">Dự báo 6 ngày tới</div>

      <div className="flex justify-between text-xs font-medium text-night-muted mb-2">
        {days.map((d, i) => {
          const active = d.date === selectedDate;
          const dayName = i === 0 ? "Hôm nay" : DAY_NAMES[new Date(d.date).getDay()];
          return (
            <button
              key={d.date}
              onClick={() => setSelectedDate(active ? null : d.date)}
              className={`transition-colors ${active ? "text-night-accent" : "hover:text-night-fg"}`}
            >
              {dayName}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[70px]" preserveAspectRatio="none">
          <defs>
            <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff8a3d" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#ff8a3d" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#forecastFill)" stroke="none" />
          <path d={path} fill="none" stroke={lineColor} strokeWidth="1.5" />
          {points.map(([x, y], i) => {
            const active = days[i].date === selectedDate;
            return active ? (
              <g key={i}>
                <line x1={x} y1={y} x2={x} y2={H + 8} stroke={guideColor} strokeDasharray="2 3" />
                <circle cx={x} cy={y} r="7" fill="#ff8a3d" opacity="0.18" />
                <circle cx={x} cy={y} r="4" fill="#ff8a3d" />
              </g>
            ) : (
              <circle key={i} cx={x} cy={y} r="2.5" fill={dotColor} />
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between mt-1">
        {days.map((d) => {
          const active = d.date === selectedDate;
          return (
            <span
              key={d.date}
              className={`font-light transition-all ${active ? "text-2xl text-night-fg font-normal" : "text-lg text-night-muted"}`}
            >
              {convertTemp(d.tempMax)}°
            </span>
          );
        })}
      </div>
    </div>
  );
}

function buildSmoothPath(points: readonly (readonly [number, number])[]): string {
  if (points.length < 2) return "";
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const mx = (x0 + x1) / 2;
    d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  return d;
}
