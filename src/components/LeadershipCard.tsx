'use client';

import React from 'react';
import { CEOIntelligence, FutureHeadlines } from '@/lib/agents/types';
import { Award, User, Flame, Compass, Target } from 'lucide-react';

interface LeadershipCardProps {
  ceo: CEOIntelligence;
  personality: string;
  headlines: FutureHeadlines;
}

export default function LeadershipCard({ ceo, personality, headlines }: LeadershipCardProps) {
  const getPersonalityColors = (pers: string) => {
    switch (pers) {
      case 'Visionary Innovator':
        return { text: 'var(--cyberspace-blue)', bg: 'rgba(0, 229, 255, 0.05)', border: 'rgba(0, 229, 255, 0.25)' };
      case 'Stable Compounder':
        return { text: 'var(--terminal-green)', bg: 'rgba(0, 255, 102, 0.05)', border: 'rgba(0, 255, 102, 0.25)' };
      case 'High-Risk Disruptor':
        return { text: '#ff6e40', bg: 'rgba(255, 110, 64, 0.05)', border: 'rgba(255, 110, 64, 0.25)' };
      case 'Fading Leader':
      default:
        return { text: 'var(--alert-red)', bg: 'rgba(255, 74, 74, 0.05)', border: 'rgba(255, 74, 74, 0.25)' };
    }
  };

  const colors = getPersonalityColors(personality);

  return (
    <div style={styles.container} className="glass-panel">
      <div style={styles.header}>
        <h3 style={styles.title}>LEADERSHIP & CORPORATE CHARACTER</h3>
        <span style={{
          ...styles.personalityBadge,
          color: colors.text,
          backgroundColor: colors.bg,
          borderColor: colors.border
        }}>
          {personality.toUpperCase()}
        </span>
      </div>

      <div style={styles.grid}>
        {/* CEO scores */}
        <div style={styles.ceoColumn}>
          <div style={styles.ceoHeader}>
            <User size={16} color="var(--cyberspace-blue)" style={{ marginRight: '6px' }} />
            <h4 style={styles.ceoName}>{ceo.name || 'Executive Chief'}</h4>
            <span style={styles.ceoTitle}>CEO</span>
          </div>

          <div style={styles.scoreList}>
            <div style={styles.scoreItem}>
              <div style={styles.scoreMeta}>
                <span>Vision Index</span>
                <span>{ceo.vision}/100</span>
              </div>
              <div style={styles.barTrack}><div style={{ ...styles.barFill, width: `${ceo.vision}%`, backgroundColor: 'var(--cyberspace-blue)' }} /></div>
            </div>

            <div style={styles.scoreItem}>
              <div style={styles.scoreMeta}>
                <span>Execution Index</span>
                <span>{ceo.execution}/100</span>
              </div>
              <div style={styles.barTrack}><div style={{ ...styles.barFill, width: `${ceo.execution}%`, backgroundColor: 'var(--terminal-green)' }} /></div>
            </div>

            <div style={styles.scoreItem}>
              <div style={styles.scoreMeta}>
                <span>Leadership Index</span>
                <span>{ceo.leadership}/100</span>
              </div>
              <div style={styles.barTrack}><div style={{ ...styles.barFill, width: `${ceo.leadership}%`, backgroundColor: 'var(--gold)' }} /></div>
            </div>
          </div>
        </div>

        {/* Future headlines */}
        <div style={styles.headlinesColumn}>
          <h4 style={styles.headlinesTitle}>HYPOTHETICAL FUTURE NEWS HEADLINES</h4>
          
          <div style={styles.headlineCard}>
            <span style={{ ...styles.headlineTag, color: 'var(--terminal-green)' }}>BULL MODEL</span>
            <p style={styles.headlineText}>"{headlines.bull || 'Company expands market outperformance via ecosystem scaling.'}"</p>
          </div>

          <div style={styles.headlineCard}>
            <span style={{ ...styles.headlineTag, color: 'var(--gold)' }}>BEAR MODEL</span>
            <p style={styles.headlineText}>"{headlines.bear || 'Operating margins contract as peer competition rises.'}"</p>
          </div>

          <div style={styles.headlineCard}>
            <span style={{ ...styles.headlineTag, color: 'var(--alert-red)' }}>TAIL RISK</span>
            <p style={styles.headlineText}>"{headlines.blackSwan || 'Critical hardware shortages halt product development.'}"</p>
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
  personalityBadge: {
    fontSize: '8px',
    border: '1px solid',
    borderRadius: '4px',
    padding: '2px 6px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  ceoColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    background: 'rgba(5, 7, 10, 0.4)',
    border: '1px solid var(--border-solid)',
    borderRadius: '6px',
    padding: '16px',
  },
  ceoHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  ceoName: {
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  ceoTitle: {
    fontSize: '8px',
    color: 'var(--text-muted)',
    border: '1px solid var(--border-solid)',
    borderRadius: '3px',
    padding: '1px 4px',
    marginLeft: '6px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
  },
  scoreList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  scoreItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  scoreMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
  },
  barTrack: {
    height: '4px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '2px',
  },
  headlinesColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  headlinesTitle: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    borderBottom: '1px solid var(--border-solid)',
    paddingBottom: '4px',
  },
  headlineCard: {
    background: 'rgba(5, 7, 10, 0.3)',
    border: '1px solid var(--border-solid)',
    borderRadius: '4px',
    padding: '8px 12px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  headlineTag: {
    fontSize: '7px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
  },
  headlineText: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
    lineHeight: 1.3,
  }
};
