import type { WeatherPeriod } from "~/types/weather";

export async function fetchWeatherForecast(
  latitude: number,
  longitude: number
) {
  const weatherApi = await fetch(
    `https://api.weather.gov/points/${latitude},${longitude}`
  );
  if (!weatherApi.ok) throw new Error(`Points failed`);
  const data = await weatherApi.json();

  const forecastResponse = await fetch(data.properties.forecast);
  if (!forecastResponse.ok) throw new Error(`Forecast failed`);
  const forecastData = await forecastResponse.json();

  const daytimePeriods = forecastData.properties.periods.filter(
    (period: WeatherPeriod) => period.isDaytime === true
  );

  return {
    forecast: daytimePeriods.slice(0, 7),
    allPeriods: forecastData.properties.periods as WeatherPeriod[],
  };
}
