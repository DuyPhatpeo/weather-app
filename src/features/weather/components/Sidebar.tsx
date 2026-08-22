import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from "react-leaflet";
import { CloudSun, Search, MapPin, ChevronRight, Loader2, Star, Sun, Moon, Crosshair, History, Settings2, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeatherStore } from "@/store/weatherStore";
import { searchLocation, fetchSuggestions } from "@/api/weatherApi";
import { useWeatherAlerts } from "@/features/weather/hooks/useWeatherAlerts";
import "leaflet/dist/leaflet.css";

interface Suggestion {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
}

const aqiStatus = (aqi?: number) => {
  if (aqi == null) return { label: "Không rõ", color: "#9aa1ab" };
  if (aqi <= 50) return { label: "Tốt", color: "#34d399" };
  if (aqi <= 100) return { label: "Trung bình", color: "#fbbf24" };
  if (aqi <= 150) return { label: "Kém", color: "#fb923c" };
  return { label: "Nguy hiểm", color: "#f87171" };
};

export default function Sidebar({ 
  onShowDetails,
  onOpenSettings
}: { 
  onShowDetails: () => void;
  onOpenSettings: () => void;
}) {
  const {
    city, lat, lon, current, hourly, pinnedCities, togglePinCity, setCoords, loadWeather,
    theme, toggleTheme, searchHistory, addToHistory,
  } = useWeatherStore();
  const isPinned = pinnedCities.some((c) => c.name === city);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const alerts = useWeatherAlerts();

  const status = aqiStatus(current?.aqi);
  const dropdownOpen = showSuggestions && (suggestions.length > 0 || searchHistory.length > 0);

  // Sparkline from the next few hours of temperature
  const trend = (hourly ?? []).slice(0, 8).map((h) => h.temperature);
  const trendPath = buildSparkline(trend);

  useEffect(() => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      fetchSuggestions(q).then(setSuggestions).catch(() => setSuggestions([]));
    }, 400);
    return () => clearTimeout(timer);
  }, [q]);

  async function handleSearch(query: string = q) {
    if (!query.trim()) return;
    setBusy(true);
    setShowSuggestions(false);
    try {
      const { lat, lon, cityName } = await searchLocation(query);
      setCoords(lat, lon, cityName);
      addToHistory(cityName);
      await loadWeather(lat, lon);
      setQ("");
      setSuggestions([]);
    } catch {
      alert("Không tìm thấy địa điểm");
    } finally {
      setBusy(false);
    }
  }

  function selectSuggestion(s: Suggestion) {
    setCoords(s.latitude, s.longitude, s.name);
    addToHistory(s.name);
    loadWeather(s.latitude, s.longitude);
    setQ("");
    setSuggestions([]);
    setShowSuggestions(false);
  }

  function goTo(lat: number, lon: number, name: string) {
    setCoords(lat, lon, name);
    loadWeather(lat, lon);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords(latitude, longitude, "Vị trí của bạn");
        loadWeather(latitude, longitude).finally(() => setLocating(false));
      },
      (err) => {
        alert("Không lấy được vị trí: " + err.message);
        setLocating(false);
      }
    );
  }

  return (
    <aside className="w-full md:w-[280px] shrink-0 p-6 md:p-7 flex flex-col gap-8 border-b md:border-b-0 md:border-r border-night-border">
      {/* Brand */}
      <div className="flex items-center justify-between text-night-fg">
        <div className="flex items-center gap-2">
          <CloudSun className="text-night-accent drop-shadow-[0_0_10px_rgba(255,138,61,0.45)]" size={22} />
          <span className="font-bold text-lg tracking-tight">SkyCast</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="relative">
            <button
              onClick={() => setShowAlerts((v) => !v)}
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-night-muted hover:text-night-fg hover:bg-white/5 transition-colors"
              title="Cảnh báo thời tiết"
            >
              <Bell size={16} />
              {alerts.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-night-card" />
              )}
            </button>

            <AnimatePresence>
              {showAlerts && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  className="absolute top-[calc(100%+8px)] left-0 w-72 glass-panel rounded-2xl p-3 z-30 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.5)]"
                >
                  {alerts.length === 0 ? (
                    <p className="text-xs text-night-muted text-center py-4">Không có cảnh báo nào.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {alerts.map((alert) => (
                        <div key={alert.id} className={`flex items-start gap-2.5 p-3 rounded-xl border ${alert.color}`}>
                          <alert.icon size={16} className="shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-semibold leading-tight">{alert.title}</div>
                            <p className="text-[11px] opacity-90 mt-1">{alert.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-full flex items-center justify-center text-night-muted hover:text-night-fg hover:bg-white/5 transition-colors"
            title="Cài đặt"
          >
            <Settings2 size={16} />
          </button>
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-night-muted hover:text-night-fg transition-colors"
            title={theme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      {/* Status widget */}
      <div className="glass-panel card-hover rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="section-label">Status</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-bold" style={{ color: status.color }}>
            ↑ {current?.aqi ?? "--"}
          </div>
          <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${status.color}22`, color: status.color }}
          >
            {status.label}
          </span>
        </div>
        {trendPath && (
          <svg viewBox="0 0 100 28" className="w-full h-7 mt-3" preserveAspectRatio="none">
            <path d={trendPath} fill="none" stroke={status.color} strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
        <button
          onClick={onShowDetails}
          className="mt-3 text-[11px] font-semibold text-night-muted hover:text-night-accent transition-colors flex items-center gap-1 group"
        >
          Xem chi tiết <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Select area */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <span className="section-label">Select Area</span>
        </div>

        <div className="relative mb-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-night-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Tìm thành phố..."
            className="w-full h-9 pl-8 pr-8 rounded-lg glass-panel text-sm text-night-fg placeholder:text-night-muted outline-none focus:border-night-accent/50 focus:shadow-[0_0_0_3px_rgba(255,138,61,0.12)] transition-all"
          />
          <button
            onClick={useMyLocation}
            title="Dùng vị trí hiện tại"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-night-muted hover:text-night-accent transition-colors"
          >
            {busy || locating ? <Loader2 size={14} className="animate-spin" /> : <Crosshair size={14} />}
          </button>

          {dropdownOpen && (
            <div className="absolute top-[calc(100%+6px)] left-0 right-0 glass-panel rounded-lg overflow-hidden z-20 max-h-56 overflow-y-auto styled-scrollbar shadow-[0_16px_32px_-8px_rgba(0,0,0,0.5)]">
              {suggestions.length > 0
                ? suggestions.map((s, i) => (
                    <button
                      key={i}
                      onMouseDown={() => selectSuggestion(s)}
                      className="w-full text-left px-3 py-2 text-xs text-night-fg hover:bg-white/10 flex items-center gap-2"
                    >
                      <MapPin size={12} className="text-night-muted shrink-0" />
                      <span className="truncate">
                        {s.name}
                        {s.admin1 ? `, ${s.admin1}` : ""}, {s.country}
                      </span>
                    </button>
                  ))
                : searchHistory.map((h, i) => (
                    <button
                      key={i}
                      onMouseDown={() => handleSearch(h)}
                      className="w-full text-left px-3 py-2 text-xs text-night-muted hover:bg-white/10 flex items-center gap-2"
                    >
                      <History size={12} className="shrink-0" />
                      <span className="truncate">{h}</span>
                    </button>
                  ))}
            </div>
          )}
        </div>

        <div className="h-3" />

        {current && !dropdownOpen && (
          <div className="w-40 h-40 mx-auto rounded-full overflow-hidden relative mb-4 shrink-0 ring-1 ring-night-border shadow-[0_0_0_6px_rgba(255,138,61,0.06),0_12px_28px_-10px_rgba(0,0,0,0.5)]">
            <MapContainer
              key={city}
              center={[lat, lon]}
              zoom={3}
              zoomControl={false}
              attributionControl={false}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                url={
                  theme === "dark"
                    ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                    : "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                }
              />
              <CircleMarker
                center={[lat, lon]}
                radius={6}
                pathOptions={{ color: "#ff8a3d", fillColor: "#ff8a3d", fillOpacity: 1 }}
              />
              {pinnedCities.map((c) => (
                <CircleMarker
                  key={c.name}
                  center={[c.lat, c.lon]}
                  radius={4}
                  pathOptions={{ color: "#9aa1ab", fillColor: "#9aa1ab", fillOpacity: 1 }}
                  eventHandlers={{ click: () => goTo(c.lat, c.lon, c.name) }}
                >
                  <LeafletTooltip>{c.name}</LeafletTooltip>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        )}

        {pinnedCities.length > 0 && !dropdownOpen && (
          <div className="space-y-1.5 overflow-y-auto styled-scrollbar">
            {pinnedCities.map((c) => (
              <button
                key={c.name}
                onClick={() => goTo(c.lat, c.lon, c.name)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-medium transition-all hover:translate-x-0.5 ${
                  c.name === city ? "bg-night-accent/15 text-night-fg" : "text-night-muted hover:bg-white/5"
                }`}
              >
                <MapPin size={12} className={c.name === city ? "text-night-accent" : ""} />
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Current location pill */}
      <div className="rounded-xl glass-panel card-hover px-4 py-3 text-sm font-medium text-night-fg flex items-center justify-between gap-2">
        <span className="truncate">{city}</span>
        <button
          onClick={() => togglePinCity({ name: city, lat, lon })}
          className={`shrink-0 transition-colors ${isPinned ? "text-night-accent" : "text-night-muted hover:text-night-fg"}`}
          title={isPinned ? "Bỏ ghim" : "Ghim thành phố"}
        >
          <Star size={16} fill={isPinned ? "currentColor" : "none"} />
        </button>
      </div>
    </aside>
  );
}

function buildSparkline(values: number[]): string | null {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = 100 / (values.length - 1);
  const points = values.map((v, i) => [i * step, 24 - ((v - min) / range) * 24 + 2] as const);
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}
