'use client';

import { useState } from 'react';
import { Intervention } from '../lib/schemas';
import { z } from 'zod';
import { useTranslation } from '../contexts/TranslationContext';

const InterventionCategory = z.enum([
  "BehaviourChange",
  "CivicParticipation", 
  "SkillsAndIndustry",
  "PhysicalInfrastructure",
  "Governance",
  "PolicyAndRegulation",
  "Finance",
  "Technology",
]);
type InterventionCategory = z.infer<typeof InterventionCategory>;

interface InterventionFormProps {
  onSubmit: (intervention: Intervention) => void;
  onCancel: () => void;
}

export default function InterventionForm({ onSubmit, onCancel }: InterventionFormProps) {
  const { language, t } = useTranslation();
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    category: 'Technology' as InterventionCategory,
    scopeOfApplication: '',
    detailedDescription: '',
    parameters: [{ key: '', value: '' }],
    synergies: [''],
    intendedOutcomes: [''],
    stakeholderFocus: [''],
    implementationNotes: '',
    risks: [''],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const intervention: Intervention = {
      id: `custom-${Date.now()}`,
      lang: language,
      title: formData.title,
      summary: formData.summary,
      category: formData.category,
      scopeOfApplication: formData.scopeOfApplication,
      ...(showOptionalFields && {
        detailedDescription: formData.detailedDescription || undefined,
        parameters: formData.parameters.filter(p => p.key.trim() && p.value.trim()).length > 0 ? 
          Object.fromEntries(formData.parameters.filter(p => p.key.trim() && p.value.trim()).map(p => [p.key, p.value])) : undefined,
        synergies: formData.synergies.filter(s => s.trim()).length > 0 ? formData.synergies.filter(s => s.trim()) : undefined,
        intendedOutcomes: formData.intendedOutcomes.filter(o => o.trim()).length > 0 ? formData.intendedOutcomes.filter(o => o.trim()) : undefined,
        stakeholderFocus: formData.stakeholderFocus.filter(s => s.trim()).length > 0 ? formData.stakeholderFocus.filter(s => s.trim()) : undefined,
        implementationNotes: formData.implementationNotes || undefined,
        risks: formData.risks.filter(r => r.trim()).length > 0 ? formData.risks.filter(r => r.trim()) : undefined,
      }),
    };

    onSubmit(intervention);
  };

  const addParameter = () => {
    setFormData(prev => ({
      ...prev,
      parameters: [...prev.parameters, { key: '', value: '' }],
    }));
  };

  const removeParameter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index),
    }));
  };

  const updateParameter = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      parameters: prev.parameters.map((p, i) => i === index ? { ...p, [field]: value } : p),
    }));
  };

  const addSynergy = () => {
    setFormData(prev => ({
      ...prev,
      synergies: [...prev.synergies, ''],
    }));
  };

  const removeSynergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      synergies: prev.synergies.filter((_, i) => i !== index),
    }));
  };

  const updateSynergy = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      synergies: prev.synergies.map((s, i) => i === index ? value : s),
    }));
  };

  const addOutcome = () => {
    setFormData(prev => ({
      ...prev,
      intendedOutcomes: [...prev.intendedOutcomes, ''],
    }));
  };

  const removeOutcome = (index: number) => {
    setFormData(prev => ({
      ...prev,
      intendedOutcomes: prev.intendedOutcomes.filter((_, i) => i !== index),
    }));
  };

  const updateOutcome = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      intendedOutcomes: prev.intendedOutcomes.map((o, i) => i === index ? value : o),
    }));
  };

  const addStakeholder = () => {
    setFormData(prev => ({
      ...prev,
      stakeholderFocus: [...prev.stakeholderFocus, ''],
    }));
  };

  const removeStakeholder = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stakeholderFocus: prev.stakeholderFocus.filter((_, i) => i !== index),
    }));
  };

  const updateStakeholder = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      stakeholderFocus: prev.stakeholderFocus.map((s, i) => i === index ? value : s),
    }));
  };

  const addRisk = () => {
    setFormData(prev => ({
      ...prev,
      risks: [...prev.risks, ''],
    }));
  };

  const removeRisk = (index: number) => {
    setFormData(prev => ({
      ...prev,
      risks: prev.risks.filter((_, i) => i !== index),
    }));
  };

  const updateRisk = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      risks: prev.risks.map((r, i) => i === index ? value : r),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">{t.interventionForm.createCustomIntervention}</h2>
        <p className="text-slate-600 text-base">{t.interventionForm.fillRequiredFields}</p>
      </div>

      {/* Required Fields */}
      <div className="space-y-6">
        <div>
          <label className="block text-base font-semibold text-slate-700 mb-3">
            {t.interventionForm.title} *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-slate-900"
            placeholder="e.g., School Air Quality Sensors, Congestion Pricing"
            required
          />
        </div>

        <div>
          <label className="block text-base font-semibold text-slate-700 mb-3">
            {t.interventionForm.summary} *
          </label>
          <input
            type="text"
            value={formData.summary}
            onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-slate-900"
            placeholder="e.g., Install low-cost sensors in schools to monitor air quality"
            required
          />
        </div>

        <div>
          <label className="block text-base font-semibold text-slate-700 mb-3">
            {t.interventionForm.category} *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as InterventionCategory }))}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-slate-900"
            required
          >
            <option value="BehaviourChange">Behaviour Change</option>
            <option value="CivicParticipation">Civic Participation</option>
            <option value="SkillsAndIndustry">Skills & Industry Development</option>
            <option value="PhysicalInfrastructure">Physical Infrastructure</option>
            <option value="Governance">Governance</option>
            <option value="PolicyAndRegulation">Policy & Regulation</option>
            <option value="Finance">Finance</option>
            <option value="Technology">Technology</option>
          </select>
        </div>

        <div>
          <label className="block text-base font-semibold text-slate-700 mb-3">
            {t.interventionForm.scopeOfApplication} *
          </label>
          <input
            type="text"
            value={formData.scopeOfApplication}
            onChange={(e) => setFormData(prev => ({ ...prev, scopeOfApplication: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-slate-900"
            placeholder="e.g., Primary schools in urban areas"
            required
          />
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
{showOptionalFields ? t.interventionForm.hideOptional : t.interventionForm.showOptional}
        </button>
      </div>

      {/* Optional Fields */}
      {showOptionalFields && (
        <div className="space-y-4 border-t border-slate-200 pt-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t.interventionForm.detailedDescription}
            </label>
            <textarea
              value={formData.detailedDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, detailedDescription: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
              rows={4}
              placeholder="A paragraph elaborating approach & goals..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t.interventionForm.parameters}
            </label>
            <div className="space-y-2">
              {formData.parameters.map((param, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={param.key}
                    onChange={(e) => updateParameter(index, 'key', e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., sensorsCount"
                  />
                  <input
                    type="text"
                    value={param.value}
                    onChange={(e) => updateParameter(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 200"
                  />
                  <button
                    type="button"
                    onClick={() => removeParameter(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addParameter}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
+ {t.interventionForm.addParameter}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t.interventionForm.synergies}
            </label>
            <div className="space-y-2">
              {formData.synergies.map((synergy, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={synergy}
                    onChange={(e) => updateSynergy(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Works best with: School Streets, Green Corridors"
                  />
                  <button
                    type="button"
                    onClick={() => removeSynergy(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSynergy}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
+ {t.interventionForm.addSynergy}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t.interventionForm.intendedOutcomes}
            </label>
            <div className="space-y-2">
              {formData.intendedOutcomes.map((outcome, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => updateOutcome(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Reduce children's exposure to air pollution"
                  />
                  <button
                    type="button"
                    onClick={() => removeOutcome(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addOutcome}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
+ {t.interventionForm.addIntendedOutcome}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t.interventionForm.stakeholderFocus}
            </label>
            <div className="space-y-2">
              {formData.stakeholderFocus.map((stakeholder, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={stakeholder}
                    onChange={(e) => updateStakeholder(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., children, commuters, landlords"
                  />
                  <button
                    type="button"
                    onClick={() => removeStakeholder(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addStakeholder}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
+ {t.interventionForm.addStakeholder}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t.interventionForm.implementationNotes}
            </label>
            <textarea
              value={formData.implementationNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, implementationNotes: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
              rows={3}
              placeholder="Timeline, budget, regulatory enablers/barriers..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t.interventionForm.risks}
            </label>
            <div className="space-y-2">
              {formData.risks.map((risk, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={risk}
                    onChange={(e) => updateRisk(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Sensor maintenance and calibration challenges"
                  />
                  <button
                    type="button"
                    onClick={() => removeRisk(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addRisk}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
+ {t.interventionForm.addRisk}
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
{t.interventionForm.cancel}
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-base transition-colors"
        >
          {t.interventionForm.submit}
        </button>
      </div>
    </form>
  );
}
