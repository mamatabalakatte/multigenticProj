'use client';

import React, { useState, useEffect } from 'react';
import { soundEngine } from '@/lib/aether-x/SoundEngine';
import { ShieldCheck, ShieldAlert, Cpu, Network, Radio } from 'lucide-react';

interface ThreatFeedEntry {
  timestamp: string;
  sourceIp: string;
  targetNode: string;
  payloadType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'intercepted' | 'monitoring' | 'blocked';
}

export const CyberWarRoom: React.FC = () => {
  const [feed, setFeed] = useState<ThreatFeedEntry[]>([
    { timestamp: '19:42:01', sourceIp: '185.220.101.4', targetNode: 'DB_CLUSTER_ALPHA', payloadType: 'SQL_INJECTION', severity: 'high', status: 'blocked' },
    { timestamp: '19:41:45', sourceIp: '92.118.160.22', targetNode: 'CORE_GATEWAY_3', payloadType: 'DDOS_SYN_FLOOD', severity: 'critical', status: 'intercepted' },
    { timestamp: '19:41:12', sourceIp: '45.143.203.8', targetNode: 'SENSORS_WEST_HUB', payloadType: 'EXPLOIT_SCAN', severity: 'low', status: 'monitoring' },
  ]);

  const [threatPathsTick, setThreatPathsTick] = useState(0);

  // Generate continuous threat firehose
  useEffect(() => {
    const interval = setInterval(() => {
      const ips = ['198.51.100.12', '203.0.113.88', '82.102.23.45', '109.244.12.99', '185.190.140.7'];
      const nodes = ['STORAGE_BUFFER_B', 'AUTH_VAULT_WEST', 'THERMAL_COOL_HUB', 'TAVILY_AGENT_API', 'SEC_SCRAPER_3'];
      const payloads = ['BRUTE_FORCE_SSH', 'BUFFER_OVERFLOW', 'API_TOKEN_FUZZING', 'MALICIOUS_XML', 'CROSS_SITE_SCRIPTING'];
      const severities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
      const statuses: ('intercepted' | 'monitoring' | 'blocked')[] = ['blocked', 'intercepted', 'blocked'];

      const newEntry: ThreatFeedEntry = {
        timestamp: new Date().toLocaleTimeString(),
        sourceIp: ips[Math.floor(Math.random() * ips.length)],
        targetNode: nodes[Math.floor(Math.random() * nodes.length)],
        payloadType: payloads[Math.floor(Math.random() * payloads.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
      };

      setFeed((prev) => [newEntry, ...prev.slice(0, 5)]);
      setThreatPathsTick((t) => t + 1);

      // Play alert noise if severe threat pops up
      if (newEntry.severity === 'critical' || newEntry.severity === 'high') {
        soundEngine.playAlert();
      } else {
        soundEngine.playClick();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getAttackPathCoords = () => {
    // Generate alternate start/end curves for simulated attacks on threat globe
    const paths = [
      { x1: 50, y1: 80, x2: 250, y2: 120 },
      { x1: 450, y1: 60, x2: 250, y2: 120 },
      { x1: 150, y1: 220, x2: 250, y2: 120 },
      { x1: 320, y1: 260, x2: 250, y2: 120 },
    ];
    return paths[threatPathsTick % paths.length];
  };

  const path = getAttackPathCoords();

  return (
    <div className="w-full h-full text-slate-100 flex flex-col p-6 overflow-hidden relative">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-cyan-400 font-mono">
            CYBER SECURITY OPERATIONAL WAR ROOM // TACTICAL IDS
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            ACTIVE INTRUSION MONITORING: SHIELD SEC v4.12 // FIREWALL ACTIVE
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Side: Cyber threat globe attack visualizer */}
        <div className="col-span-12 lg:col-span-7 glass-panel border-purple-500/15 bg-slate-950/20 p-5 flex flex-col relative min-h-[350px]">
          <span className="font-mono text-[9px] text-purple-400 tracking-widest uppercase mb-3 block">
            GLOBAL CYBER TARGETING RADAR GLOBE
          </span>

          <div className="flex-1 flex items-center justify-center relative">
            {/* SVG Globe drawing */}
            <svg viewBox="0 0 500 300" className="w-full h-full max-h-[280px] select-none">
              {/* Globe grid circles */}
              <ellipse cx="250" cy="150" rx="200" ry="120" fill="none" stroke="rgba(147, 51, 234, 0.1)" strokeWidth="1" />
              <ellipse cx="250" cy="150" rx="160" ry="90" fill="none" stroke="rgba(147, 51, 234, 0.08)" strokeWidth="1" />
              <ellipse cx="250" cy="150" rx="100" ry="50" fill="none" stroke="rgba(0, 229, 255, 0.05)" strokeWidth="1" />
              <line x1="50" y1="150" x2="450" y2="150" stroke="rgba(147, 51, 234, 0.1)" strokeWidth="1" />
              <line x1="250" y1="30" x2="250" y2="270" stroke="rgba(147, 51, 234, 0.1)" strokeWidth="1" />

              {/* Target HQ node */}
              <circle cx="250" cy="120" r="6" fill="#00e5ff" className="animate-ping" />
              <circle cx="250" cy="120" r="4" fill="#00e5ff" />
              <text x="250" y="105" fill="#00e5ff" fontSize="8px" fontWeight="bold" textAnchor="middle" fontFamily="var(--font-mono)">
                AETHER_CORE_GW
              </text>

              {/* Attack Vector curve line */}
              <path
                d={`M ${path.x1} ${path.y1} Q ${(path.x1 + path.x2) / 2} ${(path.y1 + path.y2) / 2 - 60} ${path.x2} ${path.y2}`}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray="4,4"
                strokeOpacity="0.85"
                className="animate-pulse"
              />

              {/* Attacker node */}
              <circle cx={path.x1} cy={path.y1} r="5" fill="#ef4444" className="animate-pulse" />
              <text x={path.x1} y={path.y1 - 10} fill="#ef4444" fontSize="8px" textAnchor="middle" fontFamily="var(--font-mono)">
                THREAT_SRC
              </text>

              {/* Pulsing alert target indicator */}
              <circle cx="250" cy="120" r="30" fill="none" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1.5" className="animate-[ping_3s_infinite]" />
            </svg>
          </div>
        </div>

        {/* Right Side: Network Topology + Live Intrusion Feed */}
        <div className="col-span-12 lg:col-span-5 flex flex-col space-y-6">
          {/* Network Topology tree map */}
          <div className="glass-panel border-cyan-500/10 bg-slate-950/40 p-4 flex flex-col h-[180px]">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center space-x-2">
              <Network className="w-4 h-4" />
              <span>NETWORK BOUNDARY MAP</span>
            </h3>
            <div className="flex-1 font-mono text-[9px] text-slate-400 space-y-2 select-text">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-bold">WAN_GATEWAY_MAIN:</span>
                <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1 rounded">SECURE</span>
              </div>
              <div className="flex items-center space-x-2 pl-4 border-l border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>DMZ_FILTER_REDUNDANT:</span>
                <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1 rounded">SECURE</span>
              </div>
              <div className="flex items-center space-x-2 pl-8 border-l border-slate-800">
                <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>REACTOR_Telemetry_LINK:</span>
                <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1 rounded">FILTERING ATTACK</span>
              </div>
            </div>
          </div>

          {/* Live Intrusion Firewall Feed */}
          <div className="glass-panel border-slate-800 bg-slate-950/70 p-4 flex flex-col flex-1 h-[210px]">
            <h3 className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest mb-3 flex items-center space-x-2">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>INTRUSION PREVENTION ALERTER LOG</span>
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 select-text">
              {feed.map((f, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded border font-mono text-[9px] flex flex-col ${
                    f.severity === 'critical'
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                      : f.severity === 'high'
                      ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">{f.timestamp} // SRC: {f.sourceIp}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] border font-bold uppercase ${
                      f.status === 'blocked' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                    }`}>
                      {f.status}
                    </span>
                  </div>
                  <div>TARGET_NODE: <span className="text-slate-200">{f.targetNode}</span></div>
                  <div>PAYLOAD_EXPLOIT: <span className="text-slate-200">{f.payloadType}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberWarRoom;
