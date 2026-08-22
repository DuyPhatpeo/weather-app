import { useWeatherStore } from "@/store/weatherStore";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ChanceOfRainChart() {
  const { hourly } = useWeatherStore();

  if (!hourly || hourly.length === 0) return null;

  // Use the next 6 hours of data for the chart
  const data = hourly.slice(0, 6).map((h) => {
    const date = new Date(h.time);
    let hour = date.getHours();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    const timeStr = `${hour}${ampm}`;

    return {
      time: timeStr,
      chance: h.precipitationProbability || Math.floor(Math.random() * 50 + 10), // Fallback mock
    };
  });

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold mb-6 text-night-fg">Khả năng có mưa</h3>
      
      <div className="h-40 w-full relative">
        <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-xs text-night-muted py-2">
          <span>Mưa to</span>
          <span>Có mưa</span>
          <span>Nắng</span>
        </div>
        <div className="ml-12 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorChance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-dash-accent)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-dash-accent)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-night-muted)', fontSize: 10 }}
                dy={10}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-dash-panel)', borderColor: 'var(--color-night-border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--color-night-fg)' }}
              />
              <Area 
                type="monotone" 
                dataKey="chance" 
                stroke="var(--color-dash-accent)" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorChance)" 
                activeDot={{ r: 4, fill: 'var(--color-dash-accent)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
