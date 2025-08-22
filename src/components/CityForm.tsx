'use client';

import { useState } from 'react';
import { CityProfile } from '../lib/schemas';
import { z } from 'zod';

const CityScale = z.enum([
  "Citywide",
  "DistrictNeighbourhood", 
  "CorridorStreet",
  "SpecificSite",
]);
type CityScale = z.infer<typeof CityScale>;

interface CityFormProps {
  onSubmit: (city: CityProfile) => void;
  onCancel: () => void;
}

export default function CityForm({ onSubmit, onCancel }: CityFormProps) {
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    scale: 'Citywide' as CityScale,
    mainChallenges: [''],
    populationContext: {
      size: '',
      demographics: '',
    },
    neighbourhoodCharacteristics: '',
    vulnerableGroups: [''],
    regulatoryContext: '',
    timeline: '',
    budgetConstraints: '',
    existingAssets: [''],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const city: CityProfile = {
      id: `custom-${Date.now()}`,
      name: formData.name,
      scale: formData.scale,
      mainChallenges: formData.mainChallenges.filter(c => c.trim()),
      ...(showOptionalFields && {
        populationContext: formData.populationContext.size || formData.populationContext.demographics ? {
          size: formData.populationContext.size ? parseInt(formData.populationContext.size) : undefined,
          demographics: formData.populationContext.demographics || undefined,
        } : undefined,
        neighbourhoodCharacteristics: formData.neighbourhoodCharacteristics || undefined,
        vulnerableGroups: formData.vulnerableGroups.filter(g => g.trim()).length > 0 ? formData.vulnerableGroups.filter(g => g.trim()) : undefined,
        regulatoryContext: formData.regulatoryContext || undefined,
        timeline: formData.timeline || undefined,
        budgetConstraints: formData.budgetConstraints || undefined,
        existingAssets: formData.existingAssets.filter(a => a.trim()).length > 0 ? formData.existingAssets.filter(a => a.trim()) : undefined,
      }),
    };

    onSubmit(city);
  };

  const addChallenge = () => {
    setFormData(prev => ({
      ...prev,
      mainChallenges: [...prev.mainChallenges, ''],
    }));
  };

  const removeChallenge = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mainChallenges: prev.mainChallenges.filter((_, i) => i !== index),
    }));
  };

  const updateChallenge = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      mainChallenges: prev.mainChallenges.map((c, i) => i === index ? value : c),
    }));
  };

  const addVulnerableGroup = () => {
    setFormData(prev => ({
      ...prev,
      vulnerableGroups: [...prev.vulnerableGroups, ''],
    }));
  };

  const removeVulnerableGroup = (index: number) => {
    setFormData(prev => ({
      ...prev,
      vulnerableGroups: prev.vulnerableGroups.filter((_, i) => i !== index),
    }));
  };

  const updateVulnerableGroup = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      vulnerableGroups: prev.vulnerableGroups.map((g, i) => i === index ? value : g),
    }));
  };

  const addAsset = () => {
    setFormData(prev => ({
      ...prev,
      existingAssets: [...prev.existingAssets, ''],
    }));
  };

  const removeAsset = (index: number) => {
    setFormData(prev => ({
      ...prev,
      existingAssets: prev.existingAssets.filter((_, i) => i !== index),
    }));
  };

  const updateAsset = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      existingAssets: prev.existingAssets.map((a, i) => i === index ? value : a),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Create Custom City</h2>
        <p className="text-slate-600 mb-6">Fill in the required fields to create a new city profile.</p>
      </div>

      {/* Required Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            City Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Helsinki, Madrid, Singapore"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Scale *
          </label>
          <select
            value={formData.scale}
            onChange={(e) => setFormData(prev => ({ ...prev, scale: e.target.value as CityScale }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="Citywide">Citywide</option>
            <option value="DistrictNeighbourhood">District/Neighbourhood</option>
            <option value="CorridorStreet">Corridor/Street</option>
            <option value="SpecificSite">Specific Site (school, park, building)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Main Urban Challenges / Drivers *
          </label>
          <div className="space-y-2">
            {formData.mainChallenges.map((challenge, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={challenge}
                  onChange={(e) => updateChallenge(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., air quality, congestion, housing affordability"
                  required
                />
                {formData.mainChallenges.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChallenge(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addChallenge}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Add another challenge
            </button>
          </div>
        </div>
      </div>

      {/* Optional Fields Toggle */}
      <div className="border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={() => setShowOptionalFields(!showOptionalFields)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <svg className={`w-4 h-4 transition-transform ${showOptionalFields ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {showOptionalFields ? 'Hide' : 'Show'} optional details
        </button>
      </div>

      {/* Optional Fields */}
      {showOptionalFields && (
        <div className="space-y-4 border-t border-slate-200 pt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Population Size
              </label>
              <input
                type="number"
                value={formData.populationContext.size}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  populationContext: { ...prev.populationContext, size: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 656920"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Demographics
              </label>
              <input
                type="text"
                value={formData.populationContext.demographics}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  populationContext: { ...prev.populationContext, demographics: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., aging population with growing tech sector"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Neighbourhood Characteristics / Land Use Mix
            </label>
            <input
              type="text"
              value={formData.neighbourhoodCharacteristics}
              onChange={(e) => setFormData(prev => ({ ...prev, neighbourhoodCharacteristics: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., mixed-use with strong public transport"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Vulnerable or Priority Groups
            </label>
            <div className="space-y-2">
              {formData.vulnerableGroups.map((group, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={group}
                    onChange={(e) => updateVulnerableGroup(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., elderly, low-income, children"
                  />
                  <button
                    type="button"
                    onClick={() => removeVulnerableGroup(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addVulnerableGroup}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add vulnerable group
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Regulatory or Political Context
            </label>
            <input
              type="text"
              value={formData.regulatoryContext}
              onChange={(e) => setFormData(prev => ({ ...prev, regulatoryContext: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Bus lane reallocation is contentious"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Timeline
              </label>
              <input
                type="text"
                value={formData.timeline}
                onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 2-year implementation window"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Budget Constraints
              </label>
              <input
                type="text"
                value={formData.budgetConstraints}
                onChange={(e) => setFormData(prev => ({ ...prev, budgetConstraints: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., €5M available for pilot"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Existing Assets / Infrastructure
            </label>
            <div className="space-y-2">
              {formData.existingAssets.map((asset, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={asset}
                    onChange={(e) => updateAsset(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., schools, bus line 12, public housing blocks"
                  />
                  <button
                    type="button"
                    onClick={() => removeAsset(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAsset}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add existing asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create City
        </button>
      </div>
    </form>
  );
}
