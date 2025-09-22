'use client';

import { useState } from 'react';
import { CityProfile } from '../lib/schemas';
import { z } from 'zod';
import { useTranslation } from '../contexts/TranslationContext';

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
  const { language, t } = useTranslation();
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
      lang: language,
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
    <form onSubmit={handleSubmit} className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">{t.cityForm.createCustomCity}</h2>
        <p className="text-slate-600 text-base">{t.cityForm.fillRequiredFields}</p>
      </div>

      {/* Required Fields */}
      <div className="space-y-6">
        <div>
          <label className="block text-base font-semibold text-slate-700 mb-3">
            {t.cityForm.name} *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-slate-900"
            placeholder="e.g., Helsinki, Madrid, Singapore"
            required
          />
        </div>

        <div>
          <label className="block text-base font-semibold text-slate-700 mb-3">
            {t.cityForm.scale} *
          </label>
          <select
            value={formData.scale}
            onChange={(e) => setFormData(prev => ({ ...prev, scale: e.target.value as CityScale }))}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-slate-900"
            required
          >
            <option value="Citywide">{t.cityForm.citywide}</option>
            <option value="DistrictNeighbourhood">{t.cityForm.districtNeighbourhood}</option>
            <option value="CorridorStreet">{t.cityForm.corridorStreet}</option>
            <option value="SpecificSite">{t.cityForm.specificSite}</option>
          </select>
        </div>

        <div>
          <label className="block text-base font-semibold text-slate-700 mb-3">
            {t.cityForm.mainChallenges} *
          </label>
          <div className="space-y-3">
            {formData.mainChallenges.map((challenge, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={challenge}
                  onChange={(e) => updateChallenge(index, e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-slate-900"
                  placeholder="e.g., air quality, congestion, housing affordability"
                  required
                />
                {formData.mainChallenges.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChallenge(index)}
                    className="px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addChallenge}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
{t.cityForm.addChallenge}
            </button>
          </div>
        </div>
      </div>

      {/* Optional Fields Toggle */}
      <div className="border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={() => setShowOptionalFields(!showOptionalFields)}
          className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-medium text-base"
        >
          <svg className={`w-5 h-5 transition-transform ${showOptionalFields ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
{showOptionalFields ? t.cityForm.hideOptional : t.cityForm.showOptional}
        </button>
      </div>

      {/* Optional Fields */}
      {showOptionalFields && (
        <div className="space-y-6 border-t border-slate-200 pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-semibold text-slate-700 mb-3">
                {t.cityForm.populationSize}
              </label>
              <input
                type="number"
                value={formData.populationContext.size}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  populationContext: { ...prev.populationContext, size: e.target.value }
                }))}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-slate-900"
                placeholder="e.g., 656920"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-slate-700 mb-3">
                {t.cityForm.demographics}
              </label>
              <input
                type="text"
                value={formData.populationContext.demographics}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  populationContext: { ...prev.populationContext, demographics: e.target.value }
                }))}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-slate-900"
                placeholder="e.g., aging population with growing tech sector"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-slate-700 mb-3">
              {t.cityForm.neighbourhoodCharacteristics}
            </label>
            <input
              type="text"
              value={formData.neighbourhoodCharacteristics}
              onChange={(e) => setFormData(prev => ({ ...prev, neighbourhoodCharacteristics: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-slate-900"
              placeholder="e.g., mixed-use with strong public transport"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-slate-700 mb-3">
              {t.cityForm.vulnerableGroups}
            </label>
            <div className="space-y-3">
              {formData.vulnerableGroups.map((group, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={group}
                    onChange={(e) => updateVulnerableGroup(index, e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-slate-900"
                    placeholder="e.g., elderly, low-income, children"
                  />
                  <button
                    type="button"
                    onClick={() => removeVulnerableGroup(index)}
                    className="px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addVulnerableGroup}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
{t.cityForm.addVulnerableGroup}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-slate-700 mb-3">
              {t.cityForm.regulatoryContext}
            </label>
            <input
              type="text"
              value={formData.regulatoryContext}
              onChange={(e) => setFormData(prev => ({ ...prev, regulatoryContext: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-slate-900"
              placeholder="e.g., Bus lane reallocation is contentious"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-semibold text-slate-700 mb-3">
                {t.cityForm.timeline}
              </label>
              <input
                type="text"
                value={formData.timeline}
                onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-slate-900"
                placeholder="e.g., 2-year implementation window"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-slate-700 mb-3">
                {t.cityForm.budgetConstraints}
              </label>
              <input
                type="text"
                value={formData.budgetConstraints}
                onChange={(e) => setFormData(prev => ({ ...prev, budgetConstraints: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-slate-900"
                placeholder="e.g., €5M available for pilot"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-slate-700 mb-3">
              {t.cityForm.existingAssets}
            </label>
            <div className="space-y-3">
              {formData.existingAssets.map((asset, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={asset}
                    onChange={(e) => updateAsset(index, e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-slate-900"
                    placeholder="e.g., schools, bus line 12, public housing blocks"
                  />
                  <button
                    type="button"
                    onClick={() => removeAsset(index)}
                    className="px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAsset}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
{t.cityForm.addExistingAsset}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-8 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-base transition-colors"
        >
{t.cityForm.cancel}
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-base transition-colors"
        >
          {t.cityForm.submit}
        </button>
      </div>
    </form>
  );
}
