import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import ForecastList from "./components/ForecastList";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 p-3 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-slate-800 text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Weather Forecast
          </h1>
          <p className="text-slate-600 text-base md:text-lg">
            Dự báo thời tiết chính xác cho mọi địa điểm 🌤️
          </p>
        </div>

        <SearchBar />
        <CurrentWeather />
        <HourlyForecast />
        <ForecastList />
      </div>
    </div>
  );
}
