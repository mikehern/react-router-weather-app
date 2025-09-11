import type { WeatherPeriod } from "~/types/weather";

interface DailyForecastItemProps {
  period: WeatherPeriod;
}

export function DailyForecastItem({ period }: DailyForecastItemProps) {
  const formatDayName = (name: string) => {
    if (
      name.includes("This") ||
      name.includes("Today") ||
      name.includes("Tonight")
    ) {
      return "Today";
    }
    return name.substring(0, 3).toUpperCase();
  };

  return (
    <div
      className="flex-shrink-0 w-16 p-6 flex flex-col items-center text-center bg-white
    rounded-full shadow-sm md:flex-row md:justify-between md:w-auto md:bg-white
    md:shadow-none md:rounded-4xl md:text-left
    "
    >
      <div className="mb-2 md:flex-1 md:mb-0">
        <strong className="text-sm font-bold md:text-2xl">
          {formatDayName(period.name)}
        </strong>
      </div>
      <div className="text-center md:text-right">
        <div className="text-lg font-bold md:font-semibold">
          {period.temperature}°{period.temperatureUnit}
        </div>
        <div
          className={`pt-4 ${(period.probabilityOfPrecipitation?.value ?? 0) > 0 ? "" : "opacity-0"}`}
        >
          💧 {period.probabilityOfPrecipitation?.value ?? 0}%
        </div>
      </div>
    </div>
  );
}
