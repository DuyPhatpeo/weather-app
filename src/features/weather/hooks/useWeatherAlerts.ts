import { AlertTriangle, Wind, Sun, CloudRain, type LucideIcon } from "lucide-react";
import { useWeatherStore } from "@/store/weatherStore";

export interface WeatherAlert {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
}

export function useWeatherAlerts(): WeatherAlert[] {
  const { current, daily, selectedDate } = useWeatherStore();
  const today = daily?.find((d) => d.date === selectedDate) ?? daily?.[1] ?? daily?.[0];

  if (!current || !today) return [];

  const alerts: WeatherAlert[] = [];

  if (current.temperature > 35) {
    alerts.push({
      id: "heat",
      icon: Sun,
      title: "Cảnh báo Nắng nóng",
      desc: `Nhiệt độ hiện tại lên tới ${current.temperature}°C. Hạn chế ra ngoài vào giờ trưa.`,
      color: "bg-red-500/20 text-red-500 border-red-500/30",
    });
  }

  if (current.uvIndex && current.uvIndex >= 8) {
    alerts.push({
      id: "uv",
      icon: AlertTriangle,
      title: "Cảnh báo Tia UV cực cao",
      desc: `Chỉ số UV đạt mức ${current.uvIndex}. Cần sử dụng kem chống nắng và kính râm.`,
      color: "bg-orange-500/20 text-orange-500 border-orange-500/30",
    });
  }

  if (current.windSpeed > 50) {
    alerts.push({
      id: "wind",
      icon: Wind,
      title: "Cảnh báo Gió giật mạnh",
      desc: `Tốc độ gió hiện tại là ${current.windSpeed}km/h. Thận trọng khi di chuyển ngoài trời.`,
      color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    });
  }

  if (today.precipitationSum && today.precipitationSum > 20) {
    alerts.push({
      id: "rain",
      icon: CloudRain,
      title: "Cảnh báo Mưa lớn",
      desc: `Dự báo có mưa lớn (${today.precipitationSum}mm) trong ngày hôm nay. Đề phòng ngập úng cục bộ.`,
      color: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    });
  }

  return alerts;
}
