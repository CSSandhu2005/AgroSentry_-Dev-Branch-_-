// lib/mission/battery.ts

export interface BatteryTelemetry {
  gsdCmPerPx: number;           // Ground Sampling Distance (e.g. 0.69 cm/pixel)
  batteryCapacityMah: number;   // 5200 mAh
  estimatedBatteryUsedPct: number; // e.g. 18%
  remainingBatteryPct: number;  // e.g. 82%
  maxFlightTimeMins: number;    // e.g. 28 mins max hover
  flightDurationFormatted: string; // e.g. "8 min 30 s"
  chemicalSavedPct: number;     // e.g. 92% in spot spray mode
  waterSavedLiters: number;     // e.g. 506 Liters
  co2AvoidedKg: number;         // e.g. 14.2 kg CO2 avoided
  coveragePct: number;          // 100% or spot %
}

/** Calculate Ground Sampling Distance (GSD) in cm/pixel */
export function calculateGSD(altitudeMeters: number, sensorWidthMm = 13.2, focalLengthMm = 8.8, imageWidthPx = 4000): number {
  if (altitudeMeters <= 0) return 0;
  const gsdCm = (sensorWidthMm * altitudeMeters * 100) / (focalLengthMm * imageWidthPx);
  return Math.round(gsdCm * 100) / 100;
}

/** Calculate telemetry & battery consumption stats */
export function calculateBatteryTelemetry(
  altitudeMeters: number,
  flightTimeSeconds: number,
  acres: number,
  isSpotSprayMode: boolean
): BatteryTelemetry {
  const gsd = calculateGSD(altitudeMeters);
  
  // Drone Specs: 6S LiPo 5200mAh 22.2V -> ~115Wh. Cruise draw = 220W, Spray draw = 260W
  const avgPowerW = isSpotSprayMode ? 240 : 210;
  const totalEnergyWh = 115.4;
  const energyUsedWh = (flightTimeSeconds / 3600) * avgPowerW;
  const usedPct = Math.min(95, Math.max(5, Math.round((energyUsedWh / totalEnergyWh) * 100)));
  const remainingPct = 100 - usedPct;

  // Flight time formatting
  const mins = Math.floor(flightTimeSeconds / 60);
  const secs = flightTimeSeconds % 60;
  const timeFormatted = `${mins} min ${secs > 0 ? `${secs} s` : ''}`;

  // Spray savings
  const fullFieldWaterL = Math.round(acres * 100);
  const spotWaterL = isSpotSprayMode ? Math.round(fullFieldWaterL * 0.08) : fullFieldWaterL;
  const waterSaved = fullFieldWaterL - spotWaterL;
  const chemicalSavedPct = isSpotSprayMode ? 92 : 0;
  const co2Avoided = Math.round((acres * (isSpotSprayMode ? 2.8 : 1.1)) * 10) / 10;
  const coveragePct = isSpotSprayMode ? 14 : 100;

  return {
    gsdCmPerPx: gsd,
    batteryCapacityMah: 5200,
    estimatedBatteryUsedPct: usedPct,
    remainingBatteryPct: remainingPct,
    maxFlightTimeMins: 28,
    flightDurationFormatted: timeFormatted,
    chemicalSavedPct,
    waterSavedLiters: waterSaved,
    co2AvoidedKg: co2Avoided,
    coveragePct,
  };
}
