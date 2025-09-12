import type { Route } from "./+types/index";
import {
  isRouteErrorResponse,
  useNavigation,
  type ActionFunctionArgs,
} from "react-router";
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
  try {
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported by this browser"));
          return;
        }

        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
        });
      }
    );

    const { latitude, longitude } = position.coords;

    const [locationName, weatherData] = await Promise.all([
      getReverseGeocodedName(latitude, longitude).catch(
        () => "Unknown Location"
      ),
      fetchWeatherForecast(latitude, longitude),
    ]);

    const daytimePeriods = weatherData.forecast;

    return {
      locationName,
      latitude,
      longitude,
      forecast: daytimePeriods.slice(0, 7),
      hourlyForecast: weatherData.hourlyForecast,
      hasGeolocation: true,
    };
  } catch (error) {
    let errorMessage = "Unable to get your location";

    if (error instanceof GeolocationPositionError) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage =
            "Location access denied. Please search for a city instead.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage =
            "Location information unavailable. Please search for a city.";
          break;
        case error.TIMEOUT:
          errorMessage =
            "Location request timed out. Please search for a city.";
          break;
      }
    }

    return {
      locationName: null,
      latitude: null,
      longitude: null,
      forecast: [],
      hourlyForecast: [],
      hasGeolocation: false,
      error: errorMessage,
    };
  }
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
  const {
    locationName,
    forecast,
    latitude,
    longitude,
    hourlyForecast,
    error,
    hasGeolocation,
  } = loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [location, setLocation] = useState(locationName || "");
  const hasValidInput = location.trim().length > 0;

  // graceful UX fallback when geolocation is skipped or fails to still allow search
  if (error && !hasGeolocation) {
    return (
      <div className="mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">{error}</p>
        </div>
        <LocationSearchForm
          location={location}
          setLocation={setLocation}
          isSubmitting={isSubmitting}
          hasValidInput={hasValidInput}
          latitude={0}
          longitude={0}
          actionData={actionData}
        />
      </div>
    );
  }

  // assert values are present after handling skipped geolocation
  const currentWeatherData = {
    forecast,
    location: locationName!,
    coordinates: { latitude: latitude!, longitude: longitude! },
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
          latitude={latitude!}
          longitude={longitude!}
          actionData={actionData}
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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const errorMessage = isRouteErrorResponse(error)
    ? error.data
    : (error as Error).message || "An unexpected error occurred";

  return (
    <SharedErrorBoundary
      message={errorMessage}
      title="Issue With Weather Home Page"
    />
  );
}
