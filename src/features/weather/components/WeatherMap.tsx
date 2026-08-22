import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Fix for default Leaflet marker icons in React
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface WeatherMapProps {
  lat: number;
  lon: number;
  city: string;
  isOpen: boolean;
  onClose: () => void;
  theme: string;
}

// Map Updater Component to pan to new coordinates
function MapUpdater({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lon], 10, { duration: 1.5 });
  }, [lat, lon, map]);
  return null;
}

export default function WeatherMap({ lat, lon, city, isOpen, onClose, theme }: WeatherMapProps) {
  if (!isOpen) return null;

  const isDark = theme === "dark";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl h-[70vh] rounded-3xl overflow-hidden shadow-2xl glass-panel border border-night-border flex flex-col"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-night-border bg-night-card/80 backdrop-blur-md relative z-10">
            <h2 className="text-lg font-semibold text-night-fg">Bản đồ khu vực: {city}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-night-border/50 text-night-muted hover:text-night-fg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 w-full bg-night-card relative">
            <MapContainer
              center={[lat, lon]}
              zoom={10}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%", zIndex: 0 }}
            >
              {isDark ? (
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
              ) : (
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              )}
              
              <MapUpdater lat={lat} lon={lon} />
              
              <Marker position={[lat, lon]}>
                <Popup className={isDark ? "dark-popup" : ""}>
                  <div className="text-center font-medium">{city}</div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
