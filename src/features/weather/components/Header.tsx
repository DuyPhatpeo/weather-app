import { useState, useEffect } from "react";
import { Settings, MapPin, Search, Moon, Sun, Loader2 } from "lucide-react";
import { useWeatherStore } from "@/store/weatherStore";
import { searchLocation, fetchSuggestions } from "@/api/weatherApi";

interface Suggestion {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenMap: () => void;
}

export default function Header({ onOpenSettings, onOpenMap }: HeaderProps) {
  const { city, theme, toggleTheme, setCoords, loadWeather, addToHistory, searchHistory } = useWeatherStore();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const dropdownOpen = showSuggestions && (suggestions.length > 0 || searchHistory.length > 0);

  return (
    <header className="flex items-center justify-between w-full pb-6 pt-2">
      {/* Left section: Icons and Location */}
      <div className="flex items-center gap-4 text-night-fg">
        <button 
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-xl bg-dash-panel flex items-center justify-center hover:bg-dash-panel/80 transition-colors"
          title="Cài đặt"
        >
          <Settings size={20} />
        </button>
        <button 
          onClick={onOpenMap}
          className="flex items-center gap-2 ml-2 hover:opacity-80 transition-opacity"
          title="Xem bản đồ"
        >
          <MapPin size={20} className="text-night-fg" />
          <span className="font-semibold text-lg hover:underline">{city}</span>
        </button>
      </div>

      {/* Center section: Search Bar */}
      <div className="flex-1 max-w-xl px-8 relative">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-night-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Tìm kiếm thành phố"
            className="w-full h-11 pl-11 pr-11 rounded-full bg-dash-panel text-sm text-night-fg placeholder:text-night-muted outline-none focus:ring-1 focus:ring-dash-active transition-all"
          />
          {busy && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-night-muted animate-spin" />}
        </div>
        
        {dropdownOpen && (
          <div className="absolute top-[calc(100%+8px)] left-8 right-8 bg-dash-panel rounded-xl overflow-hidden z-50 max-h-56 overflow-y-auto styled-scrollbar shadow-xl border border-night-border/50">
            {suggestions.length > 0
              ? suggestions.map((s, i) => (
                  <button
                    key={i}
                    onMouseDown={() => selectSuggestion(s)}
                    className="w-full text-left px-4 py-2.5 text-sm text-night-fg hover:bg-white/5 flex items-center gap-2"
                  >
                    <MapPin size={14} className="text-night-muted shrink-0" />
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
                    className="w-full text-left px-4 py-2.5 text-sm text-night-muted hover:bg-white/5 flex items-center gap-2"
                  >
                    <Search size={14} className="shrink-0" />
                    <span className="truncate">{h}</span>
                  </button>
                ))}
          </div>
        )}
      </div>

      {/* Right section: Theme */}
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-dash-panel rounded-full p-1">
          <button
            onClick={() => theme === "light" && toggleTheme()}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${theme === "dark" ? "bg-dash-active text-dash-active-fg" : "text-night-muted hover:text-night-fg"}`}
          >
            <Moon size={16} fill={theme === "dark" ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => theme === "dark" && toggleTheme()}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${theme === "light" ? "bg-dash-active text-dash-active-fg" : "text-night-muted hover:text-night-fg"}`}
          >
            <Sun size={16} fill={theme === "light" ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </header>
  );
}
