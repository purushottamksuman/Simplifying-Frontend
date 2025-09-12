import {
  APTITUDE_BANDS,
  INTEREST_AGREE_TEXT,
  INTEREST_MAX_PER_CATEGORY,
  PSYCHOMETRIC_HIGH_MIN_RAW,
  PSYCHOMETRIC_MAX_PER_CATEGORY,
  SEI_OPTION_MAP,
  PSYCHOMETRIC_OPTION_MAP,
  ADVERSITY_OPTION_MAP,
  normalizeSeiScoreToBand,
  getAptitudeMaxFor,
  toKey,
  AQ_BANDS,
} from "./constants";
import {
  AssessmentBreakdown,
  CategoryScore,
  QuestionBase,
  QuestionSubmissionItem,
  SubmissionPayload,
  Version,
} from "./types";

function levelFromPercent(percent: number): CategoryScore["categoryScoreLevel"] {
  if (percent >= APTITUDE_BANDS.highMinPercent) return "High";
  if (percent >= APTITUDE_BANDS.moderateMinPercent) return "Moderate";
  return "Low";
}

function levelFromPsychometricRaw(raw: number): CategoryScore["categoryScoreLevel"] {
  return raw >= PSYCHOMETRIC_HIGH_MIN_RAW ? "High" : raw >= 12.5 ? "Moderate" : "Low";
}

function seiLevelFromBand(band: number): CategoryScore["categoryScoreLevel"] {
  if (band >= 8) return "High";
  if (band >= 5) return "Moderate";
  return "Low";
}

export function calculateBreakdown(payload: SubmissionPayload): AssessmentBreakdown {
  const { submissions, questions, version } = payload;

  // Group utilities
  const questionById = new Map<string | number, QuestionBase>();
  questions.forEach(q => questionById.set(q.id, q));

  const psychometric: Record<string, number> = {};
  const aptitude: Record<string, number> = {};
  const adversity: Record<string, number> = {};
  const sei: Record<string, number> = {};
  const interest: Record<string, number> = {};

  submissions.forEach(item => {
    const q = questionById.get(item.questionId);
    if (!q) return;
    const catKey = toKey(q.category);
    const optId = item.selectedOptionId;
    const selected = q.options.find(o => o.id === optId);
    const selectedText = selected ? toKey(selected.text) : "";

    switch (q.type) {
      case "aptitude": {
        const isCorrect = q.correctOptionId !== undefined && q.correctOptionId === optId;
        aptitude[catKey] = (aptitude[catKey] ?? 0) + (isCorrect ? 1 : 0);
        break;
      }
      case "psychometric": {
        const score = PSYCHOMETRIC_OPTION_MAP[selectedText] ?? 0;
        psychometric[catKey] = (psychometric[catKey] ?? 0) + score;
        break;
      }
      case "adversity": {
        const score = ADVERSITY_OPTION_MAP[selectedText] ?? 0;
        adversity[catKey] = (adversity[catKey] ?? 0) + score;
        break;
      }
      case "sei": {
        const score = SEI_OPTION_MAP[selectedText] ?? 0;
        sei[catKey] = (sei[catKey] ?? 0) + score;
        break;
      }
      case "interest": {
        const agree = selectedText === INTEREST_AGREE_TEXT;
        interest[catKey] = (interest[catKey] ?? 0) + (agree ? 1 : 0);
        break;
      }
    }
  });

  // Build CategoryScore structures
  const aptitudeMax = getAptitudeMaxFor(version as Version);

  const aptitudeScores: Record<string, CategoryScore> = {};
  Object.keys(aptitude).forEach(cat => {
    const raw = aptitude[cat];
    const max = aptitudeMax[cat] ?? raw; // fallback to raw if unknown
    const pct = max > 0 ? (raw / max) * 100 : 0;
    aptitudeScores[cat] = {
      categoryScore: raw,
      categoryPercentage: Number(pct.toFixed(2)),
      categoryScoreLevel: levelFromPercent(pct),
    };
  });

  const psychometricScores: Record<string, CategoryScore> = {};
  Object.keys(psychometric).forEach(cat => {
    const raw = psychometric[cat];
    const pct = (raw / PSYCHOMETRIC_MAX_PER_CATEGORY) * 100;
    psychometricScores[cat] = {
      categoryScore: raw,
      categoryPercentage: Number(pct.toFixed(2)),
      categoryScoreLevel: levelFromPsychometricRaw(raw),
    };
  });

  const adversityScores: Record<string, CategoryScore> = {};
  let adversitySum = 0;
  Object.keys(adversity).forEach(cat => {
    const raw = adversity[cat];
    adversitySum += raw;
    const max = 25; // assume up to 5 items * 5 points; percentage is indicative
    const pct = (raw / max) * 100;
    adversityScores[cat] = {
      categoryScore: raw,
      categoryPercentage: Number(pct.toFixed(2)),
      categoryScoreLevel: levelFromPercent(pct),
    };
  });
  const aqTotal = adversitySum * 2;
  const aqBand = AQ_BANDS.find(b => aqTotal >= b.min && aqTotal <= b.max)?.name ?? "Low";

  const seiScores: Record<string, CategoryScore> = {};
  Object.keys(sei).forEach(cat => {
    const raw = sei[cat];
    const doubled = raw * 2;
    const band = normalizeSeiScoreToBand(doubled);
    const pct = (band / 10) * 100;
    seiScores[cat] = {
      categoryScore: band,
      categoryPercentage: Number(pct.toFixed(2)),
      categoryScoreLevel: seiLevelFromBand(band),
    };
  });

  const interestScores: Record<string, CategoryScore> = {};
  Object.keys(interest).forEach(cat => {
    const raw = interest[cat];
    const pct = (raw / INTEREST_MAX_PER_CATEGORY) * 100;
    interestScores[cat] = {
      categoryScore: raw,
      categoryPercentage: Number(pct.toFixed(2)),
      categoryScoreLevel: levelFromPercent(pct),
    };
  });

  // Top3 RIASEC by raw score; tiebreak alphabetical
  const top3 = Object.entries(interest)
    .map(([k, v]) => ({ key: k, value: v }))
    .sort((a, b) => (b.value - a.value) || a.key.localeCompare(b.key))
    .slice(0, 3)
    .map(e => (e.key[0] ?? "").toUpperCase());

  return {
    psychometric: { categoryWiseScore: psychometricScores },
    aptitude: { categoryWiseScore: aptitudeScores },
    adversity: { categoryWiseScore: adversityScores, aqTotal, aqLevel: aqBand },
    sei: { categoryWiseScore: seiScores },
    interest: { categoryWiseScore: interestScores, top3 },
  };
}


