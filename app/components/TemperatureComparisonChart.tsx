import { AgCharts } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";
import type { WeatherPeriod } from "~/types/weather";

interface TemperatureComparisonChartProps {
  currentWeather: WeatherPeriod[];
  comparisonWeather: WeatherPeriod[];
  currentLocation: string;
  comparisonLocation: string;
}

type TempDeltaDatum = { day: string; temperatureDelta: number };

export function TemperatureComparisonChart({
  currentWeather,
  comparisonWeather,
  currentLocation,
  comparisonLocation,
}: TemperatureComparisonChartProps) {
  const getFirstPart = (s: string) => s.split(",")[0];

  const chartData: TempDeltaDatum[] = currentWeather
    .filter((p) => p.isDaytime)
    .map((p) => {
      const match = comparisonWeather.find(
        (cp) => cp.isDaytime && cp.name === p.name
      );
      return match
        ? { day: p.name, temperatureDelta: match.temperature - p.temperature }
        : null;
    })
    .filter((x): x is TempDeltaDatum => x !== null);

  const temperatureOptions: AgChartOptions<TempDeltaDatum> = {
    data: chartData,
    title: {
      text: `${getFirstPart(comparisonLocation)} vs ${getFirstPart(
        currentLocation
      )}`,
      fontWeight: "bold",
    },
    legend: { enabled: false },
    series: [
      {
        type: "bar",
        direction: "horizontal",
        xKey: "day",
        yKey: "temperatureDelta",
        yName: "Daytime Temperature Difference (°F)",
        itemStyler: ({ yValue }) => ({
          fill: (yValue ?? 0) >= 0 ? "#d32f2f" : "#1976d2",
          stroke: (yValue ?? 0) >= 0 ? "#b71c1c" : "#0d47a1",
          strokeWidth: 1,
        }),
        tooltip: {
          renderer: ({ datum, yKey }) => {
            const datumValue = datum[yKey] as number;
            const comparison = datumValue >= 0 ? "warmer" : "cooler";
            return {
              heading: datum.day as string,
              title: `${getFirstPart(comparisonLocation)} vs ${getFirstPart(
                currentLocation
              )}`,
              data: [
                {
                  label: "Difference",
                  value: `${datumValue > 0 ? "+" : ""}${Math.abs(datumValue)}°F ${comparison}`,
                },
              ],
            };
          },
        },
      },
    ],
    axes: [
      {
        type: "category",
        position: "left",
        label: { fontSize: 14 },
      },
      {
        type: "number",
        position: "bottom",
        title: { text: "Temperature Difference (°F)", fontSize: 14 },
        label: {
          formatter: ({ value }) => {
            const datumValue = Number(value);
            const sign = datumValue > 0 ? "+" : "";
            const comparison = datumValue >= 0 ? " warmer" : " cooler";
            return `${sign}${datumValue}°F${comparison}`;
          },
          fontSize: 12,
        },
      },
    ],
  };

  return (
    <div>
      <div
        aria-label={`Temperature comparison chart between ${getFirstPart(
          comparisonLocation
        )} and ${getFirstPart(currentLocation)}`}
      >
        <AgCharts options={temperatureOptions} />
      </div>

      {/* screen reader table */}
      <div className="sr-only" aria-live="polite">
        <table>
          <caption>
            Detailed temperature comparison data between{" "}
            {getFirstPart(comparisonLocation)} and{" "}
            {getFirstPart(currentLocation)}
          </caption>
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Temperature Difference (°F)</th>
              <th scope="col">Comparison Description</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((d, i) => (
              <tr key={i}>
                <th scope="row">{d.day}</th>
                <td>
                  {d.temperatureDelta > 0 ? "+" : ""}
                  {d.temperatureDelta}
                </td>
                <td>
                  {getFirstPart(comparisonLocation)} is{" "}
                  {Math.abs(d.temperatureDelta)}°F{" "}
                  {d.temperatureDelta >= 0 ? "warmer" : "cooler"} than{" "}
                  {getFirstPart(currentLocation)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
