import { GlobeMap, type GlobeMapMarker } from "komachi";
import { useIsDarkMode } from "~/lib/use-is-dark-mode";

const probes: GlobeMapMarker[] = [
  {
    name: "San Francisco",
    latitude: 37.77,
    longitude: -122.42,
  },
  {
    name: "Los Angeles",
    latitude: 34.05,
    longitude: -118.24,
  },
  { name: "Seattle", latitude: 47.61, longitude: -122.33 },
  { name: "Dallas", latitude: 32.78, longitude: -96.8 },
  { name: "Chicago", latitude: 41.88, longitude: -87.63 },
  { name: "Ashburn", latitude: 39.04, longitude: -77.49 },
  { name: "New York", latitude: 40.71, longitude: -74.01 },
  {
    name: "São Paulo",
    latitude: -23.55,
    longitude: -46.63,
  },
  {
    name: "Buenos Aires",
    latitude: -34.6,
    longitude: -58.38,
  },
  { name: "London", latitude: 51.51, longitude: -0.13 },
  { name: "Amsterdam", latitude: 52.37, longitude: 4.9 },
  { name: "Paris", latitude: 48.86, longitude: 2.35 },
  { name: "Frankfurt", latitude: 50.11, longitude: 8.68 },
  { name: "Madrid", latitude: 40.42, longitude: -3.7 },
  { name: "Dubai", latitude: 25.2, longitude: 55.27 },
  { name: "Lagos", latitude: 6.52, longitude: 3.38 },
  {
    name: "Johannesburg",
    latitude: -26.2,
    longitude: 28.05,
  },
  { name: "Mumbai", latitude: 19.08, longitude: 72.88 },
  { name: "Singapore", latitude: 1.35, longitude: 103.82 },
  { name: "Hong Kong", latitude: 22.32, longitude: 114.17 },
  { name: "Tokyo", latitude: 35.68, longitude: 139.69 },
  { name: "Seoul", latitude: 37.57, longitude: 126.98 },
  { name: "Sydney", latitude: -33.87, longitude: 151.21 },
];

/** Status probe regions on a draggable SVG globe. */
export function GlobeMapProbesDemo() {
  const isDarkMode = useIsDarkMode();

  return (
    <div className="mx-auto max-w-xl">
      <GlobeMap
        markers={probes}
        landColor="var(--text-color-komachi-inactive)"
        landHatchSpacing={8}
        oceanColor="transparent"
        markerColor="var(--color-komachi-brand)"
        markerRadius={8}
        autoRotate
        aria-label="Status probe regions"
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
