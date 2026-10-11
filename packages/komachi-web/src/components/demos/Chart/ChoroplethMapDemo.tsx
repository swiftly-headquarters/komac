import { ChoroplethMap, type MapGeoJson } from "komachi";
import * as echarts from "echarts/core";
import { MapChart } from "echarts/charts";
import { VisualMapComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { useIsDarkMode } from "~/lib/use-is-dark-mode";

echarts.use([MapChart, VisualMapComponent, TooltipComponent, CanvasRenderer]);

interface ChoroplethMapDemoProps {
  geoJson: MapGeoJson | null;
}

/** A country-level traffic row - joined to GeoJSON features by `country`. */
interface CountryTraffic {
  /** Must match the GeoJSON feature's `name` property. */
  country: string;
  notifications: number;
}

// Country-level traffic. The colour scale is continuous; if your data is
// skewed, shape it in the parent (e.g. a transformed value) before passing it in.
const countries: CountryTraffic[] = [
  { country: "United States of America", notifications: 4200 },
  { country: "Germany", notifications: 3100 },
  { country: "United Kingdom", notifications: 2800 },
  { country: "Japan", notifications: 2500 },
  { country: "France", notifications: 2200 },
  { country: "Brazil", notifications: 1700 },
  { country: "India", notifications: 1500 },
  { country: "Canada", notifications: 1300 },
  { country: "Australia", notifications: 1100 },
  { country: "Spain", notifications: 900 },
  { country: "Netherlands", notifications: 700 },
  { country: "Mexico", notifications: 600 },
  { country: "Argentina", notifications: 420 },
  { country: "Nigeria", notifications: 300 },
  { country: "South Africa", notifications: 220 },
];

const fmt = (n: number) =>
  `${n >= 1000 ? `${(n / 1000).toLocaleString()}k` : n.toString()} notifications`;

/**
 * Choropleth map - regions shaded by value, joined to GeoJSON features by name.
 * Uses the default continuous linear colour scale.
 */
export function ChoroplethMapBasicDemo({ geoJson }: ChoroplethMapDemoProps) {
  const isDarkMode = useIsDarkMode();

  if (!geoJson) return null;

  return (
    <ChoroplethMap<CountryTraffic>
      echarts={echarts}
      geoJson={geoJson}
      data={countries}
      name="country"
      value="notifications"
      valueFormat={fmt}
      isDarkMode={isDarkMode}
    />
  );
}
