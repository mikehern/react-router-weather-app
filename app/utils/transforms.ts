import type { Location } from "./localStorage";
import type { CurrentWeatherData } from "~/types/weather";

export function buildCompareUrl(
  currentData: CurrentWeatherData,
  compareData: Location,
  locationName: string
) {
  if (
    !currentData.location ||
    typeof currentData.coordinates.latitude !== "number" ||
    typeof currentData.coordinates.longitude !== "number"
  ) {
    throw new Error("Invalid current weather data");
  }

  if (
    typeof compareData.lat !== "number" ||
    typeof compareData.lon !== "number"
  ) {
    throw new Error("Invalid location data");
  }

  if (!locationName.trim()) {
    throw new Error("Location name is required");
  }
  const params = new URLSearchParams({
    currentName: currentData.location,
    currentLat: currentData.coordinates.latitude.toString(),
    currentLon: currentData.coordinates.longitude.toString(),
    compareName: locationName,
    compareLat: compareData.lat.toString(),
    compareLon: compareData.lon.toString(),
  });

  return `/compare?${params.toString()}`;
}
