// RIASEC Tiebreaker Logic - Handles ties in interest scores with minimal questions

export interface RiasecScores {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
}

export interface RiasecResult {
  scores: RiasecScores;
  top3: string[];
  top3Letters: string[];
  hasTies: boolean;
  tiedCategories: string[];
  needsTiebreaker: boolean;
  tiebreakerQuestions?: TiebreakerQuestion[];
}

export interface TiebreakerQuestion {
  id: string;
  category_a: string;
  category_b: string;
  option_a_text: string;
  option_b_text: string;
}

const CATEGORY_LETTERS: Record<string, string> = {
  realistic: 'R',
  investigative: 'I',
  artistic: 'A',
  social: 'S',
  enterprising: 'E',
  conventional: 'C'
};

export const calculateRiasecWithTiebreaker = (
  interestScores: Record<string, number>
): RiasecResult => {
  
  // Sort categories by score
  const sortedCategories = Object.entries(interestScores)
    .sort(([,a], [,b]) => b - a);

  console.log('RIASEC scores sorted:', sortedCategories);

  // Detect ties and determine if tiebreaker is needed
  const result = analyzeTiesAndDetermineTop3(sortedCategories);
  
  return {
    scores: interestScores as RiasecScores,
    top3: result.top3,
    top3Letters: result.top3Letters,
    hasTies: result.hasTies,
    tiedCategories: result.tiedCategories,
    needsTiebreaker: result.needsTiebreaker,
    tiebreakerQuestions: result.needsTiebreaker ? generateTiebreakerQuestions(result.tiedCategories) : undefined
  };
};

interface TieAnalysisResult {
  top3: string[];
  top3Letters: string[];
  hasTies: boolean;
  tiedCategories: string[];
  needsTiebreaker: boolean;
}

function analyzeTiesAndDetermineTop3(sortedCategories: Array<[string, number]>): TieAnalysisResult {
  const result: TieAnalysisResult = {
    top3: [],
    top3Letters: [],
    hasTies: false,
    tiedCategories: [],
    needsTiebreaker: false
  };

  if (sortedCategories.length === 0) return result;

  // Group categories by score to detect ties
  const scoreGroups: Array<{ score: number; categories: string[] }> = [];
  let currentScore = sortedCategories[0][1];
  let currentGroup: string[] = [];

  sortedCategories.forEach(([category, score]) => {
    if (score === currentScore) {
      currentGroup.push(category);
    } else {
      scoreGroups.push({ score: currentScore, categories: [...currentGroup] });
      currentScore = score;
      currentGroup = [category];
    }
  });
  
  // Add the last group
  if (currentGroup.length > 0) {
    scoreGroups.push({ score: currentScore, categories: [...currentGroup] });
  }

  console.log('Score groups:', scoreGroups);

  // Determine top 3 and identify ties
  let selectedCount = 0;
  let tiedCategories: string[] = [];

  for (const group of scoreGroups) {
    const remainingSlots = 3 - selectedCount;
    
    if (group.categories.length <= remainingSlots) {
      // All categories in this group can be included
      result.top3.push(...group.categories);
      selectedCount += group.categories.length;
    } else {
      // This group has more categories than remaining slots - we have a tie
      result.hasTies = true;
      tiedCategories = [...group.categories];
      result.needsTiebreaker = true;
      break;
    }

    if (selectedCount >= 3) break;
  }

  // If we have ties that need resolution
  if (result.needsTiebreaker && tiedCategories.length > 0) {
    result.tiedCategories = tiedCategories;
    // Don't add tied categories to top3 yet - they'll be resolved by tiebreaker
  } else {
    // No tiebreaker needed, finalize top 3
    result.top3 = result.top3.slice(0, 3);
  }

  // Generate letters for confirmed top 3
  result.top3Letters = result.top3.map(cat => CATEGORY_LETTERS[cat] || cat.charAt(0).toUpperCase());

  console.log('Tie analysis result:', result);
  return result;
}

function generateTiebreakerQuestions(tiedCategories: string[]): TiebreakerQuestion[] {
  // Generate minimal tiebreaker questions - only what's needed
  const questions: TiebreakerQuestion[] = [];
  
  // Create pairs from tied categories
  const pairs: Array<{categoryA: string, categoryB: string}> = [];
  for (let i = 0; i < tiedCategories.length; i++) {
    for (let j = i + 1; j < tiedCategories.length; j++) {
      pairs.push({ categoryA: tiedCategories[i], categoryB: tiedCategories[j] });
    }
  }

  console.log('Tiebreaker pairs needed:', pairs);

  // Generate 2-3 questions per pair (minimal to resolve ties quickly)
  pairs.forEach((pair, pairIndex) => {
    const questionsPerPair = Math.min(3, Math.ceil(6 / pairs.length)); // Max 3 questions per pair
    
    for (let q = 0; q < questionsPerPair; q++) {
      questions.push({
        id: `tiebreaker_${pairIndex}_${q}`,
        category_a: pair.categoryA,
        category_b: pair.categoryB,
        option_a_text: getTiebreakerOptionText(pair.categoryA, q),
        option_b_text: getTiebreakerOptionText(pair.categoryB, q)
      });
    }
  });

  console.log(`Generated ${questions.length} tiebreaker questions for ${tiedCategories.length} tied categories`);
  return questions.slice(0, 8); // Limit to max 8 questions total
}

function getTiebreakerOptionText(category: string, questionIndex: number): string {
  const options: Record<string, string[]> = {
    realistic: [
      "Work with tools and machinery to build or repair things",
      "Operate equipment and work with your hands on practical projects",
      "Fix mechanical problems and work in outdoor environments"
    ],
    investigative: [
      "Research complex topics and analyze data to find solutions",
      "Conduct experiments and study scientific phenomena",
      "Investigate problems using logical thinking and analysis"
    ],
    artistic: [
      "Create original artwork, music, or written content",
      "Design visual materials and express creativity through various media",
      "Develop innovative concepts and artistic expressions"
    ],
    social: [
      "Help people solve personal problems and provide guidance",
      "Teach others and work directly with individuals or groups",
      "Support community development and social welfare programs"
    ],
    enterprising: [
      "Lead teams and manage business operations",
      "Persuade others and negotiate business deals",
      "Start new ventures and take calculated risks for profit"
    ],
    conventional: [
      "Organize data and maintain detailed records systematically",
      "Follow established procedures and work with structured processes",
      "Manage administrative tasks and ensure accuracy in documentation"
    ]
  };

  const categoryOptions = options[category] || ["Work in this field", "Engage in this activity", "Pursue this type of work"];
  return categoryOptions[questionIndex % categoryOptions.length];
}

export const applyTiebreakerResults = (
  originalResult: RiasecResult,
  tiebreakerResponses: Array<{ questionId: string; selectedCategory: string }>
): RiasecResult => {
  
  // Count tiebreaker responses
  const tiebreakerScores: Record<string, number> = {};
  originalResult.tiedCategories.forEach(cat => {
    tiebreakerScores[cat] = 0;
  });

  tiebreakerResponses.forEach(response => {
    if (tiebreakerScores.hasOwnProperty(response.selectedCategory)) {
      tiebreakerScores[response.selectedCategory]++;
    }
  });

  console.log('Tiebreaker scores:', tiebreakerScores);

  // Determine winners from tiebreaker
  const tiebreakerWinners = Object.entries(tiebreakerScores)
    .sort(([,a], [,b]) => b - a);

  // Calculate how many winners we need
  const remainingSlots = 3 - originalResult.top3.length;
  const finalTop3 = [...originalResult.top3];

  // Add tiebreaker winners
  for (let i = 0; i < Math.min(remainingSlots, tiebreakerWinners.length); i++) {
    finalTop3.push(tiebreakerWinners[i][0]);
  }

  // Generate final letters
  const finalTop3Letters = finalTop3.map(cat => CATEGORY_LETTERS[cat] || cat.charAt(0).toUpperCase());

  console.log('Final top 3 after tiebreaker:', finalTop3);
  console.log('Final top 3 letters:', finalTop3Letters);

  return {
    ...originalResult,
    top3: finalTop3,
    top3Letters: finalTop3Letters,
    hasTies: false,
    needsTiebreaker: false,
    tiedCategories: []
  };
};

// Helper function to get category display names
export const getCategoryDisplayName = (category: string): string => {
  const names: Record<string, string> = {
    realistic: 'Realistic (R)',
    investigative: 'Investigative (I)',
    artistic: 'Artistic (A)',
    social: 'Social (S)',
    enterprising: 'Enterprising (E)',
    conventional: 'Conventional (C)'
  };
  return names[category] || category;
};