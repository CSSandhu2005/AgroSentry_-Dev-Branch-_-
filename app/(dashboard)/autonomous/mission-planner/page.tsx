"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Sparkles, Check, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function MissionPlannerPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("Targeted Spray");
  const [voiceLang, setVoiceLang] = useState("Hindi");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('मेरे कपास के खेत में बीमारी लग रही है, ड्रोन से छिड़काव करो');

  const templates = [
    { name: "Disease Scan", icon: "🔍", desc: "High-resolution sector inspection & pathogen heatmap." },
    { name: "Targeted Spray", icon: "🎯", desc: "Precision 5% spot spraying over infected crop zones." },
    { name: "Water Patrol", icon: "💧", desc: "NDVI irrigation stress & dry patch aerial sweep." },
    { name: "Nutrient Survey", icon: "🌱", desc: "Variable rate N-P-K spatial soil mapping." },
    { name: "Carbon Audit", icon: "🌍", desc: "CO₂ emission avoidance & fuel efficiency audit." },
    { name: "Boundary Mapping", icon: "🗺️", desc: "One-touch GPS boundary & acreage polygon generation." },
    { name: "Village Mission", icon: "🚜", desc: "Multi-farm batched community scheduling." },
    { name: "Recovery Mission", icon: "⛈️", desc: "Post-disaster flood/storm damage restoration scan." },
    { name: "Crop Health Audit", icon: "🏥", desc: "End-to-end multi-agent diagnostic run." },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-card border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Mission Engine</Badge>
            <span className="text-xs font-mono text-muted-foreground">9 Pre-Built Templates</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Mission Planner & Bharat Voice</h1>
          <p className="text-xs text-muted-foreground">
            Configure autonomous missions using pre-built templates or speak in regional languages.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Multilingual Voice Intake */}
        <Card className="p-5 border bg-card text-card-foreground shadow-sm rounded-xl lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-2">
              <Mic className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold text-sm">Bharat Voice Intake</h3>
            </div>
            <Badge variant="outline" className="text-xs">
              {voiceLang}
            </Badge>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Select Language:</label>
            <div className="flex flex-wrap gap-1.5">
              {["Hindi", "Marathi", "Punjabi", "Gujarati", "Tamil", "Telugu", "English"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setVoiceLang(lang)}
                  className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ${
                    voiceLang === lang
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                      : "bg-secondary text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-secondary/40 border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Spoken Command Preview</span>
              {isRecording && <span className="text-xs text-red-500 animate-pulse font-mono">● Listening...</span>}
            </div>
            <p className="text-sm font-medium text-foreground italic">"{voiceText}"</p>
            <Button
              onClick={() => setIsRecording(!isRecording)}
              variant={isRecording ? "destructive" : "outline"}
              className="w-full text-xs"
            >
              <Mic className="w-4 h-4 mr-2" />
              {isRecording ? "Stop Recording" : "Speak Voice Command"}
            </Button>
          </div>

          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs">
            <Sparkles className="w-4 h-4 mr-2" /> Generate Mission from Voice
          </Button>
        </Card>

        {/* Mission Templates Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold tracking-tight">Select Mission Template</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {templates.map((tpl) => {
              const isSelected = selectedTemplate === tpl.name;
              return (
                <Card
                  key={tpl.name}
                  onClick={() => setSelectedTemplate(tpl.name)}
                  className={`p-4 border shadow-sm rounded-xl cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? "bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500"
                      : "bg-card hover:bg-accent/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{tpl.icon}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <h4 className="font-semibold text-sm">{tpl.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tpl.desc}</p>
                </Card>
              );
            })}
          </div>

          {/* Parameters Form */}
          <Card className="p-5 border bg-card text-card-foreground shadow-sm rounded-xl space-y-4">
            <h4 className="font-semibold text-sm border-b pb-2">Flight Parameters & Battery Budget</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground">Flight Altitude</span>
                <div className="font-semibold text-sm">18.5 Meters</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Camera Overlap</span>
                <div className="font-semibold text-sm">80% Front / 70% Side</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Estimated Battery Use</span>
                <div className="font-semibold text-sm text-emerald-500">18% (12.4 Mins)</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium">
                Launch {selectedTemplate} Mission <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
