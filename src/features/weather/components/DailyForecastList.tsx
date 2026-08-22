import { useWeatherStore } from "@/store/weatherStore";
import { getWeatherInfo } from "@/utils/weatherUtils";
import { Droplet } from "lucide-react";
import { motion } from "framer-motion";

const DAY_NAMES = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

export default function DailyForecastList() {
  const { daily, unit } = useWeatherStore();

  if (!daily || daily.length === 0) return null;

  const convertTemp = (t: number) => (unit === "fahrenheit" ? Math.round((t * 9) / 5 + 32) : Math.round(t));

  return (
    <div>
      <div className="section-label mb-4">Dự báo mở rộng ({daily.length - 1} ngày)</div>
      <div className="flex flex-col gap-2">
        {daily.slice(1).map((d, i) => {
          const info = getWeatherInfo(d.weatherCode);
          const dateObj = new Date(d.date);
          const dayName = i === 0 ? "Ngày mai" : DAY_NAMES[dateObj.getDay()];
          const dateStr = dateObj.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });

          return (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              key={d.date}
              title={info.desc}
              className="glass-panel card-hover rounded-xl px-3 py-2.5 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium text-night-fg truncate">{dayName}</div>
                <div className="text-[11px] text-night-muted">{dateStr}</div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {d.precipitationSum !== undefined && d.precipitationSum > 0 && (
                  <span className="text-[10px] font-medium text-sky-400 flex items-center gap-0.5">
                    <Droplet size={10} fill="currentColor" />
                    {d.precipitationSum.toFixed(1)}
                  </span>
                )}
                <span className="text-xl leading-none">{info.icon}</span>
                <div className="flex gap-1.5 text-sm font-medium w-[52px] justify-end shrink-0">
                  <span className="text-night-fg">{convertTemp(d.tempMax)}°</span>
                  <span className="text-night-muted">{convertTemp(d.tempMin)}°</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
