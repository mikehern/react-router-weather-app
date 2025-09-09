import type { WeatherPeriod } from "~/types/weather";

interface WeatherPeriodItemProps {
  period: WeatherPeriod;
}

export function WeatherPeriodItem({ period }: WeatherPeriodItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex-1">
        <div className="flex items-baseline">
          <strong className="font-medium">{period.name}</strong>
        </div>
        <div className="flex flex-col text-sm text-gray-500">
          <span className="font-medium">{period.shortForecast}</span>
          {(period.probabilityOfPrecipitation?.value ?? 0) > 0
            ? `💧 ${period.probabilityOfPrecipitation.value}%`
            : " "}
        </div>
      </div>
      <div className="text-right">
        <span className="font-semibold text-lg">
          {period.temperature}°{period.temperatureUnit}
        </span>
      </div>
    </div>
  );
}
