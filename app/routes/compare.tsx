import type { Route } from "./+types/compare";
import { useNavigate } from "react-router";
import { DailyForecastList } from "~/components/DailyForecastList";
import { PrecipitationComparisonChart } from "~/components/PrecipitationComparisonChart";
import { TemperatureComparisonChart } from "~/components/TemperatureComparisonChart";
import { fetchWeatherForecast } from "~/services/weatherService";
import type { WeatherPeriod } from "~/types/weather";
import { ErrorBoundary as SharedErrorBoundary } from "~/components/ErrorBoundary";

interface CompareLoaderData {
  currentWeather: WeatherPeriod[];
  currentLocation: string;
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
    throw new Response("Missing location parameters for comparison", {
      status: 400,
    });
  }

  // allow partial results if one API call fails
  const results = await Promise.allSettled([
    fetchWeatherForecast(currentLat, currentLon),
    fetchWeatherForecast(compareLat, compareLon),
  ]);

  const [currentResult, comparisonResult] = results;

  return {
    currentWeather:
      currentResult.status === "fulfilled" ? currentResult.value.forecast : [],
    currentLocation: currentName,
    comparisonWeather:
      comparisonResult.status === "fulfilled"
        ? comparisonResult.value.forecast
        : [],
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

  const hasCurrentData = currentWeather.length > 0;
  const hasComparisonData = comparisonWeather.length > 0;
  const hasBothData = hasCurrentData && hasComparisonData;

  return (
    <div className="max-w-7xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Weather Comparison
      </h1>

      <div>
        <p className="text-lg font-bold">{currentLocation}</p>
        {hasCurrentData ? (
          <DailyForecastList forecast={currentWeather} />
        ) : (
          <div className="p-4 text-xl text-red-600">
            No weather data available for {currentLocation}
          </div>
        )}
      </div>

      <div className="mt-12">
        <p className="text-lg font-bold">{comparisonLocation}</p>
        {hasComparisonData ? (
          <DailyForecastList forecast={comparisonWeather} />
        ) : (
          <div className="p-4 text-xl text-red-600">
            No weather data available for {comparisonLocation}
          </div>
        )}
      </div>

      {/* Only show charts if both locations have data */}
      {hasBothData ? (
        <>
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
        </>
      ) : (
        <div></div>
      )}

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

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <SharedErrorBoundary
      error={error}
      title="Issue With Weather Comparison Page"
    />
  );
}
