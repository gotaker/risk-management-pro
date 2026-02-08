// Risk Categories from Updated Template
export const RISK_CATEGORIES = {
  PROJECT: {
    QUALITY: 'Quality',
    PROCESSES_TOOLS: 'Processes and tools',
    LACK_COMMITMENT: 'Lack of commitment',
    STAKEHOLDER_RESISTANCE: 'Resistance from stakeholders',
    COMMUNICATION: 'Communication',
    DEPENDENCIES: 'Dependencies',
    RESOURCE_CAPACITY: 'Resource capacity',
    ORGANIZATION: 'Organization',
    TIME: 'Time',
    COST: 'Cost',
    SCOPE: 'Scope',
    TECHNOLOGY: 'Technology'
  },
  ORGANIZATION: {
    IT_STRATEGY: 'IT Strategy',
    TARGET_ARCHITECTURE: 'Target architecture',
    STRATEGY_FOCUS: 'IT strategy and focus areas',
    AGILITY: 'Agility',
    TCO_LIFECYCLE: 'TCO and lifecycle management',
    BUSINESS_OPERATION: 'Business Operation Risk',
    USABILITY: 'Usability',
    MAINTENANCE: 'Maintenance and future development',
    COMPLIANCE: 'Compliance',
    SECURITY: 'Security'
  }
};

// Impact and Probability Scales (1-5)
export const IMPACT_SCALE = [
  { value: 1, label: 'Very Low', color: '#10b981', description: 'Minimal impact on objectives' },
  { value: 2, label: 'Low', color: '#84cc16', description: 'Minor impact, easily managed' },
  { value: 3, label: 'Medium', color: '#f59e0b', description: 'Moderate impact requiring management' },
  { value: 4, label: 'High', color: '#ef4444', description: 'Significant impact on objectives' },
  { value: 5, label: 'Very High', color: '#dc2626', description: 'Critical impact, threatens success' }
];

export const PROBABILITY_SCALE = [
  { value: 1, label: 'Very Low', color: '#10b981', description: 'Rare, unlikely to occur' },
  { value: 2, label: 'Low', color: '#84cc16', description: 'Unlikely but possible' },
  { value: 3, label: 'Medium', color: '#f59e0b', description: 'Moderately likely' },
  { value: 4, label: 'High', color: '#ef4444', description: 'Likely to occur' },
  { value: 5, label: 'Very High', color: '#dc2626', description: 'Almost certain to occur' }
];

// Risk Matrix (Impact x Probability)
export const RISK_MATRIX = [
  [1, 2, 3, 4, 5],      // Impact 1
  [2, 4, 6, 8, 10],     // Impact 2
  [3, 6, 9, 12, 15],    // Impact 3
  [4, 8, 12, 16, 20],   // Impact 4
  [5, 10, 15, 20, 25]   // Impact 5
];

// Risk Level Thresholds
export const RISK_LEVELS = {
  LOW: { min: 0, max: 4, label: 'Low', color: '#10b981', bgColor: '#d1fae5' },
  MEDIUM: { min: 5, max: 9, label: 'Medium', color: '#f59e0b', bgColor: '#fef3c7' },
  HIGH: { min: 10, max: 15, label: 'High', color: '#ef4444', bgColor: '#fee2e2' },
  CRITICAL: { min: 16, max: 25, label: 'Critical', color: '#dc2626', bgColor: '#fecaca' }
};

// User Roles
export const USER_ROLES = {
  ADMIN: { value: 'admin', label: 'Administrator', permissions: ['all'] },
  RISK_MANAGER: { value: 'risk_manager', label: 'Risk Manager', permissions: ['create', 'edit', 'delete', 'view'] },
  PROJECT_MANAGER: { value: 'project_manager', label: 'Project Manager', permissions: ['create', 'edit', 'view'] },
  EXECUTIVE: { value: 'executive', label: 'Executive', permissions: ['view'] },
  VIEWER: { value: 'viewer', label: 'Viewer', permissions: ['view'] }
};

// Risk Status
export const RISK_STATUS = {
  OPEN: { value: 'open', label: 'Open', color: '#ef4444' },
  IN_PROGRESS: { value: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  MITIGATED: { value: 'mitigated', label: 'Mitigated', color: '#84cc16' },
  CLOSED: { value: 'closed', label: 'Closed', color: '#10b981' },
  ACCEPTED: { value: 'accepted', label: 'Accepted', color: '#6366f1' }
};

// Risk Treatment Strategies
export const RISK_TREATMENTS = {
  AVOID: { value: 'avoid', label: 'Avoid', description: 'Eliminate the risk by changing plans' },
  MITIGATE: { value: 'mitigate', label: 'Mitigate', description: 'Reduce the likelihood or impact' },
  TRANSFER: { value: 'transfer', label: 'Transfer', description: 'Shift risk to a third party' },
  ACCEPT: { value: 'accept', label: 'Accept', description: 'Accept the risk and monitor' }
};

// Chart Colors
export const CHART_COLORS = {
  primary: '#0ea5e9',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  gradient1: ['#667eea', '#764ba2'],
  gradient2: ['#f093fb', '#f5576c'],
  gradient3: ['#4facfe', '#00f2fe']
};

// Animation Variants
export const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  },
  slideIn: {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } }
  },
  scaleIn: {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } }
  },
  stagger: {
    visible: { transition: { staggerChildren: 0.1 } }
  }
};

// Dashboard Metrics
export const METRIC_TYPES = {
  TOTAL_RISKS: 'total_risks',
  CRITICAL_RISKS: 'critical_risks',
  OPEN_RISKS: 'open_risks',
  MITIGATED_RISKS: 'mitigated_risks',
  AVG_RISK_SCORE: 'avg_risk_score',
  TREND: 'trend'
};

// Export Formats
export const EXPORT_FORMATS = {
  PDF: { value: 'pdf', label: 'PDF Document', icon: 'FileText' },
  EXCEL: { value: 'excel', label: 'Excel Spreadsheet', icon: 'Sheet' },
  JSON: { value: 'json', label: 'JSON Data', icon: 'Code' },
  CSV: { value: 'csv', label: 'CSV File', icon: 'Table' }
};

// Time Periods
export const TIME_PERIODS = {
  WEEK: { value: 'week', label: 'This Week' },
  MONTH: { value: 'month', label: 'This Month' },
  QUARTER: { value: 'quarter', label: 'This Quarter' },
  YEAR: { value: 'year', label: 'This Year' },
  ALL: { value: 'all', label: 'All Time' }
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};
