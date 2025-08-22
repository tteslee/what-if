import { CityProfile, Intervention } from '../lib/schemas';

export const sampleCities: CityProfile[] = [
  {
    id: 'helsinki',
    name: 'Helsinki',
    scale: 'Citywide',
    mainChallenges: ['air quality', 'congestion', 'housing affordability', 'social inequality'],
    populationContext: {
      size: 656920,
      demographics: 'aging population with growing tech sector',
    },
    neighbourhoodCharacteristics: 'mixed-use with strong public transport',
    vulnerableGroups: ['elderly', 'low-income', 'immigrants'],
    regulatoryContext: 'Strong environmental regulations, progressive urban planning',
    timeline: '3-year implementation window',
    budgetConstraints: '€50M available for urban innovation',
    existingAssets: ['extensive tram network', 'public housing blocks', 'green spaces'],
  },
  {
    id: 'madrid',
    name: 'Madrid',
    scale: 'Citywide',
    mainChallenges: ['heat island effect', 'air pollution', 'traffic congestion'],
    populationContext: {
      size: 3223000,
      demographics: 'diverse population with strong cultural heritage',
    },
    neighbourhoodCharacteristics: 'dense urban core with expanding suburbs',
    vulnerableGroups: ['elderly', 'children', 'outdoor workers'],
    regulatoryContext: 'EU air quality standards, local climate action plan',
    timeline: '2-year pilot phase',
    budgetConstraints: '€30M for climate adaptation',
    existingAssets: ['metro system', 'parks and plazas', 'historic buildings'],
  },
  {
    id: 'singapore',
    name: 'Singapore',
    scale: 'Citywide',
    mainChallenges: ['land scarcity', 'climate resilience', 'aging infrastructure'],
    populationContext: {
      size: 5704000,
      demographics: 'multicultural population with high tech adoption',
    },
    neighbourhoodCharacteristics: 'high-density mixed-use development',
    vulnerableGroups: ['elderly', 'low-income workers', 'migrant workers'],
    regulatoryContext: 'Strong government planning, strict environmental standards',
    timeline: '5-year strategic planning cycle',
    budgetConstraints: 'SGD 100M for smart city initiatives',
    existingAssets: ['MRT system', 'green buildings', 'water catchment areas'],
  },
];

export const sampleInterventions: Intervention[] = [
  {
    id: 'school-air-quality-sensors',
    title: 'School Air Quality Sensors',
    summary: 'Install low-cost sensors in schools to monitor air quality and inform traffic management',
    category: 'Technology',
    scopeOfApplication: 'Primary schools in urban areas',
    detailedDescription: 'Deploy a network of air quality sensors in and around primary schools to monitor pollution levels in real-time. The data will be used to inform traffic management decisions and raise awareness about air quality issues affecting children.',
    parameters: {
      sensorsCount: 200,
      schoolsCovered: 50,
      dataFrequency: '5 minutes',
      costPerSensor: '€150',
    },
    synergies: ['Works best with: School Streets', 'Green Corridors', 'Traffic Calming'],
    intendedOutcomes: [
      'Reduce children\'s exposure to air pollution',
      'Improve traffic management around schools',
      'Increase public awareness of air quality issues'
    ],
    stakeholderFocus: ['children', 'parents', 'school administrators', 'traffic planners'],
    implementationNotes: '6-month pilot phase, €30K budget, requires school board approval and data governance framework',
    risks: [
      'Sensor maintenance and calibration challenges',
      'Privacy concerns about location data',
      'Potential for data overload without clear action protocols'
    ],
  },
  {
    id: 'congestion-pricing',
    title: 'Congestion Pricing',
    summary: 'Introduce a daily charge for driving in the city centre during peak hours',
    category: 'PolicyAndRegulation',
    scopeOfApplication: 'City centre zone during peak hours',
    detailedDescription: 'Implement a variable pricing system for vehicle access to the city centre during peak hours, with exemptions for essential services and low-income residents.',
    parameters: {
      dailyCharge: '€15',
      coverageArea: '0.15 km²',
      peakHours: 6,
      exemptions: '20%',
    },
    synergies: ['Works best with: Public Transport Improvements', 'Active Travel Infrastructure'],
    intendedOutcomes: [
      'Reduce traffic congestion in city centre',
      'Encourage modal shift to public transport',
      'Generate revenue for sustainable transport infrastructure'
    ],
    stakeholderFocus: ['commuters', 'local businesses', 'delivery drivers', 'residents'],
    implementationNotes: '18-month implementation, €3.2M capital cost, requires public consultation and legal framework',
    risks: [
      'Displacement of traffic to adjacent areas',
      'Negative impact on local businesses',
      'Public resistance to new charges'
    ],
  },
  {
    id: 'community-solar',
    title: 'Community Solar',
    summary: 'Install solar panels on public buildings and offer community energy sharing',
    category: 'Technology',
    scopeOfApplication: 'Public buildings and community facilities',
    detailedDescription: 'Deploy solar photovoltaic systems on public buildings and create a community energy sharing program that allows residents to invest in and benefit from renewable energy generation.',
    parameters: {
      solarCapacity: '2.5 MW',
      publicBuildings: '30%',
      communityParticipation: '25%',
      energyPriceReduction: '15%',
    },
    synergies: ['Works best with: Energy Efficiency Programs', 'Community Engagement'],
    intendedOutcomes: [
      'Increase renewable energy adoption',
      'Reduce energy costs for participants',
      'Build community ownership of energy infrastructure'
    ],
    stakeholderFocus: ['low-income households', 'community groups', 'public building users'],
    implementationNotes: '24-month project, €8.5M capital cost, requires regulatory approval for energy sharing',
    risks: [
      'High upfront costs may limit participation',
      'Seasonal variations in energy generation',
      'Complex legal and regulatory framework'
    ],
  },
  {
    id: 'school-streets',
    title: 'School Streets',
    summary: 'Close streets around schools during drop-off and pick-up times',
    category: 'PhysicalInfrastructure',
    scopeOfApplication: 'Streets adjacent to primary schools',
    detailedDescription: 'Temporarily close streets around schools during morning drop-off and afternoon pick-up times to create safe, car-free zones for children walking and cycling to school.',
    parameters: {
      closureDuration: '2 hours',
      schoolsCovered: 25,
      enforcementMethod: 'Automatic barriers',
      communityEngagement: 'High',
    },
    synergies: ['Works best with: School Air Quality Sensors', 'Active Travel Promotion'],
    intendedOutcomes: [
      'Improve child safety around schools',
      'Encourage active travel to school',
      'Reduce air pollution near schools'
    ],
    stakeholderFocus: ['children', 'parents', 'school staff', 'local residents'],
    implementationNotes: '12-month pilot, €500K budget, requires community consultation and traffic impact assessment',
    risks: [
      'Displacement of traffic to adjacent streets',
      'Resistance from car-dependent families',
      'Enforcement challenges'
    ],
  },
  {
    id: 'participatory-budgeting',
    title: 'Participatory Budgeting',
    summary: 'Allow citizens to directly decide how to spend a portion of the municipal budget',
    category: 'CivicParticipation',
    scopeOfApplication: 'Citywide with district-level implementation',
    detailedDescription: 'Allocate a percentage of the municipal budget for citizens to propose and vote on local projects, with special outreach to underrepresented communities.',
    parameters: {
      budgetPercentage: '5%',
      minimumVotingAge: 16,
      projectCategories: 4,
      outreachTarget: '80%',
    },
    synergies: ['Works best with: Digital Democracy Platforms', 'Community Engagement'],
    intendedOutcomes: [
      'Increase civic participation and engagement',
      'Improve transparency in budget allocation',
      'Address local community needs more effectively'
    ],
    stakeholderFocus: ['residents', 'community groups', 'local businesses', 'youth'],
    implementationNotes: 'Annual cycle, €2M budget allocation, requires digital platform and community outreach',
    risks: [
      'Low participation rates',
      'Difficulty reaching underrepresented groups',
      'Potential for populist or short-term projects'
    ],
  },
];
