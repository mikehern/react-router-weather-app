import { Link } from "react-router";
import { getStoredLocations, getLocation } from "~/utils/localStorage";

interface SavedLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeatherData: {
    forecast: any[];
    location: string;
    coordinates: { latitude: number; longitude: number };
  };
}

export function SavedLocationModal({
  isOpen,
  onClose,
  currentWeatherData,
}: SavedLocationModalProps) {
  if (!isOpen) return null;

  const storedLocations = getStoredLocations();
  const locationNames = Object.keys(storedLocations);

  if (locationNames.length === 0) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-2 max-w-md w-full">
          <p className="mb-6">
            You haven't saved any locations yet. Save a location first to
            compare weather data.
          </p>

          <button
            onClick={onClose}
            className="w-full p-3 mt-4 bg-gray-700 text-white rounded-lg"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-2 max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold flex mb-4">Compare to</h2>
          <div className="space-y-4">
            {locationNames.map((locationName) => {
              const locationData = getLocation(locationName);

              if (!locationData) return null;

              return (
                <div key={locationName}>
                  <Link
                    to={`/compare?name=${encodeURIComponent(locationName)}&lat=${locationData.lat}&lon=${locationData.lon}`}
                    state={currentWeatherData}
                    className="mb-8"
                  >
                    <span className="font-medium text-blue-700">
                      {locationName}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="w-full p-3 mt-4 bg-gray-700 text-white rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
