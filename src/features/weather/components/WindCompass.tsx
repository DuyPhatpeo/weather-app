import { motion } from "framer-motion";
import { useWeatherStore } from "@/store/weatherStore";
import { Navigation, Wind } from "lucide-react";

export default function WindCompass() {
  const { current } = useWeatherStore();

  if (!current || current.windDirection === undefined) return null;

  const direction = current.windDirection;
  
  const getDirectionText = (degree: number) => {
    const directions = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
    const index = Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8;
    return directions[index];
  };

  return (
    <div className="bg-dash-panel rounded-3xl p-5 shadow-sm relative overflow-hidden flex flex-col h-48 items-center justify-center">
      <div className="absolute top-5 left-5 right-5 flex justify-between items-center">
        <h3 className="text-sm font-medium text-night-muted">Hướng gió</h3>
        <Wind size={16} className="text-[#3b82f6]" />
      </div>

      <div className="relative w-20 h-20 shrink-0 mt-4 flex items-center justify-center">
        {/* Compass markings */}
        <div className="absolute inset-0 rounded-full border-2 border-night-border bg-black/10" />
        <div className="absolute top-1 w-full text-center text-[10px] font-bold text-night-muted">N</div>
        <div className="absolute bottom-1 w-full text-center text-[10px] font-bold text-night-muted">S</div>
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-night-muted">E</div>
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-night-muted">W</div>

        {/* Compass needle */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: direction }}
          transition={{ type: "spring", stiffness: 50, damping: 10 }}
          className="absolute w-full h-full flex items-start justify-center pt-4"
        >
          <Navigation size={14} fill="#3b82f6" className="text-[#3b82f6] -rotate-45" />
        </motion.div>
        
        {/* Center dot */}
        <div className="w-2 h-2 rounded-full bg-night-fg z-10" />
      </div>

      <div className="mt-2 text-center">
        <div className="text-xl font-semibold text-night-fg">{current.windSpeed} <span className="text-sm font-normal text-night-muted">km/h</span></div>
        <div className="text-xs text-night-muted mt-1">{getDirectionText(direction)} ({direction}°)</div>
      </div>
    </div>
  );
}
