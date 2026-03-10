import { useState } from "react";
import { Wind } from "lucide-react";
import { useWeatherStore } from "../../../store/weatherStore";
import { getWeatherInfo, formatHour } from "../../../utils/weatherUtils";
import { motion } from "framer-motion";

export default function HourlyForecast() {
  const { hourly, selectedDate, unit } = useWeatherStore();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  if (!hourly || hourly.length === 0) return null;

  const filteredHourly = selectedDate
    ? hourly.filter((h) => h.time.startsWith(selectedDate))
    : hourly.slice(0, 24);

  if (filteredHourly.length === 0) return null;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
    e.currentTarget.style.cursor = "grabbing";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.style.cursor = "grab";
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.style.cursor = "grab";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 2;
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  const getDateTitle = () => {
    if (!selectedDate) return "Dự báo 24h tới";
    const date = new Date(selectedDate);
    return `Dự báo ${date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "short",
    })}`;
  };

  const convertTemp = (temp: number) => {
    if (unit === "fahrenheit") return Math.round((temp * 9) / 5 + 32);
    return Math.round(temp);
  };

  return (
    <div className="mt-12 mb-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-2 h-12 bg-flat-accent rounded-full"></div>
        <div>
          <h3 className="text-4xl font-black text-flat-fg tracking-tighter uppercase">
            Cận cảnh
          </h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{getDateTitle()}</p>
        </div>
      </div>

      <div className="bg-flat-muted rounded-lg p-6 lg:p-8">
        <div
          className="overflow-x-auto scrollbar-hide select-none px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", cursor: "grab" }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div className="flex gap-6 min-w-max pb-2">
            {filteredHourly.map((h, idx) => {
              const info = getWeatherInfo(h.weatherCode);
              const hourLabel = formatHour(h.time, selectedDate);
              const isNow = hourLabel === "Bây giờ";

              return (
                <motion.div
                  key={h.time}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex flex-col items-center gap-4 p-6 rounded-lg min-w-[120px] transition-all
                    ${isNow ? "bg-white border-4 border-flat-primary scale-105 z-10" : "bg-white/50 hover:bg-white"}
                  `}
                >
                  <span className={`text-xs font-black uppercase tracking-widest ${isNow ? 'text-flat-primary' : 'text-slate-400'}`}>
                    {hourLabel}
                  </span>

                  <span className="text-4xl">{info.icon}</span>

                  <span className="text-3xl font-black">
                    {convertTemp(h.temperature)}°
                  </span>

                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-md">
                    <Wind size={14} className="text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                      {h.windSpeed.toFixed(0)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
