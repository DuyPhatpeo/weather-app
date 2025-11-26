import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import ForecastList from "./components/ForecastList";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập delay 1s để demo loader
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 p-3 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Loader overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-50">
          {/* Sun */}
          <div className="relative w-20 h-20 mb-4">
            <div className="absolute w-16 h-16 bg-yellow-400 rounded-full animate-pulse"></div>
            {/* Cloud */}
            <div className="absolute top-6 left-0 w-20 h-10 bg-white rounded-full animate-[cloudMove_2s_linear_infinite]"></div>
            {/* Rain drops */}
            <div className="absolute bottom-0 left-1 w-1 h-4 bg-blue-400 rounded animate-[raindrop_0.6s_linear_infinite]"></div>
            <div className="absolute bottom-0 left-5 w-1 h-4 bg-blue-400 rounded animate-[raindrop_0.6s_0.2s_linear_infinite]"></div>
            <div className="absolute bottom-0 left-10 w-1 h-4 bg-blue-400 rounded animate-[raindrop_0.6s_0.4s_linear_infinite]"></div>
          </div>
          <p className="text-blue-600 font-semibold text-lg">
            Loading Weather...
          </p>

          <style>{`
            @keyframes cloudMove {
              0% { transform: translateX(-10px); }
              50% { transform: translateX(10px); }
              100% { transform: translateX(-10px); }
            }
            @keyframes raindrop {
              0% { transform: translateY(0); opacity: 1; }
              80% { opacity: 1; }
              100% { transform: translateY(10px); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* App Content */}
      <div
        className="max-w-5xl mx-auto opacity-0 animate-fadeIn"
        style={{
          animationFillMode: "forwards",
          animationDelay: "0.5s",
          animationDuration: "0.5s",
        }}
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
        <HourlyForecast />
        <ForecastList />
      </div>

      {/* Tailwind fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation-name: fadeIn;
        }
      `}</style>
    </div>
  );
}
