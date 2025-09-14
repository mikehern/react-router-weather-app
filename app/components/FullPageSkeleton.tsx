import { WeatherSkeleton } from "./WeatherSkeleton";

export function FullPageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto my-8 px-4 font-sans">
      {/* Header skeleton */}
      <div className="flex justify-between items-center animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-24"></div>
        <div className="h-10 bg-gray-300 rounded-lg w-32 md:w-40"></div>
      </div>

      {/* Search form skeleton */}
      <div className="flex flex-col mt-10 animate-pulse">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-8">
          {/* Location input skeleton */}
          <div className="flex-1">
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
          </div>

          {/* Button group skeleton */}
          <div className="flex gap-2">
            {/* Search button skeleton */}
            <div className="h-12 bg-gray-300 rounded-lg w-24"></div>
            {/* Save button skeleton */}
            <div className="h-12 bg-gray-300 rounded-lg w-24"></div>
          </div>
        </div>

        {/* Weather forecast skeletons - reuse existing component */}
        <WeatherSkeleton />
      </div>
    </div>
  );
}
