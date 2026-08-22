import { motion, AnimatePresence } from "framer-motion";
import { useWeatherAlerts } from "@/features/weather/hooks/useWeatherAlerts";

export default function AlertBanner() {
  const alerts = useWeatherAlerts();

  if (alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mb-6">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`flex items-start gap-3 p-4 rounded-2xl border ${alert.color}`}
          >
            <div className="shrink-0 mt-0.5">
              <alert.icon size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-sm leading-tight">{alert.title}</h4>
              <p className="text-xs opacity-90 mt-1">{alert.desc}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
