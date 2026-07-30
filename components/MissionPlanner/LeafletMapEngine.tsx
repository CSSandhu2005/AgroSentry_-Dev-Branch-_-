// components/MissionPlanner/LeafletMapEngine.tsx
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { UnifiedMission } from '@/lib/mission/mission';
import { Point2D, LatLngPoint } from '@/lib/mission/boundary';
import { PathPlannerConfig } from '@/lib/mission/path-planner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Layers,
  Navigation,
  Wind,
  Sun,
  Battery,
  Clock,
  Send,
  Edit3,
  Trash2,
  Download,
  Upload,
  Sparkles,
  Sliders,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Eye,
  EyeOff,
  Cpu,
} from 'lucide-react';

interface LeafletMapEngineProps {
  mission: UnifiedMission;
  onUpdatePolygon: (pts: Point2D[], latLngs?: LatLngPoint[]) => void;
  onUpdateConfig: (overrides: Partial<PathPlannerConfig>) => void;
  onToggleReplanning: () => void;
}

export default function LeafletMapEngine({
  mission,
  onUpdatePolygon,
  onUpdateConfig,
  onToggleReplanning,
}: LeafletMapEngineProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const featureGroupRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const waypointsGroupRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const diseaseGroupRef = useRef<any>(null);

  const [locating, setLocating] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [basemapType, setBasemapType] = useState<'SATELLITE' | 'TERRAIN' | 'HYBRID'>('SATELLITE');

  // Layer Toggles State (Phase 4)
  const [layersConfig, setLayersConfig] = useState({
    showSatellite: true,
    showBoundary: true,
    showWaypoints: true,
    showFlightPath: true,
    showDiseaseHeatmap: true,
    showSprayZones: true,
    showTakeoffLanding: true,
  });

  const [diseaseOpacity, setDiseaseOpacity] = useState(0.45);
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  const waypoints = mission.replanning.isReplanned
    ? mission.replanning.replannedWaypoints
    : mission.pathResult.waypoints;

  // Initialize Leaflet Map (Phase 1 Layout Refactor)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const loadCSS = (href: string) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    };
    loadCSS('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
    loadCSS('https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css');

    // Strict CSS isolation & clipping
    if (!document.querySelector('#leaflet-custom-gis-style')) {
      const style = document.createElement('style');
      style.id = 'leaflet-custom-gis-style';
      style.innerHTML = `
        .leaflet-container {
          width: 100% !important;
          height: 100% !important;
          background: #050c08 !important;
          outline: none;
          font-family: inherit;
          border-radius: 1rem;
        }
        .leaflet-draw-tooltip {
          white-space: nowrap !important;
          background: rgba(15, 23, 42, 0.95) !important;
          border: 1px solid rgba(56, 189, 248, 0.4) !important;
          color: #f8fafc !important;
          border-radius: 8px !important;
          padding: 4px 8px !important;
          box-shadow: 0 4px 14px rgba(0,0,0,0.6) !important;
          font-size: 11px !important;
        }
        .leaflet-draw-toolbar a {
          background-color: rgba(15, 23, 42, 0.9) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
          color: #ffffff !important;
        }
        .leaflet-draw-actions {
          top: 0 !important;
          left: 36px !important;
        }
        .leaflet-draw-actions a {
          background-color: rgba(15, 23, 42, 0.95) !important;
          color: #38bdf8 !important;
        }
        .custom-wp-dot {
          transition: transform 0.15s ease-in-out;
        }
        .custom-wp-dot:hover {
          transform: scale(1.6);
        }
      `;
      document.head.appendChild(style);
    }

    function initLeaflet() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (window as any).L;
      if (!L || !mapContainerRef.current) return;

      const centerLat = 20.5937;
      const centerLng = 78.9629;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 17,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Esri Satellite Basemap
      const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri Satellite | AgroSentry Mission Studio',
        maxZoom: 20,
      }).addTo(map);
      map._satLayer = satLayer;

      // Labels Overlay
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
        opacity: 0.75,
        maxZoom: 20,
      }).addTo(map);

      const drawnItems = new L.FeatureGroup().addTo(map);
      featureGroupRef.current = drawnItems;

      const waypointsItems = new L.FeatureGroup().addTo(map);
      waypointsGroupRef.current = waypointsItems;

      const diseaseItems = new L.FeatureGroup().addTo(map);
      diseaseGroupRef.current = diseaseItems;

      // Leaflet Draw Control
      const drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItems, edit: true, remove: true },
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true,
            shapeOptions: { color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.25, weight: 2.5 },
          },
          rectangle: {
            shapeOptions: { color: '#38bdf8', fillColor: '#38bdf8', fillOpacity: 0.25, weight: 2.5 },
          },
          circle: false,
          circlemarker: false,
          polyline: false,
          marker: false,
        },
      });
      map.addControl(drawControl);

      // Handle drawn boundary
      map.on(L.Draw.Event.CREATED, (e: any) => {
        drawnItems.clearLayers();
        drawnItems.addLayer(e.layer);
        const rawLatLngs = (e.layer.getLatLngs?.()[0] || []).map((pt: any) => [pt.lat, pt.lng]);

        if (rawLatLngs.length >= 3) {
          const lats = rawLatLngs.map((p: any) => p[0]);
          const lngs = rawLatLngs.map((p: any) => p[1]);
          const minLat = Math.min(...lats), maxLat = Math.max(...lats);
          const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
          const dLat = maxLat - minLat || 0.001;
          const dLng = maxLng - minLng || 0.001;

          const normPts = rawLatLngs.map(([lat, lng]: [number, number]) => ({
            x: (lng - minLng) / dLng,
            y: 1 - (lat - minLat) / dLat,
          }));

          const latLngObjects = rawLatLngs.map(([lat, lng]: [number, number]) => ({ lat, lng }));
          onUpdatePolygon(normPts, latLngObjects);
          setStatusMsg('✅ Field boundary updated. Lawnmower path recalculated.');
          setTimeout(() => setStatusMsg(''), 4000);
        }
      });

      mapInstanceRef.current = map;
      setTimeout(() => map.invalidateSize(), 250);
    }

    if ((window as any).L?.Draw) {
      initLeaflet();
    } else {
      const s1 = document.createElement('script');
      s1.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s1.onload = () => {
        const s2 = document.createElement('script');
        s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js';
        s2.onload = initLeaflet;
        document.head.appendChild(s2);
      };
      document.head.appendChild(s1);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update Flight Path & Waypoints Layer (Phase 5 Refactor: subtle dots `•`, labels ONLY for Start, End, and every 10th WP)
  const renderMissionOverlays = useCallback(() => {
    const L = (window as any).L;
    const map = mapInstanceRef.current;
    const waypointsGroup = waypointsGroupRef.current;
    const diseaseGroup = diseaseGroupRef.current;
    if (!L || !map || !waypointsGroup || !diseaseGroup) return;

    waypointsGroup.clearLayers();
    diseaseGroup.clearLayers();

    const bounds = map.getBounds();
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();
    const latSpan = northEast.lat - southWest.lat || 0.003;
    const lngSpan = northEast.lng - southWest.lng || 0.003;

    // Phase 6: Thin cyan flight path lines
    if (layersConfig.showFlightPath && waypoints.length > 1) {
      const pathLatLngs = waypoints.map((wp) => [
        southWest.lat + (1 - wp.y) * latSpan,
        southWest.lng + wp.x * lngSpan,
      ]);

      const polyline = L.polyline(pathLatLngs, {
        color: mission.plannerConfig.isSpotSprayMode ? '#f59e0b' : '#06b6d4',
        weight: 2.5,
        opacity: 0.85,
        dashArray: mission.replanning.isReplanned ? '6, 6' : undefined,
      });
      waypointsGroup.addLayer(polyline);
    }

    // Phase 5: Subtle dots `•` + Labels for Start, End & every 10th Waypoint
    if (layersConfig.showWaypoints && waypoints.length > 0) {
      waypoints.forEach((wp, idx) => {
        const lat = southWest.lat + (1 - wp.y) * latSpan;
        const lng = southWest.lng + wp.x * lngSpan;

        const isStart = idx === 0 && layersConfig.showTakeoffLanding;
        const isEnd = idx === waypoints.length - 1 && layersConfig.showTakeoffLanding;
        const isTenth = (idx + 1) % 10 === 0;

        let iconHtml = '';

        if (isStart) {
          iconHtml = `<div style="background:#22c55e;color:#ffffff;border-radius:6px;padding:3px 7px;font-size:11px;font-weight:bold;border:2px solid #ffffff;box-shadow:0 0 12px rgba(34,197,94,0.9);white-space:nowrap;">🛫 TAKEOFF</div>`;
        } else if (isEnd) {
          iconHtml = `<div style="background:#ef4444;color:#ffffff;border-radius:6px;padding:3px 7px;font-size:11px;font-weight:bold;border:2px solid #ffffff;box-shadow:0 0 12px rgba(239,68,68,0.9);white-space:nowrap;">🛬 LAND</div>`;
        } else if (isTenth) {
          iconHtml = `<div style="background:#0ea5e9;color:#ffffff;border-radius:4px;padding:1px 5px;font-size:10px;font-weight:bold;border:1px solid #ffffff;box-shadow:0 0 6px rgba(14,165,233,0.8);">#${idx + 1}</div>`;
        } else {
          // Subtle dot `•`
          const dotColor = wp.isSpotTarget ? '#ef4444' : '#38bdf8';
          iconHtml = `<div class="custom-wp-dot" style="background:${dotColor};border-radius:50%;width:8px;height:8px;border:1.5px solid #ffffff;box-shadow:0 0 4px ${dotColor};"></div>`;
        }

        const divIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-wp-icon',
          iconSize: isStart || isEnd ? [70, 24] : isTenth ? [30, 18] : [8, 8],
          iconAnchor: isStart || isEnd ? [35, 12] : isTenth ? [15, 9] : [4, 4],
        });

        const marker = L.marker([lat, lng], { icon: divIcon });
        marker.bindPopup(`
          <div style="font-family:sans-serif;font-size:12px;padding:2px;">
            <b style="color:#0ea5e9;">Waypoint #${idx + 1}</b><br/>
            <b>Type:</b> ${wp.type}<br/>
            <b>Altitude:</b> ${wp.altMeters}m<br/>
            <b>Action:</b> ${wp.action || 'CAMERA_CAPTURE'}
          </div>
        `);
        waypointsGroup.addLayer(marker);
      });
    }

    // Phase 7: Disease Heatmap Overlay with Opacity Slider
    if (layersConfig.showDiseaseHeatmap) {
      mission.terrain.diseaseClouds.forEach((cloud) => {
        const lat = southWest.lat + (1 - cloud.y) * latSpan;
        const lng = southWest.lng + cloud.x * lngSpan;

        const circle = L.circle([lat, lng], {
          color: '#ef4444',
          fillColor: '#ef4444',
          fillOpacity: diseaseOpacity,
          weight: 1.5,
          radius: 30 * (cloud.severityPct / 50),
        });
        circle.bindPopup(`
          <div style="font-family:sans-serif;font-size:12px;">
            <b style="color:#ef4444;">🔴 ${cloud.diseaseName}</b><br/>
            <b>Severity:</b> ${cloud.severityPct}%<br/>
            <b>Confidence:</b> ${cloud.confidencePct}%
          </div>
        `);
        diseaseGroup.addLayer(circle);
      });
    }
  }, [waypoints, mission, layersConfig, diseaseOpacity]);

  useEffect(() => {
    renderMissionOverlays();
  }, [renderMissionOverlays]);

  // Geolocation Handler
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setStatusMsg('❌ Geolocation not supported.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const map = mapInstanceRef.current;
        if (map) map.setView([latitude, longitude], 17, { animate: true });
        setLocating(false);
        setStatusMsg(`📍 GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        setTimeout(() => setStatusMsg(''), 4000);
      },
      () => {
        setLocating(false);
        setStatusMsg('❌ Geolocation failed.');
        setTimeout(() => setStatusMsg(''), 4000);
      }
    );
  };

  const handleExportMission = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(mission, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${mission.id}_flight_plan.json`);
    document.head.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setStatusMsg('💾 Mission JSON exported.');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  return (
    <div className="relative w-full h-[650px] rounded-2xl border shadow-2xl overflow-hidden bg-black select-none">
      {/* 100% Fill Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full block relative z-0" />

      {/* PHASE 3: PROFESSIONAL GIS FLOATING TOOLBAR */}
      <div className="absolute top-3.5 left-[54px] right-14 z-[1000] p-2.5 rounded-2xl bg-background/95 backdrop-blur-md border border-white/10 shadow-2xl flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold px-2.5 py-1">
            🛰 GIS Mission Studio
          </Badge>

          {/* Basemap Selector */}
          <select
            value={basemapType}
            onChange={(e) => setBasemapType(e.target.value as any)}
            className="bg-secondary/90 border border-white/10 text-foreground text-xs rounded-lg px-2.5 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="SATELLITE">Satellite Basemap ▼</option>
            <option value="TERRAIN">Terrain Topo</option>
            <option value="HYBRID">Hybrid Vector</option>
          </select>

          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-accent border border-white/10 text-foreground font-semibold flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" /> Layers ({Object.values(layersConfig).filter(Boolean).length})
          </button>

          <Button onClick={handleLocateMe} disabled={locating} variant="ghost" size="sm" className="h-7 px-2 text-sky-400 hover:text-sky-300">
            <Navigation className="w-3.5 h-3.5 mr-1" /> GPS
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={handleExportMission} variant="outline" size="sm" className="h-7 px-2.5 text-xs">
            <Download className="w-3.5 h-3.5 mr-1" /> Export
          </Button>

          <Button
            onClick={onToggleReplanning}
            variant={mission.replanning.isReplanned ? 'destructive' : 'outline'}
            size="sm"
            className="h-7 px-2.5 text-xs font-medium"
          >
            {mission.replanning.isReplanned ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Obstacle
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400" /> Obstacle Detour
              </>
            )}
          </Button>

          <Button className="h-7 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
            <Send className="w-3.5 h-3.5 mr-1" /> Launch Mission
          </Button>
        </div>
      </div>

      {/* PHASE 4: FLOATING LAYER CONTROL DROPDOWN */}
      {showLayerMenu && (
        <div className="absolute top-16 left-4 z-[1001] p-4 rounded-2xl bg-background/95 backdrop-blur-md border border-white/10 shadow-2xl w-64 space-y-3 font-mono text-xs text-foreground">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-bold flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> GIS Mission Layers
            </span>
            <button onClick={() => setShowLayerMenu(false)} className="text-muted-foreground hover:text-foreground">✕</button>
          </div>

          <div className="space-y-2">
            {Object.entries(layersConfig).map(([key, val]) => (
              <label key={key} className="flex items-center justify-between cursor-pointer hover:text-emerald-400">
                <span className="capitalize">{key.replace('show', '')}</span>
                <input
                  type="checkbox"
                  checked={val}
                  onChange={(e) => setLayersConfig({ ...layersConfig, [key]: e.target.checked })}
                  className="accent-emerald-500 cursor-pointer"
                />
              </label>
            ))}
          </div>

          {/* Phase 7 Opacity Slider */}
          <div className="pt-2 border-t space-y-1.5">
            <div className="flex justify-between text-muted-foreground text-[11px]">
              <span>Disease Heatmap Opacity:</span>
              <span className="font-bold text-foreground font-mono">{Math.round(diseaseOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1.0}
              step={0.05}
              value={diseaseOpacity}
              onChange={(e) => setDiseaseOpacity(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* FLOATING STATUS TOAST */}
      {statusMsg && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 rounded-xl bg-background/95 backdrop-blur border border-emerald-500/40 shadow-xl text-xs font-mono text-emerald-400">
          <span>{statusMsg}</span>
        </div>
      )}

      {/* PHASE 8: FLOATING TOP STATISTICS HUD */}
      <div className="absolute top-16 right-14 z-[999] p-3 rounded-2xl bg-background/90 backdrop-blur-md border border-white/10 shadow-xl flex items-center gap-3 font-mono text-xs">
        <div className="flex items-center space-x-1.5 text-sky-400">
          <Wind className="w-3.5 h-3.5" />
          <span>8.4 km/h NE</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center space-x-1.5 text-amber-400">
          <Sun className="w-3.5 h-3.5" />
          <span>28°C Clear</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center space-x-1.5 text-emerald-400">
          <Battery className="w-3.5 h-3.5" />
          <span>{mission.telemetry.remainingBatteryPct}% Charge</span>
        </div>
      </div>

      {/* PHASE 8: FLOATING BOTTOM METRICS HUD */}
      <div className="absolute bottom-4 right-4 z-[1000] p-3.5 rounded-2xl bg-background/90 backdrop-blur-md border border-white/10 shadow-xl grid grid-cols-4 gap-4 font-mono text-xs text-center">
        <div>
          <span className="text-[10px] text-muted-foreground">Field Area</span>
          <div className="font-bold text-emerald-400">{mission.fieldBoundary.acres} Acres</div>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground">Flight Distance</span>
          <div className="font-bold text-sky-400">{mission.pathResult.totalDistanceMeters}m</div>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground">Flight Duration</span>
          <div className="font-bold text-purple-400">{mission.telemetry.flightDurationFormatted}</div>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground">Waypoints</span>
          <div className="font-bold text-amber-400">{waypoints.length} WPs ({mission.pathResult.turnCount} Turns)</div>
        </div>
      </div>
    </div>
  );
}
