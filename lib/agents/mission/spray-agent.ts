// lib/agents/mission/spray-agent.ts

export interface TargetedSprayResult {
  totalParcelAcres: number;
  spotSprayAcres: number;
  areaSavedPct: number;
  chemicalRequiredL: number;
  chemicalSavedL: number;
  costSavedInr: number;
  recommendedFungicide: string;
}

export function calculateTargetedSpray(
  totalAcres: number = 5.5,
  infectedSpotPct: number = 5.5
): TargetedSprayResult {
  const spotSprayAcres = Number(((totalAcres * infectedSpotPct) / 100).toFixed(2));
  const fullChemicalL = Number((totalAcres * 2.27).toFixed(1));
  const spotChemicalL = Number((spotSprayAcres * 2.27).toFixed(1));
  const chemicalSavedL = Number((fullChemicalL - spotChemicalL).toFixed(1));
  const areaSavedPct = Number((100 - infectedSpotPct).toFixed(1));
  const costSavedInr = Math.round(chemicalSavedL * 290);

  return {
    totalParcelAcres: totalAcres,
    spotSprayAcres,
    areaSavedPct,
    chemicalRequiredL: spotChemicalL,
    chemicalSavedL,
    costSavedInr,
    recommendedFungicide: "Copper Oxychloride 50% WP (Precision Nozzle Flow: 1.2 L/min)",
  };
}
