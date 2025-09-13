interface ForecastItemSkeletonProps {
  className?: string;
}

function ForecastItemSkeleton({ className = "" }: ForecastItemSkeletonProps) {
  return (
    <div
      className={`flex-shrink-0 w-16 p-6 flex flex-col items-center text-center bg-white
        rounded-full shadow-sm md:flex-row md:justify-between md:w-auto md:bg-white
        md:shadow-none md:rounded-4xl md:text-left animate-pulse ${className}`}
    >
      <div className="mb-2 md:flex-1 md:mb-0">
        <div className="h-4 bg-gray-300 rounded w-8 md:w-16 md:h-7 mx-auto md:mx-0"></div>
      </div>
      <div className="text-center md:text-right">
        <div className="h-6 bg-gray-300 rounded w-12 md:w-16 md:h-6 mx-auto md:mx-0 mb-4"></div>
        <div className="h-3 bg-gray-300 rounded w-10 md:w-12 mx-auto md:mx-0"></div>
      </div>
    </div>
  );
}

function DailyForecastSkeleton() {
  return (
    <div className="mb-24">
      <div className="h-6 bg-gray-300 rounded w-32 my-4 md:mb-10 md:h-8 md:w-40 animate-pulse"></div>
      <div
        className="bg-gray-200 flex overflow-x-auto overflow-y-hidden gap-2 py-8 px-2
          md:space-y-10 md:flex-col md:gap-0 md:py-10 md:px-8 rounded-4xl"
      >
        {Array.from({ length: 7 }).map((_, index) => (
          <ForecastItemSkeleton key={`daily-${index}`} />
        ))}
      </div>
    </div>
  );
}

function HourlyForecastSkeleton() {
  return (
    <div className="mb-24">
      {/* Title skeleton */}
      <div className="h-6 bg-gray-300 rounded w-40 my-4 md:mb-10 md:h-8 md:w-48 animate-pulse"></div>
      <div
        className="bg-gray-200 flex overflow-x-auto overflow-y-hidden gap-2 py-8 px-2
          md:space-y-10 md:flex-col md:gap-0 md:py-10 md:px-8 rounded-4xl"
      >
        {Array.from({ length: 24 }).map((_, index) => (
          <ForecastItemSkeleton key={`hourly-${index}`} />
        ))}
      </div>
    </div>
  );
}

export function WeatherSkeleton() {
  return (
    <>
      <DailyForecastSkeleton />
      <HourlyForecastSkeleton />
    </>
  );
}
