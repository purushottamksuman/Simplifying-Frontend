import { calculateBreakdown } from "./scoring";
import { recommendCareer } from "./recommendation";
import { AssessmentResult, SubmissionPayload } from "./types";
import { buildProfileForDebug } from "./recommendation";

export function calculateAssessmentResult(payload: SubmissionPayload): AssessmentResult {
  const breakdown = calculateBreakdown(payload);
  const recommendation = recommendCareer(breakdown);
  const profile = buildProfileForDebug(breakdown);
  return {
    breakdown,
    profile,
    recommendation,
  } as AssessmentResult;
}


