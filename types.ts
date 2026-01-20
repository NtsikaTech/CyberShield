
export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD'
}

export enum DashboardTab {
  PASSWORD_CHECKER = 'PASSWORD_CHECKER',
  LOG_ANALYZER = 'LOG_ANALYZER'
}

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Excellent';
  color: string;
  suggestions: string[];
  entropy: number;
  complianceRating: 'Non-Compliant' | 'Partially Compliant' | 'NIST-Standard';
  riskProfile: 'Critical' | 'Elevated' | 'Secure';
  crackTime: string;
  popiaWarning: string | null;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  source: string;
}

export interface AnalysisResult {
  summary: string;
  suspiciousEvents: {
    event: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    explanation: string;
  }[];
  recommendations: string[];
}

export interface HistoricalScan {
  id: string;
  timestamp: string;
  title: string;
  status: 'green' | 'yellow' | 'red';
  result: AnalysisResult;
  rawLogs: string;
}
