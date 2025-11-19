export interface CurrentWeather {
  temperature: number;
  windSpeed?: number;
  weatherCode?: number;
  humidity?: number;
  time?: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode?: number;
  windSpeed?: number;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode?: number;
}

export interface WeatherState {
  lat?: number;
  lon?: number;
  city?: string;
  current?: CurrentWeather | null;
  hourly?: HourlyForecast[] | null;
  daily?: DailyForecast[] | null;
  forecastDays: number;
  selectedDate: string | null;
  loading: boolean;
  error?: string | null;
  setCoords: (lat: number, lon: number, city?: string) => void;
  setForecastDays: (days: number) => void;
  setSelectedDate: (date: string | null) => void;
  loadWeather: (lat?: number, lon?: number) => Promise<void>;
}
