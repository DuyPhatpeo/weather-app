import { motion } from "framer-motion";
import { useWeatherStore } from "@/store/weatherStore";
import { Leaf } from "lucide-react";

const getAqiInfo = (aqi: number) => {
  if (aqi <= 50) return { label: "Tốt", color: "#10b981", desc: "Không khí trong lành, an toàn cho các hoạt động ngoài trời." };
  if (aqi <= 100) return { label: "Trung bình", color: "#eab308", desc: "Chất lượng không khí ở mức chấp nhận được." };
  if (aqi <= 150) return { label: "Kém", color: "#f97316", desc: "Nhóm người nhạy cảm có thể bị ảnh hưởng sức khỏe." };
  if (aqi <= 200) return { label: "Xấu", color: "#ef4444", desc: "Mọi người có thể bắt đầu cảm thấy ảnh hưởng sức khỏe." };
  if (aqi <= 300) return { label: "Rất xấu", color: "#8b5cf6", desc: "Cảnh báo sức khỏe: mọi người có thể gặp vấn đề nghiêm trọng." };
  return { label: "Nguy hại", color: "#6b21a8", desc: "Báo động: mọi người có khả năng bị ảnh hưởng nghiêm trọng." };
};

export default function AqiWidget() {
  const { current } = useWeatherStore();
  if (!current || current.aqi === undefined) return null;

  const info = getAqiInfo(current.aqi);
  const percentage = Math.min((current.aqi / 300) * 100, 100);

  return (
    <div className="glass-panel rounded-2xl p-5 mt-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Leaf size={100} color={info.color} />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Leaf size={16} color={info.color} />
            <h3 className="text-sm font-medium text-night-fg">Chất lượng không khí (AQI)</h3>
          </div>
          <div className="flex items-end gap-3 mt-3">
            <span className="text-4xl font-light text-night-fg leading-none">{current.aqi}</span>
            <span className="text-lg font-medium mb-1" style={{ color: info.color }}>{info.label}</span>
          </div>
          <p className="text-xs text-night-muted mt-2 max-w-[280px]">{info.desc}</p>
        </div>

        <div className="w-full md:w-[200px] shrink-0">
          <div className="flex justify-between text-[10px] text-night-muted mb-1">
            <span>0</span>
            <span>300+</span>
          </div>
          <div className="h-2 rounded-full bg-night-border overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, #10b981 0%, ${info.color} 100%)` }}
            />
          </div>
          
          <div className="flex gap-4 mt-4">
            <div>
              <div className="text-[10px] text-night-muted">PM2.5</div>
              <div className="text-sm font-medium text-night-fg">{current.pm2_5?.toFixed(1) ?? "--"}</div>
            </div>
            <div>
              <div className="text-[10px] text-night-muted">PM10</div>
              <div className="text-sm font-medium text-night-fg">{current.pm10?.toFixed(1) ?? "--"}</div>
            </div>
            <div>
              <div className="text-[10px] text-night-muted">O3</div>
              <div className="text-sm font-medium text-night-fg">{current.ozone?.toFixed(1) ?? "--"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
