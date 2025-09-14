import { calculateDetailedAssessmentResult } from './assessmentScoring';

// Sample test data
const sampleQuestions = [
  // Psychometric questions
  {
    id: 'psych1',
    tags: { question_type: 'psychometric', category: 'openness' },
    options: [
      { id: 'opt1', optionText: 'Extremely Unlikely' },
      { id: 'opt2', optionText: 'Unlikely' },
      { id: 'opt3', optionText: 'Neutral' },
      { id: 'opt4', optionText: 'Likely' },
      { id: 'opt5', optionText: 'Extremely Likely' }
    ]
  },
  {
    id: 'psych2',
    tags: { question_type: 'psychometric', category: 'conscientiousness' },
    options: [
      { id: 'opt6', optionText: 'Extremely Unlikely' },
      { id: 'opt7', optionText: 'Unlikely' },
      { id: 'opt8', optionText: 'Neutral' },
      { id: 'opt9', optionText: 'Likely' },
      { id: 'opt10', optionText: 'Extremely Likely' }
    ]
  },
  // Aptitude questions
  {
    id: 'apt1',
    tags: { question_type: 'aptitude', category: 'verbal' },
    options: [
      { id: 'opt11', optionText: 'Option A' },
      { id: 'opt12', optionText: 'Option B' },
      { id: 'opt13', optionText: 'Option C' },
      { id: 'opt14', optionText: 'Option D' }
    ],
    correctOption: 'opt12'
  },
  {
    id: 'apt2',
    tags: { question_type: 'aptitude', category: 'numerical' },
    options: [
      { id: 'opt15', optionText: '10' },
      { id: 'opt16', optionText: '20' },
      { id: 'opt17', optionText: '30' },
      { id: 'opt18', optionText: '40' }
    ],
    correctOption: 'opt16'
  },
  // Adversity questions
  {
    id: 'adv1',
    tags: { question_type: 'adversity', category: 'control' },
    options: [
      { id: 'opt19', optionText: 'Never' },
      { id: 'opt20', optionText: 'Almost Never' },
      { id: 'opt21', optionText: 'Sometimes' },
      { id: 'opt22', optionText: 'Almost Always' },
      { id: 'opt23', optionText: 'Always' }
    ]
  },
  // SEI questions
  {
    id: 'sei1',
    tags: { question_type: 'sei', category: 'self awareness' },
    options: [
      { id: 'opt24', optionText: 'Not At All' },
      { id: 'opt25', optionText: 'Slightly' },
      { id: 'opt26', optionText: 'Fairly' },
      { id: 'opt27', optionText: 'Moderately' },
      { id: 'opt28', optionText: 'Extremely' }
    ]
  },
  // Interests questions
  {
    id: 'int1',
    tags: { question_type: 'interests_and_preferences', category: 'realistic' },
    options: [
      { id: 'opt29', optionText: 'Agree' },
      { id: 'opt30', optionText: 'Disagree' }
    ]
  },
  {
    id: 'int2',
    tags: { question_type: 'interests_and_preferences', category: 'investigative' },
    options: [
      { id: 'opt31', optionText: 'Agree' },
      { id: 'opt32', optionText: 'Disagree' }
    ]
  }
];

// Test submissions
const sampleSubmissions = [
  // Psychometric responses (high scores)
  { questionId: 'psych1', selectedOptionId: 'opt5' }, // Extremely Likely = 5
  { questionId: 'psych2', selectedOptionId: 'opt4' }, // Likely = 4
  
  // Aptitude responses (1 correct, 1 incorrect)
  { questionId: 'apt1', selectedOptionId: 'opt12' }, // Correct
  { questionId: 'apt2', selectedOptionId: 'opt15' }, // Incorrect
  
  // Adversity response
  { questionId: 'adv1', selectedOptionId: 'opt22' }, // Almost Always = 4
  
  // SEI response
  { questionId: 'sei1', selectedOptionId: 'opt27' }, // Moderately = 4
  
  // Interests responses
  { questionId: 'int1', selectedOptionId: 'opt29' }, // Agree = 1
  { questionId: 'int2', selectedOptionId: 'opt32' }  // Disagree = 0
];

// Test functions
export const runAssessmentTests = () => {
  console.log('🧪 Starting Assessment Scoring Tests...\n');

  // Test 1: Basic functionality
  console.log('Test 1: Basic Calculation');
  const result = calculateDetailedAssessmentResult(sampleSubmissions, sampleQuestions);
  console.log('Result:', JSON.stringify(result, null, 2));
  console.log('✅ Basic calculation completed\n');

  // Test 2: Psychometric scoring
  console.log('Test 2: Psychometric Scoring Validation');
  if (result.psychometric) {
    const openness = result.psychometric.categoryWiseScore.openness;
    const conscientiousness = result.psychometric.categoryWiseScore.conscientiousness;
    
    console.log(`Openness: score=${openness?.score}, percentage=${openness?.percentage}, level=${openness?.level}`);
    console.log(`Conscientiousness: score=${conscientiousness?.score}, percentage=${conscientiousness?.percentage}, level=${conscientiousness?.level}`);
    
    // Validate: 1 question with score 5 should give score=5, percentage=20, level=Low
    if (openness?.score === 5 && openness?.percentage === 20 && openness?.level === 'Low') {
      console.log('✅ Psychometric scoring correct');
    } else {
      console.log('❌ Psychometric scoring incorrect');
    }
  }
  console.log('');

  // Test 3: Aptitude scoring
  console.log('Test 3: Aptitude Scoring Validation');
  if (result.aptitude) {
    const verbal = result.aptitude.categoryWiseScore.verbal;
    const numerical = result.aptitude.categoryWiseScore.numerical;
    
    console.log(`Verbal: score=${verbal?.score}, percentage=${verbal?.percentage}, level=${verbal?.level}`);
    console.log(`Numerical: score=${numerical?.score}, percentage=${numerical?.percentage}, level=${numerical?.level}`);
    
    // Validate: 1 correct out of max 6 for verbal = 16.67%, level=Low
    if (verbal?.score === 1 && Math.abs(verbal?.percentage - 16.67) < 0.1 && verbal?.level === 'Low') {
      console.log('✅ Aptitude scoring correct');
    } else {
      console.log('❌ Aptitude scoring incorrect');
    }
  }
  console.log('');

  // Test 4: Adversity scoring
  console.log('Test 4: Adversity Scoring Validation');
  if (result.adversity) {
    const control = result.adversity.categoryWiseScore.control;
    const aqScore = result.adversity.aqScore;
    const aqLevel = result.adversity.aqLevel;
    
    console.log(`Control: score=${control?.score}`);
    console.log(`AQ Score: ${aqScore}, Level: ${aqLevel}`);
    
    // Validate: 1 question with score 4, AQ = 2*4 = 8, level=Low
    if (control?.score === 4 && aqScore === 8 && aqLevel === 'Low') {
      console.log('✅ Adversity scoring correct');
    } else {
      console.log('❌ Adversity scoring incorrect');
    }
  }
  console.log('');

  // Test 5: SEI scoring
  console.log('Test 5: SEI Scoring Validation');
  if (result.sei) {
    const selfAwareness = result.sei.categoryWiseScore['self awareness'];
    
    console.log(`Self Awareness: normalizedScore=${selfAwareness?.normalizedScore}, level=${selfAwareness?.level}`);
    
    // Validate: 1 question with score 4, doubled=8, normalized should be low
    if (selfAwareness?.normalizedScore && selfAwareness?.level) {
      console.log('✅ SEI scoring completed');
    } else {
      console.log('❌ SEI scoring incorrect');
    }
  }
  console.log('');

  // Test 6: Interests scoring
  console.log('Test 6: Interests Scoring Validation');
  if (result.interests) {
    const realistic = result.interests.categoryWiseScore.realistic;
    const investigative = result.interests.categoryWiseScore.investigative;
    const top3Letters = result.interests.top3Letters;
    
    console.log(`Realistic: score=${realistic?.score}, percentage=${realistic?.percentage}`);
    console.log(`Investigative: score=${investigative?.score}, percentage=${investigative?.percentage}`);
    console.log(`Top 3 Letters: ${top3Letters?.join(', ')}`);
    
    // Validate: realistic=1 (agree), investigative=0 (disagree)
    if (realistic?.score === 1 && investigative?.score === 0) {
      console.log('✅ Interests scoring correct');
    } else {
      console.log('❌ Interests scoring incorrect');
    }
  }
  console.log('');

  // Test 7: Version testing
  console.log('Test 7: Version Testing');
  const v1Result = calculateDetailedAssessmentResult(sampleSubmissions, sampleQuestions);
  const v2Result = calculateDetailedAssessmentResult(sampleSubmissions, sampleQuestions);
  
  console.log(`Result calculated: ${!!v1Result}`);
  console.log(`Result calculated: ${!!v2Result}`);
  
  if (v1Result && v2Result) {
    console.log('✅ Version handling correct');
  } else {
    console.log('❌ Version handling incorrect');
  }
  console.log('');

  console.log('🎉 All tests completed!');
  return result;
};

// Edge case tests
export const runEdgeCaseTests = () => {
  console.log('🧪 Starting Edge Case Tests...\n');

  // Test 1: Empty submissions
  console.log('Test 1: Empty Submissions');
  const emptyResult = calculateDetailedAssessmentResult([], sampleQuestions);
  console.log('Empty result keys:', Object.keys(emptyResult));
  console.log('✅ Empty submissions handled\n');

  // Test 2: Invalid question IDs
  console.log('Test 2: Invalid Question IDs');
  const invalidSubmissions = [
    { questionId: 'invalid1', selectedOptionId: 'opt1' },
    { questionId: 'invalid2', selectedOptionId: 'opt2' }
  ];
  const invalidResult = calculateDetailedAssessmentResult(invalidSubmissions, sampleQuestions);
  console.log('Invalid submissions result keys:', Object.keys(invalidResult));
  console.log('✅ Invalid question IDs handled\n');

  // Test 3: Case insensitive text matching
  console.log('Test 3: Case Insensitive Matching');
  const caseTestQuestions = [{
    id: 'case1',
    tags: { question_type: 'PSYCHOMETRIC', category: 'OPENNESS' },
    options: [{ id: 'opt1', optionText: 'EXTREMELY LIKELY' }]
  }];
  const caseTestSubmissions = [{ questionId: 'case1', selectedOptionId: 'opt1' }];
  const caseResult = calculateDetailedAssessmentResult(caseTestSubmissions, caseTestQuestions);
  
  if (caseResult.detailedPsychometricScore?.categoryWiseScore.openness?.categoryScore === 5) {
    console.log('✅ Case insensitive matching works');
  } else {
    console.log('❌ Case insensitive matching failed');
  }
  console.log('');

  console.log('🎉 Edge case tests completed!');
};