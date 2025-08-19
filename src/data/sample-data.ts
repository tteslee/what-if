import { City, Intervention } from '../lib/schemas';

export const sampleCities: City[] = [
  {
    id: 'midvale',
    name: 'Midvale',
    population: 125000,
    households: 52000,
    incomeGini: 0.42,
    modalSplit: { car: 0.65, transit: 0.20, walk: 0.10, cycle: 0.05 },
    emissionsMtCO2e: 0.85,
    avgCommuteMin: 28,
    housingVacancyRate: 0.08,
    baselineHealthIndex: 72,
    trustIndex: 68,
  },
  {
    id: 'harbourton',
    name: 'Harbourton',
    population: 89000,
    households: 38000,
    incomeGini: 0.38,
    modalSplit: { car: 0.55, transit: 0.25, walk: 0.15, cycle: 0.05 },
    emissionsMtCO2e: 0.62,
    avgCommuteMin: 22,
    housingVacancyRate: 0.12,
    baselineHealthIndex: 78,
    trustIndex: 75,
  },
];

export const sampleInterventions: Intervention[] = [
  {
    id: 'congestion-charge',
    name: 'Congestion Charge',
    domain: 'Mobility',
    description: 'Introduce a daily charge for driving in the city centre during peak hours',
    params: {
      dailyCharge: 15,
      coverageArea: 0.15,
      peakHours: 6,
      exemptions: 0.20,
    },
    rollout: {
      scope: 'District',
      durationMonths: 18,
    },
    governanceModel: 'Municipal',
  },
  {
    id: 'community-solar',
    name: 'Community Solar',
    domain: 'Energy',
    description: 'Install solar panels on public buildings and offer community energy sharing',
    params: {
      solarCapacity: 2.5,
      publicBuildings: 0.30,
      communityParticipation: 0.25,
      energyPriceReduction: 0.15,
    },
    rollout: {
      scope: 'Citywide',
      durationMonths: 24,
    },
    governanceModel: 'PublicPrivate',
  },
  {
    id: 'vacant-to-co-housing',
    name: 'Vacant-to-Co-Housing',
    domain: 'Housing',
    description: 'Convert vacant properties into community-owned co-housing with shared facilities',
    params: {
      propertiesConverted: 0.40,
      sharedFacilities: 0.60,
      communityOwnership: 0.80,
      affordabilityImprovement: 0.25,
    },
    rollout: {
      scope: 'Pilot',
      durationMonths: 36,
    },
    governanceModel: 'CommunityOwned',
  },
];
