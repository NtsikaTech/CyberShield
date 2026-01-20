"""
AI-Powered Log Analysis Service
Uses Google Gemini for intelligent security log analysis
"""

import re
import uuid
from datetime import datetime
from typing import Optional
import google.generativeai as genai

from config import get_settings
from models import AnalysisResult, SuspiciousEvent

settings = get_settings()


class LogAnalyzer:
    """
    Security log analyzer powered by Google Gemini AI.
    Detects threats, anomalies, and provides remediation recommendations.
    """
    
    # Common attack patterns for rule-based fallback
    ATTACK_PATTERNS = {
        "brute_force": {
            "pattern": re.compile(r'(failed|invalid|denied).*(password|login|auth)', re.IGNORECASE),
            "event": "Brute Force Attempt",
            "risk": "High",
            "explanation": "Multiple failed authentication attempts detected"
        },
        "port_scan": {
            "pattern": re.compile(r'(connection|port).*(refused|scan|probe)', re.IGNORECASE),
            "event": "Port Scanning Activity",
            "risk": "Medium",
            "explanation": "Network reconnaissance behavior detected"
        },
        "sql_injection": {
            "pattern": re.compile(r"(union.*select|'.*or.*'|drop\s+table|;.*--)", re.IGNORECASE),
            "event": "SQL Injection Attempt",
            "risk": "High",
            "explanation": "Potential SQL injection payload detected in request"
        },
        "path_traversal": {
            "pattern": re.compile(r'\.\./|\.\.\\|%2e%2e', re.IGNORECASE),
            "event": "Path Traversal Attack",
            "risk": "High",
            "explanation": "Directory traversal attempt to access restricted files"
        },
        "xss_attempt": {
            "pattern": re.compile(r'<script|javascript:|on\w+\s*=', re.IGNORECASE),
            "event": "Cross-Site Scripting (XSS)",
            "risk": "Medium",
            "explanation": "Potential XSS payload detected in input"
        },
        "privilege_escalation": {
            "pattern": re.compile(r'(sudo|su\s|chmod.*777|chown.*root)', re.IGNORECASE),
            "event": "Privilege Escalation",
            "risk": "High",
            "explanation": "Attempt to elevate system privileges detected"
        },
        "suspicious_ip": {
            "pattern": re.compile(r'(\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b).*(blocked|blacklist|malicious)', re.IGNORECASE),
            "event": "Blacklisted IP Activity",
            "risk": "High",
            "explanation": "Traffic from known malicious IP address"
        },
        "error_spike": {
            "pattern": re.compile(r'(error|exception|critical|fatal)', re.IGNORECASE),
            "event": "Error Anomaly",
            "risk": "Low",
            "explanation": "Elevated error rate in system logs"
        }
    }
    
    GEMINI_PROMPT = """You are a senior cybersecurity analyst specializing in threat detection and incident response. 
Analyze the following system/security logs and provide a detailed security assessment.

LOGS:
{logs}

Provide your analysis in the following JSON format (no markdown, just valid JSON):
{{
    "summary": "A concise 1-2 sentence summary of the overall security posture",
    "suspicious_events": [
        {{
            "event": "Name of the threat/anomaly",
            "risk_level": "Low|Medium|High",
            "explanation": "Detailed technical explanation of why this is suspicious"
        }}
    ],
    "recommendations": [
        "Specific actionable remediation step 1",
        "Specific actionable remediation step 2"
    ]
}}

Focus on:
- Failed authentication attempts and brute force patterns
- Unusual IP addresses or geographic anomalies
- Privilege escalation attempts
- Injection attacks (SQL, XSS, command injection)
- Malware signatures or C2 communication patterns
- Data exfiltration indicators
- Compliance violations (NIST, POPIA, GDPR)

If no significant threats are found, indicate the system appears secure but still provide best-practice recommendations.
Return ONLY valid JSON, no additional text or markdown formatting."""

    def __init__(self):
        """Initialize the Gemini AI client if API key is available."""
        self.ai_available = False
        
        if settings.GEMINI_API_KEY:
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.model = genai.GenerativeModel('gemini-1.5-flash')
                self.ai_available = True
            except Exception as e:
                print(f"Warning: Failed to initialize Gemini AI: {e}")
    
    def _rule_based_analysis(self, log_data: str) -> tuple[list[SuspiciousEvent], list[str]]:
        """
        Fallback rule-based analysis when AI is unavailable.
        Uses regex patterns to detect common attack signatures.
        """
        events = []
        recommendations = set()
        
        for attack_name, attack_info in self.ATTACK_PATTERNS.items():
            matches = attack_info["pattern"].findall(log_data)
            if matches:
                events.append(SuspiciousEvent(
                    event=attack_info["event"],
                    risk_level=attack_info["risk"],
                    explanation=f"{attack_info['explanation']}. Found {len(matches)} occurrence(s)."
                ))
                
                # Add relevant recommendations
                if attack_name == "brute_force":
                    recommendations.add("Implement account lockout after failed attempts")
                    recommendations.add("Enable multi-factor authentication (MFA)")
                elif attack_name in ["sql_injection", "xss_attempt"]:
                    recommendations.add("Implement input validation and sanitization")
                    recommendations.add("Use parameterized queries for database operations")
                elif attack_name == "privilege_escalation":
                    recommendations.add("Review sudo permissions and audit privilege usage")
                    recommendations.add("Implement principle of least privilege")
                elif attack_name == "port_scan":
                    recommendations.add("Review firewall rules and close unnecessary ports")
                    recommendations.add("Implement intrusion detection system (IDS)")
        
        if not recommendations:
            recommendations.add("Continue monitoring system logs")
            recommendations.add("Ensure log rotation and retention policies are in place")
        
        return events, list(recommendations)
    
    async def analyze_with_ai(self, log_data: str) -> Optional[dict]:
        """
        Analyze logs using Google Gemini AI.
        Returns parsed JSON response or None if analysis fails.
        """
        if not self.ai_available:
            return None
        
        try:
            prompt = self.GEMINI_PROMPT.format(logs=log_data[:10000])  # Limit to 10k chars
            response = await self.model.generate_content_async(prompt)
            
            # Extract JSON from response
            response_text = response.text.strip()
            
            # Remove markdown code blocks if present
            if response_text.startswith("```"):
                response_text = re.sub(r'^```(?:json)?\n?', '', response_text)
                response_text = re.sub(r'\n?```$', '', response_text)
            
            import json
            return json.loads(response_text)
            
        except Exception as e:
            print(f"AI analysis failed: {e}")
            return None
    
    async def analyze(self, log_data: str, depth: str = "standard") -> AnalysisResult:
        """
        Perform complete log analysis combining AI and rule-based detection.
        
        Args:
            log_data: Raw log text to analyze
            depth: Analysis depth - 'quick', 'standard', or 'deep'
        
        Returns:
            AnalysisResult with findings and recommendations
        """
        analysis_id = str(uuid.uuid4())[:8]
        timestamp = datetime.utcnow().isoformat() + "Z"
        
        # Try AI analysis first
        ai_result = None
        if depth in ["standard", "deep"]:
            ai_result = await self.analyze_with_ai(log_data)
        
        if ai_result:
            # Use AI results
            suspicious_events = [
                SuspiciousEvent(
                    event=e.get("event", "Unknown Event"),
                    risk_level=e.get("risk_level", "Medium"),
                    explanation=e.get("explanation", "No details provided")
                )
                for e in ai_result.get("suspicious_events", [])
            ]
            
            return AnalysisResult(
                summary=ai_result.get("summary", "Analysis complete."),
                suspicious_events=suspicious_events,
                recommendations=ai_result.get("recommendations", []),
                analysis_id=analysis_id,
                timestamp=timestamp
            )
        
        # Fallback to rule-based analysis
        events, recommendations = self._rule_based_analysis(log_data)
        
        # Generate summary
        if not events:
            summary = "Analysis complete. No significant threats detected in the provided logs."
        else:
            high_count = sum(1 for e in events if e.risk_level == "High")
            medium_count = sum(1 for e in events if e.risk_level == "Medium")
            
            if high_count > 0:
                summary = f"ALERT: Detected {high_count} high-risk and {medium_count} medium-risk security events requiring immediate attention."
            else:
                summary = f"Analysis complete. Found {len(events)} potential security events for review."
        
        return AnalysisResult(
            summary=summary,
            suspicious_events=events,
            recommendations=recommendations,
            analysis_id=analysis_id,
            timestamp=timestamp
        )


# Singleton instance
log_analyzer = LogAnalyzer()

