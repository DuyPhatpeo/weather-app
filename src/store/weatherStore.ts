import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  WeatherState,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
} from "../types/weather";
import { fetchWeatherData } from "../api/weatherApi";

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      // Mặc định Hồ Chí Minh
      lat: 10.8231,
      lon: 106.6297,
      city: "Ho Chi Minh City",
      unit: "celsius",
      searchHistory: [],

      current: null,
      hourly: null,
      daily: null,
      forecastDays: 10,
      selectedDate: null,
      loading: false,
      error: null,

      setCoords: (lat, lon, city) => set({ lat, lon, city, selectedDate: null }),

      setUnit: (unit) => set({ unit }),

      addToHistory: (city) => {
        const history = get().searchHistory;
        const newHistory = [city, ...history.filter((c) => c !== city)].slice(0, 5);
        set({ searchHistory: newHistory });
      },

      setForecastDays: (days) => {
        set({ forecastDays: days });
        const { lat, lon } = get();
        if (lat && lon) {
          get().loadWeather(lat, lon);
        }
      },

      setSelectedDate: (date) => set({ selectedDate: date }),

      loadWeather: async (latArg?, lonArg?) => {
        const lat = latArg ?? get().lat;
        const lon = lonArg ?? get().lon;
        const forecastDays = get().forecastDays;

        if (lat == null || lon == null) {
          set({ error: "Thiếu tọa độ" });
          return;
        }

        set({ loading: true, error: null });

        try {
          const data = await fetchWeatherData(lat, lon, forecastDays);

          const current: CurrentWeather = {
            temperature: data.current_weather?.temperature ?? 0,
            windSpeed: data.current_weather?.windspeed ?? 0,
            weatherCode: data.current_weather?.weathercode ?? 0,
            humidity: data.hourly?.relativehumidity_2m?.[0] ?? 0,
            time: data.current_weather?.time ?? new Date().toISOString(),
            uvIndex: data.hourly?.uv_index?.[0],
            visibility: data.hourly?.visibility?.[0],
            pressure: data.hourly?.pressure_msl?.[0],
          };

          const allHourly: HourlyForecast[] = data.hourly.time.map(
            (_: any, i: number) => ({
              time: data.hourly.time[i],
              temperature: data.hourly.temperature_2m[i],
              weatherCode: data.hourly.weathercode[i],
              windSpeed: data.hourly.windspeed_10m[i],
              uvIndex: data.hourly.uv_index[i],
            })
          );

          const daily: DailyForecast[] = data.daily.time.map(
            (d: string, i: number) => ({
              date: d,
              tempMax: data.daily.temperature_2m_max[i],
              tempMin: data.daily.temperature_2m_min[i],
              weatherCode: data.daily.weathercode[i],
              uvIndex: data.daily.uv_index_max[i],
            })
          );

          set({
            current,
            hourly: allHourly,
            daily,
            loading: false,
          });
        } catch (err: any) {
          set({ error: err.message ?? "Lỗi khi tải dữ liệu", loading: false });
        }
      },
    }),
    {
      name: "weather-storage",
      partialize: (state) => ({
        lat: state.lat,
        lon: state.lon,
        city: state.city,
        unit: state.unit,
        searchHistory: state.searchHistory,
      }),
    }
  )
);
