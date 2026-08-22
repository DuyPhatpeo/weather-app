import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useWeatherStore } from "@/store/weatherStore";
import { getWeatherInfo, degToCompass, greeting } from "@/utils/weatherUtils";
import { MapPin, Navigation } from "lucide-react";
import AlertBanner from "@/features/weather/components/AlertBanner";
import DynamicBackground from "@/features/weather/components/DynamicBackground";

export default function CurrentWeather({ onOpenMap }: { onOpenMap?: () => void }) {
  const { current, city, unit, setUnit } = useWeatherStore();
  const today = useWeatherStore((s) => s.daily?.find((d) => d.date === s.selectedDate) ?? s.daily?.[1] ?? s.daily?.[0]);

  if (!current) return null;

  const weatherInfo = getWeatherInfo(current.weatherCode);

  const convertTemp = (temp: number) => {
    if (unit === "fahrenheit") return Math.round((temp * 9) / 5 + 32);
    return Math.round(temp);
  };

  const dateLabel = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <div className="flex flex-col gap-4">
      <AlertBanner />

      <div className="relative overflow-hidden rounded-3xl min-h-[420px] p-6 md:p-10 flex flex-col shadow-[0_30px_70px_-24px_rgba(0,0,0,0.55)]">
        <DynamicBackground forceDark />
        {/* Glossy highlight sheen */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 12% -10%, rgba(255,255,255,0.22), transparent 45%)" }}
        />

        <div className="relative z-10 flex flex-col h-full text-white">
          {/* Top row */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-white" />
            </span>
            <h1 className="font-semibold text-sm md:text-base">
              {city} <span className="text-white/60 font-normal">({dateLabel})</span>
            </h1>
            {onOpenMap && (
              <button
                onClick={onOpenMap}
                className="flex items-center gap-1.5 text-xs font-medium bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/25 hover:-translate-y-0.5 transition-all ml-auto"
              >
                <MapPin size={12} />
                <span>Bản đồ</span>
              </button>
            )}
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: greeting + wind */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">{greeting()}</h2>
                <p className="mt-2 text-sm md:text-base text-white/75 max-w-xs">
                  Hôm nay trời {weatherInfo.desc.toLowerCase()}, {tagline(current.weatherCode, current.uvIndex)}
                </p>
              </div>

              <WindChip speed={current.windSpeed} direction={current.windDirection} />
            </motion.div>

            {/* Right: orb + temp */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center md:items-end gap-2"
            >
              <WeatherOrb icon={weatherInfo.icon} />

              <div className="flex items-start gap-3 mt-2">
                <div className="text-6xl md:text-7xl font-extralight leading-none tracking-tight">
                  {convertTemp(current.temperature)}°
                </div>
                <button
                  onClick={() => setUnit(unit === "celsius" ? "fahrenheit" : "celsius")}
                  className="mt-1 text-xs font-semibold text-white/70 hover:text-white transition-colors"
                >
                  °{unit === "celsius" ? "C" : "F"}
                </button>
              </div>

              {today && (
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span>H {convertTemp(today.tempMax)}°</span>
                  <span className="text-white/40">/</span>
                  <span>L {convertTemp(today.tempMin)}°</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function tagline(code: number, uv?: number): string {
  if (code >= 51 && code <= 82) return "nhớ mang theo ô nhé.";
  if (uv != null && uv > 7) return "đừng quên kem chống nắng.";
  if ([0, 1].includes(code)) return "thích hợp để ra ngoài dạo bộ.";
  return "một ngày dễ chịu để tận hưởng.";
}

function WindChip({ speed, direction }: { speed: number; direction?: number }) {
  return (
    <div className="inline-flex items-center gap-3 bg-white/12 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 w-fit">
      <div className="relative w-9 h-9 rounded-full border border-white/30 flex items-center justify-center shrink-0">
        <Navigation
          size={16}
          className="transition-transform duration-500"
          style={{ transform: `rotate(${direction ?? 0}deg)` }}
        />
      </div>
      <div>
        <div className="text-sm font-semibold leading-none">{speed.toFixed(0)} km/h</div>
        <div className="text-[11px] text-white/70 mt-1">{degToCompass(direction)}</div>
      </div>
    </div>
  );
}

function WeatherOrb({ icon }: { icon: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 150, damping: 15 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 600 }}
      className="relative w-40 h-40 md:w-48 md:h-48 select-none"
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 25%, #ffd9a8, #ff8a3d 42%, #e8672a 72%, #9c3d10 100%)",
          boxShadow:
            "0 24px 60px -12px rgba(255,138,61,0.55), inset -14px -14px 30px rgba(0,0,0,0.3), inset 10px 10px 24px rgba(255,255,255,0.4)",
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle at 28% 20%, rgba(255,255,255,0.6), transparent 38%)" }}
      />
      <motion.span
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center text-6xl md:text-7xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
      >
        {icon}
      </motion.span>
    </motion.div>
  );
}
