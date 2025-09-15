import { CAREER_MAPPINGS, CAREER_RULES } from "./rules";
import {
  AssessmentBreakdown,
  CareerRecommendationResult,
  RecommendationReasoning,
  RuleMatchResult,
  StudentProfileForRules,
} from "./types";

function buildProfile(breakdown: AssessmentBreakdown): StudentProfileForRules {
  const riasecTop3 = breakdown.interest.top3;

  const oceanHigh: string[] = [];
  const oceanLow: string[] = [];
  const oceanMap: Record<string, string> = {
    openness: "O",
    conscientiousness: "C",
    extraversion: "E",
    agreeableness: "A",
    neuroticism: "N",
  };
  Object.entries(breakdown.psychometric.categoryWiseScore).forEach(([cat, score]) => {
    const letter = oceanMap[cat] ?? cat[0]?.toUpperCase();
    if (!letter) return;
    if (score.categoryScoreLevel === "High") oceanHigh.push(letter);
    if (score.categoryScoreLevel === "Low") oceanLow.push(letter);
  });

  // Map aptitude categories to DAT short codes
  const datMap: Record<string, string> = {
    vr: "VR",
    verbal: "VR",
    na: "NA",
    numerical: "NA",
    ar: "AR",
    abstract: "AR",
    psa: "PSA",
    "speed & accuracy": "PSA",
    mr: "MR",
    mechanical: "MR",
    sr: "SR",
    spatial: "SR",
    lu: "LU",
    "language usage": "LU",
  };
  const datLevels: Record<string, "High" | "Moderate" | "Low"> = {};
  Object.entries(breakdown.aptitude.categoryWiseScore).forEach(([cat, score]) => {
    const code = datMap[cat] ?? cat.toUpperCase();
    datLevels[code] = score.categoryScoreLevel;
  });

  return { riasecTop3, oceanHigh, oceanLow, datLevels };
}

function scoreRule(profile: StudentProfileForRules, rule: typeof CAREER_RULES[number]): RuleMatchResult {
  let total = 0;

  // RIASEC: +5 for each letter present in top 3
  if (rule.riasecCombination) {
    for (const ch of rule.riasecCombination) {
      if (profile.riasecTop3.includes(ch)) total += 5;
    }
  }

  // OCEAN High: +5 if student High includes it
  if (rule.highOCEANTraits) {
    for (const ch of rule.highOCEANTraits) {
      if (profile.oceanHigh.includes(ch)) total += 5;
    }
  }

  // OCEAN Low: +5 if student Low includes it
  if (rule.lowOCEANTraits) {
    for (const ch of rule.lowOCEANTraits) {
      if (profile.oceanLow.includes(ch)) total += 5;
    }
  }

  // DAT requirements
  if (rule.datScoreRules) {
    for (const req of rule.datScoreRules) {
      const studentLevel = profile.datLevels[req.shortCode];
      if (!studentLevel) continue;
      if (req.score === 5) {
        total += studentLevel === "High" ? 5 : studentLevel === "Moderate" ? 3 : 1;
      } else if (req.score === 3) {
        total += studentLevel === "Low" ? 1 : 3; // High or Moderate → 3, Low → 1
      } else {
        total += 1; // Low required
      }
    }
  }

  const matchPercent = rule.ruleScore > 0 ? total / rule.ruleScore : 0;
  return { ruleName: rule.ruleName, score: total, matchPercent };
}

function buildReasoning(profile: StudentProfileForRules, bestRuleName: string): RecommendationReasoning {
  const rule = CAREER_RULES.find(r => r.ruleName === bestRuleName);
  const riasec: string[] = [];
  const ocean: string[] = [];
  const dat: string[] = [];
  if (!rule) return { riasec, ocean, dat };

  // RIASEC
  if (rule.riasecCombination) {
    for (const ch of rule.riasecCombination) {
      if (profile.riasecTop3.includes(ch)) {
        const texts: Record<string, string> = {
          R: "You are a Doer — hands-on and practical.",
          I: "You are a Thinker — analytical and curious.",
          A: "You are a Creator — expressive and imaginative.",
          S: "You are a Helper — people-oriented and empathetic.",
          E: "You are a Persuader — outgoing and leadership-driven.",
          C: "You are an Organizer — structured and detail-focused.",
        } as const;
        riasec.push(texts[ch as keyof typeof texts] ?? `Strong interest alignment: ${ch}`);
      }
    }
  }

  // OCEAN
  if (rule.highOCEANTraits) {
    for (const ch of rule.highOCEANTraits) {
      if (profile.oceanHigh.includes(ch)) {
        const map: Record<string, string> = {
          O: "High Openness — creativity and idea exploration are your strengths.",
          C: "High Conscientiousness — organized, disciplined, and reliable.",
          E: "High Extraversion — energetic communication and leadership.",
          A: "High Agreeableness — cooperative and team-friendly.",
          N: "Low Neuroticism — calm and emotionally stable.",
        };
        ocean.push(map[ch] ?? `High ${ch}`);
      }
    }
  }
  if (rule.lowOCEANTraits) {
    for (const ch of rule.lowOCEANTraits) {
      if (profile.oceanLow.includes(ch)) {
        const map: Record<string, string> = {
          O: "Lower Openness — prefer structure over novelty.",
          C: "Lower Conscientiousness — benefit from routines and planning.",
          E: "Lower Extraversion — reflective and focused.",
          A: "Lower Agreeableness — direct and objective.",
          N: "Higher Neuroticism — stress management strategies recommended.",
        };
        ocean.push(map[ch] ?? `Low ${ch}`);
      }
    }
  }

  // DAT
  if (rule.datScoreRules) {
    const pretty: Record<string, string> = {
      VR: "Verbal Reasoning",
      NA: "Numerical Ability",
      AR: "Abstract Reasoning",
      PSA: "Perceptual Speed & Accuracy",
      MR: "Mechanical Reasoning",
      SR: "Space Relations",
      LU: "Language Usage",
    };
    for (const req of rule.datScoreRules) {
      const needed = req.score === 5 ? "High" : req.score === 3 ? "Moderate" : "Low";
      const scored = profile.datLevels[req.shortCode] ?? "Unknown";
      dat.push(`${pretty[req.shortCode] ?? req.shortCode}: needed ${needed}, you scored ${scored}.`);
    }
  }

  return { riasec, ocean, dat };
}

export function recommendCareer(breakdown: AssessmentBreakdown): CareerRecommendationResult {
  const profile = buildProfile(breakdown);
  const matches = CAREER_RULES.map(r => scoreRule(profile, r));
  matches.sort((a, b) => b.matchPercent - a.matchPercent);
  const best = matches[0];
  const mapping = CAREER_MAPPINGS.find(m => m.ruleName === best.ruleName)!;
  const reasoning = buildReasoning(profile, best.ruleName);
  return { bestRule: best, mapping, reasoning };
}

export function buildProfileForDebug(breakdown: AssessmentBreakdown) {
  return buildProfile(breakdown);
}


