import { motion } from "framer-motion";
import { useWeatherStore } from "../../../store/weatherStore";
import { Activity, Zap, Sun, Moon, Sunrise, Sunset } from "lucide-react";

export default function EnvironmentalDashboard() {
    const { current } = useWeatherStore();

    if (!current) return null;

    const getAqiColor = (aqi: number) => {
        if (aqi <= 50) return "text-emerald-500";
        if (aqi <= 100) return "text-amber-500";
        if (aqi <= 150) return "text-orange-500";
        return "text-rose-500";
    };

    const aqiColorClass = getAqiColor(current.aqi ?? 0);

    return (
        <div className="mt-16 space-y-12">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-flat-primary text-white flex items-center justify-center rounded-xl border-4 border-flat-border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                    <Activity size={24} />
                </div>
                <h3 className="text-4xl font-black text-flat-fg tracking-tighter uppercase">
                    Elite <span className="text-flat-primary">Analytics</span>
                </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* AQI Gauge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 flat-card-base border-flat-border bg-white p-10 flex flex-col md:flex-row items-center gap-12"
                >
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="128"
                                cy="128"
                                r="110"
                                stroke="currentColor"
                                strokeWidth="24"
                                fill="transparent"
                                className="text-flat-muted"
                            />
                            <motion.circle
                                cx="128"
                                cy="128"
                                r="110"
                                stroke="currentColor"
                                strokeWidth="24"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 110}
                                initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
                                whileInView={{ strokeDashoffset: 2 * Math.PI * 110 * (1 - (Math.min(current.aqi ?? 0, 300) / 300)) }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className={aqiColorClass}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-7xl font-black tracking-tighter ${aqiColorClass}`}>
                                {current.aqi ?? 'N/A'}
                            </span>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">AQI Index</span>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-6 w-full">
                        <PollutantCard label="PM2.5" value={current.pm2_5} unit="µg/m³" color="text-orange-500" />
                        <PollutantCard label="PM10" value={current.pm10} unit="µg/m³" color="text-amber-500" />
                        <PollutantCard label="Ozone" value={current.ozone} unit="µg/m³" color="text-purple-500" />
                        <PollutantCard label="Visibility" value={current.visibility ? (current.visibility / 1000).toFixed(1) : 'N/A'} unit="km" color="text-blue-500" />
                    </div>
                </motion.div>

                {/* Astro Cycle */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="flat-card-base border-flat-primary bg-flat-primary/5 p-10 flex flex-col justify-between"
                >
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-flat-primary mb-8 flex items-center gap-2">
                            <Moon size={16} fill="currentColor" /> Celestial Cycle
                        </h4>

                        <div className="space-y-8">
                            <AstroRow
                                icon={<Sunrise size={20} />}
                                label="Sunrise"
                                value={current.sunrise ? new Date(current.sunrise).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : 'N/A'}
                                color="text-amber-500"
                            />
                            <AstroRow
                                icon={<Sunset size={20} />}
                                label="Sunset"
                                value={current.sunset ? new Date(current.sunset).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : 'N/A'}
                                color="text-rose-500"
                            />
                            <div className="h-0.5 w-full bg-flat-primary/10 rounded-full" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">UV Intensity</div>
                                    <div className="text-2xl font-black text-flat-fg">{current.uvIndex?.toFixed(1) ?? 'N/A'}</div>
                                </div>
                                <div className="p-3 bg-white border-2 border-flat-border rounded-xl">
                                    {current.uvIndex && current.uvIndex > 5 ? (
                                        <Zap className="text-amber-500" size={24} fill="currentColor" />
                                    ) : (
                                        <Sun className="text-flat-primary" size={24} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-white border-2 border-flat-border rounded-xl text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Observation Node</span>
                        <span className="text-xs font-black text-flat-primary">Station E-024 • Active</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function PollutantCard({ label, value, unit, color }: { label: string; value: number | string | undefined; unit: string; color: string }) {
    return (
        <div className="p-4 bg-flat-muted/50 border-2 border-flat-border rounded-xl">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</div>
            <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-black ${color}`}>{value ?? 'N/A'}</span>
                <span className="text-[10px] font-bold text-slate-400">{unit}</span>
            </div>
        </div>
    );
}

function AstroRow({ icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-white border-2 border-flat-border flex items-center justify-center rounded-lg ${color}`}>
                    {icon}
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-flat-fg">{label}</span>
            </div>
            <span className="text-xl font-black text-flat-fg">{value}</span>
        </div>
    );
}
