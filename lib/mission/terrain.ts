// lib/mission/terrain.ts
import { Point2D } from "./boundary";

export interface TerrainObstacle {
  id: string;
  type: "TREE" | "BUILDING" | "POWER_LINE" | "DYNAMIC_WIND";
  x: number; // Normalized [0..1]
  y: number; // Normalized [0..1]
  heightMeters: number;
  radiusMeters: number;
}

export interface DiseaseCloudPoint {
  id: string;
  x: number; // Normalized [0..1]
  y: number; // Normalized [0..1]
  severityPct: number;    // 0..100 -> Height of disease cloud (e.g. 80 = high cloud)
  confidencePct: number;  // 0..100 -> Color intensity / opacity
  diseaseName: string;    // e.g. "Leaf Rust (Puccinia)" | "Cotton Boll Rot"
  affectedCrop: string;   // e.g. "Cotton"
}

export interface TerrainData {
  fieldElevationMinM: number;
  fieldElevationMaxM: number;
  cropType: string;
  cropHeightMeters: number;
  obstacles: TerrainObstacle[];
  diseaseClouds: DiseaseCloudPoint[];
}

export const DEFAULT_TERRAIN_DATA: TerrainData = {
  fieldElevationMinM: 12.4,
  fieldElevationMaxM: 18.2,
  cropType: "Cotton & Wheat Intercrop",
  cropHeightMeters: 1.25,
  obstacles: [
    { id: "obs-1", type: "TREE", x: 0.35, y: 0.42, heightMeters: 8.5, radiusMeters: 6.0 },
    { id: "obs-2", type: "BUILDING", x: 0.78, y: 0.25, heightMeters: 6.0, radiusMeters: 8.0 },
    { id: "obs-3", type: "POWER_LINE", x: 0.50, y: 0.85, heightMeters: 12.0, radiusMeters: 4.0 },
  ],
  diseaseClouds: [
    {
      id: "dis-1",
      x: 0.42,
      y: 0.38,
      severityPct: 84,
      confidencePct: 96,
      diseaseName: "Leaf Rust (Puccinia)",
      affectedCrop: "Cotton",
    },
    {
      id: "dis-2",
      x: 0.68,
      y: 0.62,
      severityPct: 62,
      confidencePct: 88,
      diseaseName: "Bacterial Blight",
      affectedCrop: "Cotton",
    },
    {
      id: "dis-3",
      x: 0.28,
      y: 0.70,
      severityPct: 45,
      confidencePct: 79,
      diseaseName: "Nitrogen Deficiency",
      affectedCrop: "Wheat",
    },
  ],
};
