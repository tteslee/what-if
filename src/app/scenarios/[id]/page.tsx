'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWhatIfStore } from '@/lib/store';
import { sampleCities } from '@/data/sample-data';
import { exportToMarkdown, downloadMarkdown } from '@/lib/export';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function ScenarioResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { scenarios, results, loadSampleData } = useWhatIfStore();
  const [showAssumptions, setShowAssumptions] = useState(false);
  
  const scenarioId = params.id as string;
  const scenario = scenarios.find(s => s.id === scenarioId);
  const result = results[scenarioId];
  const city = scenario ? sampleCities.find(c => c.id === scenario.cityId) : null;

  useEffect(() => {
    loadSampleData();
  }, [loadSampleData]);

  if (!scenario || !result || !city) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Scenario not found</h1>
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
    const markdown = exportToMarkdown(scenario, result);
    downloadMarkdown(markdown, `what-if-${scenario.id}.md`);
  };

  const formatPercentage = (value: number) => `${Math.round(Math.abs(value * 100))}%`;
  const formatNumber = (value: number) => Math.abs(Math.round(value * 100) / 100);
  const formatCurrency = (value: number) => `£${Math.abs(Math.round(value * 100) / 100)}M`;

  // Chart data for modal shift
  const modalShiftData = [
    { name: 'Car', before: city.modalSplit.car, after: result.kpis.modalShift.car },
    { name: 'Transit', before: city.modalSplit.transit, after: result.kpis.modalShift.transit },
    { name: 'Walk', before: city.modalSplit.walk, after: result.kpis.modalShift.walk },
    { name: 'Cycle', before: city.modalSplit.cycle, after: result.kpis.modalShift.cycle },
  ];

  // Chart data for stakeholder sentiment
  const sentimentData = [
    { subject: 'Citizens', value: result.stakeholderSentiment.citizens },
    { subject: 'Businesses', value: result.stakeholderSentiment.businesses },
    { subject: 'NGOs', value: result.stakeholderSentiment.ngo },
    { subject: 'Council', value: result.stakeholderSentiment.council },
  ];

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
                {city.name} • {scenario.intervention.name} • {scenario.intervention.domain}
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
                Export Report
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
            {scenario.assumptions.length > 0 ? (
              <ul className="space-y-2">
                {scenario.assumptions.map((assumption, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-slate-700">{assumption}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic">No specific assumptions were added to this scenario.</p>
            )}
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Emissions Change</h3>
            <p className={`text-2xl font-bold ${result.kpis.emissionsDeltaPct > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatPercentage(result.kpis.emissionsDeltaPct)} {result.kpis.emissionsDeltaPct > 0 ? '↑' : '↓'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Congestion Change</h3>
            <p className={`text-2xl font-bold ${result.kpis.congestionDeltaPct > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatPercentage(result.kpis.congestionDeltaPct)} {result.kpis.congestionDeltaPct > 0 ? '↑' : '↓'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Commute Time</h3>
            <p className={`text-2xl font-bold ${result.kpis.avgCommuteDeltaMin > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatNumber(result.kpis.avgCommuteDeltaMin)} min {result.kpis.avgCommuteDeltaMin > 0 ? '↑' : '↓'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Fiscal Impact</h3>
            <p className={`text-2xl font-bold ${result.kpis.fiscalImpactMGBP > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(result.kpis.fiscalImpactMGBP)} {result.kpis.fiscalImpactMGBP > 0 ? '↑' : '↓'}
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
                {formatPercentage(result.kpis.equityScore)}
              </div>
              <p className="text-sm text-slate-600">This score weights impacts for vulnerable groups</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Health Impact</h3>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${result.kpis.healthIndexDelta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {result.kpis.healthIndexDelta > 0 ? '+' : ''}{formatNumber(result.kpis.healthIndexDelta)}
              </div>
              <p className="text-sm text-slate-600">Health index change</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Trust Impact</h3>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${result.kpis.trustIndexDelta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {result.kpis.trustIndexDelta > 0 ? '+' : ''}{formatNumber(result.kpis.trustIndexDelta)}
              </div>
              <p className="text-sm text-slate-600">Trust index change</p>
            </div>
          </div>
        </div>

        {/* Narrative Findings and Risks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Insights</h3>
            <ul className="space-y-3">
              {result.narrativeFindings.map((finding, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">{index + 1}.</span>
                  <span className="text-slate-700">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Risks</h3>
            <ul className="space-y-3">
              {result.risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-1">{index + 1}.</span>
                  <span className="text-slate-700">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Confidence and Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Confidence Level</h3>
              <p className="text-slate-600">
                <span className="font-medium">{Math.round(result.confidence * 100)}%</span> - 
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
