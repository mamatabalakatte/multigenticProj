'use client';

import React, { useState, useEffect } from 'react';
import Boardroom from '@/components/Boardroom';
import DnaRadar from '@/components/DnaRadar';
import DcfSandbox from '@/components/DcfSandbox';
import MonteCarlo from '@/components/MonteCarlo';
import SentimentGrid from '@/components/SentimentGrid';
import SimulationsComponent from '@/components/Simulations';
import Timeline from '@/components/Timeline';
import Memo from '@/components/Memo';
import KnowledgeGraph from '@/components/KnowledgeGraph';
import BattleMode from '@/components/BattleMode';
import ImpactSimulator from '@/components/ImpactSimulator';
import LeadershipCard from '@/components/LeadershipCard';
import { GraphState } from '@/lib/agents/types';
import { Search, Terminal, Database, Clock, RefreshCw, Activity, HeartCrack } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [ticker, setTicker] = useState('AAPL');
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');
  
  // Dashboard Data State
  const [state, setState] = useState<GraphState | null>(null);
  const [activeTab, setActiveTab] = useState<'boardroom' | 'dna' | 'scenarios' | 'sentiment' | 'graph' | 'battle' | 'timeline' | 'memo'>('boardroom');
  
  // Terminal Logs State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [systemTime, setSystemTime] = useState('');

  useEffect(() => {
    setSystemTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    setIsSearching(true);
    setErrorMessage(null);
    setCurrentStep('researchPlanner');
    setTerminalLogs([`Initializing 13-agent research scope for core ticker [${ticker.toUpperCase()}]...`]);
    setState(null);

    // Connect to Server Sent Events
    const eventSource = new EventSource(`/api/research?ticker=${ticker}`);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        
        if (payload.type === 'start') {
          setTerminalLogs(prev => [...prev, payload.message]);
        } else if (payload.type === 'step') {
          const stepData = payload.data;
          setCurrentStep(payload.step);
          
          setTerminalLogs(prev => [
            ...prev,
            ...stepData.logs.map((log: string) => `[${payload.step.toUpperCase()}] ${log}`)
          ]);

          setState(prev => {
            if (!prev) {
              return {
                ticker: ticker.toUpperCase(),
                companyName: stepData.companyName,
                currentStep: payload.step,
                logs: stepData.logs,
                debate: stepData.latestMessage ? [stepData.latestMessage] : [],
                dnaScores: stepData.dnaScores,
                simulations: stepData.simulations,
                sources: stepData.sources || [],
                peers: stepData.peers || [],
                alphaSignals: stepData.alphaSignals || [],
                dcfValuation: stepData.dcfValuation,
                sentimentGrid: stepData.sentimentGrid || [],
                decision: stepData.decision,
                confidence: stepData.confidence,
                memo: stepData.memo,
                
                // Advanced fields
                planner: stepData.planner,
                hypothesis: stepData.hypothesis,
                critique: stepData.critique,
                probForecast: stepData.probForecast,
                ceo: stepData.ceo,
                personality: stepData.personality,
                headlines: stepData.headlines,
                knowledgeGraph: stepData.knowledgeGraph,
              };
            }

            const updatedDebate = [...prev.debate];
            if (stepData.latestMessage && !updatedDebate.some(m => m.timestamp === stepData.latestMessage.timestamp)) {
              updatedDebate.push(stepData.latestMessage);
            }

            return {
              ...prev,
              currentStep: payload.step,
              logs: [...prev.logs, ...stepData.logs],
              debate: updatedDebate,
              dnaScores: stepData.dnaScores,
              simulations: stepData.simulations,
              sources: stepData.sources || prev.sources,
              peers: stepData.peers || prev.peers,
              alphaSignals: stepData.alphaSignals || prev.alphaSignals,
              dcfValuation: stepData.dcfValuation,
              sentimentGrid: stepData.sentimentGrid || prev.sentimentGrid,
              decision: stepData.decision,
              confidence: stepData.confidence,
              memo: stepData.memo,
              
              // Advanced fields
              planner: stepData.planner || prev.planner,
              hypothesis: stepData.hypothesis || prev.hypothesis,
              critique: stepData.critique || prev.critique,
              probForecast: stepData.probForecast || prev.probForecast,
              ceo: stepData.ceo || prev.ceo,
              personality: stepData.personality || prev.personality,
              headlines: stepData.headlines || prev.headlines,
              knowledgeGraph: stepData.knowledgeGraph || prev.knowledgeGraph,
            };
          });
        } else if (payload.type === 'complete') {
          setIsSearching(false);
          setCurrentStep('reportGenerator');
          setTerminalLogs(prev => [...prev, `[SYSTEM] Boardroom debate concluded. Dynamic research compiled.`]);
          eventSource.close();
        } else if (payload.type === 'error') {
          setErrorMessage(payload.message);
          setIsSearching(false);
          eventSource.close();
        }
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    eventSource.onerror = (err) => {
      setErrorMessage('Communication block with the intelligence core.');
      setIsSearching(false);
      eventSource.close();
    };
  };

  return (
    <div style={styles.appContainer} className="bg-obsidian min-h-screen text-slate-100 flex flex-col font-sans">
      <div className="grid-overlay" />
      
      {/* Bloomberg Status Header */}
      <header style={styles.header} className="no-print">
        <div style={styles.headerLeft}>
          <div style={styles.glowIndicator} />
          <h1 style={styles.logo}>AI-IROS <span style={styles.logoVersion}>v3.0.0</span></h1>
          <span style={styles.logoDivider}>|</span>
          <span style={styles.logoSubtitle}>QUANT MULTI-AGENT DEBATE ENGINE</span>
        </div>
        <div style={styles.headerRight}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '10px',
              color: 'var(--cyberspace-blue)',
              borderColor: 'var(--border-color)',
              borderWidth: '1px',
              borderStyle: 'solid',
              padding: '4px 8px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
              marginRight: '12px',
              backgroundColor: 'rgba(0, 229, 255, 0.05)',
            }}
          >
            AETHER-X OS ➔
          </Link>
          <div style={styles.metaItem}>
            <Database size={12} style={{ marginRight: '4px' }} />
            <span>TAVILY-SEC: ACTIVE</span>
          </div>
          <div style={styles.metaItem}>
            <Clock size={12} style={{ marginRight: '4px' }} />
            <span>SYS_TIME: {systemTime}</span>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <main style={styles.mainContent}>
        {/* Ticker Search Panel */}
        <section style={styles.searchPanel} className="glass-panel no-print">
          <form onSubmit={handleSearch} style={styles.form}>
            <div style={styles.inputContainer} className="search-input-container">
              <Search size={16} color="var(--text-secondary)" style={{ marginLeft: '12px' }} />
              <input
                type="text"
                placeholder="ENTER ENTITY TICKER (e.g. AAPL, TSLA, NVDA, RELIANCE, INFY)..."
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                disabled={isSearching}
                style={styles.searchInput}
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !ticker.trim()}
              style={{
                ...styles.searchBtn,
                backgroundColor: isSearching ? 'rgba(0, 229, 255, 0.05)' : 'var(--cyberspace-blue)',
                color: isSearching ? 'var(--cyberspace-blue)' : 'var(--bg-obsidian)',
                borderColor: isSearching ? 'var(--cyberspace-blue)' : 'transparent'
              }}
            >
              {isSearching ? (
                <>
                  <RefreshCw size={13} className="spin-animate" style={{ marginRight: '8px' }} />
                  DEBATING
                </>
              ) : (
                'INITIATE RESEARCH'
              )}
            </button>
          </form>

          {/* Quick recommendations helper for recruiters */}
          <div style={styles.quickPrompts}>
            <span style={styles.quickLabel}>CORES:</span>
            {['AAPL', 'TSLA', 'NVDA', 'RELIANCE', 'INFY'].map((t) => (
              <button
                key={t}
                onClick={() => setTicker(t)}
                disabled={isSearching}
                style={{
                  ...styles.quickBtn,
                  color: ticker === t ? 'var(--cyberspace-blue)' : 'var(--text-secondary)',
                  borderColor: ticker === t ? 'var(--cyberspace-blue)' : 'var(--border-solid)'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {errorMessage && (
          <div style={styles.errorAlert} className="glass-panel glow-red no-print">
            <HeartCrack size={18} style={{ marginRight: '10px' }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Dashboard Grid output */}
        {state ? (
          <div style={styles.dashboardLayout}>
            {/* Header Data Strip */}
            <div style={styles.dataStrip} className="glass-panel no-print">
              <div>
                <span style={styles.stripLabel}>COMPANY ENTITY</span>
                <h2 style={styles.stripValue}>{state.companyName || state.ticker}</h2>
              </div>
              <div>
                <span style={styles.stripLabel}>INTRINSIC VALUE</span>
                <h2 style={{ ...styles.stripValue, color: 'var(--cyberspace-blue)' }}>
                  {state.dcfValuation ? `$${state.dcfValuation.intrinsicValue.toFixed(2)}` : 'COMPILING...'}
                </h2>
              </div>
              <div>
                <span style={styles.stripLabel}>VALUATION SPREAD</span>
                <h2 style={{
                  ...styles.stripValue,
                  color: state.dcfValuation ? (state.dcfValuation.upside >= 0 ? 'var(--terminal-green)' : 'var(--alert-red)') : 'var(--text-muted)'
                }}>
                  {state.dcfValuation ? (state.dcfValuation.upside >= 0 ? `+${state.dcfValuation.upside.toFixed(1)}%` : `${state.dcfValuation.upside.toFixed(1)}%`) : 'COMPILING...'}
                </h2>
              </div>
              <div>
                <span style={styles.stripLabel}>Consensus decision</span>
                <h2 style={{
                  ...styles.stripValue,
                  color: state.decision === 'INVEST' ? 'var(--terminal-green)' : state.decision === 'PASS' ? 'var(--alert-red)' : 'var(--gold)'
                }}>
                  {state.decision}
                </h2>
              </div>
            </div>

            {/* Dashboard Tabs menu */}
            <div style={styles.tabsContainer} className="no-print">
              <button
                onClick={() => setActiveTab('boardroom')}
                style={{ ...styles.tabLink, color: activeTab === 'boardroom' ? 'var(--cyberspace-blue)' : 'var(--text-secondary)', borderBottomColor: activeTab === 'boardroom' ? 'var(--cyberspace-blue)' : 'transparent' }}
              >
                Boardroom Debate
              </button>
              <button
                onClick={() => setActiveTab('dna')}
                style={{ ...styles.tabLink, color: activeTab === 'dna' ? 'var(--cyberspace-blue)' : 'var(--text-secondary)', borderBottomColor: activeTab === 'dna' ? 'var(--cyberspace-blue)' : 'transparent' }}
              >
                DNA & Leadership
              </button>
              <button
                onClick={() => setActiveTab('scenarios')}
                style={{ ...styles.tabLink, color: activeTab === 'scenarios' ? 'var(--cyberspace-blue)' : 'var(--text-secondary)', borderBottomColor: activeTab === 'scenarios' ? 'var(--cyberspace-blue)' : 'transparent' }}
              >
                Simulations & Monte Carlo
              </button>
              <button
                onClick={() => setActiveTab('sentiment')}
                style={{ ...styles.tabLink, color: activeTab === 'sentiment' ? 'var(--cyberspace-blue)' : 'var(--text-secondary)', borderBottomColor: activeTab === 'sentiment' ? 'var(--cyberspace-blue)' : 'transparent' }}
              >
                Sentiment & Stress-Test
              </button>
              <button
                onClick={() => setActiveTab('graph')}
                style={{ ...styles.tabLink, color: activeTab === 'graph' ? 'var(--cyberspace-blue)' : 'var(--text-secondary)', borderBottomColor: activeTab === 'graph' ? 'var(--cyberspace-blue)' : 'transparent' }}
              >
                Ecosystem Graph
              </button>
              <button
                onClick={() => setActiveTab('battle')}
                style={{ ...styles.tabLink, color: activeTab === 'battle' ? 'var(--cyberspace-blue)' : 'var(--text-secondary)', borderBottomColor: activeTab === 'battle' ? 'var(--cyberspace-blue)' : 'transparent' }}
              >
                Battle Mode
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                style={{ ...styles.tabLink, color: activeTab === 'timeline' ? 'var(--cyberspace-blue)' : 'var(--text-secondary)', borderBottomColor: activeTab === 'timeline' ? 'var(--cyberspace-blue)' : 'transparent' }}
              >
                Timeline Logs
              </button>
              <button
                onClick={() => setActiveTab('memo')}
                style={{ ...styles.tabLink, color: activeTab === 'memo' ? 'var(--cyberspace-blue)' : 'var(--text-secondary)', borderBottomColor: activeTab === 'memo' ? 'var(--cyberspace-blue)' : 'transparent' }}
              >
                Institutional Memo
              </button>
            </div>

            {/* Active Tab View */}
            <div style={styles.viewPort}>
              {activeTab === 'boardroom' && (
                <div style={styles.singleView}>
                  <Boardroom
                    debate={state.debate}
                    currentStep={isSearching ? currentStep : ''}
                    decision={state.decision}
                    confidence={state.confidence}
                  />
                </div>
              )}

              {activeTab === 'dna' && (
                !state.dcfValuation || state.dcfValuation.currentPrice === 0 ? (
                  <div style={styles.loadingTab} className="glass-panel">
                    <RefreshCw size={24} className="spin-animate" style={{ color: 'var(--cyberspace-blue)', marginBottom: '12px' }} />
                    <span style={styles.loadingTabText}>[FINANCIAL ANALYST AGENT] is compiling corporate valuation models...</span>
                  </div>
                ) : (
                  <div style={styles.dualView}>
                    <div style={styles.colHalf} className="glass-panel flex flex-col justify-between">
                      <div style={{ padding: '24px' }}>
                        <h3 style={styles.colTitle}>INVESTMENT DNA VECTOR</h3>
                        <DnaRadar scores={state.dnaScores} />
                      </div>
                    </div>
                    <div style={styles.colHalf} className="flex flex-col gap-4">
                      <DcfSandbox
                        currentPrice={state.dcfValuation.currentPrice}
                        upside={state.dcfValuation.upside}
                      />
                      <LeadershipCard
                        ceo={state.ceo}
                        personality={state.personality}
                        headlines={state.headlines}
                      />
                    </div>
                  </div>
                )
              )}

              {activeTab === 'scenarios' && (
                !state.simulations || state.simulations.bull.priceTarget === 0 ? (
                  <div style={styles.loadingTab} className="glass-panel">
                    <RefreshCw size={24} className="spin-animate" style={{ color: 'var(--cyberspace-blue)', marginBottom: '12px' }} />
                    <span style={styles.loadingTabText}>[FUTURE SCENARIO SIMULATOR AGENT] is executing price paths...</span>
                  </div>
                ) : (
                  <div style={styles.dualView}>
                    <div style={styles.colHalf}>
                      <SimulationsComponent simulations={state.simulations} />
                    </div>
                    <div style={styles.colHalf}>
                      <MonteCarlo
                        simulations={state.simulations}
                        currentPrice={state.dcfValuation.currentPrice}
                      />
                    </div>
                  </div>
                )
              )}

              {activeTab === 'sentiment' && (
                !state.sentimentGrid || state.sentimentGrid.length === 0 ? (
                  <div style={styles.loadingTab} className="glass-panel">
                    <RefreshCw size={24} className="spin-animate" style={{ color: 'var(--cyberspace-blue)', marginBottom: '12px' }} />
                    <span style={styles.loadingTabText}>[NEWS & SENTIMENT ANALYST] is calculating headline vectors...</span>
                  </div>
                ) : (
                  <div style={styles.dualView}>
                    <div style={styles.colHalf}>
                      <SentimentGrid grid={state.sentimentGrid} />
                    </div>
                    <div style={styles.colHalf}>
                      <ImpactSimulator
                        currentPrice={state.dcfValuation.currentPrice}
                        baseUpside={state.dcfValuation.upside}
                      />
                    </div>
                  </div>
                )
              )}

              {activeTab === 'graph' && (
                !state.knowledgeGraph || state.knowledgeGraph.nodes.length === 0 ? (
                  <div style={styles.loadingTab} className="glass-panel">
                    <RefreshCw size={24} className="spin-animate" style={{ color: 'var(--cyberspace-blue)', marginBottom: '12px' }} />
                    <span style={styles.loadingTabText}>[HYPOTHESIS TESTING AGENT] is assembling the ecosystem graph...</span>
                  </div>
                ) : (
                  <div style={styles.dualView}>
                    <div className="glass-panel" style={{ ...styles.colHalf, padding: '24px' }}>
                      <h3 style={styles.colTitle}>ENTITY RELATIONSHIP KNOWLEDGE GRAPH</h3>
                      <p style={styles.colSubtitle}>Interactive map auditing structural connections of the corporate core.</p>
                      <KnowledgeGraph data={state.knowledgeGraph} />
                    </div>
                    
                    {/* Hypothesis Testing Panel */}
                    <div className="glass-panel flex flex-col gap-4" style={{ ...styles.colHalf, padding: '24px' }}>
                      <h3 style={styles.colTitle}>HYPOTHESIS TESTING SUMMARY</h3>
                      <div style={styles.hypoBox}>
                        <span style={styles.hypoLabel}>CORE STATEMENT</span>
                        <p style={styles.hypoText}>"{state.hypothesis.statement}"</p>
                      </div>
                      <div style={styles.hypoSplit}>
                        <div>
                          <span style={{ ...styles.hypoLabel, color: 'var(--terminal-green)' }}>SUPPORTING EVIDENCE</span>
                          <ul style={styles.hypoList}>
                            {state.hypothesis.evidence.map((ev, eIdx) => (
                              <li key={eIdx}>{ev}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span style={{ ...styles.hypoLabel, color: 'var(--alert-red)' }}>COUNTER EVIDENCE</span>
                          <ul style={styles.hypoList}>
                            {state.hypothesis.counters.map((cnt, cIdx) => (
                              <li key={cIdx}>{cnt}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {state.critique && (
                        <div style={styles.critiqueBox}>
                          <span style={styles.critiqueLabel}>DEVIL'S ADVOCATE CRITIQUE LOOP</span>
                          <p style={styles.critiqueText}>"{state.critique}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}

              {activeTab === 'battle' && (
                <div style={styles.singleView}>
                  <BattleMode />
                </div>
              )}

              {activeTab === 'timeline' && (
                <div style={styles.singleView}>
                  <Timeline logs={state.logs} sources={state.sources} />
                </div>
              )}

              {activeTab === 'memo' && (
                !state.memo ? (
                  <div style={styles.loadingTab} className="glass-panel">
                    <RefreshCw size={24} className="spin-animate" style={{ color: 'var(--cyberspace-blue)', marginBottom: '12px' }} />
                    <span style={styles.loadingTabText}>[REPORT GENERATOR AGENT] is compiling the institutional memo...</span>
                  </div>
                ) : (
                  <div style={styles.singleView}>
                    <Memo memoText={state.memo} ticker={state.ticker} />
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          /* Empty/Initial State Display */
          <div style={styles.emptyWelcome} className="glass-panel no-print">
            <Terminal size={40} color="var(--cyberspace-blue)" style={{ marginBottom: '16px' }} />
            <h2 style={styles.welcomeTitle}>ENTERPRISES AGENT MATRIX</h2>
            <p style={styles.welcomeDesc}>
              Initialize the AI Investment Research Operating System by providing a stock ticker. The 13-agent boardroom will execute a LangGraph analysis state-cycle and compile an institutional investment memo.
            </p>
          </div>
        )}

        {/* Real-time Streaming Logs Marquee console */}
        <section style={styles.consolePanel} className="glass-panel no-print">
          <div style={styles.consoleHeader}>
            <span style={styles.consoleTitle}>REALTIME SYSTEM DEBATE DECRYPTION CONSOLE</span>
            <div style={styles.blinkingRecord} />
          </div>
          <div style={styles.consoleLogs}>
            {terminalLogs.map((log, idx) => (
              <div key={idx} style={styles.consoleLine}>
                <span style={styles.consoleTimestamp}>[{new Date().toISOString().slice(11, 19)}]</span>
                <span style={styles.consoleText}>{log}</span>
              </div>
            ))}
            {terminalLogs.length === 0 && (
              <div style={styles.consoleLineMuted}>System idle. Input stock symbol to handshake logs...</div>
            )}
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin-animate {
          animation: spin 1s linear infinite;
        }
        @keyframes flash {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .flash-animate {
          animation: flash 1.5s infinite;
        }
        @keyframes dotFlashing {
          0% { background-color: var(--cyberspace-blue); }
          50%, 100% { background-color: rgba(0, 229, 255, 0.2); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'relative' as const,
    zIndex: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#05070a',
    borderBottom: '1px solid var(--border-solid)',
    fontFamily: 'var(--font-mono)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  glowIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--terminal-green)',
    boxShadow: '0 0 8px var(--terminal-green)',
  },
  logo: {
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: 'var(--text-primary)',
  },
  logoVersion: {
    fontSize: '9px',
    color: 'var(--text-muted)',
  },
  logoDivider: {
    color: 'var(--text-muted)',
  },
  logoSubtitle: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    letterSpacing: '0.05em',
  },
  headerRight: {
    display: 'flex',
    gap: '20px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '10px',
    color: 'var(--text-secondary)',
    letterSpacing: '0.02em',
  },
  mainContent: {
    flex: 1,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
  },
  searchPanel: {
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap' as const,
  },
  form: {
    display: 'flex',
    flex: 1,
    gap: '12px',
    minWidth: '280px',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(5, 7, 10, 0.6)',
    border: '1px solid var(--border-solid)',
    borderRadius: '4px',
    outline: 'none',
    transition: 'border var(--transition-fast)',
  },
  searchInput: {
    width: '100%',
    background: 'none',
    border: 'none',
    outline: 'none',
    padding: '10px 12px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    letterSpacing: '0.05em',
  },
  searchBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 20px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 700,
    cursor: 'pointer',
    border: '1px solid transparent',
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-mono)',
    transition: 'all var(--transition-fast)',
    outline: 'none',
  },
  quickPrompts: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  quickLabel: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
  },
  quickBtn: {
    background: 'rgba(5, 7, 10, 0.3)',
    border: '1px solid',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '10px',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    transition: 'all var(--transition-fast)',
    outline: 'none',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 18px',
    color: 'var(--alert-red)',
    fontSize: '13px',
  },
  emptyWelcome: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    padding: '60px 40px',
    gap: '12px',
    maxWidth: '650px',
    margin: '40px auto 0 auto',
  },
  welcomeTitle: {
    fontSize: '16px',
    letterSpacing: '0.1em',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-primary)',
  },
  welcomeDesc: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  dashboardLayout: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  dataStrip: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    padding: '16px 24px',
    gap: '16px',
  },
  stripLabel: {
    fontSize: '9px',
    color: 'var(--text-secondary)',
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-mono)',
    display: 'block',
    marginBottom: '4px',
  },
  stripValue: {
    fontSize: '18px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
  },
  tabsContainer: {
    display: 'flex',
    borderBottom: '1px solid var(--border-solid)',
    gap: '8px',
    overflowX: 'auto' as const,
  },
  tabLink: {
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    padding: '10px 16px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    fontFamily: 'var(--font-sans)',
    whiteSpace: 'nowrap' as const,
    outline: 'none',
  },
  viewPort: {
    minHeight: '400px',
  },
  singleView: {
    width: '100%',
  },
  dualView: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '16px',
  },
  colHalf: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    borderRadius: '8px',
  },
  colTitle: {
    fontSize: '13px',
    letterSpacing: '0.05em',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
    marginBottom: '6px',
  },
  colSubtitle: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
    marginBottom: '10px',
  },
  peersList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  peerCard: {
    background: 'rgba(5, 7, 10, 0.4)',
    border: '1px solid var(--border-solid)',
    borderRadius: '6px',
    padding: '12px',
  },
  peerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '10px',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    paddingBottom: '6px',
  },
  peerName: {
    fontSize: '12px',
    color: 'var(--text-primary)',
  },
  peerTicker: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--cyberspace-blue)',
    fontWeight: 700,
  },
  peerStats: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  peerLabel: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    display: 'block',
  },
  peerVal: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
    fontWeight: 700,
  },
  consolePanel: {
    background: 'rgba(5, 7, 10, 0.8)',
    border: '1px solid var(--border-solid)',
    fontFamily: 'var(--font-mono)',
    borderRadius: '6px',
  },
  consoleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: '#07090e',
    borderBottom: '1px solid var(--border-solid)',
  },
  consoleTitle: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
    fontWeight: 700,
  },
  blinkingRecord: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--alert-red)',
    boxShadow: '0 0 6px var(--alert-red)',
    animation: 'flash 1.5s infinite',
  },
  consoleLogs: {
    padding: '12px 16px',
    height: '110px',
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  consoleLine: {
    fontSize: '10px',
    color: 'var(--terminal-green)',
    lineHeight: 1.4,
  },
  consoleTimestamp: {
    color: 'var(--text-muted)',
    marginRight: '8px',
  },
  consoleText: {
    wordBreak: 'break-all' as const,
  },
  consoleLineMuted: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  hypoBox: {
    background: 'rgba(5, 7, 10, 0.3)',
    border: '1px solid var(--border-solid)',
    borderRadius: '4px',
    padding: '10px 14px',
  },
  hypoLabel: {
    fontSize: '8px',
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-mono)',
    display: 'block',
    marginBottom: '4px',
  },
  hypoText: {
    fontSize: '11px',
    color: 'var(--text-primary)',
    fontStyle: 'italic',
  },
  hypoSplit: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  hypoList: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
    paddingLeft: '14px',
    listStyleType: 'circle',
  },
  critiqueBox: {
    background: 'rgba(255, 74, 74, 0.03)',
    border: '1px solid rgba(255, 74, 74, 0.2)',
    borderRadius: '4px',
    padding: '10px 14px',
    marginTop: '6px',
  },
  critiqueLabel: {
    fontSize: '8px',
    color: 'var(--alert-red)',
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-mono)',
    display: 'block',
    marginBottom: '4px',
    fontWeight: 700,
  },
  critiqueText: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
  },
  loadingTab: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 40px',
    minHeight: '300px',
  },
  loadingTabText: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.02em',
  }
};
