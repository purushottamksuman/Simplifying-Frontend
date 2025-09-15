export type QuestionType =
  | "aptitude"
  | "psychometric"
  | "adversity"
  | "sei"
  | "interest";

export type Version = 1 | 2;

export interface QuestionOption {
  id: string | number;
  text: string;
}

export interface QuestionBase {
  id: string | number;
  type: QuestionType;
  category: string; // e.g., "verbal", "openness", "realistic"
  correctOptionId?: string | number; // only for aptitude
  options: QuestionOption[];
}

export interface QuestionSubmissionItem {
  questionId: string | number;
  selectedOptionId: string | number;
}

export interface SubmissionPayload {
  version: Version;
  submissions: QuestionSubmissionItem[];
  questions: QuestionBase[]; // must include all referenced questionIds
}

export interface CategoryScore {
  categoryScore: number; // raw
  categoryPercentage: number; // 0-100
  categoryScoreLevel: "High" | "Moderate" | "Low";
}

export interface PsychometricScores {
  categoryWiseScore: Record<string, CategoryScore>; // O, C, E, A, N keys
}

export interface AptitudeScores {
  categoryWiseScore: Record<string, CategoryScore>; // VR, NA, AR, PSA, MR, SR, LU
}

export interface AdversityScores {
  categoryWiseScore: Record<string, CategoryScore>; // Control, Ownership, Reach, Endurance
  aqTotal?: number; // 2x sum of all
  aqLevel?: "High" | "Moderately High" | "Moderate" | "Moderately Low" | "Low";
}

export interface SeiScores {
  categoryWiseScore: Record<string, CategoryScore>; // Self Awareness, etc. (percentage is based on normalized 1-10)
}

export interface InterestScores {
  categoryWiseScore: Record<string, CategoryScore>; // R, I, A, S, E, C
  top3: string[]; // top 3 letters
}

export interface AssessmentBreakdown {
  psychometric: PsychometricScores;
  aptitude: AptitudeScores;
  adversity: AdversityScores;
  sei: SeiScores;
  interest: InterestScores;
}

export interface StudentProfileForRules {
  riasecTop3: string[]; // e.g., ["R", "I", "A"]
  oceanHigh: string[]; // letters from OCEAN with High
  oceanLow: string[]; // letters from OCEAN with Low
  datLevels: Record<string, "High" | "Moderate" | "Low">; // VR..LU
}

export interface CareerDatRequirement { shortCode: string; score: 1 | 3 | 5; }

export interface CareerRule {
  ruleName: string;
  riasecCombination: string; // e.g., "RIA"
  highOCEANTraits?: string; // e.g., "OC"
  lowOCEANTraits?: string; // e.g., "EA"
  datScoreRules?: CareerDatRequirement[];
  ruleScore: number; // max points for normalization
}

export interface CareerMapping {
  ruleName: string;
  idealCareer: string;
  clubToJoin: string;
  idealFor: string;
  tagLine: string;
}

export interface RuleMatchResult {
  ruleName: string;
  score: number;
  matchPercent: number; // 0-1
}

export interface RecommendationReasoning {
  riasec: string[];
  ocean: string[];
  dat: string[];
}

export interface CareerRecommendationResult {
  bestRule: RuleMatchResult;
  mapping: CareerMapping;
  reasoning: RecommendationReasoning;
}

export interface AssessmentResult {
  breakdown: AssessmentBreakdown;
  profile: StudentProfileForRules;
  recommendation: CareerRecommendationResult;
}


