import { useWeatherStore } from "@/store/weatherStore";
import { Cloud, Wind, Sun, CloudSnow, CloudSun } from "lucide-react";

const MOCK_CITIES = [
  { country: "China", name: "Beijing", condition: "Có mây", icon: Cloud },
  { country: "US", name: "California", condition: "Có gió", icon: Wind },
  { country: "Dubai", name: "Arab Emirates", condition: "Trời nắng", icon: Sun },
  { country: "Canada", name: "Charlottetown", condition: "Mưa tuyết nhỏ", icon: CloudSnow },
];

export default function RecentCities() {
  const { pinnedCities, setCoords, loadWeather } = useWeatherStore();
  
  // For the sake of matching the design, we will use the mock cities if pinnedCities is empty.
  // In a real app, we would map over pinnedCities or recent search history.
  const displayCities = pinnedCities.length > 0 ? pinnedCities.slice(0, 4) : MOCK_CITIES;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-night-fg">Thành phố khác</h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {displayCities.map((c) => {
          const Icon = ('icon' in c) ? c.icon : CloudSun; // Fallback icon for pinned cities
          const condition = ('condition' in c) ? c.condition : "Không rõ";
          const country = ('country' in c) ? c.country : "Thành phố";
          
          return (
            <button
              key={c.name}
              onClick={() => {
                if ('lat' in c && 'lon' in c) {
                  setCoords(c.lat, c.lon, c.name);
                  loadWeather(c.lat, c.lon);
                }
              }}
              className="bg-dash-panel rounded-[20px] p-4 flex items-center justify-between text-left hover:bg-dash-panel/80 transition-colors shadow-sm"
            >
              <div>
                <div className="text-[10px] text-night-muted mb-1">{country}</div>
                <div className="text-sm font-semibold text-night-fg leading-tight mb-1">{c.name}</div>
                <div className="text-[11px] text-night-muted">{condition}</div>
              </div>
              <div className="text-night-muted drop-shadow-sm">
                <Icon size={28} className={('icon' in c && c.icon === Sun) ? "text-yellow-400" : ""} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
