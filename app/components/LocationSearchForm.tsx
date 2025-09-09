import { Form } from "react-router";

interface LocationSearchFormProps {
  location: string;
  setLocation: (value: string) => void;
  isSubmitting: boolean;
  hasValidInput: boolean;
  latitude: number;
  longitude: number;
  actionData?: { saved?: boolean | string; error?: string };
}

export function LocationSearchForm({
  location,
  setLocation,
  isSubmitting,
  hasValidInput,
  latitude,
  longitude,
  actionData,
}: LocationSearchFormProps) {
  return (
    <div className="mb-6">
      <Form action="/" method="post" className="flex flex-col gap-2 mb-3">
        <label htmlFor="location" className="text-lg">
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={isSubmitting}
          className="flex-1 min-w-[240px] w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
        />
        <input name="latitude" defaultValue={latitude} hidden />
        <input name="longitude" defaultValue={longitude} hidden />
        <div className="flex-1">
          {" "}
          <button
            name="intent"
            value="save"
            type="submit"
            disabled={isSubmitting || !hasValidInput}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-black text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving…" : "Save Location"}
          </button>
          <button
            name="intent"
            value="search"
            type="submit"
            disabled={isSubmitting || !hasValidInput}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-blue-600 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Searching…" : "Search"}
          </button>
        </div>
      </Form>
      {actionData?.saved ? (
        <div className="h-10 text-gray-500">
          {actionData.saved} Saved to Locations
        </div>
      ) : (
        <div className="h-10"></div>
      )}
    </div>
  );
}
