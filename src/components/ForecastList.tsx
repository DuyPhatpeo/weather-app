import { useWeatherStore } from "../stores/weatherStore";
import { getWeatherInfo } from "../utils/weatherUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function ForecastList() {
  const daily = useWeatherStore((s) => s.daily);
  const selectedDate = useWeatherStore((s) => s.selectedDate);
  const setSelectedDate = useWeatherStore((s) => s.setSelectedDate);

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

  return (
    <div className="mt-10 select-none">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-2 h-10 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full shadow-lg"></div>
        <div>
          <h3 className="text-3xl font-bold text-slate-900">
            Dự báo thời tiết
          </h3>
          <p className="text-sm text-slate-500 mt-1">10 ngày tới</p>
        </div>
      </div>

      {/* Scroll area */}
      <div className="relative -mx-6 px-6 py-2">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-xl border hover:border-blue-400 hover:bg-blue-50 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-xl border hover:border-blue-400 hover:bg-blue-50 active:scale-95 transition-all"
          >
            <ChevronRight className="w-6 h-6 text-slate-700" />
          </button>
        )}

        <div ref={scrollRef} className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 min-w-max pb-4">
            {daily.slice(0, 10).map((d) => {
              const info = getWeatherInfo(d.weatherCode);
              const active = selectedDate === d.date;
              const dateObj = new Date(d.date);

              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const diff = Math.floor(
                (dateObj.getTime() - today.getTime()) / 86400000
              );

              // ❌ Loại bỏ "Hôm qua"
              const dayLabel =
                diff === 0
                  ? "Hôm nay"
                  : ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][
                      dateObj.getDay()
                    ];

              return (
                <div
                  key={d.date}
                  onClick={() => setSelectedDate(active ? null : d.date)}
                  className={`
                    relative w-32 h-40 p-4 rounded-2xl cursor-pointer flex flex-col border
                    ${
                      active
                        ? "bg-white text-slate-900 shadow-lg border-blue-300"
                        : "bg-white/90 text-slate-800 border-gray-200 shadow-sm"
                    }
                    transition-all
                    /* ❌ bỏ scale khi hover & khi active */
                  `}
                >
                  {/* Day + Label */}
                  <div className="flex justify-between text-xs font-semibold opacity-90">
                    <span className="text-lg font-bold">
                      {dateObj.getDate()}
                    </span>
                    <span>{dayLabel}</span>
                  </div>

                  {/* Icon + temp */}
                  <div className="flex items-center justify-center gap-4 flex-1 mt-2">
                    <div className="text-4xl text-slate-700">{info.icon}</div>

                    <div className="flex flex-col leading-tight text-right">
                      <span className="text-lg font-bold">
                        {Math.round(d.tempMax)}°
                      </span>
                      <span className="text-sm opacity-70">
                        {Math.round(d.tempMin)}°
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
