'use client';

import React from 'react';
import { Simulations } from '@/lib/agents/types';

interface MonteCarloProps {
  simulations: Simulations;
  currentPrice: number;
}

export default function MonteCarlo({ simulations, currentPrice }: MonteCarloProps) {
  const width = 380;
  const height = 180;
  const paddingLeft = 30;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 35;

  const bearVal = simulations.bear.priceTarget || currentPrice * 0.8;
  const baseVal = simulations.base.priceTarget || currentPrice * 1.05;
  const bullVal = simulations.bull.priceTarget || currentPrice * 1.3;
  const blackSwanVal = simulations.blackSwan.priceTarget || currentPrice * 0.5;

  // Let's determine the x scale bounds
  const minX = Math.round(blackSwanVal * 0.8);
  const maxX = Math.round(bullVal * 1.15);
  
  const getX = (val: number) => {
    const scale = (width - paddingLeft - paddingRight) / (maxX - minX);
    return paddingLeft + (val - minX) * scale;
  };

  // Generate Gaussian curve points
  // Peak should be at the Base Case value, with standard deviation spread
  const mean = baseVal;
  const stdDev = (bullVal - bearVal) / 2.5; // Spread between bull and bear defines standard deviation
  
  const curvePoints: { x: number; y: number }[] = [];
  const steps = 60;
  const stepSize = (maxX - minX) / steps;
  
  let maxDensity = 0;
  // First calculate raw densities
  for (let i = 0; i <= steps; i++) {
    const val = minX + i * stepSize;
    // Gaussian formula
    const exponent = -0.5 * Math.pow((val - mean) / stdDev, 2);
    const density = Math.exp(exponent);
    if (density > maxDensity) maxDensity = density;
    curvePoints.push({ x: val, y: density });
  }

  // Map densities to screen Y coordinates (higher density = lower Y coordinate in SVG)
  const chartHeight = height - paddingTop - paddingBottom;
  const getY = (density: number) => {
    const scale = chartHeight / maxDensity;
    return height - paddingBottom - density * scale;
  };

  // Generate SVG path string
  const svgPath = curvePoints
    .map((p, idx) => {
      const xCoord = getX(p.x);
      const yCoord = getY(p.y);
      return `${idx === 0 ? 'M' : 'L'} ${xCoord} ${yCoord}`;
    })
    .join(' ');

  // Generate fill path closing at baseline
  const fillPath = `${svgPath} L ${getX(curvePoints[curvePoints.length - 1].x)} ${height - paddingBottom} L ${getX(curvePoints[0].x)} ${height - paddingBottom} Z`;

  // Key levels to mark
  const levels = [
    { label: 'Black Swan', value: blackSwanVal, color: 'var(--alert-red)', prob: simulations.blackSwan.probability },
    { label: 'Bear Case', value: bearVal, color: 'var(--alert-red-dim)', prob: simulations.bear.probability },
    { label: 'Base Case', value: baseVal, color: 'var(--cyberspace-blue)', prob: simulations.base.probability },
    { label: 'Bull Case', value: bullVal, color: 'var(--terminal-green)', prob: simulations.bull.probability },
  ];

  return (
    <div style={styles.container} className="glass-panel">
      <div style={styles.header}>
        <h3 style={styles.title}>MONTE CARLO PROBABILITY ENVELOPE</h3>
        <span style={styles.badge}>10,000 SIMS</span>
      </div>

      <div style={{ position: 'relative', width: '100%', overflow: 'visible' }}>
        <svg width="100%" height={height} style={{ overflow: 'visible' }} viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--cyberspace-blue)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--cyberspace-blue)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Baseline */}
          <line
            x1={paddingLeft}
            y1={height - paddingBottom}
            x2={width - paddingRight}
            y2={height - paddingBottom}
            stroke="var(--border-solid)"
            strokeWidth="1"
          />

          {/* Shaded probability distribution area */}
          <path d={fillPath} fill="url(#areaGradient)" />
          
          {/* Probability curve stroke */}
          <path d={svgPath} fill="none" stroke="var(--cyberspace-blue)" strokeWidth="2.5" />

          {/* Vertical trigger lines */}
          {levels.map((lvl, index) => {
            const xPos = getX(lvl.value);
            return (
              <g key={index}>
                {/* Dashed vertical marker */}
                <line
                  x1={xPos}
                  y1={paddingTop}
                  x2={xPos}
                  y2={height - paddingBottom}
                  stroke={lvl.color}
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />

                {/* Pulse dot at peak of line */}
                <circle
                  cx={xPos}
                  cy={height - paddingBottom}
                  r="3.5"
                  fill={lvl.color}
                />

                {/* Text tag */}
                <text
                  x={xPos}
                  y={paddingTop - 5}
                  fill={lvl.color}
                  fontSize="8"
                  fontFamily="var(--font-mono)"
                  textAnchor="middle"
                  style={{ fontWeight: 700 }}
                >
                  {lvl.label} ({lvl.prob}%)
                </text>

                {/* Price labels at bottom */}
                <text
                  x={xPos}
                  y={height - paddingBottom + 14}
                  fill="var(--text-secondary)"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                  textAnchor="middle"
                >
                  ${lvl.value.toFixed(0)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.colorDot, backgroundColor: 'var(--alert-red)' }} />
          <span>Tail Risk (-50% Drawdown)</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.colorDot, backgroundColor: 'var(--cyberspace-blue)' }} />
          <span>Intraday Base Target</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.colorDot, backgroundColor: 'var(--terminal-green)' }} />
          <span>Upside Scenario (+35%)</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    flex: 1,
    minWidth: '320px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '13px',
    letterSpacing: '0.05em',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
  },
  badge: {
    fontSize: '9px',
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
    color: 'var(--cyberspace-blue)',
    border: '1px solid rgba(0, 229, 255, 0.25)',
    borderRadius: '4px',
    padding: '2px 6px',
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
  },
  legend: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    color: 'var(--text-secondary)',
    borderTop: '1px solid var(--border-solid)',
    paddingTop: '12px',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  colorDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  }
};
