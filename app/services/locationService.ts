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

  if (!reverseGeoApi.ok) {
    throw new Response(
      `Unable to determine location name. Please check your coordinates.`,
      { status: reverseGeoApi.status }
    );
  }

  try {
    const reverseGeoData = await reverseGeoApi.json();
    return reverseGeoData.display_name || "Unknown Location";
  } catch {
    throw new Response(
      `Location service returned invalid data. Please try again.`,
      { status: 502 }
    );
  }
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

  if (!res.ok) {
    throw new Response(
      `Unable to search for "${searchQuery}". The location service is temporarily 
  unavailable.`,
      { status: res.status }
    );
  }

  let data;

  try {
    data = await res.json();
  } catch (error) {
    throw new Response(
      `Location service returned invalid data. Please try again.`,
      { status: 502 }
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    throw new Response(
      `No locations found for "${searchQuery}". Try a different search term or check the 
  spelling.`,
      { status: 404 }
    );
  }

  const result = data[0];
  return {
    locationName: result.display_name,
    latitude: parseFloat(result.lat),
    longitude: parseFloat(result.lon),
  };
}
