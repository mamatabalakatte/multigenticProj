'use client';

import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, ArrowDownRight, Compass, ShieldAlert } from 'lucide-react';

interface ImpactSimulatorProps {
  currentPrice: number;
  baseUpside: number;
}

export default function ImpactSimulator({ currentPrice, baseUpside }: ImpactSimulatorProps) {
  const [activeShock, setActiveShock] = useState<string | null>(null);

  const shocks = [
    { id: 'recession', label: 'Global Recession', desc: 'GDP growth halts. Valuation multiples compress by 25%; operating margins contract by 400bps.', growthMod: -30, marginMod: -4, waccMod: 0, multMod: -4 },
    { id: 'rateHike', label: 'Rate Hike (+250bps)', desc: 'Central banks raise baseline rates. WACC jumps from 8% to 10.5%, discounting present values.', growthMod: 0, marginMod: 0, waccMod: 2.5, multMod: -2 },
    { id: 'regulations', label: 'AI Regulations', desc: 'Compliance costs increase. Slows software pipeline velocities, dropping margins by 200bps.', growthMod: -15, marginMod: -2, waccMod: 0, multMod: 0 },
    { id: 'supplyChain', label: 'Supply Chain Shock', desc: 'Hardware bottlenecks delay shipments. EBIT margins hit by 450bps; risk index increases.', growthMod: -10, marginMod: -4.5, waccMod: 0, multMod: 0 },
    { id: 'oilShock', label: 'Oil Price Shock', desc: 'Energy costs surge. Operational expenses drag gross margins down by 300bps globally.', growthMod: -5, marginMod: -3, waccMod: 0.5, multMod: -1 }
  ];

  // Base DCF variables for recalculation
  const defaultGrowth = 10;
  const defaultMargin = 22;
  const defaultWacc = 8.5;
  const defaultMultiple = 18;

  const runStressedDCF = (shockId: string | null) => {
    let growth = defaultGrowth;
    let margin = defaultMargin;
    let wacc = defaultWacc;
    let multiple = defaultMultiple;

    if (shockId) {
      const shock = shocks.find(s => s.id === shockId);
      if (shock) {
        growth = defaultGrowth + shock.growthMod;
        if (growth < 1) growth = 1;
        margin = defaultMargin + shock.marginMod;
        wacc = defaultWacc + shock.waccMod;
        multiple = defaultMultiple + shock.multMod;
      }
    }

    // DCF Math Model
    const taxRate = 0.21;
    const baseRevenue = 1000;
    const capexNwcRate = 0.08;

    let revenue = baseRevenue;
    let pvSum = 0;
    for (let year = 1; year <= 5; year++) {
      revenue = revenue * (1 + growth / 100);
      const ebit = revenue * (margin / 100);
      const nopat = ebit * (1 - taxRate);
      const fcff = nopat - (revenue * capexNwcRate * 0.1);
      const df = Math.pow(1 + wacc / 100, year);
      pvSum += fcff / df;
    }

    const finalYearRevenue = revenue;
    const finalYearEbitda = finalYearRevenue * (margin / 100) * 1.15;
    const terminalValue = finalYearEbitda * multiple;
    const pvTerminalValue = terminalValue / Math.pow(1 + wacc / 100, 5);
    const totalEnterpriseValue = pvSum + pvTerminalValue;

    const defaultEV = 1250;
    const scalingFactor = currentPrice / defaultEV;
    
    const calculatedPrice = Math.round(totalEnterpriseValue * scalingFactor * 100) / 100;
    const calculatedUpside = Math.round(((calculatedPrice - currentPrice) / currentPrice) * 10000) / 100;

    return { price: calculatedPrice, upside: calculatedUpside };
  };

  const selectedShock = shocks.find(s => s.id === activeShock);
  const stressed = runStressedDCF(activeShock);

  return (
    <div style={styles.container} className="glass-panel">
      <div style={styles.header}>
        <h3 style={styles.title}>GLOBAL EVENT IMPACT SIMULATOR</h3>
        <span style={styles.badge}>STRESS TESTING</span>
      </div>

      <p style={styles.description}>
        Select a macroeconomic shock event to stress-test core valuations and review adjusted price targets.
      </p>

      {/* Selector Grid */}
      <div style={styles.triggerGrid}>
        {shocks.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveShock(activeShock === s.id ? null : s.id)}
            style={{
              ...styles.triggerBtn,
              borderColor: activeShock === s.id ? 'var(--alert-red)' : 'var(--border-solid)',
              backgroundColor: activeShock === s.id ? 'rgba(255, 74, 74, 0.05)' : 'rgba(5, 7, 10, 0.3)',
              color: activeShock === s.id ? 'var(--alert-red)' : 'var(--text-secondary)'
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Stress Results Display */}
      <div style={styles.resultsPanel}>
        {activeShock && selectedShock ? (
          <div>
            <div style={styles.warningHeader}>
              <AlertTriangle size={15} color="var(--alert-red)" style={{ marginRight: '6px' }} />
              <span style={styles.warningTitle}>{selectedShock.label.toUpperCase()} DETECTED</span>
            </div>
            
            <p style={styles.shockDesc}>{selectedShock.desc}</p>
            
            <div style={styles.metricsGrid}>
              <div style={styles.metricCard}>
                <span style={styles.metricLabel}>STRESSED PRICE TARGET</span>
                <span style={styles.metricPrice}>${stressed.price.toFixed(2)}</span>
              </div>
              
              <div style={styles.metricCard}>
                <span style={styles.metricLabel}>ADJUSTED VALUATION SPREAD</span>
                <span style={{
                  ...styles.metricUpside,
                  color: stressed.upside >= 0 ? 'var(--terminal-green)' : 'var(--alert-red)'
                }}>
                  {stressed.upside >= 0 ? `+${stressed.upside.toFixed(1)}%` : `${stressed.upside.toFixed(1)}%`}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.placeholder}>
            <Compass size={24} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
            <span>Select a shock trigger to initialize stress calculations.</span>
          </div>
        )}
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
    backgroundColor: 'rgba(255, 74, 74, 0.05)',
    color: 'var(--alert-red)',
    border: '1px solid rgba(255, 74, 74, 0.25)',
    borderRadius: '4px',
    padding: '2px 6px',
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
  },
  description: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
  },
  triggerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '8px',
  },
  triggerBtn: {
    background: 'none',
    border: '1px solid',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '10px',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    transition: 'all var(--transition-fast)',
    outline: 'none',
  },
  resultsPanel: {
    background: 'rgba(5, 7, 10, 0.5)',
    border: '1px solid var(--border-solid)',
    borderRadius: '6px',
    padding: '16px',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
  },
  warningHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '6px',
  },
  warningTitle: {
    fontSize: '10px',
    color: 'var(--alert-red)',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    letterSpacing: '0.05em',
  },
  shockDesc: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
    marginBottom: '14px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  metricCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
    borderLeft: '2px solid var(--border-solid)',
    paddingLeft: '10px',
  },
  metricLabel: {
    fontSize: '8px',
    color: 'var(--text-muted)',
    letterSpacing: '0.02em',
  },
  metricPrice: {
    fontSize: '15px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  metricUpside: {
    fontSize: '15px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    fontSize: '11px',
    color: 'var(--text-muted)',
  }
};
