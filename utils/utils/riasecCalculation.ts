// RIASEC calculation utilities with tiebreaker detection

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
  hasTies: boolean;
  tiedCategories: string[];
  needsTiebreaker: boolean;
}

export const calculateRiasecScores = (responses: any[], questions: any[]): RiasecResult => {
  // Initialize scores
  const scores: RiasecScores = {
    realistic: 0,
    investigative: 0,
    artistic: 0,
    social: 0,
    enterprising: 0,
    conventional: 0
  };

  // Calculate scores from responses
  responses.forEach(response => {
    const question = questions.find(q => q.id === response.questionId);
    if (question && question.tags.question_type === 'interests_and_preferences') {
      const category = question.tags.category.toLowerCase();
      const selectedOption = question.options.find(opt => opt.id === response.selectedOptionId);
      
      if (selectedOption && selectedOption.optionText.toLowerCase() === 'agree') {
        if (category in scores) {
          scores[category as keyof RiasecScores]++;
        }
      }
    }
  });

  // Sort categories by score
  const sortedCategories = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .map(([category, score]) => ({ category, score }));

  // Detect ties and determine top 3
  const result = determineTiebreakerNeeds(sortedCategories);

  return {
    scores,
    top3: result.top3,
    hasTies: result.hasTies,
    tiedCategories: result.tiedCategories,
    needsTiebreaker: result.needsTiebreaker
  };
};

interface TiebreakerAnalysis {
  top3: string[];
  hasTies: boolean;
  tiedCategories: string[];
  needsTiebreaker: boolean;
}

const determineTiebreakerNeeds = (sortedCategories: Array<{category: string, score: number}>): TiebreakerAnalysis => {
  const result: TiebreakerAnalysis = {
    top3: [],
    hasTies: false,
    tiedCategories: [],
    needsTiebreaker: false
  };

  if (sortedCategories.length === 0) {
    return result;
  }

  // Group categories by score
  const scoreGroups: Array<{score: number, categories: string[]}> = [];
  let currentScore = sortedCategories[0].score;
  let currentGroup: string[] = [];

  sortedCategories.forEach(({ category, score }) => {
    if (score === currentScore) {
      currentGroup.push(category);
    } else {
      scoreGroups.push({ score: currentScore, categories: [...currentGroup] });
      currentScore = score;
      currentGroup = [category];
    }
  });
  
  // Don't forget the last group
  if (currentGroup.length > 0) {
    scoreGroups.push({ score: currentScore, categories: [...currentGroup] });
  }

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

  // If we have exactly 3 categories but some are tied, we might still need tiebreaker
  if (selectedCount < 3 && tiedCategories.length > 0) {
    result.tiedCategories = tiedCategories;
  }

  // Special case: if we have ties within the top 3 positions
  if (!result.needsTiebreaker && result.hasTies) {
    // Check if any of the selected categories have the same score
    const selectedScores = result.top3.map(category => 
      sortedCategories.find(item => item.category === category)?.score || 0
    );
    
    const uniqueScores = [...new Set(selectedScores)];
    if (uniqueScores.length < selectedScores.length) {
      // We have ties within top 3, but they're already resolved by order
      result.needsTiebreaker = false;
    }
  }

  return result;
};

export const applyTiebreakerResults = (
  originalScores: RiasecScores,
  tiebreakerTop3: string[]
): RiasecResult => {
  return {
    scores: originalScores,
    top3: tiebreakerTop3,
    hasTies: false,
    tiedCategories: [],
    needsTiebreaker: false
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

// Helper function to get RIASEC letters from categories
export const getRiasecLetters = (categories: string[]): string[] => {
  const letters: Record<string, string> = {
    realistic: 'R',
    investigative: 'I',
    artistic: 'A',
    social: 'S',
    enterprising: 'E',
    conventional: 'C'
  };
  return categories.map(cat => letters[cat] || cat.charAt(0).toUpperCase());
};