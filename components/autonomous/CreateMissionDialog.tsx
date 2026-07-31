// components/autonomous/CreateMissionDialog.tsx
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MissionType, MissionPriority, AutonomousMission } from '@/lib/mission/types';
import { createMission } from '@/lib/mission/store';
import {
  Scan,
  Droplet,
  Sparkles,
  Zap,
  CheckCircle2,
  Globe,
  Sliders,
  Bot,
} from 'lucide-react';

interface CreateMissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMissionCreated?: (mission: AutonomousMission) => void;
}

const MISSION_TYPES: { id: MissionType; title: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: 'DISEASE_SCAN',
    title: '🛰 Disease Scan',
    desc: 'High-res multispectral mapping to identify leaf pathogen hotspots.',
    icon: <Scan className="w-4 h-4 text-emerald-400" />,
  },
  {
    id: 'PRECISION_SPRAY',
    title: '💧 Precision Spray',
    desc: 'Targeted micro-dosing spot spray on pre-identified disease clusters.',
    icon: <Droplet className="w-4 h-4 text-blue-400" />,
  },
  {
    id: 'NUTRIENT_SURVEY',
    title: '🌱 Nutrient Survey',
    desc: 'Soil N-P-K deficiency analysis and vigor mapping.',
    icon: <Sparkles className="w-4 h-4 text-amber-400" />,
  },
  {
    id: 'WATER_STRESS',
    title: '💦 Water Stress',
    desc: 'Thermal canopy transpiration mapping for drip irrigation health.',
    icon: <Zap className="w-4 h-4 text-sky-400" />,
  },
  {
    id: 'CROP_AUDIT',
    title: '📈 Crop Audit',
    desc: 'Stand count, canopy density, and yield estimation audit.',
    icon: <CheckCircle2 className="w-4 h-4 text-purple-400" />,
  },
];

const FIELDS_LIST = [
  { name: 'Cotton Field A (Parcel 4)', acres: 5.5, crop: 'Cotton (Bt Variety)' },
  { name: 'Sector B — Wheat Parcel', acres: 6.2, crop: 'Wheat' },
  { name: 'North Orchard Block 2', acres: 8.2, crop: 'Citrus / Orange' },
  { name: 'South Soybean Field C', acres: 4.0, crop: 'Soybean' },
];

const DRONES_LIST = [
  'AgroDrone-01 (Hexacopter RTK)',
  'AgroDrone-02 (Fixed-Wing Scout)',
  'AgroDrone-03 (Precision Spot Sprayer)',
];

export function CreateMissionDialog({
  open,
  onOpenChange,
  onMissionCreated,
}: CreateMissionDialogProps) {
  const [name, setName] = useState('Sector B — Cotton Disease Scan');
  const [type, setType] = useState<MissionType>('DISEASE_SCAN');
  const [priority, setPriority] = useState<MissionPriority>('HIGH');
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(0);
  const [selectedDrone, setSelectedDrone] = useState(DRONES_LIST[0]);
  const [objective, setObjective] = useState(
    'Perform high-resolution autonomous flight over field boundary to detect early fungal pathogen infection and calculate spot treatment coordinates.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fieldObj = FIELDS_LIST[selectedFieldIndex];

    const mission = createMission({
      name,
      type,
      priority,
      field: {
        name: fieldObj.name,
        acres: fieldObj.acres,
        location: 'Punjab, India',
      },
      droneId: selectedDrone,
      objective,
      crop: fieldObj.crop,
    });

    if (onMissionCreated) {
      onMissionCreated(mission);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card border shadow-xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono text-xs">
              AgroSentry Autonomous Mission OS
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">Immutable Mission Creator</span>
          </div>
          <DialogTitle className="text-xl font-extrabold tracking-tight flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-400" />
            Create New Autonomous Mission
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Initialize an aviation-grade autonomous drone mission. Every mission gets an immutable flight ID (AGS-2026-XXXX) and tracks sustainability impact.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Mission Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Mission Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sector B — Cotton Disease Scan"
              className="bg-background border-border text-xs focus:ring-emerald-500"
              required
            />
          </div>

          {/* Mission Type Selection Cards */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Select Mission Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MISSION_TYPES.map((mt) => (
                <div
                  key={mt.id}
                  onClick={() => setType(mt.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-1 ${
                    type === mt.id
                      ? 'bg-emerald-500/10 border-emerald-500/60 ring-1 ring-emerald-500/30'
                      : 'bg-background hover:bg-secondary/40 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                      {mt.icon}
                      {mt.title}
                    </span>
                    {type === mt.id && (
                      <Badge className="bg-emerald-500 text-white text-[10px] px-1.5">Selected</Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">{mt.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Priority & Drone Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Priority Level</label>
              <div className="flex items-center space-x-2">
                {(['LOW', 'MEDIUM', 'HIGH'] as MissionPriority[]).map((p) => (
                  <Button
                    key={p}
                    type="button"
                    variant={priority === p ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPriority(p)}
                    className={`flex-1 text-xs font-mono font-bold ${
                      priority === p
                        ? p === 'HIGH'
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : p === 'MEDIUM'
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-background'
                    }`}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Assigned Autonomous Drone</label>
              <select
                value={selectedDrone}
                onChange={(e) => setSelectedDrone(e.target.value)}
                className="w-full h-9 rounded-md bg-background border border-border px-3 text-xs text-foreground focus:ring-emerald-500"
              >
                {DRONES_LIST.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Field Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Target Field Boundary</label>
            <div className="grid grid-cols-2 gap-2">
              {FIELDS_LIST.map((f, idx) => (
                <div
                  key={f.name}
                  onClick={() => setSelectedFieldIndex(idx)}
                  className={`p-2.5 rounded-lg border cursor-pointer text-xs transition-all ${
                    selectedFieldIndex === idx
                      ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/20'
                      : 'bg-background border-border'
                  }`}
                >
                  <p className="font-semibold text-foreground truncate">{f.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {f.acres} Acres • {f.crop}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Objective Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Mission Operational Objective</label>
            <Textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Describe the mission goal..."
              className="bg-background border-border text-xs focus:ring-emerald-500 h-20"
              required
            />
          </div>

          <DialogFooter className="pt-2 flex items-center justify-between sm:justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md"
            >
              <Bot className="w-4 h-4 mr-1.5" /> Initialize Mission
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
