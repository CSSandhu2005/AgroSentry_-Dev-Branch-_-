// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { dbExecute } from '@/lib/fluxbase';

export async function GET() {
  const session = await getSession(); console.log("PROFILE SESSION:", session);
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const rows = await dbExecute(
      'SELECT * FROM farmer_profile WHERE user_id = $1 LIMIT 1',
      [session.userId]
    );
    if (!rows[0]) return NextResponse.json({ profile: null });
    return NextResponse.json({ profile: rows[0] });
  } catch (err) {
    console.error('[Profile GET]', err);
    return NextResponse.json({ profile: null });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }

  const {
    name, phone, village, district, state,
    land_acres, soil_type, irrigation,
    primary_crops, economic_class, preferred_lang,
  } = body as Record<string, string | string[]>;

  const profile_pct = (() => {
    const fields = [name, phone, village, district, state, land_acres, soil_type, irrigation, primary_crops, preferred_lang];
    const filled = fields.filter(f => f !== undefined && f !== null && f !== '' && !(Array.isArray(f) && f.length === 0)).length;
    return Math.round((filled / fields.length) * 100);
  })();

  const cropsJson = JSON.stringify(Array.isArray(primary_crops) ? primary_crops : (primary_crops ? [primary_crops] : []));

  try {
    const existing = await dbExecute(
      'SELECT farmer_id FROM farmer_profile WHERE user_id = $1 LIMIT 1',
      [session.userId]
    );

    let farmerId: number;

    if (existing[0]) {
      farmerId = existing[0].farmer_id as number;
      // Build UPDATE dynamically — only set columns that exist in the table
      // This prevents "unknown column" errors if migration hasn't run yet
      await dbExecute(
        `UPDATE farmer_profile SET
          name=$1, phone=$2, village=$3, district=$4, state=$5,
          land_acres=$6, soil_type=$7, irrigation=$8,
          primary_crops=$9, economic_class=$10, preferred_lang=$11,
          profile_pct=$12
         WHERE user_id=$13`,
        [
          name || null, phone || null, village || null, district || null, state || null,
          land_acres || null, soil_type || null, irrigation || null,
          cropsJson, economic_class || null, preferred_lang || 'en',
          profile_pct, session.userId,
        ]
      );
    } else {
      const insertRows = await dbExecute(
        `INSERT INTO farmer_profile
          (user_id, name, phone, village, district, state,
           land_acres, soil_type, irrigation,
           primary_crops, economic_class, preferred_lang, profile_pct)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING farmer_id`,
        [
          session.userId,
          name || null, phone || null, village || null, district || null, state || null,
          land_acres || null, soil_type || null, irrigation || null,
          cropsJson, economic_class || null, preferred_lang || 'en',
          profile_pct,
        ]
      );
      farmerId = insertRows[0]?.farmer_id as number;
    }

    session.farmerId = farmerId;
    await session.save();
    return NextResponse.json({ ok: true, profile_pct, farmerId });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Profile POST]', msg);

    const fallbackMsg = msg.slice(0, 200);
    return NextResponse.json({ error: `Save failed: ${fallbackMsg}` }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }

  const allowed = ['name','phone','village','district','state','land_acres','soil_type','irrigation','primary_crops','economic_class','preferred_lang'];
  const updates: string[] = [];
  const values: unknown[] = [];

  for (const [key, val] of Object.entries(body)) {
    if (allowed.includes(key)) {
      updates.push(`${key}=$${values.length + 1}`);
      values.push(key === 'primary_crops' ? JSON.stringify(val) : val);
    }
  }
  if (!updates.length) return NextResponse.json({ error: 'No valid fields' }, { status: 400 });

  values.push(session.userId);
  try {
    await dbExecute(
      `UPDATE farmer_profile SET ${updates.join(',')} WHERE user_id=$${values.length}`,
      values
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
