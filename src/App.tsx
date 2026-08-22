import { useEffect, useState } from "react";
import Header from "./features/weather/components/Header";
import DailyForecastCards from "./features/weather/components/DailyForecastCards";
import HourlyList from "./features/weather/components/HourlyList";
import DailyForecastCalendar from "./features/weather/components/DailyForecastCalendar";
import TodaysOverview from "./features/weather/components/TodaysOverview";
import Insights from "./features/weather/components/Insights";
import AlertBanner from "./features/weather/components/AlertBanner";
import ChanceOfRainChart from "./features/weather/components/ChanceOfRainChart";
import RecentCities from "./features/weather/components/RecentCities";
import WeatherMap from "./features/weather/components/WeatherMap";
import SettingsModal from "./features/weather/components/SettingsModal";
import { useWeatherStore } from "./store/weatherStore";
import { motion, AnimatePresence } from "framer-motion";
import { CloudRain, Loader2 } from "lucide-react";
import AqiWidget from "./features/weather/components/AqiWidget";

export default function App() {
  const { loadWeather, loading, current, error, theme, lat, lon, city } = useWeatherStore();
  const [showMap, setShowMap] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadWeather();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="min-h-screen w-full bg-dash-bg flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-[1400px] px-6 lg:px-12 pt-6 pb-12 flex flex-col min-h-screen">
        <Header onOpenSettings={() => setShowSettings(true)} onOpenMap={() => setShowMap(true)} />

        <main className="flex-1 w-full mt-4">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[60vh] flex items-center justify-center text-night-muted gap-3"
              >
                <Loader2 className="animate-spin" size={20} />
                <span className="text-sm">Đang tải dữ liệu thời tiết...</span>
              </motion.div>
            ) : error || !current ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-[60vh] flex flex-col items-center justify-center text-center gap-4"
              >
                <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-night-accent shadow-[0_0_40px_-8px_var(--color-night-accent)]">
                  <CloudRain size={28} />
                </div>
                <h2 className="text-xl font-medium text-night-fg">Chưa có dữ liệu</h2>
                <p className="text-sm text-night-muted max-w-xs">
                  {error ?? "Tìm một thành phố để xem dự báo thời tiết."}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-8 items-start"
              >
                {/* Left column */}
                <div className="flex flex-col min-w-0">
                  <AlertBanner />
                  <DailyForecastCards />
                  <HourlyList />
                  <TodaysOverview />
                  <Insights />
                  <AqiWidget />
                  <DailyForecastCalendar />
                </div>

                {/* Right rail */}
                <div className="flex flex-col min-w-0 pt-2 lg:pl-4 border-t lg:border-t-0 lg:border-l border-night-border/50">
                  <ChanceOfRainChart />
                  <RecentCities />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <WeatherMap 
        lat={lat} 
        lon={lon} 
        city={city} 
        isOpen={showMap} 
        onClose={() => setShowMap(false)} 
        theme={theme} 
      />
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
}
