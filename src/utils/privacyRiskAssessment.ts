export interface PrivacyRiskAssessment {
  riskScore: number; // 0-10
  riskLevel: 'Low' | 'Medium' | 'High';
  reason: string;
  recommendation: string;
  concerns: string[];
  positives: string[];
}

export interface DataCollectionRequest {
  websiteName: string;
  dataRequested: string[];
  purpose: string;
  privacyPolicyText?: string;
  website?: string;
}

// High-risk data types that increase privacy concerns
const HIGH_RISK_DATA = [
  'ssn', 'social security', 'passport', 'driver license', 'government id',
  'credit card', 'bank account', 'financial', 'medical', 'health',
  'biometric', 'fingerprint', 'face recognition', 'dna', 'genetic'
];

// Medium-risk data types
const MEDIUM_RISK_DATA = [
  'location', 'gps', 'address', 'phone', 'contact', 'browsing history',
  'search history', 'device id', 'ip address', 'cookies', 'tracking'
];

// Low-risk data types
const LOW_RISK_DATA = [
  'name', 'email', 'age', 'gender', 'preferences', 'newsletter',
  'marketing', 'analytics', 'performance'
];

// Suspicious purposes that increase risk
const SUSPICIOUS_PURPOSES = [
  'sell', 'selling', 'third party', 'marketing partners', 'advertising networks',
  'data brokers', 'profiling', 'surveillance', 'monitoring', 'tracking users'
];

// Legitimate purposes that reduce risk
const LEGITIMATE_PURPOSES = [
  'service delivery', 'account management', 'customer support', 'security',
  'fraud prevention', 'legal compliance', 'improve service', 'functionality'
];

export function assessPrivacyRisk(request: DataCollectionRequest): PrivacyRiskAssessment {
  let riskScore = 0;
  const concerns: string[] = [];
  const positives: string[] = [];

  // Analyze data types requested
  const dataText = request.dataRequested.join(' ').toLowerCase();
  
  // Check for high-risk data
  const highRiskFound = HIGH_RISK_DATA.filter(risk => dataText.includes(risk));
  if (highRiskFound.length > 0) {
    riskScore += 4;
    concerns.push(`Requests sensitive data: ${highRiskFound.join(', ')}`);
  }

  // Check for medium-risk data
  const mediumRiskFound = MEDIUM_RISK_DATA.filter(risk => dataText.includes(risk));
  if (mediumRiskFound.length > 0) {
    riskScore += 2;
    concerns.push(`Requests tracking data: ${mediumRiskFound.join(', ')}`);
  }

  // Check for low-risk data only
  const lowRiskFound = LOW_RISK_DATA.filter(risk => dataText.includes(risk));
  if (lowRiskFound.length > 0 && highRiskFound.length === 0 && mediumRiskFound.length === 0) {
    positives.push(`Only requests basic information: ${lowRiskFound.join(', ')}`);
  }

  // Analyze purpose
  const purposeText = request.purpose.toLowerCase();
  
  // Check for suspicious purposes
  const suspiciousPurposeFound = SUSPICIOUS_PURPOSES.filter(purpose => purposeText.includes(purpose));
  if (suspiciousPurposeFound.length > 0) {
    riskScore += 3;
    concerns.push(`Suspicious purpose indicators: ${suspiciousPurposeFound.join(', ')}`);
  }

  // Check for legitimate purposes
  const legitimatePurposeFound = LEGITIMATE_PURPOSES.filter(purpose => purposeText.includes(purpose));
  if (legitimatePurposeFound.length > 0) {
    riskScore -= 1;
    positives.push(`Legitimate purpose: ${legitimatePurposeFound.join(', ')}`);
  }

  // Analyze website reputation (basic heuristics)
  if (request.websiteName) {
    const websiteName = request.websiteName.toLowerCase();
    
    // Known trustworthy domains
    if (websiteName.includes('gov') || websiteName.includes('edu') || 
        websiteName.includes('bank') || websiteName.includes('healthcare')) {
      riskScore -= 1;
      positives.push('Appears to be from a trusted institution');
    }
    
    // Suspicious domain patterns
    if (websiteName.includes('free') || websiteName.includes('win') || 
        websiteName.includes('prize') || websiteName.length < 5) {
      riskScore += 2;
      concerns.push('Website name appears suspicious');
    }
  }

  // Analyze privacy policy if available
  if (request.privacyPolicyText) {
    const policyText = request.privacyPolicyText.toLowerCase();
    
    // Positive privacy policy indicators
    if (policyText.includes('gdpr') || policyText.includes('ccpa') || 
        policyText.includes('data protection') || policyText.includes('user rights')) {
      riskScore -= 1;
      positives.push('Privacy policy mentions data protection regulations');
    }
    
    if (policyText.includes('delete') || policyText.includes('opt-out') || 
        policyText.includes('withdraw consent')) {
      positives.push('Provides data deletion and opt-out options');
    }
    
    // Negative privacy policy indicators
    if (policyText.includes('sell') || policyText.includes('third parties') || 
        policyText.includes('advertising partners')) {
      riskScore += 2;
      concerns.push('May share data with third parties');
    }
    
    if (policyText.includes('indefinitely') || policyText.includes('permanent')) {
      riskScore += 1;
      concerns.push('May retain data indefinitely');
    }
  } else {
    riskScore += 1;
    concerns.push('No privacy policy provided');
  }

  // Ensure score is within bounds
  riskScore = Math.max(0, Math.min(10, riskScore));

  // Determine risk level
  let riskLevel: 'Low' | 'Medium' | 'High';
  if (riskScore <= 3) {
    riskLevel = 'Low';
  } else if (riskScore <= 6) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'High';
  }

  // Generate reason and recommendation
  const reason = generateReason(riskScore, concerns, positives);
  const recommendation = generateRecommendation(riskLevel, concerns);

  return {
    riskScore,
    riskLevel,
    reason,
    recommendation,
    concerns,
    positives
  };
}

function generateReason(score: number, concerns: string[], positives: string[]): string {
  if (score <= 3) {
    return `Low risk data collection with ${positives.length > 0 ? 'legitimate purposes' : 'minimal concerns'}. ${concerns.length > 0 ? 'Some minor issues noted.' : 'Standard data practices observed.'}`;
  } else if (score <= 6) {
    return `Moderate privacy concerns due to ${concerns.length} identified issues. ${positives.length > 0 ? 'Some positive aspects noted.' : 'Exercise caution.'}`;
  } else {
    return `High privacy risk with significant concerns about data collection practices. ${concerns.length} major issues identified.`;
  }
}

function generateRecommendation(riskLevel: string, concerns: string[]): string {
  switch (riskLevel) {
    case 'Low':
      return 'Safe to proceed. Consider setting a reasonable expiry date for the consent.';
    case 'Medium':
      return 'Proceed with caution. Review the privacy policy carefully and consider a shorter expiry period.';
    case 'High':
      return 'Not recommended. Consider declining or requesting more information about data handling practices.';
    default:
      return 'Review carefully before proceeding.';
  }
}