import { NextRequest, NextResponse } from "next/server";
import { dbExecute } from "@/lib/fluxbase";
import { getSession } from "@/lib/session";

async function ensureTable() {
  await dbExecute(`
    CREATE TABLE IF NOT EXISTS field_boundaries (
      id SERIAL PRIMARY KEY,
      farmer_id INT NOT NULL,
      polygon_json JSONB NOT NULL,
      area_acres NUMERIC,
      centroid_lat NUMERIC,
      centroid_lng NUMERIC,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function GET(req: NextRequest) {
  try {
    await ensureTable();

    const { searchParams } = new URL(req.url);
    let farmerId = searchParams.get("farmerId");

    if (!farmerId) {
      const session = await getSession();
      farmerId = session.farmerId ? String(session.farmerId) : "5";
    }

    const farmerIdNum = parseInt(farmerId, 10) || 5;

    const rows = await dbExecute(
      `SELECT *
       FROM field_boundaries
       WHERE farmer_id=$1
       ORDER BY updated_at DESC
       LIMIT 1;`,
      [farmerIdNum]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: true, boundary: null });
    }

    const row = rows[0];

    let polygon = row.polygon_json;
    if (typeof polygon === "string") {
      try {
        polygon = JSON.parse(polygon);
      } catch {
        // keep raw if not JSON
      }
    }

    const boundary = {
      id: row.id,
      farmer_id: row.farmer_id,
      polygon: polygon,
      latlngs: polygon,
      area: row.area_acres != null ? parseFloat(row.area_acres) : 0,
      area_acres: row.area_acres != null ? parseFloat(row.area_acres) : 0,
      centroid: {
        lat: row.centroid_lat != null ? parseFloat(row.centroid_lat) : 0,
        lng: row.centroid_lng != null ? parseFloat(row.centroid_lng) : 0,
      },
      created_at: row.created_at,
      updated_at: row.updated_at,
    };

    return NextResponse.json({
      success: true,
      boundary,
    });
  } catch (err: any) {
    console.error("GET /api/field-boundary error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch boundary" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable();

    const body = await req.json();

    let farmerId = body.farmerId || body.farmer_id;
    if (!farmerId) {
      const session = await getSession();
      farmerId = session.farmerId || 5;
    }
    const farmerIdNum = parseInt(String(farmerId), 10) || 5;

    const polygon = body.polygon || body.latlngs || [];
    const area = body.area ?? body.area_acres ?? 0;
    const centroid = body.centroid || body.center || { lat: 0, lng: 0 };
    const centroidLat = centroid.lat ?? 0;
    const centroidLng = centroid.lng ?? 0;

    const polygonJson = JSON.stringify(polygon);

    await dbExecute(
      `INSERT INTO field_boundaries
       (farmer_id, polygon_json, area_acres, centroid_lat, centroid_lng)
       VALUES ($1, $2, $3, $4, $5);`,
      [farmerIdNum, polygonJson, area, centroidLat, centroidLng]
    );

    return NextResponse.json({
      success: true,
    });
  } catch (err: any) {
    console.error("POST /api/field-boundary error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save boundary" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureTable();

    const { searchParams } = new URL(req.url);
    let farmerId = searchParams.get("farmerId");

    if (!farmerId) {
      const session = await getSession();
      farmerId = session.farmerId ? String(session.farmerId) : "5";
    }

    const farmerIdNum = parseInt(farmerId, 10) || 5;

    await dbExecute(
      `DELETE FROM field_boundaries WHERE farmer_id = $1;`,
      [farmerIdNum]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/field-boundary error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to clear boundary" },
      { status: 500 }
    );
  }
}
