import { z } from 'zod';

export const CitySchema = z.object({
  id: z.string(),
  name: z.string(),
  population: z.number(),
  households: z.number(),
  incomeGini: z.number().min(0).max(1),
  modalSplit: z.object({ 
    car: z.number(), 
    transit: z.number(), 
    walk: z.number(), 
    cycle: z.number() 
  }),
  emissionsMtCO2e: z.number(),
  avgCommuteMin: z.number(),
  housingVacancyRate: z.number(),
  baselineHealthIndex: z.number(),
  trustIndex: z.number(),
});

export const InterventionSchema = z.object({
  id: z.string(),
  name: z.string(),
  domain: z.enum(["Mobility","Energy","Housing","PublicHealth","Governance"]),
  description: z.string().optional(),
  params: z.record(z.string(), z.number()),
  rollout: z.object({ 
    scope: z.enum(["Pilot","District","Citywide"]), 
    durationMonths: z.number() 
  }),
  governanceModel: z.enum(["Municipal","PublicPrivate","CommunityOwned"]).optional(),
});

export const ScenarioSchema = z.object({
  id: z.string(),
  title: z.string(), // e.g. "What if we launched a congestion charge?"
  cityId: z.string(),
  intervention: InterventionSchema,
  assumptions: z.array(z.string()),
});

export const ResultSchema = z.object({
  scenarioId: z.string(),
  kpis: z.object({
    emissionsDeltaPct: z.number(),
    congestionDeltaPct: z.number(),
    avgCommuteDeltaMin: z.number(),
    modalShift: z.object({ 
      car: z.number(), 
      transit: z.number(), 
      walk: z.number(), 
      cycle: z.number() 
    }),
    fiscalImpactMGBP: z.number(),
    healthIndexDelta: z.number(),
    trustIndexDelta: z.number(),
    equityScore: z.number(),
  }),
  narrativeFindings: z.array(z.string()),
  risks: z.array(z.string()),
  confidence: z.number(),
  stakeholderSentiment: z.object({
    citizens: z.number(), 
    businesses: z.number(), 
    ngo: z.number(), 
    council: z.number()
  }),
});

export type City = z.infer<typeof CitySchema>;
export type Intervention = z.infer<typeof InterventionSchema>;
export type Scenario = z.infer<typeof ScenarioSchema>;
export type Result = z.infer<typeof ResultSchema>;
