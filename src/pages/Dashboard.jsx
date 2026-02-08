import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Clock, Lightbulb, RefreshCw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { analyticsAPI, calculateRiskScore, getRiskLevel } from '../services/dataService';
import { RISK_LEVELS, RISK_CATEGORIES } from '../types/constants';
import RiskHeatMap from '../components/RiskHeatMap';

const Dashboard = () => {
  const { selectedProject, risks, projects, refreshData } = useApp();
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('risks'); // 'risks', 'mitigated', 'both'
  
  const projectRisks = useMemo(() => 
    risks.filter(r => r.projectId === selectedProject),
    [risks, selectedProject]
  );
  
  // Get all unique categories from both project and org risks
  const allCategories = useMemo(() => {
    const categories = new Set();
    Object.values(RISK_CATEGORIES.PROJECT).forEach(cat => categories.add(cat));
    Object.values(RISK_CATEGORIES.ORGANIZATION).forEach(cat => categories.add(cat));
    return Array.from(categories).sort();
  }, []);
  
  // Filter risks based on selected filters
  const filteredRisks = useMemo(() => {
    let filtered = [...projectRisks];
    
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }
    
    // View mode filter
    if (viewMode === 'mitigated') {
      filtered = filtered.filter(r => 
        r.status === 'mitigated' || r.status === 'closed'
      );
    } else if (viewMode === 'risks') {
      filtered = filtered.filter(r => 
        r.status !== 'mitigated' && r.status !== 'closed'
      );
    }
    // 'both' shows all risks (no additional filtering)
    
    return filtered;
  }, [projectRisks, selectedCategory, viewMode]);

  const project = useMemo(() => 
    projects.find(p => p.id === selectedProject),
    [projects, selectedProject]
  );

  const distribution = useMemo(() => {
    const dist = { low: 0, medium: 0, high: 0, critical: 0 };
    filteredRisks.forEach(risk => {
      const score = calculateRiskScore(risk.impact, risk.probability);
      const level = getRiskLevel(score);
      dist[level.label.toLowerCase()]++;
    });
    return dist;
  }, [filteredRisks]);

  const topRisks = useMemo(() => {
    return filteredRisks
      .map(risk => ({
        ...risk,
        score: calculateRiskScore(risk.impact, risk.probability)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [filteredRisks]);

  const mitigationProgress = useMemo(() => {
    let totalRisks = filteredRisks.length;
    let mitigated = 0;
    let inProgress = 0;
    let open = 0;
    let accepted = 0;
    
    filteredRisks.forEach(risk => {
      if (risk.status === 'mitigated' || risk.status === 'closed') {
        mitigated++;
      } else if (risk.status === 'in_progress') {
        inProgress++;
      } else if (risk.status === 'accepted') {
        accepted++;
      } else {
        open++;
      }
    });
    
    return {
      total: totalRisks,
      mitigated,
      inProgress,
      open,
      accepted,
      mitigatedPercentage: totalRisks > 0 ? Math.round((mitigated / totalRisks) * 100) : 0
    };
  }, [filteredRisks]);

  const insights = useMemo(() => {
    const generateInsights = (risks) => {
      const insights = [];
      const criticalRisks = risks.filter(r => getRiskLevel(calculateRiskScore(r.impact, r.probability)).label === 'Critical');
      if (criticalRisks.length > 0) {
        insights.push({
          type: 'critical',
          title: `${criticalRisks.length} Critical Risk${criticalRisks.length > 1 ? 's' : ''} Detected`,
          description: 'Immediate attention required for critical-level risks',
          severity: 'high',
          action: 'Review and prioritize mitigation strategies'
        });
      }
      return insights;
    };
    return generateInsights(filteredRisks);
  }, [filteredRisks]);

  const distributionData = [
    { name: 'Low', value: distribution.low, color: RISK_LEVELS.LOW.color },
    { name: 'Medium', value: distribution.medium, color: RISK_LEVELS.MEDIUM.color },
    { name: 'High', value: distribution.high, color: RISK_LEVELS.HIGH.color },
    { name: 'Critical', value: distribution.critical, color: RISK_LEVELS.CRITICAL.color }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Risk Dashboard</h1>
        <p className="text-gray-600 mt-1">{project?.name || 'All Projects'}</p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-blue-600">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <label className="text-sm font-semibold text-gray-700">Select view</label>
            
            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer min-w-[180px]"
              >
                <option value="all">All Categories</option>
                {allCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* View Mode Radio Buttons */}
            <div className="flex items-center gap-4 ml-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="viewMode"
                  value="risks"
                  checked={viewMode === 'risks'}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Risks</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="viewMode"
                  value="mitigated"
                  checked={viewMode === 'mitigated'}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Mitigated risks</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="viewMode"
                  value="both"
                  checked={viewMode === 'both'}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Both</span>
              </label>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => {
              refreshData();
              setSelectedCategory('all');
              setViewMode('risks');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Active Filters Display */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">
              Showing <span className="font-bold text-gray-900">{filteredRisks.length}</span> of <span className="font-bold text-gray-900">{projectRisks.length}</span> risks
            </span>
            {(selectedCategory !== 'all' || viewMode !== 'risks') && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">Active filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md font-medium">
                    {selectedCategory}
                  </span>
                )}
                {viewMode !== 'risks' && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md font-medium">
                    {viewMode === 'mitigated' ? 'Mitigated only' : 'All risks'}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setViewMode('risks');
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium ml-2"
                >
                  Clear filters
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Risks"
          value={filteredRisks.length}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Critical Risks"
          value={distribution.critical}
          icon={<TrendingUp className="w-6 h-6" />}
          color="red"
        />
        <MetricCard
          title="Mitigated"
          value={mitigationProgress.mitigated}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="In Progress"
          value={mitigationProgress.inProgress}
          icon={<Clock className="w-6 h-6" />}
          color="yellow"
        />
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h2>
          </div>
          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    insight.severity === 'high' ? 'bg-red-500' :
                    insight.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <p className="text-sm text-blue-600 mt-2 font-medium">{insight.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Heat Map Grids */}
      {filteredRisks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No risks found</h3>
          <p className="text-gray-600 mb-4">
            No risks match your current filter selection.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setViewMode('risks');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in">
          <RiskHeatMap 
            risks={filteredRisks}
            title="Project Risks"
            type="project"
          />
          <RiskHeatMap 
            risks={filteredRisks}
            title="Organization Risks"
            type="organization"
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution by Severity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mitigation Progress Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Status Overview</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-semibold text-gray-900">{mitigationProgress.mitigatedPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${mitigationProgress.mitigatedPercentage}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 pt-4">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{mitigationProgress.open}</div>
                <div className="text-xs text-gray-600 mt-1">Open</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{mitigationProgress.inProgress}</div>
                <div className="text-xs text-gray-600 mt-1">In Progress</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{mitigationProgress.mitigated}</div>
                <div className="text-xs text-gray-600 mt-1">Mitigated</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{mitigationProgress.accepted || 0}</div>
                <div className="text-xs text-gray-600 mt-1">Accepted</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Risks Table */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-lg font-semibold text-gray-900">Top 5 High-Priority Risks</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topRisks.map((risk) => {
                const level = getRiskLevel(risk.score);
                return (
                  <tr key={risk.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{risk.code}</div>
                      <div className="text-sm text-gray-500">{risk.title}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{risk.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        risk.type === 'project' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {risk.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{risk.impact}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{risk.probability}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{risk.score}</td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 text-xs font-semibold rounded-full text-white"
                        style={{ backgroundColor: level.color }}
                      >
                        {level.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
    </div>
  );
};

const MetricCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-transparent hover:border-current">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
