'use client';

import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '@/lib/aether-x/SoundEngine';
import { ShieldCheck, MessageSquare, Award, Play, Pause, ChevronRight } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  avatarShape: string;
  confidence: number;
  evidence: string[];
}

interface DialogueLine {
  agentId: string;
  text: string;
  evidenceRef?: string;
  isCounter?: boolean;
}

export const AgentCouncil: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeDialogueIndex, setActiveDialogueIndex] = useState(0);
  const [debateTopic, setDebateTopic] = useState(
    'CRITICAL DECISION: Supply-Chain Relocation due to Impending Cyber Threats & Seismic Risk'
  );

  const agents: Agent[] = [
    {
      id: 'ceo',
      name: 'AETHER CEO Agent',
      role: 'Executive Conciliator',
      avatarColor: 'from-cyan-400 to-blue-500',
      avatarShape: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
      confidence: 96,
      evidence: ['Global Threat Map SEC-A', 'H1 Macro Financial Model'],
    },
    {
      id: 'finance',
      name: 'QUANT Finance Agent',
      role: 'Capital Allocator',
      avatarColor: 'from-emerald-400 to-teal-500',
      avatarShape: 'circle(50% at 50% 50%)',
      confidence: 88,
      evidence: ['Supply Chain CapEx Spreadsheets', 'Inflationary Vector Forecast'],
    },
    {
      id: 'ops',
      name: 'CHRONOS Operations Agent',
      role: 'Logistics Optimizer',
      avatarColor: 'from-amber-400 to-orange-500',
      avatarShape: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      confidence: 91,
      evidence: ['Vessel Transit Logs Q2', 'Alternative Route Analysis'],
    },
    {
      id: 'safety',
      name: 'THERMAL Safety Agent',
      role: 'Hazard Auditor',
      avatarColor: 'from-red-400 to-rose-500',
      avatarShape: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
      confidence: 95,
      evidence: ['Seismic Stress Test Vault C', 'Hydrogen Safety Registry'],
    },
    {
      id: 'compliance',
      name: 'LEXIS Compliance Agent',
      role: 'Regulatory Watchdog',
      avatarColor: 'from-indigo-400 to-purple-500',
      avatarShape: 'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)',
      confidence: 99,
      evidence: ['Trade Tariff Code 2026', 'Federal Environmental Mandate'],
    },
    {
      id: 'cyber',
      name: 'SHIELD Cyber Agent',
      role: 'Intrusion Coordinator',
      avatarColor: 'from-fuchsia-400 to-pink-500',
      avatarShape: 'polygon(0% 15%, 15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%)',
      confidence: 94,
      evidence: ['DDOS Vector logs Sector 9', 'Quantum Key Integrity Report'],
    },
  ];

  const dialogue: DialogueLine[] = [
    {
      agentId: 'ceo',
      text: 'Council, we are evaluating the operational threat in Sector 9. Global satellite feeds signal a seismic threat probability of 82% within the supply route corridor, combined with a ransomware attack path. Let us determine our action matrix.',
      evidenceRef: 'Global Threat Map SEC-A',
    },
    {
      agentId: 'cyber',
      text: 'Primary threat path identified: State-backed group targeting Apex logistics gateways. If we maintain current trade networks, cyber exposure elevates to 94% within 14 days.',
      evidenceRef: 'DDOS Vector logs Sector 9',
    },
    {
      agentId: 'ops',
      text: 'Operations recommends a reroute through the southern channel. Transit latency will increase by 4.2 days, but risk exposure falls to nominal levels.',
      evidenceRef: 'Alternative Route Analysis',
    },
    {
      agentId: 'finance',
      text: 'Rerouting CapEx impact is estimated at $4.2M. While operations ensures safety, this relocation reduces Q3 profit margin by 1.85%. Can compliance validate this?',
      evidenceRef: 'Supply Chain CapEx Spreadsheets',
      isCounter: true,
    },
    {
      agentId: 'compliance',
      text: 'Verified. Tariff code Section 12.4 allows a disaster tax exemption if seismic threat exceeds 80%. Rerouting satisfies the legal thresholds completely.',
      evidenceRef: 'Trade Tariff Code 2026',
    },
    {
      agentId: 'safety',
      text: 'Approved. Maintaining the current route near the tectonic fault violates Reactor Containment Protocol safety thresholds. Moving is mandatory.',
      evidenceRef: 'Seismic Stress Test Vault C',
    },
    {
      agentId: 'ceo',
      text: 'Consensus achieved. 5 of 6 council units advocate immediate corridor relocation. SHIELD Cyber Agent, activate quantum traffic encryption. Ops, reroute vessels.',
      evidenceRef: 'H1 Macro Financial Model',
    },
  ];

  // Auto progression of debate
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setActiveDialogueIndex((prev) => {
        const next = (prev + 1) % dialogue.length;
        // Trigger distinct beep sound on dialog progress
        if (dialogue[next].isCounter) {
          soundEngine.playAlert();
        } else {
          soundEngine.playClick();
        }
        return next;
      });
    }, 6000);

    return () => clearTimeout(timer);
  }, [activeDialogueIndex, isPlaying]);

  const toggleDebate = () => {
    setIsPlaying(!isPlaying);
    soundEngine.playClick();
  };

  const nextStep = () => {
    setActiveDialogueIndex((prev) => (prev + 1) % dialogue.length);
    soundEngine.playClick();
  };

  const activeLine = dialogue[activeDialogueIndex];
  const speakingAgent = agents.find((a) => a.id === activeLine.agentId) || agents[0];

  return (
    <div className="w-full h-full text-slate-100 flex flex-col p-6 overflow-hidden relative">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-cyan-400 font-mono">
            AI AGENT COUNCIL // ROUNDTABLE DEBATE
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1 font-bold">
            TOPIC: {debateTopic}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleDebate}
            className="p-2 rounded bg-slate-900 border border-cyan-500/20 hover:border-cyan-400 text-cyan-400 flex items-center space-x-1 font-mono text-xs hover:bg-cyan-500/10 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>PAUSE DEBATE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>PLAY DEBATE</span>
              </>
            )}
          </button>
          <button
            onClick={nextStep}
            className="p-2 rounded bg-slate-900 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-cyan-400"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Side: Circular Council Chamber HUD */}
        <div className="col-span-12 lg:col-span-6 glass-panel border-cyan-500/10 bg-slate-950/20 relative flex items-center justify-center p-6 min-h-[400px]">
          {/* Radial grid ring overlay */}
          <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent pointer-events-none" />

          {/* Chamber SVG drawing */}
          <svg viewBox="0 0 400 400" className="w-full h-full max-h-[380px] relative z-10 select-none">
            {/* Center table rings */}
            <circle cx="200" cy="200" r="110" fill="none" stroke="rgba(0, 229, 255, 0.08)" strokeWidth="2" />
            <circle cx="200" cy="200" r="70" fill="none" stroke="rgba(147, 51, 234, 0.1)" strokeWidth="1" />
            <circle cx="200" cy="200" r="40" fill="none" stroke="rgba(0, 229, 255, 0.15)" strokeDasharray="3,6" />

            {/* Glowing lines mapping active conversation */}
            {isPlaying && (
              <g>
                <circle cx="200" cy="200" r="2" fill="#00e5ff" className="animate-ping" />
                {/* Draw connection line from center to active agent */}
                {(() => {
                  const idx = agents.findIndex((a) => a.id === speakingAgent.id);
                  const angle = (idx * 2 * Math.PI) / agents.length - Math.PI / 2;
                  const ax = 200 + Math.cos(angle) * 125;
                  const ay = 200 + Math.sin(angle) * 125;

                  return (
                    <line
                      x1="200"
                      y1="200"
                      x2={ax}
                      y2={ay}
                      stroke="#00e5ff"
                      strokeWidth="2.5"
                      strokeOpacity="0.8"
                      strokeDasharray="4,4"
                      className="animate-pulse"
                    />
                  );
                })()}
              </g>
            )}

            {/* Render Agent seats around the table */}
            {agents.map((agent, index) => {
              const angle = (index * 2 * Math.PI) / agents.length - Math.PI / 2;
              const x = 200 + Math.cos(angle) * 125;
              const y = 200 + Math.sin(angle) * 125;
              const isSpeaking = speakingAgent.id === agent.id;

              return (
                <g key={agent.id} className="cursor-pointer" onClick={() => {
                  soundEngine.playClick();
                  // Jump to dialogue line of that agent
                  const dIdx = dialogue.findIndex(d => d.agentId === agent.id);
                  if (dIdx !== -1) setActiveDialogueIndex(dIdx);
                }}>
                  {/* Outer Pulsing highlight if speaking */}
                  {isSpeaking && (
                    <circle
                      cx={x}
                      cy={y}
                      r="26"
                      fill="none"
                      stroke="#00e5ff"
                      strokeWidth="2.5"
                      className="animate-ping"
                      style={{ transformOrigin: `${x}px ${y}px` }}
                    />
                  )}

                  {/* Seat base shadow */}
                  <circle cx={x} cy={y} r="20" fill="#090c12" stroke={isSpeaking ? '#00e5ff' : 'rgba(0, 229, 255, 0.2)'} strokeWidth="2" />

                  {/* Geometric custom SVG Avatar representation */}
                  <g transform={`translate(${x - 12}, ${y - 12})`}>
                    <circle cx="12" cy="12" r="10" fill={`url(#grad-${agent.id})`} />
                    <text x="12" y="15" fill="#ffffff" fontSize="9px" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">
                      {agent.id.substring(0, 2).toUpperCase()}
                    </text>
                  </g>

                  {/* HTML Gradients for filling nodes */}
                  <defs>
                    <linearGradient id={`grad-${agent.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" className="stop-cyan-400" stopColor={isSpeaking ? '#00e5ff' : '#1e293b'} />
                      <stop offset="100%" className="stop-blue-500" stopColor={isSpeaking ? '#9333ea' : '#0f172a'} />
                    </linearGradient>
                  </defs>

                  {/* Label shorthand */}
                  <text
                    x={x}
                    y={y + 35}
                    fill={isSpeaking ? '#00e5ff' : '#94a3b8'}
                    fontSize="9px"
                    fontWeight={isSpeaking ? 'bold' : 'normal'}
                    fontFamily="var(--font-mono)"
                    textAnchor="middle"
                  >
                    {agent.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Side: Active Debate Transcript & Agent Profile Cards */}
        <div className="col-span-12 lg:col-span-6 flex flex-col space-y-6">
          {/* Active Speaking Dialogue Bubble */}
          <div className="glass-panel border-cyan-500/20 p-5 flex flex-col bg-slate-950/50 relative">
            <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3 mb-3">
              <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${speakingAgent.avatarColor} animate-pulse`} />
              <div>
                <h3 className="text-sm font-bold font-mono text-white uppercase">{speakingAgent.name}</h3>
                <span className="text-[10px] text-cyan-400 font-mono">{speakingAgent.role}</span>
              </div>
            </div>

            {/* Bubble text */}
            <div className="my-2 select-text">
              <p className="font-sans text-sm text-slate-200 leading-relaxed italic">
                "{activeLine.text}"
              </p>
            </div>

            {/* Evidence & stats strip */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3 text-xs font-mono">
              <div className="flex items-center space-x-1.5 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Evidence Ref:</span>
                <span className="text-cyan-300">{activeLine.evidenceRef}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Confidence:</span>
                <span className="text-emerald-400 font-bold">{speakingAgent.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Full Conversation History Log */}
          <div className="glass-panel border-slate-800 bg-slate-950/70 p-4 flex flex-col flex-1 h-[200px]">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>LIVE ROUNDTABLE TRANSCRIPT</span>
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 select-text">
              {dialogue.map((line, idx) => {
                const ag = agents.find((a) => a.id === line.agentId) || agents[0];
                const isCurrent = idx === activeDialogueIndex;

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded border transition-all text-xs font-mono ${
                      isCurrent
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-white'
                        : 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 text-[10px]">
                      <span className={`font-bold ${isCurrent ? 'text-cyan-400' : 'text-slate-300'}`}>
                        {ag.name}
                      </span>
                      {line.isCounter && (
                        <span className="text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded text-[8px] border border-rose-500/20">
                          COUNTER-ARGUMENT
                        </span>
                      )}
                    </div>
                    <p className="font-sans leading-relaxed">{line.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCouncil;
