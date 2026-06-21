'use client';

import React from 'react';
import { DnaScores } from '@/lib/agents/types';

interface DnaRadarProps {
  scores: DnaScores;
}

export default function DnaRadar({ scores }: DnaRadarProps) {
  const width = 340;
  const height = 300;
  const cx = width / 2;
  const cy = height / 2;
  const maxVal = 100;
  
  const labels: { key: keyof DnaScores; label: string }[] = [
    { key: 'moat', label: 'Competitive Moat' },
    { key: 'growth', label: 'Growth Catalyst' },
    { key: 'innovation', label: 'R&D Innovation' },
    { key: 'leadership', label: 'Leadership Depth' },
    { key: 'stability', label: 'Financial Stability' },
    { key: 'risk', label: 'Risk Mitigation' },
  ];
  
  const numPoints = labels.length;
  // Calculate raw radius
  const maxRadius = 100;

  // Function to get x, y coordinates
  const getCoordinates = (index: number, value: number) => {
    // Offset by -Math.PI / 2 to start at the top
    const angle = (index * 2 * Math.PI) / numPoints - Math.PI / 2;
    const r = (value / maxVal) * maxRadius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y };
  };

  // Generate grid circles/polygons
  const gridLevels = [25, 50, 75, 100];
  const gridPolygons = gridLevels.map((level) => {
    const points = Array.from({ length: numPoints })
      .map((_, i) => {
        const { x, y } = getCoordinates(i, level);
        return `${x},${y}`;
      })
      .join(' ');
    return points;
  });

  // Calculate coordinates for the actual values
  // Since 'risk' value of 100 means high risk, risk mitigation is (100 - risk).
  const adjustedScores = {
    ...scores,
    risk: 100 - (scores.risk || 0) // Convert risk to "risk mitigation score"
  };

  const dataPoints = labels.map((item, i) => {
    const scoreVal = adjustedScores[item.key] || 50;
    return getCoordinates(i, scoreVal);
  });
  
  const dataPathString = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--cyberspace-blue)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--cyberspace-blue)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Radar Background Glow */}
        <circle cx={cx} cy={cy} r={maxRadius} fill="url(#radarGlow)" />

        {/* Grid lines */}
        {gridPolygons.map((points, index) => (
          <polygon
            key={index}
            points={points}
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="0.5"
            strokeDasharray={index === 3 ? 'none' : '2,2'}
          />
        ))}

        {/* Axis lines */}
        {Array.from({ length: numPoints }).map((_, i) => {
          const outerPoint = getCoordinates(i, maxVal);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={outerPoint.x}
              y2={outerPoint.y}
              stroke="var(--border-color)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Filled Data Area */}
        <polygon
          points={dataPathString}
          fill="rgba(0, 229, 255, 0.25)"
          stroke="var(--cyberspace-blue)"
          strokeWidth="2"
          style={{ filter: 'drop-shadow(0 0 6px rgba(0, 229, 255, 0.6))' }}
        />

        {/* Data points markers */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="var(--terminal-green)"
            stroke="var(--bg-obsidian)"
            strokeWidth="1.5"
          />
        ))}

        {/* Axis Labels */}
        {labels.map((item, i) => {
          const scoreVal = adjustedScores[item.key] || 50;
          const originalVal = item.key === 'risk' ? scores.risk : scoreVal;
          const { x, y } = getCoordinates(i, maxVal + 15);
          
          let textAnchor: 'start' | 'end' | 'middle' = 'middle';
          let dy = '0.35em';
          if (x < cx - 10) {
            textAnchor = 'end';
          } else if (x > cx + 10) {
            textAnchor = 'start';
          }
          if (y < cy - 10) {
            dy = '0em';
          } else if (y > cy + 10) {
            dy = '0.7em';
          }

          return (
            <g key={i}>
              <text
                x={x}
                y={y}
                fill="var(--text-secondary)"
                fontSize="10"
                fontFamily="var(--font-sans)"
                textAnchor={textAnchor}
                dy={dy}
                style={{ fontWeight: 500 }}
              >
                {item.label}
              </text>
              <text
                x={x}
                y={y + 12}
                fill="var(--terminal-green)"
                fontSize="10"
                fontFamily="var(--font-mono)"
                textAnchor={textAnchor}
                dy={dy}
              >
                {originalVal}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
