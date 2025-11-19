export const fetchWeatherData = async (
  lat: number,
  lon: number,
  forecastDays: number
) => {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    timezone: "auto",
    daily: "temperature_2m_max,temperature_2m_min,weathercode",
    hourly: "temperature_2m,relativehumidity_2m,windspeed_10m,weathercode",
    current_weather: "true",
    forecast_days: forecastDays.toString(),
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error("Không thể tải dữ liệu thời tiết");

  return await res.json();
};

export const searchLocation = async (query: string) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    query
  )}&limit=1`;
  const res = await fetch(url);
  const list = await res.json();

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
