import type { Route } from "./+types/compare";
import { useNavigate } from "react-router";
import { DailyForecastList } from "~/components/DailyForecastList";
import { PrecipitationComparisonChart } from "~/components/PrecipitationComparisonChart";
import { TemperatureComparisonChart } from "~/components/TemperatureComparisonChart";
import { fetchWeatherForecast } from "~/services/weatherService";
import type { WeatherPeriod } from "~/types/weather";

interface CompareLoaderData {
  currentWeather: WeatherPeriod[];
  currentLocation: string;
  comparisonWeather: WeatherPeriod[];
  comparisonLocation: string;
}

interface CompareLoaderData {
  comparisonWeather: WeatherPeriod[];
  comparisonLocation: string;
}

export async function loader({
  request,
}: Route.LoaderArgs): Promise<CompareLoaderData> {
  const url = new URL(request.url);

  const currentName = url.searchParams.get("currentName");
  const currentLat = parseFloat(url.searchParams.get("currentLat") || "0");
  const currentLon = parseFloat(url.searchParams.get("currentLon") || "0");

  const compareName = url.searchParams.get("compareName");
  const compareLat = parseFloat(url.searchParams.get("compareLat") || "0");
  const compareLon = parseFloat(url.searchParams.get("compareLon") || "0");

  if (
    !currentName ||
    !currentLat ||
    !currentLon ||
    !compareName ||
    !compareLat ||
    !compareLon
  ) {
    throw new Error("Missing location parameters for comparison");
  }

  const [currentWeatherData, comparisonWeatherData] = await Promise.all([
    fetchWeatherForecast(currentLat, currentLon),
    fetchWeatherForecast(compareLat, compareLon),
  ]);

  return {
    currentWeather: currentWeatherData.forecast,
    currentLocation: currentName,
    comparisonWeather: comparisonWeatherData.forecast,
    comparisonLocation: compareName,
  };
}

export default function Compare({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();

  const {
    currentWeather,
    currentLocation,
    comparisonWeather,
    comparisonLocation,
  } = loaderData;

  return (
    <div className="max-w-7xl ">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Weather Comparison
      </h1>

      <div>
        <p className="text-lg font-bold">{currentLocation}</p>
        <DailyForecastList forecast={currentWeather} />
      </div>

      <div className="mt-12">
        <p className="text-lg font-bold">{comparisonLocation}</p>
        <DailyForecastList forecast={comparisonWeather} />
      </div>
      <div className="mt-24">
        <TemperatureComparisonChart
          currentWeather={currentWeather}
          comparisonWeather={comparisonWeather}
          currentLocation={currentLocation}
          comparisonLocation={comparisonLocation}
        />
      </div>
      <div className="mt-24">
        <PrecipitationComparisonChart
          currentWeather={currentWeather}
          comparisonWeather={comparisonWeather}
          currentLocation={currentLocation}
          comparisonLocation={comparisonLocation}
        />
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
