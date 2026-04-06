import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useWeatherStore } from "../../../store/weatherStore";
import { formatHour } from "../../../utils/weatherUtils";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function WeatherChart() {
  const { hourly, selectedDate, unit } = useWeatherStore();

  if (!hourly || hourly.length === 0) return null;

  // Lọc dữ liệu theo ngày đã chọn hoặc lấy 24 giờ tới nếu chưa chọn ngày
  const data = selectedDate
    ? hourly.filter((h) => h.time.startsWith(selectedDate))
    : hourly.slice(0, 24);

  if (data.length === 0) return null;

  const convertTemp = (temp: number) => {
    if (unit === "fahrenheit") return Math.round((temp * 9) / 5 + 32);
    return Math.round(temp);
  };

  const chartData = data.map((h) => ({
    time: formatHour(h.time, selectedDate),
    temp: convertTemp(h.temperature),
    precip: h.precipitationProbability ?? 0,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-4 border-flat-border p-4 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-8">
              <span className="text-xs font-black uppercase text-flat-fg">Nhiệt độ</span>
              <span className="text-xl font-black text-flat-primary">{payload[0].value}°</span>
            </div>
            <div className="flex items-center justify-between gap-8">
              <span className="text-xs font-black uppercase text-flat-fg">Mưa</span>
              <span className="text-xl font-black text-blue-500">{payload[1].value}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-16 bg-white border-4 border-flat-border rounded-3xl p-8 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-flat-primary text-white flex items-center justify-center rounded-lg border-2 border-flat-border">
            <TrendingUp size={20} />
          </div>
          <h3 className="text-3xl font-black text-flat-fg tracking-tighter uppercase">
            Xu hướng <span className="text-slate-400">Thời tiết</span>
          </h3>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-flat-primary rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nhiệt độ (°{unit === 'celsius' ? 'C' : 'F'})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mưa (%)</span>
          </div>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeWidth={2} />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
              interval={2}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#2563eb"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorTemp)"
            />
            <Area
              type="monotone"
              dataKey="precip"
              stroke="#60a5fa"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorPrecip)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
