import type { WeatherPeriod } from "~/types/weather";
import { DailyForecastItem } from "./DailyForecastItem";

interface DailyForecastListProps {
  forecast: WeatherPeriod[];
}

export function DailyForecastList({ forecast }: DailyForecastListProps) {
  return (
    <div className="mb-24">
      <h1 className="font-bold my-4 md:mb-10 md:text-3xl">7 Day Daytime</h1>
      <div
        className="bg-gray-200 flex overflow-x-auto overflow-y-hidden gap-2 py-8 px-2
        md:space-y-10 md:flex-col md:gap-0 md:py-10 md:px-8 rounded-4xl 
        "
      >
        {forecast.map((period: WeatherPeriod) => (
          <DailyForecastItem key={period.number} period={period} />
        ))}
      </div>
    </div>
  );
}
