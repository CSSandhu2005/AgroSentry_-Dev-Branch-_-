// lib/mission/boundary.ts

export interface Point2D {
  x: number; // Normalized [0..1] longitude/x
  y: number; // Normalized [0..1] latitude/y (0=top, 1=bottom)
}

export interface LatLngPoint {
  lat: number;
  lng: number;
}

export interface PolygonBoundary {
  id: string;
  name: string;
  points: Point2D[];
  latLngs?: LatLngPoint[];
  acres: number;
  perimeterMeters: number;
  centroid: Point2D;
  sweepAngleRad: number; // Optimal boustrophedon sweep angle
}

/** Ray-casting point-in-polygon algorithm */
export function isPointInPolygon(pt: Point2D, poly: Point2D[]): boolean {
  if (poly.length < 3) return false;
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect =
      yi > pt.y !== yj > pt.y &&
      pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi || 0.00001) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/** Calculate polygon area in normalized units, then scale to acres */
export function calculatePolygonAreaAcres(poly: Point2D[], scaleWidthMeters = 300, scaleHeightMeters = 300): number {
  if (poly.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < poly.length; i++) {
    const j = (i + 1) % poly.length;
    area += poly[i].x * poly[j].y;
    area -= poly[j].x * poly[i].y;
  }
  area = Math.abs(area) / 2.0;
  const sqMeters = area * scaleWidthMeters * scaleHeightMeters;
  const acres = sqMeters / 4046.86;
  return Math.round(acres * 100) / 100;
}

/** Calculate perimeter in meters */
export function calculatePolygonPerimeterMeters(poly: Point2D[], scaleW = 300, scaleH = 300): number {
  if (poly.length < 2) return 0;
  let perim = 0;
  for (let i = 0; i < poly.length; i++) {
    const j = (i + 1) % poly.length;
    const dx = (poly[j].x - poly[i].x) * scaleW;
    const dy = (poly[j].y - poly[i].y) * scaleH;
    perim += Math.sqrt(dx * dx + dy * dy);
  }
  return Math.round(perim);
}

/** Calculate polygon centroid */
export function calculateCentroid(poly: Point2D[]): Point2D {
  if (!poly.length) return { x: 0.5, y: 0.5 };
  let cx = 0, cy = 0;
  poly.forEach((p) => {
    cx += p.x;
    cy += p.y;
  });
  return { x: cx / poly.length, y: cy / poly.length };
}

/** Compute principal axis (optimal boustrophedon sweep angle) to minimize turns */
export function calculateOptimalSweepAngle(poly: Point2D[]): number {
  if (poly.length < 3) return 0;
  let maxDist = 0;
  let bestAngle = 0;
  // Find longest edge
  for (let i = 0; i < poly.length; i++) {
    const j = (i + 1) % poly.length;
    const dx = poly[j].x - poly[i].x;
    const dy = poly[j].y - poly[i].y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxDist) {
      maxDist = dist;
      bestAngle = Math.atan2(dy, dx);
    }
  }
  return bestAngle;
}

/** Default sample field polygon (Sector B Cotton Parcel) */
export const DEFAULT_FIELD_POLYGON: Point2D[] = [
  { x: 0.15, y: 0.15 },
  { x: 0.82, y: 0.12 },
  { x: 0.88, y: 0.82 },
  { x: 0.52, y: 0.88 },
  { x: 0.18, y: 0.75 },
];
