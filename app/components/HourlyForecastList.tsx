import type { WeatherPeriod } from "~/types/weather";
import { HourlyForecastItem } from "./HourlyForecastItem";

export function HourlyForecastList({
  hourlyForecast,
}: {
  hourlyForecast: WeatherPeriod[];
}) {
  return (
    <div className="mb-24">
      <h1 className="text-3xl">Next 24 Hours</h1>
      <div className="space-y-10">
        {hourlyForecast.map((period: WeatherPeriod) => (
          <HourlyForecastItem key={period.number} period={period} />
        ))}
      </div>
    </div>
  );
}
