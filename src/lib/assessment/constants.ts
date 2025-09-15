import { Version } from "./types";

// Option text to score maps (case-insensitive, trimmed)
export const PSYCHOMETRIC_OPTION_MAP: Record<string, number> = {
  "extremely unlikely": 1,
  "unlikely": 2,
  "neutral": 3,
  "likely": 4,
  "extremely likely": 5,
};

export const ADVERSITY_OPTION_MAP: Record<string, number> = {
  "never": 1,
  "extremely unlikely": 1,
  "almost never": 2,
  "unlikely": 2,
  "sometimes": 3,
  "neutral": 3,
  "almost always": 4,
  "likely": 4,
  "always": 5,
  "extremely likely": 5,
};

export const SEI_OPTION_MAP: Record<string, number> = {
  "not at all": 1,
  "never": 1,
  "slightly": 2,
  "almost never": 2,
  "fairly": 3,
  "sometimes": 3,
  "almost always": 4,
  "moderately": 4,
  "extremely": 5,
  "always": 5,
};

export const INTEREST_AGREE_TEXT = "agree"; // equalsIgnoreCase

// Max questions per category for aptitude v2
export const APTITUDE_MAX_V2: Record<string, number> = {
  vr: 6, // Verbal Reasoning
  na: 7, // Numerical Ability
  ar: 6, // Abstract Reasoning
  psa: 8, // Perceptual Speed & Accuracy
  mr: 6, // Mechanical Reasoning
  sr: 6, // Space Relations
  lu: 6, // Language Usage
};

export const PSYCHOMETRIC_MAX_PER_CATEGORY = 25; // 5 questions * max option 5

export const INTEREST_MAX_PER_CATEGORY = 5; // 5 items, agree-only scoring

// Thresholds
export const APTITUDE_BANDS = {
  highMinPercent: 77,
  moderateMinPercent: 24,
};

export const PSYCHOMETRIC_HIGH_MIN_RAW = 17.5; // out of 25

export const AQ_BANDS = [
  { name: "High" as const, min: 178, max: 200 },
  { name: "Moderately High" as const, min: 161, max: 177 },
  { name: "Moderate" as const, min: 135, max: 160 },
  { name: "Moderately Low" as const, min: 118, max: 134 },
  { name: "Low" as const, min: -Infinity, max: 117 },
];

// SEI normalization: after doubling raw per category → map to 1–10
export function normalizeSeiScoreToBand(s: number): number {
  if (s >= 47 && s <= 50) return 10;
  if (s >= 44 && s <= 46) return 9;
  if (s >= 41 && s <= 43) return 8;
  if (s >= 39 && s <= 40) return 7;
  if (s >= 37 && s <= 38) return 6;
  if (s >= 34 && s <= 36) return 5;
  if (s >= 31 && s <= 33) return 4;
  if (s >= 26 && s <= 30) return 3;
  if (s >= 21 && s <= 25) return 2;
  if (s >= 10 && s <= 20) return 1;
  return 0;
}

export function getAptitudeMaxFor(version: Version): Record<string, number> {
  // For now only v2 known; extend if v1 different.
  return APTITUDE_MAX_V2;
}

export function toKey(s: string): string {
  return s.trim().toLowerCase();
}


