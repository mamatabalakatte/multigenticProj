'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { soundEngine } from '@/lib/aether-x/SoundEngine';
import AetherCore from '@/components/aether-x/AetherCore';
import CommandCenter from '@/components/aether-x/CommandCenter';
import DigitalTwin from '@/components/aether-x/DigitalTwin';
import KnowledgeGraph from '@/components/aether-x/KnowledgeGraph';
import AgentCouncil from '@/components/aether-x/AgentCouncil';
import BlackSwan from '@/components/aether-x/BlackSwan';
import TimeMachine from '@/components/aether-x/TimeMachine';
import ExecutiveDashboard from '@/components/aether-x/ExecutiveDashboard';
import CyberWarRoom from '@/components/aether-x/CyberWarRoom';
import SupplyChainGalaxy from '@/components/aether-x/SupplyChainGalaxy';
import MemoryTimeline from '@/components/aether-x/MemoryTimeline';
import VoiceAI from '@/components/aether-x/VoiceAI';
import {
  Volume2,
  VolumeX,
  Cpu,
  Tv,
  Layers,
  Users,
  Compass,
  Zap,
  TrendingUp,
  ShieldAlert,
  Globe,
  Clock,
  ArrowLeft,
  ArrowRight,
  Terminal
} from 'lucide-react';

type ScreenType =
  | 'command'
  | 'twin'
  | 'graph'
  | 'council'
  | 'blackswan'
  | 'timemachine'
  | 'exec'
  | 'cyber'
  | 'supply'
  | 'timeline';

export default function AetherXDashboard() {
  const [viewState, setViewState] = useState<'hero' | 'booting' | 'cockpit'>('hero');
  const [activeScreen, setActiveScreen] = useState<ScreenType>('command');
  const [isMuted, setIsMuted] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  // Sound triggers
  const handleLaunch = (initialScreen: ScreenType) => {
    setActiveScreen(initialScreen);
    soundEngine.playLaunch();
    setViewState('booting');

    // Simulate futuristic OS booting sequence
    const logs = [
      'INITIALIZING AETHER-X QUANTUM MATRIX CORE...',
      'ESTABLISHING SHIELD ENCRYPTION BOUNDARIES...',
      'SYNCHRONIZING 6 EXECUTIVE AI AGENT PROTOCOLS...',
      'LOADING ONTOLOGICAL KNOWLEDGE RELATIONS...',
      'BOOTSTRAPPING 3D GEOMETRIC TWIN PIPELINE...',
      'AETHER-X CONSCIOUSNESS CORE ONLINE.'
    ];

    let currentLogIdx = 0;
    const progressInterval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setViewState('cockpit');
            soundEngine.startAmbientHum();
          }, 400);
          return 100;
        }

        // Add logs dynamically as boot progress loads
        if (prev % 18 === 0 && currentLogIdx < logs.length) {
          setBootLogs((prevLogs) => [...prevLogs, `> ${logs[currentLogIdx]}`]);
          currentLogIdx++;
          soundEngine.playClick();
        }

        return prev + 2;
      });
    }, 40);
  };

  const handleSidebarClick = (screen: ScreenType) => {
    setActiveScreen(screen);
    soundEngine.playClick();
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMute(nextMuted);
    soundEngine.playClick();
  };

  // Clean ambient hum on page exit
  useEffect(() => {
    return () => {
      soundEngine.stopAmbientHum();
    };
  }, []);

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'command':
        return <CommandCenter />;
      case 'twin':
        return <DigitalTwin />;
      case 'graph':
        return <KnowledgeGraph />;
      case 'council':
        return <AgentCouncil />;
      case 'blackswan':
        return <BlackSwan />;
      case 'timemachine':
        return <TimeMachine />;
      case 'exec':
        return <ExecutiveDashboard />;
      case 'cyber':
        return <CyberWarRoom />;
      case 'supply':
        return <SupplyChainGalaxy />;
      case 'timeline':
        return <MemoryTimeline />;
      default:
        return <CommandCenter />;
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans relative overflow-hidden select-none bg-[#05070a]">
      {/* 3D background canvas layer */}
      <AetherCore mode={viewState === 'hero' ? 'hero' : 'dashboard'} />

      {/* Grid line layout background */}
      <div className="grid-overlay" />

      {/* -------------------- 1. HERO VIEW -------------------- */}
      {viewState === 'hero' && (
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 min-h-screen">
          <div className="max-w-3xl space-y-6">
            <span className="font-mono text-xs font-bold tracking-[0.4em] text-cyan-400 uppercase animate-pulse">
              INTELLIGENT ENTERPRISE OPERATING SYSTEM
            </span>
            <h1 className="text-7xl font-extrabold tracking-[0.25em] text-white font-mono uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-400 drop-shadow-lg">
              AETHER-X
            </h1>
            <p className="text-lg font-mono text-cyan-300/80 tracking-widest max-w-2xl mx-auto">
              The World's First Self-Learning Enterprise Consciousness Brain
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button
                onClick={() => handleLaunch('command')}
                className="w-56 py-3 font-mono text-xs font-bold uppercase tracking-widest rounded border border-cyan-400 bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20 hover:bg-cyan-300 hover:border-cyan-300 hover:scale-105 transition-all duration-300"
              >
                LAUNCH COMMAND CENTER
              </button>
              <button
                onClick={() => handleLaunch('twin')}
                className="w-56 py-3 font-mono text-xs font-bold uppercase tracking-widest rounded border border-purple-500/30 bg-slate-950/80 text-purple-300 hover:border-purple-400 hover:text-white hover:scale-105 transition-all duration-300 backdrop-blur-md"
              >
                EXPLORE DIGITAL TWIN
              </button>
            </div>
            
            {/* Quick entry return */}
            <div className="pt-8">
              <Link
                href="/ai-iros"
                className="font-mono text-xs text-slate-400 hover:text-cyan-400 flex items-center justify-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>RETURN TO AI-IROS INVESTMENT SUITE</span>
              </Link>
            </div>
          </div>
        </main>
      )}

      {/* -------------------- 2. BOOTING TERMINAL VIEW -------------------- */}
      {viewState === 'booting' && (
        <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 min-h-screen">
          <div className="w-full max-w-2xl glass-panel border-cyan-500/25 p-6 bg-slate-950/70 font-mono text-xs flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-cyan-400 flex items-center space-x-2">
                <Terminal className="w-4 h-4 animate-spin-slow" />
                <span className="font-bold">AETHER-X BIOMETRIC SECURITY SYSTEM BOOTUP</span>
              </span>
              <span className="text-slate-400 font-bold">{bootProgress}%</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: Rolling Logs */}
              <div className="col-span-12 md:col-span-7 flex flex-col h-[220px] justify-between">
                <div className="flex-1 overflow-y-auto space-y-1.5 text-slate-300 text-[10px] select-text scrollbar-thin pr-2">
                  {bootLogs.map((log, lIdx) => (
                    <div key={lIdx}>{log}</div>
                  ))}
                </div>
              </div>

              {/* Right Column: Retinal Scanner Graphic */}
              <div className="col-span-12 md:col-span-5 h-[220px] flex flex-col items-center justify-center border border-cyan-500/20 rounded bg-slate-950/40 p-4 relative overflow-hidden shrink-0">
                {/* Scanner Laser horizontal sweep */}
                <div className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_10px_#00e5ff] animate-[bounce_2s_infinite]" />
                
                {/* Circular eye scanning HUD */}
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-cyan-400/40 flex items-center justify-center animate-[spin_12s_linear_infinite] mb-3">
                  <div className="w-16 h-16 rounded-full border border-purple-500/40 flex items-center justify-center animate-[spin_6s_linear_infinite_reverse]">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-cyan-400 animate-ping" />
                    </div>
                  </div>
                </div>

                <div className="font-mono text-[9px] text-center space-y-1">
                  <div className="text-cyan-400 font-bold uppercase tracking-widest animate-pulse">
                    {bootProgress < 40 ? 'SCANNING BIOMETRICS...' : bootProgress < 85 ? 'ANALYZING RETINA...' : 'RETINA VERIFIED!'}
                  </div>
                  <div className="text-slate-400">DNA_HASH: 0x9f3bc20c1a</div>
                  <div className="text-slate-500 text-[8px] tracking-wider">SECURE LEVEL: GUEST_EXEC</div>
                </div>
              </div>
            </div>

            {/* Custom loader bar */}
            <div className="mt-6 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-850">
              <div
                style={{ width: `${bootProgress}%` }}
                className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full transition-all duration-100"
              />
            </div>
          </div>
        </main>
      )}

      {/* -------------------- 3. OS DASHBOARD COCKPIT -------------------- */}
      {viewState === 'cockpit' && (
        <div className="flex-1 flex flex-col xl:flex-row relative z-10 h-screen overflow-hidden">
          {/* LEFT SIDEBAR NAVIGATION PANEL */}
          <aside className="w-full xl:w-[280px] bg-slate-950/60 border-r border-slate-900 flex flex-col justify-between shrink-0 select-none backdrop-blur-md">
            
            {/* Logo strip */}
            <div className="p-4 border-b border-slate-900 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold font-mono tracking-widest text-white">
                  AETHER-X
                </h1>
                <span className="text-[9px] font-mono text-cyan-400">CONSCIOUSNESS OS v1.0</span>
              </div>

              {/* Sound controller */}
              <button
                onClick={toggleMute}
                className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400"
                title={isMuted ? 'Unmute Systems' : 'Mute Systems'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
              </button>
            </div>

            {/* Interactive Module Links list */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
              {[
                { id: 'command', name: 'Command Center', icon: Cpu },
                { id: 'twin', name: '3D Digital Twin', icon: Tv },
                { id: 'graph', name: 'Palantir Graph', icon: Layers },
                { id: 'council', name: 'Agent Council', icon: Users },
                { id: 'blackswan', name: 'Black Swan Predictor', icon: ShieldAlert },
                { id: 'timemachine', name: 'Time Machine', icon: Compass },
                { id: 'exec', name: 'CEO Dashboard', icon: TrendingUp },
                { id: 'cyber', name: 'Security War Room', icon: Zap },
                { id: 'supply', name: 'Supply Galaxy Map', icon: Globe },
                { id: 'timeline', name: 'Memory Timeline', icon: Clock }
              ].map((item) => {
                const IconComp = item.icon;
                const isActive = activeScreen === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSidebarClick(item.id as ScreenType)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded text-xs font-mono transition-all duration-200 border ${
                      isActive
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-bold'
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Voice AI Widget docked in Sidebar bottom */}
            <div className="p-3 border-t border-slate-900">
              <VoiceAI />
            </div>

            {/* Return link at very bottom */}
            <div className="p-3 border-t border-slate-900">
              <Link
                href="/ai-iros"
                className="w-full py-2 font-mono text-[10px] text-slate-500 hover:text-cyan-400 border border-slate-900 hover:border-cyan-500/20 bg-slate-950/40 rounded flex items-center justify-center space-x-1.5 transition-colors uppercase"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>TO AI-IROS ENGINE</span>
              </Link>
            </div>
          </aside>

          {/* MAIN MODULE CONTENT VIEWPORT */}
          <main className="flex-1 flex flex-col min-h-0 overflow-y-auto select-none bg-slate-950/10 relative">
            {renderActiveScreen()}
          </main>
        </div>
      )}
    </div>
  );
}
