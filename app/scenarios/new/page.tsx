'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWhatIfStore } from '../../../src/lib/store';
import AIChatInterface from '../../../src/components/AIChatInterface';

const STEPS = [
  { id: 0, title: 'Your Question', description: 'What are you curious about?' },
  { id: 1, title: 'Choose a City', description: 'Where would this happen?' },
  { id: 2, title: 'Pick Interventions', description: 'What would you like to test?' },
  { id: 3, title: 'Review & Generate', description: 'Ready to analyze?' },
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
    selectedInterventionIds,
    addSelectedIntervention,
    removeSelectedIntervention,
    clearSelectedInterventions,
    assumptions,
    addAssumption,
    removeAssumption,
    createScenario,
    generateScenario,
    cities,
    interventions,
    generateCustomCity,
    generateCustomIntervention,
    loadSampleData,
    reset,
  } = useWhatIfStore();

  const [assumptionInput, setAssumptionInput] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiChatContext, setAiChatContext] = useState<'city' | 'intervention'>('city');
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [selectedInterventionDetails, setSelectedInterventionDetails] = useState<string | null>(null);

  useEffect(() => {
    if ((currentStep === 1 && (!cities || cities.length === 0)) || (currentStep === 2 && (!interventions || interventions.length === 0))) {
      loadSampleData();
    }
  }, [currentStep, cities, interventions, loadSampleData]);

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

  const handleCreateAndGenerate = async () => {
    const scenario = createScenario();
    if (scenario) {
      try {
        const result = await generateScenario(scenario.id);
        if (result) {
          router.push(`/scenarios/${scenario.id}`);
        }
      } catch (error) {
        console.error('Failed to generate scenario:', error);
        // In a real app, you'd show an error message to the user
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
          addSelectedIntervention(intervention.id);
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
        return selectedInterventionIds.length > 0;
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
                  placeholder="could enhance the collective intelligence of our city?"
                  className="block w-full pl-32 pr-4 py-4 text-lg border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Think about outcomes: What would success look like? Who would benefit?
              </p>
            </div>
          </div>
        );

      case 1:
        if (!cities || cities.length === 0) {
          return (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading cities...</p>
              </div>
            </div>
          );
        }
        
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-slate-700 mb-3">
                Select a city context
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
                    
                    {/* Required fields */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {city.scale}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600">
                        <strong>Main Challenges:</strong> {city.mainChallenges?.join(', ')}
                      </div>
                    </div>

                    {/* Optional fields (progressive disclosure) */}
                    {city.populationContext && (
                      <div className="text-sm text-slate-600 mb-2">
                        <strong>Population:</strong> {city.populationContext.size?.toLocaleString()} 
                        {city.populationContext.demographics && ` (${city.populationContext.demographics})`}
                      </div>
                    )}
                    
                    {city.existingAssets && city.existingAssets.length > 0 && (
                      <div className="text-sm text-slate-600">
                        <strong>Assets:</strong> {city.existingAssets.slice(0, 3).join(', ')}
                        {city.existingAssets.length > 3 && ` +${city.existingAssets.length - 3} more`}
                      </div>
                    )}

                    {city.id && city.id.startsWith('custom-') && (
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
        if (!interventions || interventions.length === 0) {
          return (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading interventions...</p>
              </div>
            </div>
          );
        }
        
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-slate-700 mb-3">
                Choose interventions (select multiple for portfolio approach)
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

              {/* Selected Interventions */}
              {selectedInterventionIds.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Selected Interventions ({selectedInterventionIds.length})</h4>
                  <div className="space-y-2">
                    {selectedInterventionIds.map((id) => {
                      const intervention = interventions.find(i => i.id === id);
                      return intervention ? (
                        <div key={id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div>
                            <div className="font-medium text-slate-900">{intervention.title}</div>
                            <div className="text-sm text-slate-600">{intervention.summary}</div>
                          </div>
                          <button
                            onClick={() => removeSelectedIntervention(id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Available Interventions */}
              <div className="grid gap-4">
                {interventions
                  .filter(i => !selectedInterventionIds.includes(i.id))
                  .map((intervention) => (
                    <div key={intervention.id} className="p-6 border-2 border-slate-200 rounded-lg hover:border-slate-300 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-slate-900 mb-2">{intervention.title}</h3>
                          <p className="text-slate-600 mb-3">{intervention.summary}</p>
                          
                          {/* Required fields */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                              {intervention.category}
                            </span>
                            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                              {intervention.scopeOfApplication}
                            </span>
                          </div>

                          {/* Optional fields (progressive disclosure) */}
                          {intervention.stakeholderFocus && intervention.stakeholderFocus.length > 0 && (
                            <div className="text-sm text-slate-600 mb-2">
                              <strong>Focus:</strong> {intervention.stakeholderFocus.join(', ')}
                            </div>
                          )}

                          {intervention.synergies && intervention.synergies.length > 0 && (
                            <div className="text-sm text-slate-600">
                              <strong>Synergies:</strong> {intervention.synergies.join(', ')}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <button
                            onClick={() => addSelectedIntervention(intervention.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => setSelectedInterventionDetails(intervention.id)}
                            className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 text-sm"
                          >
                            Details
                          </button>
                        </div>
                      </div>

                      {intervention.id && intervention.id.startsWith('custom-') && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            AI Generated
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );

      case 3:
        const selectedCity = cities.find(c => c.id === selectedCityId);
        const selectedInterventions = interventions.filter(i => selectedInterventionIds.includes(i.id));
        
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
                  <h3 className="font-semibold text-slate-900">Interventions ({selectedInterventions.length}):</h3>
                  <div className="space-y-2">
                    {selectedInterventions.map((intervention) => (
                      <div key={intervention.id} className="text-slate-700">
                        • {intervention.title} ({intervention.category})
                      </div>
                    ))}
                  </div>
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
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Scenario</h1>
            <p className="text-slate-600">Walk through the steps to set up your urban intervention analysis</p>
          </div>
          <button
            onClick={() => {
              reset();
              setCurrentStep(0);
            }}
            className="px-4 py-2 text-sm border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50"
          >
            Start Over
          </button>
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
                onClick={handleCreateAndGenerate}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Generate Scenario Analysis
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

      {/* Intervention Details Modal */}
      {selectedInterventionDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  {interventions.find(i => i.id === selectedInterventionDetails)?.title}
                </h2>
                <button
                  onClick={() => setSelectedInterventionDetails(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {(() => {
                const intervention = interventions.find(i => i.id === selectedInterventionDetails);
                if (!intervention) return null;
                
                return (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Summary</h3>
                      <p className="text-slate-700">{intervention.summary}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Category & Scope</h3>
                      <div className="flex gap-2 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {intervention.category}
                        </span>
                      </div>
                      <p className="text-slate-700">{intervention.scopeOfApplication}</p>
                    </div>

                    {intervention.detailedDescription && (
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Detailed Description</h3>
                        <p className="text-slate-700">{intervention.detailedDescription}</p>
                      </div>
                    )}

                    {intervention.stakeholderFocus && intervention.stakeholderFocus.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Stakeholder Focus</h3>
                        <div className="flex flex-wrap gap-2">
                          {intervention.stakeholderFocus.map((stakeholder, index) => (
                            <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                              {stakeholder}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {intervention.intendedOutcomes && intervention.intendedOutcomes.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Intended Outcomes</h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-700">
                          {intervention.intendedOutcomes.map((outcome, index) => (
                            <li key={index}>{outcome}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {intervention.synergies && intervention.synergies.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Synergies</h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-700">
                          {intervention.synergies.map((synergy, index) => (
                            <li key={index}>{synergy}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {intervention.risks && intervention.risks.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Risks</h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-700">
                          {intervention.risks.map((risk, index) => (
                            <li key={index}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {intervention.implementationNotes && (
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Implementation Notes</h3>
                        <p className="text-slate-700">{intervention.implementationNotes}</p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
