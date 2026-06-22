'use client';

import React, { useState } from 'react';
import { soundEngine } from '@/lib/aether-x/SoundEngine';
import { BookOpen, ShieldAlert, Cpu, Heart, CheckCircle2 } from 'lucide-react';

interface TimelineEvent {
  id: string;
  year: string;
  quarter: string;
  title: string;
  type: 'decision' | 'incident' | 'project' | 'lesson';
  summary: string;
  detail: string;
  outcome: string;
}

export const MemoryTimeline: React.FC = () => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [activeYearFilter, setActiveYearFilter] = useState<'ALL' | '2024' | '2025' | '2026'>('ALL');

  const events: TimelineEvent[] = [
    {
      id: 'e1',
      year: '2024',
      quarter: 'Q1',
      title: 'AETHER-X Brain core Approved',
      type: 'decision',
      summary: 'Executive committee signs off on neural core development.',
      detail: 'Initiated the foundation design of Aether consciousness brain engine, selecting LangGraph-orchestrated systems with a dedicated Web Audio synthesizer.',
      outcome: 'Allocated $24.5M initial seed capital; team scaled to 18 senior core units.',
    },
    {
      id: 'e2',
      year: '2024',
      quarter: 'Q3',
      title: 'Thermal Core Reactor Methane Leak',
      type: 'incident',
      summary: 'Auxiliary cooling line experiences pressure drop.',
      detail: 'A micro gasket seal degraded near reactor cell B1, releasing minor gas volumes. Night-shift skeletal staff evacuated zone in 12 minutes.',
      outcome: 'Drafted Reactor Containment Protocol. Upgraded all sensors to continuous class-7 seals.',
    },
    {
      id: 'e3',
      year: '2025',
      quarter: 'Q1',
      title: 'Scrubber Filter Membrane Install',
      type: 'project',
      summary: 'Completed environmental hybrid upgrade project.',
      detail: 'Installed cryogenic carbon capture filters, dropping carbon output below regulatory target ceilings.',
      outcome: 'Ensured 100% compliance audit readiness, evading EPA daily fines.',
    },
    {
      id: 'e4',
      year: '2025',
      quarter: 'Q4',
      title: 'Apex Logistics Cyber Intrusion',
      type: 'incident',
      summary: 'Ransomware threat compromises WAN transit routers.',
      detail: 'State-sponsored threat actors targeted trade servers. Quantum encryption protocols isolated traffic in Sector 9 within 40 seconds.',
      outcome: 'Developed alternative Southern Route channel mapping. Zero data leaked.',
    },
    {
      id: 'e5',
      year: '2026',
      quarter: 'Q2',
      title: 'AETHER Consciousness Engine Live',
      type: 'project',
      summary: 'Operating system deployed in full production.',
      detail: 'Merged Palantir graph ontologies, NASA dashboard cockpit, and real-time Doctor Strange Branching Time Machine.',
      outcome: 'System operates at 60 FPS under Next.js 16. Wowing elite recruiters in 5 seconds.',
    },
  ];

  const selectEvent = (id: string) => {
    setSelectedEventId(id);
    soundEngine.playClick();
  };

  const selectFilter = (year: 'ALL' | '2024' | '2025' | '2026') => {
    setActiveYearFilter(year);
    soundEngine.playCyberSweep();
  };

  const filteredEvents = events.filter(
    (e) => activeYearFilter === 'ALL' || e.year === activeYearFilter
  );

  const activeEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div className="w-full h-full text-slate-100 flex flex-col p-6 overflow-hidden relative">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-cyan-400 font-mono">
            ENTERPRISE HISTORICAL MEMORY TIMELINE // COGNITIVE LOGS
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            RETROSPECTIVE OUTCOME AUDITS // ZOOM EPOCH MATRIX
          </p>
        </div>

        {/* Filters */}
        <div className="flex space-x-2">
          {(['ALL', '2024', '2025', '2026'] as const).map((y) => (
            <button
              key={y}
              onClick={() => selectFilter(y)}
              className={`px-3 py-1 font-mono text-xs rounded border transition-colors ${
                activeYearFilter === y
                  ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Side: Infinite Horizontal Flow Timeline */}
        <div className="col-span-12 lg:col-span-8 glass-panel border-cyan-500/10 bg-slate-950/20 p-6 flex flex-col justify-center min-h-[350px] relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-overlay opacity-5 pointer-events-none" />

          {/* Scrolling deck */}
          <div className="flex overflow-x-auto space-x-6 pb-6 pt-4 scrollbar-thin select-none relative z-10">
            {/* Center line running behind cards */}
            <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-gradient-to-r from-cyan-500/5 via-cyan-500/40 to-cyan-500/5 transform -translate-y-1/2 z-0 pointer-events-none" />

            {filteredEvents.map((e) => {
              const isSelected = selectedEventId === e.id;
              let borderClass = 'border-slate-800';
              let badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';

              if (e.type === 'incident') {
                borderClass = 'border-rose-500/30 hover:border-rose-500/60';
                badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
              } else if (e.type === 'decision') {
                borderClass = 'border-cyan-500/30 hover:border-cyan-500/60';
                badgeColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
              } else if (e.type === 'project') {
                borderClass = 'border-emerald-500/30 hover:border-emerald-500/60';
                badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
              }

              if (isSelected) {
                borderClass = 'border-cyan-400 ring-2 ring-cyan-400/20';
              }

              return (
                <div
                  key={e.id}
                  onClick={() => selectEvent(e.id)}
                  className={`w-72 shrink-0 glass-panel p-4 cursor-pointer transition-all duration-300 relative z-10 flex flex-col h-[200px] justify-between ${
                    isSelected ? 'bg-slate-900' : 'bg-slate-950/70 hover:scale-102'
                  } ${borderClass}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[9px] text-slate-400">{e.year} // {e.quarter}</span>
                      <span className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded border ${badgeColor}`}>
                        {e.type}
                      </span>
                    </div>
                    <h4 className="font-mono text-xs font-bold text-white leading-snug">{e.title}</h4>
                  </div>

                  <p className="text-[11px] text-slate-400 font-mono leading-relaxed mt-2 line-clamp-3">
                    {e.summary}
                  </p>

                  <div className="mt-4 text-[9px] font-mono text-cyan-400 flex items-center justify-end">
                    <span>EXPLORE DETAILS ▶</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Selected event metadata audit */}
        <div className="col-span-12 lg:col-span-4 flex flex-col space-y-6">
          <div className="glass-panel border-cyan-500/20 p-5 flex flex-col flex-1 bg-slate-950/50">
            {activeEvent ? (
              <div className="space-y-4">
                <div className="border-b border-slate-800/80 pb-4">
                  <span className="font-mono text-[9px] text-cyan-400 tracking-widest uppercase">HISTORICAL OUTCOME AUDIT</span>
                  <h3 className="text-md font-bold text-white font-mono mt-1">{activeEvent.title}</h3>
                  <div className="mt-2 inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-900 text-slate-300">
                    EPOCH: {activeEvent.year} // {activeEvent.quarter}
                  </div>
                </div>

                <div className="space-y-2 select-text">
                  <span className="font-mono text-[9px] text-slate-400 block uppercase">EVENT CHRONICLE</span>
                  <p className="font-mono text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800/60">
                    {activeEvent.detail}
                  </p>
                </div>

                <div className="space-y-2 select-text">
                  <span className="font-mono text-[9px] text-slate-400 block uppercase">MITIGATION OUTCOME</span>
                  <p className="font-mono text-xs text-emerald-400 leading-relaxed bg-emerald-500/5 p-3 rounded border border-emerald-500/10">
                    {activeEvent.outcome}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center font-mono text-xs text-slate-400 p-4">
                <BookOpen className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
                SELECT ANY CHRONICLED TIMELINE CARD TO AUDIT CORE DECISIONS, INCIDENTS, AND RETROSPECTIVE RETRIEVED OUTCOMES
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryTimeline;
