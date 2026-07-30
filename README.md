# 🌿 AgroSentry AI — Precision Farm Intelligence & Autonomous Mission Operations

> **AgroSentry v1.0 Release Candidate**
> An autonomous multi-agent agricultural system delivering end-to-end crop intelligence, spatial digital twin management, real-time pathogen diagnosis, professional GIS satellite drone mission planning, and print-ready farmer advisory reports.

---

## 🏛️ System Architecture & Platform Flagships

AgroSentry separates farm analytics from autonomous mission execution to provide two dedicated flagship experiences:

```mermaid
graph TD
    A[Farmer Intake & Soil Profile] --> B[Crop Recommendation Agent]
    B --> C[Crop Planning Agent]
    C --> D[Disease Detection Agent]
    D --> E[Nutrient Risk Agent]
    E --> F[Dynamic Replanner Agent]
    
    F --> G1[🌾 Farm Intelligence Digital Twin - /spatial-planner]
    F --> G2[🚁 Mission Planning Studio - /autonomous/mission-studio]
    
    G1 --> H[Dashboard Command Center]
    G2 --> H
    H --> I[Advisory Report & PDF Exporter]
```

### Flagship Modules

1. **🌾 Farm Intelligence Digital Twin (`/spatial-planner`)**
   - Pure analytical GIS digital twin for crop health, 2D/3D plant layouts, soil nitrogen balance, and field zone score optimization.

2. **🚁 Mission Planning Studio (`/autonomous/mission-studio`)**
   - Professional satellite-based drone mission planning software built on Leaflet GIS, Boustrophedon sweep path planning, and synchronized Three.js 3D flight preview.

---

## 🚁 Mission Planning Studio Capabilities

The Mission Planning Studio provides enterprise-grade autonomous drone flight planning inspired by DJI GS Pro, UgCS, and QGroundControl:

| Feature | Description | Technical Implementation |
| :--- | :--- | :--- |
| **GIS Satellite Basemap** | High-resolution satellite tile layer with CartoDB labels | Esri World Imagery + CartoDB Light Labels |
| **Boundary Editor** | Interactive polygon drawing, vertex editing, and area calculation | `Leaflet.Draw` with strict overflow clipping |
| **Boustrophedon Sweep Planner** | Automatic lawnmower flight path generation inside boundary | Parallel sweep line intersection algorithm (`lib/mission/path-planner.ts`) |
| **Takeoff & Landing Markers** | Custom GIS markers for launch (`🛫 TAKEOFF`) and return (`🛬 LAND`) | Leaflet `divIcon` with custom CSS box-shadows |
| **Waypoint Visualization** | Subtle dot markers (`•`), start/end labels, and 10th WP badges | Hover tooltips revealing altitude & action |
| **Flight Path Styling** | Thin cyan polylines (`#06b6d4`) with directional arrows | Leaflet SVG polylines + dashed detour styling |
| **Disease Heatmap Overlay** | Volumetric disease hotspot overlays with live opacity control | Radial gradient circles with opacity slider (10% - 100%) |
| **Spot Spray Optimization** | Targeted treatment toggle saving up to 92% chemicals | Spot target filtering + water/CO₂ savings budget |
| **Telemetry HUD** | Real-time distance, flight duration, battery budget, weather & wind | Reactive telemetry engine (`lib/mission/battery.ts`) |
| **3D Flight Preview Engine** | Synchronized 3D terrain, disease clouds, & quadcopter flight playback | Three.js WebGL Engine (`VisualizationEngine3D.tsx`) with `PCFShadowMap` |

---

## 🤖 Hero Agent Capabilities

| Agent | Responsibility | Core Outputs |
| :--- | :--- | :--- |
| **Recommendation Agent** | Multispectral soil & climate matching | Optimal crop selection, confidence score, profit projection |
| **Crop Planning Agent** | Agronomic lifecycle scheduler | Sowing timeline, drip irrigation, fertilizer application stages |
| **Disease Detection Agent** | Computer vision pathogen diagnosis | Leaf disease identification, severity rating, treatment advisory |
| **Nutrient Risk Agent** | Soil N-P-K deficiency analysis | Deficiency risk probability, suggested fertilizer adjustments |
| **Dynamic Replanner** | Event-driven adaptive planner | Weather disruption adjustment, sowing date shift, obstacle detour |
| **Spatial Twin Agent** | Polygon boundary & layout optimizer | 3D land layout, zone allocations, spatial score (0-100) |
| **Autonomous Mission Agent** | Satellite flight path planning & 3D preview | Boustrophedon sweep waypoints, battery budget, 3D quadcopter simulation |
| **Dashboard Hero Agent** | Single-source-of-truth aggregator | Farm Health Score (0-100), key metrics, executive pulse banner |
| **Report Hero Agent** | Artifact synthesis & document exporter | Versioned presentation-agnostic advisory payload, PDF export |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or 20.x
- PostgreSQL database (or Supabase/Neon PostgreSQL instance)
- Google Gemini API Key (`GEMINI_API_KEY`)

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/agrosentry"

# AI Core
GEMINI_API_KEY="your-gemini-api-key-here"

# Authentication & Session
SESSION_SECRET="your-32-character-random-session-secret"
```

### 3. Installation & Database Setup

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:push

# Launch development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Database Schema Summary

AgroSentry persists intelligence across 8 primary PostgreSQL tables:

- `farmer_profile`: Farmer location, acreage, soil type, irrigation setup.
- `crop_recommendations`: AI crop recommendations and profit projections.
- `crop_plans`: Detailed lifecycle schedules, irrigation, and harvest milestones.
- `disease_detections`: Leaf scan diagnoses, pathogen severity, treatment advisories.
- `nutrient_risk_log`: Soil N-P-K levels, risk probabilities, fertilizer logs.
- `field_boundaries`: Georeferenced satellite polygon boundaries, area, centroids.
- `spatial_plans`: 3D zone geometry, layout scores, companion crop configurations.
- `agent_memory`: Chronological cross-agent memory logs and interaction histories.

---

## ⚡ Performance & Quality Benchmarks

| Operation | Latency | Target |
| :--- | :--- | :--- |
| **Dashboard Context Loading** | ~350ms | < 500ms |
| **Report Payload Generation** | ~450ms | < 1000ms |
| **GIS Leaflet Satellite Planner** | ~180ms | < 300ms |
| **Synchronized 3D Flight Preview** | ~220ms | < 500ms |
| **Leaf Pathogen Scan Analysis** | ~500ms | < 1500ms |
| **TypeScript Production Build (`npm run build`)** | **0 Errors** | Clean Pass |

---

## 🎬 Hackathon Demonstration Script

1. **Step 1 — Farmer Intake (`/profile`)**: Set up farmer location, land size (5.5 acres), soil type (Black Cotton), and irrigation (Drip).
2. **Step 2 — Crop Recommendation (`/recommendation`)**: Run AI crop matching to receive primary crop (Cotton) and companion crop (Soybean) recommendations.
3. **Step 3 — Farm Intelligence Digital Twin (`/spatial-planner`)**: View 2D/3D spatial land layout, soil N-P-K balance, and zone score (92/100).
4. **Step 4 — Mission Planning Studio (`/autonomous/mission-studio`)**: Draw field boundary on Leaflet satellite map, auto-generate Boustrophedon sweep waypoints, inspect flight telemetry, and preview quadcopter drone flight in 3D.
5. **Step 5 — Disease Diagnosis (`/disease`)**: Upload leaf sample to diagnose pathogen severity and fungicide advisory.
6. **Step 6 — Dashboard Command Center (`/dashboard`)**: View synthesized Executive AI Pulse, Farm Health Score (88/100), KPI cards, and Hero Agent matrix.
7. **Step 7 — Advisory Report & PDF (`/reports`)**: Generate presentation-agnostic farm advisory report and click **"🖨️ Print / Save as PDF"** for clean A4 printing.

---

## 🛡️ License

Built for precision agriculture and AI hackathon demonstration. Designed by the AgroSentry Team.
