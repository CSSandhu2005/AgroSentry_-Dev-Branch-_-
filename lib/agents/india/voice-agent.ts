// lib/agents/india/voice-agent.ts

export interface VoiceMissionParseResult {
  language: string;
  transcript: string;
  extractedIntent: "Disease Scan" | "Targeted Spray" | "Water Patrol" | "Nutrient Survey" | "Boundary Survey";
  targetParcel: string;
  confidenceScore: number;
  generatedMissionType: string;
}

export function parseBharatVoiceCommand(
  transcript: string,
  language: string = "Hindi"
): VoiceMissionParseResult {
  let intent: VoiceMissionParseResult["extractedIntent"] = "Targeted Spray";

  if (transcript.includes("बीमारी") || transcript.includes("spray") || transcript.includes("छिड़काव")) {
    intent = "Targeted Spray";
  } else if (transcript.includes("पानी") || transcript.includes("water") || transcript.includes("सिंचाई")) {
    intent = "Water Patrol";
  } else if (transcript.includes("सीमा") || transcript.includes("boundary") || transcript.includes("नक्शा")) {
    intent = "Boundary Survey";
  }

  return {
    language,
    transcript,
    extractedIntent: intent,
    targetParcel: "Sector B — Cotton Parcel (5.5 Acres)",
    confidenceScore: 0.96,
    generatedMissionType: `Autonomous ${intent} Mission`,
  };
}
