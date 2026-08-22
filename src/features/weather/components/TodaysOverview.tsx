import { useWeatherStore } from "@/store/weatherStore";
import { CloudRain, Eye, CloudLightning, Wind } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";
import SunPath from "./SunPath";

export default function TodaysOverview() {
  const { current } = useWeatherStore();

  if (!current) return null;

  // Mock wind data for the bar chart
  const windData = Array.from({ length: 24 }).map((_, i) => ({
    value: Math.random() * 10 + 5,
    isCurrent: i === 12
  }));

  // Simple UV Index rotation calculation (0 to 180 degrees mapping for 0 to 11+)
  const uvValue = current.uvIndex || 0;
  const uvRotation = Math.min(180, (uvValue / 11) * 180);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-night-fg">Tổng quan hôm nay</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Wind Status */}
          <div className="bg-dash-panel rounded-3xl p-5 shadow-sm flex flex-col justify-between h-48">
            <h3 className="text-sm font-medium text-night-muted mb-2">Tình trạng gió</h3>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={windData}>
                  <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                    {windData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isCurrent ? "var(--color-dash-active)" : "rgba(255,255,255,0.2)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-xs text-night-fg mt-2 font-medium">
              <span>{current.windSpeed} km/h</span>
              <span className="text-night-muted">6:20 AM</span>
            </div>
          </div>

          {/* UV Index */}
          <div className="bg-dash-panel rounded-3xl p-5 shadow-sm flex flex-col justify-between h-48">
            <h3 className="text-sm font-medium text-night-muted">Chỉ số UV</h3>
            <div className="relative flex flex-col items-center justify-center flex-1 mt-2">
              <div className="w-24 h-12 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-[12px] border-white/10"></div>
                <div 
                  className="absolute top-0 left-0 w-24 h-24 rounded-full border-[12px] border-dash-accent border-b-transparent border-l-transparent transition-transform duration-1000 origin-center"
                  style={{ transform: `rotate(${uvRotation - 45}deg)` }}
                ></div>
              </div>
              <div className="text-center mt-2">
                <span className="text-xl font-bold">{uvValue.toFixed(2)}</span>
                <span className="text-xs text-night-muted ml-1">UV</span>
              </div>
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-dash-panel rounded-3xl p-5 shadow-sm flex flex-col justify-between h-48">
            <h3 className="text-sm font-medium text-night-muted">Độ ẩm</h3>
            <div className="flex justify-center my-2">
              <div className="relative">
                <CloudLightning size={48} className="text-purple-400" />
                <CloudRain size={24} className="text-blue-400 absolute bottom-0 right-0" />
              </div>
            </div>
            <div className="flex items-end justify-between mt-auto">
              <span className="text-2xl font-bold">{current.humidity}%</span>
              <span className="text-[10px] text-night-muted max-w-[80px] leading-tight text-right">
                Điểm sương hiện tại là {Math.round(current.temperature - 2)}°
              </span>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-dash-panel rounded-3xl p-5 shadow-sm flex flex-col justify-between h-48">
            <h3 className="text-sm font-medium text-night-muted">Tầm nhìn</h3>
            <div className="flex justify-center my-2 opacity-80">
              <Wind size={48} className="text-blue-200" />
            </div>
            <div className="flex items-end justify-between mt-auto">
              <span className="text-2xl font-bold">{current.visibility ? (current.visibility / 1000).toFixed(1) : "--"} <span className="text-sm font-normal">km</span></span>
              <span className="text-[10px] text-night-muted max-w-[80px] leading-tight text-right flex items-center justify-end gap-1">
                <Eye size={10} /> Sương mù ảnh hưởng tầm nhìn
              </span>
            </div>
          </div>

          {/* Sun Path */}
          <SunPath />
      </div>
    </div>
  );
}
