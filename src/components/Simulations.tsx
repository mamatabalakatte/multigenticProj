'use client';

import React from 'react';
import { Simulations } from '@/lib/agents/types';
import { ShieldAlert, TrendingUp, Compass, Flame } from 'lucide-react';

interface SimulationsProps {
  simulations: Simulations;
}

export default function SimulationsComponent({ simulations }: SimulationsProps) {
  
  const getScenarioStyles = (key: string) => {
    switch (key) {
      case 'bull':
        return {
          border: 'rgba(0, 255, 102, 0.2)',
          bg: 'rgba(0, 255, 102, 0.02)',
          text: 'var(--terminal-green)',
          glow: 'var(--terminal-green-glow)',
          icon: <TrendingUp size={16} color="var(--terminal-green)" />
        };
      case 'bear':
        return {
          border: 'rgba(255, 74, 74, 0.25)',
          bg: 'rgba(255, 74, 74, 0.02)',
          text: 'var(--alert-red)',
          glow: 'var(--alert-red-glow)',
          icon: <ShieldAlert size={16} color="var(--alert-red)" />
        };
      case 'blackSwan':
        return {
          border: 'rgba(255, 110, 64, 0.3)',
          bg: 'rgba(255, 110, 64, 0.02)',
          text: '#ff6e40',
          glow: 'rgba(255, 110, 64, 0.1)',
          icon: <Flame size={16} color="#ff6e40" />
        };
      case 'base':
      default:
        return {
          border: 'rgba(0, 229, 255, 0.2)',
          bg: 'rgba(0, 229, 255, 0.02)',
          text: 'var(--cyberspace-blue)',
          glow: 'var(--cyberspace-blue-glow)',
          icon: <Compass size={16} color="var(--cyberspace-blue)" />
        };
    }
  };

  const cards = [
    { key: 'bull', label: 'Bull Case Scenario', data: simulations.bull },
    { key: 'base', label: 'Base Case Scenario', data: simulations.base },
    { key: 'bear', label: 'Bear Case Scenario', data: simulations.bear },
    { key: 'blackSwan', label: 'Black Swan Scenario', data: simulations.blackSwan },
  ];

  return (
    <div style={styles.container} className="glass-panel">
      <div style={styles.header}>
        <h3 style={styles.title}>PROJECTION SCENARIO MODELLING</h3>
        <span style={styles.badge}>FUTURE SIM ENGINE</span>
      </div>

      <div style={styles.grid}>
        {cards.map((card, idx) => {
          const stylesSce = getScenarioStyles(card.key);
          return (
            <div
              key={idx}
              style={{
                ...styles.card,
                borderColor: stylesSce.border,
                backgroundColor: stylesSce.bg,
                boxShadow: `0 4px 12px ${stylesSce.glow}`
              }}
            >
              <div style={styles.cardHeader}>
                <div style={styles.cardTitleGroup}>
                  {stylesSce.icon}
                  <span style={styles.cardLabel}>{card.label}</span>
                </div>
                <span style={{ ...styles.probabilityBadge, color: stylesSce.text, borderColor: stylesSce.border }}>
                  {card.data.probability}% Prob.
                </span>
              </div>

              <div style={styles.priceContainer}>
                <span style={styles.priceLabel}>TARGET PRICE</span>
                <span style={{ ...styles.priceValue, color: stylesSce.text }}>
                  ${card.data.priceTarget?.toFixed(2)}
                </span>
              </div>

              <p style={styles.desc}>{card.data.description}</p>

              <div style={styles.driversBox}>
                <span style={styles.driversTitle}>Key Model Drivers:</span>
                <ul style={styles.driversList}>
                  {card.data.drivers?.map((d, dIdx) => (
                    <li key={dIdx} style={styles.driverItem}>
                      <span style={{ ...styles.bulletPoint, backgroundColor: stylesSce.text }} />
                      {d}
                    </li>
                  ))}
                </ul>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  card: {
    border: '1px solid',
    borderRadius: '6px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  cardLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
  },
  probabilityBadge: {
    fontSize: '8px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    padding: '1px 5px',
    border: '1px solid',
    borderRadius: '3px',
  },
  priceContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottom: '1px solid var(--border-solid)',
    paddingBottom: '8px',
  },
  priceLabel: {
    fontSize: '9px',
    color: 'var(--text-secondary)',
    letterSpacing: '0.02em',
  },
  priceValue: {
    fontSize: '18px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
  },
  desc: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
    height: '42px',
    overflow: 'hidden',
  },
  driversBox: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  driversTitle: {
    fontSize: '9px',
    fontWeight: 700,
    color: 'var(--text-muted)',
    letterSpacing: '0.02em',
  },
  driversList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  driverItem: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    listStyleType: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  bulletPoint: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
  }
};
