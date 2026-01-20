
import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Fingerprint, 
  Zap,
  Info,
  Award,
  Lock,
  Cpu,
  Clock,
  Binary,
  AlertTriangle,
  Scale
} from 'lucide-react';
import { PasswordStrength } from '../types';

const PasswordChecker: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    label: 'Very Weak',
    color: 'bg-slate-700',
    suggestions: [],
    entropy: 0,
    complianceRating: 'Non-Compliant',
    riskProfile: 'Critical',
    crackTime: 'Instantly',
    popiaWarning: null
  });

  const checkPopiaCompliance = (val: string): string | null => {
    // South African ID Regex: YYMMDDSSSSCAZ (13 digits)
    const saIdPattern = /^[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{7}$/;
    // SA Phone Pattern: 0XX XXX XXXX
    const saPhonePattern = /^((\+27|0)\s?([6-8][0-9])\s?([0-9]{3})\s?([0-9]{4}))$/;

    if (saIdPattern.test(val)) {
      return "POPIA ALERT: Detected potential South African ID number. Processing sensitive PII in a password field is non-compliant with local data privacy laws.";
    }
    if (saPhonePattern.test(val)) {
      return "PRIVACY WARNING: Detected potential contact number. Using personal identifiers as passwords increases brute-force vulnerability via social engineering.";
    }
    return null;
  };

  const calculateMetrics = (val: string) => {
    if (!val) return { entropy: 0, score: 0, crackTime: 'Instantly' };
    
    let charsetSize = 0;
    if (/[a-z]/.test(val)) charsetSize += 26;
    if (/[A-Z]/.test(val)) charsetSize += 26;
    if (/[0-9]/.test(val)) charsetSize += 10;
    if (/[^A-Za-z0-9]/.test(val)) charsetSize += 33;

    // LOCAL ENTROPY FORMULA: E = log2(R^L)
    // R = Charset pool size, L = Password length
    // Mathematically equivalent to L * log2(R)
    const entropy = Math.floor(val.length * Math.log2(charsetSize));
    
    // Crack time estimation (Assuming high-end 100 Billion hashes/sec hardware)
    const totalCombinations = Math.pow(charsetSize, val.length);
    const secondsToCrack = totalCombinations / 100_000_000_000;

    let crackTime = 'Instantly';
    if (secondsToCrack > 31536000000) crackTime = 'Centuries';
    else if (secondsToCrack > 315360000) crackTime = 'Decades';
    else if (secondsToCrack > 31536000) crackTime = 'Years';
    else if (secondsToCrack > 2592000) crackTime = 'Months';
    else if (secondsToCrack > 86400) crackTime = 'Days';
    else if (secondsToCrack > 3600) crackTime = 'Hours';
    else if (secondsToCrack > 60) crackTime = 'Minutes';
    else if (secondsToCrack > 1) crackTime = 'Seconds';

    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    if (val.length >= 14) score++;

    return { entropy, score, crackTime };
  };

  const analyzePassword = (val: string) => {
    const { entropy, score, crackTime } = calculateMetrics(val);
    const popiaWarning = checkPopiaCompliance(val);
    const suggestions: string[] = [];

    if (val.length < 12) suggestions.push('Increase length to 12+ for Enterprise Compliance');
    if (!/[A-Z]/.test(val)) suggestions.push('Include uppercase characters');
    if (!/[^A-Za-z0-9]/.test(val)) suggestions.push('Include special symbols (!@#$%)');

    let label: PasswordStrength['label'] = 'Very Weak';
    let color = 'bg-red-500';
    let compliance: PasswordStrength['complianceRating'] = 'Non-Compliant';
    let risk: PasswordStrength['riskProfile'] = 'Critical';

    if (val.length === 0) {
      color = 'bg-slate-700';
    } else if (score <= 1) {
      label = 'Weak';
      color = 'bg-red-400';
      compliance = 'Non-Compliant';
      risk = 'Critical';
    } else if (score <= 3) {
      label = 'Medium';
      color = 'bg-yellow-400';
      compliance = 'Partially Compliant';
      risk = 'Elevated';
    } else if (score === 4) {
      label = 'Strong';
      color = 'bg-green-400';
      compliance = 'NIST-Standard';
      risk = 'Secure';
    } else {
      label = 'Excellent';
      color = 'bg-emerald-500';
      compliance = 'NIST-Standard';
      risk = 'Secure';
    }

    setStrength({ score, label, color, suggestions, entropy, complianceRating: compliance, riskProfile: risk, crackTime, popiaWarning });
  };

  useEffect(() => {
    analyzePassword(password);
  }, [password]);

  const Requirement = ({ met, text }: { met: boolean, text: string }) => (
    <div className="flex items-center gap-2 text-sm transition-colors">
      <div className={`p-0.5 rounded-full ${met ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
        {met ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
      </div>
      <span className={met ? 'text-slate-300' : 'text-slate-500'}>{text}</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Privacy Compliance Banner */}
      {strength.popiaWarning && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
              <Scale className="w-3.5 h-3.5" />
              POPIA Compliance Violation
            </h4>
            <p className="text-amber-200/80 text-sm leading-relaxed">{strength.popiaWarning}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Card: Input & Mathematical Analysis */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Binary className="w-32 h-32" />
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Credential Auditor</h3>
              <p className="text-sm text-slate-400">Mathematical complexity & compliance audit.</p>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-slate-800 border rounded-2xl py-5 pl-6 pr-14 text-xl mono focus:outline-none focus:ring-2 transition-all placeholder:text-slate-600 shadow-inner ${
                  strength.popiaWarning ? 'border-amber-500/50 focus:ring-amber-500/40' : 'border-slate-700 focus:ring-blue-500/40'
                }`}
                placeholder="Audit target credential..."
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-2 transition-colors"
              >
                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Heuristic Score</span>
                <span className={`text-sm font-black px-3 py-1 rounded-full bg-slate-800 border border-slate-700 ${strength.color.replace('bg-', 'text-')}`}>
                  {strength.label.toUpperCase()}
                </span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1.5 p-0.5">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 h-full rounded-full transition-all duration-700 ${
                      i < strength.score ? strength.color : 'bg-slate-700/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 space-y-4 relative z-10">
             <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
               <Cpu className="w-3.5 h-3.5 text-blue-500" />
               Entropy Formula: E = log₂(Rᴸ)
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-slate-500 uppercase">Information Bits</p>
                   <p className="text-2xl font-bold text-white mono">{strength.entropy}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-slate-500 uppercase">Crack-Time (GPU)</p>
                   <p className={`text-2xl font-bold mono ${strength.entropy > 50 ? 'text-emerald-400' : 'text-red-400'}`}>{strength.crackTime}</p>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
               <Requirement met={password.length >= 8} text="Min 8 chars" />
               <Requirement met={/[A-Z]/.test(password)} text="Upper Case" />
               <Requirement met={/[0-9]/.test(password)} text="Numbers" />
               <Requirement met={/[^A-Za-z0-9]/.test(password)} text="Symbols" />
             </div>
          </div>
        </div>

        {/* Right Card: Governance & Standards */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col shadow-2xl relative">
          {password.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-40">
              <div className="p-6 bg-slate-800/50 rounded-full">
                <ShieldAlert className="w-16 h-16 text-slate-700" />
              </div>
              <p className="text-sm text-slate-500 max-w-xs mx-auto italic font-medium">Input credential to generate NIST 800-63B Compliance Report and POPIA Privacy Check.</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-200 flex items-center gap-2 text-lg">
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  Compliance Profile
                </h4>
                <div className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${
                  strength.complianceRating === 'NIST-Standard' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {strength.complianceRating}
                </div>
              </div>

              {/* Resilience Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 space-y-1 group hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Brute-Force Estimate</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">{strength.crackTime}</span>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 space-y-1 group hover:border-emerald-500/30 transition-colors">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Fingerprint className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Identity Risk</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${strength.riskProfile === 'Secure' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {strength.riskProfile}
                    </span>
                  </div>
                </div>
              </div>

              {/* Professional Insights */}
              <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <Award className="w-3 h-3 text-blue-400" />
                  Governance Benchmark
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {strength.entropy > 60 
                    ? "Resilience exceeds standard enterprise requirements for user-level credentials." 
                    : "Low algorithmic entropy detected. Requires hardening to meet AAL2 assurance levels."}
                </p>
              </div>

              {/* Remediation Roadmap */}
              <div className="space-y-4">
                <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest">Hardening Roadmap</h5>
                {strength.suggestions.length > 0 || strength.popiaWarning ? (
                  <div className="space-y-3">
                    {strength.popiaWarning && (
                      <div className="flex gap-3 text-sm text-amber-400 bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
                         <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-xs font-black">!</div>
                         Exclude all PII (ID numbers/Phone) to maintain compliance.
                      </div>
                    )}
                    {strength.suggestions.map((s, i) => (
                      <div key={i} className="flex gap-3 text-sm text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-700/30 transition-all hover:border-slate-600">
                        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-black border border-blue-500/20">
                          {i + 1}
                        </div>
                        {s}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl text-center space-y-2">
                    <p className="text-emerald-400 font-bold text-base tracking-tight">ENCRYPTED & PRIVACY-COMPLIANT</p>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Credential aligns with NIST and POPIA security mandates.</p>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between opacity-50">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  <Info className="w-3 h-3" />
                  Compliance Engine v4.0
                </div>
                <div className="text-[10px] text-slate-600 font-mono">STANDARDS: NIST 800-63B / POPIA</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordChecker;
