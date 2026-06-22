'use client';

import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '@/lib/aether-x/SoundEngine';
import { Search, RotateCw, ZoomIn, ZoomOut, ShieldAlert, Cpu, Heart, CheckCircle } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: string;
  health: number;
  risk: number;
  maintenance: string;
  predictedFailure: string;
  recommendations: string[];
  status: 'healthy' | 'warning' | 'critical';
  isoX: number; // Isometric coordinates
  isoY: number;
  isoZ: number;
}

export const DigitalTwin: React.FC = () => {
  const [rotation, setRotation] = useState(45);
  const [scale, setScale] = useState(1);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 'core-01',
      name: 'Quantum Reactor Core',
      type: 'Energy Cell',
      health: 98,
      risk: 4,
      maintenance: 'Routine check in 14 days',
      predictedFailure: '0.02% probability within 180 days',
      recommendations: [
        'Maintain cryogenic cooling flow rate at 240 L/h.',
        'Calibrate magnetic containment shields weekly.',
      ],
      status: 'healthy',
      isoX: 0,
      isoY: 0,
      isoZ: 50,
    },
    {
      id: 'grid-02',
      name: 'Power Distribution Grid Alpha',
      type: 'Infrastructure',
      health: 72,
      risk: 32,
      maintenance: 'Urgent replacement needed for capacitor C4',
      predictedFailure: '4.8% probability within 30 days',
      recommendations: [
        'Balance electrical phase load across transformer lines.',
        'Replace electrolyte fluid in grid buffer vaults.',
      ],
      status: 'warning',
      isoX: -120,
      isoY: -100,
      isoZ: 20,
    },
    {
      id: 'data-03',
      name: 'Mainframes Storage Cluster Beta',
      type: 'Data Center',
      health: 94,
      risk: 8,
      maintenance: 'Next audit schedule: July 2026',
      predictedFailure: '0.15% probability within 365 days',
      recommendations: [
        'Verify backup replication sync logs daily.',
        'Optimize partition indices on sector 12 cluster tables.',
      ],
      status: 'healthy',
      isoX: 120,
      isoY: -80,
      isoZ: 30,
    },
    {
      id: 'trans-04',
      name: 'Hydrogen Storage Vaults',
      type: 'Hazardous Containment',
      health: 38,
      risk: 87,
      maintenance: 'EMERGENCY MAINTENANCE SCHEDULED',
      predictedFailure: '42.6% probability within 7 days',
      recommendations: [
        'Depressurize chamber B1 immediately.',
        'Seal primary release valve joint gasket.',
        'Enforce night-shift safety quarantine protocol.',
      ],
      status: 'critical',
      isoX: -60,
      isoY: 120,
      isoZ: 10,
    },
    {
      id: 'node-05',
      name: 'Cooling Hub Gamma',
      type: 'HVAC / Aux Systems',
      health: 86,
      risk: 15,
      maintenance: 'Coolant refill in 45 days',
      predictedFailure: '1.2% probability within 90 days',
      recommendations: [
        'Inspect pump rotor assembly for micro-vibrations.',
        'Upgrade filter membranes to class-7 synthetic fabrics.',
      ],
      status: 'warning',
      isoX: 100,
      isoY: 100,
      isoZ: 15,
    },
  ]);

  // Click handler to choose asset
  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    if (asset.status === 'critical') {
      soundEngine.playAlert();
    } else {
      soundEngine.playClick();
    }
  };

  // Zoom helpers
  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.15, 2));
    soundEngine.playClick();
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.15, 0.5));
    soundEngine.playClick();
  };

  const rotate = () => {
    setRotation((prev) => (prev + 45) % 360);
    soundEngine.playClick();
  };

  // Convert isometric 3D coordinates to 2D screen coordinates based on angle
  const getProjectedCoords = (x: number, y: number, z: number) => {
    const rad = (rotation * Math.PI) / 180;
    // Rotate coordinates around Z-axis
    const rx = x * Math.cos(rad) - y * Math.sin(rad);
    const ry = x * Math.sin(rad) + y * Math.cos(rad);

    // Apply isometric projection skew
    const screenX = rx;
    const screenY = ry * 0.5 - z;

    return { x: screenX, y: screenY };
  };

  // Auto select first warning/critical asset for demonstration
  useEffect(() => {
    setSelectedAsset(assets[3]); // Emergency hydrogen storage
  }, []);

  const filteredAssets = assets.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full text-slate-100 flex flex-col p-6 overflow-hidden relative">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-cyan-400 font-mono">
            3D DIGITAL TWIN MODEL // ASSET MANAGER
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            IMMERSIVE GEOMETRY RECONSTRUCTION: 60FPS // TOTAL ASSETS DETECTED: {assets.length}
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4">
          <div className="glass-panel border-cyan-500/20 px-3 py-1 flex items-center space-x-2 bg-slate-950/40 w-64">
            <Search className="w-4 h-4 text-cyan-400" />
            <input
              type="text"
              placeholder="SEARCH TWIN NODES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none font-mono text-xs w-full text-white placeholder-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Workspace Area: Twin Grid + Inspect Panel */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Side - 3D Isometric Canvas Viewport */}
        <div className="col-span-12 lg:col-span-8 glass-panel border-cyan-500/10 bg-slate-950/30 relative flex items-center justify-center overflow-hidden min-h-[450px]">
          {/* Grid lines layout to give architectural feel */}
          <div className="absolute inset-0 bg-grid-overlay pointer-events-none opacity-20" />
          
          {/* Space Horizon lines */}
          <div className="absolute top-1/2 left-0 w-full border-t border-cyan-500/5 transform -translate-y-1/2 pointer-events-none" />
          <div className="absolute left-1/2 top-0 h-full border-l border-cyan-500/5 transform -translate-x-1/2 pointer-events-none" />

          {/* Interactive controls */}
          <div className="absolute bottom-4 left-4 flex space-x-2 z-10">
            <button
              onClick={zoomIn}
              className="p-2 rounded bg-slate-900 border border-cyan-500/20 hover:border-cyan-400 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={zoomOut}
              className="p-2 rounded bg-slate-900 border border-cyan-500/20 hover:border-cyan-400 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={rotate}
              className="p-2 rounded bg-slate-900 border border-cyan-500/20 hover:border-cyan-400 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
              title="Rotate Viewport"
            >
              <RotateCw className="w-4 h-4 animate-spin-slow" />
            </button>
          </div>

          <div className="absolute top-4 left-4 font-mono text-[9px] text-slate-500 space-y-0.5">
            <div>CAMERA_MATRIX: PERSPECTIVE_ISOMETRIC</div>
            <div>ROTATION_ANGLE: {rotation}°</div>
            <div>SCALE_MULTIPLIER: {scale.toFixed(2)}x</div>
          </div>

          {/* Isometric World Visualizer */}
          <div
            style={{
              transform: `scale(${scale})`,
              transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Base platform disc */}
            <div
              className="absolute w-[450px] h-[225px] border border-cyan-500/10 rounded-full bg-slate-950/20 shadow-inner"
              style={{
                transform: `rotateX(60deg) rotateZ(${-rotation}deg)`,
                transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
            >
              {/* Concentric rings on base platform */}
              <div className="absolute inset-8 border border-purple-500/5 rounded-full" />
              <div className="absolute inset-16 border border-cyan-500/5 rounded-full" />
              <div className="absolute inset-24 border border-cyan-500/10 border-dashed rounded-full" />
            </div>

            {/* Assets projected in 3D */}
            <div className="relative w-0 h-0">
              {filteredAssets.map((asset) => {
                const { x, y } = getProjectedCoords(asset.isoX, asset.isoY, asset.isoZ);
                const isSelected = selectedAsset?.id === asset.id;

                let statusColorClass = 'bg-emerald-500 shadow-emerald-500/60';
                let borderClass = 'border-emerald-500/40';
                if (asset.status === 'warning') {
                  statusColorClass = 'bg-amber-500 shadow-amber-500/60';
                  borderClass = 'border-amber-500/40';
                } else if (asset.status === 'critical') {
                  statusColorClass = 'bg-rose-500 shadow-rose-500/60';
                  borderClass = 'border-rose-500/40';
                }

                return (
                  <div
                    key={asset.id}
                    onClick={() => handleSelectAsset(asset)}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                    style={{
                      left: x,
                      top: y,
                      transition: 'left 0.6s ease, top 0.6s ease',
                      zIndex: Math.floor(y + 1000), // depth layering
                    }}
                  >
                    {/* Hover labels */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-slate-950/90 text-white text-[9px] font-mono py-1 px-2 rounded border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      {asset.name} ({asset.health}%)
                    </div>

                    {/* Holographic Projection Beam (cylinder line) */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-[50px] bg-gradient-to-t from-cyan-500/5 to-cyan-400/40 pointer-events-none" />

                    {/* 3D Holographic Shape */}
                    <div
                      className={`relative w-8 h-8 rounded-full border flex items-center justify-center bg-slate-900/80 transition-all duration-300 ${borderClass} ${
                        isSelected ? 'scale-125 border-cyan-400 ring-2 ring-cyan-400/20' : 'hover:scale-110'
                      }`}
                    >
                      {/* Pulse effect */}
                      <span className={`absolute inset-0 rounded-full animate-ping opacity-25 ${statusColorClass}`} />
                      <div className={`w-3.5 h-3.5 rounded-full ${statusColorClass} shadow-md`} />
                    </div>

                    {/* Ground base shadow dot */}
                    <div className="absolute top-[50px] left-1/2 -translate-x-1/2 w-4 h-2 bg-slate-950/60 rounded-full border border-slate-800" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Expanded Holographic Panel */}
        <div className="col-span-12 lg:col-span-4 flex flex-col space-y-6">
          {selectedAsset ? (
            <div className="glass-panel border-cyan-500/20 p-5 flex flex-col flex-1 bg-slate-950/50 relative overflow-hidden">
              {/* Corner tech line decoration */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/50" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/50" />

              {/* Status Header */}
              <div className="border-b border-slate-800/80 pb-4 mb-4">
                <span className="font-mono text-[9px] text-cyan-400 tracking-widest uppercase">ASSET COMPONENT DIAGNOSTIC</span>
                <h3 className="text-lg font-bold text-white font-mono mt-1">{selectedAsset.name}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs font-mono text-slate-400">Class:</span>
                  <span className="text-xs font-mono text-white font-medium bg-slate-800/80 px-2 py-0.5 rounded">
                    {selectedAsset.type}
                  </span>
                </div>
              </div>

              {/* Grid values */}
              <div className="grid grid-cols-2 gap-4 mb-4 font-mono">
                <div className="bg-slate-900/60 border border-slate-800/55 p-3 rounded">
                  <span className="text-[10px] text-slate-400 block mb-1">HEALTH SCORE</span>
                  <span
                    className={`text-xl font-bold ${
                      selectedAsset.health > 85
                        ? 'text-emerald-400'
                        : selectedAsset.health > 60
                        ? 'text-amber-400'
                        : 'text-rose-500 animate-pulse'
                    }`}
                  >
                    {selectedAsset.health}%
                  </span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/55 p-3 rounded">
                  <span className="text-[10px] text-slate-400 block mb-1">RISK EXPOSURE</span>
                  <span
                    className={`text-xl font-bold ${
                      selectedAsset.risk < 15
                        ? 'text-emerald-400'
                        : selectedAsset.risk < 50
                        ? 'text-amber-400'
                        : 'text-rose-500'
                    }`}
                  >
                    {selectedAsset.risk}%
                  </span>
                </div>
              </div>

              {/* Status alerts */}
              <div className="mb-4">
                <span className="font-mono text-[10px] text-slate-400 block mb-1.5 uppercase">PREDICTIVE ALERTER</span>
                <div className="flex items-start space-x-2.5 bg-slate-900/80 border border-slate-800 p-3 rounded text-xs">
                  {selectedAsset.status === 'healthy' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : selectedAsset.status === 'warning' ? (
                    <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                  )}
                  <div className="space-y-1">
                    <p className="font-mono text-white font-medium">Failure Threat: {selectedAsset.predictedFailure}</p>
                    <p className="text-[11px] text-slate-400">{selectedAsset.maintenance}</p>
                  </div>
                </div>
              </div>

              {/* Recommendations list */}
              <div className="flex-1 overflow-y-auto mb-4 select-text">
                <span className="font-mono text-[10px] text-slate-400 block mb-2 uppercase">AI CORE RECOMMENDATIONS</span>
                <ul className="space-y-2 text-xs font-mono">
                  {selectedAsset.recommendations.map((rec, rIdx) => (
                    <li key={rIdx} className="flex items-start space-x-2 text-slate-300">
                      <span className="text-cyan-400 select-none">▶</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trigger manual override simulation button */}
              <button
                onClick={() => {
                  soundEngine.playLaunch();
                  alert(`Dispatched maintenance squad command sequence to asset: [${selectedAsset.id.toUpperCase()}]`);
                }}
                className={`w-full py-2.5 font-mono text-xs font-bold rounded border uppercase tracking-wider transition-all duration-300 ${
                  selectedAsset.status === 'critical'
                    ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20'
                    : 'bg-cyan-500 hover:bg-cyan-600 text-slate-950 border-cyan-600'
                }`}
              >
                {selectedAsset.status === 'critical' ? 'DISPATCH OVERRIDE COMMAND' : 'RUN SYNC CALIBRATION'}
              </button>
            </div>
          ) : (
            <div className="glass-panel border-slate-800 p-6 flex items-center justify-center flex-1 text-center font-mono text-xs text-slate-400">
              SELECT AN ISOMETRIC NODULAR ASSET ON THE VIEWPORT TO COMPILE FULL GEOMETRIC DIAGNOSTICS
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;
