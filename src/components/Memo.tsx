'use client';

import React from 'react';
import { Download, Printer } from 'lucide-react';

interface MemoProps {
  memoText: string;
  ticker: string;
}

export default function Memo({ memoText, ticker }: MemoProps) {
  
  // Custom simple Markdown-to-JSX renderer to avoid loading heavy react-markdown libraries
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith('# ')) {
        return <h1 key={idx} style={styles.h1}>{trimmed.replace('# ', '')}</h1>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} style={styles.h2}>{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} style={styles.h3}>{trimmed.replace('### ', '')}</h3>;
      }
      
      // Horizontal Rule
      if (trimmed === '---') {
        return <hr key={idx} style={styles.hr} />;
      }
      
      // Bold items in bullet points or lines
      let content: React.ReactNode = line;
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const bulletText = trimmed.replace(/^[\*\-]\s+/, '');
        return (
          <li key={idx} style={styles.li}>
            {parseBoldText(bulletText)}
          </li>
        );
      }
      
      if (trimmed === '') {
        return <div key={idx} style={{ height: '8px' }} />;
      }
      
      return <p key={idx} style={styles.p}>{parseBoldText(line)}</p>;
    });
  };

  // Helper to parse **bold** text in markdown lines
  const parseBoldText = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{part}</strong>;
      }
      return part;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={styles.container} className="glass-panel">
      <div style={styles.header} className="no-print">
        <h3 style={styles.title}>INSTITUTIONAL RESEARCH MEMORANDUM</h3>
        
        <div style={styles.actions}>
          <button onClick={handlePrint} style={styles.btn} className="print-pdf-btn">
            <Printer size={13} style={{ marginRight: '6px' }} />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* The Printable Paper Container */}
      <div style={styles.paper} className="memo-paper-contents">
        <div style={styles.watermark}>AI-IROS CLASSIFIED // PORTFOLIO INTEL</div>
        {renderMarkdown(memoText)}
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
    borderBottom: '1px solid var(--border-solid)',
    paddingBottom: '12px',
  },
  title: {
    fontSize: '13px',
    letterSpacing: '0.05em',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    border: '1px solid rgba(0, 229, 255, 0.3)',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--cyberspace-blue)',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    transition: 'all var(--transition-fast)',
    outline: 'none',
  },
  paper: {
    backgroundColor: 'rgba(5, 7, 10, 0.6)',
    border: '1px solid var(--border-solid)',
    borderRadius: '6px',
    padding: '30px',
    minHeight: '500px',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    lineHeight: 1.6,
    color: 'var(--text-secondary)',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute' as const,
    top: '15px',
    right: '15px',
    fontSize: '8px',
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
    fontWeight: 700,
    border: '1px solid var(--border-solid)',
    padding: '2px 6px',
    borderRadius: '3px',
  },
  h1: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '16px',
    letterSpacing: '-0.02em',
    fontFamily: 'var(--font-sans)',
    borderBottom: '2px solid var(--border-solid)',
    paddingBottom: '8px',
  },
  h2: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--cyberspace-blue)',
    marginTop: '20px',
    marginBottom: '10px',
    fontFamily: 'var(--font-sans)',
    letterSpacing: '0.02em',
  },
  h3: {
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginTop: '16px',
    marginBottom: '8px',
    fontFamily: 'var(--font-sans)',
  },
  p: {
    marginBottom: '12px',
    textAlign: 'justify' as const,
  },
  li: {
    marginLeft: '20px',
    marginBottom: '6px',
    listStyleType: 'square',
  },
  hr: {
    border: 'none',
    borderBottom: '1px solid var(--border-solid)',
    margin: '16px 0',
  }
};
