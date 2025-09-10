import type { WeatherPeriod } from "~/types/weather";

interface DailyForecastItemProps {
  period: WeatherPeriod;
}

export function DailyForecastItem({ period }: DailyForecastItemProps) {
  const formatDayName = (name: string) => {
    return name.substring(0, 3).toUpperCase();
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex-1">
        <strong className="text-xl">{formatDayName(period.name)}</strong>
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
