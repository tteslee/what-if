export const en = {
  // Navigation
  nav: {
    home: 'Home',
    newScenario: 'New Scenario',
    myScenarios: 'My Scenarios',
    publicScenarios: 'Public Scenarios',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
  },

  // Authentication
  auth: {
    signIn: 'Sign In',
    signOut: 'Sign Out',
    loading: 'Loading...',
  },

  // Main page
  main: {
    title: 'What-if',
    subtitle: 'Explore the future of your city',
    description: 'Ask "what if" questions and discover how different interventions could transform your urban environment.',
    inputPlaceholder: 'could enhance the collective intelligence of your city?',
    createScenario: 'Create New Scenario',
    showExamples: 'Show example questions',
    hideExamples: 'Hide example questions',
    exampleQuestions: [
      'could enhance the collective intelligence of Helsinki?',
      'could cool Madrid by 8.5 degrees celsius?',
      'could eliminate traffic fatalities in Singapore?',
      'could make housing affordable for everyone in our city?',
      'could create a zero-waste circular economy?',
      'could ensure every child has access to quality education within walking distance?',
    ],
  },

  // Design Principles
  designPrinciples: {
    requiredFirst: {
      title: 'Required First',
      description: 'Start with essential information - city, scope, and challenges. Add details progressively without blocking progress.',
    },
    portfolioApproach: {
      title: 'Portfolio Approach',
      description: 'Combine multiple interventions to create synergistic effects. Identify gaps and opportunities across different categories.',
    },
    stressTestNarratives: {
      title: 'Stress-Test Narratives',
      description: 'Generate structured analysis focusing on stakeholders, risks, and next experiments rather than predictions.',
    },
  },

  // Warning Message
  warning: {
    title: '⚠️ Important:',
    message: 'This is an exploratory simulation tool, not a forecast. Use for decision support and sensemaking.',
  },

  // Scenario creation
  scenario: {
    steps: {
      question: {
        title: 'Your Question',
        description: 'What are you curious about?',
        label: 'What if we',
        placeholder: 'could enhance the collective intelligence of your city?',
      },
      city: {
        title: 'Choose a City',
        description: 'Where would this happen?',
        createCustom: 'Create Custom City',
        createCustomDescription: 'Fill out a form to create your own city profile',
      },
      interventions: {
        title: 'Pick Interventions',
        description: 'What would you like to test?',
        createCustom: 'Create Custom Intervention',
        createCustomDescription: 'Fill out a form to create your own intervention profile',
        selected: 'Selected Interventions',
        available: 'Available Interventions',
      },
      review: {
        title: 'Review & Generate',
        description: 'Ready to analyze?',
        question: 'Question:',
        city: 'City:',
        interventions: 'Interventions:',
        assumptions: 'Assumptions:',
        addAssumption: 'Add assumption',
        privacy: 'Privacy:',
        public: 'Public',
        private: 'Private',
        publicDescription: 'This scenario will be visible to everyone',
        privateDescription: 'This scenario will only be visible to you',
        generate: 'Generate Scenario Analysis',
        generating: 'Generating analysis...',
      },
    },
    buttons: {
      next: 'Next',
      previous: 'Previous',
      create: 'Create New Scenario',
      view: 'View',
      delete: 'Delete',
      makePublic: 'Make Public',
      makePrivate: 'Make Private',
    },
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    back: 'Back',
    close: 'Close',
  },

  // Status messages
  status: {
    noScenarios: 'No scenarios found',
    noPublicScenarios: 'No public scenarios yet',
    beFirstToShare: 'Be the first to share a scenario with the community.',
    scenarioNotGenerated: 'Scenario Analysis Not Generated',
    scenarioNotGeneratedDescription: 'The scenario analysis hasn\'t been generated yet. This might be due to an error or the analysis is still in progress.',
  },
};
