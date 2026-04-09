import { useWeatherStore } from "../../../store/weatherStore";
import { getWeatherInfo, getTemperatureColor } from "../../../utils/weatherUtils";
import { ChevronLeft, ChevronRight, Calendar, Sunrise, Sunset } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ForecastList() {
  const { daily, selectedDate, setSelectedDate, unit } = useWeatherStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [daily]);

  if (!daily?.length) return null;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 300);
  };

  const convertTemp = (temp: number) => {
    if (unit === "fahrenheit") return Math.round((temp * 9) / 5 + 32);
    return Math.round(temp);
  };

  return (
    <div className="mt-16 select-none">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-flat-fg text-white flex items-center justify-center rounded-lg border-2 border-flat-border">
            <Calendar size={20} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-flat-fg tracking-tighter uppercase">
              Dự báo <span className="text-slate-400">dài hạn</span>
            </h3>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="flat-button-secondary h-12 w-12 p-0 flex items-center justify-center disabled:opacity-20 transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="flat-button-secondary h-12 w-12 p-0 flex items-center justify-center disabled:opacity-20 transition-all active:scale-90"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide py-10 px-4 -mx-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex gap-10 min-w-max">
            {daily.map((d, idx) => {
              const info = getWeatherInfo(d.weatherCode);
              const active = selectedDate === d.date;
              const dateObj = new Date(d.date);

              const dayName = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][dateObj.getDay()];
              const dateLabel = dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

              return (
                <motion.div
                  key={d.date}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={(e) => {
                    setSelectedDate(active ? null : d.date);
                    if (!active) {
                      e.currentTarget.scrollIntoView({
                        behavior: "smooth",
                        inline: "center",
                        block: "nearest"
                      });
                    }
                  }}
                  className={`
                    w-44 p-8 rounded-2xl cursor-pointer flex flex-col items-center gap-6 border-4 transition-all duration-300
                    ${active
                      ? "bg-white border-flat-primary scale-110 shadow-[12px_12px_0px_0px_rgba(37,99,235,1)] z-10"
                      : "bg-white border-flat-border hover:border-slate-400 hover:-translate-y-1"
                    }
                  `}
                >
                  <div className="text-center">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${active ? 'text-flat-primary' : 'text-slate-400'}`}>
                      {idx === 0 ? "Hôm qua" : idx === 1 ? "Hôm nay" : dayName}
                    </span>
                    <div className="text-sm font-black text-flat-fg">{dateLabel}</div>
                  </div>

                  <span className={`text-6xl ${active ? 'animate-float inline-block' : ''}`}>{info.icon}</span>

                  <div className="text-center">
                    <div className={`text-3xl font-black leading-none mb-1 ${getTemperatureColor(d.tempMax).text}`}>
                      {convertTemp(d.tempMax)}°
                    </div>
                    <div className="text-sm font-bold text-slate-400">
                      {convertTemp(d.tempMin)}°
                    </div>
                  </div>

                  {/* Sun Info */}
                  <div className="flex flex-col gap-2 w-full mt-2">
                    {d.sunrise && (
                      <div className="flex items-center justify-between px-3 py-1.5 rounded-lg border-2 border-amber-100 bg-amber-50/50">
                        <Sunrise size={14} className="text-amber-500" />
                        <span className="text-[10px] font-black tracking-widest text-amber-600">
                          {new Date(d.sunrise).toLocaleTimeString('vi-VN', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    {d.sunset && (
                      <div className="flex items-center justify-between px-3 py-1.5 rounded-lg border-2 border-rose-100 bg-rose-50/50">
                        <Sunset size={14} className="text-rose-500" />
                        <span className="text-[10px] font-black tracking-widest text-rose-600">
                          {new Date(d.sunset).toLocaleTimeString('vi-VN', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>

                  {d.uvIndex != null && (
                    <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border-2 w-full text-center ${active ? 'bg-flat-primary/10 border-flat-primary text-flat-primary' : 'bg-flat-muted border-flat-border text-slate-500'}`}>
                      UV {Math.round(d.uvIndex)}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
