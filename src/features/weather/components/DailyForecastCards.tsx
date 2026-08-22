import { useWeatherStore } from "@/store/weatherStore";
import { CloudRain, CloudSun, Sun, CloudLightning, Wind, Droplets, Thermometer, Sunrise, Sunset, Gauge } from "lucide-react";

export default function DailyForecastCards() {
  const { daily, current } = useWeatherStore();

  if (!daily || daily.length === 0) return null;

  // We skip the first day (yesterday) because fetchWeatherData uses past_days: 1
  const forecastDays = daily.slice(1, 8);
  const today = forecastDays[0];

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const todayStr = new Date().toISOString().split("T")[0];
    if (dateStr === todayStr) return "Hôm nay";
    return date.toLocaleDateString("vi-VN", { weekday: "short" }).toUpperCase();
  };

  const getWeatherIcon = (code: number, size = 24) => {
    if (code === 0) return <Sun size={size} className="text-yellow-400" />;
    if (code <= 3) return <CloudSun size={size} className="text-gray-300" />;
    if (code <= 67) return <CloudRain size={size} className="text-blue-400" />;
    if (code <= 99) return <CloudLightning size={size} className="text-purple-400" />;
    return <CloudSun size={size} />;
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "--:--";
    return new Date(timeStr).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide pt-1 pb-4 -mx-2 px-2">
      {/* Active Card (Today) */}
      <div className={`min-w-[280px] bg-dash-active rounded-3xl p-6 text-dash-active-fg flex flex-col justify-between shadow-lg`}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-lg font-semibold">{getDayName(today?.date || "")}</span>
            <span className="text-sm font-medium">{formatTime(current?.time)}</span>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="text-5xl font-bold">{Math.round(current?.temperature || 0)}°</div>
            {getWeatherIcon(current?.weatherCode || 0, 48)}
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 opacity-80">
              <Thermometer size={14} />
              Cảm giác {Math.round(current?.apparentTemperature || 0)}°
            </div>
            <div className="flex items-center gap-1.5 opacity-80">
              <Sunrise size={14} />
              Bình minh {formatTime(current?.sunrise)}
            </div>
            <div className="flex items-center gap-1.5 opacity-80">
              <Wind size={14} />
              Gió {current?.windSpeed}km/h
            </div>
            <div className="flex items-center gap-1.5 opacity-80">
              <Sunset size={14} />
              Hoàng hôn {formatTime(current?.sunset)}
            </div>
            <div className="flex items-center gap-1.5 opacity-80">
              <Gauge size={14} />
              Áp suất {current?.pressure}MB
            </div>
            <div className="flex items-center gap-1.5 opacity-80">
              <Droplets size={14} />
              Độ ẩm {current?.humidity}%
            </div>
          </div>
        </div>

      {/* Other Days */}
      {forecastDays.map((day, idx) => {
        const isToday = idx === 0;
        return (
          <div key={idx} className={`min-w-[90px] bg-dash-panel rounded-[2rem] p-4 flex flex-col items-center justify-between shadow-sm ${isToday ? 'ring-2 ring-dash-active' : ''}`}>
            <span className="text-sm font-medium text-night-muted uppercase tracking-wider whitespace-nowrap">
              {getDayName(day.date)}
            </span>
            <div className="my-4 drop-shadow-md">
              {getWeatherIcon(day.weatherCode, 32)}
            </div>
            <span className="text-xl font-semibold text-night-fg">
              {Math.round(day.tempMax)}°
            </span>
          </div>
        );
      })}
    </div>
  );
}
