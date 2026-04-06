import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, History, Command, Star } from "lucide-react";
import { useWeatherStore } from "../../../store/weatherStore";
import { searchLocation, fetchSuggestions } from "../../../api/weatherApi";
import { motion, AnimatePresence } from "framer-motion";
import PinnedLocations from "./PinnedLocations";

const TRENDING_CITIES = [
  "Hanoi", "Ho Chi Minh City", "Da Nang", "Paris", "London", "New York", "Tokyo"
];

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { setCoords, loadWeather, searchHistory, addToHistory, city, lat, lon, pinnedCities, togglePinCity } = useWeatherStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  // Debounced search for suggestions
  useEffect(() => {
    if (q.length < 2) {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await fetchSuggestions(q);
        setSuggestions(results);
        setActiveIndex(-1);
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [q]);

  async function handleSearch(query: string = q) {
    if (!query.trim()) return;
    setIsSearching(true);
    setShowHistory(false);
    try {
      const { lat, lon, cityName } = await searchLocation(query);
      setCoords(lat, lon, cityName);
      addToHistory(cityName);
      await loadWeather(lat, lon);
      setQ("");
      setSuggestions([]);
    } catch {
      alert("❌ Không tìm thấy địa điểm");
    } finally {
      setIsSearching(false);
    }
  }

  async function selectSuggestion(s: any) {
    setIsSearching(true);
    setShowHistory(false);
    try {
      setCoords(s.latitude, s.longitude, s.name);
      addToHistory(s.name);
      await loadWeather(s.latitude, s.longitude);
      setQ("");
      setSuggestions([]);
    } catch {
      alert("❌ Lỗi khi tải dữ liệu thành phố");
    } finally {
      setIsSearching(false);
    }
  }

  function handleMyLocation() {
    if (!navigator.geolocation) {
      alert("❌ Trình duyệt không hỗ trợ định vị");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCoords(lat, lon, "Vị trí của bạn");
        await loadWeather(lat, lon);
      },
      (err) => alert("❌ Không lấy được vị trí: " + err.message)
    );
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setShowHistory(true);
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        selectSuggestion(suggestions[activeIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowHistory(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="relative z-50">
      {/* Super-Pod Container */}
      <div className="relative flex flex-col lg:flex-row items-center bg-white border-4 border-flat-border rounded-4xl lg:rounded-full p-2 transition-all focus-within:border-flat-primary shadow-[16px_16px_0px_0px_rgba(30,41,59,0.05)]">

        {/* Input Section */}
        <div className="relative flex-1 w-full flex items-center group ml-4 lg:ml-6">
          <div className="text-slate-400 group-focus-within:text-flat-primary transition-colors flex items-center gap-2 pointer-events-none">
            <Search size={20} strokeWidth={3} />
          </div>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onKeyDown={handleInputKeyDown}
            className="w-full h-12 lg:h-14 bg-transparent border-none outline-none px-4 text-lg font-bold text-flat-fg placeholder:text-slate-300"
            placeholder="Tìm kiếm thành phố..."
            disabled={isSearching}
          />

          {/* Inline Controls (Pin & Shortcut) */}
          <div className="hidden sm:flex items-center gap-3 pr-4 border-r-2 border-flat-border/50 h-8 my-auto">
            <button
              onClick={() => togglePinCity({ name: city, lat: lat!, lon: lon! })}
              className={`p-1.5 rounded-lg transition-all ${pinnedCities.some(c => c.name === city) ? 'text-amber-500 scale-110' : 'text-slate-300 hover:text-slate-400'}`}
              title={pinnedCities.some(c => c.name === city) ? "Bỏ ghim thành phố" : "Ghim thành phố"}
            >
              <Star size={18} fill={pinnedCities.some(c => c.name === city) ? "currentColor" : "none"} />
            </button>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-flat-muted rounded-md text-[8px] font-black text-slate-400">
              <Command size={10} />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Action Pod Section */}
        <div className="flex items-center gap-2 w-full lg:w-auto mt-2 lg:mt-0 lg:ml-2">
          <button
            onClick={handleMyLocation}
            className="h-12 lg:h-14 w-12 lg:w-14 flex items-center justify-center rounded-2xl lg:rounded-full bg-flat-muted border-2 border-flat-border group transition-all hover:bg-flat-primary/5 active:scale-90"
            title="Sử dụng vị trí hiện tại"
          >
            <MapPin size={20} strokeWidth={3} className="text-flat-primary transition-transform group-hover:scale-110" />
          </button>

          <button
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="flex-1 lg:flex-none h-12 lg:h-14 bg-flat-primary text-white rounded-2xl lg:rounded-full px-6 lg:px-10 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(37,99,235,0.2)] hover:translate-y-[-2px] hover:shadow-[4px_6px_0px_0px_rgba(37,99,235,0.2)] active:translate-y-0 active:shadow-none transition-all disabled:opacity-50"
          >
            {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={18} strokeWidth={4} />}
            <span>Tìm kiếm</span>
          </button>
        </div>

        {/* Suggestions Dropdown (Scoped to Pod) */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              ref={historyRef}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="absolute top-[calc(100%+16px)] left-0 right-0 bg-white border-4 border-flat-border rounded-3xl overflow-hidden z-60 shadow-[24px_24px_0px_0px_rgba(30,41,59,0.08)]"
            >
              {/* Live Search Suggestions */}
              {suggestions.length > 0 && (
                <div className="border-b-4 border-flat-border">
                  <div className="px-6 py-4 bg-flat-muted text-[10px] font-black uppercase tracking-[0.2em] text-flat-primary flex justify-between items-center">
                    <span>Địa điểm tìm thấy</span>
                    <Search size={14} />
                  </div>
                  <div className="max-h-[250px] overflow-y-auto">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectSuggestion(s)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`w-full px-8 py-4 text-left transition-all flex items-center justify-between group border-b-2 border-flat-border last:border-0 ${activeIndex === idx ? "bg-flat-primary/10" : "hover:bg-flat-primary/5"
                          }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-black text-flat-fg text-lg uppercase leading-tight">{s.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {s.admin1 ? `${s.admin1}, ` : ""}{s.country}
                          </span>
                        </div>
                        <MapPin size={18} className="text-slate-200 group-hover:text-flat-primary" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent History Section */}
              {searchHistory.length > 0 && suggestions.length === 0 && (
                <div className="border-b-4 border-flat-border">
                  <div className="px-6 py-4 bg-flat-muted text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex justify-between items-center">
                    <span>Lịch sử tìm kiếm</span>
                    <History size={14} />
                  </div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {searchHistory.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearch(item)}
                        className="w-full px-8 py-4 text-left hover:bg-flat-primary/5 transition-all flex items-center justify-between group border-b-2 border-flat-border last:border-0"
                      >
                        <span className="font-black text-flat-fg text-lg uppercase">{item}</span>
                        <MapPin size={18} className="text-slate-200 group-hover:text-flat-primary" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reset Trending if suggestions available, or show if q is empty */}
              {(q.length === 0 || (suggestions.length === 0 && searchHistory.length === 0)) && (
                <>
                  <div className="px-6 py-4 bg-flat-muted text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex justify-between items-center">
                    <span>Địa điểm phổ biến</span>
                    <div className="w-2 h-2 bg-flat-primary rounded-full animate-pulse" />
                  </div>
                  <div className="p-6 flex flex-wrap gap-2">
                    {TRENDING_CITIES.filter(c => !searchHistory.includes(c)).map((city) => (
                      <button
                        key={city}
                        onClick={() => handleSearch(city)}
                        className="px-5 py-2.5 border-2 border-flat-border rounded-xl font-black text-xs text-slate-500 hover:border-flat-primary hover:text-flat-primary hover:bg-flat-primary/5 transition-all uppercase tracking-tight"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pinned Locations Dashboard */}
      <PinnedLocations />
    </div>
  );
}
