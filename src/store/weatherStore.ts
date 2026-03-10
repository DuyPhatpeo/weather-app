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
      pinnedCities: [],

      current: null,
      hourly: null,
      daily: null,
      forecastDays: 10,
      selectedDate: null,
      loading: false,
      error: null,

      setCoords: (lat, lon, city) => set({ lat, lon, city, selectedDate: null }),

      setUnit: (unit) => set({ unit }),

      togglePinCity: (cityName) => {
        const pinned = get().pinnedCities;
        if (pinned.includes(cityName)) {
          set({ pinnedCities: pinned.filter((c) => c !== cityName) });
        } else {
          set({ pinnedCities: [...pinned, cityName] });
        }
      },

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

          // Today's index is 1 because we fetch past_days: 1
          const todayIdx = data.daily.time.findIndex((t: string) => t === new Date().toISOString().split('T')[0]);
          const finalTodayIdx = todayIdx !== -1 ? todayIdx : 1;

          // Find current hour index in hourly.time
          const nowHourStr = new Date().toISOString().substring(0, 13) + ":00";
          const currentHourIdx = data.hourly.time.findIndex((t: string) => t.startsWith(nowHourStr));
          const finalHourIdx = currentHourIdx !== -1 ? currentHourIdx : 0;

          const current: CurrentWeather = {
            temperature: data.current_weather?.temperature ?? 0,
            apparentTemperature: data.hourly?.apparent_temperature?.[finalHourIdx],
            windSpeed: data.current_weather?.windspeed ?? 0,
            weatherCode: data.current_weather?.weathercode ?? 0,
            humidity: data.hourly?.relativehumidity_2m?.[finalHourIdx] ?? 0,
            time: data.current_weather?.time ?? new Date().toISOString(),
            uvIndex: data.hourly?.uv_index?.[finalHourIdx],
            visibility: data.hourly?.visibility?.[finalHourIdx],
            pressure: data.hourly?.pressure_msl?.[finalHourIdx],
            aqi: data.air_quality?.hourly?.us_aqi?.[finalHourIdx],
            pm2_5: data.air_quality?.hourly?.pm2_5?.[finalHourIdx],
            pm10: data.air_quality?.hourly?.pm10?.[finalHourIdx],
            ozone: data.air_quality?.hourly?.ozone?.[finalHourIdx],
            sunrise: data.daily?.sunrise?.[finalTodayIdx],
            sunset: data.daily?.sunset?.[finalTodayIdx],
          };

          const allHourly: HourlyForecast[] = data.hourly.time.map(
            (_: any, i: number) => ({
              time: data.hourly.time[i],
              temperature: data.hourly.temperature_2m[i],
              apparentTemperature: data.hourly.apparent_temperature[i],
              weatherCode: data.hourly.weathercode[i],
              windSpeed: data.hourly.windspeed_10m[i],
              uvIndex: data.hourly.uv_index[i],
              precipitationProbability: data.hourly.precipitation_probability[i],
            })
          );

          const daily: DailyForecast[] = data.daily.time.map(
            (d: string, i: number) => ({
              date: d,
              tempMax: data.daily.temperature_2m_max[i],
              tempMin: data.daily.temperature_2m_min[i],
              weatherCode: data.daily.weathercode[i],
              uvIndex: data.daily.uv_index_max[i],
              precipitationSum: data.daily.precipitation_sum[i],
              sunrise: data.daily.sunrise?.[i],
              sunset: data.daily.sunset?.[i],
            })
          );

          set({
            current,
            hourly: allHourly,
            daily,
            loading: false,
            // Default select today
            selectedDate: data.daily.time[finalTodayIdx]
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
        pinnedCities: state.pinnedCities,
      }),
    }
  )
);
