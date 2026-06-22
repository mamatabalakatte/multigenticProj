'use client';

import React, { useState } from 'react';
import { soundEngine } from '@/lib/aether-x/SoundEngine';
import { RefreshCw, Play, ShieldAlert, Cpu, Heart, CheckCircle2 } from 'lucide-react';

interface Scenario {
  id: string;
  question: string;
  mitigationBranch: {
    title: string;
    financialImpact: string;
    operationalImpact: string;
    riskScore: number;
    description: string;
  };
  catastropheBranch: {
    title: string;
    financialImpact: string;
    operationalImpact: string;
    riskScore: number;
    description: string;
  };
}

export const TimeMachine: React.FC = () => {
  const scenarios: Scenario[] = [
    {
      id: 'supplier-fail',
      question: 'What if supplier Apex Logistics fails entirely?',
      mitigationBranch: {
        title: 'Southern Channel Backup Route (Active)',
        financialImpact: '-$4.2M CapEx',
        operationalImpact: '+4.2 days transit latency',
        riskScore: 12,
        description: 'Dispatches standby vessels via southern corridor. Legal tariff disaster exemptions activate immediately.',
      },
      catastropheBranch: {
        title: 'Unmitigated Grid Lockout (Default)',
        financialImpact: '-$28.5M CapEx',
        operationalImpact: 'Indefinite assembly shutdown',
        riskScore: 87,
        description: 'Primary corridor gridlock causes material supply exhaustion at manufacturing centers within 72 hours.',
      },
    },
    {
      id: 'compliance-fail',
      question: 'What if compliance audit fails due to carbon output?',
      mitigationBranch: {
        title: 'Dispatched Hydrogen Hybrid Scrubbers',
        financialImpact: '-$1.8M CapEx',
        operationalImpact: '0 hours downtime',
        riskScore: 18,
        description: 'Toggles carbon capture filter membranes. Factory load balance throttled by 10% to stay under regulatory threshold.',
      },
      catastropheBranch: {
        title: 'Regulatory Audit Blockage',
        financialImpact: '-$14.0M Fines',
        operationalImpact: '3-week compliance freeze',
        riskScore: 78,
        description: 'EPA enforcement levies maximum regulatory daily penalties, halting European operations entirely.',
      },
    },
    {
      id: 'seismic-fail',
      question: 'What if seismic tremors exceed Richter 5.0?',
      mitigationBranch: {
        title: 'Seismic Dampeners Triggered',
        financialImpact: '-$8.2M repair cost',
        operationalImpact: '36 hours check downtime',
        riskScore: 24,
        description: 'Containment shields decouple and float on mechanical magnetic pads, preventing structural foundation cracking.',
      },
      catastropheBranch: {
        title: 'Core Breach Cascade',
        financialImpact: '-$92.0M loss',
        operationalImpact: '6-month decommissioning',
        riskScore: 99,
        description: 'Reactor core foundation fractures, triggering thermal runaway loop. Primary storage vaults quarantine breach.',
      },
    },
  ];

  const [selectedScenarioId, setSelectedScenarioId] = useState('supplier-fail');
  const [selectedBranch, setSelectedBranch] = useState<'mitigated' | 'catastrophe'>('mitigated');

  const activeScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];
  const branchData =
    selectedBranch === 'mitigated'
      ? activeScenario.mitigationBranch
      : activeScenario.catastropheBranch;

  const selectScenario = (id: string) => {
    setSelectedScenarioId(id);
    soundEngine.playCyberSweep();
  };

  const selectBranch = (branch: 'mitigated' | 'catastrophe') => {
    setSelectedBranch(branch);
    if (branch === 'catastrophe') {
      soundEngine.playAlert();
    } else {
      soundEngine.playClick();
    }
  };

  return (
    <div className="w-full h-full text-slate-100 flex flex-col p-6 overflow-hidden relative">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-cyan-400 font-mono">
            TIME MACHINE SIMULATOR // MULTIVERSE FORECASTER
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            FORECAST BRANCHING FUTURE PATHWAYS // DOCTOR STRANGE TIMELINE MATRIX
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Side: Select Prompt */}
        <div className="col-span-12 lg:col-span-4 flex flex-col space-y-4">
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block">
            HYPOTHETICAL DISASTER PROMPTS
          </span>
          <div className="space-y-3">
            {scenarios.map((s) => {
              const isSelected = s.id === selectedScenarioId;
              return (
                <div
                  key={s.id}
                  onClick={() => selectScenario(s.id)}
                  className={`p-4 rounded border cursor-pointer transition-all duration-300 font-mono text-xs ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/40 text-white'
                      : 'bg-slate-950/20 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p>{s.question}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Branching Timeline Splits (Visual SVG) */}
        <div className="col-span-12 lg:col-span-4 glass-panel border-cyan-500/10 bg-slate-950/30 p-5 flex flex-col items-center justify-between min-h-[350px]">
          <span className="font-mono text-[9px] text-purple-400 tracking-widest uppercase">BRANCHING EVENT TIMELINE</span>

          {/* Splitting Branches SVG */}
          <div className="relative w-full flex-1 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full max-h-[250px] select-none">
              {/* Origin root node */}
              <circle cx="30" cy="100" r="8" fill="#3b82f6" />
              <line x1="30" y1="100" x2="80" y2="100" stroke="#3b82f6" strokeWidth="2" />
              <text x="30" y="85" fill="#3b82f6" fontSize="8px" textAnchor="middle" fontFamily="var(--font-mono)">
                ORIGIN (NOW)
              </text>

              {/* Mitigation Route (Upper Green branch) */}
              <path
                d="M 80 100 Q 110 50 160 50"
                fill="none"
                stroke={selectedBranch === 'mitigated' ? '#10b981' : 'rgba(16, 185, 129, 0.2)'}
                strokeWidth={selectedBranch === 'mitigated' ? 3.5 : 1.5}
                className="transition-all duration-300 cursor-pointer"
                onClick={() => selectBranch('mitigated')}
              />
              <circle
                cx="160"
                cy="50"
                r="7"
                fill="#10b981"
                className="cursor-pointer"
                onClick={() => selectBranch('mitigated')}
              />
              <text
                x="160"
                y="35"
                fill={selectedBranch === 'mitigated' ? '#10b981' : '#94a3b8'}
                fontSize="8px"
                fontWeight={selectedBranch === 'mitigated' ? 'bold' : 'normal'}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                className="cursor-pointer"
                onClick={() => selectBranch('mitigated')}
              >
                SECURED BRANCH
              </text>

              {/* Catastrophe Route (Lower Red branch) */}
              <path
                d="M 80 100 Q 110 150 160 150"
                fill="none"
                stroke={selectedBranch === 'catastrophe' ? '#ef4444' : 'rgba(239, 68, 68, 0.2)'}
                strokeWidth={selectedBranch === 'catastrophe' ? 3.5 : 1.5}
                className="transition-all duration-300 cursor-pointer"
                onClick={() => selectBranch('catastrophe')}
              />
              <circle
                cx="160"
                cy="150"
                r="7"
                fill="#ef4444"
                className="cursor-pointer"
                onClick={() => selectBranch('catastrophe')}
              />
              <text
                x="160"
                y="168"
                fill={selectedBranch === 'catastrophe' ? '#ef4444' : '#94a3b8'}
                fontSize="8px"
                fontWeight={selectedBranch === 'catastrophe' ? 'bold' : 'normal'}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                className="cursor-pointer"
                onClick={() => selectBranch('catastrophe')}
              >
                CATASTROPHE BRANCH
              </text>
            </svg>
          </div>

          <div className="w-full flex space-x-2">
            <button
              onClick={() => selectBranch('mitigated')}
              className={`flex-1 py-1.5 font-mono text-[10px] rounded border uppercase tracking-wider transition-colors ${
                selectedBranch === 'mitigated'
                  ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              CHOOSE SECURED
            </button>
            <button
              onClick={() => selectBranch('catastrophe')}
              className={`flex-1 py-1.5 font-mono text-[10px] rounded border uppercase tracking-wider transition-colors ${
                selectedBranch === 'catastrophe'
                  ? 'bg-rose-500/10 border-rose-400 text-rose-400 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              CHOOSE CATASTROPHE
            </button>
          </div>
        </div>

        {/* Right Side: Selected Branch Detail Diagnostics */}
        <div className="col-span-12 lg:col-span-4 flex flex-col space-y-6">
          <div className="glass-panel border-cyan-500/20 p-5 flex flex-col flex-1 bg-slate-950/50">
            <div className="border-b border-slate-800/80 pb-4 mb-4">
              <span className="font-mono text-[9px] text-cyan-400 tracking-widest uppercase">MULTIVERSE PROGNOSTIC</span>
              <h3 className="text-md font-bold text-white font-mono mt-1">{branchData.title}</h3>
            </div>

            {/* Matrix details */}
            <div className="grid grid-cols-2 gap-4 mb-4 font-mono">
              <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded">
                <span className="text-[9px] text-slate-400 block mb-1">FINANCIAL IMPACT</span>
                <span className={`text-sm font-bold ${selectedBranch === 'mitigated' ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {branchData.financialImpact}
                </span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded">
                <span className="text-[9px] text-slate-400 block mb-1">OP TIME DOWN</span>
                <span className={`text-sm font-bold ${selectedBranch === 'mitigated' ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {branchData.operationalImpact}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <span className="font-mono text-[9px] text-slate-400 block mb-1 uppercase">REMAINING RISK THREAT</span>
              <div className="w-full bg-slate-900/80 border border-slate-800 p-3 rounded flex items-center justify-between font-mono">
                <span className="text-xs text-white">REMAINING RISK:</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  branchData.riskScore < 30 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
                }`}>
                  {branchData.riskScore}%
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto select-text">
              <span className="font-mono text-[9px] text-slate-400 block mb-2 uppercase">BRANCH PATHWAY SUMMARY</span>
              <p className="font-mono text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800/60">
                {branchData.description}
              </p>
            </div>

            <button
              onClick={() => {
                soundEngine.playLaunch();
                alert(`Executed core state transformation path: [${branchData.title.toUpperCase()}]`);
              }}
              className="w-full mt-4 py-2.5 font-mono text-xs font-bold rounded border uppercase tracking-wider bg-cyan-500 hover:bg-cyan-600 text-slate-950 border-cyan-600 transition-colors"
            >
              DEPLOY TIMELINE DECISION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeMachine;
