import { ShieldCheck, AlertTriangle, CloudRain, Sun } from "lucide-react";
import { useWeatherStore } from "@/store/weatherStore";

export default function Insights() {
  const { current } = useWeatherStore();
  if (!current) return null;

  const aqi = current.aqi ?? 0;
  const uv = current.uvIndex ?? 0;
  const isRain = current.weatherCode >= 51 && current.weatherCode <= 82;

  const health =
    aqi > 150
      ? { text: "Ô nhiễm không khí ở mức có hại, nên hạn chế ra ngoài.", icon: AlertTriangle, color: "#f87171" }
      : aqi > 100
      ? { text: "Chất lượng không khí kém, nhóm nhạy cảm nên đeo khẩu trang.", icon: AlertTriangle, color: "#fb923c" }
      : aqi > 50
      ? { text: "Chất lượng không khí ở mức chấp nhận được.", icon: ShieldCheck, color: "#fbbf24" }
      : { text: "Chất lượng không khí tốt, thích hợp cho hoạt động ngoài trời.", icon: ShieldCheck, color: "#34d399" };

  const activity = isRain
    ? { text: "Có khả năng mưa, mang theo áo mưa hoặc ô.", icon: CloudRain, color: "#60a5fa" }
    : uv > 7
    ? { text: "Chỉ số UV cao, nên dùng kem chống nắng khi ra ngoài.", icon: Sun, color: "#fbbf24" }
    : { text: "Thời tiết dễ chịu, phù hợp cho các hoạt động ngoài trời.", icon: Sun, color: "#fbbf24" };

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[health, activity].map((tip, i) => (
        <div key={i} className="bg-dash-panel rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <tip.icon size={20} style={{ color: tip.color }} className="shrink-0" />
          <p className="text-sm font-medium text-night-fg leading-snug">{tip.text}</p>
        </div>
      ))}
    </div>
  );
}
