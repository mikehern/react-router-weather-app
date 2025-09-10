import type { WeatherPeriod } from "~/types/weather";

export function HourlyForecastItem({ period }: { period: WeatherPeriod }) {
  // Format time from ISO string to "1AM, 2AM..12PM"
  const timeFormat = (isoString: string) => {
    const date = new Date(isoString);
    const hour = date.getHours();
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}${ampm}`;
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex-1">
        <strong className="text-xl">{timeFormat(period.startTime)}</strong>
      </div>
      <div className="text-right">
        <div className="font-semibold">
          {period.temperature}°{period.temperatureUnit}
        </div>
        {(period.probabilityOfPrecipitation?.value ?? 0) > 0 && (
          <div className=" ">💧 {period.probabilityOfPrecipitation.value}%</div>
        )}
      </div>
    </div>
  );
}
