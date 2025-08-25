import { z } from "zod";

/** ─────────────────────────────────────────────────────────────
 *  Shared enums & helpers
 *  ───────────────────────────────────────────────────────────── */
export const InterventionCategory = z.enum([
  "BehaviourChange",
  "CivicParticipation", 
  "SkillsAndIndustry",
  "PhysicalInfrastructure",
  "Governance",
  "PolicyAndRegulation",
  "Finance",
  "Technology",
]);

export const CityScale = z.enum([
  "Citywide",
  "DistrictNeighbourhood", 
  "CorridorStreet",
  "SpecificSite",
]);

export const EffectDirection = z.enum(["Positive", "Negative", "Neutral", "Mixed"]);
export const ConfidenceLevel = z.enum(["High", "Medium", "Low"]);

/** ─────────────────────────────────────────────────────────────
 *  City Profile (simplified with required/optional fields)
 *  ───────────────────────────────────────────────────────────── */
export const CityProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  
  // Required fields
  scale: CityScale,
  mainChallenges: z.array(z.string()).min(1), // e.g. ["air quality", "congestion", "housing affordability"]
  
  // Optional fields
  populationContext: z.object({
    size: z.number().optional(),
    demographics: z.string().optional(), // e.g. "aging population", "young professionals"
  }).optional(),
  
  neighbourhoodCharacteristics: z.string().optional(), // e.g. "mixed-use", "residential", "industrial"
  
  vulnerableGroups: z.array(z.string()).optional(), // e.g. ["elderly", "low-income", "children"]
  
  regulatoryContext: z.string().optional(), // e.g. "Bus lane reallocation is contentious"
  
  timeline: z.string().optional(), // e.g. "2-year implementation window"
  
  budgetConstraints: z.string().optional(), // e.g. "€5M available for pilot"
  
  existingAssets: z.array(z.string()).optional(), // e.g. ["schools", "bus line 12", "public housing blocks"]
  
  // Legacy fields for backward compatibility (can be removed later)
  demographics: z.object({
    population: z.number(),
    households: z.number().optional(),
    medianAge: z.number().optional(),
    povertyRatePct: z.number().optional(),
    inequalityGini_0_1: z.number().optional(),
  }).optional(),
  
  mobility: z.object({
    avgCommuteMin: z.number().optional(),
    congestionIndex: z.number().optional(),
    modalShare: z.object({
      carPct: z.number().optional(),
      transitPct: z.number().optional(),
      walkPct: z.number().optional(),
      cyclePct: z.number().optional(),
    }).optional(),
    publicTransportCoveragePct: z.number().optional(),
  }).optional(),
  
  housing: z.object({
    vacancyRatePct: z.number().optional(),
    rentBurdenedHouseholdsPct: z.number().optional(),
    affordableUnitsCount: z.number().optional(),
  }).optional(),
  
  environment: z.object({
    ghgEmissionsMtCO2e: z.number().optional(),
    pm25µgPerM3: z.number().optional(),
    no2µgPerM3: z.number().optional(),
    urbanCanopyCoverPct: z.number().optional(),
  }).optional(),
  
  health: z.object({
    baselineHealthIndex_0_100: z.number().optional(),
    respiratoryAdmissionsPer100k: z.number().optional(),
    mentalHealthIndex_0_100: z.number().optional(),
  }).optional(),
  
  economy: z.object({
    unemploymentRatePct: z.number().optional(),
    medianHouseholdIncome: z.number().optional(),
    localBusinessFormationRate: z.number().optional(),
  }).optional(),
  
  socialGovernance: z.object({
    trustIndex_0_100: z.number().optional(),
    civicParticipationRatePct: z.number().optional(),
    perceivedSafetyIndex_0_100: z.number().optional(),
  }).optional(),
  
  fiscal: z.object({
    municipalBudgetBalanceM: z.number().optional(),
  }).optional(),
  
  dataQuality: z.object({
    coverageScore_0_1: z.number().min(0).max(1).optional(),
    freshnessMonths: z.number().optional(),
    notes: z.string().optional(),
  }).optional(),
  
  implementationReadiness: z.object({
    politicalWill_0_1: z.number().optional(),
    institutionalCapacity_0_1: z.number().optional(),
    communitySupport_0_1: z.number().optional(),
    fundingAvailability_0_1: z.number().optional(),
  }).optional(),
  
  customIndicators: z.array(
    z.object({
      key: z.string(),
      value: z.number(),
      unit: z.string().optional(),
    })
  ).optional(),
});
export type CityProfile = z.infer<typeof CityProfileSchema>;

/** ─────────────────────────────────────────────────────────────
 *  Intervention (simplified with required/optional fields)
 *  ───────────────────────────────────────────────────────────── */
export const InterventionSchema = z.object({
  id: z.string(),
  
  // Required fields
  title: z.string(), // e.g. "School Air Quality Sensors"
  summary: z.string(), // One-liner: "Install low-cost sensors in schools to monitor air quality"
  category: InterventionCategory,
  scopeOfApplication: z.string(), // e.g. "Primary schools in urban areas"
  
  // Optional fields
  detailedDescription: z.string().optional(),
  
  parameters: z.record(z.string(), z.union([z.string(), z.number()])).optional(), // e.g. {sensorsCount: 200, chargeAmount: "£5"}
  
  synergies: z.array(z.string()).optional(), // e.g. ["Works best with: School Streets", "Green Corridors"]
  
  intendedOutcomes: z.array(z.string()).optional(),
  
  stakeholderFocus: z.array(z.string()).optional(), // e.g. ["children", "commuters", "landlords"]
  
  implementationNotes: z.string().optional(), // Timeline, budget, regulatory enablers/barriers
  
  risks: z.array(z.string()).optional(),
  
  // Legacy fields for backward compatibility
  categories: z.array(InterventionCategory).optional(),
  description: z.string().optional(),
  params: z.record(z.string(), z.number()).optional(),
  mechanisms: z.array(z.object({
    description: z.string(),
    expectedEffects: z.array(z.object({
      indicator: z.string(),
      direction: z.string(),
      magnitudeHintPct: z.number().optional(),
      evidence: z.string().optional(),
      equityWeight_0_2: z.number().optional(),
    })),
  })).optional(),
  implementation: z.object({
    scope: z.string().optional(),
    durationMonths: z.number().optional(),
    targetPopulations: z.array(z.string()).optional(),
    targetGeographies: z.array(z.string()).optional(),
    partners: z.array(z.string()).optional(),
    capexM: z.number().optional(),
    opexPerYearM: z.number().optional(),
    fundingModel: z.string().optional(),
    policyInstruments: z.array(z.string()).optional(),
  }).optional(),
  assumptions: z.array(z.string()).optional(),
  subInterventions: z.array(z.object({
    id: z.string(),
    title: z.string(),
    categories: z.array(InterventionCategory).optional(),
    description: z.string().optional(),
    params: z.record(z.string(), z.number()).optional(),
    mechanisms: z.array(z.object({
      description: z.string(),
      expectedEffects: z.array(z.object({
        indicator: z.string(),
        direction: z.string(),
        magnitudeHintPct: z.number().optional(),
        evidence: z.string().optional(),
        equityWeight_0_2: z.number().optional(),
      })),
    })).optional(),
    implementation: z.object({
      scope: z.string().optional(),
      durationMonths: z.number().optional(),
      targetPopulations: z.array(z.string()).optional(),
      targetGeographies: z.array(z.string()).optional(),
      partners: z.array(z.string()).optional(),
      capexM: z.number().optional(),
      opexPerYearM: z.number().optional(),
      fundingModel: z.string().optional(),
      policyInstruments: z.array(z.string()).optional(),
    }).optional(),
  })).optional(),
});
export type Intervention = z.infer<typeof InterventionSchema>;

/** ─────────────────────────────────────────────────────────────
 *  Scenario (what-if question + city + interventions)
 *  ───────────────────────────────────────────────────────────── */
export const ScenarioSchema = z.object({
  id: z.string(),
  whatIfQuestion: z.string(), // e.g. "What if we could enhance the collective intelligence of Helsinki?"
  cityId: z.string(),
  interventionIds: z.array(z.string()).min(1), // Support multiple interventions
  notes: z.string().optional(),
});
export type Scenario = z.infer<typeof ScenarioSchema>;

/** ─────────────────────────────────────────────────────────────
 *  Scenario Result (structured narrative output)
 *  ───────────────────────────────────────────────────────────── */
export const StakeholderImpactSchema = z.object({
  group: z.string(), // e.g. "citizens", "businesses", "government departments"
  benefits: z.array(z.string()),
  concerns: z.array(z.string()),
  engagementNeeds: z.array(z.string()),
  stance: z.enum(["Support", "Neutral", "Oppose", "Mixed"]).optional(),
});

export const SystemEffectSchema = z.object({
  domain: z.string(), // e.g. "Environment", "Health", "Economy"
  effect: z.string(),
  polarity: EffectDirection,
  confidence: ConfidenceLevel,
});

export const PolicyInteractionSchema = z.object({
  policy: z.string(),
  interaction: z.enum(["Enables", "ConstrainedBy", "ConflictsWith", "RequiresChange"]),
  description: z.string(),
});

export const RiskSchema = z.object({
  risk: z.string(),
  likelihood: ConfidenceLevel,
  impact: ConfidenceLevel,
});

export const AssumptionSchema = z.object({
  assumption: z.string(),
  confidence: ConfidenceLevel,
});

export const SignalSchema = z.object({
  signal: z.string(),
  description: z.string(),
});

export const ExperimentSchema = z.object({
  experiment: z.string(),
  effort: z.enum(["Low", "Medium", "High"]),
  timeline: z.string(),
});

export const ScenarioResultSchema = z.object({
  scenarioId: z.string(),
  
  // Narrative Summary
  narrativeSummary: z.string(), // 5-8 sentence story
  
  // Stakeholder Impacts
  stakeholderImpacts: z.array(StakeholderImpactSchema),
  
  // System Effects
  systemEffects: z.array(SystemEffectSchema),
  
  // Policy & Trend Interactions
  policyInteractions: z.array(PolicyInteractionSchema),
  
  // Risks & Unintended Consequences
  risks: z.array(RiskSchema),
  
  // Assumptions & Gaps
  assumptions: z.array(AssumptionSchema),
  
  // Signals to Watch
  signals: z.array(SignalSchema),
  
  // Next Experiments
  experiments: z.array(ExperimentSchema),
  
  // Portfolio Analysis
  synergies: z.array(z.string()).optional(),
  gaps: z.array(z.string()).optional(),
  
  // Metadata
  generatedAt: z.string(),
  confidence_0_1: z.number(),
});
export type ScenarioResult = z.infer<typeof ScenarioResultSchema>;

// Legacy schemas for backward compatibility
export const CitySchema = CityProfileSchema;
export type City = z.infer<typeof CityProfileSchema>;
