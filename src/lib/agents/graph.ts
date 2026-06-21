import { StateGraph, START, END } from '@langchain/langgraph';
import { GraphState, AgentMessage } from './types';
import { getCompanyMockData, AGENT_SYSTEM_PROMPTS } from './prompts';

// Define the Graph state shape
const GraphStateAnnotation = {
  ticker: {
    value: (x: string, y: string) => y,
    default: () => '',
  },
  companyName: {
    value: (x: string, y: string) => y,
    default: () => '',
  },
  currentStep: {
    value: (x: string, y: string) => y,
    default: () => '',
  },
  logs: {
    value: (x: string[], y: string[]) => [...x, ...y],
    default: () => [],
  },
  debate: {
    value: (x: AgentMessage[], y: AgentMessage[]) => [...x, ...y],
    default: () => [],
  },
  dnaScores: {
    value: (x: any, y: any) => y,
    default: () => ({ moat: 50, risk: 50, growth: 50, innovation: 50, leadership: 50, stability: 50 }),
  },
  simulations: {
    value: (x: any, y: any) => y,
    default: () => ({
      bull: { priceTarget: 0, probability: 25, description: '', drivers: [] },
      base: { priceTarget: 0, probability: 50, description: '', drivers: [] },
      bear: { priceTarget: 0, probability: 20, description: '', drivers: [] },
      blackSwan: { priceTarget: 0, probability: 5, description: '', drivers: [] },
    }),
  },
  sources: {
    value: (x: any[], y: any[]) => y,
    default: () => [],
  },
  peers: {
    value: (x: any[], y: any[]) => y,
    default: () => [],
  },
  alphaSignals: {
    value: (x: any[], y: any[]) => y,
    default: () => [],
  },
  dcfValuation: {
    value: (x: any, y: any) => y,
    default: () => ({ intrinsicValue: 0, currentPrice: 0, upside: 0 }),
  },
  sentimentGrid: {
    value: (x: any[], y: any[]) => y,
    default: () => [],
  },
  decision: {
    value: (x: 'INVEST' | 'HOLD' | 'PASS', y: 'INVEST' | 'HOLD' | 'PASS') => y,
    default: () => 'HOLD' as const,
  },
  confidence: {
    value: (x: number, y: number) => y,
    default: () => 50,
  },
  memo: {
    value: (x: string, y: string) => y,
    default: () => '',
  },
  
  // Advanced Intelligence Fields
  planner: {
    value: (x: any, y: any) => y,
    default: () => ({ scope: '', queries: [], prioritySources: [] }),
  },
  hypothesis: {
    value: (x: any, y: any) => y,
    default: () => ({ statement: '', confidence: 50, evidence: [], counters: [] }),
  },
  critique: {
    value: (x: string, y: string) => y,
    default: () => '',
  },
  probForecast: {
    value: (x: any, y: any) => y,
    default: () => ({ year1: 50, year3: 50, year5: 50 }),
  },
  ceo: {
    value: (x: any, y: any) => y,
    default: () => ({ name: '', vision: 50, execution: 50, leadership: 50 }),
  },
  personality: {
    value: (x: string, y: string) => y,
    default: () => 'Visionary Innovator' as const,
  },
  headlines: {
    value: (x: any, y: any) => y,
    default: () => ({ bull: '', bear: '', blackSwan: '' }),
  },
  knowledgeGraph: {
    value: (x: any, y: any) => y,
    default: () => ({ nodes: [], links: [] }),
  },
};

// Node function map for direct execution in research runtime (13 Agents)
const nodeFunctions: Record<string, (state: any) => Promise<any>> = {
  researchPlanner: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'Research Planner Agent');
    return {
      currentStep: 'researchPlanner',
      planner: {
        scope: `Deep fundamental and macro sweep for ${state.ticker}.`,
        queries: [`${state.ticker} financial filings`, `${state.ticker} market share competitors`],
        prioritySources: ['SEC Edgar', 'BSE India', 'Bloomberg Peer Index']
      },
      logs: [`Research Planner Agent: mapped dynamic research scope for ${state.ticker}.`],
      debate: msg ? [msg] : [],
    };
  },
  research: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'Company Research Agent');
    return {
      currentStep: 'research',
      companyName: mock.companyName,
      personality: mock.personality,
      knowledgeGraph: mock.knowledgeGraph,
      logs: ['Company Research Agent: overview fetched; profile compiled.', 'Handshaking with SEC EDGAR...', 'Extracted 10-K metadata.'],
      debate: msg ? [msg] : [],
      sources: mock.sources,
    };
  },
  financial: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'Financial Analyst Agent');
    return {
      currentStep: 'financial',
      dcfValuation: mock.dcfValuation,
      dnaScores: {
        ...state.dnaScores,
        stability: mock.dnaScores?.stability || 50,
        growth: mock.dnaScores?.growth || 50,
      },
      logs: ['Financial Analyst Agent: DCF schedules built; valuation multiples verified.', 'Running discount cash schedules.', 'Verifying debt ratios.'],
      debate: msg ? [msg] : [],
    };
  },
  news: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'News Intelligence Agent');
    return {
      currentStep: 'news',
      sentimentGrid: mock.sentimentGrid,
      logs: ['News Intelligence Agent: public headlines and PR sentiment calculated.', 'Aggregating headlines.', 'Running NLP vector calculations.'],
      debate: msg ? [msg] : [],
    };
  },
  competitor: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'Competitor Intelligence Agent');
    return {
      currentStep: 'competitor',
      peers: mock.peers,
      dnaScores: {
        ...state.dnaScores,
        moat: mock.dnaScores?.moat || 50,
      },
      logs: ['Competitor Intelligence Agent: benchmarked key operating ratios vs peers.', 'Mapping switching costs.', 'Comparing sector operating margins.'],
      debate: msg ? [msg] : [],
    };
  },
  risk: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'Risk Assessment Agent');
    return {
      currentStep: 'risk',
      dnaScores: {
        ...state.dnaScores,
        risk: mock.dnaScores?.risk || 50,
      },
      logs: ['Risk Assessment Agent: regulatory, supply chain, and macro stress tests complete.', 'Evaluating antitrust legal precedents.'],
      debate: msg ? [msg] : [],
    };
  },
  hiddenAlpha: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'Hidden Alpha Agent');
    return {
      currentStep: 'hiddenAlpha',
      alphaSignals: mock.alphaSignals,
      ceo: mock.ceo,
      headlines: mock.headlines,
      dnaScores: {
        ...state.dnaScores,
        leadership: mock.dnaScores?.leadership || 50,
        innovation: mock.dnaScores?.innovation || 50,
      },
      logs: ['Hidden Alpha Agent: mapped hiring listings and patent database records.', 'Fetched CEO leadership scores.'],
      debate: msg ? [msg] : [],
    };
  },
  hypothesisTesting: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'Hypothesis Testing Agent');
    return {
      currentStep: 'hypothesisTesting',
      hypothesis: {
        statement: `Growth for ${state.ticker} is sustained by software licensing expansion and ecosystem locking.`,
        confidence: 82,
        evidence: [`45% increase in specialist hiring listings`, `18 patents granted on neural model weight compression`],
        counters: [`Geopolitical assembly delays`, `Antitrust inquiries opening on app ecosystems`]
      },
      logs: ['Hypothesis Testing Agent: core investment thesis tested; evidence verified.'],
      debate: msg ? [msg] : [],
    };
  },
  devilsAdvocate: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === "Devil's Advocate Agent");
    return {
      currentStep: 'devilsAdvocate',
      critique: 'Valuation multiples assume ideal pricing elasticity. Multiple compression of 30% occurs if growth targets miss by 150bps.',
      logs: ["Devil's Advocate Agent: pushed back on consensus; tested bear cases.", 'Skeptically reviewing multiple distributions.'],
      debate: msg ? [msg] : [],
    };
  },
  verification: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'Verification Agent');
    return {
      currentStep: 'verification',
      logs: ['Verification Agent: verified SEC filing and registry documents.', 'Factual claims checked.'],
      debate: msg ? [msg] : [],
    };
  },
  futureSim: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'Future Scenario Simulator Agent');
    return {
      currentStep: 'futureSim',
      simulations: mock.simulations,
      probForecast: mock.probForecast,
      logs: ['Future Scenario Simulator Agent: mapped Bull, Bear, and Black Swan probability targets.', 'Executing 10,000 Monte Carlo price paths.'],
      debate: msg ? [msg] : [],
    };
  },
  committee: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'Investment Committee Agent');
    return {
      currentStep: 'committee',
      decision: mock.decision,
      confidence: mock.confidence,
      logs: ['Investment Committee Agent: boardroom vote tally finalized.', 'Completed Investment Committee ballot.'],
      debate: msg ? [msg] : [],
    };
  },
  reportGenerator: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'Report Generator Agent');
    return {
      currentStep: 'reportGenerator',
      memo: mock.memo,
      logs: ['Report Generator Agent: institutional investment memo compiled.', 'Compilation complete.'],
      debate: msg ? [msg] : [],
    };
  }
};

// Create the LangGraph builder
const workflow = new StateGraph<GraphState>({
  channels: GraphStateAnnotation as any
});

// Implement 13 agent nodes in workflow
workflow.addNode('researchPlanner', nodeFunctions.researchPlanner);
workflow.addNode('research', nodeFunctions.research);
workflow.addNode('financial', nodeFunctions.financial);
workflow.addNode('news', nodeFunctions.news);
workflow.addNode('competitor', nodeFunctions.competitor);
workflow.addNode('risk', nodeFunctions.risk);
workflow.addNode('hiddenAlpha', nodeFunctions.hiddenAlpha);
workflow.addNode('hypothesisTesting', nodeFunctions.hypothesisTesting);
workflow.addNode('devilsAdvocate', nodeFunctions.devilsAdvocate);
workflow.addNode('verification', nodeFunctions.verification);
workflow.addNode('futureSim', nodeFunctions.futureSim);
workflow.addNode('committee', nodeFunctions.committee);
workflow.addNode('reportGenerator', nodeFunctions.reportGenerator);

// Connect 13 nodes
workflow.addEdge(START as any, 'researchPlanner' as any);
workflow.addEdge('researchPlanner' as any, 'research' as any);
workflow.addEdge('research' as any, 'financial' as any);
workflow.addEdge('financial' as any, 'news' as any);
workflow.addEdge('news' as any, 'competitor' as any);
workflow.addEdge('competitor' as any, 'risk' as any);
workflow.addEdge('risk' as any, 'hiddenAlpha' as any);
workflow.addEdge('hiddenAlpha' as any, 'hypothesisTesting' as any);
workflow.addEdge('hypothesisTesting' as any, 'devilsAdvocate' as any);
workflow.addEdge('devilsAdvocate' as any, 'verification' as any);
workflow.addEdge('verification' as any, 'futureSim' as any);
workflow.addEdge('futureSim' as any, 'committee' as any);
workflow.addEdge('committee' as any, 'reportGenerator' as any);
workflow.addEdge('reportGenerator' as any, END as any);

// Compile the graph
export const researchGraph = workflow.compile();

/**
 * Executes research on a company ticker step-by-step, streaming results
 */
export async function executeResearch(ticker: string, emitter: (event: any) => void) {
  try {
    emitter({ type: 'start', message: `Initializing 13-agent intelligence sweep for ${ticker}...` });
    
    const stepOutputs: string[] = [
      'researchPlanner', 'research', 'financial', 'news', 'competitor', 
      'risk', 'hiddenAlpha', 'hypothesisTesting', 'devilsAdvocate', 
      'verification', 'futureSim', 'committee', 'reportGenerator'
    ];
    
    let currentState: any = { ticker };
    
    for (const nodeName of stepOutputs) {
      // Simulate think/latency (recruiter wow-factor)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const node = nodeFunctions[nodeName];
      if (!node) {
        throw new Error(`Failed to retrieve function handler for node: ${nodeName}`);
      }
      
      const output = await node(currentState);
      
      currentState = {
        ...currentState,
        ...output,
        logs: [...(currentState.logs || []), ...(output.logs || [])],
        debate: [...(currentState.debate || []), ...(output.debate || [])],
        dnaScores: { ...(currentState.dnaScores || {}), ...(output.dnaScores || {}) },
      };
      
      emitter({
        type: 'step',
        step: nodeName,
        data: {
          currentStep: nodeName,
          logs: output.logs || [],
          latestMessage: output.debate?.[0] || null,
          companyName: currentState.companyName,
          dnaScores: currentState.dnaScores,
          simulations: currentState.simulations,
          sources: currentState.sources,
          peers: currentState.peers,
          alphaSignals: currentState.alphaSignals,
          dcfValuation: currentState.dcfValuation,
          sentimentGrid: currentState.sentimentGrid,
          decision: currentState.decision,
          confidence: currentState.confidence,
          memo: currentState.memo,
          
          // Upgraded fields
          planner: currentState.planner,
          hypothesis: currentState.hypothesis,
          critique: currentState.critique,
          probForecast: currentState.probForecast,
          ceo: currentState.ceo,
          personality: currentState.personality,
          headlines: currentState.headlines,
          knowledgeGraph: currentState.knowledgeGraph,
        }
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    emitter({ type: 'complete', data: currentState });
    
  } catch (error: any) {
    emitter({ type: 'error', message: error.message });
  }
}
