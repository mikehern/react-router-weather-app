import type { WeatherPeriod } from "~/types/weather";

export function HourlyForecastItem({ period }: { period: WeatherPeriod }) {
  // Format time from ISO string to "1AM, 2AM..12PM" or "Now" for current hour
  const timeFormat = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();

    // Check if this is the current hour
    if (
      date.getHours() === now.getHours() &&
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      return "Now";
    }

    const hour = date.getHours();
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}${ampm}`;
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
          {timeFormat(period.startTime)}
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
