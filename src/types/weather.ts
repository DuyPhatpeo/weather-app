export interface CurrentWeather {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  humidity: number;
  time: string;
  uvIndex?: number;
  visibility?: number;
  pressure?: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  uvIndex?: number;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  uvIndex?: number;
}

export interface WeatherState {
  lat: number;
  lon: number;
  city: string;
  unit: "celsius" | "fahrenheit";
  searchHistory: string[];
  current: CurrentWeather | null;
  hourly: HourlyForecast[] | null;
  daily: DailyForecast[] | null;
  forecastDays: number;
  selectedDate: string | null;
  loading: boolean;
  error: string | null;
  
  setCoords: (lat: number, lon: number, city: string) => void;
  setUnit: (unit: "celsius" | "fahrenheit") => void;
  addToHistory: (city: string) => void;
  setForecastDays: (days: number) => void;
  setSelectedDate: (date: string | null) => void;
  loadWeather: (lat?: number, lon?: number) => Promise<void>;
}
