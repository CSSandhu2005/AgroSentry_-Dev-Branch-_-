// components/MissionPlanner/VisualizationEngine3D.tsx
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { UnifiedMission } from '@/lib/mission/mission';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, FastForward, Sparkles, Navigation, Eye } from 'lucide-react';

interface VisualizationEngine3DProps {
  mission: UnifiedMission;
  isPreviewMode?: boolean;
}

export default function VisualizationEngine3D({ mission, isPreviewMode = false }: VisualizationEngine3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(isPreviewMode);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [currentWpIndex, setCurrentWpIndex] = useState(0);
  const [activeActionText, setActiveActionText] = useState('Standby — Drone ready on launchpad');

  const waypoints = mission.replanning.isReplanned
    ? mission.replanning.replannedWaypoints
    : mission.pathResult.waypoints;

  // Scene references
  const droneGroupRef = useRef<THREE.Group | null>(null);
  const rotorsRef = useRef<THREE.Mesh[]>([]);
  const spotlightRef = useRef<THREE.SpotLight | null>(null);
  const progressRef = useRef<{ wpIdx: number; t: number }>({ wpIdx: 0, t: 0 });

  const buildScene = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.clientWidth || 800;
    const H = container.clientHeight || 500;

    // 1. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070f1e');
    scene.fog = new THREE.FogExp2('#070f1e', 0.012);

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 300);
    camera.position.set(20, 24, 30);
    camera.lookAt(0, 0, 0);

    // 3. Lighting
    scene.add(new THREE.AmbientLight('#bae6fd', 0.6));
    const sun = new THREE.DirectionalLight('#fffbeb', 2.0);
    sun.position.set(30, 45, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    scene.add(sun);
    scene.add(new THREE.HemisphereLight('#38bdf8', '#15803d', 0.4));

    // 4. Ground Terrain Plane (3D Grid)
    const GRID_SIZE = 36;
    const groundGeo = new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE, 32, 32);
    
    // Add slight elevation variation
    const posAttr = groundGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = Math.sin(x * 0.2) * Math.cos(y * 0.2) * 0.4;
      posAttr.setZ(i, z);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0d2818'),
      roughness: 0.85,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid helper
    const gridHelper = new THREE.GridHelper(GRID_SIZE, 24, '#22c55e44', '#1e293b');
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // 5. Render 3D Crop Rows
    const cropGroup = new THREE.Group();
    for (let x = -14; x <= 14; x += 1.8) {
      for (let z = -14; z <= 14; z += 1.2) {
        // Crop bush
        const cropGeo = new THREE.SphereGeometry(0.35, 6, 6);
        const cropMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(x > 0 && z > 0 ? '#15803d' : '#22c55e'),
          roughness: 0.7,
        });
        const cropMesh = new THREE.Mesh(cropGeo, cropMat);
        cropMesh.scale.set(1, 1.2, 1);
        cropMesh.position.set(x + (Math.random() * 0.2 - 0.1), 0.4, z + (Math.random() * 0.2 - 0.1));
        cropMesh.castShadow = true;
        cropGroup.add(cropMesh);
      }
    }
    scene.add(cropGroup);

    // 6. Step 6 & 9 — Render Volumetric 3D Disease Clouds (Cloud Height = Severity, Color = Confidence)
    mission.terrain.diseaseClouds.forEach((cloud) => {
      const cloudGroup = new THREE.Group();
      const wx = (cloud.x - 0.5) * GRID_SIZE;
      const wz = (cloud.y - 0.5) * GRID_SIZE;
      const cloudHeight = 0.8 + (cloud.severityPct / 100) * 3.5;

      // Volumetric cloud spheres
      for (let i = 0; i < 5; i++) {
        const cloudGeo = new THREE.SphereGeometry(0.8 + Math.random() * 0.6, 8, 8);
        const cloudMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#ef4444'),
          roughness: 0.3,
          transparent: true,
          opacity: 0.35 + (cloud.confidencePct / 200),
          wireframe: i === 0,
        });
        const mesh = new THREE.Mesh(cloudGeo, cloudMat);
        mesh.position.set(
          wx + (Math.random() - 0.5) * 1.5,
          cloudHeight + (Math.random() - 0.5) * 0.6,
          wz + (Math.random() - 0.5) * 1.5
        );
        cloudGroup.add(mesh);
      }

      // Vertical disease severity light beam
      const beamGeo = new THREE.CylinderGeometry(0.15, 0.4, cloudHeight, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#f87171'),
        transparent: true,
        opacity: 0.4,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(wx, cloudHeight / 2, wz);
      cloudGroup.add(beam);

      scene.add(cloudGroup);
    });

    // 7. Render 3D Boustrophedon Trajectory Line
    if (waypoints.length > 1) {
      const linePts = waypoints.map((wp) => {
        const x = (wp.x - 0.5) * GRID_SIZE;
        const z = (wp.y - 0.5) * GRID_SIZE;
        const y = Math.max(1.5, (wp.altMeters / 18.5) * 6.0);
        return new THREE.Vector3(x, y, z);
      });

      const pathGeo = new THREE.BufferGeometry().setFromPoints(linePts);
      const pathMat = new THREE.LineBasicMaterial({
        color: mission.plannerConfig.isSpotSprayMode ? 0xf59e0b : 0x38bdf8,
        linewidth: 3,
      });
      const pathLine = new THREE.Line(pathGeo, pathMat);
      scene.add(pathLine);

      // Render 3D Waypoint Nodes
      linePts.forEach((pt, idx) => {
        const nodeGeo = new THREE.SphereGeometry(0.25, 8, 8);
        const nodeMat = new THREE.MeshStandardMaterial({
          color: idx === 0 ? 0x22c55e : idx === linePts.length - 1 ? 0xef4444 : 0x38bdf8,
          emissive: idx === 0 ? 0x22c55e : 0x000000,
        });
        const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
        nodeMesh.position.copy(pt);
        scene.add(nodeMesh);
      });
    }

    // 8. Construct 3D Drone Model (Quadcopter Group)
    const droneGroup = new THREE.Group();

    // Drone Body
    const bodyMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.25, 0.8),
      new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.2, metalness: 0.8 })
    );
    droneGroup.add(bodyMesh);

    // 4 Arms & Rotors
    const rotors: THREE.Mesh[] = [];
    const armCoords = [
      [0.6, 0.6],
      [-0.6, 0.6],
      [0.6, -0.6],
      [-0.6, -0.6],
    ];

    armCoords.forEach(([ax, az]) => {
      const arm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6),
        new THREE.MeshStandardMaterial({ color: '#475569' })
      );
      arm.rotation.z = Math.PI / 2;
      arm.position.set(ax / 2, 0, az / 2);
      droneGroup.add(arm);

      // Rotor disk
      const rotor = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.02, 12),
        new THREE.MeshStandardMaterial({ color: '#38bdf8', transparent: true, opacity: 0.7 })
      );
      rotor.position.set(ax, 0.15, az);
      droneGroup.add(rotor);
      rotors.push(rotor);
    });

    // Spotlight beam (Down-pointing laser beam)
    const spot = new THREE.SpotLight('#38bdf8', 5.0, 25, Math.PI / 6, 0.5);
    spot.position.set(0, 0, 0);
    spot.target.position.set(0, -10, 0);
    droneGroup.add(spot);
    droneGroup.add(spot.target);
    spotlightRef.current = spot;

    // Set initial drone position
    if (waypoints.length > 0) {
      const initWp = waypoints[0];
      droneGroup.position.set(
        (initWp.x - 0.5) * GRID_SIZE,
        1.5,
        (initWp.y - 0.5) * GRID_SIZE
      );
    }

    scene.add(droneGroup);
    droneGroupRef.current = droneGroup;
    rotorsRef.current = rotors;

    // 9. Animation Loop
    let lastTime = performance.now();
    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Spin rotors
      rotors.forEach((r) => {
        r.rotation.y += dt * 25 * speedMultiplier;
      });

      // Flight Progress Interpolation
      if (isPlaying && waypoints.length > 1 && droneGroupRef.current) {
        const pr = progressRef.current;
        pr.t += dt * 0.4 * speedMultiplier;

        if (pr.t >= 1) {
          pr.t = 0;
          pr.wpIdx = (pr.wpIdx + 1) % (waypoints.length - 1);
          setCurrentWpIndex(pr.wpIdx);
        }

        const wpA = waypoints[pr.wpIdx];
        const wpB = waypoints[pr.wpIdx + 1];

        if (wpA && wpB) {
          const ax = (wpA.x - 0.5) * GRID_SIZE;
          const az = (wpA.y - 0.5) * GRID_SIZE;
          const ay = Math.max(1.5, (wpA.altMeters / 18.5) * 6.0);

          const bx = (wpB.x - 0.5) * GRID_SIZE;
          const bz = (wpB.y - 0.5) * GRID_SIZE;
          const by = Math.max(1.5, (wpB.altMeters / 18.5) * 6.0);

          const curX = THREE.MathUtils.lerp(ax, bx, pr.t);
          const curY = THREE.MathUtils.lerp(ay, by, pr.t);
          const curZ = THREE.MathUtils.lerp(az, bz, pr.t);

          droneGroupRef.current.position.set(curX, curY, curZ);

          // Rotate drone towards direction of travel
          const angle = Math.atan2(bz - az, bx - ax);
          droneGroupRef.current.rotation.y = -angle + Math.PI / 2;

          // Update action text
          if (wpA.type === 'TAKEOFF') {
            setActiveActionText('🛫 TAKEOFF — Ascending to cruise altitude 18.5m');
          } else if (wpA.type === 'SPOT_SPRAY') {
            setActiveActionText('🎯 TARGETED SPOT SPRAY — Applying precision dosage over infection zone');
          } else if (wpA.type === 'RTL') {
            setActiveActionText('🏠 RETURN TO LAUNCH — Returning to home point');
          } else {
            setActiveActionText(`🛰 SWEEPING — Boustrophedon Waypoint ${pr.wpIdx + 1} of ${waypoints.length}`);
          }
        }
      }

      // Smooth camera orbit
      const camRadius = 34;
      const camTime = now * 0.00015;
      camera.position.x = Math.sin(camTime) * camRadius;
      camera.position.z = Math.cos(camTime) * camRadius;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [waypoints, mission, isPlaying, speedMultiplier]);

  useEffect(() => {
    const cleanup = buildScene();
    return () => {
      cleanup?.();
    };
  }, [buildScene]);

  const handleResetPlayback = () => {
    progressRef.current = { wpIdx: 0, t: 0 };
    setCurrentWpIndex(0);
    setIsPlaying(false);
    setActiveActionText('Standby — Drone reset to launchpad');
  };

  return (
    <div className="relative w-full rounded-2xl bg-card border shadow-lg overflow-hidden flex flex-col">
      {/* 3D Header Bar */}
      <div className="p-4 border-b bg-card/80 backdrop-blur flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 flex items-center gap-1 font-mono text-xs">
            <Eye className="w-3.5 h-3.5" /> 🌾 Visualization Engine 3D
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">
            Synchronized 3D Farm Twin & Flight Preview
          </span>
        </div>

        {/* Cinematic Playback Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            variant="default"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 mr-1" /> Pause Preview
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 mr-1" /> Preview Mission
              </>
            )}
          </Button>

          <Button
            onClick={() => setSpeedMultiplier(speedMultiplier === 1 ? 2 : speedMultiplier === 2 ? 5 : 1)}
            variant="outline"
            size="sm"
            className="text-xs font-mono"
          >
            <FastForward className="w-3.5 h-3.5 mr-1 text-sky-400" /> {speedMultiplier}x
          </Button>

          <Button onClick={handleResetPlayback} variant="ghost" size="sm" className="text-xs">
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-[480px] bg-black relative" />

      {/* Active Action HUD Overlay */}
      <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-background/90 backdrop-blur border shadow-md flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-foreground font-semibold">{activeActionText}</span>
        </div>

        <div className="flex items-center space-x-3 text-muted-foreground">
          <span>Waypoint {currentWpIndex + 1}/{waypoints.length}</span>
          <span>Altitude 18.5m</span>
        </div>
      </div>
    </div>
  );
}
