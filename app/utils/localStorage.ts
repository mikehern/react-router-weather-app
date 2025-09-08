interface Location {
  lat: number;
  lon: number;
}

interface StoredLocations {
  [name: string]: Location;
}

const LOCATIONS_KEY = "weather-app-locations";

export function getStoredLocations(): StoredLocations {
  const stored = localStorage.getItem(LOCATIONS_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function addLocation(
  name: string,
  lat: number,
  lon: number
): { success: boolean; error?: string } {
  const locations = getStoredLocations();

  if (locations[name]) {
    return { success: false, error: "Location already exists" };
  }

  locations[name] = { lat, lon };
  localStorage.setItem(LOCATIONS_KEY, JSON.stringify(locations));

  return { success: true };
}

export function removeLocation(name: string): boolean {
  const locations = getStoredLocations();

  if (!locations[name]) {
    return false;
  }

  delete locations[name];
  localStorage.setItem(LOCATIONS_KEY, JSON.stringify(locations));

  return true;
}

export function getLocation(name: string): Location | null {
  const locations = getStoredLocations();
  return locations[name] || null;
}

export function getAllLocationNames(): string[] {
  return Object.keys(getStoredLocations());
}
