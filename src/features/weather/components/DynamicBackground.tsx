import { useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeatherStore } from "@/store/weatherStore";

interface Particle {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

type Category = "clear" | "cloudy" | "rain" | "storm" | "snow" | "fog";

function categoryOf(code: number): Category {
  if ([0, 1].includes(code)) return "clear";
  if ([45, 48].includes(code)) return "fog";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([95, 96, 99].includes(code)) return "storm";
  if (code >= 51 && code <= 82) return "rain";
  return "cloudy";
}

const GRADIENTS: Record<Category, { day: [string, string]; night: [string, string] }> = {
  clear: { day: ["#2a5ea8", "#ff9d5c"], night: ["#141a3a", "#3a2f66"] },
  cloudy: { day: ["#5b6b7d", "#8b98a5"], night: ["#232b3f", "#454f68"] },
  fog: { day: ["#8a95a0", "#c3cad1"], night: ["#28303f", "#454f5f"] },
  rain: { day: ["#3a4a5c", "#5c7086"], night: ["#141b32", "#29405c"] },
  storm: { day: ["#2b2a3d", "#4a4560"], night: ["#100f1c", "#2a2140"] },
  snow: { day: ["#7d97ac", "#c9dbe6"], night: ["#1e2c40", "#3d5a6f"] },
};

const LIGHT_GRADIENTS: Record<Category, [string, string]> = {
  clear: ["#eaf2ff", "#ffe9d1"],
  cloudy: ["#e7eaee", "#d5dbe2"],
  fog: ["#eceff2", "#dde2e7"],
  rain: ["#dde5ec", "#c7d4e0"],
  storm: ["#dcdbe6", "#c3c1d4"],
  snow: ["#eef4f8", "#dbe8f0"],
};

export default function DynamicBackground({ forceDark = false }: { forceDark?: boolean } = {}) {
  const { current, theme: appTheme } = useWeatherStore();
  const theme = forceDark ? "dark" : appTheme;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const weatherCode = current.weatherCode;
    const category = categoryOf(weatherCode);

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth ?? window.innerWidth;
      canvas.height = parent?.clientHeight ?? window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      let count = 0;
      if (category === "rain") count = weatherCode >= 61 ? 150 : 80;
      else if (category === "storm") count = 160;
      else if (category === "snow") count = 100;

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: Math.random() * 15 + 10,
          length: Math.random() * 20 + 10,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const drawRain = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = theme === "dark" ? "rgba(174, 194, 224, 0.5)" : "rgba(70, 90, 120, 0.4)";
      ctx.lineWidth = 1;

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + current.windSpeed / 10, p.y + p.length);
        ctx.stroke();

        p.y += p.speed;
        p.x += current.windSpeed / 10;

        if (p.y > canvas.height) {
          p.y = -p.length;
          p.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(drawRain);
    };

    const drawSnow = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = theme === "dark" ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.95)";

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.random() * 2 + 1, 0, Math.PI * 2);
        ctx.fill();

        p.y += p.speed / 5;
        p.x += Math.sin(p.y / 50) * 2;

        if (p.y > canvas.height) {
          p.y = -5;
          p.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(drawSnow);
    };

    window.addEventListener("resize", resize);
    resize();

    if (category === "rain" || category === "storm") drawRain();
    else if (category === "snow") drawSnow();
    else ctx.clearRect(0, 0, canvas.width, canvas.height);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [current, theme]);

  const category = current ? categoryOf(current.weatherCode) : "clear";

  // Cosmetic day/night gradient pick — reads the clock directly, no correctness impact if stale.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const isDay =
    current?.sunrise && current?.sunset
      ? now >= new Date(current.sunrise).getTime() && now < new Date(current.sunset).getTime()
      : new Date(now).getHours() >= 6 && new Date(now).getHours() < 18;

  const isCloudy = category === "cloudy" || category === "fog";
  const isStorm = category === "storm";

  const [from, to] =
    theme === "light" ? LIGHT_GRADIENTS[category] : isDay ? GRADIENTS[category].day : GRADIENTS[category].night;

  // Deterministic pseudo-random layout (no Math.random) so star positions stay stable across renders.
  const stars = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => {
        const seed = (n: number) => Math.abs(Math.sin(i * 12.9898 + n * 78.233)) % 1;
        return { x: seed(1) * 100, y: seed(2) * 60, d: seed(3) * 3 + 2 };
      }),
    []
  );

  return (
    <div
      className="absolute inset-0 -z-20 pointer-events-none overflow-hidden transition-colors duration-700"
      style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
    >
      <AnimatePresence>
        {/* Sun glow for clear day */}
        {category === "clear" && isDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-200/30 blur-[100px]"
          />
        )}

        {/* Stars for clear night */}
        {category === "clear" && !isDay && theme === "dark" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            {stars.map((s, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-white"
                style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.d, height: s.d }}
                animate={{ opacity: [0.2, 0.9, 0.2] }}
                transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: (i % 5) * 0.4 }}
              />
            ))}
          </motion.div>
        )}

        {/* Drifting clouds */}
        {isCloudy && (
          <>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute top-[10%] left-0 w-[800px] h-[400px] bg-white/5 blur-[100px] rounded-full"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              className="absolute top-[40%] right-0 w-[600px] h-[300px] bg-white/5 blur-[80px] rounded-full"
            />
          </>
        )}

        {/* Storm flash */}
        {isStorm && (
          <motion.div
            animate={{ opacity: [0, 0, 0.2, 0, 0.5, 0, 0, 0] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1] }}
            className="absolute inset-0 bg-white"
          />
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
