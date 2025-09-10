import type { WeatherPeriod } from "~/types/weather";
import { DailyForecastItem } from "./DailyForecastItem";

interface DailyForecastListProps {
  forecast: WeatherPeriod[];
}

export function DailyForecastList({ forecast }: DailyForecastListProps) {
  return (
    <div className="mb-24">
      <h1 className="text-3xl">7 Day Daytime</h1>
      <div className="space-y-10">
        {forecast.map((period: WeatherPeriod) => (
          <DailyForecastItem key={period.number} period={period} />
        ))}
      </div>
    </div>
  );
}
