import { MapPin, Wind, Droplets, Sun, Eye } from "lucide-react";
import { useWeatherStore } from "../../../store/weatherStore";
import { getWeatherInfo } from "../../../utils/weatherUtils";
import { motion } from "framer-motion";

const getFlatColorByCode = (code: number): string => {
  if ([0, 1].includes(code)) return "bg-flat-primary"; // Clear/Sunny - Blue
  if ([2, 3, 45, 48].includes(code)) return "bg-slate-500"; // Cloudy/Fog - Gray
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "bg-flat-secondary"; // Rain - Emerald
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "bg-cyan-500"; // Snow
  return "bg-slate-800"; // Storm
};

export default function CurrentWeather() {
  const { current, city, loading, error, unit, setUnit } = useWeatherStore();

  if (loading) return null; // We use skeletons in App.tsx

  if (error) {
    return (
      <div className="bg-red-100 border-4 border-red-500 p-8 text-center rounded-lg mb-8">
        <p className="text-red-700 text-xl font-bold mb-4">⚠️ {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="flat-button-primary bg-red-500 hover:bg-red-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!current) return null;

  const weatherInfo = getWeatherInfo(current.weatherCode);
  const bgColorClass = getFlatColorByCode(current.weatherCode);

  const convertTemp = (temp: number) => {
    if (unit === "fahrenheit") return Math.round((temp * 9) / 5 + 32);
    return Math.round(temp);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${bgColorClass} text-white rounded-lg p-8 mb-8 relative overflow-hidden`}
    >
      {/* Dynamic Background Decoration */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full" />
      <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-white/5 rounded-full" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={24} className="text-white/80" />
              <h2 className="text-3xl font-extrabold">{city}</h2>
            </div>
            <p className="text-white/80 font-medium uppercase tracking-widest text-sm">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>

          <div className="flex bg-white/20 p-1 rounded-md">
            <button
              onClick={() => setUnit("celsius")}
              className={`px-4 py-2 rounded-md font-bold transition-all ${unit === "celsius" ? "bg-white text-flat-fg scale-105" : "text-white hover:bg-white/10"
                }`}
            >
              °C
            </button>
            <button
              onClick={() => setUnit("fahrenheit")}
              className={`px-4 py-2 rounded-md font-bold transition-all ${unit === "fahrenheit" ? "bg-white text-flat-fg scale-105" : "text-white hover:bg-white/10"
                }`}
            >
              °F
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="text-9xl font-black tracking-tighter">
            {convertTemp(current.temperature)}°
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-8xl mb-2">{weatherInfo.icon}</span>
            <span className="text-3xl font-bold uppercase tracking-tight">{weatherInfo.desc}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 p-6 rounded-lg group hover:bg-white/20 transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-4">
              <Wind size={20} className="text-white/80" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Gió</span>
            </div>
            <div className="text-2xl font-black">{current.windSpeed} <span className="text-sm font-medium">km/h</span></div>
          </div>

          <div className="bg-white/10 p-6 rounded-lg group hover:bg-white/20 transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-4">
              <Droplets size={20} className="text-white/80" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Độ ẩm</span>
            </div>
            <div className="text-2xl font-black">{current.humidity}%</div>
          </div>

          <div className="bg-white/10 p-6 rounded-lg group hover:bg-white/20 transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-4">
              <Sun size={20} className="text-white/80" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">UV Index</span>
            </div>
            <div className="text-2xl font-black">{current.uvIndex ?? "N/A"}</div>
          </div>

          <div className="bg-white/10 p-6 rounded-lg group hover:bg-white/20 transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-4">
              <Eye size={20} className="text-white/80" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Tầm nhìn</span>
            </div>
            <div className="text-2xl font-black">{((current.visibility ?? 0) / 1000).toFixed(1)} <span className="text-sm font-medium">km</span></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
