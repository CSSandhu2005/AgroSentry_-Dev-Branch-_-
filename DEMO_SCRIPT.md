# 🎬 AgroSentry v1.0 — Hackathon Demonstration Guide

This guide provides a structured 3-minute presentation walkthrough for hackathon judges and evaluators.

---

## ⏱️ 3-Minute Presentation Flow

### Minute 1: The Problem & Intake
- **Opening**: "AgroSentry is an end-to-end autonomous multi-agent agricultural system that bridges soil intelligence, spatial layout planning, disease detection, and drone flight automation for smallholder farmers."
- **Action**: Navigate to `/profile`. Show farmer profile setup (Location: Indore, Soil: Black Cotton, Land: 5.5 Acres).
- **Action**: Navigate to `/recommendation`. Click **Run Recommendation** to see multispectral AI crop selection (Cotton + Soybean intercropping).

### Minute 2: Spatial Twin & Disease Diagnosis
- **Action**: Navigate to `/spatial-planner`. Show the Satellite Leaflet Map with field boundary draw tool. Point out the auto-calculated **3D Spatial Layout Score (92/100)** and **Autonomous Drone Flight Mission Roster**.
- **Action**: Navigate to `/disease`. Upload sample leaf photo and trigger **AI Pathogen Scan** to showcase real-time computer vision diagnosis and fungicide prescription.

### Minute 3: Command Center & Printable PDF Report
- **Action**: Navigate to `/dashboard`. Show the **Executive AI Pulse Banner**, **Farm Health Score (88/100)**, KPI metrics, and 6 Hero Agent cards with relative timestamps ("Updated 5 min ago").
- **Action**: Navigate to `/reports`. Point out the presentation-agnostic structured report, executive summary, deterministic action checklist, and technical audit appendix.
- **Closing**: Click **"🖨️ Print / Save as PDF"** to reveal the crisp, A4-friendly print preview.

---

## 🏆 Key Differentiation Highlights for Judges
1. **No Frontend Calculations**: All metrics (expected yield, land efficiency, water savings, health score) are calculated on the backend for single-source-of-truth accuracy.
2. **Resilient AI Pipeline**: Every Gemini call has a 5-second timeout and deterministic agronomic fallback so the app never hangs or crashes during live demos.
3. **End-to-End Layered Architecture**: Farmer Intake → Recommendation → Crop Plan → Disease Diagnosis → Nutrient Risk → Dynamic Replanner → Spatial Twin → Dashboard → Printable Report.
