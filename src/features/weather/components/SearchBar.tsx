import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, History } from "lucide-react";
import { useWeatherStore } from "../../../store/weatherStore";
import { searchLocation } from "../../../api/weatherApi";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { setCoords, loadWeather, searchHistory, addToHistory } = useWeatherStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

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
    } catch {
      alert("❌ Không tìm thấy địa điểm");
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex flex-col sm:flex-row gap-3 mb-8 z-50">
      <div className="relative flex-1 group">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setShowHistory(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flat-input w-full pl-12 pr-4 h-14"
          placeholder="Tìm kiếm thành phố (Ctrl + K)..."
          disabled={isSearching}
        />
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-flat-primary transition-colors"
          size={20}
        />

        <AnimatePresence>
          {showHistory && searchHistory.length > 0 && (
            <motion.div
              ref={historyRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border-4 border-flat-border rounded-lg overflow-hidden z-60"
            >
              <div className="px-4 py-2 bg-flat-muted text-xs font-bold uppercase tracking-wider text-slate-500 border-b-2 border-flat-border flex justify-between items-center">
                <span>Tìm kiếm gần đây</span>
                <History size={14} />
              </div>
              {searchHistory.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(item)}
                  className="w-full px-4 py-3 text-left hover:bg-flat-muted transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium text-slate-700">{item}</span>
                  <History size={16} className="text-slate-300 group-hover:text-flat-primary" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleSearch()}
          disabled={isSearching}
          className="flat-button-primary flex-1 sm:flex-none flex items-center justify-center gap-2 min-w-[100px]"
        >
          {isSearching ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Search size={20} />
          )}
          <span>{isSearching ? "..." : "Tìm"}</span>
        </button>

        <button
          onClick={handleMyLocation}
          className="flat-button-secondary px-5"
          title="Sử dụng vị trí hiện tại"
        >
          <MapPin size={22} className="text-flat-primary" />
        </button>
      </div>
    </div>
  );
}
