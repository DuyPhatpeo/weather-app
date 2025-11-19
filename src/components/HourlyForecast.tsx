import { useState } from "react";
import { Wind } from "lucide-react";
import { useWeatherStore } from "../stores/weatherStore";
import { getWeatherInfo, formatHour } from "../utils/weatherUtils";

export default function HourlyForecast() {
  const hourly = useWeatherStore((s) => s.hourly);
  const selectedDate = useWeatherStore((s) => s.selectedDate);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  if (!hourly || hourly.length === 0) return null;

  // Filter hourly data based on selected date
  const filteredHourly = selectedDate
    ? hourly.filter((h) => h.time.startsWith(selectedDate))
    : hourly.slice(0, 24); // Show only first 24 hours if no date selected

  if (filteredHourly.length === 0) return null;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.currentTarget) return;
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
    if (!selectedDate) return "Dự báo hôm nay";
    const date = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) return "Dự báo hôm nay";
    if (compareDate.getTime() === tomorrow.getTime()) return "Dự báo ngày mai";

    return `Dự báo ${date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })}`;
  };

  return (
    <div className="mt-6">
      <h3 className="text-slate-800 text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2">
        <div className="w-1 h-5 md:h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
        <span className="text-sm md:text-xl">{getDateTitle()}</span>
      </h3>
      <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl border border-slate-200">
        <div
          className="overflow-x-auto -mx-4 md:-mx-6 px-4 md:px-6 select-none"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            cursor: "grab",
          }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <style>{`
            .hourly-scroll::-webkit-scrollbar {
              display: none;
            }
            .hourly-scroll:active {
              cursor: grabbing;
            }
          `}</style>
          <div
            className="flex gap-4 md:gap-6 pb-2 hourly-scroll"
            style={{ minWidth: "max-content" }}
          >
            {filteredHourly.map((h) => {
              const weatherInfo = getWeatherInfo(h.weatherCode);
              const hourLabel = formatHour(h.time, selectedDate);
              const isNow = hourLabel === "Bây giờ";

              return (
                <div
                  key={h.time}
                  className={`flex flex-col items-center gap-2 md:gap-3 min-w-[70px] md:min-w-[90px] p-3 md:p-4 rounded-xl md:rounded-2xl transition-all ${
                    isNow
                      ? "bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 shadow-md"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <p
                    className={`text-xs md:text-sm font-semibold ${
                      isNow ? "text-blue-600" : "text-slate-600"
                    }`}
                  >
                    {hourLabel}
                  </p>
                  <div className="text-3xl md:text-4xl drop-shadow">
                    {weatherInfo.icon}
                  </div>
                  <p className="text-slate-800 text-xl md:text-2xl font-bold">
                    {Math.round(h.temperature)}°
                  </p>
                  <div className="flex items-center gap-1 md:gap-1.5 text-slate-500 text-xs bg-slate-100 px-2 md:px-2.5 py-1 rounded-full">
                    <Wind size={10} className="md:hidden" />
                    <Wind size={12} className="hidden md:block" />
                    <span className="font-medium text-[10px] md:text-xs">
                      {h.windSpeed?.toFixed(0) ?? "0"}
                    </span>
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
