// app/api/operations/orchestrate/route.ts
import { NextResponse } from "next/server";
import { runMissionOrchestrator } from "@/lib/agents/orchestrator/mission-orchestrator";
import { calculateTargetedSpray } from "@/lib/agents/mission/spray-agent";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const prompt = body.prompt || "Inspect cotton field and perform targeted spray";
    const field = body.field || "Sector B — Cotton Parcel (5.5 Acres)";

    const payload = await runMissionOrchestrator(prompt, field);
    const sprayCalc = calculateTargetedSpray(5.5, 5.5);

    return NextResponse.json({
      success: true,
      data: {
        ...payload,
        sprayAnalysis: sprayCalc,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to orchestrate mission" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const payload = await runMissionOrchestrator();
  return NextResponse.json({ success: true, data: payload });
}
