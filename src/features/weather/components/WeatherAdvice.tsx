import { motion } from "framer-motion";
import { useWeatherStore } from "../../../store/weatherStore";
import { ShieldCheck, AlertTriangle, CloudRain, Sun, Wind } from "lucide-react";

export default function WeatherAdvice() {
    const { current } = useWeatherStore();

    if (!current) return null;

    const aqi = current.aqi ?? 0;
    const isRain = current.weatherCode >= 51;
    const uv = current.uvIndex ?? 0;

    const getAdvice = () => {
        let health = { text: "Air quality is good. Great for outdoor exercise!", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" };
        let activity = { text: "Conditions are excellent for any outdoor plans.", icon: Sun, color: "text-amber-500", bg: "bg-amber-50" };

        if (aqi > 100) {
            health = { text: "Poor air quality. Sensitive groups should wear masks.", icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-50" };
        } else if (aqi > 150) {
            health = { text: "Harmful pollution levels. Stay indoors if possible.", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" };
        }

        if (isRain) {
            activity = { text: "Rain expected. Movie day or indoor activities recommended.", icon: CloudRain, color: "text-blue-500", bg: "bg-blue-50" };
        } else if (uv > 7) {
            activity = { text: "Very high UV. Wear sunblock and avoid peak sun hours.", icon: Wind, color: "text-orange-500", bg: "bg-orange-50" };
        }

        return { health, activity };
    };

    const { health, activity } = getAdvice();

    return (
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <AdviceCard
                title="Health Status"
                advice={health.text}
                Icon={health.icon}
                color={health.color}
                bg={health.bg}
            />
            <AdviceCard
                title="Activity Plan"
                advice={activity.text}
                Icon={activity.icon}
                color={activity.color}
                bg={activity.bg}
            />
        </div>
    );
}

function AdviceCard({ title, advice, Icon, color, bg }: { title: string, advice: string, Icon: any, color: string, bg: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-8 rounded-2xl border-4 border-flat-border bg-white flex items-start gap-6 hover:translate-y-[-4px] transition-transform`}
        >
            <div className={`w-14 h-14 ${bg} ${color} rounded-xl border-2 border-flat-border flex items-center justify-center shrink-0`}>
                <Icon size={28} />
            </div>
            <div>
                <h4 className="text-lg font-black uppercase tracking-tighter text-flat-fg mb-2 flex items-center gap-2">
                    {title}
                    <div className={`w-2 h-2 rounded-full ${bg.replace('bg-', 'bg-')}`} />
                </h4>
                <p className="font-bold text-slate-500 leading-relaxed text-sm">
                    {advice}
                </p>
            </div>
        </motion.div>
    );
}
