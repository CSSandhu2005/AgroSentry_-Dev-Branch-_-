// src/app/api/disease/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { buildContext } from '@/lib/agents/context';
import { runDiseaseAgent } from '@/lib/agents/disease-agent';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json(
        { error: 'Please login to use the Disease Diagnosis Agent.' },
        { status: 401 }
      );
    }

    let body: { symptoms?: string; imageBase64?: string; cropType?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    const { symptoms, imageBase64, cropType } = body;

    // 1. Validate Input
    if (!symptoms && !imageBase64) {
      return NextResponse.json(
        { error: 'Provide symptoms or an image.' },
        { status: 400 }
      );
    }

    // 4. Logging
    console.log('[DiseaseAgent]', {
      farmerId: session.farmerId,
      crop: cropType,
      hasImage: !!imageBase64,
      hasSymptoms: !!symptoms,
    });

    const ctx = await buildContext(session.userId, session.farmerId, session.planId);
    const result = await runDiseaseAgent(ctx, { symptoms, imageBase64, cropType });

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    // 3. Return Full Agent Result
    return NextResponse.json(result);
  } catch (err) {
    console.error('[Disease API Error]', err);
    // 2. Wrap in try/catch fallback error
    return NextResponse.json(
      { error: 'Unexpected server error.' },
      { status: 500 }
    );
  }
}
