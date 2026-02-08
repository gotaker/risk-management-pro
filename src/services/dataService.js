import { RISK_LEVELS, RISK_MATRIX } from '../types/constants';

// Calculate risk score using risk matrix (Impact x Probability)
export const calculateRiskScore = (impact, probability) => {
  if (!impact || !probability || impact < 1 || impact > 5 || probability < 1 || probability > 5) return 0;
  return RISK_MATRIX[impact - 1][probability - 1];
};

// Get risk level based on score
export const getRiskLevel = (score) => {
  if (score <= RISK_LEVELS.LOW.max) return RISK_LEVELS.LOW;
  if (score <= RISK_LEVELS.MEDIUM.max) return RISK_LEVELS.MEDIUM;
  if (score <= RISK_LEVELS.HIGH.max) return RISK_LEVELS.HIGH;
  return RISK_LEVELS.CRITICAL;
};

// Calculate net risk after mitigation
export const calculateNetRisk = (risk) => {
  if (!risk.mitigation?.impact || !risk.mitigation?.probability) {
    return calculateRiskScore(risk.impact, risk.probability);
  }
  return calculateRiskScore(risk.mitigation.impact, risk.mitigation.probability);
};

// AI-Powered Risk Prediction
export const predictRiskTrend = (historicalData) => {
  if (!historicalData || historicalData.length < 2) return 'stable';
  
  const recent = historicalData.slice(-3);
  const scores = recent.map(d => d.score);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const lastScore = scores[scores.length - 1];
  
  if (lastScore > avg * 1.2) return 'increasing';
  if (lastScore < avg * 0.8) return 'decreasing';
  return 'stable';
};

// AI Risk Insights Generator
export const generateRiskInsights = (risks) => {
  const insights = [];
  
  // Critical risk concentration
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
  
  // Category concentration
  const categoryCount = {};
  risks.forEach(r => {
    categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
  });
  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
  if (topCategory && topCategory[1] > risks.length * 0.3) {
    insights.push({
      type: 'category',
      title: `High Concentration in ${topCategory[0]}`,
      description: `${topCategory[1]} risks (${Math.round(topCategory[1] / risks.length * 100)}%) in this category`,
      severity: 'medium',
      action: 'Consider diversifying risk management focus'
    });
  }
  
  // Mitigation effectiveness
  const mitigatedRisks = risks.filter(r => r.mitigation?.impact && r.mitigation?.probability);
  const effectiveCount = mitigatedRisks.filter(r => {
    const original = calculateRiskScore(r.impact, r.probability);
    const mitigated = calculateNetRisk(r);
    return mitigated < original * 0.7;
  }).length;
  
  if (mitigatedRisks.length > 0) {
    const effectiveness = (effectiveCount / mitigatedRisks.length) * 100;
    insights.push({
      type: 'mitigation',
      title: `${Math.round(effectiveness)}% Mitigation Effectiveness`,
      description: `${effectiveCount} of ${mitigatedRisks.length} mitigated risks show significant reduction`,
      severity: effectiveness > 70 ? 'low' : 'medium',
      action: effectiveness > 70 ? 'Continue current strategies' : 'Review mitigation approaches'
    });
  }
  
  return insights;
};

// Local storage keys
const STORAGE_KEYS = {
  PROJECTS: 'erm_pro_projects',
  RISKS: 'erm_pro_risks',
  USERS: 'erm_pro_users',
  CURRENT_USER: 'erm_pro_current_user',
  SETTINGS: 'erm_pro_settings',
  ANALYTICS: 'erm_pro_analytics'
};

// Initialize enhanced sample data
const initializeSampleData = () => {
  const sampleProjects = [
    {
      id: '1',
      name: 'PROJECT NAME',
      description: 'Enterprise digital transformation initiative',
      status: 'active',
      owner: 'John Smith',
      startDate: new Date('2024-01-15').toISOString(),
      targetDate: new Date('2024-12-31').toISOString(),
      budget: 1500000,
      priority: 'high',
      department: 'IT',
      tags: ['digital', 'transformation', 'priority'],
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Cloud Migration Initiative',
      description: 'Migration of legacy systems to cloud infrastructure',
      status: 'active',
      owner: 'Sarah Johnson',
      startDate: new Date('2024-02-01').toISOString(),
      targetDate: new Date('2025-06-30').toISOString(),
      budget: 2000000,
      priority: 'critical',
      department: 'Infrastructure',
      tags: ['cloud', 'infrastructure', 'migration'],
      createdAt: new Date('2024-02-01').toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const sampleRisks = [
    {
      id: 'R001',
      projectId: '1',
      type: 'project',
      category: 'Processes and tools',
      code: 'Q1',
      title: 'Reporting requirements not supported by architecture',
      description: 'Reporting requirements not supported by decided architecture. On-premise and automated analytics product will not be possible to create for wished scope.',
      impact: 2,
      probability: 3,
      status: 'open',
      priority: 'high',
      treatment: 'mitigate',
      mitigation: {
        actions: 'Feedback on architecture to product managers. Engage architecture team for design review.',
        cost: 50000,
        impact: 2,
        probability: 2,
        timeline: '2024-04-30',
        owner: 'IT PM'
      },
      responsible: 'IT PM',
      detectability: 3,
      tags: ['architecture', 'reporting'],
      attachments: [],
      createdAt: new Date('2024-01-20').toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [
        {
          id: 'C001',
          text: 'Initial assessment complete. Scheduling architecture review for next week.',
          author: 'IT PM',
          createdAt: new Date('2024-01-22').toISOString()
        }
      ]
    },
    {
      id: 'R002',
      projectId: '1',
      type: 'project',
      category: 'Processes and tools',
      code: 'Q2',
      title: 'Platform architecture - cloud implementation challenges',
      description: 'New implementation for EBIP, no reference cases on MS cloud, lack of experience & expertise in the team.',
      impact: 2,
      probability: 2,
      status: 'in_progress',
      priority: 'medium',
      treatment: 'mitigate',
      mitigation: {
        actions: 'On-board cloud experts, conduct training sessions, establish governance model',
        cost: 75000,
        impact: 1,
        probability: 2,
        timeline: '2024-05-15',
        owner: 'Line organization'
      },
      responsible: 'Line organization',
      detectability: 4,
      tags: ['cloud', 'expertise'],
      attachments: [],
      createdAt: new Date('2024-01-21').toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    },
    {
      id: 'O001',
      projectId: '1',
      type: 'organization',
      category: 'IT Strategy',
      code: 'St1',
      title: 'Target architecture compliance challenges',
      description: 'The target architecture for S&M is MS CRM - compliant on technology platform. Challenge is hybrid approach with Marketing in Cloud and Sales on premise.',
      impact: 4,
      probability: 4,
      status: 'open',
      priority: 'critical',
      treatment: 'mitigate',
      mitigation: {
        actions: 'Develop hybrid integration framework, establish data synchronization protocols',
        cost: 120000,
        impact: 3,
        probability: 3,
        timeline: '2024-06-30',
        owner: 'Enterprise Architect'
      },
      responsible: 'Enterprise Architect',
      detectability: 2,
      tags: ['architecture', 'strategy', 'hybrid'],
      attachments: [],
      createdAt: new Date('2024-01-22').toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    },
    {
      id: 'O002',
      projectId: '2',
      type: 'organization',
      category: 'Security',
      code: 'Sec1',
      title: 'Cloud security compliance requirements',
      description: 'New cloud platform must meet regulatory compliance requirements for data sovereignty and security standards.',
      impact: 5,
      probability: 3,
      status: 'open',
      priority: 'critical',
      treatment: 'mitigate',
      mitigation: {
        actions: 'Engage compliance team, conduct security audit, implement encryption standards',
        cost: 150000,
        impact: 3,
        probability: 2,
        timeline: '2024-07-31',
        owner: 'Security Manager'
      },
      responsible: 'Security Manager',
      detectability: 2,
      tags: ['security', 'compliance', 'cloud'],
      attachments: [],
      createdAt: new Date('2024-02-05').toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    }
  ];

  const sampleUsers = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'risk_manager',
      avatar: null,
      department: 'Risk Management',
      preferences: {
        notifications: true,
        emailAlerts: true,
        dashboardLayout: 'default'
      }
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'project_manager',
      avatar: null,
      department: 'Project Management Office',
      preferences: {
        notifications: true,
        emailAlerts: false,
        dashboardLayout: 'compact'
      }
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael.brown@company.com',
      role: 'executive',
      avatar: null,
      department: 'Executive',
      preferences: {
        notifications: false,
        emailAlerts: true,
        dashboardLayout: 'executive'
      }
    }
  ];

  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(sampleProjects));
  localStorage.setItem(STORAGE_KEYS.RISKS, JSON.stringify(sampleRisks));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(sampleUsers));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sampleUsers[0]));
  
  const defaultSettings = {
    theme: 'light',
    language: 'en',
    notifications: true,
    autoSave: true,
    defaultView: 'dashboard'
  };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
};

// Check if data exists, if not initialize
if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
  initializeSampleData();
}

// Projects API
export const projectsAPI = {
  getAll: () => {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  },
  
  getById: (id) => {
    const projects = projectsAPI.getAll();
    return projects.find(p => p.id === id);
  },
  
  create: (project) => {
    const projects = projectsAPI.getAll();
    const newProject = {
      ...project,
      id: `PRJ${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    projects.push(newProject);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return newProject;
  },
  
  update: (id, updates) => {
    const projects = projectsAPI.getAll();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      return projects[index];
    }
    return null;
  },
  
  delete: (id) => {
    const projects = projectsAPI.getAll();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
    
    // Also delete associated risks
    const risks = risksAPI.getAll();
    const filteredRisks = risks.filter(r => r.projectId !== id);
    localStorage.setItem(STORAGE_KEYS.RISKS, JSON.stringify(filteredRisks));
  }
};

// Risks API
export const risksAPI = {
  getAll: () => {
    const data = localStorage.getItem(STORAGE_KEYS.RISKS);
    return data ? JSON.parse(data) : [];
  },
  
  getByProject: (projectId) => {
    const risks = risksAPI.getAll();
    return risks.filter(r => r.projectId === projectId);
  },
  
  getById: (id) => {
    const risks = risksAPI.getAll();
    return risks.find(r => r.id === id);
  },
  
  create: (risk) => {
    const risks = risksAPI.getAll();
    const newRisk = {
      ...risk,
      id: `R${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: risk.comments || []
    };
    risks.push(newRisk);
    localStorage.setItem(STORAGE_KEYS.RISKS, JSON.stringify(risks));
    return newRisk;
  },
  
  update: (id, updates) => {
    const risks = risksAPI.getAll();
    const index = risks.findIndex(r => r.id === id);
    if (index !== -1) {
      risks[index] = { ...risks[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.RISKS, JSON.stringify(risks));
      return risks[index];
    }
    return null;
  },
  
  delete: (id) => {
    const risks = risksAPI.getAll();
    const filtered = risks.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RISKS, JSON.stringify(filtered));
  },
  
  addComment: (riskId, comment) => {
    const risk = risksAPI.getById(riskId);
    if (risk) {
      const newComment = {
        id: `C${Date.now()}`,
        text: comment.text,
        author: comment.author,
        createdAt: new Date().toISOString()
      };
      risk.comments = risk.comments || [];
      risk.comments.push(newComment);
      return risksAPI.update(riskId, { comments: risk.comments });
    }
    return null;
  }
};

// Users API
export const usersAPI = {
  getAll: () => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },
  
  getCurrentUser: () => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },
  
  setCurrentUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }
};

// Enhanced Analytics API
export const analyticsAPI = {
  getRiskDistribution: (projectId) => {
    const risks = projectId ? risksAPI.getByProject(projectId) : risksAPI.getAll();
    
    const distribution = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };
    
    risks.forEach(risk => {
      const score = calculateRiskScore(risk.impact, risk.probability);
      const level = getRiskLevel(score);
      distribution[level.label.toLowerCase()]++;
    });
    
    return distribution;
  },
  
  getTopRisks: (projectId, limit = 5) => {
    const risks = projectId ? risksAPI.getByProject(projectId) : risksAPI.getAll();
    return risks
      .map(risk => ({
        ...risk,
        score: calculateRiskScore(risk.impact, risk.probability)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },
  
  getRisksByCategory: (projectId) => {
    const risks = projectId ? risksAPI.getByProject(projectId) : risksAPI.getAll();
    const categories = {};
    
    risks.forEach(risk => {
      if (!categories[risk.category]) {
        categories[risk.category] = [];
      }
      categories[risk.category].push(risk);
    });
    
    return categories;
  },
  
  getRisksByType: (projectId) => {
    const risks = projectId ? risksAPI.getByProject(projectId) : risksAPI.getAll();
    const types = { project: 0, organization: 0 };
    
    risks.forEach(risk => {
      types[risk.type] = (types[risk.type] || 0) + 1;
    });
    
    return types;
  },
  
  getMitigationProgress: (projectId) => {
    const risks = projectId ? risksAPI.getByProject(projectId) : risksAPI.getAll();
    
    let totalRisks = risks.length;
    let mitigated = 0;
    let inProgress = 0;
    let open = 0;
    let accepted = 0;
    
    risks.forEach(risk => {
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
  },
  
  getRiskTrends: (projectId, days = 30) => {
    const risks = projectId ? risksAPI.getByProject(projectId) : risksAPI.getAll();
    const trends = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayRisks = risks.filter(r => {
        const riskDate = new Date(r.createdAt).toISOString().split('T')[0];
        return riskDate <= dateStr;
      });
      
      const avgScore = dayRisks.length > 0
        ? dayRisks.reduce((sum, r) => sum + calculateRiskScore(r.impact, r.probability), 0) / dayRisks.length
        : 0;
      
      trends.push({
        date: dateStr,
        count: dayRisks.length,
        avgScore: Math.round(avgScore * 10) / 10
      });
    }
    
    return trends;
  },
  
  getInsights: (projectId) => {
    const risks = projectId ? risksAPI.getByProject(projectId) : risksAPI.getAll();
    return generateRiskInsights(risks);
  },
  
  getHeatmapData: (projectId) => {
    const risks = projectId ? risksAPI.getByProject(projectId) : risksAPI.getAll();
    const heatmap = Array(5).fill(null).map(() => Array(5).fill(0));
    
    risks.forEach(risk => {
      if (risk.impact >= 1 && risk.impact <= 5 && risk.probability >= 1 && risk.probability <= 5) {
        heatmap[5 - risk.impact][risk.probability - 1]++;
      }
    });
    
    return heatmap;
  }
};

// Settings API
export const settingsAPI = {
  get: () => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {};
  },
  
  update: (updates) => {
    const current = settingsAPI.get();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  }
};
