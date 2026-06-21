'use client';

import React from 'react';
import { SentimentMetric } from '@/lib/agents/types';

interface SentimentGridProps {
  grid: SentimentMetric[];
}

export default function SentimentGrid({ grid }: SentimentGridProps) {
  const getColors = (label: 'Bullish' | 'Bearish' | 'Neutral') => {
    switch (label) {
      case 'Bullish':
        return {
          border: 'rgba(0, 255, 102, 0.25)',
          background: 'rgba(0, 255, 102, 0.04)',
          text: 'var(--terminal-green)',
          glow: 'var(--terminal-green-glow)'
        };
      case 'Bearish':
        return {
          border: 'rgba(255, 74, 74, 0.25)',
          background: 'rgba(255, 74, 74, 0.04)',
          text: 'var(--alert-red)',
          glow: 'var(--alert-red-glow)'
        };
      case 'Neutral':
      default:
        return {
          border: 'rgba(255, 179, 0, 0.25)',
          background: 'rgba(255, 179, 0, 0.04)',
          text: 'var(--gold)',
          glow: 'var(--gold-glow)'
        };
    }
  };

  return (
    <div style={styles.container} className="glass-panel">
      <div style={styles.header}>
        <h3 style={styles.title}>SENTIMENT & ALPHA GRID</h3>
        <span style={styles.badge}>MULTI-DIMENSIONAL VECTORS</span>
      </div>

      <div style={styles.grid}>
        {grid.map((item, idx) => {
          const colors = getColors(item.sentimentLabel);
          return (
            <div
              key={idx}
              style={{
                ...styles.card,
                borderColor: colors.border,
                backgroundColor: colors.background,
                boxShadow: `0 4px 12px ${colors.glow}`
              }}
            >
              <div style={styles.cardHeader}>
                <span style={styles.cardCategory}>{item.category.toUpperCase()}</span>
                <span style={{ ...styles.cardLabel, color: colors.text }}>
                  {item.sentimentLabel}
                </span>
              </div>

              <div style={styles.scoreRow}>
                <span style={styles.scoreNumber}>{item.sentimentScore}</span>
                <span style={styles.scoreScale}>/100 Index</span>
              </div>

              <div style={styles.signalContainer}>
                <div style={styles.signalLabelRow}>
                  <span>Signal Strength</span>
                  <span>{item.signalStrength}%</span>
                </div>
                <div style={styles.barTrack}>
                  <div
                    style={{
                      ...styles.barFill,
                      width: `${item.signalStrength}%`,
                      backgroundColor: colors.text
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '12px',
    flex: 1,
  },
  card: {
    border: '1px solid',
    borderRadius: '6px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    gap: '12px',
    transition: 'all var(--transition-fast)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '9px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
  },
  cardCategory: {
    color: 'var(--text-secondary)',
  },
  cardLabel: {
    letterSpacing: '0.02em',
  },
  scoreRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },
  scoreNumber: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
  },
  scoreScale: {
    fontSize: '10px',
    color: 'var(--text-muted)',
  },
  signalContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  signalLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '8px',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
  },
  barTrack: {
    height: '3px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '1.5px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '1.5px',
    transition: 'width 0.5s ease-out-in',
  }
};
