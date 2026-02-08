import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { risksAPI, calculateRiskScore, getRiskLevel } from '../services/dataService';
import { RISK_CATEGORIES, IMPACT_SCALE, PROBABILITY_SCALE } from '../types/constants';

const RiskForm = ({ risk, onClose, onSave }) => {
  const { selectedProject } = useApp();
  const [formData, setFormData] = useState({
    type: 'project',
    category: '',
    code: '',
    title: '',
    description: '',
    impact: 3,
    probability: 3,
    status: 'open',
    responsible: '',
    mitigation: {
      actions: '',
      cost: null,
      impact: null,
      probability: null
    }
  });

  useEffect(() => {
    if (risk) {
      setFormData(risk);
    }
  }, [risk]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMitigationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      mitigation: { ...prev.mitigation, [field]: value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const riskData = {
      ...formData,
      projectId: selectedProject
    };

    if (risk) {
      risksAPI.update(risk.id, riskData);
    } else {
      risksAPI.create(riskData);
    }
    
    onSave();
  };

  const currentScore = calculateRiskScore(formData.impact, formData.probability);
  const currentLevel = getRiskLevel(currentScore);
  
  const netScore = formData.mitigation.impact && formData.mitigation.probability
    ? calculateRiskScore(formData.mitigation.impact, formData.mitigation.probability)
    : currentScore;
  const netLevel = getRiskLevel(netScore);

  const categories = formData.type === 'project' 
    ? Object.values(RISK_CATEGORIES.PROJECT)
    : Object.values(RISK_CATEGORIES.ENTERPRISE);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {risk ? 'Edit Risk' : 'Add New Risk'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Risk Type and Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => {
                  handleChange('type', e.target.value);
                  handleChange('category', '');
                }}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="project">Project Risk</option>
                <option value="enterprise">Enterprise Risk</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="e.g., Q1, St1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Risk Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Brief description of the risk"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the risk in detail, including causes and potential impacts"
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Risk Assessment */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Impact (1-5) *
                </label>
                <select
                  value={formData.impact}
                  onChange={(e) => handleChange('impact', parseInt(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {IMPACT_SCALE.map(scale => (
                    <option key={scale.value} value={scale.value}>
                      {scale.value} - {scale.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Probability (1-5) *
                </label>
                <select
                  value={formData.probability}
                  onChange={(e) => handleChange('probability', parseInt(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {PROBABILITY_SCALE.map(scale => (
                    <option key={scale.value} value={scale.value}>
                      {scale.value} - {scale.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Current Risk Score</div>
                  <div className="text-3xl font-bold text-gray-900">{currentScore}</div>
                </div>
                <div>
                  <span
                    className="px-4 py-2 text-sm font-semibold rounded-full text-white"
                    style={{ backgroundColor: currentLevel.color }}
                  >
                    {currentLevel.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mitigation */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Mitigation</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mitigation Actions
                </label>
                <textarea
                  value={formData.mitigation.actions}
                  onChange={(e) => handleMitigationChange('actions', e.target.value)}
                  placeholder="Describe actions to mitigate this risk"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mitigation Cost
                  </label>
                  <input
                    type="number"
                    value={formData.mitigation.cost || ''}
                    onChange={(e) => handleMitigationChange('cost', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Residual Impact (1-5)
                  </label>
                  <select
                    value={formData.mitigation.impact || ''}
                    onChange={(e) => handleMitigationChange('impact', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Not set</option>
                    {IMPACT_SCALE.map(scale => (
                      <option key={scale.value} value={scale.value}>
                        {scale.value} - {scale.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Residual Probability (1-5)
                  </label>
                  <select
                    value={formData.mitigation.probability || ''}
                    onChange={(e) => handleMitigationChange('probability', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Not set</option>
                    {PROBABILITY_SCALE.map(scale => (
                      <option key={scale.value} value={scale.value}>
                        {scale.value} - {scale.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.mitigation.impact && formData.mitigation.probability && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-green-800">Net Risk Score</div>
                      <div className="text-3xl font-bold text-green-900">{netScore}</div>
                    </div>
                    <div>
                      <span
                        className="px-4 py-2 text-sm font-semibold rounded-full text-white"
                        style={{ backgroundColor: netLevel.color }}
                      >
                        {netLevel.label}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status and Responsible */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="mitigated">Mitigated</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsible Person *
              </label>
              <input
                type="text"
                value={formData.responsible}
                onChange={(e) => handleChange('responsible', e.target.value)}
                placeholder="e.g., IT PM, Business Project"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {risk ? 'Update Risk' : 'Create Risk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RiskForm;
