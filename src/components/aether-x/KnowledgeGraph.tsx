'use client';

import React, { useState, useEffect } from 'react';
import { soundEngine } from '@/lib/aether-x/SoundEngine';
import { Search, Info, HelpCircle } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  type: 'machine' | 'employee' | 'supplier' | 'risk' | 'project' | 'incident';
  x: number;
  y: number;
  size: number;
  description: string;
}

interface GraphLink {
  source: string;
  target: string;
  relationship: string;
}

export const KnowledgeGraph: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  // Semantic RAG States
  const [ragLoading, setRagLoading] = useState(false);
  const [ragResult, setRagResult] = useState<{
    score: number;
    matchNodeLabel: string;
    text: string;
  } | null>(null);

  const ragPresets = [
    {
      q: 'Find cryogenic supplier reliability',
      nodeId: '3',
      score: 0.942,
      text: 'Vector Match: Nova Tech Ltd (supplier) is the primary cryogenic supplier with a Mean Time Between Failures of 14,000 hours.'
    },
    {
      q: 'Tectonic fault risk profile',
      nodeId: '4',
      score: 0.884,
      text: 'Vector Match: Explosion Risk (risk) represents compounding triggers of Methane Leaks and seismic vibrations exceeding 5.0 Richter.'
    },
    {
      q: 'Who manages the Reactor Core?',
      nodeId: '2',
      score: 0.978,
      text: 'Vector Match: Sarah Connor (employee) is the Operations Director supervising reactor cooling valves and stress guidelines.'
    }
  ];

  const handleRagQuery = (preset: typeof ragPresets[0]) => {
    setRagLoading(true);
    setRagResult(null);
    soundEngine.playCyberSweep();
    
    setTimeout(() => {
      setRagLoading(false);
      const matchedNode = nodes.find(n => n.id === preset.nodeId);
      setRagResult({
        score: preset.score,
        matchNodeLabel: matchedNode?.label || 'Unknown',
        text: preset.text
      });
      if (matchedNode) {
        setSelectedNode(matchedNode);
      }
      soundEngine.playLaunch();
    }, 1500);
  };

  const nodes: GraphNode[] = [
    { id: '1', label: 'Quantum Reactor Core', type: 'machine', x: 250, y: 150, size: 28, description: 'Core hydrogen power production facility.' },
    { id: '2', label: 'Sarah Connor', type: 'employee', x: 120, y: 80, size: 18, description: 'Director of Energy Operations.' },
    { id: '3', label: 'Nova Tech Ltd', type: 'supplier', x: 380, y: 90, size: 20, description: 'Cryogenic fuel cell manufacturer.' },
    { id: '4', label: 'Explosion Risk', type: 'risk', x: 230, y: 280, size: 22, description: 'Critical warning score (87%) active.' },
    { id: '5', label: 'Grid Expansion', type: 'project', x: 80, y: 220, size: 20, description: 'Infrastructure upgrade project phase 2.' },
    { id: '6', label: 'Coolant Leak Inc', type: 'incident', x: 420, y: 240, size: 22, description: 'Minor leak detected in cooling hub B.' },
    { id: '7', label: 'Tony Stark', type: 'employee', x: 340, y: 320, size: 18, description: 'Lead Nuclear Engineer.' },
    { id: '8', label: 'Apex Logistics', type: 'supplier', x: 450, y: 160, size: 18, description: 'Global freight delivery vector.' },
  ];

  const links: GraphLink[] = [
    { source: '1', target: '2', relationship: 'Managed by' },
    { source: '1', target: '3', relationship: 'Supplied by' },
    { source: '1', target: '4', relationship: 'Prone to' },
    { source: '2', target: '5', relationship: 'Supervises' },
    { source: '1', target: '6', relationship: 'Affected by' },
    { source: '6', target: '7', relationship: 'Repaired by' },
    { source: '3', target: '8', relationship: 'Shipped via' },
    { source: '4', target: '6', relationship: 'Aggravated by' },
  ];

  // Helper to determine if a node or link matches the search query or selection
  const isHighlighted = (node: GraphNode) => {
    if (!searchQuery) return false;
    return node.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
           node.type.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Helper to check if a link is connected to selected or highlighted nodes
  const isLinkActive = (link: GraphLink) => {
    if (selectedNode) {
      return link.source === selectedNode.id || link.target === selectedNode.id;
    }
    if (searchQuery) {
      const sourceNode = nodes.find(n => n.id === link.source);
      const targetNode = nodes.find(n => n.id === link.target);
      return (sourceNode && isHighlighted(sourceNode)) || (targetNode && isHighlighted(targetNode));
    }
    return false;
  };

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    soundEngine.playClick();
  };

  const handleNodeHover = (node: GraphNode | null) => {
    setHoveredNode(node);
    if (node) {
      soundEngine.playHover();
    }
  };

  return (
    <div className="w-full h-full text-slate-100 flex flex-col p-6 overflow-hidden relative">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-cyan-400 font-mono">
            KNOWLEDGE GRAPH EXPLORER // PALANTIR HUD
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            RELATIONAL ONTOLOGY GRAPHS: 8 NODES // 8 EDGES ACTIVE
          </p>
        </div>

        {/* Search */}
        <div className="glass-panel border-cyan-500/20 px-3 py-1 flex items-center space-x-2 bg-slate-950/40 w-72">
          <Search className="w-4 h-4 text-cyan-400" />
          <input
            type="text"
            placeholder="SEARCH ENTITY (e.g. reactor, risk, supplier)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none font-mono text-xs w-full text-white placeholder-slate-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Knowledge Graph Vector SVG Container */}
        <div className="col-span-12 lg:col-span-8 glass-panel border-cyan-500/10 bg-slate-950/30 relative flex items-center justify-center min-h-[450px]">
          {/* Dynamic grid background layer */}
          <div className="absolute inset-0 bg-grid-overlay opacity-10 pointer-events-none" />

          {/* SVG Canvas */}
          <svg
            viewBox="0 0 600 400"
            className="w-full h-full max-h-[500px] select-none"
            style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
          >
            <defs>
              {/* Radial glows */}
              <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-rose" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Link Lines */}
            {links.map((link, idx) => {
              const sourceNode = nodes.find((n) => n.id === link.source);
              const targetNode = nodes.find((n) => n.id === link.target);
              if (!sourceNode || !targetNode) return null;

              const isActive = isLinkActive(link);

              return (
                <g key={idx}>
                  {/* Glowing halo line */}
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isActive ? '#00e5ff' : '#1e293b'}
                    strokeWidth={isActive ? 3 : 1.5}
                    strokeOpacity={isActive ? 0.8 : 0.3}
                    className="transition-all duration-300"
                  />
                  {/* Running particle flow dots on links */}
                  {isActive && (
                    <circle r="3" fill="#00e5ff" className="animate-pulse">
                      <animateMotion
                        path={`M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`}
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isSearchingActive = isHighlighted(node);
              const isDimmed = searchQuery && !isSearchingActive;

              let color = '#3b82f6'; // Default Blue (Machine)
              let filterId = '';
              if (node.type === 'risk') {
                color = '#ef4444'; // Red
                filterId = 'glow-rose';
              } else if (node.type === 'employee') {
                color = '#a855f7'; // Purple
              } else if (node.type === 'supplier') {
                color = '#10b981'; // Green
              } else if (node.type === 'project') {
                color = '#eab308'; // Amber
              } else if (node.type === 'incident') {
                color = '#f97316'; // Orange
              }

              // Glow overlay if clicked
              if (isSelected || isSearchingActive) {
                filterId = 'glow-cyan';
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => handleNodeHover(node)}
                  onMouseLeave={() => handleNodeHover(null)}
                  className="cursor-pointer group"
                  style={{
                    opacity: isDimmed ? 0.3 : 1,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {/* Hover Outer Ring */}
                  <circle
                    r={node.size + 6}
                    fill="none"
                    stroke={isSelected || isSearchingActive ? '#00e5ff' : color}
                    strokeWidth="1.5"
                    strokeDasharray={isSelected ? '4,4' : 'none'}
                    className="opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                  />

                  {/* Core Node Circle */}
                  <circle
                    r={node.size}
                    fill="#0d1321"
                    stroke={isSelected || isSearchingActive ? '#00e5ff' : color}
                    strokeWidth={isSelected || isSearchingActive ? 3.5 : 2}
                    filter={filterId ? `url(#${filterId})` : undefined}
                    className="transition-all duration-300"
                  />

                  {/* Icon indicator shorthand */}
                  <text
                    textAnchor="middle"
                    dy=".3em"
                    fill="#f8fafc"
                    fontSize="9px"
                    fontWeight="bold"
                    fontFamily="var(--font-mono)"
                    pointerEvents="none"
                  >
                    {node.type.substring(0, 3).toUpperCase()}
                  </text>

                  {/* Text Label Below Node */}
                  <text
                    textAnchor="middle"
                    y={node.size + 14}
                    fill={isSelected || isSearchingActive ? '#00e5ff' : '#94a3b8'}
                    fontSize="10px"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    fontFamily="var(--font-sans)"
                    pointerEvents="none"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick HUD legend overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 text-[8px] font-mono select-none">
            <span className="flex items-center space-x-1 border border-blue-500/20 bg-blue-500/5 px-2 py-0.5 rounded text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>MACHINE</span>
            </span>
            <span className="flex items-center space-x-1 border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 rounded text-purple-400">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>EMPLOYEE</span>
            </span>
            <span className="flex items-center space-x-1 border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 rounded text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>SUPPLIER</span>
            </span>
            <span className="flex items-center space-x-1 border border-red-500/20 bg-red-500/5 px-2 py-0.5 rounded text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>RISK</span>
            </span>
            <span className="flex items-center space-x-1 border border-yellow-500/20 bg-yellow-500/5 px-2 py-0.5 rounded text-yellow-400">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              <span>PROJECT</span>
            </span>
          </div>
        </div>

        {/* Right Side - Selected Node Metadata Panel */}
        <div className="col-span-12 lg:col-span-4 flex flex-col space-y-6">
          {/* Main Inspection Widget */}
          <div className="glass-panel border-cyan-500/20 p-5 flex flex-col flex-1 bg-slate-950/50">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="border-b border-slate-800/80 pb-4">
                  <span className="font-mono text-[9px] text-cyan-400 tracking-widest uppercase">ONTOLOGY NODE DETAIL</span>
                  <h3 className="text-lg font-bold text-white font-mono mt-1">{selectedNode.label}</h3>
                  <div className="mt-2 inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {selectedNode.type}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-slate-400 block uppercase">NODE SYNOPSIS</span>
                  <p className="font-sans text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800 select-text">
                    {selectedNode.description}
                  </p>
                </div>

                {/* Relational connections lookup */}
                <div>
                  <span className="font-mono text-[10px] text-slate-400 block mb-2 uppercase">CONNECTED RELATIONSHIPS</span>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {links
                      .filter((link) => link.source === selectedNode.id || link.target === selectedNode.id)
                      .map((link, lIdx) => {
                        const otherNode = nodes.find(
                          (n) => n.id === (link.source === selectedNode.id ? link.target : link.source)
                        );
                        if (!otherNode) return null;

                        return (
                          <div
                            key={lIdx}
                            onClick={() => setSelectedNode(otherNode)}
                            className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/30 cursor-pointer transition-all text-xs"
                          >
                            <span className="font-mono text-slate-400">{link.relationship}</span>
                            <span className="font-mono text-cyan-300 hover:underline">{otherNode.label}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-between font-mono text-xs text-slate-400 p-2">
                <div className="space-y-4">
                  <div className="border-b border-slate-800/80 pb-2">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                      ONTOLOGY RAG QUERY ENGINE
                    </span>
                    <span className="text-[8px] text-slate-500 block">
                      SEMANTIC VECTOR MEMORY RETRIEVER
                    </span>
                  </div>

                  {ragLoading ? (
                    <div className="py-6 flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] text-cyan-300 animate-pulse uppercase">
                        Computing Semantic Cosine Distance...
                      </span>
                    </div>
                  ) : ragResult ? (
                    <div className="space-y-3 bg-slate-900/60 border border-cyan-500/25 p-3 rounded text-slate-300 text-[11px] leading-relaxed">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5 text-[9px]">
                        <span className="text-cyan-400 font-bold">MATCH: {ragResult.matchNodeLabel}</span>
                        <span className="text-emerald-400 font-bold">COS_SIM: {ragResult.score}</span>
                      </div>
                      <p className="select-text">{ragResult.text}</p>
                      <button
                        onClick={() => setRagResult(null)}
                        className="text-[9px] text-slate-500 hover:text-cyan-400 uppercase tracking-widest mt-1 block"
                      >
                        ◀ CLEAR RETRIEVAL
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[10px] text-slate-400 select-text">
                        Query the enterprise vector database directly. Select a semantic preset below:
                      </p>
                      <div className="flex flex-col space-y-2">
                        {ragPresets.map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleRagQuery(p)}
                            className="w-full text-left p-2 rounded bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-white text-[9.5px] truncate transition-colors"
                          >
                            🔍 "{p.q}"
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-850 pt-4 flex items-center space-x-2 text-[9px] text-slate-500 justify-center">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>OR SELECT ANY NODE ON THE LEFT VECTOR HUB</span>
                </div>
              </div>
            )}
          </div>

          {/* Mini Interactive Helper Box */}
          {hoveredNode && (
            <div className="glass-panel border-purple-500/20 bg-purple-950/20 p-4 flex items-start space-x-3 transition-opacity">
              <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5 animate-bounce" />
              <div className="font-mono text-[10px] text-slate-300">
                <div className="font-bold text-white uppercase">{hoveredNode.label}</div>
                <div>{hoveredNode.description}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
