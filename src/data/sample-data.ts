import { CityProfile, Intervention } from '../lib/schemas';

export const sampleCities: CityProfile[] = [
  {
    id: 'midvale',
    name: 'Midvale',
    demographics: {
      population: 125000,
      households: 52000,
      medianAge: 39,
      povertyRatePct: 14.2,
      inequalityGini_0_1: 0.42,
    },
    mobility: {
      avgCommuteMin: 28,
      congestionIndex: 0.45,
      modalShare: {
        carPct: 65,
        transitPct: 20,
        walkPct: 10,
        cyclePct: 5,
      },
      publicTransportCoveragePct: 78,
    },
    housing: {
      vacancyRatePct: 8.0,
      rentBurdenedHouseholdsPct: 38,
      affordableUnitsCount: 8500,
    },
    environment: {
      ghgEmissionsMtCO2e: 0.85,
      pm25µgPerM3: 14,
      no2µgPerM3: 28,
      urbanCanopyCoverPct: 22,
    },
    health: {
      baselineHealthIndex_0_100: 72,
      respiratoryAdmissionsPer100k: 52,
      mentalHealthIndex_0_100: 65,
    },
    economy: {
      unemploymentRatePct: 5.1,
      medianHouseholdIncome: 58000,
      localBusinessFormationRate: 7.8,
    },
    socialGovernance: {
      trustIndex_0_100: 68,
      civicParticipationRatePct: 42,
      perceivedSafetyIndex_0_100: 69,
    },
    fiscal: {
      municipalBudgetBalanceM: 8.2,
    },
    dataQuality: {
      coverageScore_0_1: 0.75,
      freshnessMonths: 8,
      notes: "Data from annual urban surveys and quarterly government reports",
    },
    implementationReadiness: {
      politicalWill_0_1: 0.6,
      institutionalCapacity_0_1: 0.7,
      communitySupport_0_1: 0.5,
      fundingAvailability_0_1: 0.4,
    },
  },
  {
    id: 'harbourton',
    name: 'Harbourton',
    demographics: {
      population: 89000,
      households: 38000,
      medianAge: 41,
      povertyRatePct: 11.8,
      inequalityGini_0_1: 0.38,
    },
    mobility: {
      avgCommuteMin: 22,
      congestionIndex: 0.32,
      modalShare: {
        carPct: 55,
        transitPct: 25,
        walkPct: 15,
        cyclePct: 5,
      },
      publicTransportCoveragePct: 82,
    },
    housing: {
      vacancyRatePct: 12.0,
      rentBurdenedHouseholdsPct: 32,
      affordableUnitsCount: 6200,
    },
    environment: {
      ghgEmissionsMtCO2e: 0.62,
      pm25µgPerM3: 11,
      no2µgPerM3: 22,
      urbanCanopyCoverPct: 28,
    },
    health: {
      baselineHealthIndex_0_100: 78,
      respiratoryAdmissionsPer100k: 38,
      mentalHealthIndex_0_100: 72,
    },
    economy: {
      unemploymentRatePct: 4.2,
      medianHouseholdIncome: 72000,
      localBusinessFormationRate: 9.1,
    },
    socialGovernance: {
      trustIndex_0_100: 75,
      civicParticipationRatePct: 48,
      perceivedSafetyIndex_0_100: 76,
    },
    fiscal: {
      municipalBudgetBalanceM: 12.8,
    },
    dataQuality: {
      coverageScore_0_1: 0.82,
      freshnessMonths: 6,
      notes: "Comprehensive data from quarterly surveys and monthly government updates",
    },
    implementationReadiness: {
      politicalWill_0_1: 0.8,
      institutionalCapacity_0_1: 0.85,
      communitySupport_0_1: 0.7,
      fundingAvailability_0_1: 0.6,
    },
  },
];

export const sampleInterventions: Intervention[] = [
  {
    id: 'congestion-charge',
    title: 'Congestion Charge',
    categories: ['PolicyAndRegulation', 'Finance'],
    description: 'Introduce a daily charge for driving in the city centre during peak hours to reduce traffic congestion and encourage modal shift',
    params: {
      dailyCharge: 15,
      coverageArea: 0.15,
      peakHours: 6,
      exemptions: 0.20,
    },
    mechanisms: [
      {
        description: 'Financial disincentive reduces car use in congested areas, encouraging modal shift to public transport and active travel',
        expectedEffects: [
          {
            indicator: 'CongestionIndex',
            direction: 'Decrease',
            magnitudeHintPct: -12,
            evidence: 'High',
            equityWeight_0_2: 0.9,
          },
          {
            indicator: 'ModalShareCarPct',
            direction: 'Decrease',
            magnitudeHintPct: -8,
            evidence: 'High',
          },
          {
            indicator: 'ModalShareTransitPct',
            direction: 'Increase',
            magnitudeHintPct: 6,
            evidence: 'Medium',
          },
          {
            indicator: 'GHGEmissionsMtCO2e',
            direction: 'Decrease',
            magnitudeHintPct: -5,
            evidence: 'Medium',
          },
        ],
      },
    ],
    implementation: {
      scope: 'District',
      durationMonths: 18,
      targetPopulations: ['Commuter drivers', 'City centre workers', 'Local residents'],
      targetGeographies: ['City centre zone'],
      partners: ['Dept. of Transport', 'City Council', 'Local businesses'],
      capexM: 3.2,
      opexPerYearM: 1.8,
      fundingModel: 'Municipal',
      policyInstruments: ['Regulation', 'Incentive'],
    },
    assumptions: [
      'Public transport capacity can handle increased demand',
      'Revenue will be reinvested in sustainable transport infrastructure',
    ],
    risks: [
      'Displacement of traffic to adjacent areas',
      'Negative impact on local businesses',
      'Public resistance to new charges',
    ],
  },
  {
    id: 'community-solar',
    title: 'Community Solar',
    categories: ['Technology', 'Finance', 'Participation'],
    description: 'Install solar panels on public buildings and offer community energy sharing to increase renewable energy adoption and reduce energy costs',
    params: {
      solarCapacity: 2.5,
      publicBuildings: 0.30,
      communityParticipation: 0.25,
      energyPriceReduction: 0.15,
    },
    mechanisms: [
      {
        description: 'Renewable energy generation reduces fossil fuel dependency and creates community ownership model for energy infrastructure',
        expectedEffects: [
          {
            indicator: 'GHGEmissionsMtCO2e',
            direction: 'Decrease',
            magnitudeHintPct: -3,
            evidence: 'High',
            equityWeight_0_2: 1.1,
          },
          {
            indicator: 'LocalBusinessFormationRate',
            direction: 'Increase',
            magnitudeHintPct: 2,
            evidence: 'Medium',
          },
          {
            indicator: 'CivicParticipationRatePct',
            direction: 'Increase',
            magnitudeHintPct: 4,
            evidence: 'Medium',
          },
        ],
      },
    ],
    implementation: {
      scope: 'Citywide',
      durationMonths: 24,
      targetPopulations: ['Low-income households', 'Community groups', 'Public building users'],
      targetGeographies: ['All districts'],
      partners: ['Dept. of Energy', 'Community groups', 'Solar installers', 'Local banks'],
      capexM: 8.5,
      opexPerYearM: 1.2,
      fundingModel: 'PublicPrivate',
      policyInstruments: ['PublicInvestment', 'Incentive', 'EducationCampaign'],
    },
    assumptions: [
      'Solar technology costs continue to decrease',
      'Community engagement can be maintained long-term',
      'Grid infrastructure can handle distributed generation',
    ],
    risks: [
      'High upfront costs may limit participation',
      'Seasonal variations in energy generation',
      'Maintenance and management complexity',
    ],
  },
  {
    id: 'vacant-to-co-housing',
    title: 'Vacant-to-Co-Housing',
    categories: ['Housing', 'UrbanDesign', 'Participation'],
    description: 'Convert vacant properties into community-owned co-housing with shared facilities to address housing shortages and build community',
    params: {
      propertiesConverted: 0.40,
      sharedFacilities: 0.60,
      communityOwnership: 0.80,
      affordabilityImprovement: 0.25,
    },
    mechanisms: [
      {
        description: 'Community ownership model reduces housing costs while shared facilities create social connections and reduce individual living expenses',
        expectedEffects: [
          {
            indicator: 'HousingVacancyRatePct',
            direction: 'Decrease',
            magnitudeHintPct: -15,
            evidence: 'Medium',
            equityWeight_0_2: 1.4,
          },
          {
            indicator: 'RentBurdenedHouseholdsPct',
            direction: 'Decrease',
            magnitudeHintPct: -8,
            evidence: 'Medium',
          },
          {
            indicator: 'AffordableUnitsCount',
            direction: 'Increase',
            magnitudeHintPct: 25,
            evidence: 'High',
          },
          {
            indicator: 'CivicParticipationRatePct',
            direction: 'Increase',
            magnitudeHintPct: 6,
            evidence: 'Medium',
          },
        ],
      },
    ],
    implementation: {
      scope: 'Pilot',
      durationMonths: 36,
      targetPopulations: ['Low-income households', 'Young professionals', 'Community groups'],
      targetGeographies: ['District A', 'District B'],
      partners: ['Housing Authority', 'Community Development Corp', 'Local architects', 'Community groups'],
      capexM: 12.0,
      opexPerYearM: 2.8,
      fundingModel: 'CommunityOwned',
      policyInstruments: ['PublicInvestment', 'Incentive', 'EducationCampaign'],
    },
    assumptions: [
      'Vacant properties are suitable for conversion',
      'Community groups can manage properties effectively',
      'Local planning regulations support co-housing models',
    ],
    risks: [
      'Complex legal and ownership structures',
      'Community management challenges',
      'Potential gentrification effects',
    ],
  },
];
