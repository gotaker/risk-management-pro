import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Edit, Trash2, MessageSquare } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { calculateRiskScore, getRiskLevel, risksAPI } from '../services/dataService';
import RiskForm from '../components/RiskForm';
import RiskDetails from '../components/RiskDetails';

const RiskList = () => {
  const { selectedProject, risks, refreshData } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredRisks = useMemo(() => {
    let filtered = risks.filter(r => r.projectId === selectedProject);

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(r => r.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === filterStatus);
    }

    return filtered.map(risk => ({
      ...risk,
      score: calculateRiskScore(risk.impact, risk.probability),
      level: getRiskLevel(calculateRiskScore(risk.impact, risk.probability))
    })).sort((a, b) => b.score - a.score);
  }, [risks, selectedProject, searchTerm, filterType, filterStatus]);

  const handleEdit = (risk) => {
    setSelectedRisk(risk);
    setShowForm(true);
  };

  const handleDelete = (riskId) => {
    if (window.confirm('Are you sure you want to delete this risk?')) {
      risksAPI.delete(riskId);
      refreshData();
    }
  };

  const handleViewDetails = (risk) => {
    setSelectedRisk(risk);
    setShowDetails(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedRisk(null);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedRisk(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Risk Register</h1>
          <p className="text-gray-600 mt-1">{filteredRisks.length} risks found</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Risk
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search risks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="project">Project Risks</option>
              <option value="enterprise">Enterprise Risks</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="mitigated">Mitigated</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Risk Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRisks.map((risk) => (
          <div key={risk.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-gray-500">{risk.code}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      risk.type === 'project' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {risk.type}
                    </span>
                    <span
                      className="px-3 py-1 text-xs font-semibold rounded-full text-white"
                      style={{ backgroundColor: risk.level.color }}
                    >
                      {risk.level.label}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      risk.status === 'open' ? 'bg-red-100 text-red-800' :
                      risk.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {risk.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{risk.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{risk.description}</p>
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-2 font-medium text-gray-900">{risk.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Impact:</span>
                      <span className="ml-2 font-medium text-gray-900">{risk.impact}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Probability:</span>
                      <span className="ml-2 font-medium text-gray-900">{risk.probability}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Score:</span>
                      <span className="ml-2 font-bold text-gray-900">{risk.score}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Owner:</span>
                      <span className="ml-2 font-medium text-gray-900">{risk.responsible}</span>
                    </div>
                  </div>
                  {risk.mitigation?.actions && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="text-xs font-semibold text-blue-900 mb-1">Mitigation Actions</div>
                      <div className="text-sm text-blue-800">{risk.mitigation.actions}</div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {risk.comments && risk.comments.length > 0 && (
                    <button
                      onClick={() => handleViewDetails(risk)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {risk.comments.length}
                      </span>
                    </button>
                  )}
                  <button
                    onClick={() => handleViewDetails(risk)}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(risk)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(risk.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredRisks.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No risks found</h3>
            <p className="text-gray-600">Try adjusting your filters or add a new risk.</p>
          </div>
        )}
      </div>

      {/* Risk Form Modal */}
      {showForm && (
        <RiskForm
          risk={selectedRisk}
          onClose={handleCloseForm}
          onSave={() => {
            refreshData();
            handleCloseForm();
          }}
        />
      )}

      {/* Risk Details Modal */}
      {showDetails && selectedRisk && (
        <RiskDetails
          risk={selectedRisk}
          onClose={handleCloseDetails}
          onUpdate={() => {
            refreshData();
            handleCloseDetails();
          }}
        />
      )}
    </div>
  );
};

export default RiskList;
