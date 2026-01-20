/**
 * CyberShield Service Layer
 * 
 * Handles all API communication between the React frontend and FastAPI backend.
 * Includes authentication, password analysis, and log analysis endpoints.
 */

// Backend API base URL - update for production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Types for API responses
export interface LoginResponse {
  success: boolean;
  access_token?: string;
  token_type?: string;
  user?: {
    username: string;
    role: string;
  };
  detail?: string;
}

export interface PasswordStrengthResponse {
  score: number;
  label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Excellent';
  color: string;
  suggestions: string[];
  entropy: number;
  compliance_rating: 'Non-Compliant' | 'Partially Compliant' | 'NIST-Standard';
  risk_profile: 'Critical' | 'Elevated' | 'Secure';
  crack_time: string;
  popia_warning: string | null;
}

export interface SuspiciousEvent {
  event: string;
  risk_level: 'Low' | 'Medium' | 'High';
  explanation: string;
}

export interface LogAnalysisResult {
  summary: string;
  suspicious_events: SuspiciousEvent[];
  recommendations: string[];
  analysis_id: string;
  timestamp: string;
}

// Token storage helpers
const TOKEN_KEY = 'cybershield_token';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// API request helper with authentication
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getStoredToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  
  return response.json();
};

/**
 * Authentication - Login
 * Authenticates user and returns JWT token
 */
export const loginToBackend = async (credentials: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const response = await apiRequest<LoginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.access_token) {
      setStoredToken(response.access_token);
    }
    
    return response;
  } catch (error) {
    // Fallback to demo mode if backend is not available
    console.warn('Backend unavailable, using demo mode:', error);
    
    // Demo validation
    if (
      (credentials.username === 'Analyst' && credentials.password === 'cyber-demo-2024') ||
      (credentials.username === 'admin' && credentials.password === 'password123')
    ) {
      return {
        success: true,
        access_token: 'demo-token',
        token_type: 'bearer',
        user: { username: credentials.username, role: 'Level 4 Analyst' }
      };
    }
    
    return {
      success: false,
      detail: 'Invalid credentials. Please use the demo login provided.'
    };
  }
};

/**
 * Authentication - Logout
 * Clears stored authentication token
 */
export const logoutFromBackend = (): void => {
  clearStoredToken();
};

/**
 * Authentication - Get current user
 * Returns the currently authenticated user info
 */
export const getCurrentUser = async (): Promise<{ user: { username: string; role: string } } | null> => {
  try {
    return await apiRequest('/api/v1/auth/me');
  } catch {
    return null;
  }
};

/**
 * Password Analysis
 * Analyzes password strength, entropy, and compliance
 */
export const analyzePassword = async (password: string): Promise<PasswordStrengthResponse> => {
  try {
    return await apiRequest<PasswordStrengthResponse>('/api/v1/analyze/password', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  } catch (error) {
    console.warn('Backend unavailable for password analysis:', error);
    // Return null to let frontend handle with its own logic
    throw error;
  }
};

/**
 * Log Analysis - Full AI Analysis (requires auth)
 * Analyzes security logs using AI for threat detection
 */
export const analyzeLogsWithAI = async (
  logData: string,
  analysisDepth: 'quick' | 'standard' | 'deep' = 'standard'
): Promise<LogAnalysisResult> => {
  try {
    return await apiRequest<LogAnalysisResult>('/api/v1/analyze/logs', {
      method: 'POST',
      body: JSON.stringify({
        log_data: logData,
        analysis_depth: analysisDepth,
      }),
    });
  } catch (error) {
    console.warn('AI log analysis failed, trying quick analysis:', error);
    // Fallback to quick analysis (no auth required)
    return analyzeLogsQuick(logData);
  }
};

/**
 * Log Analysis - Quick Analysis (no auth)
 * Rule-based log analysis without AI
 */
export const analyzeLogsQuick = async (logData: string): Promise<LogAnalysisResult> => {
  try {
    return await apiRequest<LogAnalysisResult>('/api/v1/analyze/logs/quick', {
      method: 'POST',
      body: JSON.stringify({
        log_data: logData,
        analysis_depth: 'quick',
      }),
    });
  } catch (error) {
    console.warn('Backend unavailable for log analysis:', error);
    
    // Fallback mock response for demo
    return {
      summary: 'Analysis complete. System heuristics show standard operating parameters.',
      suspicious_events: [
        {
          event: 'Demo Mode Active',
          risk_level: 'Low',
          explanation: 'Backend server not connected. Showing demo results.'
        }
      ],
      recommendations: [
        'Start the backend server: cd backend && uvicorn main:app --reload',
        'Configure GEMINI_API_KEY for AI-powered analysis'
      ],
      analysis_id: 'demo-' + Date.now(),
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Legacy function for backward compatibility
 * @deprecated Use analyzeLogsWithAI instead
 */
export const analyzeLogsWithPython = async (logData: string): Promise<LogAnalysisResult | null> => {
  try {
    return await analyzeLogsWithAI(logData, 'standard');
  } catch {
    return null;
  }
};

/**
 * Health check - verify backend is running
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};
