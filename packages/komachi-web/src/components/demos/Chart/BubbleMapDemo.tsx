import { BubbleMap, ChartPalette, type MapGeoJson } from "komachi";
import * as echarts from "echarts/core";
import { MapChart, ScatterChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { useIsDarkMode } from "~/lib/use-is-dark-mode";

echarts.use([MapChart, ScatterChart, TooltipComponent, CanvasRenderer]);

interface BubbleMapDemoProps {
  geoJson: MapGeoJson | null;
}

/** A city traffic row - the kind of raw shape these maps consume. */
interface Delivery {
  city: string;
  lat: number;
  lon: number;
  notifications: number;
  country?: string;
}

const deliveries: Delivery[] = [
  { city: "San Francisco", country: "US", lat: 37.77, lon: -122.42, notifications: 1600 }, // prettier-ignore
  { city: "New York", country: "US", lat: 40.71, lon: -74.0, notifications: 980 }, // prettier-ignore
  { city: "São Paulo", country: "BR", lat: -23.55, lon: -46.63, notifications: 540 }, // prettier-ignore
  { city: "London", country: "GB", lat: 51.5, lon: -0.12, notifications: 1500 }, // prettier-ignore
  { city: "Lagos", country: "NG", lat: 6.52, lon: 3.38, notifications: 320 }, // prettier-ignore
  { city: "Frankfurt", country: "DE", lat: 50.11, lon: 8.68, notifications: 760 }, // prettier-ignore
  { city: "Mumbai", country: "IN", lat: 19.07, lon: 72.87, notifications: 640 }, // prettier-ignore
  { city: "Singapore", country: "SG", lat: 1.35, lon: 103.82, notifications: 880 }, // prettier-ignore
  { city: "Tokyo", country: "JP", lat: 35.68, lon: 139.69, notifications: 1100 }, // prettier-ignore
  { city: "Sydney", country: "AU", lat: -33.86, lon: 151.21, notifications: 410 }, // prettier-ignore
];

const fmt = (n: number) =>
  `${n > 1000 ? `${(n / 1000).toLocaleString()}k` : n.toString()} notifications`;

/** A named location with coordinates. */
interface Probe {
  city: string;
  lat: number;
  lon: number;
}

/** Regions where a status service might run uptime checks. */
const probes: Probe[] = [
  { city: "San Francisco", lat: 37.77, lon: -122.42 },
  { city: "Los Angeles", lat: 34.05, lon: -118.24 },
  { city: "Seattle", lat: 47.61, lon: -122.33 },
  { city: "Dallas", lat: 32.78, lon: -96.8 },
  { city: "Chicago", lat: 41.88, lon: -87.63 },
  { city: "Atlanta", lat: 33.75, lon: -84.39 },
  { city: "Miami", lat: 25.76, lon: -80.19 },
  { city: "Ashburn", lat: 39.04, lon: -77.49 },
  { city: "New York", lat: 40.71, lon: -74.01 },
  { city: "Toronto", lat: 43.65, lon: -79.38 },
  { city: "Mexico City", lat: 19.43, lon: -99.13 },
  { city: "São Paulo", lat: -23.55, lon: -46.63 },
  { city: "Buenos Aires", lat: -34.6, lon: -58.38 },
  { city: "London", lat: 51.51, lon: -0.13 },
  { city: "Amsterdam", lat: 52.37, lon: 4.9 },
  { city: "Paris", lat: 48.86, lon: 2.35 },
  { city: "Frankfurt", lat: 50.11, lon: 8.68 },
  { city: "Madrid", lat: 40.42, lon: -3.7 },
  { city: "Milan", lat: 45.46, lon: 9.19 },
  { city: "Stockholm", lat: 59.33, lon: 18.06 },
  { city: "Istanbul", lat: 41.01, lon: 28.98 },
  { city: "Dubai", lat: 25.2, lon: 55.27 },
  { city: "Cairo", lat: 30.04, lon: 31.24 },
  { city: "Lagos", lat: 6.52, lon: 3.38 },
  { city: "Johannesburg", lat: -26.2, lon: 28.05 },
  { city: "Mumbai", lat: 19.08, lon: 72.88 },
  { city: "Delhi", lat: 28.61, lon: 77.21 },
  { city: "Singapore", lat: 1.35, lon: 103.82 },
  { city: "Jakarta", lat: -6.21, lon: 106.85 },
  { city: "Hong Kong", lat: 22.32, lon: 114.17 },
  { city: "Tokyo", lat: 35.68, lon: 139.69 },
  { city: "Seoul", lat: 37.57, lon: 126.98 },
  { city: "Sydney", lat: -33.87, lon: 151.21 },
];

/**
 * Uptime probe regions plotted as uniform markers. Pass a constant `bubbleColor`
 * (or `(row) => color`) to override the default chart blue, and equal
 * `minRadius`/`maxRadius` for uniform pins.
 */
export function BubbleMapProbesDemo({
  geoJson,
}: BubbleMapDemoProps) {
  const isDarkMode = useIsDarkMode();

  if (!geoJson) return null;

  return (
    <BubbleMap<Probe>
      echarts={echarts}
      geoJson={geoJson}
      data={probes}
      lng="lon"
      lat="lat"
      name="city"
      value={() => 1}
      bubbleColor={ChartPalette.categorical(0)}
      minRadius={8}
      maxRadius={8}
      tooltipFormatter={(row) =>
        `<span style="font-size:12px"><strong>${row.city}</strong></span>`
      }
      isDarkMode={isDarkMode}
    />
  );
}

/**
 * Bubble map - raw rows + dimension accessors, radius scaling, a tooltip
 */
export function BubbleMapBasicDemo({ geoJson }: BubbleMapDemoProps) {
  const isDarkMode = useIsDarkMode();

  if (!geoJson) return null;

  return (
    <BubbleMap<Delivery>
      echarts={echarts}
      geoJson={geoJson}
      data={deliveries}
      lng="lon"
      lat="lat"
      name="city"
      value="notifications"
      valueFormat={fmt}
      minRadius={8}
      isDarkMode={isDarkMode}
    />
  );
}

export function BubbleMapManyPointsDemo({ geoJson }: BubbleMapDemoProps) {
  const isDarkMode = useIsDarkMode();

  if (!geoJson) return null;

  return (
    <BubbleMap<Delivery>
      echarts={echarts}
      geoJson={geoJson}
      data={deliveries2}
      lng="lon"
      lat="lat"
      name="city"
      value="notifications"
      valueFormat={fmt}
      isDarkMode={isDarkMode}
    />
  );
}

const deliveries2 = [
  {
    notifications: 1455,
    lat: 49.012798,
    lon: 2.55,
    cca2: "FR",
    region: "Europe",
    city: "Paris",
  },
  {
    notifications: 3,
    lat: 47.449001,
    lon: -122.308998,
    cca2: "US",
    region: "North America",
    city: "Seattle",
  },
  {
    notifications: 1,
    lat: 23.843347,
    lon: 90.397783,
    cca2: "BD",
    region: "Asia Pacific",
    city: "Dhaka",
  },
  {
    notifications: 13,
    lat: 1.35019,
    lon: 103.994003,
    cca2: "SG",
    region: "Asia Pacific",
    city: "Singapore",
  },
  {
    notifications: 1,
    lat: 51.289501,
    lon: 6.76678,
    cca2: "DE",
    region: "Europe",
    city: "Dusseldorf",
  },
  {
    notifications: 1443,
    lat: 40.4936,
    lon: -3.56676,
    cca2: "ES",
    region: "Europe",
    city: "Madrid",
  },
  {
    notifications: 5,
    lat: 33.6367,
    lon: -84.428101,
    cca2: "US",
    region: "North America",
    city: "Atlanta",
  },
  {
    notifications: 1,
    lat: 23.5933,
    lon: 58.284401,
    cca2: "OM",
    region: "Middle East",
    city: "Muscat",
  },
  {
    notifications: 1515,
    lat: 33.942501,
    lon: -118.407997,
    cca2: "US",
    region: "North America",
    city: "Los Angeles",
  },
  {
    notifications: 23,
    lat: 43.6772,
    lon: -79.6306,
    cca2: "CA",
    region: "North America",
    city: "Toronto",
  },
  {
    notifications: 11,
    lat: 52.308601,
    lon: 4.76389,
    cca2: "NL",
    region: "Europe",
    city: "Amsterdam",
  },
  {
    notifications: 1,
    lat: 55.408798,
    lon: 37.9063,
    cca2: "RU",
    region: "Europe",
    city: "Moscow",
  },
  {
    notifications: 1,
    lat: -6.12557,
    lon: 106.655998,
    cca2: "ID",
    region: "Asia Pacific",
    city: "Jakarta",
  },
  {
    notifications: 2,
    lat: 40.692501,
    lon: -74.168701,
    cca2: "US",
    region: "North America",
    city: "Newark",
  },
  {
    notifications: 1,
    lat: 27.9755,
    lon: -82.533203,
    cca2: "US",
    region: "North America",
    city: "Tampa",
  },
  {
    notifications: 2,
    lat: 28.5665,
    lon: 77.103104,
    cca2: "IN",
    region: "Asia Pacific",
    city: "New Delhi",
  },
  {
    notifications: 4,
    lat: 25.7932,
    lon: -80.290604,
    cca2: "US",
    region: "North America",
    city: "Miami",
  },
  {
    notifications: 3,
    lat: -34.8222,
    lon: -58.5358,
    cca2: "AR",
    region: "South America",
    city: "Ezeiza",
  },
  {
    notifications: 1,
    lat: 51.4706,
    lon: -0.461941,
    cca2: "GB",
    region: "Europe",
    city: "London",
  },
  {
    notifications: 13,
    lat: 47.464699,
    lon: 8.54917,
    cca2: "CH",
    region: "Europe",
    city: "Zurich",
  },
  {
    notifications: 3,
    lat: 50.026402,
    lon: 8.54313,
    cca2: "DE",
    region: "Europe",
    city: "Frankfurt-am-Main",
  },
  {
    notifications: 1,
    lat: 38.9445,
    lon: -77.455803,
    cca2: "US",
    region: "North America",
    city: "Dulles",
  },
  {
    notifications: 1460,
    lat: 32.896801,
    lon: -97.038002,
    cca2: "US",
    region: "North America",
    city: "Dallas-Fort Worth",
  },
  {
    notifications: 1413,
    lat: 37.362598,
    lon: -121.929001,
    cca2: "US",
    region: "North America",
    city: "San Jose",
  },
  {
    notifications: 1,
    lat: 31.722601,
    lon: 35.993198,
    cca2: "JO",
    region: "Middle East",
    city: "Amman",
  },
  {
    notifications: 1,
    lat: -2.15742,
    lon: -79.883598,
    cca2: "EC",
    region: "South America",
    city: "Guayaquil",
  },
  {
    notifications: 5,
    lat: -23.435556,
    lon: -46.473057,
    cca2: "BR",
    region: "South America",
    city: "Sao Paulo",
  },
  {
    notifications: 1437,
    lat: 44.8283,
    lon: -0.715556,
    cca2: "FR",
    region: "Europe",
    city: "Bordeaux/Merignac",
  },
  {
    notifications: 1,
    lat: 14.5833,
    lon: -90.527496,
    cca2: "GT",
    region: "North America",
    city: "Guatemala City",
  },
  {
    notifications: 1,
    lat: -33.393002,
    lon: -70.785797,
    cca2: "CL",
    region: "South America",
    city: "Santiago",
  },
  {
    notifications: 1,
    lat: 22.308901,
    lon: 113.915001,
    cca2: "HK",
    region: "Asia Pacific",
    city: "Hong Kong",
  },
];
