
import React, { useState } from 'react';
import { 
  Terminal, 
  Upload, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Activity,
  ChevronRight,
  ShieldAlert,
  History,
  Sparkles
} from 'lucide-react';
import { AnalysisResult, HistoricalScan } from '../types';
import { analyzeLogsWithAI, getStoredToken } from '../services/cyberService';

const LogAnalyzer: React.FC = () => {
  const [logs, setLogs] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  const [scanHistory, setScanHistory] = useState<HistoricalScan[]>([
    {
      id: 'scan-1',
      title: 'Auth.log Audit',
      timestamp: new Date(Date.now() - 120000).toLocaleString(),
      status: 'red',
      rawLogs: 'Oct 12 14:02:01 server-01 sshd[1234]: Failed password for root from 192.168.1.45 port 54321 ssh2...',
      result: {
        summary: "Detected brute-force patterns on SSH port.",
        suspiciousEvents: [
          { event: "Brute Force Attempt", riskLevel: "High", explanation: "42 failed logins in 3 seconds from 192.168.1.45" }
        ],
        recommendations: ["Ban IP 192.168.1.45", "Disable root SSH login"]
      }
    },
    {
      id: 'scan-2',
      title: 'NGINX Traffic Scan',
      timestamp: new Date(Date.now() - 3600000).toLocaleString(),
      status: 'yellow',
      rawLogs: '127.0.0.1 - - [12/Oct/2023:13:00:01 +0000] "GET /admin HTTP/1.1" 404...',
      result: {
        summary: "Multiple 404 errors on sensitive endpoints.",
        suspiciousEvents: [
          { event: "Endpoint Scanning", riskLevel: "Medium", explanation: "Requests to /admin, /config, and /.env detected." }
        ],
        recommendations: ["Implement rate limiting", "Check WAF rules"]
      }
    }
  ]);

  const performAnalysis = async () => {
    if (!logs.trim()) return;
    setIsAnalyzing(true);
    
    try {
      // Call the backend API for AI-powered analysis
      const apiResult = await analyzeLogsWithAI(logs, 'standard');
      
      // Convert API response to frontend format
      const newResult: AnalysisResult = {
        summary: apiResult.summary,
        suspiciousEvents: apiResult.suspicious_events.map(e => ({
          event: e.event,
          riskLevel: e.risk_level,
          explanation: e.explanation
        })),
        recommendations: apiResult.recommendations
      };

      // Determine status based on findings
      const hasHigh = apiResult.suspicious_events.some(e => e.risk_level === 'High');
      const hasMedium = apiResult.suspicious_events.some(e => e.risk_level === 'Medium');
      const status = hasHigh ? 'red' : hasMedium ? 'yellow' : 'green';

      const newScan: HistoricalScan = {
        id: apiResult.analysis_id || `scan-${Date.now()}`,
        title: logs.length > 20 ? `${logs.substring(0, 20)}...` : 'Quick Log Audit',
        timestamp: new Date().toLocaleString(),
        status,
        result: newResult,
        rawLogs: logs
      };

      setResult(newResult);
      setScanHistory(prev => [newScan, ...prev]);
    } catch (error) {
      console.error('Analysis failed:', error);
      // Fallback result on error
      setResult({
        summary: "Analysis encountered an error. Please check your connection and try again.",
        suspiciousEvents: [],
        recommendations: ["Verify backend server is running", "Check network connectivity"]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadScan = (scan: HistoricalScan) => {
    setLogs(scan.rawLogs);
    setResult(scan.result);
    // Smooth scroll to the results section
    const resultElement = document.getElementById('analysis-results');
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearLogs = () => {
    setLogs('');
    setResult(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-emerald-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Top Section: Input and History Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Input Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold">Log Input Terminal</h3>
            </div>
            <div className="flex gap-2">
               <button 
                 onClick={clearLogs}
                 className="text-xs text-slate-500 hover:text-slate-300 font-medium px-2 py-1 rounded hover:bg-slate-800"
               >
                 Clear
               </button>
               <label className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded cursor-pointer hover:bg-slate-700 flex items-center gap-1">
                 <Upload className="w-3 h-3" />
                 Upload File
                 <input type="file" className="hidden" onChange={(e) => {
                   const file = e.target.files?.[0];
                   if (file) {
                     const reader = new FileReader();
                     reader.onload = (e) => setLogs(e.target?.result as string);
                     reader.readAsText(file);
                   }
                 }} />
               </label>
            </div>
          </div>

          <div className="relative group">
            <textarea
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
              className="w-full h-80 bg-slate-900 border border-slate-800 rounded-2xl p-6 mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all resize-none placeholder:text-slate-700"
              placeholder="Paste system logs here... (e.g. /var/log/auth.log contents)"
            />
            <button
              onClick={performAnalysis}
              disabled={isAnalyzing || !logs}
              className="absolute bottom-6 right-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl shadow-xl shadow-blue-900/20 transition-all flex items-center gap-2 font-semibold"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="w-4 h-4 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  AI Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Panel (Sidebar) */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Scans
            </h4>
            <div className="space-y-3 overflow-y-auto max-h-[16rem] pr-1 scrollbar-thin scrollbar-thumb-slate-700">
              {scanHistory.length > 0 ? (
                scanHistory.map((scan) => (
                  <button
                    key={scan.id}
                    onClick={() => loadScan(scan)}
                    className="w-full text-left flex items-center gap-4 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800 hover:border-blue-500/50 transition-all group"
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(scan.status)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-300 truncate">{scan.title}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        <History className="w-2.5 h-2.5" />
                        {scan.timestamp}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-500 transition-colors" />
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-slate-600 text-xs italic">
                  No scan history available
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-blue-400 mb-2">Security Note</h4>
            <p className="text-xs text-blue-300/80 leading-relaxed">
              Historical reports are saved locally for this session. Use the "Export" feature to save audit results permanently.
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Result: Dynamic Section */}
      {result && (
        <div id="analysis-results" className="pt-12 border-t border-slate-800 space-y-8 animate-in transition-all duration-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white">Audit Report Generated</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Suspicious Activities</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    result.suspiciousEvents.length > 0 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {result.suspiciousEvents.length} Identified
                  </span>
                </div>
                <div className="divide-y divide-slate-800">
                  {result.suspiciousEvents.length > 0 ? (
                    result.suspiciousEvents.map((event, idx) => (
                      <div key={idx} className="p-6 flex gap-4 hover:bg-slate-800/20 transition-colors">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                          event.riskLevel === 'High' ? 'bg-red-500/10 text-red-500' : 
                          event.riskLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-slate-200">{event.event}</h5>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              event.riskLevel === 'High' ? 'border-red-500/30 text-red-400' :
                              event.riskLevel === 'Medium' ? 'border-yellow-500/30 text-yellow-400' : 'border-blue-500/30 text-blue-400'
                            }`}>
                              {event.riskLevel.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 leading-relaxed">{event.explanation}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center text-slate-500 text-sm">
                      No critical suspicious activities detected in this log sample.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit shadow-xl">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-500" />
                Remediation Steps
              </h4>
              <ul className="space-y-4">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-slate-800">
                 <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all border border-slate-700 shadow-sm">
                   EXPORT FULL REPORT
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogAnalyzer;
