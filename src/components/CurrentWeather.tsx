import { MapPin, Wind, Droplets, CloudRain, Loader2 } from "lucide-react";
import { useWeatherStore } from "../stores/weatherStore";
import { getWeatherInfo } from "../utils/weatherUtils";

const getBackgroundByTemp = (temp: number): string => {
  if (temp <= 10) return "from-blue-600 to-blue-800"; // lạnh
  if (temp <= 20) return "from-cyan-500 to-blue-600"; // mát
  if (temp <= 28) return "from-yellow-400 to-orange-500"; // ấm
  return "from-red-500 to-orange-600"; // nóng
};

export default function CurrentWeather() {
  const current = useWeatherStore((s) => s.current);
  const city = useWeatherStore((s) => s.city);
  const loading = useWeatherStore((s) => s.loading);
  const error = useWeatherStore((s) => s.error);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xl">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
        <p className="text-slate-600 font-medium">
          Đang tải dữ liệu thời tiết...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 text-center">
        <p className="text-red-600 text-lg font-medium">⚠️ {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-16 text-center shadow-xl border border-slate-200">
        <div className="inline-block p-6 bg-white rounded-full mb-6 shadow-lg">
          <CloudRain className="text-slate-400" size={64} />
        </div>
        <p className="text-slate-600 text-xl font-medium">
          Tìm kiếm thành phố để xem thời tiết
        </p>
        <p className="text-slate-400 text-sm mt-2">
          Nhập tên thành phố hoặc sử dụng vị trí hiện tại
        </p>
        <p className="text-slate-400 text-sm mt-1 italic flex items-center justify-center gap-1">
          💡 Nhấn
          <kbd className="px-2 py-1 bg-slate-200 text-slate-800 rounded border border-slate-300 font-semibold">
            Ctrl
          </kbd>
          +
          <kbd className="px-2 py-1 bg-slate-200 text-slate-800 rounded border border-slate-300 font-semibold">
            K
          </kbd>
          để mở nhanh thanh tìm kiếm
        </p>
      </div>
    );
  }

  const weatherInfo = getWeatherInfo(current.weatherCode);
  const bgColor = getBackgroundByTemp(current.temperature);

  return (
    <div
      className={`bg-gradient-to-br ${bgColor} rounded-3xl p-6 md:p-8 shadow-2xl text-white transition-all duration-500`}
    >
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6 md:mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={16} className="text-blue-200 flex-shrink-0" />
            <h2 className="text-white text-base md:text-lg font-semibold truncate">
              {city || "Địa điểm"}
            </h2>
          </div>
          <p className="text-blue-100 text-xs md:text-sm">
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="text-6xl md:text-7xl drop-shadow-lg">
          {weatherInfo.icon}
        </div>
      </div>

      <div className="mb-6 md:mb-8">
        <div className="text-6xl md:text-7xl font-bold mb-2 md:mb-3 drop-shadow-lg">
          {Math.round(current.temperature)}°C
        </div>
        <p className="text-blue-100 text-lg md:text-xl font-medium">
          {weatherInfo.desc}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-white/20">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 bg-white/20 rounded-lg">
              <Wind className="text-white" size={18} />
            </div>
            <span className="text-blue-100 text-xs md:text-sm font-medium">
              Tốc độ gió
            </span>
          </div>
          <p className="text-white text-2xl md:text-3xl font-bold">
            {current.windSpeed?.toFixed(1) ?? "0"}
            <span className="text-sm md:text-lg font-normal text-blue-100 ml-1">
              m/s
            </span>
          </p>
        </div>

        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-white/20">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 bg-white/20 rounded-lg">
              <Droplets className="text-white" size={18} />
            </div>
            <span className="text-blue-100 text-xs md:text-sm font-medium">
              Độ ẩm
            </span>
          </div>
          <p className="text-white text-2xl md:text-3xl font-bold">
            {current.humidity ?? "0"}
            <span className="text-sm md:text-lg font-normal text-blue-100 ml-1">
              %
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
