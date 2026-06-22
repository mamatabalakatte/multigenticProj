'use client';

import React, { useState } from 'react';
import { soundEngine } from '@/lib/aether-x/SoundEngine';
import { Anchor, Truck, AlertTriangle } from 'lucide-react';

interface RouteSegment {
  id: string;
  from: string;
  to: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  status: 'secure' | 'warning' | 'high-risk';
  latency: string;
  riskPulseRate: string;
}

export const SupplyChainGalaxy: React.FC = () => {
  const [hoveredRoute, setHoveredRoute] = useState<RouteSegment | null>(null);

  const routes: RouteSegment[] = [
    { id: 'route-1', from: 'Taiwan Fab', to: 'Singapore Port', x1: 380, y1: 150, x2: 360, y2: 200, status: 'secure', latency: 'Nominal (1.2 days)', riskPulseRate: '1.5s' },
    { id: 'route-2', from: 'Singapore Port', to: 'Suez Channel', x1: 360, y1: 200, x2: 260, y2: 130, status: 'warning', latency: 'Caution (+2.5 days)', riskPulseRate: '0.8s' },
    { id: 'route-3', from: 'S Suez Channel', to: 'Rotterdam Port', x1: 260, y1: 130, x2: 220, y2: 80, status: 'secure', latency: 'Nominal (3.0 days)', riskPulseRate: '2s' },
    { id: 'route-4', from: 'Rotterdam Port', to: 'Giga Factory Berlin', x1: 220, y1: 80, x2: 235, y2: 85, status: 'secure', latency: 'Nominal (0.5 days)', riskPulseRate: '3s' },
    { id: 'route-5', from: 'Taiwan Fab', to: 'San Francisco Port', x1: 380, y1: 150, x2: 90, y2: 120, status: 'high-risk', latency: 'Severe delay (+6 days)', riskPulseRate: '0.4s' },
  ];

  const handleRouteHover = (route: RouteSegment | null) => {
    setHoveredRoute(route);
    if (route) {
      soundEngine.playHover();
    }
  };

  return (
    <div className="w-full h-full text-slate-100 flex flex-col p-6 overflow-hidden relative">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-cyan-400 font-mono">
            GLOBAL SUPPLY CHAIN GALAXY // COGNITIVE LOGISTICS MAP
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            REAL-TIME TRANSIT TELEMETRY // ENERGY PULSE THREAT CORRELATION
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Side: SVG World Map grid overlay */}
        <div className="col-span-12 lg:col-span-8 glass-panel border-cyan-500/10 bg-slate-950/20 p-5 flex flex-col relative min-h-[350px]">
          <span className="font-mono text-[9px] text-cyan-400 tracking-widest uppercase mb-3 block">
            SUPPLIER SHIPPINGS MATRIX
          </span>

          <div className="flex-1 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-grid-overlay opacity-5 pointer-events-none" />

            <svg viewBox="0 0 500 280" className="w-full h-full max-h-[260px] select-none">
              {/* Fake abstract world dot grid in background */}
              {Array.from({ length: 15 }).map((_, r) =>
                Array.from({ length: 25 }).map((_, c) => (
                  <circle
                    key={`${r}-${c}`}
                    cx={15 + c * 20}
                    cy={15 + r * 18}
                    r="1"
                    fill="rgba(0, 229, 255, 0.1)"
                  />
                ))
              )}

              {/* Draw supply routes */}
              {routes.map((route) => {
                let strokeColor = '#10b981'; // Green
                let pulseColor = '#00e5ff';
                if (route.status === 'warning') {
                  strokeColor = '#f59e0b';
                  pulseColor = '#f59e0b';
                } else if (route.status === 'high-risk') {
                  strokeColor = '#ef4444';
                  pulseColor = '#ef4444';
                }

                const isHovered = hoveredRoute?.id === route.id;

                return (
                  <g key={route.id}>
                    {/* Curved route arc line */}
                    <path
                      d={`M ${route.x1} ${route.y1} Q ${(route.x1 + route.x2) / 2} ${(route.y1 + route.y2) / 2 - 15} ${route.x2} ${route.y2}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isHovered ? 3 : 1.5}
                      strokeOpacity={isHovered ? 0.9 : 0.4}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => handleRouteHover(route)}
                      onMouseLeave={() => handleRouteHover(null)}
                    />

                    {/* Animated running energy pulses representing cargo flow */}
                    <circle r="3.5" fill={pulseColor}>
                      <animateMotion
                        path={`M ${route.x1} ${route.y1} Q ${(route.x1 + route.x2) / 2} ${(route.y1 + route.y2) / 2 - 15} ${route.x2} ${route.y2}`}
                        dur={route.riskPulseRate}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                );
              })}

              {/* Draw Nodes */}
              {/* 1. Taiwan Fab */}
              <circle cx="380" cy="150" r="5" fill="#00e5ff" />
              <text x="390" y="153" fill="#94a3b8" fontSize="8px" fontFamily="var(--font-mono)">TAIWAN_FAB</text>

              {/* 2. Singapore Port */}
              <circle cx="360" cy="200" r="4.5" fill="#10b981" />
              <text x="370" y="203" fill="#94a3b8" fontSize="8px" fontFamily="var(--font-mono)">SINGAPORE_PORT</text>

              {/* 3. Suez Channel */}
              <circle cx="260" cy="130" r="4" fill="#f59e0b" />
              <text x="270" y="133" fill="#94a3b8" fontSize="8px" fontFamily="var(--font-mono)">SUEZ_CHANNEL</text>

              {/* 4. Rotterdam Port */}
              <circle cx="220" cy="80" r="4" fill="#00e5ff" />
              <text x="180" y="75" fill="#94a3b8" fontSize="8px" fontFamily="var(--font-mono)">ROTTERDAM_PORT</text>

              {/* 5. Giga Berlin */}
              <circle cx="235" cy="85" r="5.5" fill="#10b981" />
              <text x="245" y="93" fill="#94a3b8" fontSize="8px" fontFamily="var(--font-mono)">GIGA_BERLIN</text>

              {/* 6. SF Port */}
              <circle cx="90" cy="120" r="4.5" fill="#ef4444" className="animate-pulse" />
              <text x="30" y="115" fill="#94a3b8" fontSize="8px" fontFamily="var(--font-mono)">SF_PORT_BLOCK</text>
            </svg>
          </div>
        </div>

        {/* Right Side: Segment detail card */}
        <div className="col-span-12 lg:col-span-4 flex flex-col space-y-6">
          <div className="glass-panel border-cyan-500/20 p-5 flex flex-col flex-1 bg-slate-950/50">
            {hoveredRoute ? (
              <div className="space-y-4">
                <div className="border-b border-slate-800/80 pb-4">
                  <span className="font-mono text-[9px] text-cyan-400 tracking-widest uppercase">COGNITIVE SHIPPING LOGS</span>
                  <h3 className="text-md font-bold text-white font-mono mt-1">
                    {hoveredRoute.from} ➔ {hoveredRoute.to}
                  </h3>
                  <div className="mt-2 inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-900 text-slate-300">
                    ID: {hoveredRoute.id.toUpperCase()}
                  </div>
                </div>

                <div className="space-y-3 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">LATENCY PENALTY</span>
                    <span className="text-xs font-bold text-white">{hoveredRoute.latency}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">TRANSIT STATUS</span>
                    <span className={`text-xs font-bold uppercase ${
                      hoveredRoute.status === 'secure' ? 'text-emerald-400' : hoveredRoute.status === 'warning' ? 'text-amber-400' : 'text-rose-500'
                    }`}>
                      {hoveredRoute.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">ENERGY PULSE FREQUENCY</span>
                    <span className="text-xs text-white">1 packet every {hoveredRoute.riskPulseRate}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center font-mono text-xs text-slate-400 p-4">
                <Anchor className="w-12 h-12 text-slate-600 mb-3 animate-bounce" />
                HOVER OVER ANY PULSING COGNITIVE SHIPPING ROUTE ON THE MAP TO COMPILE DEEP LOGISTICAL LATENCY REPORTS
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainGalaxy;
