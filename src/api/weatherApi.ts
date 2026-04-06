import axios from "axios";

const weatherApi = axios.create({
  baseURL: "https://api.open-meteo.com/v1",
});

export const fetchWeatherData = async (
  lat: number,
  lon: number,
  forecastDays: number
) => {
  const [weatherRes, aqiRes] = await Promise.all([
    weatherApi.get("/forecast", {
      params: {
        latitude: lat,
        longitude: lon,
        timezone: "auto",
        daily: "temperature_2m_max,temperature_2m_min,weathercode,uv_index_max,sunrise,sunset,precipitation_sum",
        hourly:
          "temperature_2m,apparent_temperature,relativehumidity_2m,windspeed_10m,weathercode,uv_index,visibility,pressure_msl,precipitation_probability",
        current_weather: true,
        forecast_days: forecastDays,
        past_days: 1,
      },
    }),
    axios.get("https://air-quality-api.open-meteo.com/v1/air-quality", {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: "us_aqi,pm2_5,pm10,ozone",
      },
    }),
  ]);

  return {
    ...weatherRes.data,
    air_quality: aqiRes.data,
  };
};

export const searchLocation = async (query: string) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    query
  )}&limit=1`;
  const { data: list } = await axios.get(url);

  if (list.length === 0) {
    throw new Error("Không tìm thấy địa điểm");
  }

  const item = list[0];
  return {
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    cityName: item.display_name.split(",")[0],
  };
};
export const fetchSuggestions = async (query: string) => {
  if (!query || query.length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  const { data } = await axios.get(url);
  return data.results || [];
};

export const fetchBulkWeatherData = async (cities: { lat: number; lon: number }[]) => {
  if (cities.length === 0) return [];
  const lats = cities.map((c) => c.lat).join(",");
  const lons = cities.map((c) => c.lon).join(",");

  const { data } = await weatherApi.get("/forecast", {
    params: {
      latitude: lats,
      longitude: lons,
      current_weather: true,
    },
  });

  return Array.isArray(data) ? data : [data];
};
