import axios from "axios";

const weatherApi = axios.create({
  baseURL: "https://api.open-meteo.com/v1",
});

export const fetchWeatherData = async (
  lat: number,
  lon: number,
  forecastDays: number
) => {
  const { data } = await weatherApi.get("/forecast", {
    params: {
      latitude: lat,
      longitude: lon,
      timezone: "auto",
      daily: "temperature_2m_max,temperature_2m_min,weathercode,uv_index_max",
      hourly:
        "temperature_2m,relativehumidity_2m,windspeed_10m,weathercode,uv_index,visibility,pressure_msl",
      current_weather: true,
      forecast_days: forecastDays,
    },
  });

  return data;
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
