import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import ForecastList from "./components/ForecastList";
import { useWeatherStore } from "./stores/weatherStore";

export default function App() {
  const [loading, setLoading] = useState(true);
  const loadWeather = useWeatherStore((s) => s.loadWeather);

  // Auto load HCM default weather
  useEffect(() => {
    loadWeather();

    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen p-3 sm:p-6 md:p-8 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 relative overflow-hidden">
      {/* ================= LOADER (fixed center) ================= */}
      {loading && (
        <div className="fixed inset-0 bg-white/90 flex flex-col items-center justify-center z-[9999]">
          <div className="relative w-20 h-20 mb-4">
            {/* Sun */}
            <div className="absolute w-16 h-16 bg-yellow-400 rounded-full animate-pulse" />

            {/* Cloud */}
            <div className="absolute top-6 left-0 w-20 h-10 bg-white rounded-full animate-cloud" />

            {/* Rain */}
            <div className="absolute bottom-0 left-1 w-1 h-4 bg-blue-400 rounded animate-raindrop" />
            <div className="absolute bottom-0 left-5 w-1 h-4 bg-blue-400 rounded animate-raindrop delay-200" />
            <div className="absolute bottom-0 left-10 w-1 h-4 bg-blue-400 rounded animate-raindrop delay-400" />
          </div>

          <p className="text-blue-600 font-semibold text-lg">
            Loading Weather...
          </p>

          {/* Keyframes */}
          <style>{`
            @keyframes cloud {
              0% { transform: translateX(-10px); }
              50% { transform: translateX(10px); }
              100% { transform: translateX(-10px); }
            }
            @keyframes raindrop {
              0% { transform: translateY(0); opacity: 1; }
              80% { opacity: 1; }
              100% { transform: translateY(10px); opacity: 0; }
            }

            .animate-cloud {
              animation: cloud 2s linear infinite;
            }
            .animate-raindrop {
              animation: raindrop 0.6s linear infinite;
            }
            .delay-200 {
              animation-delay: 0.2s;
            }
            .delay-400 {
              animation-delay: 0.4s;
            }
          `}</style>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div
        className={`max-w-5xl mx-auto transition-opacity duration-500 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="mb-6 md:mb-8">
          <h1 className="text-slate-800 text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Weather Forecast
          </h1>
          <p className="text-slate-600 text-base md:text-lg">
            Dự báo thời tiết chính xác cho mọi địa điểm 🌤️
          </p>
        </div>

        <SearchBar />
        <CurrentWeather />
        <ForecastList />
        <HourlyForecast />
      </div>
    </div>
  );
}
