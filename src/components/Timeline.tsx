'use client';

import React from 'react';
import { VerifiedSource } from '@/lib/agents/types';
import { Calendar, Search, ShieldCheck, CheckCircle } from 'lucide-react';

interface TimelineProps {
  logs: string[];
  sources: VerifiedSource[];
}

export default function Timeline({ logs, sources }: TimelineProps) {
  return (
    <div style={styles.container} className="glass-panel">
      <div style={styles.header}>
        <h3 style={styles.title}>EXPLAINABILITY TIMELINE & VERIFICATION</h3>
        <span style={styles.badge}>REASONING PATHWAY</span>
      </div>

      <div style={styles.splitGrid}>
        {/* Logs Timeline */}
        <div style={styles.column}>
          <h4 style={styles.sectionTitle}>Agent Operations Logs</h4>
          <div style={styles.timelineList}>
            {logs.map((log, idx) => (
              <div key={idx} style={styles.timelineItem}>
                <div style={styles.timelineMarker}>
                  <div style={styles.markerCircle}>
                    <CheckCircle size={10} color="var(--cyberspace-blue)" />
                  </div>
                  {idx !== logs.length - 1 && <div style={styles.markerLine} />}
                </div>
                <div style={styles.timelineContent}>
                  <p style={styles.logText}>{log}</p>
                  <span style={styles.logTime}>Step {idx + 1} completed</span>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <p style={styles.emptyText}>Await graph initialization sequence...</p>
            )}
          </div>
        </div>

        {/* Source Verification List */}
        <div style={styles.column}>
          <h4 style={styles.sectionTitle}>Verified Source Claims</h4>
          <div style={styles.sourcesList}>
            {sources.map((src, idx) => (
              <div key={idx} style={styles.sourceCard}>
                <div style={styles.sourceHeader}>
                  <span style={styles.sourceTag}>
                    <ShieldCheck size={12} style={{ marginRight: '4px' }} />
                    VERIFIED CLAIM
                  </span>
                  <span style={styles.confidenceGlow}>{src.confidence}% Confidence</span>
                </div>
                
                <p style={styles.claimText}>"{src.claim}"</p>
                
                <div style={styles.sourceFooter}>
                  <span style={styles.sourceLabel}>Source: {src.source}</span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.sourceLink}
                    className="source-link"
                  >
                    View Registry Document
                  </a>
                </div>
              </div>
            ))}
            {sources.length === 0 && (
              <p style={styles.emptyText}>Await verification sweeps...</p>
            )}
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
  splitGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  sectionTitle: {
    fontSize: '11px',
    letterSpacing: '0.05em',
    color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border-solid)',
    paddingBottom: '6px',
    fontFamily: 'var(--font-mono)',
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  timelineItem: {
    display: 'flex',
    gap: '12px',
  },
  timelineMarker: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  markerCircle: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border-color)',
  },
  markerLine: {
    width: '1px',
    flex: 1,
    backgroundColor: 'var(--border-color)',
    minHeight: '20px',
  },
  timelineContent: {
    paddingBottom: '12px',
  },
  logText: {
    fontSize: '12px',
    color: 'var(--text-primary)',
    lineHeight: 1.4,
  },
  logTime: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
  },
  sourcesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  sourceCard: {
    background: 'rgba(5, 7, 10, 0.4)',
    border: '1px solid var(--border-solid)',
    borderRadius: '6px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  sourceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sourceTag: {
    fontSize: '8px',
    fontWeight: 700,
    color: 'var(--terminal-green)',
    backgroundColor: 'var(--terminal-green-glow)',
    padding: '2px 6px',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
  },
  confidenceGlow: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--cyberspace-blue)',
    fontWeight: 700,
  },
  claimText: {
    fontSize: '11px',
    color: 'var(--text-primary)',
    fontStyle: 'italic',
    lineHeight: 1.4,
  },
  sourceFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '9px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '6px',
  },
  sourceLabel: {
    color: 'var(--text-secondary)',
  },
  sourceLink: {
    color: 'var(--cyberspace-blue)',
    textDecoration: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'color var(--transition-fast)',
  },
  emptyText: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  }
};
