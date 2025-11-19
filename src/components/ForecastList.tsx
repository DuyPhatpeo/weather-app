import { useWeatherStore } from "../stores/weatherStore";
import { getWeatherInfo, formatDate } from "../utils/weatherUtils";

export default function ForecastList() {
  const daily = useWeatherStore((s) => s.daily);
  const forecastDays = useWeatherStore((s) => s.forecastDays);
  const setForecastDays = useWeatherStore((s) => s.setForecastDays);
  const selectedDate = useWeatherStore((s) => s.selectedDate);
  const setSelectedDate = useWeatherStore((s) => s.setSelectedDate);

  if (!daily || daily.length === 0) return null;

  const dayOptions = [3, 5, 7, 10, 14];

  return (
    <div className="mt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 md:mb-4">
        <h3 className="text-slate-800 text-lg md:text-xl font-bold flex items-center gap-2">
          <div className="w-1 h-5 md:h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
          <span className="text-sm md:text-xl">Dự báo {forecastDays} ngày</span>
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
          {dayOptions.map((days) => (
            <button
              key={days}
              onClick={() => setForecastDays(days)}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm md:text-base font-medium transition-all whitespace-nowrap ${
                forecastDays === days
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl border border-slate-200">
        <div className="space-y-2">
          {daily.map((d, idx) => {
            const weatherInfo = getWeatherInfo(d.weatherCode);
            const dateInfo = formatDate(d.date);
            const isToday = idx === 0;
            const isSelected = selectedDate === d.date;

            return (
              <div
                key={d.date}
                onClick={() => setSelectedDate(isSelected ? null : d.date)}
                className={`flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-500 shadow-lg"
                    : isToday
                    ? "bg-gradient-to-r from-blue-50 to-transparent border-l-4 border-blue-400 hover:bg-blue-50"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3 md:gap-5 flex-1 min-w-0">
                  <div className="min-w-[90px] md:min-w-[110px]">
                    <p
                      className={`font-bold text-sm md:text-base ${
                        isSelected
                          ? "text-blue-700"
                          : isToday
                          ? "text-blue-600"
                          : "text-slate-800"
                      }`}
                    >
                      {dateInfo.main}
                    </p>
                    <p className="text-slate-500 text-xs md:text-sm">
                      {dateInfo.sub}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                    <div className="text-3xl md:text-5xl drop-shadow flex-shrink-0">
                      {weatherInfo.icon}
                    </div>
                    <p className="text-slate-600 text-xs md:text-sm font-medium hidden lg:block truncate">
                      {weatherInfo.desc}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="flex items-baseline gap-1.5 md:gap-2">
                    <span className="text-slate-800 text-xl md:text-3xl font-bold">
                      {Math.round(d.tempMax)}°
                    </span>
                    <span className="text-slate-400 text-base md:text-xl font-medium">
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
  );
}
