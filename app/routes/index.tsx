import type { Route } from "./+types/index";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";

interface WeatherPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  temperatureTrend: string;
  probabilityOfPrecipitation: {
    unitCode: string;
    value: number;
  };
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

export function loader({ request }: LoaderFunctionArgs) {
  return { message: "Weather App" };
}

export async function clientLoader({
  params,
  serverLoader,
}: Route.ClientLoaderArgs) {
  const serverData = await serverLoader();

  const position = await new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );
  const { latitude, longitude } = position.coords;

  const reverseGeoApi = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  );
  if (!reverseGeoApi.ok) throw new Error(`Reverse geocoding failed`);
  const reverseGeoData = await reverseGeoApi.json();
  const city = reverseGeoData.city || "Unknown";

  const weatherApi = await fetch(
    `https://api.weather.gov/points/${latitude},${longitude}`
  );
  if (!weatherApi.ok) throw new Error(`Points failed`);
  const data = await weatherApi.json();
  const forecastUrl: string = data.properties.forecast;

  const forecastResponse = await fetch(forecastUrl);
  if (!forecastResponse.ok) throw new Error(`Forecast failed`);
  const forecastData = await forecastResponse.json();

  // Assume daytime for MVP simplicity
  const daytimePeriods = forecastData.properties.periods.filter(
    (period: WeatherPeriod) => period.isDaytime === true
  );

  return {
    ...serverData,
    city,
    forecast: daytimePeriods.slice(0, 7),
  };
}

// react-router boilerplate for client-side data fetching during hydration
clientLoader.hydrate = true;

export function HydrateFallback() {
  return (
    <div className="max-w-5xl mx-auto my-8 px-4 font-sans">
      Waiting for location permission...
    </div>
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { message, city, forecast } = useLoaderData<typeof clientLoader>();
  return (
    <div className="max-w-5xl mx-auto my-8">
      <h1 className="text-3xl">{message}</h1>
      <h2 className="text-xl text-wrap">{city}</h2>
      <div className="flex flex-col mt-10">
        <div className="space-y-3">
          {forecast.map((p: WeatherPeriod) => (
            <div
              key={p.number}
              className="flex items-center justify-between p-4"
            >
              <div className="flex-1">
                <div className="flex items-baseline">
                  <strong className="font-medium">{p.name}</strong>
                </div>

                <div className="flex flex-col text-sm text-gray-500">
                  <span className="font-medium">{p.shortForecast}</span>

                  {(p.probabilityOfPrecipitation?.value ?? 0) > 0
                    ? `💧 ${p.probabilityOfPrecipitation.value}%`
                    : " "}
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold text-lg">
                  {p.temperature}°{p.temperatureUnit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
