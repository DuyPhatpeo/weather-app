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
        let health = { text: "Chất lượng không khí tốt. Rất thích hợp cho các hoạt động ngoài trời!", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" };
        let activity = { text: "Điều kiện tuyệt vời cho mọi kế hoạch ngoài trời.", icon: Sun, color: "text-amber-500", bg: "bg-amber-50" };

        if (aqi > 100) {
            health = { text: "Chất lượng không khí kém. Nhóm người nhạy cảm nên đeo khẩu trang.", icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-50" };
        } else if (aqi > 150) {
            health = { text: "Mức độ ô nhiễm có hại. Nên ở trong nhà nếu có thể.", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" };
        }

        if (isRain) {
            activity = { text: "Dự báo có mưa. Bạn nên ưu tiên các hoạt động trong nhà.", icon: CloudRain, color: "text-blue-500", bg: "bg-blue-50" };
        } else if (uv > 7) {
            activity = { text: "Chỉ số UV rất cao. Hãy bôi kem chống nắng và tránh ra ngoài lúc nắng gắt.", icon: Wind, color: "text-orange-500", bg: "bg-orange-50" };
        }

        return { health, activity };
    };

    const { health, activity } = getAdvice();

    return (
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <AdviceCard
                title="Sức khỏe"
                advice={health.text}
                Icon={health.icon}
                color={health.color}
                bg={health.bg}
            />
            <AdviceCard
                title="Kế hoạch hoạt động"
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
