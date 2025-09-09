import type { Route } from "./+types/location";
import { useNavigation, type ActionFunctionArgs } from "react-router";
import { useState } from "react";
import { WeatherForecastList } from "~/components/WeatherForecastList";
import { LocationSearchForm } from "~/components/LocationSearchForm";
import { handleLocationAction } from "~/utils/locationActions";
import { searchLocation } from "~/services/locationService";
import { fetchWeatherForecast } from "~/services/weatherService";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");

  if (!search) throw new Error("Search query is required");

  const locationData = await searchLocation(search);
  const weatherData = await fetchWeatherForecast(
    locationData.latitude,
    locationData.longitude
  );

  return {
    locationName: locationData.locationName,
    latitude: locationData.latitude,
    longitude: locationData.longitude,
    forecast: weatherData.forecast.slice(0, 7),
  };
}

export default function Location({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { locationName, forecast, latitude, longitude } = loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [location, setLocation] = useState(locationName || "");
  const hasValidInput = location.trim().length > 0;
  return (
    <>
      <h2 className="text-xl text-wrap">7-day forecast</h2>
      <div className="flex flex-col mt-10">
        <LocationSearchForm
          location={location}
          setLocation={setLocation}
          isSubmitting={isSubmitting}
          hasValidInput={hasValidInput}
          latitude={latitude}
          longitude={longitude}
          actionData={actionData}
        />
        <WeatherForecastList forecast={forecast} />
      </div>
    </>
  );
}

export async function clientAction({ request }: ActionFunctionArgs) {
  return handleLocationAction(request);
}
