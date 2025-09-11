import type { Route } from "./+types/location";
import {
  isRouteErrorResponse,
  useNavigation,
  type ActionFunctionArgs,
} from "react-router";
import { useState } from "react";
import { DailyForecastList } from "~/components/DailyForecastList";
import { LocationSearchForm } from "~/components/LocationSearchForm";
import { handleLocationAction } from "~/utils/locationActions";
import { searchLocation } from "~/services/locationService";
import { fetchWeatherForecast } from "~/services/weatherService";
import { CompareWeatherButton } from "~/components/CompareWeatherButton";
import { HourlyForecastList } from "~/components/HourlyForecastList";
import { ErrorBoundary as SharedErrorBoundary } from "~/components/ErrorBoundary";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");

  if (!search) {
    throw new Response("Search query is required", { status: 400 });
  }

  try {
    const locationData = await searchLocation(search);
    const weatherData = await fetchWeatherForecast(
      locationData.latitude,
      locationData.longitude
    );

    return {
      success: true,
      locationName: locationData.locationName,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      forecast: weatherData.forecast.slice(0, 7),
      hourlyForecast: weatherData.hourlyForecast,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch weather data",
      locationName: search,
      latitude: 0,
      longitude: 0,
      forecast: [],
      hourlyForecast: [],
    };
  }
}

export default function Location({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { locationName, forecast, hourlyForecast, latitude, longitude } =
    loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [location, setLocation] = useState(locationName || "");

  const hasValidInput = location.trim().length > 0;

  const hasResults = forecast.length > 0 && hourlyForecast.length > 0;
  const currentWeatherData = {
    forecast,
    location: locationName,
    coordinates: { latitude, longitude },
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-wrap font-black">Forecast</h2>
        {hasResults && (
          <CompareWeatherButton currentWeatherData={currentWeatherData} />
        )}
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

        {hasResults ? (
          <>
            <DailyForecastList forecast={forecast} />
            <HourlyForecastList hourlyForecast={hourlyForecast} />
          </>
        ) : (
          <div className="p-4 text-xl">
            No results found. Please enter a city and state or check the
            spelling of the location.
          </div>
        )}
      </div>
    </>
  );
}

export async function clientAction({ request }: ActionFunctionArgs) {
  return handleLocationAction(request);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const errorMessage = isRouteErrorResponse(error)
    ? error.data
    : (error as Error).message || "An unexpected error occurred";

  return (
    <SharedErrorBoundary
      message={errorMessage}
      title="Issue With Weather Location Search Page"
    />
  );
}
