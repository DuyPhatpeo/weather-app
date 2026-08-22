import { motion } from "framer-motion";
import { useWeatherStore } from "@/store/weatherStore";
import { Sunrise, Sunset, Sun } from "lucide-react";

export default function SunPath() {
  const { current } = useWeatherStore();

  if (!current || !current.sunrise || !current.sunset) return null;

  const sunrise = new Date(current.sunrise);
  const sunset = new Date(current.sunset);
  // Cosmetic sun-arc position — reads the clock directly, no correctness impact if stale.
  // eslint-disable-next-line react-hooks/purity
  const now = new Date(current.time || Date.now());

  const totalDuration = sunset.getTime() - sunrise.getTime();
  let elapsed = now.getTime() - sunrise.getTime();

  if (elapsed < 0) elapsed = 0;
  if (elapsed > totalDuration) elapsed = totalDuration;

  const percentage = (elapsed / totalDuration) * 100;
  const isDaytime = elapsed > 0 && elapsed < totalDuration;

  // Calculate arc position (semi-circle)
  const angle = (percentage / 100) * Math.PI; // 0 to PI
  const radius = 100;
  // Center is at (100, 100) for a 200x100 SVG
  const x = 100 - Math.cos(angle) * radius;
  const y = 100 - Math.sin(angle) * radius;

  const timeStr = (d: Date) => d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-dash-panel rounded-3xl p-5 shadow-sm relative overflow-hidden flex flex-col h-48">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-night-muted">Mặt trời</h3>
        <Sun size={16} className="text-[#ff8a3d]" />
      </div>
      
      <div className="relative flex-1 flex flex-col items-center justify-end">
        <svg viewBox="0 0 200 110" className="w-full max-w-[160px] overflow-visible">
          {/* Background Arc */}
          <path
            d="M 0 100 A 100 100 0 0 1 200 100"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          {/* Progress Arc */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            d="M 0 100 A 100 100 0 0 1 200 100"
            fill="none"
            stroke="url(#sunGradient)"
            strokeWidth="3"
          />
          <defs>
            <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#ff8a3d" />
              <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
          </defs>

          {/* Current Sun Position */}
          {isDaytime && (
            <motion.g
              initial={{ opacity: 0, x: 0, y: 100 }}
              animate={{ opacity: 1, x: x, y: y }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <circle r="8" fill="#ff8a3d" className="drop-shadow-[0_0_10px_rgba(255,138,61,0.8)]" />
            </motion.g>
          )}
        </svg>

        <div className="w-full max-w-[200px] flex justify-between items-center text-xs mt-1 text-night-muted px-2">
          <div className="flex flex-col items-center">
            <Sunrise size={14} className="mb-1 text-night-fg" />
            <span>{timeStr(sunrise)}</span>
          </div>
          <div className="flex flex-col items-center">
            <Sunset size={14} className="mb-1 text-night-fg" />
            <span>{timeStr(sunset)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
