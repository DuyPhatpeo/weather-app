import { useWeatherStore } from "../../../store/weatherStore";
import { getWeatherInfo } from "../../../utils/weatherUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 150);
  };

  const convertTemp = (temp: number) => {
    if (unit === "fahrenheit") return Math.round((temp * 9) / 5 + 32);
    return Math.round(temp);
  };

  return (
    <div className="mt-12 select-none">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-2 h-12 bg-flat-primary rounded-full"></div>
          <div>
            <h3 className="text-4xl font-black text-flat-fg tracking-tighter uppercase">
              Dự báo
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">10 ngày tới</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="flat-button-secondary h-10 w-10 p-0 flex items-center justify-center disabled:opacity-20"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="flat-button-secondary h-10 w-10 p-0 flex items-center justify-center disabled:opacity-20"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide py-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex gap-4 min-w-max">
            {daily.map((d, idx) => {
              const info = getWeatherInfo(d.weatherCode);
              const active = selectedDate === d.date;
              const dateObj = new Date(d.date);

              const dayLabel = idx === 0 ? "Hôm nay" : idx === 1 ? "Ngày mai" :
                ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][dateObj.getDay()];

              return (
                <motion.div
                  key={d.date}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDate(active ? null : d.date)}
                  className={`
                    w-40 p-6 rounded-lg cursor-pointer flex flex-col items-center gap-4 transition-all duration-200
                    ${active
                      ? "bg-flat-primary text-white scale-105"
                      : "bg-flat-muted text-flat-fg hover:bg-gray-200"
                    }
                  `}
                >
                  <span className="text-xs font-black uppercase tracking-widest opacity-70">
                    {dayLabel}
                  </span>

                  <span className="text-5xl">{info.icon}</span>

                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black">
                      {convertTemp(d.tempMax)}°
                    </span>
                    <span className="text-sm font-bold opacity-50">
                      {convertTemp(d.tempMin)}°
                    </span>
                  </div>

                  {d.uvIndex != null && (
                    <div className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-1 rounded ${active ? 'bg-white/20' : 'bg-white'}`}>
                      UV: {Math.round(d.uvIndex)}
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
