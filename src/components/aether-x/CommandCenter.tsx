'use client';

import React, { useState, useEffect } from 'react';
import { soundEngine } from '@/lib/aether-x/SoundEngine';
import { Activity, ShieldAlert, Cpu, Heart, TrendingUp, AlertTriangle, ShieldCheck, Truck } from 'lucide-react';

interface PanelState {
  title: string;
  icon: any;
  value: string;
  trend: string;
  status: 'nominal' | 'warning' | 'critical';
  logs: string[];
}

export const CommandCenter: React.FC = () => {
  const [panels, setPanels] = useState<PanelState[]>([
    {
      title: 'Operations Room',
      icon: Cpu,
      value: '98.4% Efficiency',
      trend: '+1.2%',
      status: 'nominal',
      logs: ['[AETHER] Cluster Theta operating at full cap', '[OPS] Autonomous logistics route optimized', '[SYS] Node thermal core stabilized'],
    },
    {
      title: 'Finance Matrix',
      icon: TrendingUp,
      value: '$48.2M Free Cash Flow',
      trend: '+4.8%',
      status: 'nominal',
      logs: ['[FIN] DCF model recalculation triggered', '[FIN] Arbitrage bots executing trade vectors', '[SYS] Cash-to-debt ratio optimal'],
    },
    {
      title: 'Risk Assessor',
      icon: ShieldAlert,
      value: 'Risk Level: Low (12%)',
      trend: '-2.4%',
      status: 'nominal',
      logs: ['[RISK] Geopolitical port tension evaluated', '[RISK] Commodity spread coverage = 92%', '[SYS] Market delta neutral'],
    },
    {
      title: 'Safety protocols',
      icon: AlertTriangle,
      value: '0 Incidents Reported',
      trend: 'Nominal',
      status: 'nominal',
      logs: ['[SAFE] Thermal reactor sensor online', '[SAFE] Shift rotation fatigue check passed', '[SYS] Safe zones green'],
    },
    {
      title: 'Compliance Vault',
      icon: ShieldCheck,
      value: '100% Audit Readiness',
      trend: 'Secure',
      status: 'nominal',
      logs: ['[COMP] SEC regulatory filings approved', '[COMP] GDPR audit verification complete', '[SYS] Crypto handshakes verified'],
    },
    {
      title: 'Cybersecurity Shield',
      icon: Heart,
      value: 'IPS Firewall Active',
      trend: 'Zero Breaches',
      status: 'nominal',
      logs: ['[CYBER] DDOS threat repelled: Sector 9', '[CYBER] Quantum key rotation executed', '[SYS] Intrusion vector neutralized'],
    },
    {
      title: 'Supply Chain Hub',
      icon: Truck,
      value: '94.1% Route Integrity',
      trend: 'Optimal',
      status: 'nominal',
      logs: ['[SUPP] Cargo vessel "Nova-A" berthed', '[SUPP] Warehouse depletion threshold clear', '[SYS] Factory throughput matched'],
    },
  ]);

  // Periodic Telemetry Updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPanels((prevPanels) =>
        prevPanels.map((panel) => {
          // Add random telemetry fluctuation
          let val = panel.value;
          if (panel.title.includes('Operations')) {
            val = `${(97 + Math.random() * 2.8).toFixed(1)}% Efficiency`;
          } else if (panel.title.includes('Finance')) {
            val = `$${(47.5 + Math.random() * 1.5).toFixed(1)}M Free Cash Flow`;
          } else if (panel.title.includes('Risk')) {
            const risk = (10 + Math.random() * 4).toFixed(0);
            val = `Risk Level: Low (${risk}%)`;
          }

          // Random logs fire
          const newLogs = [...panel.logs];
          if (Math.random() > 0.6) {
            const systemLogs = [
              `[SYS] Pulse telemetry update OK // ${new Date().toLocaleTimeString()}`,
              `[AI] Neural forecast deviation = 0.02%`,
              `[AETHER] Continuous calibration completed`,
            ];
            newLogs.unshift(systemLogs[Math.floor(Math.random() * systemLogs.length)]);
            if (newLogs.length > 4) newLogs.pop();
          }

          return {
            ...panel,
            value: val,
            logs: newLogs,
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handlePanelHover = () => {
    soundEngine.playHover();
  };

  return (
    <div className="w-full h-full text-slate-100 flex flex-col p-6 overflow-hidden relative">
      {/* HUD Header Bar */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-cyan-400 font-mono">
            AETHER COMMAND CENTER // MISSION CONTROL
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            CORE BRAIN SYNCHRONICITY STATUS: nominal // SCAN_RATE: 60Hz
          </p>
        </div>
        <div className="flex items-center space-x-6 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-400">TELEMETRY: BROADCASTING</span>
          </div>
          <div className="text-slate-400">
            LOCATOR: [SEC-C] LAT_N: 37.7749
          </div>
        </div>
      </div>

      {/* Main Command Grid Layout */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0 overflow-y-auto pr-2">
        {/* Left Hand Panels (Operations, Finance, Risk, Safety) */}
        <div className="col-span-12 xl:col-span-4 flex flex-col space-y-6">
          {panels.slice(0, 4).map((p, idx) => (
            <div
              key={idx}
              onMouseEnter={handlePanelHover}
              className="glass-panel border-cyan-500/20 hover:border-cyan-500/40 p-4 transition-all duration-300 relative overflow-hidden group flex flex-col h-[180px] bg-slate-950/40"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full filter blur-xl group-hover:bg-cyan-500/10 transition-all pointer-events-none" />
              {/* Glow border element */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500/40 group-hover:bg-cyan-400 group-hover:h-full transition-all" />

              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-400">
                    <p.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-mono text-sm font-bold text-slate-200 uppercase tracking-wider">{p.title}</h3>
                </div>
                <div className="text-xs font-mono bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">
                  {p.trend}
                </div>
              </div>

              <div className="my-3">
                <p className="text-2xl font-semibold tracking-tight text-white font-mono">{p.value}</p>
              </div>

              {/* Streaming Ticker Logs */}
              <div className="mt-auto border-t border-slate-800/60 pt-2 flex-1 min-h-0 overflow-hidden font-mono text-[10px] text-slate-400 flex flex-col justify-end space-y-1">
                {p.logs.slice(0, 2).map((log, lIdx) => (
                  <div key={lIdx} className="truncate hover:text-cyan-400 transition-colors">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Center - Immersive Holographic Sphere HUD */}
        <div className="col-span-12 xl:col-span-4 flex flex-col items-center justify-between p-4 glass-panel border-purple-500/20 bg-slate-950/20 relative min-h-[400px]">
          {/* Neon Purple Aurora Overlay */}
          <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 to-transparent pointer-events-none" />
          
          <div className="w-full text-center relative z-10">
            <span className="font-mono text-[10px] text-purple-400 tracking-[0.3em] uppercase">CONSCIOUSNESS CORE</span>
            <h3 className="text-lg font-bold font-mono tracking-widest text-white mt-1">AETHER BRAIN HUB</h3>
          </div>

          {/* Glowing Animated Circular Core Diagram */}
          <div className="relative w-64 h-64 my-6 flex items-center justify-center">
            {/* Spinning Radar Grid Sweeper */}
            <div className="absolute inset-0 border border-cyan-500/10 rounded-full animate-[spin_12s_linear_infinite]" />
            <div className="absolute inset-4 border border-purple-500/10 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
            <div className="absolute inset-10 border border-cyan-400/20 border-dashed rounded-full" />
            
            {/* Radar Scanline */}
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgba(0,229,255,0.08),transparent_70%)] animate-[spin_4s_linear_infinite]" />

            {/* Pulsing Central Node Sphere */}
            <div 
              onClick={() => { soundEngine.playLaunch(); }}
              className="w-32 h-32 rounded-full bg-radial-gradient from-cyan-400/20 to-purple-500/20 flex flex-col items-center justify-center border border-cyan-400/40 cursor-pointer shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all group duration-500 relative"
            >
              <div className="absolute inset-0 rounded-full bg-cyan-400/10 animate-ping group-hover:animate-[ping_1.5s_ease-out_infinite]" />
              <Cpu className="w-10 h-10 text-cyan-300 group-hover:rotate-90 transition-transform duration-700" />
              <span className="text-[9px] font-mono text-cyan-300 font-bold mt-2 tracking-widest animate-pulse">ENGAGE SYNC</span>
            </div>
            
            {/* Orbits indicators */}
            <div className="absolute top-1/2 left-0 w-full border-t border-cyan-500/10 transform -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 h-full border-l border-cyan-500/10 transform -translate-x-1/2" />
          </div>

          <div className="w-full font-mono text-[10px] text-slate-400 text-center relative z-10 space-y-1">
            <p>INTELLIGENCE ENGINE COUPLING STATUS: <span className="text-emerald-400">ONLINE</span></p>
            <p>TOTAL COMPUTE WEIGHT: <span className="text-purple-400">8,240 TFLOPS</span></p>
            <p className="text-[9px] text-slate-500">Click Core Sphere to trigger sync sweep wave.</p>
          </div>
        </div>

        {/* Right Hand Panels (Compliance, Cybersecurity, Supply Chain + System Status Log) */}
        <div className="col-span-12 xl:col-span-4 flex flex-col space-y-6">
          {panels.slice(4, 7).map((p, idx) => (
            <div
              key={idx}
              onMouseEnter={handlePanelHover}
              className="glass-panel border-purple-500/20 hover:border-purple-500/40 p-4 transition-all duration-300 relative overflow-hidden group flex flex-col h-[180px] bg-slate-950/40"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full filter blur-xl group-hover:bg-purple-500/10 transition-all pointer-events-none" />
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500/40 group-hover:bg-purple-400 group-hover:h-full transition-all" />

              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 rounded bg-purple-500/10 text-purple-400">
                    <p.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-mono text-sm font-bold text-slate-200 uppercase tracking-wider">{p.title}</h3>
                </div>
                <div className="text-xs font-mono bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">
                  {p.trend}
                </div>
              </div>

              <div className="my-3">
                <p className="text-2xl font-semibold tracking-tight text-white font-mono">{p.value}</p>
              </div>

              {/* Streaming Ticker Logs */}
              <div className="mt-auto border-t border-slate-800/60 pt-2 flex-1 min-h-0 overflow-hidden font-mono text-[10px] text-slate-400 flex flex-col justify-end space-y-1">
                {p.logs.slice(0, 2).map((log, lIdx) => (
                  <div key={lIdx} className="truncate hover:text-purple-400 transition-colors">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* System Terminal Feed panel */}
          <div className="glass-panel border-cyan-500/10 bg-slate-950/70 p-4 flex flex-col flex-1 h-[180px]">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center justify-between">
              <span>SYSTEM EVENT LOG</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </h3>
            <div className="flex-1 font-mono text-[10px] text-slate-400 overflow-y-auto space-y-1.5 pr-2 select-text">
              <div className="text-cyan-300/80">&gt; AETHER-X Consciousness Engine version 1.0.0-Beta initialized.</div>
              <div>&gt; Loading global matrix pathways... OK</div>
              <div>&gt; Synthesizing multi-agent consensus protocols.</div>
              <div className="text-purple-400">&gt; [WAR ROOM] Intrusion scan initiated: 0 vectors found.</div>
              <div className="text-slate-500">&gt; Listening for voice assistant command hooks...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
