import type { WeatherPeriod } from "~/types/weather";

interface WeatherAPIResponse {
  properties: {
    periods: WeatherPeriod[];
  };
}

export async function fetchWeatherForecast(
  latitude: number,
  longitude: number
) {
  const weatherApi = await fetch(
    `https://api.weather.gov/points/${latitude},${longitude}`
  );

  if (!weatherApi.ok) {
    throw new Response(
      `Weather service is temporarily unavailable. Please try again later.`,
      { status: weatherApi.status }
    );
  }

  let data;

  try {
    data = await weatherApi.json();
  } catch {
    throw new Response(
      `Weather service returned invalid data. Please try again.`,
      { status: 502 }
    );
  }

  const { forecast, forecastHourly } = data.properties;

  const [forecastResponse, hourlyResponse] = await Promise.all([
    fetch(forecast),
    fetch(forecastHourly),
  ]);

  if (!forecastResponse.ok) throw new Error(`Forecast failed`);
  if (!hourlyResponse.ok) throw new Error(`Hourly forecast failed`);

  const [forecastData, hourlyData] = (await Promise.all([
    forecastResponse.json(),
    hourlyResponse.json(),
  ])) as [WeatherAPIResponse, WeatherAPIResponse];

  const daytimePeriods = forecastData.properties.periods.filter(
    (period: WeatherPeriod) => period.isDaytime === true
  );

  return {
    forecast: daytimePeriods.slice(0, 7),
    allPeriods: forecastData.properties.periods as WeatherPeriod[],
    hourlyForecast: hourlyData.properties.periods.slice(0, 24),
    allHourlyPeriods: hourlyData.properties.periods as WeatherPeriod[],
  };
}
