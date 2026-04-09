import { useEffect } from "react";
import SearchBar from "./features/weather/components/SearchBar";
import CurrentWeather from "./features/weather/components/CurrentWeather";
import HourlyForecast from "./features/weather/components/HourlyForecast";
import ForecastList from "./features/weather/components/ForecastList";
import WeatherAdvice from "./features/weather/components/WeatherAdvice";
import EnvironmentalDashboard from "./features/weather/components/EnvironmentalDashboard";
import WeatherChart from "./features/weather/components/WeatherChart";
import DynamicBackground from "./features/weather/components/DynamicBackground";
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
      <DynamicBackground />
      {/* Premium Background Decorations */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-flat-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 -z-10 border-40 border-flat-primary/5" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-flat-secondary/5 rounded-xl rotate-12 -translate-x-1/2 translate-y-1/3 -z-10 border-20 border-flat-secondary/5" />
      <div className="fixed top-1/2 left-1/4 w-24 h-24 bg-flat-accent/10 rounded-full blur-3xl -z-10 animate-pulse" />

      {/* Floating Geometric Shapes */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="fixed top-20 left-10 w-12 h-12 border-4 border-flat-primary/20 rounded-lg -z-10 hidden lg:block"
      />

      <main className="max-w-6xl mx-auto relative z-10">
        <header className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.h1
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-6xl md:text-[8rem] font-black text-flat-fg tracking-tighter uppercase leading-[1.1]"
            >
              Dự báo <br />
              <span className="text-flat-primary">thời tiết</span>
            </motion.h1>
          </div>
          <div className="md:text-right max-w-sm">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold text-slate-500 uppercase tracking-tight mb-4"
            >
              Dự báo chính xác được cung cấp bởi công nghệ <span className="text-flat-fg font-black">Dino Péo</span>.
            </motion.p>
            <div className="h-2 w-full bg-flat-border rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-flat-primary"
              />
            </div>
          </div>
        </header>

        <section className="mb-12">
          <SearchBar />
        </section>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="h-[450px] bg-white border-4 border-flat-border rounded-xl animate-pulse" />
              <div className="flex gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-48 w-full bg-white border-4 border-flat-border rounded-xl animate-pulse" />)}
              </div>
            </motion.div>
          ) : !current ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-24 text-center border-4 border-flat-border relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-flat-primary" />
              <div className="inline-flex items-center justify-center w-32 h-32 bg-flat-muted rounded-full mb-10 transition-transform group-hover:scale-110 duration-500">
                <CloudRain className="text-flat-primary" size={64} />
              </div>
              <h2 className="text-5xl font-black tracking-tight mb-6 uppercase text-flat-fg">Sẵn sàng tìm kiếm</h2>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm">Hãy nhập tên thành phố ở trên để xem dự báo thời tiết</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <CurrentWeather />
              <WeatherChart />
              <EnvironmentalDashboard />
              <WeatherAdvice />
              <ForecastList />
              <HourlyForecast />
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-40 py-16 border-t-4 border-flat-border flex flex-col md:flex-row justify-between items-center gap-8 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-flat-fg text-white flex items-center justify-center font-black text-2xl rounded-lg group-hover:bg-flat-primary transition-colors duration-500">D</div>
            <p className="text-lg font-black uppercase tracking-widest text-flat-fg">
              Dự báo thời tiết &bull; 2026
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Được thiết kế đầy tâm huyết bởi</p>
            <span className="text-2xl font-black text-flat-primary tracking-tighter">DINO PÉO STUDIO</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
