"""
Password Analysis Service
Implements entropy calculation, NIST compliance checks, and POPIA validation
"""

import re
import math
from typing import Optional
from models import PasswordStrengthResponse


class PasswordAnalyzer:
    """
    Advanced password strength analyzer implementing:
    - Shannon entropy calculation
    - NIST 800-63B compliance checking
    - POPIA (South African) privacy law validation
    - Brute-force crack time estimation
    """
    
    # South African ID Pattern: YYMMDDSSSSCAZ (13 digits)
    SA_ID_PATTERN = re.compile(r'^[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{7}$')
    
    # South African Phone Pattern: 0XX XXX XXXX or +27 XX XXX XXXX
    SA_PHONE_PATTERN = re.compile(r'^((\+27|0)\s?([6-8][0-9])\s?([0-9]{3})\s?([0-9]{4}))$')
    
    # Common password patterns to detect
    COMMON_PATTERNS = [
        r'^password\d*$',
        r'^123456',
        r'^qwerty',
        r'^admin\d*$',
        r'^letmein',
        r'^welcome',
        r'^monkey',
        r'^dragon',
    ]
    
    # GPU hashes per second for crack time (high-end hardware)
    HASHES_PER_SECOND = 100_000_000_000  # 100 billion
    
    def check_popia_compliance(self, password: str) -> Optional[str]:
        """
        Check for POPIA (Protection of Personal Information Act) violations.
        Detects if password contains South African PII.
        """
        # Clean password for pattern matching
        cleaned = password.replace(" ", "").replace("-", "")
        
        if self.SA_ID_PATTERN.match(cleaned):
            return (
                "POPIA ALERT: Detected potential South African ID number. "
                "Processing sensitive PII in a password field is non-compliant "
                "with local data privacy laws."
            )
        
        if self.SA_PHONE_PATTERN.match(password):
            return (
                "PRIVACY WARNING: Detected potential contact number. "
                "Using personal identifiers as passwords increases brute-force "
                "vulnerability via social engineering."
            )
        
        return None
    
    def calculate_entropy(self, password: str) -> tuple[float, int]:
        """
        Calculate Shannon entropy using E = L * log2(R)
        Where L = password length, R = character pool size
        
        Returns: (entropy_bits, charset_size)
        """
        if not password:
            return 0.0, 0
        
        charset_size = 0
        
        if re.search(r'[a-z]', password):
            charset_size += 26
        if re.search(r'[A-Z]', password):
            charset_size += 26
        if re.search(r'[0-9]', password):
            charset_size += 10
        if re.search(r'[^A-Za-z0-9]', password):
            charset_size += 33  # Common special characters
        
        if charset_size == 0:
            return 0.0, 0
        
        entropy = len(password) * math.log2(charset_size)
        return round(entropy, 2), charset_size
    
    def estimate_crack_time(self, password: str, charset_size: int) -> str:
        """
        Estimate time to crack password via brute force.
        Assumes high-end GPU cluster at 100 billion hashes/second.
        """
        if not password or charset_size == 0:
            return "Instantly"
        
        total_combinations = charset_size ** len(password)
        seconds_to_crack = total_combinations / self.HASHES_PER_SECOND
        
        if seconds_to_crack > 31536000000:  # > 1000 years
            return "Centuries"
        elif seconds_to_crack > 315360000:  # > 10 years
            return "Decades"
        elif seconds_to_crack > 31536000:  # > 1 year
            return "Years"
        elif seconds_to_crack > 2592000:  # > 30 days
            return "Months"
        elif seconds_to_crack > 86400:  # > 1 day
            return "Days"
        elif seconds_to_crack > 3600:  # > 1 hour
            return "Hours"
        elif seconds_to_crack > 60:  # > 1 minute
            return "Minutes"
        elif seconds_to_crack > 1:
            return "Seconds"
        else:
            return "Instantly"
    
    def calculate_score(self, password: str) -> int:
        """
        Calculate password strength score (0-5) based on multiple criteria.
        """
        if not password:
            return 0
        
        score = 0
        
        # Length requirements
        if len(password) >= 8:
            score += 1
        if len(password) >= 14:
            score += 1
        
        # Character diversity
        if re.search(r'[A-Z]', password):
            score += 1
        if re.search(r'[0-9]', password):
            score += 1
        if re.search(r'[^A-Za-z0-9]', password):
            score += 1
        
        # Penalty for common patterns
        password_lower = password.lower()
        for pattern in self.COMMON_PATTERNS:
            if re.match(pattern, password_lower):
                score = max(0, score - 2)
                break
        
        return min(5, score)
    
    def get_suggestions(self, password: str, score: int) -> list[str]:
        """Generate improvement suggestions based on password analysis."""
        suggestions = []
        
        if len(password) < 12:
            suggestions.append("Increase length to 12+ for Enterprise Compliance")
        
        if not re.search(r'[A-Z]', password):
            suggestions.append("Include uppercase characters")
        
        if not re.search(r'[0-9]', password):
            suggestions.append("Include numeric digits")
        
        if not re.search(r'[^A-Za-z0-9]', password):
            suggestions.append("Include special symbols (!@#$%)")
        
        # Check for sequential patterns
        if re.search(r'(012|123|234|345|456|567|678|789|abc|bcd|cde)', password.lower()):
            suggestions.append("Avoid sequential characters (123, abc)")
        
        # Check for repetition
        if re.search(r'(.)\1{2,}', password):
            suggestions.append("Avoid repeated characters (aaa, 111)")
        
        return suggestions
    
    def analyze(self, password: str) -> PasswordStrengthResponse:
        """
        Perform complete password analysis and return structured response.
        """
        # Calculate metrics
        entropy, charset_size = self.calculate_entropy(password)
        score = self.calculate_score(password)
        crack_time = self.estimate_crack_time(password, charset_size)
        popia_warning = self.check_popia_compliance(password)
        suggestions = self.get_suggestions(password, score)
        
        # Determine label and colors based on score
        if not password:
            label = "Very Weak"
            color = "bg-slate-700"
            compliance = "Non-Compliant"
            risk = "Critical"
        elif score <= 1:
            label = "Weak"
            color = "bg-red-400"
            compliance = "Non-Compliant"
            risk = "Critical"
        elif score <= 3:
            label = "Medium"
            color = "bg-yellow-400"
            compliance = "Partially Compliant"
            risk = "Elevated"
        elif score == 4:
            label = "Strong"
            color = "bg-green-400"
            compliance = "NIST-Standard"
            risk = "Secure"
        else:
            label = "Excellent"
            color = "bg-emerald-500"
            compliance = "NIST-Standard"
            risk = "Secure"
        
        return PasswordStrengthResponse(
            score=score,
            label=label,
            color=color,
            suggestions=suggestions,
            entropy=entropy,
            compliance_rating=compliance,
            risk_profile=risk,
            crack_time=crack_time,
            popia_warning=popia_warning
        )


# Singleton instance
password_analyzer = PasswordAnalyzer()

