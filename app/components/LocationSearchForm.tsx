import { Form } from "react-router";

interface LocationSearchFormProps {
  location: string;
  setLocation: (value: string) => void;
  isSubmitting: boolean;
  hasValidInput: boolean;
  latitude: number;
  longitude: number;
  actionData?: { saved?: boolean | string; error?: string };
  displayedLocationName: string;
}

export function LocationSearchForm({
  location,
  setLocation,
  isSubmitting,
  hasValidInput,
  latitude,
  longitude,
  actionData,
  displayedLocationName,
}: LocationSearchFormProps) {
  const canSave =
    hasValidInput && location.trim() === displayedLocationName.trim();
  const inputDescribedBy = actionData?.error
    ? "location-help location-error"
    : "location-help";

  return (
    <div className="mb-6">
      <Form method="post" className="flex flex-col gap-2 mb-3">
        <label htmlFor="location" className="text-lg font-black">
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={isSubmitting}
          aria-invalid={actionData?.error ? "true" : "false"}
          aria-describedby={inputDescribedBy}
          className="flex-1 min-w-[240px] w-full px-3 py-2 border-0 border-b-4
          border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600
          focus:border-blue-600 disabled:bg-gray-100 disabled:text-gray-500
            bg-transparent transition-all duration-200 font-semibold"
        />
        <input type="hidden" name="latitude" defaultValue={latitude} hidden />
        <input type="hidden" name="longitude" defaultValue={longitude} hidden />
        <div className="flex gap-3 mt-2 justify-end">
          <button
            name="intent"
            value="save"
            type="submit"
            disabled={isSubmitting || !canSave}
            aria-describedby={!canSave ? "save-disabled-reason" : undefined}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-black
            text-white transition disabled:opacity-50 disabled:cursor-not-allowed
              min-h-[44px] focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            {isSubmitting ? "Saving…" : "Save Location"}
          </button>
          <button
            name="intent"
            value="search"
            type="submit"
            disabled={isSubmitting || !hasValidInput}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-blue-600
            text-white font-semibold transition disabled:opacity-50
            disabled:cursor-not-allowed min-h-[44px]"
          >
            {isSubmitting ? "Searching…" : "Search"}
          </button>
        </div>
      </Form>
      <div id="location-help" className="text-sm text-gray-600 mt-1">
        Enter a city name and state to search for weather data
      </div>
      {!canSave && hasValidInput && (
        <div id="save-disabled-reason" className="sr-only">
          Save is disabled because the input doesn't match the currently
          displayed location
        </div>
      )}
      {actionData?.error && (
        <div
          id="location-error"
          className="text-sm text-red-600 mt-1"
          role="alert"
          aria-live="assertive"
        >
          {actionData.error}
        </div>
      )}
      {actionData?.saved ? (
        <div
          className="flex h-10 text-gray-700 font-medium justify-end"
          role="status"
          aria-live="polite"
        >
          {actionData.saved} Saved to Locations
        </div>
      ) : (
        <div className="h-10"></div>
      )}
    </div>
  );
}
