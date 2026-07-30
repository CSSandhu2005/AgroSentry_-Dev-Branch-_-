// src/app/api/report/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { buildContext } from '@/lib/agents/context';
import { runReportAgent } from '@/lib/agents/report-agent';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(req.url);
    const paramFarmerId = searchParams.get('farmerId');

    // Dynamic farmerId from session, query param, or demo fallback
    const farmerId = paramFarmerId
      ? parseInt(paramFarmerId, 10) || 5
      : session.farmerId || 5;

    const userId = session.userId || 1;

    const ctx = await buildContext(userId, farmerId, session.planId);
    const result = await runReportAgent(ctx);

    if (!result.success) {
      return NextResponse.json({ error: result.error, trace: result.trace }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data, trace: result.trace });
  } catch (err: any) {
    console.error('GET /api/report error:', err);
    return NextResponse.json({ error: err.message || 'Report endpoint error' }, { status: 500 });
  }
}
