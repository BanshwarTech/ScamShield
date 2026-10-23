export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type InputType = 'message' | 'screenshot' | 'url' | 'phone' | 'qr' | 'payment';

export type Language = 'en' | 'hi' | 'hinglish';

export interface SuspiciousSignal {
  signal: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  detail: string;
}

export interface ExtractedEntities {
  phone_numbers?: string[];
  urls?: string[];
  upi_ids?: string[];
  organizations_mentioned?: string[];
  apps_requested?: string[];
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  inputType: InputType;
  risk_score: number;
  risk_level: RiskLevel;
  category: string;
  summary: string;
  multilingual_summary: string;
  confidence_score: number;
  why_suspicious: SuspiciousSignal[];
  do_not: string[];
  recommended_actions: string[];
  how_to_verify: string;
  extracted_entities?: ExtractedEntities;
  emergency_contact?: {
    helpline?: string;
    portal?: string;
    instruction?: string;
  };
}

export interface ThreatItem {
  id: string;
  category: string;
  targetType: 'message' | 'phone' | 'url' | 'upi' | 'qr';
  targetValue: string;
  description: string;
  city: string;
  state: string;
  riskScore: number;
  reportedAt: string;
  upvotes: number;
}

export interface QuizQuestion {
  id: number;
  scenario: string;
  scenarioHindi: string;
  contextType: string;
  options: {
    text: string;
    textHindi: string;
    isSafe: boolean;
  }[];
  verdict: string;
  explanation: string;
  explanationHindi: string;
  realScamName: string;
}
