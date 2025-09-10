import { AgCharts } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";
import type { WeatherPeriod } from "~/types/weather";

interface PrecipitationComparisonChartProps {
  currentWeather: WeatherPeriod[];
  comparisonWeather: WeatherPeriod[];
  currentLocation: string;
  comparisonLocation: string;
}

type PrecipitationDatum = {
  day: string;
  currentPrecipitation: number;
  comparisonPrecipitation: number;
};

export function PrecipitationComparisonChart({
  currentWeather,
  comparisonWeather,
  currentLocation,
  comparisonLocation,
}: PrecipitationComparisonChartProps) {
  const getFirstPart = (s: string) => s.split(",")[0];

  const chartData: PrecipitationDatum[] = currentWeather
    .filter((p) => p.isDaytime)
    .map((p) => {
      const match = comparisonWeather.find(
        (cp) => cp.isDaytime && cp.name === p.name
      );
      return match
        ? {
            day: p.name,
            currentPrecipitation: p.probabilityOfPrecipitation?.value ?? 0,
            comparisonPrecipitation:
              match.probabilityOfPrecipitation?.value ?? 0,
          }
        : null;
    })
    .filter((x): x is PrecipitationDatum => x !== null);

  const precipitationOptions: AgChartOptions<PrecipitationDatum> = {
    data: chartData,
    title: {
      text: `Precipitation Chance Comparison`,
      fontWeight: "bold",
    },
    legend: {
      enabled: true,
      position: "bottom",
    },
    series: [
      {
        type: "line",
        xKey: "day",
        yKey: "currentPrecipitation",
        yName: getFirstPart(currentLocation),
        stroke: "#1976d2",
        marker: {
          fill: "#1976d2",
          stroke: "#0d47a1",
          size: 6,
        },
        tooltip: {
          renderer: ({ datum, yKey }) => {
            const precipValue = datum[yKey] as number;
            return {
              heading: datum.day as string,
              title: getFirstPart(currentLocation),
              data: [
                {
                  label: "Precipitation Chance",
                  value: `${precipValue}%`,
                },
              ],
            };
          },
        },
      },
      {
        type: "line",
        xKey: "day",
        yKey: "comparisonPrecipitation",
        yName: getFirstPart(comparisonLocation),
        stroke: "#d32f2f",
        marker: {
          fill: "#d32f2f",
          stroke: "#b71c1c",
          size: 6,
        },
        tooltip: {
          renderer: ({ datum, yKey }) => {
            const precipValue = datum[yKey] as number;
            return {
              heading: datum.day as string,
              title: getFirstPart(comparisonLocation),
              data: [
                {
                  label: "Precipitation Chance",
                  value: `${precipValue}%`,
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
        position: "bottom",
        title: { text: "Day", fontSize: 14 },
        label: { fontSize: 12 },
      },
      {
        type: "number",
        position: "left",
        title: { text: "Precipitation Chance (%)", fontSize: 14 },
        label: {
          formatter: ({ value }) => `${value}%`,
          fontSize: 12,
        },
        min: 0,
        max: 100,
      },
    ],
  };

  return (
    <div>
      <div
        aria-label={`Precipitation chance comparison chart between ${getFirstPart(
          currentLocation
        )} and ${getFirstPart(comparisonLocation)}`}
      >
        <AgCharts options={precipitationOptions} />
      </div>

      {/* screen reader table */}
      <div className="sr-only" aria-live="polite">
        <table>
          <caption>
            Detailed precipitation chance comparison data between{" "}
            {getFirstPart(currentLocation)} and{" "}
            {getFirstPart(comparisonLocation)}
          </caption>
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">{getFirstPart(currentLocation)} (%)</th>
              <th scope="col">{getFirstPart(comparisonLocation)} (%)</th>
              <th scope="col">Comparison Description</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((d, i) => {
              const difference =
                d.comparisonPrecipitation - d.currentPrecipitation;
              const comparison =
                difference === 0
                  ? "same chance"
                  : difference > 0
                    ? `${Math.abs(difference)}% higher chance`
                    : `${Math.abs(difference)}% lower chance`;

              return (
                <tr key={i}>
                  <th scope="row">{d.day}</th>
                  <td>{d.currentPrecipitation}%</td>
                  <td>{d.comparisonPrecipitation}%</td>
                  <td>
                    {getFirstPart(comparisonLocation)} has {comparison} of
                    precipitation than {getFirstPart(currentLocation)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
