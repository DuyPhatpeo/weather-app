import { useEffect } from "react";
import SearchBar from "./features/weather/components/SearchBar";
import CurrentWeather from "./features/weather/components/CurrentWeather";
import HourlyForecast from "./features/weather/components/HourlyForecast";
import ForecastList from "./features/weather/components/ForecastList";
import { useWeatherStore } from "./store/weatherStore";
import { motion, AnimatePresence } from "framer-motion";
import { CloudRain } from "lucide-react";

export default function App() {
  const { loadWeather, loading, current } = useWeatherStore();

  useEffect(() => {
    loadWeather();
  }, []);

  return (
    <div className="min-h-screen bg-flat-bg p-4 sm:p-8 md:p-12 relative overflow-hidden font-sans">
      {/* Background Poster Elements */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-flat-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-flat-secondary/5 rounded-md rotate-45 -translate-x-1/2 translate-y-1/2 -z-10" />

      <main className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12 md:mb-16">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-8xl font-black text-flat-fg tracking-tighter uppercase leading-[0.9] mb-4"
          >
            Weather <br />
            <span className="text-flat-primary">Forecast</span>
          </motion.h1>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg font-bold text-slate-400 uppercase tracking-widest"
          >
            Dự báo chính xác cho mọi địa điểm 🌤️
          </motion.p>
        </header>

        <SearchBar />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Skeleton UI */}
              <div className="h-96 bg-flat-muted rounded-lg animate-pulse" />
              <div className="h-48 bg-flat-muted rounded-lg animate-pulse" />
              <div className="h-64 bg-flat-muted rounded-lg animate-pulse" />
            </motion.div>
          ) : !current ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-flat-muted rounded-lg p-20 text-center border-4 border-dashed border-slate-200"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-8">
                <CloudRain className="text-slate-300" size={48} />
              </div>
              <h2 className="text-4xl font-black tracking-tight mb-4 uppercase">Chưa có dữ liệu</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest">Tìm kiếm thành phố để bắt đầu</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <CurrentWeather />
              <ForecastList />
              <HourlyForecast />
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-24 py-12 border-t-8 border-flat-muted text-center">
          <p className="text-sm font-black uppercase tracking-widest text-slate-400">
            Weather App &copy; 2026 &bull; <span className="text-flat-primary">DINO PÉO</span>
          </p>
        </footer>
      </main>
    </div>
  );
}
