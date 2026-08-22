import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useWeatherStore } from "@/store/weatherStore";
import { formatHour } from "@/utils/weatherUtils";

export default function RainChance() {
  const { hourly, selectedDate, theme } = useWeatherStore();
  if (!hourly?.length) return null;

  const muted = theme === "dark" ? "#9aa1ab" : "#6b7280";
  const panel = theme === "dark" ? "#1c2024" : "#ffffff";
  const border = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
  const fg = theme === "dark" ? "#f4f5f7" : "#14171a";

  const data = (selectedDate ? hourly.filter((h) => h.time.startsWith(selectedDate)) : hourly.slice(0, 24)).map((h) => ({
    time: formatHour(h.time, selectedDate),
    chance: h.precipitationProbability ?? 0,
  }));

  return (
    <div>
      <div className="section-label mb-3">Khả năng mưa</div>
      <div className="h-[140px] w-full -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="time" axisLine={false} tickLine={false} interval={3} tick={{ fill: muted, fontSize: 10 }} />
            <Tooltip
              cursor={{ fill: "rgba(59,130,246,0.08)" }}
              contentStyle={{ background: panel, border: `1px solid ${border}`, borderRadius: 12, color: fg }}
              labelStyle={{ color: muted }}
              formatter={(v) => [`${v}%`, "Khả năng mưa"]}
            />
            <Bar dataKey="chance" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.chance > 50 ? "#3b82f6" : "#3b82f680"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
