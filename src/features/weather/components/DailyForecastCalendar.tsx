import { useState } from "react";
import { useWeatherStore } from "@/store/weatherStore";
import { getWeatherInfo } from "@/utils/weatherUtils";

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const FILTERS = [10, 15, 30];

export default function DailyForecastCalendar() {
  const { daily } = useWeatherStore();
  const [days, setDays] = useState(15);

  if (!daily || daily.length === 0) return null;

  // Skip the first entry (yesterday, from past_days: 1); API caps at 16 real days
  const forecastDays = daily.slice(1, 1 + days);

  const todayStr = new Date().toISOString().split("T")[0];
  const firstDow = new Date(forecastDays[0].date).getDay();
  const cells = [...Array(firstDow).fill(null), ...forecastDays];

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4 text-night-fg">
        Dự báo thời tiết {forecastDays.length} ngày tới
      </h2>

      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setDays(f)}
            className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${
              days === f
                ? "border-night-accent text-night-accent"
                : "border-night-border text-night-muted hover:text-night-fg"
            }`}
          >
            {f === 1 ? "Ngày mai" : `${f} ngày`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-x-2 mb-2">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-xs font-semibold text-night-muted text-center">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-x-2 gap-y-4 border-t border-night-border/50 pt-4">
        {cells.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} />;
          const isToday = d.date === todayStr;
          return (
            <div
              key={d.date}
              className={`flex flex-col items-center gap-2 text-center py-1 rounded-xl ${
                isToday ? "bg-night-accent/10 ring-1 ring-night-accent" : ""
              }`}
            >
              <span className={`text-xs ${isToday ? "text-night-accent font-semibold" : "text-night-muted"}`}>
                {isToday ? "Hôm nay" : new Date(d.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}
              </span>
              <span className="text-2xl">{getWeatherInfo(d.weatherCode).icon}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
