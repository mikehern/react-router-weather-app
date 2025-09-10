import type { Route } from "./+types/index";
import { useNavigation, type ActionFunctionArgs } from "react-router";
import { useState } from "react";
import { LocationSearchForm } from "~/components/LocationSearchForm";
import { DailyForecastList } from "~/components/DailyForecastList";
import { getReverseGeocodedName } from "~/services/locationService";
import { fetchWeatherForecast } from "~/services/weatherService";
import { handleLocationAction } from "~/utils/locationActions";
import { CompareWeatherButton } from "~/components/CompareWeatherButton";
import { HourlyForecastList } from "~/components/HourlyForecastList";
import { ErrorBoundary as SharedErrorBoundary } from "~/components/ErrorBoundary";

export async function clientLoader() {
  const position = await new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );
  const { latitude, longitude } = position.coords;

  const locationName = await getReverseGeocodedName(latitude, longitude);
  const weatherData = await fetchWeatherForecast(latitude, longitude);

  const daytimePeriods = weatherData.forecast;

  return {
    locationName,
    latitude,
    longitude,
    forecast: daytimePeriods.slice(0, 7),
    hourlyForecast: weatherData.hourlyForecast,
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

export default function Home({ loaderData, actionData }: Route.ComponentProps) {
  const { locationName, forecast, latitude, longitude, hourlyForecast } =
    loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [location, setLocation] = useState(locationName || "");
  const hasValidInput = location.trim().length > 0;

  const currentWeatherData = {
    forecast,
    location: locationName,
    coordinates: { latitude, longitude },
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-wrap font-black">Forecast</h2>
        <CompareWeatherButton currentWeatherData={currentWeatherData} />
      </div>
      <div className="flex flex-col mt-10">
        <LocationSearchForm
          location={location}
          setLocation={setLocation}
          isSubmitting={isSubmitting}
          hasValidInput={hasValidInput}
          latitude={latitude}
          longitude={longitude}
          actionData={actionData}
          displayedLocationName={locationName}
        />

        <DailyForecastList forecast={forecast} />
        <HourlyForecastList hourlyForecast={hourlyForecast} />
      </div>
    </>
  );
}

export async function clientAction({ request }: ActionFunctionArgs) {
  return handleLocationAction(request);
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <SharedErrorBoundary error={error} title="Issue With Initial Page" />;
}
