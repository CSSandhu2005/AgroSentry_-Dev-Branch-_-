# 🌿 AgroSentry AI — Precision Farm Intelligence System

> **AgroSentry v1.0 Release Candidate**
> An autonomous multi-agent agricultural system delivering end-to-end crop intelligence, spatial digital twin management, real-time pathogen diagnosis, automated drone mission generation, and print-ready farmer advisory reports.

---

## 🏛️ System Architecture

```mermaid
graph TD
    A[Farmer Intake & Soil Profile] --> B[Crop Recommendation Agent]
    B --> C[Crop Planning Agent]
    C --> D[Disease Detection Agent]
    D --> E[Nutrient Risk Agent]
    E --> F[Dynamic Replanner Agent]
    F --> G[Spatial Planning + 3D Spatial Twin]
    G --> H[Dashboard Hero Agent]
    H --> I[Report Hero Agent]
    I --> J[Printable Advisory Report & PDF Engine]
```

---

## 🤖 Hero Agent Capabilities

| Agent | Responsibility | Core Outputs |
| :--- | :--- | :--- |
| **Recommendation Agent** | Multispectral soil & climate matching | Optimal crop selection, confidence score, profit projection |
| **Crop Planning Agent** | Agronomic lifecycle scheduler | Sowing timeline, drip irrigation, fertilizer application stages |
| **Disease Detection Agent** | Computer vision pathogen diagnosis | Leaf disease identification, severity rating, treatment advisory |
| **Nutrient Risk Agent** | Soil N-P-K deficiency analysis | Deficiency risk probability, suggested fertilizer adjustments |
| **Dynamic Replanner** | Event-driven adaptive planner | Weather disruption adjustment, sowing date shift |
| **Spatial Twin Agent** | Polygon boundary & layout optimizer | 3D land layout, zone allocations, autonomous drone flight rosters |
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

# Run database migrations (or run table creation script)
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

## ⚡ Performance Benchmarks

| Operation | Latency | Target |
| :--- | :--- | :--- |
| **Dashboard Context Loading** | ~350ms | < 500ms |
| **Report Payload Generation** | ~450ms | < 1000ms |
| **Spatial 3D Twin Rendering** | ~220ms | < 500ms |
| **Leaf Pathogen Scan Analysis** | ~500ms | < 1500ms |
| **TypeScript Build Check (`tsc`)** | **0 Errors** | Clean |

---

## 🎬 Hackathon Demonstration Script

1. **Step 1 — Farmer Intake (`/profile`)**: Set up farmer location, land size (5.5 acres), soil type (Black Cotton), and irrigation (Drip).
2. **Step 2 — Crop Recommendation (`/recommendation`)**: Run AI crop matching to receive primary crop (Cotton) and companion crop (Soybean) recommendations.
3. **Step 3 — Spatial Digital Twin & Boundary (`/spatial-planner`)**: Draw field boundary polygon on satellite map, compute 3D spatial layout score (92/100), and auto-generate drone flight missions.
4. **Step 4 — Disease Diagnosis (`/disease`)**: Upload leaf sample to diagnose pathogen severity and fungicide advisory.
5. **Step 5 — Dashboard Command Center (`/dashboard`)**: View synthesized Executive AI Pulse, Farm Health Score (88/100), KPI cards, and Hero Agent matrix.
6. **Step 6 — Advisory Report & PDF (`/reports`)**: Generate presentation-agnostic farm advisory report and click **"🖨️ Print / Save as PDF"** for clean A4 printing.

---

## 🛡️ License

Built for precision agriculture and AI hackathon demonstration. Designed by the AgroSentry Team.
