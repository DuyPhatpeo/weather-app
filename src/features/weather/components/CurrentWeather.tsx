import { Wind, Droplets, Sun, Navigation, Sunrise, Sunset, Wind as AirIcon } from "lucide-react";
import { useWeatherStore } from "../../../store/weatherStore";
import { getWeatherInfo, getTemperatureColor } from "../../../utils/weatherUtils";
import { motion } from "framer-motion";

const getFlatColorByCode = (code: number): string => {
  if ([0, 1].includes(code)) return "text-flat-primary"; // Clear/Sunny
  if ([2, 3, 45, 48].includes(code)) return "text-slate-500"; // Cloudy
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "text-flat-secondary"; // Rain
  return "text-flat-accent"; // Warning/Storm
};

export default function CurrentWeather() {
  const { current, city, loading, unit, setUnit } = useWeatherStore();

  if (loading || !current) return null;

  const weatherInfo = getWeatherInfo(current.weatherCode);
  const textColorClass = getFlatColorByCode(current.weatherCode);
  const tempColors = getTemperatureColor(current.temperature);

  const convertTemp = (temp: number) => {
    if (unit === "fahrenheit") return Math.round((temp * 9) / 5 + 32);
    return Math.round(temp);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flat-card-base flat-card-hover border-flat-border relative overflow-hidden"
    >
      {/* Dynamic Accent Bar */}
      <div className={`absolute top-0 left-0 w-full h-3 ${textColorClass.replace('text-', 'bg-')}`} />

      <div className="flex flex-col lg:flex-row justify-between gap-12 pt-4">
        {/* Left Side: Main Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-flat-muted flex items-center justify-center rounded-xl border-2 border-flat-border">
              <Navigation className="text-flat-primary rotate-45" size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-flat-fg flex items-center gap-2">
                {city}
                <span className={`w-3 h-3 rounded-full animate-pulse ${tempColors.bg.replace('bg-', 'bg-')}`} style={{ backgroundColor: 'currentColor' }} />
              </h2>
              <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">
                Elite Station &bull; {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="relative">
              <div className="text-[10rem] md:text-[14rem] font-black tracking-tighter text-flat-fg leading-none">
                {convertTemp(current.temperature)}°
              </div>
              <div className="absolute -bottom-2 left-2 flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Feels like</span>
                <span className={`text-2xl font-black ${tempColors.text}`}>{convertTemp(current.apparentTemperature ?? current.temperature)}°</span>
              </div>
              <div className="absolute -top-4 -right-12">
                <span className="text-6xl animate-float inline-block">{weatherInfo.icon}</span>
              </div>
            </div>

            <div className="hidden md:block">
              <div className={`text-3xl font-black uppercase tracking-tighter mb-1 ${textColorClass}`}>
                {weatherInfo.desc}
              </div>
              <div className="px-4 py-2 bg-flat-muted border-2 border-flat-border rounded-lg inline-flex items-center gap-2">
                <Sun size={16} className="text-flat-accent" />
                <span className="text-sm font-black uppercase tracking-widest text-flat-fg">UV {current.uvIndex ?? 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Details Grid */}
        <div className="lg:w-[450px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Current Metrics</h3>
            <div className="flex items-center border-4 border-flat-border rounded-xl p-1 bg-white">
              <button
                onClick={() => setUnit("celsius")}
                className={`px-4 py-2 rounded-lg font-black text-xs transition-all ${unit === "celsius" ? "bg-flat-primary text-white" : "text-flat-fg hover:bg-flat-muted"}`}
              >
                CELSIUS
              </button>
              <button
                onClick={() => setUnit("fahrenheit")}
                className={`px-4 py-2 rounded-lg font-black text-xs transition-all ${unit === "fahrenheit" ? "bg-flat-primary text-white" : "text-flat-fg hover:bg-flat-muted"}`}
              >
                FAHRENHEIT
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              icon={<Wind size={22} />}
              label="Wind Speed"
              value={`${current.windSpeed} km/h`}
              color="text-blue-500"
            />
            <MetricCard
              icon={<Droplets size={22} />}
              label="Humidity"
              value={`${current.humidity}%`}
              color="text-emerald-500"
            />
            <MetricCard
              icon={<AirIcon size={22} />}
              label="Air Quality"
              value={`${current.aqi ?? 'N/A'} AQI`}
              color="text-orange-500"
            />
            <MetricCard
              icon={<Sunrise size={22} />}
              label="Sunrise"
              value={current.sunrise ? new Date(current.sunrise).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : 'N/A'}
              color="text-amber-500"
            />
            <MetricCard
              icon={<Sunset size={22} />}
              label="Sunset"
              value={current.sunset ? new Date(current.sunset).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : 'N/A'}
              color="text-rose-500"
            />
            <MetricCard
              icon={<Navigation size={22} />}
              label="Pressure"
              value={`${current.pressure ?? 'N/A'} hPa`}
              color="text-purple-500"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({ icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="bg-flat-bg border-2 border-flat-border rounded-xl p-4 transition-all hover:border-flat-primary group">
      <div className={`w-10 h-10 bg-white border-2 border-flat-border flex items-center justify-center rounded-lg mb-4 ${color} transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</div>
      <div className="text-xl font-black text-flat-fg">{value}</div>
    </div>
  );
}
