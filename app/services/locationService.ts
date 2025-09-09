export async function getReverseGeocodedName(
  latitude: number,
  longitude: number
): Promise<string> {
  const reverseGeoApi = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
    {
      headers: {
        "user-agent": "react-router-weather-app",
        accept: "application/json",
      },
    }
  );
  if (!reverseGeoApi.ok) throw new Error(`Reverse geocoding failed`);
  const reverseGeoData = await reverseGeoApi.json();
  return reverseGeoData.display_name || "Unknown Location";
}

export async function searchLocation(searchQuery: string) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
    {
      headers: {
        "user-agent": "react-router-weather-app",
        accept: "application/json",
      },
    }
  );

  //TODO: handle API error in UI gracefully
  if (!res.ok) {
    throw new Error("Failed to fetch location data");
  }

  const data = await res.json();

  //TODO: handle no results in UI gracefully
  if (data.length === 0) {
    throw new Error("No results found");
  }

  const result = data[0];
  return {
    locationName: result.display_name,
    latitude: parseFloat(result.lat),
    longitude: parseFloat(result.lon),
  };
}
