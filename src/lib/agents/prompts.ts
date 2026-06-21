import { GraphState, AgentMessage, DnaScores, Simulations, VerifiedSource, CompetitorPeer, AlphaSignal, SentimentMetric, CEOIntelligence, FutureHeadlines, KnowledgeGraphData } from './types';

export const AGENT_SYSTEM_PROMPTS = {
  ResearchPlanner: "Create dynamic research scope, search parameters, and priority sources for target equity.",
  CompanyResearch: "Review general profile, core business model, and sector growth factors.",
  FinancialAnalyst: "Benchmark liquidity, margins, multiples, and intrinsic value.",
  NewsIntelligence: "Synthesize headlines, PR announcements, and net public sentiment.",
  CompetitorIntelligence: "Benchmark operating metrics directly against core industry peers.",
  RiskAssessment: "Identify legal, regulatory, supply chain, and macro downside exposures.",
  HiddenAlpha: "Spot hidden momentum indicators from patent filings and high-end recruiting lists.",
  HypothesisTesting: "Generate and stress-test core investment thesis structures, detailing supporting and counter-evidence.",
  DevilsAdvocate: "Systematically dispute the prevailing consensus. Spot structural flaws and hidden risks.",
  Verification: "Audit all factual statements, verify data sources, and score credibility.",
  FutureSimulator: "Calculate probability targets for Bull, Bear, Base, and Black Swan projections.",
  InvestmentCommittee: "Moderate boardroom vote count, consensus decision, and confidence rating.",
  ReportGenerator: "Compile research outputs into a formal institutional investment memo."
};

export function getCompanyMockData(ticker: string): Partial<GraphState> {
  const t = ticker.toUpperCase().trim();
  
  // Base Defaults
  let name = 'Alpha Innovations Corp';
  let sector = 'Technology';
  let price = 100.00;
  let summary = 'A next-generation enterprise technology provider specializing in AI automation, cloud orchestration, and cyber-security software.';
  let personality: 'Visionary Innovator' | 'Stable Compounder' | 'High-Risk Disruptor' | 'Fading Leader' = 'Visionary Innovator';
  let ceo: CEOIntelligence = { name: 'Sarah Vance', vision: 88, execution: 82, leadership: 85 };
  let headlines: FutureHeadlines = {
    bull: 'Sarah Vance Announces Quantum Cloud Partnership, Shares Skyrocket',
    bear: 'Antitrust Inquiries Open on Enterprise App Ecosystem Integration',
    blackSwan: 'Zero-Day Flaw in Cloud Infrastructure Forces Product Suspension'
  };

  let dna: DnaScores = { moat: 75, risk: 40, growth: 80, innovation: 85, leadership: 78, stability: 70 };
  let probForecast = { year1: 65, year3: 72, year5: 80 };

  // Profile overrides for specific tickers
  if (t === 'AAPL' || t === 'APPLE') {
    name = 'Apple Inc.';
    sector = 'Consumer Technology';
    price = 185.30;
    summary = 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide, while expanding its services ecosystem.';
    personality = 'Stable Compounder';
    ceo = { name: 'Tim Cook', vision: 85, execution: 96, leadership: 94 };
    headlines = {
      bull: 'Apple Unveils HoloGlass OS Integrated with Generative Spatial Computing',
      bear: 'EU Antitrust Commission Orders Complete Core iOS App Store Unbundling',
      blackSwan: 'Geopolitical Gridlocks Suspend Assembly at Primary Foxconn Hubs'
    };
    dna = { moat: 92, risk: 22, growth: 68, innovation: 84, leadership: 90, stability: 92 };
    probForecast = { year1: 72, year3: 84, year5: 89 };
  } else if (t === 'TSLA' || t === 'TESLA') {
    name = 'Tesla, Inc.';
    sector = 'Automotive & Clean Energy';
    price = 178.20;
    summary = 'Tesla, Inc. designs, develops, manufactures, sells, and leases fully electric vehicles, energy generation and storage systems, and offers services related to its products.';
    personality = 'High-Risk Disruptor';
    ceo = { name: 'Elon Musk', vision: 98, execution: 84, leadership: 80 };
    headlines = {
      bull: 'Tesla Autonomous Robotaxi Fleet Receives Level 4 Regulatory Clearance',
      bear: 'Lithium Sub-Component Supply Crash Halts Production Lines',
      blackSwan: 'Autopilot Operating Code Leaks; Total Fleet Recall Triggered'
    };
    dna = { moat: 78, risk: 65, growth: 88, innovation: 95, leadership: 85, stability: 52 };
    probForecast = { year1: 58, year3: 69, year5: 78 };
  } else if (t === 'NVDA' || t === 'NVIDIA') {
    name = 'NVIDIA Corporation';
    sector = 'Semiconductors & AI Hardware';
    price = 127.40;
    summary = 'NVIDIA Corporation focuses on graphics processing units (GPUs) and AI computing solutions, cloud supercomputing, and autonomous vehicle chips.';
    personality = 'Visionary Innovator';
    ceo = { name: 'Jensen Huang', vision: 97, execution: 94, leadership: 96 };
    headlines = {
      bull: 'NVIDIA Rubydium AI Chip Shipments Beat Outlook by 45%',
      bear: 'TSMC Silicon Wafer Shortages Throttle Next-Gen Chip Production',
      blackSwan: 'Global AI Cloud Infrastructure Capex Freezes; GPU Demand Collapses'
    };
    dna = { moat: 95, risk: 45, growth: 96, innovation: 98, leadership: 92, stability: 74 };
    probForecast = { year1: 85, year3: 88, year5: 91 };
  } else if (t === 'RELIANCE' || t === 'RELI') {
    name = 'Reliance Industries Limited';
    sector = 'Energy, Retail & Telecom';
    price = 2850.00;
    summary = 'Reliance Industries is an Indian multinational conglomerate headquartered in Mumbai, with businesses spanning energy, petrochemicals, natural gas, retail, telecommunications, and media.';
    personality = 'Stable Compounder';
    ceo = { name: 'Mukesh Ambani', vision: 90, execution: 94, leadership: 95 };
    headlines = {
      bull: 'Reliance Jio AI Infrastructure Spawns 200M Active Subscribers in Asia',
      bear: 'Global Petrochemical Margin Cracks Put Oil-to-Chemical Earnings in Cycle Dip',
      blackSwan: 'Geopolitical Unrest Halts Middle-East Crude Shipments to Gujarat Refineries'
    };
    dna = { moat: 88, risk: 28, growth: 74, innovation: 80, leadership: 92, stability: 88 };
    probForecast = { year1: 78, year3: 82, year5: 86 };
  } else if (t === 'INFY' || t === 'INFOSYS') {
    name = 'Infosys Limited';
    sector = 'IT Services & Consulting';
    price = 1480.00;
    summary = 'Infosys is a global leader in next-generation digital services and consulting, helping enterprises navigate their digital transformation journeys across 50+ countries.';
    personality = 'Stable Compounder';
    ceo = { name: 'Salil Parekh', vision: 82, execution: 90, leadership: 88 };
    headlines = {
      bull: 'Infosys Secures $3.2B Enterprise AI Migration Contract with EU Consortium',
      bear: 'US Financial Services Sector Cuts IT Discretionary Spend; Margins Contract',
      blackSwan: 'Severe Intellectual Property Security Breach Compromises Core Banking Client Data'
    };
    dna = { moat: 82, risk: 24, growth: 65, innovation: 74, leadership: 86, stability: 90 };
    probForecast = { year1: 70, year3: 78, year5: 82 };
  }

  // Simulations
  const basePrice = price;
  const simulations: Simulations = {
    bull: {
      priceTarget: Math.round(basePrice * 1.35 * 100) / 100,
      probability: 30,
      description: 'Ecosystem expansion beats forecast, driving high operating margins and margin expansions.',
      drivers: ['Strong product adoption', '200bps gross margin increase', 'Share buybacks accelerated']
    },
    base: {
      priceTarget: Math.round(basePrice * 1.08 * 100) / 100,
      probability: 50,
      description: 'Alings with historical metrics and executive guidance.',
      drivers: ['Standard organic revenue CAGR', 'Stable leverage', 'Sector trends align with guidance']
    },
    bear: {
      priceTarget: Math.round(basePrice * 0.78 * 100) / 100,
      probability: 15,
      description: 'Regulatory challenges delay launches; macro spend contracts in core sectors.',
      drivers: ['GDP growth deceleration', 'Antitrust fine structures', 'Valuation multiple contraction']
    },
    blackSwan: {
      priceTarget: Math.round(basePrice * 0.45 * 100) / 100,
      probability: 5,
      description: 'Severe supply chain interruption or cyber zero-day security failure.',
      drivers: ['Geopolitical trade blocks', 'Zero-day security breaches', 'Key asset write-downs']
    }
  };

  // Verified Sources
  const sources: VerifiedSource[] = [
    { claim: `${name} reported Q1 revenue growth of ${dna.growth - 10}% YoY.`, source: 'SEC Form 10-Q / BSE Filings', url: 'https://sec.gov/edgar', confidence: 99, verified: true },
    { claim: `Research and Development budget expanded to support next-gen architecture optimization.`, source: 'Investor Day Presentation', url: 'https://investorrelations.com', confidence: 95, verified: true },
    { claim: `Market share vs primary competitors remained stable.`, source: 'Gartner Market Share Report', url: 'https://gartner.com', confidence: 90, verified: true }
  ];

  // Competitor Peers
  const peers: CompetitorPeer[] = [
    { name: t === 'AAPL' ? 'Alphabet Inc.' : t === 'TSLA' ? 'BYD Company' : t === 'NVDA' ? 'AMD Inc.' : t === 'RELI' ? 'Adani Green' : 'TCS Ltd.', ticker: t === 'AAPL' ? 'GOOGL' : t === 'TSLA' ? 'BYDDY' : t === 'NVDA' ? 'AMD' : t === 'RELI' ? 'ADANIGR' : 'TCS', marketCap: t === 'RELI' ? '₹1.5T' : '$1.8T', peRatio: '24.2', growth: '12%', score: 85 },
    { name: t === 'AAPL' ? 'Samsung Electronics' : t === 'TSLA' ? 'Toyota Motor' : t === 'NVDA' ? 'Intel Corp.' : t === 'RELI' ? 'ONGC' : 'Wipro Ltd.', ticker: t === 'AAPL' ? 'SSNLF' : t === 'TSLA' ? 'TM' : t === 'NVDA' ? 'INTC' : t === 'RELI' ? 'ONGC' : 'WIT', marketCap: t === 'RELI' ? '₹850B' : '$380B', peRatio: '14.5', growth: '6%', score: 72 }
  ];

  // Alpha Signals
  const alphaSignals: AlphaSignal[] = [
    { category: 'Hiring', signal: '45% increase in specialist AI compiler engineer listings.', impact: 'High', sentiment: 'Bullish', details: 'Indicates massive ramp-up in custom architecture development.' },
    { category: 'Patents', signal: 'Granted 18 patents on model weight compression.', impact: 'Medium', sentiment: 'Bullish', details: 'Secures edge execution IP, bolstering software moat.' },
    { category: 'Product Launches', signal: 'Beta release of developer SDK platform.', impact: 'High', sentiment: 'Bullish', details: 'Speeds up onboarding and lock-in of enterprise clients.' }
  ];

  // Sentiment Grid
  const sentimentGrid: SentimentMetric[] = [
    { category: 'Financials', sentimentScore: Math.round(dna.stability * 0.9 + 10), sentimentLabel: dna.stability > 70 ? 'Bullish' : 'Neutral', signalStrength: 85 },
    { category: 'ESG', sentimentScore: 68, sentimentLabel: 'Neutral', signalStrength: 60 },
    { category: 'Leadership', sentimentScore: dna.leadership, sentimentLabel: dna.leadership > 80 ? 'Bullish' : 'Neutral', signalStrength: 75 },
    { category: 'Innovation', sentimentScore: dna.innovation, sentimentLabel: dna.innovation > 80 ? 'Bullish' : 'Neutral', signalStrength: 90 },
    { category: 'Macro', sentimentScore: Math.round(100 - dna.risk), sentimentLabel: dna.risk < 30 ? 'Bullish' : dna.risk > 60 ? 'Bearish' : 'Neutral', signalStrength: 65 },
    { category: 'Competitors', sentimentScore: dna.moat, sentimentLabel: dna.moat > 85 ? 'Bullish' : 'Neutral', signalStrength: 80 }
  ];

  // Intrinsic DCF
  const intrinsicValue = Math.round(price * (dna.moat > 80 ? 1.18 : 0.94) * 100) / 100;
  const dcfValuation = {
    intrinsicValue,
    currentPrice: price,
    upside: Math.round(((intrinsicValue - price) / price) * 10000) / 100
  };

  // Decision & Confidence
  let decision: 'INVEST' | 'HOLD' | 'PASS' = 'HOLD';
  let confidence = 75;
  if (dcfValuation.upside > 15 && dna.risk < 50 && dna.moat > 80) {
    decision = 'INVEST';
    confidence = Math.round(80 + dcfValuation.upside / 3);
  } else if (dcfValuation.upside < -5 || dna.risk > 60) {
    decision = 'PASS';
    confidence = Math.round(75 + dna.risk / 4);
  }
  if (confidence > 98) confidence = 98;

  // Knowledge Graph Data
  const knowledgeGraph: KnowledgeGraphData = {
    nodes: [
      { id: 'company', label: name, group: 'company', details: `The core corporate entity trading as ${t}.` },
      { id: 'ceo', label: ceo.name, group: 'executive', details: `CEO who manages operation, scores: Vision: ${ceo.vision}, Execution: ${ceo.execution}.` },
      { id: 'peer1', label: peers[0].name, group: 'competitor', details: `Primary market competitor with market cap of ${peers[0].marketCap}.` },
      { id: 'peer2', label: peers[1].name, group: 'competitor', details: `Secondary peer operating in the same sector.` },
      { id: 'supplier1', label: t === 'AAPL' || t === 'NVDA' ? 'TSMC' : t === 'TSLA' ? 'Panasonic' : 'Global Cloud Networks', group: 'supplier', details: 'Critical component manufacturer representing key supply chain node.' },
      { id: 'risk1', label: t === 'AAPL' ? 'App Store Antitrust' : t === 'TSLA' ? 'Autopilot Regulation' : 'Chip Export Ban', group: 'risk', details: 'Tail-risk flagged by Risk Analyst representing regulatory exposure.' },
      { id: 'product1', label: t === 'AAPL' ? 'iPhone Pro' : t === 'TSLA' ? 'Model Y' : 'Enterprise Cloud SDK', group: 'product', details: 'Flagship product category representing primary revenue stream.' }
    ],
    links: [
      { source: 'company', target: 'ceo', relation: 'Managed By' },
      { source: 'company', target: 'peer1', relation: 'Competes With' },
      { source: 'company', target: 'peer2', relation: 'Competes With' },
      { source: 'company', target: 'supplier1', relation: 'Supplied By' },
      { source: 'company', target: 'risk1', relation: 'Exposed To' },
      { source: 'company', target: 'product1', relation: 'Produces' },
      { source: 'ceo', target: 'product1', relation: 'Spearheaded' }
    ]
  };

  // Debate Transcript for all 13 Agents
  const debate: AgentMessage[] = [
    {
      agent: 'Research Planner Agent',
      text: `Scanning databases for ticker [${t}]. Custom query strategy: priority sources defined as SEC files and industry benchmark directories. Research pipeline configured.`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 1200000).toISOString()
    },
    {
      agent: 'Company Research Agent',
      text: `Entity verified: ${name}. General profile indicates a ${personality.toLowerCase()} specializing in ${sector}. Stable business model with clear catalysts.`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 1100000).toISOString()
    },
    {
      agent: 'Financial Analyst Agent',
      text: `Valuation dashboard is active. Current price is $${price.toFixed(2)}. Based on current cash flows, WACC of 8.0%, and operating margins of ${dna.stability - 50 + 20}%, intrinsic valuation is plotted at $${intrinsicValue.toFixed(2)} (+${dcfValuation.upside}% upside). Balance sheet leverages positive cash flow structures.`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 1000000).toISOString()
    },
    {
      agent: 'News Intelligence Agent',
      text: `Headline sweep completed. Net public sentiment score registered at ${sentimentGrid[2].sentimentScore}/100. Press releases concerning product launches have triggered bullish indicators, though regulatory chatter dampens short-term momentum.`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 900000).toISOString()
    },
    {
      agent: 'Competitor Intelligence Agent',
      text: `Primary benchmarking competitor defined as ${peers[0].name} (${peers[0].ticker}). Peer scorecard ranks ${name} above peer average in gross margin efficiency. Moat score registered at ${dna.moat}/100.`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 800000).toISOString()
    },
    {
      agent: 'Risk Assessment Agent',
      text: `Attention: legal and supply chain tail-risks are active. Geopolitical friction points to semiconductor assembly dependencies. If hardware blocks occur, EBIT margins compress by 350bps. Regulatory risk stands at ${dna.risk}/100.`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 700000).toISOString()
    },
    {
      agent: 'Hidden Alpha Agent',
      text: `Hidden momentum indicators: patent registrations in model architecture optimization have grown 30% YoY. Specialist engineering listings indicate rapid hiring trends.`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 600000).toISOString()
    },
    {
      agent: 'Hypothesis Testing Agent',
      text: `Investment hypothesis formulated: "Core growth is sustained by software licensing expansion and ecosystem locking." Supporting evidence: +30% patent pipeline growth. Counter evidence: supply chain friction. Confidence score: 82%.`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 500000).toISOString()
    },
    {
      agent: "Devil's Advocate Agent",
      text: `I challenge this core hypothesis. If capital expenditure in AI software freezes among enterprise clients, multiples contract by 30%. Growth margins assume ideal pricing elasticity. If demand contracts even slightly, intrinsic value targets collapse to bear ranges ($${simulations.bear.priceTarget}).`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 400000).toISOString()
    },
    {
      agent: 'Verification Agent',
      text: `Auditing factual claims. Filing sources and presentation Transcripts cross-referenced. SEC Form filings confirm Q1 revenue data. We verified 3 core factual claims with an average confidence level of 96%. All fact claims are backed by documentation.`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 300000).toISOString()
    },
    {
      agent: 'Future Scenario Simulator Agent',
      text: `Projections are modeled. Base case price target is $${simulations.base.priceTarget} (50% probability). Bull case targets $${simulations.bull.priceTarget} (30% probability). Bear case stands at $${simulations.bear.priceTarget} (15% probability), and Black Swan target is modeled at $${simulations.blackSwan.priceTarget} (5% probability).`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 200000).toISOString()
    },
    {
      agent: 'Investment Committee Agent',
      text: `Boardroom debate synthesis completed. The vote tally among agents stands at: 9 approve, 3 warn, 1 objects. Final consensus recommendation: [${decision}] with a confidence level of ${confidence}%.`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 100000).toISOString()
    },
    {
      agent: 'Report Generator Agent',
      text: `Formatting formal institutional investment memo. PDF print stylesheet loaded. Ready for compile and download.`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 50000).toISOString()
    }
  ];

  // Logs
  const logs = [
    `Research Planner Agent: dynamically mapped search scope for ${t}.`,
    `Company Research Agent: overview fetched; profile compiled.`,
    `Financial Analyst Agent: DCF schedules built; valuation multiples verified.`,
    `News Intelligence Agent: public headlines and PR sentiment calculated.`,
    `Competitor Intelligence Agent: benchmarked key operating ratios vs peers.`,
    `Risk Assessment Agent: regulatory, supply chain, and macro stress tests complete.`,
    `Hidden Alpha Agent: mapped hiring listings and patent database records.`,
    `Hypothesis Testing Agent: core investment thesis tested; evidence verified.`,
    `Devil's Advocate Agent: pushed back on consensus; tested bear cases.`,
    `Verification Agent: verified SEC filing and BSE registry documents.`,
    `Future Scenario Simulator Agent: mapped Bull, Bear, and Black Swan probability targets.`,
    `Investment Committee Agent: boardroom vote tally finalized.`,
    `Report Generator Agent: institutional investment memo compiled.`
  ];

  // Memo
  const memo = `# INSTITUTIONAL INVESTMENT MEMORANDUM

**TO:** Investment Committee
**FROM:** AI-IROS Autonomous Intelligence Suite
**DATE:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
**SUBJECT:** Comprehensive Upgraded Investment Recommendation: ${name} (${t})

---

### EXECUTIVE SUMMARY
Following a comprehensive multi-agent debate and quantitative simulation, the AI-IROS system has issued an institutional-grade recommendation of **${decision}** for **${name}** (${t}) at its trading price of **$${price.toFixed(2)}**. The core thesis indicates an intrinsic valuation of **$${intrinsicValue.toFixed(2)}** (representing **${dcfValuation.upside}%** upside/downside), a strong competitive moat, and a highly capable leadership structure.

*   **Final Decision:** **${decision}**
*   **Confidence Score:** **${confidence}%**
*   **Target Price (Base Case):** **$${simulations.base.priceTarget}**
*   **Company Personality:** **${personality}**
*   **CEO Leadership Index:** **${ceo.name} (Vision: ${ceo.vision}, Execution: ${ceo.execution})**

---

### INVESTMENT THESIS & DNA ASSESSMENT
${name} exhibits a **${personality.toLowerCase()}** profile, scoring **${dna.moat}/100** on Moat and **${dna.innovation}/100** on Innovation.
1.  **Moat Advantage (${dna.moat}/100):** High switching costs, proprietary software libraries, and direct hardware partner locks.
2.  **Financial Stability (${dna.stability}/100):** Low leverage ratio, healthy interest coverage, and predictable cash flows.
3.  **Innovation Index (${dna.innovation}/100):** High-speed patent registration (distributed neural architectures) and specialist hiring trends.

---

### VALUATION & FUTURE SIMULATION
Our valuation framework integrates WACC calculations, terminal multiple forecasts, and Monte Carlo envelopes:
*   **DCF Valuation:** Intrinsic price target is calculated at **$${intrinsicValue.toFixed(2)}**, assuming a cost of capital of 8.0% and operating margins stabilizing at 22%.
*   **Scenario Probability Distribution:**
    *   **Bull Case ($${simulations.bull.priceTarget} - 30% Prob.):** Soft landing macro environment, rapid software monetization.
    *   **Base Case ($${simulations.base.priceTarget} - 50% Prob.):** Business expansion aligns with corporate guidance.
    *   **Bear Case ($${simulations.bear.priceTarget} - 15% Prob.):** Macro spending delays, multiple contractions.
    *   **Black Swan Case ($${simulations.blackSwan.priceTarget} - 5% Prob.):** Zero-day cybersecurity breaches or supply chain shutdowns.

---

### RISK & RED TEAM ASSESSMENT
The **Devil's Advocate Agent** highlighted critical downside parameters:
*   **Multiple Risk:** High valuation multiples reduce safety threshold.
*   **Supply Dependency:** Heavy hardware dependencies pose a single point of failure risk.
*   **Antitrust Bottleneck:** Increasing regulatory oversight limits acquisition velocities.

---

### COMMITTEE VOTING REPORT
*   **Approvals:** Research Planner, Company Research, Financial Analyst, News Analyst, Competitor Analyst, Hidden Alpha, Verification, Future Simulator, Investment Committee.
*   **Warnings:** Risk Assessment, Hypothesis Tester.
*   **Objects:** Devil's Advocate.
*   **Consensus:** Reached majority threshold (**${decision}**)

---
*Authorized Signature:* **Investment Committee AI-IROS Boardroom**
`;

  return {
    ticker: t,
    companyName: name,
    dnaScores: dna,
    simulations,
    sources,
    peers,
    alphaSignals,
    dcfValuation,
    sentimentGrid,
    decision,
    confidence,
    debate,
    logs,
    memo,
    probForecast,
    ceo,
    personality,
    headlines,
    knowledgeGraph,
  };
}
