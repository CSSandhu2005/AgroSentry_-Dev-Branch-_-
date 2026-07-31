// components/autonomous/MissionQueue.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AutonomousMission, MissionStatus, MissionType } from '@/lib/mission/types';
import { getMissions } from '@/lib/mission/store';
import { MissionCard } from './MissionCard';
import { MissionDetailsPanel } from './MissionDetailsPanel';
import { CreateMissionDialog } from './CreateMissionDialog';
import {
  Plus,
  Search,
  Filter,
  ListOrdered,
  Activity,
  CheckCircle2,
  Clock,
  Globe,
  Sliders,
  Bot,
} from 'lucide-react';

export function MissionQueue() {
  const [missions, setMissions] = useState<AutonomousMission[]>([]);
  const [selectedMission, setSelectedMission] = useState<AutonomousMission | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    const loaded = getMissions();
    setMissions(loaded);
    if (loaded.length > 0) {
      setSelectedMission(loaded[0]);
    }
  }, []);

  const handleMissionCreated = (newMission: AutonomousMission) => {
    const reloaded = getMissions();
    setMissions(reloaded);
    setSelectedMission(newMission);
  };

  const filteredMissions = missions.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.field.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && (m.status === 'CREATED' || m.status === 'PLANNING' || m.status === 'QUEUED' || m.status === 'EXECUTING')) ||
      (statusFilter === 'COMPLETED' && (m.status === 'COMPLETED' || m.status === 'ARCHIVED'));
    return matchesSearch && matchesStatus;
  });

  const totalMissions = missions.length;
  const activeMissions = missions.filter(
    (m) => m.status === 'CREATED' || m.status === 'PLANNING' || m.status === 'QUEUED' || m.status === 'EXECUTING'
  ).length;
  const completedMissions = missions.filter(
    (m) => m.status === 'COMPLETED' || m.status === 'ARCHIVED'
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-card border shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono text-xs">
              AgroSentry Autonomous Mission OS
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">Phase 1 — Mission Foundation</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2 text-foreground">
            <ListOrdered className="w-6 h-6 text-emerald-400" />
            Autonomous Mission Queue & Flight OS
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl mt-0.5">
            Single source of truth for all autonomous drone operations. Every mission holds an immutable flight ID (`AGS-2026-XXXX`), 12-stage lifecycle engine, and sustainability tracking.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create New Mission
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border bg-card/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Total Registered Missions</span>
            <Bot className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-foreground font-mono">{totalMissions}</p>
          <p className="text-[11px] text-muted-foreground">Immutable Flight Records</p>
        </Card>

        <Card className="p-4 border bg-card/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Active Operations</span>
            <Activity className="w-4 h-4 text-sky-400 animate-pulse" />
          </div>
          <p className="text-2xl font-extrabold text-sky-400 font-mono">{activeMissions}</p>
          <p className="text-[11px] text-muted-foreground">In Created / Planning / Executing State</p>
        </Card>

        <Card className="p-4 border bg-card/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Completed & Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">{completedMissions}</p>
          <p className="text-[11px] text-muted-foreground">Verified Yield Recovery</p>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID (AGS-2026-...), name, field..."
            className="pl-9 bg-background border-border text-xs focus:ring-emerald-500 h-9"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Filter:</span>
          {['ALL', 'ACTIVE', 'COMPLETED'].map((st) => (
            <Button
              key={st}
              variant={statusFilter === st ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(st)}
              className={`text-xs h-8 px-3 font-mono ${
                statusFilter === st ? 'bg-emerald-600 text-white' : 'bg-background'
              }`}
            >
              {st}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Split Content: Left Queue List (40%) / Right Details Inspector (60%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mission Cards List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Queue Records ({filteredMissions.length})
            </span>
          </div>

          {filteredMissions.length === 0 ? (
            <Card className="p-8 border bg-card text-center space-y-2 rounded-xl">
              <Bot className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-semibold text-foreground">No missions found</p>
              <p className="text-xs text-muted-foreground">Create your first mission to initialize the queue.</p>
              <Button
                size="sm"
                onClick={() => setCreateDialogOpen(true)}
                className="bg-emerald-600 text-white text-xs mt-2"
              >
                <Plus className="w-4 h-4 mr-1" /> Create Mission
              </Button>
            </Card>
          ) : (
            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {filteredMissions.map((m) => (
                <MissionCard
                  key={m.id}
                  mission={m}
                  isSelected={selectedMission?.id === m.id}
                  onSelect={(selected) => setSelectedMission(selected)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Mission Details Inspector Panel */}
        <div className="lg:col-span-7">
          {selectedMission ? (
            <MissionDetailsPanel mission={selectedMission} />
          ) : (
            <Card className="p-12 border bg-card text-center space-y-3 rounded-2xl">
              <ListOrdered className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
              <h3 className="font-semibold text-base text-foreground">No Mission Selected</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Select a mission from the queue list on the left to inspect operational specs, timeline, SDG metrics, and logs.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Create Mission Modal Dialog */}
      <CreateMissionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onMissionCreated={handleMissionCreated}
      />
    </div>
  );
}
