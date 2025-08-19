'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWhatIfStore } from '../../../src/lib/store';
import AIChatInterface from '../../../src/components/AIChatInterface';

const STEPS = [
  { id: 0, title: 'Your Question', description: 'What are you curious about?' },
  { id: 1, title: 'Choose a City', description: 'Where would this happen?' },
  { id: 2, title: 'Pick an Intervention', description: 'What would you like to test?' },
  { id: 3, title: 'Review & Run', description: 'Ready to simulate?' },
];

export default function NewScenarioPage() {
  const router = useRouter();
  const {
    currentStep,
    setCurrentStep,
    whatIfQuestion,
    setWhatIfQuestion,
    selectedCityId,
    setSelectedCity,
    selectedInterventionId,
    setSelectedIntervention,
    assumptions,
    addAssumption,
    removeAssumption,
    createScenario,
    runScenario,
    cities,
    interventions,
    generateCustomCity,
    generateCustomIntervention,
    loadSampleData,
  } = useWhatIfStore();

  useEffect(() => {
    loadSampleData();
  }, [loadSampleData]);

  const [assumptionInput, setAssumptionInput] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiChatContext, setAiChatContext] = useState<'city' | 'intervention'>('city');

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateAndRun = () => {
    const scenario = createScenario();
    if (scenario) {
      const result = runScenario(scenario.id);
      if (result) {
        router.push(`/scenarios/${scenario.id}`);
      }
    }
  };

  const handleAIChatGenerate = async (description: string) => {
    try {
      if (aiChatContext === 'city') {
        const city = await generateCustomCity(description);
        if (city) {
          setSelectedCity(city.id);
          setShowAIChat(false);
        }
      } else {
        const intervention = await generateCustomIntervention(description);
        if (intervention) {
          setSelectedIntervention(intervention.id);
          setShowAIChat(false);
        }
      }
    } catch (error) {
      console.error('Error generating profile:', error);
    }
  };

  const handleStartAIChat = (context: 'city' | 'intervention') => {
    setAiChatContext(context);
    setShowAIChat(true);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return whatIfQuestion.trim().length > 0;
      case 1:
        return selectedCityId !== null;
      case 2:
        return selectedInterventionId !== null;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-slate-700 mb-3">
                Complete your question
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-xl font-medium text-slate-500">What if we</span>
                </div>
                <input
                  type="text"
                  value={whatIfQuestion}
                  onChange={(e) => setWhatIfQuestion(e.target.value)}
                  placeholder="introduced congestion pricing?"
                  className="block w-full pl-32 pr-4 py-4 text-lg border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-slate-700 mb-3">
                Select a city to test your intervention
              </label>
              
              {/* AI Chat Option */}
              <div className="mb-6">
                <button
                  onClick={() => handleStartAIChat('city')}
                  className="w-full p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className="text-blue-600 font-medium">Create Custom City with AI</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">Describe your urban context and let AI generate a city profile</p>
                </button>
              </div>

              <div className="grid gap-4">
                {cities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCity(city.id)}
                    className={`p-6 text-left border-2 rounded-lg transition-all ${
                      selectedCityId === city.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{city.name}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <div>Population: {city.population.toLocaleString()}</div>
                      <div>Households: {city.households.toLocaleString()}</div>
                      <div>Health Index: {city.baselineHealthIndex}</div>
                      <div>Trust Index: {city.trustIndex}</div>
                    </div>
                    {city.id.startsWith('custom-') && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          AI Generated
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-slate-700 mb-3">
                Choose an intervention type
              </label>
              
              {/* AI Chat Option */}
              <div className="mb-6">
                <button
                  onClick={() => handleStartAIChat('intervention')}
                  className="w-full p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className="text-blue-600 font-medium">Create Custom Intervention with AI</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">Describe your intervention idea and let AI generate a detailed profile</p>
                </button>
              </div>

              <div className="grid gap-4">
                {interventions.map((intervention) => (
                  <button
                    key={intervention.id}
                    onClick={() => setSelectedIntervention(intervention.id)}
                    className={`p-6 text-left border-2 rounded-lg transition-all ${
                      selectedInterventionId === intervention.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{intervention.name}</h3>
                    <p className="text-slate-600 mb-3">{intervention.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                        {intervention.domain}
                      </span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                        {intervention.rollout.scope}
                      </span>
                    </div>
                    {intervention.id.startsWith('custom-') && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          AI Generated
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        const selectedCity = cities.find(c => c.id === selectedCityId);
        const selectedIntervention = interventions.find(i => i.id === selectedInterventionId);
        
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-slate-700 mb-3">
                Review your scenario
              </label>
              <div className="bg-slate-50 p-6 rounded-lg space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900">Question:</h3>
                  <p className="text-lg text-slate-700">What if we {whatIfQuestion}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">City:</h3>
                  <p className="text-slate-700">{selectedCity?.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Intervention:</h3>
                  <p className="text-slate-700">{selectedIntervention?.name}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-slate-700 mb-3">
                Add any key assumptions (optional)
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={assumptionInput}
                    onChange={(e) => setAssumptionInput(e.target.value)}
                    placeholder="e.g., Public transport capacity increases by 20%"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (assumptionInput.trim()) {
                          addAssumption(assumptionInput.trim());
                          setAssumptionInput('');
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (assumptionInput.trim()) {
                        addAssumption(assumptionInput.trim());
                        setAssumptionInput('');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                {assumptions.length > 0 && (
                  <div className="space-y-2">
                    {assumptions.map((assumption, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded">
                        <span className="text-sm text-slate-700 flex-1">{assumption}</span>
                        <button
                          onClick={() => removeAssumption(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Scenario</h1>
          <p className="text-slate-600">Walk through the steps to set up your urban intervention simulation</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step.id + 1}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-slate-900">{step.title}</h3>
                  <p className="text-xs text-slate-500">{step.description}</p>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          
          <div className="flex gap-3">
            {currentStep === STEPS.length - 1 ? (
              <button
                onClick={handleCreateAndRun}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create & Run Simulation
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Chat Modal */}
      {showAIChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <AIChatInterface
              context={aiChatContext}
              onGenerate={handleAIChatGenerate}
              onCancel={() => setShowAIChat(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
