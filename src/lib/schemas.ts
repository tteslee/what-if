import { z } from "zod";

/** ─────────────────────────────────────────────────────────────
 *  Shared enums & helpers
 *  ───────────────────────────────────────────────────────────── */
export const InterventionCategory = z.enum([
  "BehaviourChange",
  "Participation",
  "SkillsAndIndustry",
  "BusinessModels",
  "UrbanDesign",
  "Governance",
  "PolicyAndRegulation",
  "Finance",
  "Technology",
]);

export const Indicator = z.enum([
  // Mobility & Access
  "AvgCommuteMin",
  "CongestionIndex",
  "ModalShareCarPct",
  "ModalShareTransitPct",
  "ModalShareWalkPct",
  "ModalShareCyclePct",

  // Housing
  "HousingVacancyRatePct",
  "RentBurdenedHouseholdsPct",
  "AffordableUnitsCount",

  // Environment
  "GHGEmissionsMtCO2e",
  "PM25µgPerM3",
  "NO2µgPerM3",
  "UrbanCanopyCoverPct",

  // Health & Wellbeing
  "BaselineHealthIndex_0_100",
  "RespiratoryAdmissionsPer100k",
  "MentalHealthIndex_0_100",

  // Economy
  "UnemploymentRatePct",
  "MedianHouseholdIncome",
  "LocalBusinessFormationRate",

  // Social & Governance
  "TrustIndex_0_100",
  "CivicParticipationRatePct",
  "PerceivedSafetyIndex_0_100",

  // Poverty & Equity
  "PovertyRatePct",
  "InequalityGini_0_1",

  // Fiscal
  "MunicipalBudgetBalanceM",
  "ProgrammeCostM",

  // You can extend at runtime via CustomIndicators
]);

/** Directional expectation for an indicator change */
export const EffectDirection = z.enum(["Increase", "Decrease", "Target"]);
export const EvidenceStrength = z.enum(["Low", "Medium", "High"]);

/** ─────────────────────────────────────────────────────────────
 *  City Profile (baseline & readiness)
 *  ───────────────────────────────────────────────────────────── */
export const CityProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  // Essential baselines (only those commonly used by interventions)
  demographics: z.object({
    population: z.number(),
    households: z.number().optional(),
    medianAge: z.number().optional(),
    povertyRatePct: z.number().optional(),
    inequalityGini_0_1: z.number().optional(),
  }),
  mobility: z.object({
    avgCommuteMin: z.number().optional(),
    congestionIndex: z.number().optional(),
    modalShare: z
      .object({
        carPct: z.number().optional(),
        transitPct: z.number().optional(),
        walkPct: z.number().optional(),
        cyclePct: z.number().optional(),
      })
      .optional(),
    publicTransportCoveragePct: z.number().optional(),
  }),
  housing: z.object({
    vacancyRatePct: z.number().optional(),
    rentBurdenedHouseholdsPct: z.number().optional(),
    affordableUnitsCount: z.number().optional(),
  }),
  environment: z.object({
    ghgEmissionsMtCO2e: z.number().optional(),
    pm25µgPerM3: z.number().optional(),
    no2µgPerM3: z.number().optional(),
    urbanCanopyCoverPct: z.number().optional(),
  }),
  health: z.object({
    baselineHealthIndex_0_100: z.number().optional(),
    respiratoryAdmissionsPer100k: z.number().optional(),
    mentalHealthIndex_0_100: z.number().optional(),
  }),
  economy: z.object({
    unemploymentRatePct: z.number().optional(),
    medianHouseholdIncome: z.number().optional(),
    localBusinessFormationRate: z.number().optional(),
  }),
  socialGovernance: z.object({
    trustIndex_0_100: z.number().optional(),
    civicParticipationRatePct: z.number().optional(),
    perceivedSafetyIndex_0_100: z.number().optional(),
  }),
  fiscal: z.object({
    municipalBudgetBalanceM: z.number().optional(),
  }),

  /** Data quality & readiness help the simulator decide confidence */
  dataQuality: z.object({
    coverageScore_0_1: z.number().min(0).max(1).optional(),
    freshnessMonths: z.number().optional(),
    notes: z.string().optional(),
  }),
  implementationReadiness: z.object({
    politicalWill_0_1: z.number().optional(),
    institutionalCapacity_0_1: z.number().optional(),
    communitySupport_0_1: z.number().optional(),
    fundingAvailability_0_1: z.number().optional(),
  }).optional(),

  /** Extend with city-specific indicators without breaking type-safety elsewhere */
  customIndicators: z
    .array(
      z.object({
        key: z.string(), // e.g., "SchoolAQSensorsCount"
        value: z.number(),
        unit: z.string().optional(),
      })
    )
    .optional(),
});
export type CityProfile = z.infer<typeof CityProfileSchema>;

/** ─────────────────────────────────────────────────────────────
 *  Intervention (typed by broad category + mechanisms → indicators)
 *  ───────────────────────────────────────────────────────────── */
export const MechanismSchema = z.object({
  /** Short causal statement: how the intervention acts on the system */
  description: z.string(), // e.g., "Reduce tailpipe emissions near schools via traffic calming and modal shift"
  /** Which indicators are influenced and in what direction */
  expectedEffects: z.array(
    z.object({
      indicator: Indicator,
      direction: EffectDirection,
      magnitudeHintPct: z.number().optional(), // e.g., -5 to -15% (use negative for decreases)
      evidence: EvidenceStrength.optional(),
      equityWeight_0_2: z.number().optional(), // >1 if benefits accrue to vulnerable groups
    })
  ),
});

export const ImplementationPlanSchema = z.object({
  scope: z.enum(["Pilot", "District", "Citywide"]),
  durationMonths: z.number().int().positive(),
  targetPopulations: z.array(z.string()).optional(), // e.g., ["Primary school children", "Low-income households"]
  targetGeographies: z.array(z.string()).optional(), // e.g., district IDs or names
  partners: z.array(z.string()).optional(), // org names / departments
  capexM: z.number().optional(),
  opexPerYearM: z.number().optional(),
  fundingModel: z
    .enum(["Municipal", "PublicPrivate", "CommunityOwned", "Grant", "UserFees"])
    .optional(),
  policyInstruments: z
    .array(
      z.enum([
        "Regulation",
        "Incentive",
        "Standard",
        "Procurement",
        "PublicInvestment",
        "DataGovernance",
        "EducationCampaign",
      ])
    )
    .optional(),
});

export const InterventionSchema = z.object({
  id: z.string(),
  title: z.string(), // e.g., "School Air Quality Sensors + Green Corridors"
  categories: z.array(InterventionCategory).min(1),
  description: z.string(),

  /** Parameter bag for the simulator (simple & extensible) */
  params: z.record(z.string(), z.number()).optional(),

  mechanisms: z.array(MechanismSchema).min(1),
  implementation: ImplementationPlanSchema,

  /** Risks & assumptions for narrative and sensitivity */
  assumptions: z.array(z.string()).optional(),
  risks: z.array(z.string()).optional(),

  /** Optional bundling: treat a cluster as one intervention or link sub-interventions */
  subInterventions: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      categories: z.array(InterventionCategory).min(1),
      description: z.string(),
      params: z.record(z.string(), z.number()).optional(),
      mechanisms: z.array(MechanismSchema).min(1),
      implementation: ImplementationPlanSchema,
    })
  ).optional(),
});
export type Intervention = z.infer<typeof InterventionSchema>;

/** ─────────────────────────────────────────────────────────────
 *  Scenario (city + interventions + intended impacts)
 *  ───────────────────────────────────────────────────────────── */
export const IntendedImpactSchema = z.object({
  indicator: Indicator,
  targetDirection: EffectDirection,
  targetValueOrDelta: z.number().optional(), // e.g., -10 (percent), or absolute depending on indicator
  priority_1_5: z.number().int().min(1).max(5).default(3),
});
export type IntendedImpact = z.infer<typeof IntendedImpactSchema>;

export const ScenarioSchema = z.object({
  id: z.string(),
  title: z.string(), // e.g., "What if we clean the air around schools?"
  cityId: z.string(),
  interventionIds: z.array(z.string()).min(1), // support clusters (1..n)
  intendedImpacts: z.array(IntendedImpactSchema).min(1),
  notes: z.string().optional(),
});
export type Scenario = z.infer<typeof ScenarioSchema>;

/** ─────────────────────────────────────────────────────────────
 *  Simulation Result (KPI deltas + equity + confidence)
 *  ───────────────────────────────────────────────────────────── */
export const ResultSchema = z.object({
  scenarioId: z.string(),
  kpis: z.record(
    Indicator,
    z.object({
      baseline: z.number().nullable(),   // null if unknown
      delta: z.number().nullable(),      // signed change in indicator units
      deltaPct: z.number().nullable(),   // optional % view where meaningful
      equityAdjustedDeltaPct: z.number().nullable().optional(),
    })
  ),
  qualitativeFindings: z.array(z.string()), // narrative bullets
  risksMaterialised: z.array(z.string()).optional(),
  confidence_0_1: z.number(),             // from data quality + model fit
  equityScore_0_100: z.number().optional(),
  fiscalImpactM: z.number().optional(),
  stakeholderSentiment: z
    .object({
      citizens: z.number(),   // −1..+1
      businesses: z.number(),
      ngo: z.number(),
      council: z.number(),
    })
    .optional(),
});
export type Result = z.infer<typeof ResultSchema>;

// Legacy schemas for backward compatibility (can be removed later)
export const CitySchema = CityProfileSchema;
export type City = z.infer<typeof CityProfileSchema>;
