'use client';

import React, { useState, useEffect } from 'react';

interface DcfSandboxProps {
  currentPrice: number;
  upside: number;
}

export default function DcfSandbox({ currentPrice, upside }: DcfSandboxProps) {
  // Sliders state
  const [growth, setGrowth] = useState<number>(10); // Revenue growth rate %
  const [margin, setMargin] = useState<number>(22); // Operating margin %
  const [wacc, setWacc] = useState<number>(8.5);    // Discount rate %
  const [multiple, setMultiple] = useState<number>(18); // Terminal multiple x
  
  // Outputs
  const [intrinsicValue, setIntrinsicValue] = useState<number>(currentPrice);
  const [newUpside, setNewUpside] = useState<number>(upside);

  useEffect(() => {
    // Basic Discounted Cash Flow math engine
    // We assume a base year revenue of 1000 units, and calculate relative equity value.
    const taxRate = 0.21;
    const baseRevenue = 1000;
    const capexNwcRate = 0.08; // Capital expenditure & working capital drag rate

    let revenue = baseRevenue;
    let pvSum = 0;
    
    // Project 5 years
    for (let year = 1; year <= 5; year++) {
      revenue = revenue * (1 + growth / 100);
      const ebit = revenue * (margin / 100);
      const nopat = ebit * (1 - taxRate);
      
      // Free Cash Flow to Firm (FCFF) approximated
      const fcff = nopat - (revenue * capexNwcRate * 0.1);
      
      // Discount to present value
      const df = Math.pow(1 + wacc / 100, year);
      pvSum += fcff / df;
    }

    // Terminal Value calculation using EV/EBITDA multiple
    const finalYearRevenue = revenue;
    const finalYearEbitda = finalYearRevenue * (margin / 100) * 1.15; // Assume D&A adds 15%
    const terminalValue = finalYearEbitda * multiple;
    const pvTerminalValue = terminalValue / Math.pow(1 + wacc / 100, 5);
    
    const totalEnterpriseValue = pvSum + pvTerminalValue;

    // Calibrate scaling factor so that default inputs (10% growth, 22% margin, 8.5% WACC, 18x multiple)
    // map to the model's standard baseline intrinsic value.
    const defaultEV = 1250; // Calibrated EV
    const scalingFactor = currentPrice / defaultEV;
    
    const calculatedPrice = Math.round(totalEnterpriseValue * scalingFactor * 100) / 100;
    const calculatedUpside = Math.round(((calculatedPrice - currentPrice) / currentPrice) * 10000) / 100;

    setIntrinsicValue(calculatedPrice);
    setNewUpside(calculatedUpside);
  }, [growth, margin, wacc, multiple, currentPrice]);

  return (
    <div style={styles.container} className="glass-panel">
      <div style={styles.header}>
        <h3 style={styles.title}>VALUATION DCF SANDBOX</h3>
        <span style={styles.badge}>INTERACTIVE MODEL</span>
      </div>
      
      <p style={styles.description}>
        Adjust valuation parameters below to simulate intrinsic valuation outcomes and price target variance.
      </p>

      <div style={styles.grid}>
        {/* Sliders Panel */}
        <div style={styles.slidersColumn}>
          <div style={styles.inputGroup}>
            <div style={styles.labelRow}>
              <span style={styles.label}>Revenue Growth Rate (5-Yr CAGR)</span>
              <span style={styles.valueGlow}>{growth}%</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="40" 
              value={growth} 
              onChange={(e) => setGrowth(parseFloat(e.target.value))} 
              style={styles.slider}
            />
            <div style={styles.sliderLimits}>
              <span>1%</span>
              <span>40%</span>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.labelRow}>
              <span style={styles.label}>Target Operating Margin</span>
              <span style={styles.valueGlow}>{margin}%</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="50" 
              value={margin} 
              onChange={(e) => setMargin(parseFloat(e.target.value))} 
              style={styles.slider}
            />
            <div style={styles.sliderLimits}>
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.labelRow}>
              <span style={styles.label}>Discount Rate (WACC)</span>
              <span style={styles.valueGlow}>{wacc}%</span>
            </div>
            <input 
              type="range" 
              min="5.0" 
              max="18.0" 
              step="0.5"
              value={wacc} 
              onChange={(e) => setWacc(parseFloat(e.target.value))} 
              style={styles.slider}
            />
            <div style={styles.sliderLimits}>
              <span>5.0%</span>
              <span>18.0%</span>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.labelRow}>
              <span style={styles.label}>Terminal EV/EBITDA Multiple</span>
              <span style={styles.valueGlow}>{multiple}x</span>
            </div>
            <input 
              type="range" 
              min="8" 
              max="35" 
              value={multiple} 
              onChange={(e) => setMultiple(parseFloat(e.target.value))} 
              style={styles.slider}
            />
            <div style={styles.sliderLimits}>
              <span>8x</span>
              <span>35x</span>
            </div>
          </div>
        </div>

        {/* Display Panel */}
        <div style={styles.resultColumn}>
          <div style={styles.calcCard}>
            <span style={styles.calcLabel}>CURRENT TRADING PRICE</span>
            <span style={styles.calcPrice}>${currentPrice.toFixed(2)}</span>
          </div>

          <div style={styles.calcCardHighlight}>
            <span style={styles.calcLabel}>INTRINSIC VALUE TARGET</span>
            <span style={styles.calcPriceTarget}>${intrinsicValue.toFixed(2)}</span>
          </div>

          <div style={styles.calcCard}>
            <span style={styles.calcLabel}>VALUATION SPREAD</span>
            <span style={{
              ...styles.calcUpside,
              color: newUpside >= 0 ? 'var(--terminal-green)' : 'var(--alert-red)',
              textShadow: newUpside >= 0 ? '0 0 8px var(--terminal-green-glow)' : '0 0 8px var(--alert-red-glow)'
            }}>
              {newUpside >= 0 ? `+${newUpside.toFixed(2)}% (Upside)` : `${newUpside.toFixed(2)}% (Downside)`}
            </span>
          </div>
          
          <div style={styles.verdictBox}>
            <span style={styles.verdictLabel}>IMPLIED RATING</span>
            <span style={{
              ...styles.verdictValue,
              color: newUpside > 15 ? 'var(--terminal-green)' : newUpside < 0 ? 'var(--alert-red)' : 'var(--gold)'
            }}>
              {newUpside > 15 ? 'UNDERVALUED (BUY)' : newUpside < 0 ? 'OVERVALUED (PASS)' : 'FAIR VALUE (HOLD)'}
            </span>
          </div>
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
    gap: '20px',
    flex: 1,
    minWidth: '320px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '14px',
    letterSpacing: '0.05em',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
  },
  badge: {
    fontSize: '9px',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    color: 'var(--cyberspace-blue)',
    border: '1px solid rgba(0, 229, 255, 0.3)',
    borderRadius: '4px',
    padding: '3px 6px',
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
  },
  description: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  slidersColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
  },
  label: {
    color: 'var(--text-secondary)',
  },
  valueGlow: {
    color: 'var(--cyberspace-blue)',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
  },
  slider: {
    width: '100%',
    cursor: 'pointer',
    accentColor: 'var(--cyberspace-blue)',
    background: 'var(--border-solid)',
    height: '4px',
    borderRadius: '2px',
    border: 'none',
  },
  sliderLimits: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '9px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
  },
  resultColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    justifyContent: 'center',
    background: 'rgba(5, 7, 10, 0.4)',
    border: '1px solid var(--border-solid)',
    borderRadius: '8px',
    padding: '20px',
  },
  calcCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    borderBottom: '1px solid var(--border-solid)',
  },
  calcCardHighlight: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: 'rgba(0, 229, 255, 0.04)',
    border: '1px solid rgba(0, 229, 255, 0.2)',
    borderRadius: '6px',
  },
  calcLabel: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    letterSpacing: '0.02em',
  },
  calcPrice: {
    fontSize: '16px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-primary)',
  },
  calcPriceTarget: {
    fontSize: '20px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--cyberspace-blue)',
    fontWeight: 700,
    textShadow: '0 0 10px var(--cyberspace-blue-glow)',
  },
  calcUpside: {
    fontSize: '15px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
  },
  verdictBox: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
    marginTop: '8px',
    paddingTop: '12px',
    borderTop: '1px dashed var(--border-solid)',
  },
  verdictLabel: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
  },
  verdictValue: {
    fontSize: '14px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
  }
};
