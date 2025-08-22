'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWhatIfStore } from '../src/lib/store';

const EXAMPLE_QUESTIONS = [
  "What if we could enhance the collective intelligence of Helsinki?",
  "What if we could cool Madrid by 8.5 degrees celsius?",
  "What if we could eliminate traffic fatalities in Singapore?",
  "What if we could make housing affordable for everyone in our city?",
  "What if we could create a zero-waste circular economy?",
  "What if we could ensure every child has access to quality education within walking distance?",
];

export default function HomePage() {
  const router = useRouter();
  const { loadSampleData, setWhatIfQuestion } = useWhatIfStore();
  const [inputValue, setInputValue] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  useEffect(() => {
    loadSampleData();
  }, [loadSampleData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setWhatIfQuestion(inputValue.trim());
      router.push('/scenarios/new');
    }
  };

  const handleExampleClick = (example: string) => {
    setWhatIfQuestion(example);
    setInputValue(example);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              What-if
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
              A digital testbed for urban innovation
            </p>
            
            {/* Question Input */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-xl font-medium text-slate-500">What if we</span>
                  </div>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="could enhance the collective intelligence of our city?"
                    className="block w-full pl-36 pr-4 py-4 text-lg border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  Explore the possibilities
                </button>
              </form>

              {/* Example Questions */}
              <div className="mt-6">
                <button
                  onClick={() => setShowExamples(!showExamples)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {showExamples ? 'Hide' : 'Show'} example questions
                </button>
                
                {showExamples && (
                  <div className="mt-4 space-y-2">
                    {EXAMPLE_QUESTIONS.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => handleExampleClick(example)}
                        className="block w-full text-left p-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Design Principles */}
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Required First</h3>
                  <p className="text-slate-600 text-sm">Start with essential information - city, scope, and challenges. Add details progressively without blocking progress.</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Portfolio Approach</h3>
                  <p className="text-slate-600 text-sm">Combine multiple interventions to create synergistic effects. Identify gaps and opportunities across different categories.</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Stress-Test Narratives</h3>
                  <p className="text-slate-600 text-sm">Generate structured analysis focusing on stakeholders, risks, and next experiments rather than predictions.</p>
                </div>
              </div>
            </div>

            {/* Caveat Banner */}
            <div className="mt-12 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-2xl mx-auto">
              <p className="text-amber-800 text-sm">
                <span className="font-medium">⚠️ Important:</span> This is an exploratory simulation tool, not a forecast. 
                Use for decision support and sensemaking.
              </p>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Ask Questions</h3>
            <p className="text-slate-600">Start with &ldquo;What if we...&rdquo; and explore urban interventions with outcomes in mind</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Build Portfolios</h3>
            <p className="text-slate-600">Combine interventions and analyze synergies, gaps, and stakeholder impacts</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Generate Scenarios</h3>
            <p className="text-slate-600">Get structured analysis with stakeholder impacts, risks, and next experiments</p>
          </div>
        </div>
      </div>
    </div>
  );
}
