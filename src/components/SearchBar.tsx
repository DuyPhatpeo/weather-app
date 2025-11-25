import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { useWeatherStore } from "../stores/weatherStore";
import { searchLocation } from "../api/weatherApi";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const setCoords = useWeatherStore((s) => s.setCoords);
  const loadWeather = useWeatherStore((s) => s.loadWeather);

  const inputRef = useRef<HTMLInputElement>(null);

  async function search() {
    if (!q.trim()) return;
    setIsSearching(true);
    try {
      const { lat, lon, cityName } = await searchLocation(q);
      setCoords(lat, lon, cityName);
      await loadWeather(lat, lon);
      setQ("");
    } catch {
      alert("❌ Không tìm thấy địa điểm");
    } finally {
      setIsSearching(false);
    }
  }

  function useMyLocation() {
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") search();
  };

  // Ctrl + K để focus input
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white shadow-lg border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Tìm kiếm thành phố..."
          disabled={isSearching}
        />
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={search}
          disabled={isSearching}
          className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSearching && <Loader2 size={20} className="animate-spin" />}
          <span className="hidden sm:inline">
            {isSearching ? "Đang tìm..." : "Tìm"}
          </span>
          <span className="sm:hidden">{isSearching ? "..." : "Tìm"}</span>
        </button>

        <button
          onClick={useMyLocation}
          className="px-5 py-3.5 rounded-xl bg-white shadow-lg text-slate-700 hover:bg-slate-50 transition-all border border-slate-200"
          title="Sử dụng vị trí hiện tại"
        >
          <MapPin size={20} />
        </button>
      </div>
    </div>
  );
}
