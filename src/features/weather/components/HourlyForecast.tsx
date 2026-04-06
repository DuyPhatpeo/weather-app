import { Wind, Clock, Droplets } from "lucide-react";
import { useWeatherStore } from "../../../store/weatherStore";
import { getWeatherInfo, formatHour, getTemperatureColor } from "../../../utils/weatherUtils";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function HourlyForecast() {
  const { hourly, selectedDate, unit } = useWeatherStore();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current && !selectedDate) {
      const nowItem = scrollContainerRef.current.querySelector('[data-now="true"]');
      if (nowItem) {
        nowItem.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    }
  }, [hourly, selectedDate]);

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

  const convertTemp = (temp: number) => {
    if (unit === "fahrenheit") return Math.round((temp * 9) / 5 + 32);
    return Math.round(temp);
  };

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-flat-fg text-white flex items-center justify-center rounded-lg border-2 border-flat-border">
            <Clock size={20} />
          </div>
          <h3 className="text-3xl font-black text-flat-fg tracking-tighter uppercase">
            Dự báo <span className="text-slate-400">theo giờ</span>
          </h3>
        </div>
        {!selectedDate && (
          <span className="px-3 py-1 bg-flat-border text-[10px] font-black uppercase tracking-widest text-flat-fg rounded-md">24 giờ tới</span>
        )}
      </div>

      <div className="relative group">
        {/* Scroll Indicators (Faded borders) */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-flat-bg to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-flat-bg to-transparent z-20 pointer-events-none" />

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide select-none p-4 py-12"
          style={{ cursor: "grab" }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div className="flex gap-6 min-w-max">
            {filteredHourly.map((h, idx) => {
              const info = getWeatherInfo(h.weatherCode);
              const hourLabel = formatHour(h.time, selectedDate);
              const isNow = hourLabel === "Bây giờ";

              return (
                <motion.div
                  key={h.time}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  data-now={isNow}
                  className={`flex flex-col items-center gap-6 p-8 rounded-2xl min-w-[160px] border-4 transition-all
                    ${isNow
                      ? "bg-white border-flat-primary shadow-[12px_12px_0px_0px_rgba(37,99,235,1)] z-10"
                      : "bg-white border-flat-border hover:border-slate-400 hover:-translate-y-1"}
                  `}
                >
                  <span className={`text-xs font-black uppercase tracking-[0.2em] ${isNow ? 'text-flat-primary' : 'text-slate-400'}`}>
                    {hourLabel}
                  </span>

                  <div className="relative">
                    <span className={`text-5xl ${isNow ? 'animate-float inline-block' : ''}`}>{info.icon}</span>
                    {isNow && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />}
                  </div>

                  <span className={`text-4xl font-black ${getTemperatureColor(h.temperature).text}`}>
                    {convertTemp(h.temperature)}°
                  </span>

                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg border-2 border-flat-muted bg-flat-muted/50">
                      <Wind size={14} className="text-slate-400" />
                      <span className="text-xs font-black tracking-widest text-flat-fg">
                        {h.windSpeed.toFixed(0)}
                      </span>
                    </div>
                    {h.precipitationProbability !== undefined && (
                      <div className="flex items-center justify-between px-3 py-1.5 rounded-lg border-2 border-blue-100 bg-blue-50/50">
                        <Droplets size={14} className="text-blue-500" />
                        <span className="text-xs font-black tracking-widest text-blue-600">
                          {h.precipitationProbability}%
                        </span>
                      </div>
                    )}
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
