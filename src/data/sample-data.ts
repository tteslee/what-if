import { CityProfile, Intervention } from '../lib/schemas';

export const sampleCities: CityProfile[] = [
  {
    id: 'helsinki',
    name: 'Helsinki',
    lang: 'en',
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
    lang: 'en',
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
    lang: 'en',
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
    lang: 'en',
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
    lang: 'en',
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
    lang: 'en',
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
    lang: 'en',
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
    lang: 'en',
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

// Korean sample data
export const sampleCitiesKo: CityProfile[] = [
  {
    id: 'helsinki-ko',
    name: '헬싱키',
    lang: 'ko',
    scale: 'Citywide',
    mainChallenges: ['대기질', '교통 체증', '주택 가격 상승', '사회적 불평등'],
    populationContext: {
      size: 656920,
      demographics: '고령화 인구와 성장하는 기술 부문',
    },
    neighbourhoodCharacteristics: '강력한 대중교통을 갖춘 복합용도 지역',
    vulnerableGroups: ['고령자', '저소득층', '이민자'],
    regulatoryContext: '강력한 환경 규제, 진보적 도시 계획',
    timeline: '3년 실행 기간',
    budgetConstraints: '도시 혁신을 위한 5천만 유로 예산',
    existingAssets: ['광범위한 트램 네트워크', '공공주택 단지', '녹지 공간'],
  },
  {
    id: 'madrid-ko',
    name: '마드리드',
    lang: 'ko',
    scale: 'Citywide',
    mainChallenges: ['열섬 효과', '대기 오염', '교통 체증'],
    populationContext: {
      size: 3223000,
      demographics: '강력한 문화 유산을 가진 다양한 인구',
    },
    neighbourhoodCharacteristics: '확장되는 교외 지역을 가진 조밀한 도시 중심부',
    vulnerableGroups: ['고령자', '어린이', '야외 근로자'],
    regulatoryContext: 'EU 대기질 기준, 지역 기후 행동 계획',
    timeline: '2년 파일럿 단계',
    budgetConstraints: '기후 적응을 위한 3천만 유로',
    existingAssets: ['지하철 시스템', '공원과 광장', '역사적 건물'],
  },
  {
    id: 'singapore-ko',
    name: '싱가포르',
    lang: 'ko',
    scale: 'Citywide',
    mainChallenges: ['토지 부족', '기후 회복력', '노후화된 인프라'],
    populationContext: {
      size: 5704000,
      demographics: '높은 기술 도입률을 가진 다문화 인구',
    },
    neighbourhoodCharacteristics: '고밀도 복합용도 개발',
    vulnerableGroups: ['고령자', '저소득 근로자', '이주 근로자'],
    regulatoryContext: '강력한 정부 계획, 엄격한 환경 기준',
    timeline: '5년 전략 계획 주기',
    budgetConstraints: '스마트 시티 이니셔티브를 위한 싱가포르 달러 1억',
    existingAssets: ['MRT 시스템', '녹색 건물', '물 수집 지역'],
  },
];

export const sampleInterventionsKo: Intervention[] = [
  {
    id: 'school-air-quality-sensors-ko',
    lang: 'ko',
    title: '학교 대기질 센서',
    summary: '학교에 저비용 센서를 설치하여 대기질을 모니터링하고 교통 관리를 알림',
    category: 'Technology',
    scopeOfApplication: '도시 지역의 초등학교',
    detailedDescription: '초등학교 내외에 대기질 센서 네트워크를 배치하여 실시간으로 오염 수준을 모니터링합니다. 데이터는 교통 관리 결정을 알리고 어린이에게 영향을 미치는 대기질 문제에 대한 인식을 높이는 데 사용됩니다.',
    parameters: {
      sensorsCount: 200,
      schoolsCovered: 50,
      dataFrequency: '5분',
      costPerSensor: '150유로',
    },
    synergies: ['학교 거리와 함께 사용 시 최적', '녹색 회랑', '교통 진정'],
    intendedOutcomes: [
      '어린이의 대기 오염 노출 감소',
      '학교 주변 교통 관리 개선',
      '대기질 문제에 대한 공공 인식 증가'
    ],
    stakeholderFocus: ['어린이', '부모', '학교 관리자', '교통 계획자'],
    implementationNotes: '6개월 파일럿 단계, 3만 유로 예산, 학교 이사회 승인 및 데이터 거버넌스 프레임워크 필요',
    risks: [
      '센서 유지보수 및 보정 과제',
      '위치 데이터에 대한 개인정보 보호 우려',
      '명확한 행동 프로토콜 없이 데이터 과부하 가능성'
    ],
  },
  {
    id: 'congestion-pricing-ko',
    lang: 'ko',
    title: '혼잡 통행료',
    summary: '피크 시간대 도시 중심가 운전에 일일 요금 도입',
    category: 'PolicyAndRegulation',
    scopeOfApplication: '피크 시간대 도시 중심가 구역',
    detailedDescription: '피크 시간대 도시 중심가 차량 접근에 대한 가변 요금 시스템을 구현하며, 필수 서비스 및 저소득 거주자에 대한 면제를 제공합니다.',
    parameters: {
      dailyCharge: '15유로',
      coverageArea: '0.15 km²',
      peakHours: 6,
      exemptions: '20%',
    },
    synergies: ['대중교통 개선과 함께 사용 시 최적', '활성 이동 인프라'],
    intendedOutcomes: [
      '도시 중심가 교통 체증 감소',
      '대중교통으로의 교통 수단 전환 촉진',
      '지속 가능한 교통 인프라를 위한 수익 창출'
    ],
    stakeholderFocus: ['통근자', '지역 사업자', '배송 기사', '거주자'],
    implementationNotes: '18개월 실행, 320만 유로 자본 비용, 공공 자문 및 법적 프레임워크 필요',
    risks: [
      '인접 지역으로의 교통 이동',
      '지역 사업에 대한 부정적 영향',
      '새로운 요금에 대한 공공 저항'
    ],
  },
  {
    id: 'community-solar-ko',
    lang: 'ko',
    title: '커뮤니티 태양광',
    summary: '공공 건물에 태양광 패널을 설치하고 커뮤니티 에너지 공유 제공',
    category: 'Technology',
    scopeOfApplication: '공공 건물 및 커뮤니티 시설',
    detailedDescription: '공공 건물에 태양광 발전 시스템을 배치하고 거주자가 재생 에너지 발전에 투자하고 혜택을 받을 수 있는 커뮤니티 에너지 공유 프로그램을 만듭니다.',
    parameters: {
      totalCapacity: '2MW',
      buildingsCovered: 25,
      communityMembers: 500,
      paybackPeriod: '8년',
    },
    synergies: ['에너지 효율성 개선과 함께 사용 시 최적', '그린 빌딩 인증'],
    intendedOutcomes: [
      '재생 에너지 생산량 증가',
      '커뮤니티 에너지 독립성 향상',
      '지역 경제에 에너지 수익 유입'
    ],
    stakeholderFocus: ['거주자', '공공 건물 관리자', '에너지 공급업체', '환경 단체'],
    implementationNotes: '12개월 설치, 200만 유로 투자, 커뮤니티 참여 및 에너지 정책 승인 필요',
    risks: [
      '높은 초기 비용으로 참여 제한 가능성',
      '에너지 발전의 계절적 변화',
      '복잡한 법적 및 규제 프레임워크'
    ],
  },
  {
    id: 'school-streets-ko',
    lang: 'ko',
    title: '학교 거리',
    summary: '등하교 시간 동안 학교 주변 거리를 폐쇄',
    category: 'PhysicalInfrastructure',
    scopeOfApplication: '초등학교 인접 거리',
    detailedDescription: '어린이들이 학교까지 걷고 자전거를 타는 안전한 자동차 없는 구역을 만들기 위해 등하교 시간 동안 학교 주변 거리를 일시적으로 폐쇄합니다.',
    parameters: {
      closureHours: '8-9시, 15-16시',
      streetsCovered: 15,
      schoolsAffected: 8,
      enforcementCost: '월 5천 유로',
    },
    synergies: ['활성 이동 인프라와 함께 사용 시 최적', '교통 안전 교육'],
    intendedOutcomes: [
      '어린이의 안전한 등하교 환경 조성',
      '활성 이동 증가',
      '학교 주변 대기질 개선'
    ],
    stakeholderFocus: ['어린이', '부모', '학교 관리자', '교통 계획자'],
    implementationNotes: '3개월 파일럿, 5만 유로 예산, 학교 및 지역 커뮤니티와의 협력 필요',
    risks: [
      '인접 거리로의 교통 이동',
      '자동차 의존 가족의 저항',
      '집행 과제'
    ],
  },
  {
    id: 'participatory-budgeting-ko',
    lang: 'ko',
    title: '참여형 예산',
    summary: '시민이 시 예산의 일부를 직접 결정하도록 허용',
    category: 'CivicParticipation',
    scopeOfApplication: '지구별 실행과 함께 시 전체',
    detailedDescription: '소외 계층에 대한 특별한 접근과 함께 시민이 지역 프로젝트를 제안하고 투표할 수 있도록 시 예산의 일정 비율을 할당합니다.',
    parameters: {
      budgetAllocation: '시 예산의 5%',
      participants: 10000,
      projectLimit: '50만 유로',
      cycleDuration: '12개월',
    },
    synergies: ['시민 참여 플랫폼과 함께 사용 시 최적', '지역 개발 계획'],
    intendedOutcomes: [
      '시민 참여 및 민주주의 강화',
      '지역 우선순위에 대한 더 나은 이해',
      '소외 계층의 목소리 증대'
    ],
    stakeholderFocus: ['시민', '지역 단체', '시의회', '시민 사회'],
    implementationNotes: '6개월 준비, 100만 유로 예산, 시민 교육 및 디지털 플랫폼 개발 필요',
    risks: [
      '낮은 참여율',
      '복잡한 투표 프로세스',
      '정치적 조작 가능성'
    ],
  },
];
