'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AgentMessage } from '@/lib/agents/types';
import { Volume2, VolumeX, ShieldAlert, CheckCircle, Activity, Award } from 'lucide-react';

interface BoardroomProps {
  debate: AgentMessage[];
  currentStep: string;
  decision: 'INVEST' | 'HOLD' | 'PASS';
  confidence: number;
}

export default function Boardroom({ debate, currentStep, decision, confidence }: BoardroomProps) {
  const [isPlayingBrief, setIsPlayingBrief] = useState(false);
  const [speakingAgent, setSpeakingAgent] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    // Auto Scroll to latest message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [debate]);

  // Web Audio API Sound Synthesizer
  const playTerminalSound = (type: 'init' | 'complete' | 'click') => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'init') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'complete') {
        // Multi-frequency chime
        const playChime = (freq: number, start: number) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.frequency.setValueAtTime(freq, ctx.currentTime + start);
          g.gain.setValueAtTime(0.08, ctx.currentTime + start);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + 0.4);
          o.start(ctx.currentTime + start);
          o.stop(ctx.currentTime + start + 0.4);
        };
        playChime(523.25, 0); // C5
        playChime(659.25, 0.1); // E5
        playChime(783.99, 0.2); // G5
        playChime(1046.50, 0.3); // C6
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch (e) {
      console.warn('AudioContext not supported or blocked by user gesture', e);
    }
  };

  // Play audio clicking as messages arrive
  useEffect(() => {
    if (debate.length > 0) {
      playTerminalSound('click');
    }
  }, [debate.length]);

  // Handle TTS Audio Briefing
  const triggerAudioBrief = () => {
    if (!synthRef.current) return;

    if (isPlayingBrief) {
      synthRef.current.cancel();
      setIsPlayingBrief(false);
      setSpeakingAgent(null);
      return;
    }

    playTerminalSound('init');
    setIsPlayingBrief(true);
    
    // Build brief script
    const script = `AI Investment Research Operating System Consensus Brief. Target stock analysis yields a consensus recommendation of ${decision}, with a confidence index of ${confidence} percent. The Financial Analyst targets intrinsic value upside, while risk assessment registers supply chain and geopolitical pressure. The boardroom debate has concluded.`;

    const utterance = new SpeechSynthesisUtterance(script);
    
    // Choose a high-quality voice
    const voices = synthRef.current.getVoices();
    const systemVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.lang.startsWith('en'));
    if (systemVoice) utterance.voice = systemVoice;
    
    utterance.rate = 1.05;
    utterance.pitch = 0.9;
    
    utterance.onboundary = (event) => {
      // Rotate speaking agent visually for effect
      if (event.charIndex % 30 === 0) {
        const agents = ['Research Agent', 'Financial Analyst', 'News Analyst', 'Competitor Analyst', 'Risk Assessment', "Devil's Advocate", 'Investment Committee'];
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        setSpeakingAgent(randomAgent);
      }
    };

    utterance.onend = () => {
      setIsPlayingBrief(false);
      setSpeakingAgent(null);
      playTerminalSound('complete');
    };

    utterance.onerror = () => {
      setIsPlayingBrief(false);
      setSpeakingAgent(null);
    };

    synthRef.current.speak(utterance);
  };

  // Map Agent name to specific color styling
  const getAgentStyles = (name: string) => {
    switch (name) {
      case 'Research Agent':
        return { color: 'var(--cyberspace-blue)', bg: 'rgba(0, 229, 255, 0.08)' };
      case 'Financial Analyst':
        return { color: 'var(--terminal-green)', bg: 'rgba(0, 255, 102, 0.08)' };
      case 'News Analyst':
        return { color: '#e040fb', bg: 'rgba(224, 64, 251, 0.08)' };
      case 'Competitor Analyst':
        return { color: 'var(--gold)', bg: 'rgba(255, 179, 0, 0.08)' };
      case 'Risk Assessment':
        return { color: 'var(--alert-red)', bg: 'rgba(255, 74, 74, 0.08)' };
      case "Devil's Advocate":
        return { color: '#ff6e40', bg: 'rgba(255, 110, 64, 0.08)' };
      case 'Investment Committee':
      default:
        return { color: '#ffffff', bg: 'rgba(255, 255, 255, 0.1)' };
    }
  };

  const getDecisionStyles = (dec: string) => {
    switch (dec) {
      case 'INVEST':
        return { color: 'var(--terminal-green)', border: 'var(--terminal-green)', bg: 'rgba(0, 255, 102, 0.05)' };
      case 'PASS':
        return { color: 'var(--alert-red)', border: 'var(--alert-red)', bg: 'rgba(255, 74, 74, 0.05)' };
      case 'HOLD':
      default:
        return { color: 'var(--gold)', border: 'var(--gold)', bg: 'rgba(255, 179, 0, 0.05)' };
    }
  };

  const decisionStyles = getDecisionStyles(decision);

  return (
    <div style={styles.container} className="glass-panel">
      {/* Boardroom Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Activity size={16} className="terminal-cursor" style={{ marginRight: '8px' }} />
          <h3 style={styles.title}>AI DEBATE BOARDROOM</h3>
        </div>
        
        {debate.length > 0 && (
          <button onClick={triggerAudioBrief} style={{
            ...styles.audioBtn,
            borderColor: isPlayingBrief ? 'var(--terminal-green)' : 'rgba(0, 229, 255, 0.3)',
            color: isPlayingBrief ? 'var(--terminal-green)' : 'var(--cyberspace-blue)'
          }}>
            {isPlayingBrief ? <Volume2 size={13} style={{ marginRight: '6px' }} /> : <VolumeX size={13} style={{ marginRight: '6px' }} />}
            Consensus Briefing
          </button>
        )}
      </div>

      {/* Ticker Result Panel */}
      {decision && (
        <div style={{
          ...styles.decisionPanel,
          borderColor: decisionStyles.border,
          backgroundColor: decisionStyles.bg
        }}>
          <div style={styles.decisionLeft}>
            <Award size={20} color={decisionStyles.color} style={{ marginRight: '10px' }} />
            <div>
              <span style={styles.decisionSub}>COMMITTEE DECISION</span>
              <h2 style={{ ...styles.decisionMain, color: decisionStyles.color }}>{decision}</h2>
            </div>
          </div>
          <div style={styles.decisionRight}>
            <span style={styles.confidenceLabel}>CONFIDENCE RATING</span>
            <span style={{ ...styles.confidenceValue, color: decisionStyles.color }}>{confidence}%</span>
          </div>
        </div>
      )}

      {/* Dialogue Area */}
      <div style={styles.chatBox}>
        {debate.map((msg, index) => {
          const stylesAgent = getAgentStyles(msg.agent);
          const isSpeaking = speakingAgent === msg.agent;
          
          return (
            <div
              key={index}
              style={{
                ...styles.messageRow,
                borderLeft: `3px solid ${stylesAgent.color}`,
                backgroundColor: isSpeaking ? 'rgba(0, 229, 255, 0.03)' : 'transparent',
              }}
            >
              <div style={styles.agentMeta}>
                <span style={{ ...styles.agentName, color: stylesAgent.color }}>
                  {msg.agent.toUpperCase()}
                </span>
                {isSpeaking && <span style={styles.speakingIndicator}>SPEAKING...</span>}
              </div>
              <p style={styles.messageText}>{msg.text}</p>
            </div>
          );
        })}

        {/* Live typing indicator based on execution step */}
        {currentStep && currentStep !== 'committee' && (
          <div style={styles.typingIndicator}>
            <div style={styles.dotFlashing} />
            <span style={styles.typingText}>
              {currentStep.toUpperCase()} is compiling intelligence...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
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
    flex: 1.5,
    minWidth: '320px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-solid)',
    paddingBottom: '12px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: '13px',
    letterSpacing: '0.05em',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
  },
  audioBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
    border: '1px solid',
    borderRadius: '4px',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    transition: 'all var(--transition-fast)',
    outline: 'none',
  },
  decisionPanel: {
    border: '1px solid',
    borderRadius: '6px',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  decisionLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  decisionSub: {
    fontSize: '9px',
    color: 'var(--text-secondary)',
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-mono)',
  },
  decisionMain: {
    fontSize: '26px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-mono)',
  },
  decisionRight: {
    textAlign: 'right' as const,
  },
  confidenceLabel: {
    fontSize: '9px',
    color: 'var(--text-secondary)',
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-mono)',
  },
  confidenceValue: {
    display: 'block',
    fontSize: '26px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
  },
  chatBox: {
    flex: 1,
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    maxHeight: '400px',
    paddingRight: '6px',
    background: 'rgba(5, 7, 10, 0.3)',
    border: '1px solid var(--border-solid)',
    borderRadius: '6px',
    padding: '16px',
  },
  messageRow: {
    padding: '10px 14px',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    transition: 'background var(--transition-fast)',
  },
  agentMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  agentName: {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-mono)',
  },
  speakingIndicator: {
    fontSize: '8px',
    fontWeight: 700,
    backgroundColor: 'var(--terminal-green-glow)',
    color: 'var(--terminal-green)',
    padding: '1px 4px',
    borderRadius: '2px',
    letterSpacing: '0.05em',
  },
  messageText: {
    fontSize: '12px',
    color: 'var(--text-primary)',
    lineHeight: 1.55,
    fontFamily: 'var(--font-sans)',
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
  },
  dotFlashing: {
    position: 'relative' as const,
    width: '6px',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: 'var(--cyberspace-blue)',
    color: 'var(--cyberspace-blue)',
    animation: 'dotFlashing 1s infinite linear alternate',
  },
  typingText: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
  },
  emptyText: {
    textAlign: 'center' as const,
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '40px',
  }
};
