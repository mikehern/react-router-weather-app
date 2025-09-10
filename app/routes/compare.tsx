import type { Route } from "./+types/compare";
import { useLocation, useNavigate } from "react-router";
import { DailyForecastList } from "~/components/DailyForecastList";
import { fetchWeatherForecast } from "~/services/weatherService";
import type { WeatherPeriod } from "~/types/weather";

interface CurrentWeather {
  forecast: WeatherPeriod[];
  location: string;
  coordinates: { latitude: number; longitude: number };
}

interface CompareLoaderData {
  comparisonWeather: WeatherPeriod[];
  comparisonLocation: string;
}

export async function loader({
  request,
}: Route.LoaderArgs): Promise<CompareLoaderData> {
  const url = new URL(request.url);

  const name = url.searchParams.get("name");
  const lat = parseFloat(url.searchParams.get("lat") || "0");
  const lon = parseFloat(url.searchParams.get("lon") || "0");

  if (!name || !lat || !lon) {
    throw new Error("Missing comparison location parameters");
  }

  const comparisonWeatherData = await fetchWeatherForecast(lat, lon);

  return {
    comparisonWeather: comparisonWeatherData.forecast,
    comparisonLocation: name,
  };
}

export default function Compare({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { comparisonWeather, comparisonLocation } = loaderData;

  const currentWeather = location.state as CurrentWeather;

  return (
    <div className="max-w-7xl ">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Weather Comparison
      </h1>

      <div>
        <p className="text-lg font-bold">{currentWeather.location}</p>
        <DailyForecastList forecast={currentWeather.forecast} />
      </div>

      <div className="mt-12">
        <p className="text-lg font-bold">{comparisonLocation}</p>
        <DailyForecastList forecast={comparisonWeather} />
      </div>

      <div className="mt-12 text-center">
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-gray-600 text-white rounded-lg"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
