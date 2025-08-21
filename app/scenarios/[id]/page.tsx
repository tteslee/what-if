'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWhatIfStore } from '../../../src/lib/store';
import { exportToPDF } from '../../../src/lib/export';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function ScenarioResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { scenarios, results, cities, interventions, loadSampleData } = useWhatIfStore();
  const [showAssumptions, setShowAssumptions] = useState(false);
  
  const scenarioId = params.id as string;
  const scenario = scenarios.find(s => s.id === scenarioId);
  const result = results[scenarioId];
  const city = scenario ? cities.find(c => c.id === scenario.cityId) : null;
  
  // Get the first intervention (for now, assuming single intervention)
  const intervention = scenario && scenario.interventionIds && scenario.interventionIds.length > 0 
    ? interventions.find(i => i.id === scenario.interventionIds[0])
    : null;

  // Debug logging
  console.log('Scenario results page data:', {
    scenarioId,
    scenario,
    result,
    city,
    intervention,
    resultKeys: result ? Object.keys(result) : 'No result',
    resultKpis: result?.kpis ? Object.keys(result.kpis) : 'No kpis'
  });

  useEffect(() => {
    loadSampleData();
  }, [loadSampleData]);

  if (!scenario || !result || !city || !intervention) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            {!scenario ? 'Scenario not found' : 
             !result ? 'Results not found' : 
             !city ? 'City not found' : 'Intervention not found'}
          </h1>
          <button
            onClick={() => router.push('/scenarios/new')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create New Scenario
          </button>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    if (city && intervention) {
      exportToPDF(scenario, result, city, intervention);
    } else {
      console.error('Cannot export: missing city or intervention data');
      alert('Cannot export PDF: missing data. Please try refreshing the page.');
    }
  };

  const formatPercentage = (value: number) => `${Math.round(Math.abs(value * 100))}%`;
  const formatNumber = (value: number) => Math.abs(Math.round(value * 100) / 100);
  const formatCurrency = (value: number) => `£${Math.abs(Math.round(value * 100) / 100)}M`;

  // Chart data for modal shift - using new schema structure
  const modalShiftData = [
    { 
      name: 'Car', 
      before: city?.mobility?.modalShare?.carPct || 0, 
      after: (city?.mobility?.modalShare?.carPct || 0) + (result?.kpis?.ModalShareCarPct?.deltaPct || 0) 
    },
    { 
      name: 'Transit', 
      before: city?.mobility?.modalShare?.transitPct || 0, 
      after: (city?.mobility?.modalShare?.transitPct || 0) + (result?.kpis?.ModalShareTransitPct?.deltaPct || 0) 
    },
    { 
      name: 'Walk', 
      before: city?.mobility?.modalShare?.walkPct || 0, 
      after: (city?.mobility?.modalShare?.walkPct || 0) + (result?.kpis?.ModalShareWalkPct?.deltaPct || 0) 
    },
    { 
      name: 'Cycle', 
      before: city?.mobility?.modalShare?.cyclePct || 0, 
      after: (city?.mobility?.modalShare?.cyclePct || 0) + (result?.kpis?.ModalShareCyclePct?.deltaPct || 0) 
    },
  ];

  // Chart data for stakeholder sentiment - using new schema structure
  const sentimentData = result?.stakeholderSentiment ? [
    { subject: 'Citizens', value: result.stakeholderSentiment.citizens },
    { subject: 'Businesses', value: result.stakeholderSentiment.businesses },
    { subject: 'NGOs', value: result.stakeholderSentiment.ngo },
    { subject: 'Council', value: result.stakeholderSentiment.council },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                What if we {scenario.title}
              </h1>
              <p className="text-slate-600">
                {city.name} • {intervention?.title || 'Unknown Intervention'} • {intervention?.categories?.[0] || 'Unknown Category'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAssumptions(!showAssumptions)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                {showAssumptions ? 'Hide' : 'Show'} Assumptions
              </button>
                              <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Export PDF
                </button>
            </div>
          </div>

          {/* Caveat Banner */}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              <span className="font-medium">⚠️ Important:</span> This is an exploratory simulation, not a forecast. 
              Results are based on simplified models and assumptions. Use for decision support and sensemaking.
            </p>
          </div>
        </div>

        {/* Assumptions Drawer */}
        {showAssumptions && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Assumptions</h3>
            <p className="text-slate-500 italic">Assumptions are now stored in the intervention profile rather than the scenario.</p>
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Emissions Change</h3>
            <p className={`text-2xl font-bold ${(result?.kpis?.GHGEmissionsMtCO2e?.deltaPct || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatPercentage(result?.kpis?.GHGEmissionsMtCO2e?.deltaPct || 0)} {(result?.kpis?.GHGEmissionsMtCO2e?.deltaPct || 0) > 0 ? '↑' : '↓'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Congestion Change</h3>
            <p className={`text-2xl font-bold ${(result?.kpis?.CongestionIndex?.deltaPct || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatPercentage(result?.kpis?.CongestionIndex?.deltaPct || 0)} {(result?.kpis?.CongestionIndex?.deltaPct || 0) > 0 ? '↑' : '↓'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Commute Time</h3>
            <p className={`text-2xl font-bold ${(result?.kpis?.AvgCommuteMin?.delta || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatNumber(result?.kpis?.AvgCommuteMin?.delta || 0)} min {(result?.kpis?.AvgCommuteMin?.delta || 0) > 0 ? '↑' : '↓'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Fiscal Impact</h3>
            <p className={`text-2xl font-bold ${(result?.fiscalImpactM || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(result?.fiscalImpactM || 0)} {(result?.fiscalImpactM || 0) > 0 ? '↑' : '↓'}
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Modal Shift Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Modal Shift</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modalShiftData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="before" fill="#94a3b8" name="Before" />
                <Bar dataKey="after" fill="#3b82f6" name="After" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stakeholder Sentiment */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Stakeholder Sentiment</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={sentimentData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[-1, 1]} />
                <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Equity and Health Impact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Equity Score</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {result?.equityScore_0_100 ? `${Math.round(result.equityScore_0_100)}%` : 'N/A'}
              </div>
              <p className="text-sm text-slate-600">This score weights impacts for vulnerable groups</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Health Impact</h3>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${(result?.kpis?.BaselineHealthIndex_0_100?.deltaPct || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(result?.kpis?.BaselineHealthIndex_0_100?.deltaPct || 0) > 0 ? '+' : ''}{formatPercentage(result?.kpis?.BaselineHealthIndex_0_100?.deltaPct || 0)}
              </div>
              <p className="text-sm text-slate-600">Health index change</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Trust Impact</h3>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${(result?.kpis?.TrustIndex_0_100?.deltaPct || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(result?.kpis?.TrustIndex_0_100?.deltaPct || 0) > 0 ? '+' : ''}{formatPercentage(result?.kpis?.TrustIndex_0_100?.deltaPct || 0)}
              </div>
              <p className="text-sm text-slate-600">Trust index change</p>
            </div>
          </div>
        </div>

        {/* Narrative Findings and Risks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Insights</h3>
            {result?.qualitativeFindings && Array.isArray(result.qualitativeFindings) && result.qualitativeFindings.length > 0 ? (
              <ul className="space-y-3">
                {result.qualitativeFindings.map((finding: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-1">{index + 1}.</span>
                    <span className="text-slate-700">{finding}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic">No qualitative findings available for this scenario.</p>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Risks</h3>
            {result?.risksMaterialised && Array.isArray(result.risksMaterialised) && result.risksMaterialised.length > 0 ? (
              <ul className="space-y-3">
                {result.risksMaterialised.map((risk: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-red-600 font-bold mt-1">{index + 1}.</span>
                    <span className="text-slate-700">{risk}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic">No risks materialised in this scenario.</p>
            )}
          </div>
        </div>

        {/* Confidence and Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Confidence Level</h3>
              <p className="text-slate-600">
                <span className="font-medium">{result?.confidence_0_1 ? `${Math.round(result.confidence_0_1 * 100)}%` : 'N/A'}</span> - 
                Based on data quality and intervention complexity
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/scenarios/compare')}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Compare Scenarios
              </button>
              <button
                onClick={() => router.push('/scenarios/new')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create New Scenario
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
