import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Wind, Droplets, Gauge, Eye } from "lucide-react";
import { useWeatherStore } from "@/store/weatherStore";
import { formatHour } from "@/utils/weatherUtils";
import HourlyList from "@/features/weather/components/HourlyList";
import AqiWidget from "@/features/weather/components/AqiWidget";
import SunPath from "@/features/weather/components/SunPath";
import WindCompass from "@/features/weather/components/WindCompass";
import RainChance from "@/features/weather/components/RainChance";
import Insights from "@/features/weather/components/Insights";

export default function Details() {
  const { current, hourly, selectedDate, unit, theme } = useWeatherStore();
  if (!current) return null;

  const isDark = theme === "dark";
  const fg = isDark ? "#f4f5f7" : "#14171a";
  const muted = isDark ? "#9aa1ab" : "#6b7280";
  const panel = isDark ? "#1c2024" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";

  const convertTemp = (t: number) => (unit === "fahrenheit" ? Math.round((t * 9) / 5 + 32) : Math.round(t));
  const data = (selectedDate ? hourly?.filter((h) => h.time.startsWith(selectedDate)) : hourly?.slice(0, 24)) ?? [];
  const chartData = data.map((h) => ({ time: formatHour(h.time, selectedDate), temp: convertTemp(h.temperature) }));

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="pt-8 mt-8 border-t border-night-border">
        <div className="section-label">Chi tiết hôm nay</div>

        <AqiWidget />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <SunPath />
          <WindCompass />
        </div>

        <HourlyList />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div>
            <div className="section-label mb-3">Xu hướng nhiệt độ</div>
            <div className="h-[140px] w-full -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff8a3d" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#ff8a3d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    interval={3}
                    tick={{ fill: muted, fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{ background: panel, border: `1px solid ${border}`, borderRadius: 12, color: fg }}
                    labelStyle={{ color: muted }}
                  />
                  <Area type="monotone" dataKey="temp" stroke="#ff8a3d" strokeWidth={2} fill="url(#tempFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <RainChance />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <Metric icon={<Droplets size={16} />} label="Độ ẩm" value={`${current.humidity}%`} />
          <Metric icon={<Gauge size={16} />} label="Áp suất" value={`${current.pressure ?? "--"} hPa`} />
          <Metric icon={<Eye size={16} />} label="Tầm nhìn" value={current.visibility ? `${(current.visibility / 1000).toFixed(1)} km` : "--"} />
          <Metric icon={<Gauge size={16} />} label="UV" value={`${current.uvIndex?.toFixed(0) ?? "--"}`} />
          <Metric
            icon={<Wind size={16} />}
            label="Cảm giác như"
            value={`${convertTemp(current.apparentTemperature ?? current.temperature)}°`}
          />
        </div>

        <Insights />
      </div>
    </motion.div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-panel card-hover rounded-xl px-4 py-3 flex items-center gap-3">
      <span className="text-night-accent">{icon}</span>
      <div>
        <div className="text-[10px] text-night-muted">{label}</div>
        <div className="text-sm font-medium text-night-fg">{value}</div>
      </div>
    </div>
  );
}
