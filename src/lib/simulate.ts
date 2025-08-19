import { City, Intervention, Scenario, Result } from './schemas';

// Simple coefficient-based simulation rules
const SIMULATION_RULES = {
  Mobility: {
    emissionsDeltaPct: { base: -0.12, variance: 0.08 },
    congestionDeltaPct: { base: -0.18, variance: 0.12 },
    avgCommuteDeltaMin: { base: -3, variance: 2 },
    modalShift: { car: -0.15, transit: 0.12, walk: 0.02, cycle: 0.01 },
    fiscalImpactMGBP: { base: 2.8, variance: 1.2 },
    healthIndexDelta: { base: 3, variance: 2 },
    trustIndexDelta: { base: -2, variance: 3 },
    equityScore: { base: 0.65, variance: 0.15 },
  },
  Energy: {
    emissionsDeltaPct: { base: -0.08, variance: 0.05 },
    congestionDeltaPct: { base: 0, variance: 0.02 },
    avgCommuteDeltaMin: { base: 0, variance: 1 },
    modalShift: { car: 0, transit: 0, walk: 0, cycle: 0 },
    fiscalImpactMGBP: { base: -0.8, variance: 0.4 },
    healthIndexDelta: { base: 2, variance: 1.5 },
    trustIndexDelta: { base: 4, variance: 2 },
    equityScore: { base: 0.75, variance: 0.10 },
  },
  Housing: {
    emissionsDeltaPct: { base: -0.05, variance: 0.03 },
    congestionDeltaPct: { base: -0.03, variance: 0.02 },
    avgCommuteDeltaMin: { base: -1, variance: 1 },
    modalShift: { car: -0.02, transit: 0.01, walk: 0.01, cycle: 0 },
    fiscalImpactMGBP: { base: 1.2, variance: 0.6 },
    healthIndexDelta: { base: 4, variance: 2 },
    trustIndexDelta: { base: 6, variance: 2 },
    equityScore: { base: 0.85, variance: 0.10 },
  },
  PublicHealth: {
    emissionsDeltaPct: { base: -0.03, variance: 0.02 },
    congestionDeltaPct: { base: -0.02, variance: 0.01 },
    avgCommuteDeltaMin: { base: -0.5, variance: 0.5 },
    modalShift: { car: -0.01, transit: 0.005, walk: 0.005, cycle: 0 },
    fiscalImpactMGBP: { base: 0.8, variance: 0.4 },
    healthIndexDelta: { base: 6, variance: 2.5 },
    trustIndexDelta: { base: 3, variance: 2 },
    equityScore: { base: 0.70, variance: 0.15 },
  },
  Governance: {
    emissionsDeltaPct: { base: -0.02, variance: 0.01 },
    congestionDeltaPct: { base: -0.01, variance: 0.01 },
    avgCommuteDeltaMin: { base: 0, variance: 0.5 },
    modalShift: { car: 0, transit: 0, walk: 0, cycle: 0 },
    fiscalImpactMGBP: { base: 0.3, variance: 0.2 },
    healthIndexDelta: { base: 1, variance: 1 },
    trustIndexDelta: { base: 8, variance: 3 },
    equityScore: { base: 0.80, variance: 0.10 },
  },
};

// Stakeholder sentiment rules based on intervention type and city context
const SENTIMENT_RULES = {
  Mobility: {
    citizens: { base: -0.15, variance: 0.20 },
    businesses: { base: -0.10, variance: 0.15 },
    ngo: { base: 0.25, variance: 0.15 },
    council: { base: 0.20, variance: 0.20 },
  },
  Energy: {
    citizens: { base: 0.20, variance: 0.15 },
    businesses: { base: 0.15, variance: 0.20 },
    ngo: { base: 0.35, variance: 0.10 },
    council: { base: 0.25, variance: 0.15 },
  },
  Housing: {
    citizens: { base: 0.30, variance: 0.15 },
    businesses: { base: 0.10, variance: 0.20 },
    ngo: { base: 0.40, variance: 0.10 },
    council: { base: 0.35, variance: 0.15 },
  },
  PublicHealth: {
    citizens: { base: 0.25, variance: 0.15 },
    businesses: { base: 0.05, variance: 0.20 },
    ngo: { base: 0.30, variance: 0.15 },
    council: { base: 0.20, variance: 0.20 },
  },
  Governance: {
    citizens: { base: 0.20, variance: 0.20 },
    businesses: { base: 0.15, variance: 0.25 },
    ngo: { base: 0.25, variance: 0.20 },
    council: { base: 0.40, variance: 0.15 },
  },
};

// Narrative templates for different domains
const NARRATIVE_TEMPLATES = {
  Mobility: [
    "Modal shift reduces peak-hour congestion by {congestion}%",
    "Emissions decrease by {emissions}% due to reduced car usage",
    "Average commute time improves by {commute} minutes",
    "Fiscal impact generates {fiscal}M GBP annually",
  ],
  Energy: [
    "Renewable energy adoption increases community resilience",
    "Energy costs decrease by {energy}% for participants",
    "Carbon footprint reduction of {emissions}% achieved",
    "Public-private partnership model shows promise",
  ],
  Housing: [
    "Vacant properties transformed into community assets",
    "Housing affordability improves by {affordability}%",
    "Community ownership builds social capital",
    "Health outcomes improve through better living conditions",
  ],
  PublicHealth: [
    "Public health interventions show measurable improvements",
    "Health index increases by {health} points",
    "Equity-focused approach benefits vulnerable populations",
    "Community engagement strengthens health outcomes",
  ],
  Governance: [
    "Transparency and participation improve trust scores",
    "Stakeholder engagement processes show positive results",
    "Governance model enhances community decision-making",
    "Trust index increases by {trust} points",
  ],
};

// Risk templates
const RISK_TEMPLATES = {
  Mobility: [
    "Public resistance to new charges may limit effectiveness",
    "Modal shift may not materialise as expected",
    "Exemptions could create equity concerns",
    "Implementation costs may exceed projections",
  ],
  Energy: [
    "Weather dependency affects energy generation",
    "Community participation may be lower than expected",
    "Infrastructure costs could escalate",
    "Energy price volatility may impact savings",
  ],
  Housing: [
    "Property acquisition costs may be prohibitive",
    "Community consensus-building takes time",
    "Regulatory barriers could delay implementation",
    "Maintenance costs for shared facilities",
  ],
  PublicHealth: [
    "Behavioural change may be slower than expected",
    "Resource constraints limit programme scope",
    "Health outcomes may vary by population segment",
    "Long-term sustainability requires ongoing funding",
  ],
  Governance: [
    "Stakeholder conflicts may slow decision-making",
    "Community capacity for self-governance varies",
    "Accountability mechanisms need careful design",
    "Scaling successful pilots may be challenging",
  ],
};

// Helper function to add stochastic variation
function addVariation(base: number, variance: number, seed: number): number {
  const random = (seed * 9301 + 49297) % 233280;
  const variation = (random / 233280 - 0.5) * 2 * variance;
  return Math.max(0, Math.min(1, base + variation)); // Clamp between 0 and 1
}

// Helper function to generate narratives with dynamic values
function generateNarratives(domain: string, kpis: any): string[] {
  const templates = NARRATIVE_TEMPLATES[domain as keyof typeof NARRATIVE_TEMPLATES] || [];
  return templates.map(template => {
    return template
      .replace('{congestion}', Math.abs(Math.round(kpis.congestionDeltaPct * 100)))
      .replace('{emissions}', Math.abs(Math.round(kpis.emissionsDeltaPct * 100)))
      .replace('{commute}', Math.abs(Math.round(kpis.avgCommuteDeltaMin)))
      .replace('{fiscal}', Math.abs(Math.round(kpis.fiscalImpactMGBP)))
      .replace('{energy}', Math.abs(Math.round(kpis.energyPriceReduction * 100)))
      .replace('{affordability}', Math.abs(Math.round(kpis.affordabilityImprovement * 100)))
      .replace('{health}', Math.abs(Math.round(kpis.healthIndexDelta)))
      .replace('{trust}', Math.abs(Math.round(kpis.trustIndexDelta)));
  });
}

// Main simulation function
export function runScenario(scenario: Scenario, city: City, seed: number = 1): Result {
  const rules = SIMULATION_RULES[scenario.intervention.domain as keyof typeof SIMULATION_RULES];
  const sentimentRules = SENTIMENT_RULES[scenario.intervention.domain as keyof typeof SENTIMENT_RULES];
  
  if (!rules || !sentimentRules) {
    throw new Error(`Unknown intervention domain: ${scenario.intervention.domain}`);
  }

  // Generate KPIs with stochastic variation
  const kpis = {
    emissionsDeltaPct: addVariation(rules.emissionsDeltaPct.base, rules.emissionsDeltaPct.variance, seed),
    congestionDeltaPct: addVariation(rules.congestionDeltaPct.base, rules.congestionDeltaPct.variance, seed),
    avgCommuteDeltaMin: addVariation(rules.avgCommuteDeltaMin.base, rules.avgCommuteDeltaMin.variance, seed),
    modalShift: {
      car: Math.max(0, city.modalSplit.car + rules.modalShift.car),
      transit: Math.min(1, city.modalSplit.transit + rules.modalShift.transit),
      walk: Math.min(1, city.modalSplit.walk + rules.modalShift.walk),
      cycle: Math.min(1, city.modalSplit.cycle + rules.modalShift.cycle),
    },
    fiscalImpactMGBP: addVariation(rules.fiscalImpactMGBP.base, rules.fiscalImpactMGBP.variance, seed),
    healthIndexDelta: addVariation(rules.healthIndexDelta.base, rules.healthIndexDelta.variance, seed),
    trustIndexDelta: addVariation(rules.trustIndexDelta.base, rules.trustIndexDelta.variance, seed),
    equityScore: addVariation(rules.equityScore.base, rules.equityScore.variance, seed),
  };

  // Generate stakeholder sentiment
  const stakeholderSentiment = {
    citizens: Math.max(-1, Math.min(1, addVariation(sentimentRules.citizens.base, sentimentRules.citizens.variance, seed))),
    businesses: Math.max(-1, Math.min(1, addVariation(sentimentRules.businesses.base, sentimentRules.businesses.variance, seed))),
    ngo: Math.max(-1, Math.min(1, addVariation(sentimentRules.ngo.base, sentimentRules.ngo.variance, seed))),
    council: Math.max(-1, Math.min(1, addVariation(sentimentRules.council.base, sentimentRules.council.variance, seed))),
  };

  // Generate narratives and risks
  const narrativeFindings = generateNarratives(scenario.intervention.domain, kpis);
  const risks = RISK_TEMPLATES[scenario.intervention.domain as keyof typeof RISK_TEMPLATES] || [];

  // Calculate confidence based on data quality and intervention complexity
  const confidence = Math.max(0.3, Math.min(0.9, 0.7 + (seed - 1) * 0.1));

  return {
    scenarioId: scenario.id,
    kpis,
    narrativeFindings,
    risks,
    confidence,
    stakeholderSentiment,
  };
}

// Function to run multiple scenarios for comparison
export function runComparison(scenarios: Scenario[], city: City): Result[] {
  return scenarios.map((scenario, index) => 
    runScenario(scenario, city, (index + 1) * 1000) // Different seeds for each scenario
  );
}
