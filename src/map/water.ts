import { geoArea } from 'd3-geo';

/**
 * Hand-simplified Nile course, Lake Nasser outline and green zones, as [lon, lat].
 * Schematic only (traced from well-known town positions), not survey data.
 */
type LL = [number, number];

export const nileMain: LL[] = [
  [32.888, 23.97], // High Dam
  [32.89, 24.09], // Aswan
  [32.94, 24.47], // Kom Ombo
  [32.87, 24.98], // Edfu
  [32.55, 25.29], // Esna
  [32.53, 25.62],
  [32.64, 25.7], // Luxor
  [32.76, 25.92],
  [32.72, 26.16], // Qena
  [32.47, 26.12],
  [32.24, 26.05], // Nag Hammadi
  [32.1, 26.03],
  [31.89, 26.33],
  [31.69, 26.56], // Sohag
  [31.5, 26.77],
  [31.18, 27.18], // Asyut
  [30.84, 27.73],
  [30.75, 28.1], // Minya
  [30.84, 28.65],
  [31.1, 29.07], // Beni Suef
  [31.2, 29.3],
  [31.3, 29.85],
  [31.23, 30.05], // Cairo
  [31.13, 30.19],
];
export const nileRosetta: LL[] = [
  [31.13, 30.19],
  [30.93, 30.47],
  [30.75, 30.8],
  [30.5, 31.2],
  [30.37, 31.46],
];
export const nileDamietta: LL[] = [
  [31.13, 30.19],
  [31.18, 30.47],
  [31.3, 30.8],
  [31.4, 31.05],
  [31.65, 31.3],
  [31.84, 31.52],
];

/** Lake Nasser (very simplified polygon). */
export const lakeNasser: LL[] = [
  [32.88, 23.96],
  [33.02, 23.7],
  [32.95, 23.35],
  [32.7, 23.0],
  [32.35, 22.7],
  [32.0, 22.45],
  [31.75, 22.2],
  [31.5, 21.9],
  [31.3, 21.72],
  [31.2, 21.8],
  [31.4, 22.1],
  [31.55, 22.4],
  [31.9, 22.7],
  [32.25, 23.0],
  [32.62, 23.3],
  [32.8, 23.65],
  [32.86, 23.97],
];

/** Nile Delta (green). */
export const delta: LL[] = [
  [31.2, 30.05],
  [30.9, 30.3],
  [30.4, 30.6],
  [29.95, 31.15],
  [30.3, 31.47],
  [31.0, 31.6],
  [31.9, 31.55],
  [32.3, 31.25],
  [32.0, 30.8],
  [31.6, 30.45],
];

/** Closed polygon with the winding d3-geo expects (small area = clockwise). */
export const ring = (pts: LL[]): GeoJSON.Polygon => {
  const poly: GeoJSON.Polygon = { type: 'Polygon', coordinates: [[...pts, pts[0]]] };
  if (geoArea(poly) > 2 * Math.PI) poly.coordinates[0].reverse();
  return poly;
};
export const line = (pts: LL[]): GeoJSON.LineString => ({ type: 'LineString', coordinates: pts });
