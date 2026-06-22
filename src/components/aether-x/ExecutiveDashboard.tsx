'use client';

import React, { useState, useEffect } from 'react';
import { soundEngine } from '@/lib/aether-x/SoundEngine';
import { DollarSign, Percent, ShieldCheck, Flame, Leaf, HelpCircle } from 'lucide-react';

interface Metric {
  name: string;
  value: string;
  icon: any;
  subText: string;
  ringOffset: number;
  ringColor: string;
}

export const ExecutiveDashboard: React.FC = () => {
  const [tickerTick, setTickerTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerTick((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const metrics: Metric[] = [
    { name: 'Revenue Run Rate', value: '$840.4M', icon: DollarSign, subText: '+14.2% YoY growth', ringOffset: 65, ringColor: '#00e5ff' },
    { name: 'Risk Coefficient', value: '12%', icon: ShieldCheck, subText: 'Optimal stability index', ringOffset: 250, ringColor: '#10b981' },
    { name: 'Operational Speed', value: '98.2%', icon: Percent, subText: 'Peak efficiency output', ringOffset: 90, ringColor: '#3b82f6' },
    { name: 'Carbon footprint', value: '2.4 MT', icon: Leaf, subText: 'Near net-zero threshold', ringOffset: 160, ringColor: '#a855f7' },
  ];

  // SVG coordinates for a 3D isometric box
  // Returns top, left, and right polygon path strings for a cube with height
  const get3DBoxPaths = (x: number, y: number, w: number, h: number) => {
    const top = `M ${x} ${y - h} L ${x + w} ${y - h - w / 2} L ${x + 2 * w} ${y - h} L ${x + w} ${y - h + w / 2} Z`;
    const left = `M ${x} ${y - h} L ${x + w} ${y - h + w / 2} L ${x + w} ${y} L ${x} ${y - w / 2} Z`;
    const right = `M ${x + w} ${y - h + w / 2} L ${x + 2 * w} ${y - h} L ${x + 2 * w} ${y - w / 2} L ${x + w} ${y} Z`;
    return { top, left, right };
  };

  const handleMetricHover = () => {
    soundEngine.playHover();
  };

  // Create a live oscillating wave path
  const getWavePath = () => {
    const points = [];
    const amplitude = 12;
    const frequency = 0.08;
    for (let x = 0; x <= 220; x += 10) {
      const y = 35 + Math.sin(x * frequency + tickerTick * 0.4) * amplitude;
      points.push(`${x},${y}`);
    }
    return `M 0,40 Q ${points.join(' ')} L 220,70 L 0,70 Z`;
  };

  return (
    <div className="w-full h-full text-slate-100 flex flex-col p-6 overflow-hidden relative">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-cyan-400 font-mono">
            AETHER-X EXECUTIVE DESK // CEO PANEL
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            EXECUTIVE TELEMETRY SYNTHESIS // REAL-TIME CONSOLIDATED METRICS
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0 overflow-y-auto pr-2">
        {/* Floating Glass Metric Cards with Animated KPI Rings */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              onMouseEnter={handleMetricHover}
              className="glass-panel border-cyan-500/10 hover:border-cyan-500/30 p-5 transition-all duration-300 relative overflow-hidden group bg-slate-950/40"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[9px] text-slate-400 uppercase">{m.name}</span>
                  <h4 className="text-2xl font-bold font-mono text-white mt-1">{m.value}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">{m.subText}</p>
                </div>

                {/* Mini SVG KPI Ring */}
                <div className="relative w-12 h-12">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3.5" />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke={m.ringColor}
                      strokeWidth="3.5"
                      strokeDasharray="88"
                      strokeDashoffset={m.ringOffset}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                    <m.icon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Left Side: 3D Isometric Bar Chart (WOW component) */}
        <div className="col-span-12 lg:col-span-7 glass-panel border-cyan-500/10 bg-slate-950/20 p-5 flex flex-col min-h-[350px]">
          <span className="font-mono text-[10px] text-cyan-400 tracking-widest uppercase mb-3 block">
            3D ISOMETRIC PERFORMANCE MATRICES
          </span>

          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            {/* Perspective grid overlay */}
            <div className="absolute inset-0 bg-grid-overlay opacity-5 pointer-events-none" />

            <svg viewBox="0 0 500 240" className="w-full h-full max-h-[250px] select-none">
              {/* Ground base grids */}
              <path d="M 50 180 L 250 80 L 450 180 L 250 240 Z" fill="none" stroke="rgba(0,229,255,0.04)" strokeWidth="1" />
              
              {/* RENDER 3D SVG CUBES FOR 4 COMPARATIVE METRICS */}
              {(() => {
                // Config: x, y, width, height (fluctuating)
                const c1 = get3DBoxPaths(90, 180, 24, 75 + Math.sin(tickerTick * 0.4) * 15);
                const c2 = get3DBoxPaths(180, 150, 24, 110 + Math.cos(tickerTick * 0.3) * 10);
                const c3 = get3DBoxPaths(270, 160, 24, 50 + Math.sin(tickerTick * 0.5) * 12);
                const c4 = get3DBoxPaths(360, 190, 24, 130 + Math.cos(tickerTick * 0.4) * 8);

                return (
                  <g>
                    {/* Cube 1 (Cyan) */}
                    <polygon points={c1.left} fill="rgba(0, 229, 255, 0.4)" stroke="rgba(0, 229, 255, 0.6)" strokeWidth="0.5" />
                    <polygon points={c1.right} fill="rgba(0, 229, 255, 0.55)" stroke="rgba(0, 229, 255, 0.7)" strokeWidth="0.5" />
                    <polygon points={c1.top} fill="rgba(0, 229, 255, 0.75)" stroke="rgba(255,255,255,0.9)" strokeWidth="0.5" />
                    <text x="114" y="205" fill="#94a3b8" fontSize="8px" fontFamily="var(--font-mono)">Q1</text>

                    {/* Cube 2 (Electric Blue) */}
                    <polygon points={c2.left} fill="rgba(59, 130, 246, 0.4)" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="0.5" />
                    <polygon points={c2.right} fill="rgba(59, 130, 246, 0.55)" stroke="rgba(59, 130, 246, 0.7)" strokeWidth="0.5" />
                    <polygon points={c2.top} fill="rgba(59, 130, 246, 0.75)" stroke="rgba(255,255,255,0.9)" strokeWidth="0.5" />
                    <text x="204" y="175" fill="#94a3b8" fontSize="8px" fontFamily="var(--font-mono)">Q2</text>

                    {/* Cube 3 (Purple) */}
                    <polygon points={c3.left} fill="rgba(147, 51, 234, 0.4)" stroke="rgba(147, 51, 234, 0.6)" strokeWidth="0.5" />
                    <polygon points={c3.right} fill="rgba(147, 51, 234, 0.55)" stroke="rgba(147, 51, 234, 0.7)" strokeWidth="0.5" />
                    <polygon points={c3.top} fill="rgba(147, 51, 234, 0.75)" stroke="rgba(255,255,255,0.9)" strokeWidth="0.5" />
                    <text x="294" y="185" fill="#94a3b8" fontSize="8px" fontFamily="var(--font-mono)">Q3</text>

                    {/* Cube 4 (Emerald Green) */}
                    <polygon points={c4.left} fill="rgba(16, 185, 129, 0.4)" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="0.5" />
                    <polygon points={c4.right} fill="rgba(16, 185, 129, 0.55)" stroke="rgba(16, 185, 129, 0.7)" strokeWidth="0.5" />
                    <polygon points={c4.top} fill="rgba(16, 185, 129, 0.75)" stroke="rgba(255,255,255,0.9)" strokeWidth="0.5" />
                    <text x="384" y="215" fill="#94a3b8" fontSize="8px" fontFamily="var(--font-mono)">Q4 (EST)</text>
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Right Side: Live Trend Wave + Radar Stats */}
        <div className="col-span-12 lg:col-span-5 flex flex-col space-y-6">
          {/* Live Trend Wave widget */}
          <div className="glass-panel border-cyan-500/10 bg-slate-950/50 p-5 flex flex-col justify-between h-[180px] relative overflow-hidden">
            <div className="relative z-10">
              <span className="font-mono text-[9px] text-slate-400 block uppercase">Real-Time Core Stability Wave</span>
              <h4 className="text-xl font-bold font-mono text-white mt-1">99.86% StabilitY</h4>
            </div>

            {/* SVG Wave */}
            <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none opacity-40">
              <svg viewBox="0 0 220 70" preserveAspectRatio="none" className="w-full h-full">
                <path d={getWavePath()} fill="url(#waveGrad)" stroke="#00e5ff" strokeWidth="1.5" />
                <defs>
                  <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#9333ea" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Mini Executive radar brief */}
          <div className="glass-panel border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between h-[180px]">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2">
              CEO CRITICAL ALERTS
            </h3>
            <div className="space-y-2.5 font-mono text-[10px] text-slate-400 select-text">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                <span>SECTOR 9 RISK PROBABILITY:</span>
                <span className="text-rose-500 animate-pulse font-bold">87% (QUARANTINE ENFORCED)</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                <span>REROUTING COMPLIANCE AUDIT:</span>
                <span className="text-emerald-400">PASSED EXEMPTION</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Q3 CAPITAL FORECAST VECTOR:</span>
                <span className="text-cyan-300">+$124.8M NET CAPITAL OUTLAY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
