import type { WeatherPeriod } from "~/types/weather";
import { WeatherPeriodItem } from "./WeatherPeriodItem";

interface WeatherForecastListProps {
  forecast: WeatherPeriod[];
}

export function WeatherForecastList({ forecast }: WeatherForecastListProps) {
  return (
    <div className="space-y-3">
      {forecast.map((period: WeatherPeriod) => (
        <WeatherPeriodItem key={period.number} period={period} />
      ))}
    </div>
  );
}
