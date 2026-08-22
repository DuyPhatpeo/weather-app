import { useWeatherStore } from "@/store/weatherStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Trash2, Settings2, Moon, Sun, Thermometer, Calendar } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, toggleTheme, unit, setUnit, forecastDays, setForecastDays, pinnedCities, togglePinCity } = useWeatherStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-night-card rounded-3xl overflow-hidden shadow-2xl border border-night-border flex flex-col max-h-[85vh]"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-night-border bg-white/5">
            <div className="flex items-center gap-2 text-night-fg">
              <Settings2 size={20} className="text-night-accent" />
              <h2 className="font-semibold text-lg">Cài đặt Ứng dụng</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-night-muted hover:text-night-fg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto styled-scrollbar flex flex-col gap-8">
            {/* Theme Toggle */}
            <section>
              <h3 className="text-xs font-semibold text-night-muted uppercase tracking-wider mb-3">Giao diện</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => theme !== "light" && toggleTheme()}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-colors ${
                    theme === "light" ? "bg-night-accent/10 border-night-accent text-night-fg" : "border-night-border text-night-muted hover:bg-white/5"
                  }`}
                >
                  <Sun size={24} />
                  <span className="text-sm font-medium">Sáng</span>
                </button>
                <button
                  onClick={() => theme !== "dark" && toggleTheme()}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-colors ${
                    theme === "dark" ? "bg-night-accent/10 border-night-accent text-night-fg" : "border-night-border text-night-muted hover:bg-white/5"
                  }`}
                >
                  <Moon size={24} />
                  <span className="text-sm font-medium">Tối</span>
                </button>
              </div>
            </section>

            {/* Units Toggle */}
            <section>
              <h3 className="text-xs font-semibold text-night-muted uppercase tracking-wider mb-3">Đơn vị Nhiệt độ</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setUnit("celsius")}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-colors ${
                    unit === "celsius" ? "bg-night-accent/10 border-night-accent text-night-fg" : "border-night-border text-night-muted hover:bg-white/5"
                  }`}
                >
                  <Thermometer size={16} />
                  <span className="text-sm font-medium">Celsius (°C)</span>
                </button>
                <button
                  onClick={() => setUnit("fahrenheit")}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-colors ${
                    unit === "fahrenheit" ? "bg-night-accent/10 border-night-accent text-night-fg" : "border-night-border text-night-muted hover:bg-white/5"
                  }`}
                >
                  <Thermometer size={16} />
                  <span className="text-sm font-medium">Fahrenheit (°F)</span>
                </button>
              </div>
            </section>

            {/* Forecast Days */}
            <section>
              <h3 className="text-xs font-semibold text-night-muted uppercase tracking-wider mb-3">Số ngày dự báo</h3>
              <div className="flex gap-2">
                {[7, 10, 14].map((days) => (
                  <button
                    key={days}
                    onClick={() => setForecastDays(days)}
                    className={`flex-1 flex items-center justify-center gap-1 p-3 rounded-xl border transition-colors ${
                      forecastDays === days ? "bg-night-accent/10 border-night-accent text-night-fg" : "border-night-border text-night-muted hover:bg-white/5"
                    }`}
                  >
                    <Calendar size={14} />
                    <span className="text-sm font-medium">{days} ngày</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-night-muted mt-2">Dữ liệu mở rộng được cung cấp bởi Open-Meteo.</p>
            </section>

            {/* Pinned Cities Management */}
            <section>
              <h3 className="text-xs font-semibold text-night-muted uppercase tracking-wider mb-3 flex justify-between items-end">
                <span>Thành phố đã ghim</span>
                <span>{pinnedCities.length} / 10</span>
              </h3>
              
              {pinnedCities.length === 0 ? (
                <div className="text-center p-6 border border-dashed border-night-border rounded-2xl text-night-muted text-sm">
                  Chưa có thành phố nào được ghim.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {pinnedCities.map((city) => (
                    <div key={city.name} className="flex items-center justify-between p-3 rounded-xl glass-panel">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <MapPin size={16} className="text-night-accent shrink-0" />
                        <span className="text-sm text-night-fg font-medium truncate">{city.name}</span>
                      </div>
                      <button
                        onClick={() => togglePinCity(city)}
                        className="p-2 text-night-muted hover:text-red-500 transition-colors rounded-lg hover:bg-white/5"
                        title="Bỏ ghim"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
