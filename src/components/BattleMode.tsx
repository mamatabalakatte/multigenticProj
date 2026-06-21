'use client';

import React, { useState } from 'react';
import { getCompanyMockData } from '@/lib/agents/prompts';
import { Shield, Sparkles, AlertCircle, Play, ChevronRight } from 'lucide-react';

export default function BattleMode() {
  const [tickerA, setTickerA] = useState('AAPL');
  const [tickerB, setTickerB] = useState('TSLA');
  
  const [dataA, setDataA] = useState<any>(null);
  const [dataB, setDataB] = useState<any>(null);
  const [battleEngaged, setBattleEngaged] = useState(false);

  const handleFight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tickerA.trim() || !tickerB.trim()) return;

    // Load data from generator
    const profileA = getCompanyMockData(tickerA);
    const profileB = getCompanyMockData(tickerB);

    setDataA(profileA);
    setDataB(profileB);
    setBattleEngaged(true);
  };

  const getDecisionColors = (decision: string) => {
    switch (decision) {
      case 'INVEST': return 'var(--terminal-green)';
      case 'PASS': return 'var(--alert-red)';
      case 'HOLD':
      default: return 'var(--gold)';
    }
  };

  return (
    <div style={styles.container} className="glass-panel">
      <div style={styles.header}>
        <h3 style={styles.title}>INVESTMENT BATTLE MODE</h3>
        <span style={styles.badge}>DIVERGENT COMPARISONS</span>
      </div>

      <p style={styles.description}>
        Select two corporate cores to compile side-by-side scorecards and compare relative asset values.
      </p>

      {/* Input panel */}
      <form onSubmit={handleFight} style={styles.form}>
        <div style={styles.inputWrapper}>
          <input
            type="text"
            value={tickerA}
            onChange={(e) => setTickerA(e.target.value.toUpperCase())}
            placeholder="TICKER A"
            style={styles.input}
          />
          <span style={styles.vsText}>VS</span>
          <input
            type="text"
            value={tickerB}
            onChange={(e) => setTickerB(e.target.value.toUpperCase())}
            placeholder="TICKER B"
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.fightBtn}>
          ENGAGE DUEL
          <Play size={10} style={{ marginLeft: '6px' }} />
        </button>
      </form>

      {/* Battle Results Grid */}
      {battleEngaged && dataA && dataB && (
        <div style={styles.resultsWrapper}>
          <div style={styles.table}>
            {/* Header row */}
            <div style={styles.rowHeader}>
              <div style={styles.colLabel}>COMPETITIVE MATRIX</div>
              <div style={styles.colA}>{dataA.companyName} ({dataA.ticker})</div>
              <div style={styles.colB}>{dataB.companyName} ({dataB.ticker})</div>
            </div>

            {/* Decision row */}
            <div style={styles.row}>
              <div style={styles.colLabel}>COMMITTEE RECOMMENDATION</div>
              <div style={{ ...styles.colA, fontWeight: 700, color: getDecisionColors(dataA.decision) }}>
                {dataA.decision}
              </div>
              <div style={{ ...styles.colB, fontWeight: 700, color: getDecisionColors(dataB.decision) }}>
                {dataB.decision}
              </div>
            </div>

            {/* Personality row */}
            <div style={styles.row}>
              <div style={styles.colLabel}>CORPORATE PROFILE</div>
              <div style={styles.colA}>{dataA.personality}</div>
              <div style={styles.colB}>{dataB.personality}</div>
            </div>

            {/* Price target row */}
            <div style={styles.row}>
              <div style={styles.colLabel}>CURRENT VALUE / INTRINSIC</div>
              <div style={styles.colA}>${dataA.dcfValuation.currentPrice.toFixed(0)} / ${dataA.dcfValuation.intrinsicValue.toFixed(0)}</div>
              <div style={styles.colB}>${dataB.dcfValuation.currentPrice.toFixed(0)} / ${dataB.dcfValuation.intrinsicValue.toFixed(0)}</div>
            </div>

            {/* Upside row */}
            <div style={styles.row}>
              <div style={styles.colLabel}>IMPLIED UPSIDE SPREAD</div>
              <div style={{ ...styles.colA, color: dataA.dcfValuation.upside >= 0 ? 'var(--terminal-green)' : 'var(--alert-red)' }}>
                {dataA.dcfValuation.upside >= 0 ? `+${dataA.dcfValuation.upside}%` : `${dataA.dcfValuation.upside}%`}
              </div>
              <div style={{ ...styles.colB, color: dataB.dcfValuation.upside >= 0 ? 'var(--terminal-green)' : 'var(--alert-red)' }}>
                {dataB.dcfValuation.upside >= 0 ? `+${dataB.dcfValuation.upside}%` : `${dataB.dcfValuation.upside}%`}
              </div>
            </div>

            {/* Moat rating */}
            <div style={styles.row}>
              <div style={styles.colLabel}>COMPETITIVE MOAT</div>
              <div style={styles.colA}>
                <div style={styles.scoreBarRow}>
                  <span>{dataA.dnaScores.moat}/100</span>
                  <div style={styles.barContainer}><div style={{ ...styles.barFill, width: `${dataA.dnaScores.moat}%`, backgroundColor: 'var(--cyberspace-blue)' }} /></div>
                </div>
              </div>
              <div style={styles.colB}>
                <div style={styles.scoreBarRow}>
                  <span>{dataB.dnaScores.moat}/100</span>
                  <div style={styles.barContainer}><div style={{ ...styles.barFill, width: `${dataB.dnaScores.moat}%`, backgroundColor: 'var(--cyberspace-blue)' }} /></div>
                </div>
              </div>
            </div>

            {/* Growth rating */}
            <div style={styles.row}>
              <div style={styles.colLabel}>GROWTH DRIVERS</div>
              <div style={styles.colA}>
                <div style={styles.scoreBarRow}>
                  <span>{dataA.dnaScores.growth}/100</span>
                  <div style={styles.barContainer}><div style={{ ...styles.barFill, width: `${dataA.dnaScores.growth}%`, backgroundColor: 'var(--terminal-green)' }} /></div>
                </div>
              </div>
              <div style={styles.colB}>
                <div style={styles.scoreBarRow}>
                  <span>{dataB.dnaScores.growth}/100</span>
                  <div style={styles.barContainer}><div style={{ ...styles.barFill, width: `${dataB.dnaScores.growth}%`, backgroundColor: 'var(--terminal-green)' }} /></div>
                </div>
              </div>
            </div>

            {/* Risk rating */}
            <div style={styles.row}>
              <div style={styles.colLabel}>RISK EXPOSURE</div>
              <div style={styles.colA}>
                <div style={styles.scoreBarRow}>
                  <span>{dataA.dnaScores.risk}/100</span>
                  <div style={styles.barContainer}><div style={{ ...styles.barFill, width: `${dataA.dnaScores.risk}%`, backgroundColor: 'var(--alert-red)' }} /></div>
                </div>
              </div>
              <div style={styles.colB}>
                <div style={styles.scoreBarRow}>
                  <span>{dataB.dnaScores.risk}/100</span>
                  <div style={styles.barContainer}><div style={{ ...styles.barFill, width: `${dataB.dnaScores.risk}%`, backgroundColor: 'var(--alert-red)' }} /></div>
                </div>
              </div>
            </div>

            {/* CEO Leadership */}
            <div style={styles.row}>
              <div style={styles.colLabel}>CEO LEADERSHIP INDEX</div>
              <div style={styles.colA}>{dataA.ceo.name} (Vision: {dataA.ceo.vision})</div>
              <div style={styles.colB}>{dataB.ceo.name} (Vision: {dataB.ceo.vision})</div>
            </div>

            {/* Outperformance forecast */}
            <div style={styles.row}>
              <div style={styles.colLabel}>5-YR OUTPERFORM FORECAST</div>
              <div style={styles.colA}>{dataA.probForecast.year5}% Probability</div>
              <div style={styles.colB}>{dataB.probForecast.year5}% Probability</div>
            </div>
          </div>
        </div>
      )}
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
    backgroundColor: 'rgba(224, 64, 251, 0.05)',
    color: '#e040fb',
    border: '1px solid rgba(224, 64, 251, 0.25)',
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
  form: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    minWidth: '220px',
  },
  input: {
    flex: 1,
    background: 'rgba(5, 7, 10, 0.5)',
    border: '1px solid var(--border-solid)',
    borderRadius: '4px',
    padding: '8px 12px',
    color: 'var(--text-primary)',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    outline: 'none',
  },
  vsText: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
  },
  fightBtn: {
    backgroundColor: 'rgba(224, 64, 251, 0.1)',
    color: '#e040fb',
    border: '1px solid rgba(224, 64, 251, 0.3)',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '11px',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    transition: 'all var(--transition-fast)',
    display: 'inline-flex',
    alignItems: 'center',
    outline: 'none',
  },
  resultsWrapper: {
    marginTop: '8px',
    border: '1px solid var(--border-solid)',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  table: {
    display: 'flex',
    flexDirection: 'column' as const,
    fontSize: '11px',
  },
  rowHeader: {
    display: 'flex',
    backgroundColor: 'rgba(5, 7, 10, 0.8)',
    borderBottom: '2px solid var(--border-solid)',
    padding: '10px 14px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  row: {
    display: 'flex',
    borderBottom: '1px solid var(--border-solid)',
    padding: '10px 14px',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 19, 33, 0.2)',
  },
  colLabel: {
    flex: 1.2,
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  colA: {
    flex: 1,
    textAlign: 'center' as const,
    color: 'var(--text-primary)',
    borderRight: '1px solid rgba(255,255,255,0.03)',
  },
  colB: {
    flex: 1,
    textAlign: 'center' as const,
    color: 'var(--text-primary)',
  },
  scoreBarRow: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
  },
  barContainer: {
    width: '60px',
    height: '3px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '1.5px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '1.5px',
  }
};
