'use client';

import React, { useState, useEffect } from 'react';
import { soundEngine } from '@/lib/aether-x/SoundEngine';
import { Flame, ShieldAlert, DollarSign, Clock, CheckCircle } from 'lucide-react';

interface ThreatFactor {
  id: string;
  name: string;
  weight: number;
  description: string;
  category: 'operational' | 'environmental' | 'human';
}

export const BlackSwan: React.FC = () => {
  const factors: ThreatFactor[] = [
    { id: 'gas', name: 'Gas / Methane Leak Detection', weight: 45, description: 'Trace methane levels detected near reactor seals.', category: 'environmental' },
    { id: 'maint', name: 'Active Maintenance Window', weight: 15, description: 'Rotor bypasses open, safety inhibitors manually overridden.', category: 'operational' },
    { id: 'shift', name: 'Night Shift Skeletal Staffing', weight: 12, description: 'Control desk staffed at 25% occupancy.', category: 'human' },
    { id: 'surge', name: 'Power Grid Surge Fluctuations', weight: 22, description: 'Primary power line spikes from external grid gridlocks.', category: 'operational' },
    { id: 'seismic', name: 'Micro Seismic Tremors (Richter 3.2)', weight: 35, description: 'Subsurface vibrations detected beneath reactor bunker.', category: 'environmental' },
    { id: 'cool', name: 'Cooling Hub Bypasses Closed', weight: 28, description: 'Auxiliary cooling line pressure valve failing.', category: 'operational' },
  ];

  const [selectedIds, setSelectedIds] = useState<string[]>(['gas', 'maint', 'shift']);
  const [riskPercent, setRiskPercent] = useState(0);
  const [impactLoss, setImpactLoss] = useState(0);
  const [threatStatus, setThreatStatus] = useState<'nominal' | 'elevated' | 'severe' | 'catastrophic'>('elevated');

  // Recalculate threat metrics whenever triggers change
  useEffect(() => {
    let rawScore = 0;
    selectedIds.forEach((id) => {
      const f = factors.find((x) => x.id === id);
      if (f) rawScore += f.weight;
    });

    // Normalize risk between 0 and 100 with exponential risk scaling for compounding triggers
    const triggerCount = selectedIds.length;
    const compoundFactor = triggerCount > 1 ? 1 + (triggerCount - 1) * 0.15 : 1;
    const finalRisk = Math.min(Math.round(rawScore * compoundFactor), 100);

    setRiskPercent(finalRisk);

    // Project financial CapEx losses (in Millions)
    const loss = ((finalRisk * finalRisk) / 600).toFixed(1);
    setImpactLoss(parseFloat(loss));

    // Determine warning status
    if (finalRisk < 25) {
      setThreatStatus('nominal');
    } else if (finalRisk < 55) {
      setThreatStatus('elevated');
    } else if (finalRisk < 80) {
      setThreatStatus('severe');
      soundEngine.playBeep(900, 0.1, 'sawtooth');
    } else {
      setThreatStatus('catastrophic');
      soundEngine.playAlert();
    }
  }, [selectedIds]);

  const toggleFactor = (id: string) => {
    setSelectedIds((prev) => {
      let next;
      if (prev.includes(id)) {
        next = prev.filter((x) => x !== id);
        soundEngine.playClick();
      } else {
        next = [...prev, id];
        soundEngine.playCyberSweep();
      }
      return next;
    });
  };

  return (
    <div className="w-full h-full text-slate-100 flex flex-col p-6 overflow-hidden relative">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-cyan-400 font-mono">
            BLACK SWAN SIMULATOR // COMPOUNDING RISK MATRICES
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            SIMULATE EXOTIC TAIL-EVENTS & CORRELATION BREAKDOWNS
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Side: Compounding Triggers Selection */}
        <div className="col-span-12 lg:col-span-6 flex flex-col space-y-4 max-h-[500px] overflow-y-auto pr-1">
          <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
            SELECT ACTIVE THREAT TRIGGERS
          </h3>

          {factors.map((f) => {
            const isActive = selectedIds.includes(f.id);

            return (
              <div
                key={f.id}
                onClick={() => toggleFactor(f.id)}
                className={`p-4 rounded border cursor-pointer transition-all duration-300 flex items-start justify-between relative overflow-hidden select-none ${
                  isActive
                    ? 'bg-slate-900 border-cyan-500/40 shadow shadow-cyan-500/10'
                    : 'bg-slate-950/20 border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400" />
                )}

                <div className="space-y-1 pr-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                      f.category === 'environmental' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : f.category === 'operational' 
                        ? 'bg-blue-500/10 text-blue-400' 
                        : 'bg-purple-500/10 text-purple-400'
                    }`}>
                      {f.category}
                    </span>
                    <h4 className="font-mono text-xs font-bold text-white">{f.name}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400">{f.description}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="font-mono text-xs text-slate-400 font-medium">+{f.weight}% risk</span>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    isActive ? 'border-cyan-400 bg-cyan-500/10 text-cyan-400' : 'border-slate-800'
                  }`}>
                    {isActive && <span className="text-[10px]">✔</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Risk Dial & Prognosis */}
        <div className="col-span-12 lg:col-span-6 flex flex-col space-y-6">
          <div className="glass-panel border-cyan-500/20 p-5 flex flex-col items-center bg-slate-950/50 justify-center text-center relative overflow-hidden">
            {/* Pulsing warning aura behind Dial */}
            <div className={`absolute w-48 h-48 rounded-full filter blur-[50px] mix-blend-screen opacity-10 transition-colors pointer-events-none ${
              threatStatus === 'nominal'
                ? 'bg-emerald-500'
                : threatStatus === 'elevated'
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`} />

            <span className="font-mono text-[9px] text-slate-400 tracking-widest uppercase mb-1">AGGREGATED FAILURE RISK</span>
            
            {/* Giant pulsing risk dial */}
            <div className="relative w-48 h-48 my-3 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={
                    threatStatus === 'nominal'
                      ? '#10b981'
                      : threatStatus === 'elevated'
                      ? '#f59e0b'
                      : '#ef4444'
                  }
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * riskPercent) / 100}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span className={`text-4xl font-bold tracking-tighter ${
                  threatStatus === 'nominal'
                    ? 'text-emerald-400'
                    : threatStatus === 'elevated'
                    ? 'text-amber-400'
                    : 'text-rose-500 animate-pulse'
                }`}>
                  {riskPercent}%
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  {threatStatus}
                </span>
              </div>
            </div>

            {/* Simulated Loss / Metrics */}
            <div className="grid grid-cols-2 gap-4 w-full font-mono mt-2">
              <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded flex items-center justify-center space-x-2">
                <DollarSign className="w-4 h-4 text-cyan-400" />
                <div className="text-left">
                  <span className="text-[9px] text-slate-400 block uppercase">Projected Loss</span>
                  <span className="text-xs font-bold text-white">${impactLoss}M CapEx</span>
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded flex items-center justify-center space-x-2">
                <Flame className="w-4 h-4 text-purple-400 animate-bounce" />
                <div className="text-left">
                  <span className="text-[9px] text-slate-400 block uppercase">Threat Index</span>
                  <span className="text-xs font-bold text-white">Class-{selectedIds.length} Hazard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Event Horizon Timeline Forecast */}
          <div className="glass-panel border-slate-800 bg-slate-950/70 p-4 flex flex-col flex-1 min-h-[140px]">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>BLACK SWAN COMPOUNDING FORECAST TIMELINE</span>
            </h3>

            {selectedIds.length > 0 ? (
              <div className="flex-1 font-mono text-[10px] text-slate-400 flex flex-col justify-between space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping shrink-0" />
                  <p>
                    <span className="text-cyan-400 font-bold">Hour 0 (Trigger Event):</span> Triggers synchronized. Initial hazard envelope established.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${riskPercent > 50 ? 'bg-amber-400' : 'bg-slate-800'}`} />
                  <p>
                    <span className="text-slate-200">Hour 2 (Warning Phase):</span> Overload anomalies propagate into safety valves.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${riskPercent > 80 ? 'bg-rose-500 animate-ping' : 'bg-slate-800'}`} />
                  <p>
                    <span className="text-slate-200">Hour 6 (Catastrophic Breach):</span> Tectonic stress compromises reactor vessel integrity. Predicted failure occurs.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center font-mono text-[11px] text-slate-500">
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                SYSTEM COLD NOMINAL. NO COMPOUNDING FACTORS LOADED.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlackSwan;
