export const ko = {
  // Navigation
  nav: {
    home: '홈',
    newScenario: '새 시나리오',
    myScenarios: '내 시나리오',
    publicScenarios: '공개 시나리오',
    login: '로그인',
    signup: '회원가입',
    logout: '로그아웃',
  },

  // Authentication
  auth: {
    signIn: '로그인',
    signOut: '로그아웃',
    loading: '로딩 중...',
  },

  // Main page
  main: {
    title: 'What-if',
    subtitle: '도시 혁신을 위한 디지털 실험실',
    description: '"만약에" 질문을 던지고 다양한 아이디어가 도시 환경을 어떻게 변화시킬 수 있는지 확인해보세요.',
    inputPlaceholder: '도시의 집단 지능을 향상시킬 수 있다면?',
    createScenario: '새 시나리오 만들기',
    showExamples: '예시 질문 보기',
    hideExamples: '예시 질문 숨기기',
    exampleQuestions: [
      '헬싱키의 집단 지능을 향상시킬 수 있다면?',
      '마드리드를 8.5도 시원하게 만들 수 있다면?',
      '싱가포르에서 교통사고를 완전히 없앨 수 있다면?',
      '모든 사람이 살 수 있는 주택을 만들 수 있다면?',
      '제로웨이스트 순환 경제를 만들 수 있다면?',
      '모든 아이가 도보 거리 내에서 양질의 교육을 받을 수 있다면?',
    ],
  },

  // Scenario creation
  scenario: {
    steps: {
      question: {
        title: '당신의 아이디어',
        description: '무엇이 궁금하신가요?',
        label: '만약에 우리가',
        placeholder: '도시의 집단 지능을 향상시킬 수 있다면?',
      },
      city: {
        title: '도시 선택',
        description: '어디서 일어날까요?',
        createCustom: '맞춤 도시 만들기',
        createCustomDescription: '폼을 작성하여 나만의 도시 프로필을 만드세요',
      },
      interventions: {
        title: '솔루션 선택',
        description: '무엇을 테스트하고 싶으신가요?',
        createCustom: '커스텀 솔루션 만들기',
        createCustomDescription: '폼을 작성하여 자신만의 솔루션 프로필을 만드세요',
        selected: '선택된 솔루션',
        available: '사용 가능한 솔루션',
      },
      review: {
        title: '검토 및 생성',
        description: '분석할 준비가 되었나요?',
        question: '질문:',
        city: '도시:',
        interventions: '솔루션:',
        assumptions: '가정:',
        addAssumption: '가정 추가',
        privacy: '공개여부:',
        public: '공개',
        private: '비공개',
        publicDescription: '이 시나리오는 모든 사람에게 보입니다',
        privateDescription: '이 시나리오는 당신에게만 보입니다',
        generate: '시나리오 분석 생성',
        generating: '분석 생성 중...',
      },
    },
    buttons: {
      next: '다음',
      previous: '이전',
      create: '새 시나리오 만들기',
      view: '보기',
      delete: '삭제',
      makePublic: '공개로 만들기',
      makePrivate: '비공개로 만들기',
    },
  },

  // Common
  common: {
    loading: '로딩 중...',
    error: '오류',
    success: '성공',
    cancel: '취소',
    save: '저장',
    edit: '편집',
    delete: '삭제',
    confirm: '확인',
    back: '뒤로',
    close: '닫기',
  },

  // Status messages
  status: {
    noScenarios: '시나리오를 찾을 수 없습니다',
    noPublicScenarios: '아직 공개 시나리오가 없습니다',
    beFirstToShare: '커뮤니티와 공유할 첫 번째 시나리오를 만드세요.',
    scenarioNotGenerated: '시나리오 분석이 생성되지 않음',
    scenarioNotGeneratedDescription: '시나리오 분석이 아직 생성되지 않았습니다. 오류가 발생했거나 분석이 아직 진행 중일 수 있습니다.',
  },
};
