'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWhatIfStore } from '../../../src/lib/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function CompareScenariosPage() {
  const router = useRouter();
  const { scenarios, cities, interventions, loadSampleData } = useWhatIfStore();
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [comparisonResults, setComparisonResults] = useState<Array<{
    scenarioId: string;
    kpis: {
      GHGEmissionsMtCO2e?: { deltaPct: number };
      CongestionIndex?: { deltaPct: number };
      AvgCommuteMin?: { delta: number };
      ModalShareCarPct?: { deltaPct: number };
      ModalShareTransitPct?: { deltaPct: number };
      ModalShareWalkPct?: { deltaPct: number };
      ModalShareCyclePct?: { deltaPct: number };
      BaselineHealthIndex_0_100?: { deltaPct: number };
      TrustIndex_0_100?: { deltaPct: number };
    };
    qualitativeFindings?: string[];
    risksMaterialised?: string[];
    confidence_0_1?: number;
    stakeholderSentiment?: {
      citizens: number;
      businesses: number;
      ngo: number;
      council: number;
    };
    equityScore_0_100?: number;
    fiscalImpactM?: number;
  }>>([]);

  useEffect(() => {
    loadSampleData();
  }, [loadSampleData]);

  useEffect(() => {
    if (selectedScenarios.length >= 2) {
      // For now, just set empty results since runComparison doesn't exist
      // TODO: Implement comparison logic
      setComparisonResults([]);
    }
  }, [selectedScenarios]);

  const handleScenarioToggle = (scenarioId: string) => {
    setSelectedScenarios(prev => {
      if (prev.includes(scenarioId)) {
        return prev.filter(id => id !== scenarioId);
      } else if (prev.length < 3) {
        return [...prev, scenarioId];
      }
      return prev;
    });
  };

  const formatPercentage = (value: number) => `${Math.round(Math.abs(value * 100))}%`;
  const formatNumber = (value: number) => Math.abs(Math.round(value * 100) / 100);
  const formatCurrency = (value: number) => `£${Math.abs(Math.round(value * 100) / 100)}M`;

  const getCityName = (cityId: string) => {
    return cities.find((c: { id: string; name: string }) => c.id === cityId)?.name || 'Unknown';
  };

  const getInterventionName = (interventionIds: string[]) => {
    if (interventionIds.length === 0) return 'No Intervention';
    const intervention = interventions.find((i: { id: string; title: string }) => i.id === interventionIds[0]);
    return intervention?.title || 'Unknown Intervention';
  };


  // Chart data for comparison
  const getComparisonChartData = () => {
    if (comparisonResults.length < 2) return [];
    
    return comparisonResults.map((result, index) => ({
      name: `Scenario ${index + 1}`,
      emissions: Math.abs(result.kpis.GHGEmissionsMtCO2e?.deltaPct || 0 * 100),
      congestion: Math.abs(result.kpis.CongestionIndex?.deltaPct || 0 * 100),
      health: result.kpis.BaselineHealthIndex_0_100?.deltaPct || 0,
      trust: result.kpis.TrustIndex_0_100?.deltaPct || 0,
      equity: result.equityScore_0_100 || 0,
    }));
  };

  const getSentimentComparisonData = () => {
    if (comparisonResults.length < 2) return [];
    
    return comparisonResults.map((result, index) => ({
      name: `Scenario ${index + 1}`,
      citizens: result.stakeholderSentiment?.citizens || 0,
      businesses: result.stakeholderSentiment?.businesses || 0,
      ngo: result.stakeholderSentiment?.ngo || 0,
      council: result.stakeholderSentiment?.council || 0,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Compare Scenarios</h1>
          <p className="text-slate-600">Select 2-3 scenarios to compare side by side</p>
        </div>

        {/* Scenario Selection */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Scenarios to Compare</h3>
          <div className="grid gap-3">
            {scenarios.map((scenario) => (
              <label key={scenario.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={selectedScenarios.includes(scenario.id)}
                  onChange={() => handleScenarioToggle(scenario.id)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-900">
                    What if we {scenario.whatIfQuestion}
                  </div>
                  <div className="text-sm text-slate-600">
                    {getCityName(scenario.cityId)} • {getInterventionName(scenario.interventionIds)}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {scenarios.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">No scenarios created yet</p>
              <button
                onClick={() => router.push('/scenarios/new')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Your First Scenario
              </button>
            </div>
          )}
        </div>

        {/* Comparison Results */}
        {comparisonResults.length >= 2 && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {comparisonResults.map((result, index) => {
                const scenario = scenarios.find(s => s.id === selectedScenarios[index]);
                if (!scenario) return null;
                
                return (
                  <div key={result.scenarioId} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Scenario {index + 1}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      What if we {scenario.whatIfQuestion}
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Emissions:</span>
                        <span className={`font-medium ${result.kpis.GHGEmissionsMtCO2e?.deltaPct || 0 > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatPercentage(result.kpis.GHGEmissionsMtCO2e?.deltaPct || 0)} {result.kpis.GHGEmissionsMtCO2e?.deltaPct || 0 > 0 ? '↑' : '↓'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Health:</span>
                        <span className={`font-medium ${result.kpis.BaselineHealthIndex_0_100?.deltaPct || 0 > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {result.kpis.BaselineHealthIndex_0_100?.deltaPct || 0 > 0 ? '+' : ''}{formatNumber(result.kpis.BaselineHealthIndex_0_100?.deltaPct || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Equity:</span>
                        <span className="font-medium text-blue-600">
                          {formatPercentage(result.equityScore_0_100 || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Comparison Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* KPI Comparison */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Metrics Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getComparisonChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="emissions" fill="#ef4444" name="Emissions %" />
                    <Bar dataKey="congestion" fill="#f59e0b" name="Congestion %" />
                    <Bar dataKey="equity" fill="#3b82f6" name="Equity %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Sentiment Comparison */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Stakeholder Sentiment</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getSentimentComparisonData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[-1, 1]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="citizens" stroke="#3b82f6" name="Citizens" />
                    <Line type="monotone" dataKey="businesses" stroke="#10b981" name="Businesses" />
                    <Line type="monotone" dataKey="ngo" stroke="#f59e0b" name="NGOs" />
                    <Line type="monotone" dataKey="council" stroke="#8b5cf6" name="Council" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Comparison Table */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-8">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Detailed Comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Metric
                      </th>
                      {comparisonResults.map((_, index) => (
                        <th key={index} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Scenario {index + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        Emissions Change
                      </td>
                      {comparisonResults.map((result, index) => (
                        <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          <span className={`${result.kpis.GHGEmissionsMtCO2e?.deltaPct || 0 > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatPercentage(result.kpis.GHGEmissionsMtCO2e?.deltaPct || 0)} {result.kpis.GHGEmissionsMtCO2e?.deltaPct || 0 > 0 ? '↑' : '↓'}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        Congestion Change
                      </td>
                      {comparisonResults.map((result, index) => (
                        <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          <span className={`${result.kpis.CongestionIndex?.deltaPct || 0 > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatPercentage(result.kpis.CongestionIndex?.deltaPct || 0)} {result.kpis.CongestionIndex?.deltaPct || 0 > 0 ? '↑' : '↓'}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        Fiscal Impact
                      </td>
                      {comparisonResults.map((result, index) => (
                        <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          <span className={`${result.fiscalImpactM || 0 > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(result.fiscalImpactM || 0)} {result.fiscalImpactM || 0 > 0 ? '↑' : '↓'}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        Health Impact
                      </td>
                      {comparisonResults.map((result, index) => (
                        <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          <span className={`${result.kpis.BaselineHealthIndex_0_100?.deltaPct || 0 > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {result.kpis.BaselineHealthIndex_0_100?.deltaPct || 0 > 0 ? '+' : ''}{formatNumber(result.kpis.BaselineHealthIndex_0_100?.deltaPct || 0)}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        Equity Score
                      </td>
                      {comparisonResults.map((result, index) => (
                        <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          <span className="text-blue-600">{formatPercentage(result.equityScore_0_100 || 0)}</span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        Confidence
                      </td>
                      {comparisonResults.map((result, index) => (
                        <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {Math.round(result.confidence_0_1 || 0 * 100)}%
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push('/scenarios/new')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create New Scenario
              </button>
              <button
                onClick={() => setSelectedScenarios([])}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Clear Selection
              </button>
            </div>
          </>
        )}

        {selectedScenarios.length === 0 && scenarios.length > 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-4">Select at least 2 scenarios to compare</p>
          </div>
        )}
      </div>
    </div>
  );
}
