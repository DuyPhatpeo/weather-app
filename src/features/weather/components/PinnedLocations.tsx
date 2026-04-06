import { useWeatherStore } from "../../../store/weatherStore";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, MapPin } from "lucide-react";

export default function PinnedLocations() {
  const { pinnedCities, togglePinCity, setCoords, loadWeather } = useWeatherStore();

  if (pinnedCities.length === 0) return null;

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-3 px-2">
        <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-md">
          <Star size={12} fill="currentColor" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Địa điểm đã ghim</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <AnimatePresence mode="popLayout">
          {pinnedCities.map((city) => (
            <motion.div
              key={city.name}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, x: -10 }}
              className="group relative"
            >
              <button
                onClick={() => {
                  setCoords(city.lat, city.lon, city.name);
                  loadWeather(city.lat, city.lon);
                }}
                className="flex items-center gap-3 px-5 py-3 bg-white border-2 border-flat-border rounded-xl font-black text-xs text-flat-fg uppercase tracking-tight hover:border-flat-primary hover:text-flat-primary hover:shadow-[6px_6px_0px_0px_rgba(37,99,235,0.1)] transition-all active:scale-95 group"
              >
                <MapPin size={12} className="text-slate-300 group-hover:text-flat-primary" />
                {city.name}
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-flat-primary group-hover:animate-pulse" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePinCity(city);
                }}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-white border-2 border-flat-border rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
              >
                <X size={10} strokeWidth={3} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
