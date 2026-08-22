import { useRef } from "react";
import { motion } from "framer-motion";
import { useWeatherStore } from "@/store/weatherStore";
import { getWeatherInfo, formatHour } from "@/utils/weatherUtils";
import { CloudRain } from "lucide-react";

export default function HourlyList() {
  const { hourly, selectedDate, unit } = useWeatherStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!hourly) return null;

  const data = (selectedDate ? hourly.filter((h) => h.time.startsWith(selectedDate)) : hourly.slice(0, 24)) ?? [];

  const convertTemp = (t: number) => (unit === "fahrenheit" ? Math.round((t * 9) / 5 + 32) : Math.round(t));

  return (
    <div className="mt-8">
      <div className="section-label mb-4 px-1">Dự báo theo giờ</div>
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-3 pb-4 snap-x scrollbar-hide"
      >
        {data.map((h, i) => {
          const info = getWeatherInfo(h.weatherCode);
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              key={h.time}
              className="snap-start shrink-0 w-[80px] glass-panel card-hover rounded-2xl p-3 flex flex-col items-center justify-between gap-3"
            >
              <div className="text-xs text-night-muted">{formatHour(h.time, selectedDate)}</div>
              
              <div className="text-2xl drop-shadow-sm">{info.icon}</div>
              
              <div className="text-base font-semibold text-night-fg">{convertTemp(h.temperature)}°</div>
              
              {h.precipitationProbability !== undefined && h.precipitationProbability > 0 ? (
                <div className="text-[10px] text-[#3b82f6] flex items-center gap-0.5 font-medium">
                  <CloudRain size={10} />
                  {h.precipitationProbability}%
                </div>
              ) : (
                <div className="h-[14px]"></div> // Spacer to keep layout aligned
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
