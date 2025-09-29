// Assessment Result Calculation Logic
// Implements exact scoring logic to match the .NET backend

export interface QuestionSubmission {
  questionId: string;
  selectedOptionId: string;
}

export interface QuestionOption {
  id: string;
  option_text: string;
  marks: number;
}

export interface QuestionData {
  id: string;
  question_text: string;
  question_type: string;
  sub_section: {
    name: string;
    section: {
      name: string;
    };
  };
  options: QuestionOption[];
}

export interface CategoryScore {
  categoryName: string;
  categoryDisplayText: string;
  categoryLetter: string;
  categoryScore: number;
  categoryPercentage: number;
  categoryScoreLevel: string;
  categoryInterpretation: string;
  // For interests_and_preferences only:
  categoryScoreR?: number;
  categoryScoreI?: number;
  categoryScoreA?: number;
  categoryScoreS?: number;
  categoryScoreC?: number;
  categoryScoreE?: number;
}

export interface ScoreCategory {
  resultInterpretation: string;
  questionType: string;
  displayText: string;
  description: string;
  categoryWiseScore: Record<string, CategoryScore>;
}

export interface AdversityScore extends ScoreCategory {
  aqScore: number;
  aqLevel: string;
}

export interface DetailedAssessmentResult {
  detailedPsychometricScore: ScoreCategory;
  aptitudeScore: ScoreCategory;
  adversityScore: AdversityScore;
  seiScore: ScoreCategory;
  interestAndPreferenceScore: ScoreCategory;
  student?: any;
  assessmentDate: string;
  careerMapping?: any;
}

// Category mappings matching .NET backend
const CATEGORY_MAPPINGS = {
  psychometric: {
    categories: ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'],
    displayNames: {
      openness: 'Openness',
      conscientiousness: 'Conscientiousness',
      extraversion: 'Extraversion',
      agreeableness: 'Agreeableness',
      neuroticism: 'Neuroticism'
    },
    letters: {
      openness: 'O',
      conscientiousness: 'C',
      extraversion: 'E',
      agreeableness: 'A',
      neuroticism: 'N'
    }
  },
  aptitude: {
    categories: ['verbal', 'numerical', 'abstract', 'speed and accuracy', 'mechanical', 'space relations', 'language usage and grammar'],
    displayNames: {
      verbal: 'Verbal',
      numerical: 'Numerical',
      abstract: 'Abstract',
      'speed and accuracy': 'Speed and Accuracy',
      mechanical: 'Mechanical',
      'space relations': 'Space Relations',
      'language usage and grammar': 'Language Usage and Grammar'
    }
  },
  adversity: {
    categories: ['control', 'ownership', 'reach', 'endurance'],
    displayNames: {
      control: 'Control',
      ownership: 'Ownership',
      reach: 'Reach',
      endurance: 'Endurance'
    },
    letters: {
      control: 'C',
      ownership: 'O',
      reach: 'R',
      endurance: 'E'
    }
  },
  sei: {
    categories: ['self awareness', 'self management', 'social skills', 'social awareness'],
    displayNames: {
      'self awareness': 'Self Awareness',
      'self management': 'Self Management',
      'social skills': 'Social Skills',
      'social awareness': 'Social Awareness'
    },
    letters: {
      'self awareness': 'S',
      'self management': 'S',
      'social skills': 'S',
      'social awareness': 'S'
    }
  },
  interests: {
    categories: ['r vs i', 'r vs a', 'r vs s', 'r vs c', 'r vs e', 'i vs a', 'i vs s', 'i vs c', 'i vs e', 'a vs s', 'a vs c', 'a vs e', 's vs c', 's vs e', 'c vs e',],
    displayNames: {
      'r vs i': 'R vs I',
      'r vs a': 'R vs A',
      'r vs s': 'R vs S',
      'r vs c': 'R vs C',
      'r vs e': 'R vs E',
      'i vs a': 'I vs A',
      'i vs s': 'I vs S',
      'i vs c': 'I vs C',
      'i vs e': 'I vs E',
      'a vs s': 'A vs S',
      'a vs c': 'A vs C',
      'a vs e': 'A vs E',
      's vs c': 'S vs C',
      's vs e': 'S vs E',
      'c vs e': 'C vs E'
    },
    letters: {
      investigative: 'I',
      artistic: 'A',
      social: 'S',
      conventional: 'C',
      realistic: 'R',
      enterprising: 'E'
    }
  }
};

// Scoring functions matching .NET backend logic
const scorePsychometric = (optionText: string): number => {
  if (!optionText || typeof optionText !== 'string') {
    console.warn('Invalid option text for psychometric scoring:', optionText);
    return 3; // Default neutral score
  }
  
  const normalized = optionText.trim().toLowerCase();
  const scoreMap: Record<string, number> = {
    'extremely unlikely': 1,
    'unlikely': 2,
    'neutral': 3,
    'likely': 4,
    'extremely likely': 5
  };
  return scoreMap[normalized] || 3;
};

const scoreAptitude = (selectedOptionId: string, correctOptionId?: string): number => {
  return selectedOptionId === correctOptionId ? 1 : 0;
};

const scoreAdversity = (optionText: string): number => {
  if (!optionText || typeof optionText !== 'string') {
    console.warn('Invalid option text for adversity scoring:', optionText);
    return 3; // Default neutral score
  }
  
  const normalized = optionText.trim().toLowerCase();
  const scoreMap: Record<string, number> = {
    'never': 1,
    'extremely unlikely': 1,
    'almost never': 2,
    'unlikely': 2,
    'sometimes': 3,
    'neutral': 3,
    'almost always': 4,
    'likely': 4,
    'always': 5,
    'extremely likely': 5
  };
  return scoreMap[normalized] || 3;
};

const scoreSEI = (optionText: string): number => {
  if (!optionText || typeof optionText !== 'string') {
    console.warn('Invalid option text for SEI scoring:', optionText);
    return 3; // Default neutral score
  }
  
  const normalized = optionText.trim().toLowerCase();
  const scoreMap: Record<string, number> = {
    'not at all': 1,
    'never': 1,
    'slightly': 2,
    'almost never': 2,
    'fairly': 3,
    'sometimes': 3,
    'almost always': 4,
    'moderately': 4,
    'extremely': 5,
    'always': 5
  };
  return scoreMap[normalized] || 3;
};

const scoreInterests = (optionText: string): number => {
  if (!optionText || typeof optionText !== 'string') {
    console.warn('Invalid option text for interests scoring:', optionText);
    return 0;
  }
  
  return optionText.trim().toLowerCase() === 'agree' ? 1 : 0;
};

// Level determination functions matching .NET backend
const getPsychometricLevel = (score: number): string => {
  return score >= 17.5 ? 'High' : 'Low';
};

const getAptitudeLevel = (percentage: number): string => {
  if (percentage >= 77) return 'High';
  if (percentage >= 24) return 'Moderate';
  return 'Low';
};

const getAQLevel = (aqScore: number): string => {
  if (aqScore >= 178) return 'High';
  if (aqScore >= 161) return 'Moderately High';
  if (aqScore >= 135) return 'Moderate';
  if (aqScore >= 118) return 'Moderately Low';
  return 'Low';
};

const getSEILevel = (normalizedScore: number): string => {
  if (normalizedScore >= 8) return 'High';
  if (normalizedScore >= 5) return 'Moderate';
  return 'Low';
};

// SEI normalization function matching .NET backend
const normalizeSEIScore = (score: number): number => {
  if (score >= 47 && score <= 50) return 10;
  if (score >= 44 && score <= 46) return 9;
  if (score >= 41 && score <= 43) return 8;
  if (score >= 39 && score <= 40) return 7;
  if (score >= 37 && score <= 38) return 6;
  if (score >= 34 && score <= 36) return 5;
  if (score >= 31 && score <= 33) return 4;
  if (score >= 26 && score <= 30) return 3;
  if (score >= 21 && score <= 25) return 2;
  if (score >= 10 && score <= 20) return 1;
  return 0;
};

// Question per category mapping for version 2
const QUESTION_PER_CATEGORY_V2: Record<string, number> = {
  'psychometric__openness': 5,
  'psychometric__conscientiousness': 5,
  'psychometric__extraversion': 5,
  'psychometric__agreeableness': 5,
  'psychometric__neuroticism': 5,
  'aptitude__verbal': 6,
  'aptitude__numerical': 6,
  'aptitude__abstract': 6,
  'aptitude__speed and accuracy': 6,
  'aptitude__mechanical': 6,
  'aptitude__space relations': 6,
  'aptitude__language usage and grammar': 6,
  'adversity__control': 5,
  'adversity__ownership': 5,
  'adversity__reach': 5,
  'adversity__endurance': 5,
  'sei__self awareness': 5,
  'sei__self management': 5,
  'sei__social skills': 5,
  'sei__social awareness': 5,
  'interests_and_preferences__investigative': 5,
  'interests_and_preferences__artistic': 5,
  'interests_and_preferences__social': 5,
  'interests_and_preferences__conventional': 5,
  'interests_and_preferences__realistic': 5,
  'interests_and_preferences__enterprising': 5
};

// Interpretation texts matching .NET backend
const INTERPRETATIONS = {
  psychometric: {
    openness: {
      high: "You're curious and open to new experiences! You enjoy exploring new ideas, being creative, and trying different approaches to problems. This openness makes you adaptable and innovative, which is valuable in many careers that require creativity and flexibility.",
      low: "You prefer structure and routine! You feel most comfortable when things are familiar and organized. Predictability helps you stay focused and feel secure. You like clear instructions, traditional methods, and step-by-step guidance, which makes you dependable and consistent."
    },
    conscientiousness: {
      high: "You're organized and reliable! You like to plan ahead and stay on top of your responsibilities. You're the type of person others can count on to get things done well and on time. Your attention to detail and commitment to quality work are real strengths.",
      low: "You're free-spirited and adaptable! You enjoy living in the moment and going with the flow. You can adjust to new situations easily, which makes you creative and open to new experiences. While structure and planning may feel restrictive at times, a little organization can help you channel your energy more effectively."
    },
    extraversion: {
      high: "You're energetic and social! You love being around people and feel energized by social interactions. You're comfortable speaking up in groups and enjoy being the center of attention. Your enthusiasm and ability to connect with others makes you a natural leader and team player.",
      low: "You're the calm and thoughtful one! You feel most comfortable in quiet settings and enjoy meaningful, one-on-one conversations over large social events. You are a deep thinker and often reflect on your ideas before speaking."
    },
    agreeableness: {
      high: "You're caring and cooperative! You naturally put others' needs first and work well in team settings. You're empathetic and understanding, which makes you someone others feel comfortable talking to. Your ability to see different perspectives and find common ground is a valuable skill.",
      low: "You're a strong individual! You are independent, confident, and not afraid to speak your mind. You stand up for what you believe in and aren't easily influenced by others. You like to take charge and lead when necessary, making you a strong decision-maker."
    },
    neuroticism: {
      high: "You feel things deeply! You're sensitive to your environment and the emotions of others, which can be both a strength and a challenge. While you may experience stress more intensely, this sensitivity also makes you more aware and empathetic.",
      low: "You're the steady rock! You stay calm and composed even in tough situations. You handle stress well and maintain a positive outlook, making you a source of stability for yourself and those around you."
    }
  },
  aptitude: {
    verbal: {
      high: "You excel at verbal reasoning! You have strong language skills and can communicate complex ideas clearly and persuasively. Your ability to understand and use language effectively is a significant strength.",
      moderate: "You have a good understanding of language and logical thinking. You can communicate well but may sometimes need a little more time or practice to make your points clearer and more convincing.",
      low: "It's okay if you find verbal reasoning challenging—it's a skill that you can improve with practice. Try reading more books, expanding your vocabulary, and practicing speaking or writing."
    },
    numerical: {
      high: "You have excellent numerical reasoning skills! You're comfortable working with numbers, data, and mathematical concepts. This strength opens doors to many careers in business, technology, research, and management.",
      moderate: "You have a good understanding of numbers and can handle basic math problems confidently. You may need a little extra practice with more complex number patterns and data analysis.",
      low: "It's okay if you find numbers challenging—numerical skills can be improved with practice. Try working with real-world math problems, using calculators and spreadsheets, and taking courses to build your confidence."
    },
    abstract: {
      high: "You excel at abstract reasoning! You can easily see patterns, make connections between ideas, and think conceptually. This skill is valuable in many fields including science, technology, and creative problem-solving.",
      moderate: "You have good pattern recognition and logical thinking skills. With some practice, you can further develop your ability to see connections and solve complex problems that require abstract thinking.",
      low: "It's okay if you struggle with abstract reasoning or finding patterns—it's a skill that you can improve with time and practice. Try fun activities like puzzles, creative thinking exercises, or exploring new concepts."
    },
    'speed and accuracy': {
      high: "You excel at working quickly while maintaining high accuracy! This combination of speed and precision is valuable in many careers that require attention to detail and efficiency.",
      moderate: "You are quite good at paying attention to details and work at a steady pace. You can manage tasks that require accuracy but might take a little more time with complex or fast-moving tasks.",
      low: "You might need more time to complete detailed tasks, but that's okay—accuracy is often more important than speed. Focus on building your attention to detail first, then gradually work on increasing your pace."
    },
    mechanical: {
      high: "You have excellent mechanical reasoning skills! You understand how things work and can easily troubleshoot mechanical problems. This skill is valuable in engineering, manufacturing, and technical fields.",
      moderate: "You have a decent understanding of how mechanical systems work. With some hands-on practice and exposure to tools and machinery, you can further develop these skills.",
      low: "You might find it challenging to understand how machines or tools function and may need extra support to grasp these concepts. While this can seem difficult at first, it's completely normal and can be improved with practice."
    },
    'space relations': {
      high: "You have excellent spatial reasoning skills! You can easily visualize objects in three dimensions and understand how they move and fit together. This skill is valuable in architecture, engineering, design, and many technical fields.",
      moderate: "You have good spatial awareness and can visualize how objects relate to each other in space. With practice, you can further develop these skills for careers in design, architecture, or engineering.",
      low: "You might find it challenging to understand how objects fit together in space or how they move relative to one another. This skill can be developed through activities like solving puzzles, working with 3D models, or engaging in hands-on tasks."
    },
    'language usage and grammar': {
      high: "You have excellent language skills! You understand grammar, vocabulary, and proper usage very well. This strength will serve you well in careers that require clear, professional communication.",
      moderate: "You have a good grasp of language and can communicate well in most situations. Sometimes, you might struggle with complex words or sentence structures, but with a little more practice, you can improve significantly.",
      low: "You might struggle with complex language rules and grammar, but these skills can be improved with practice. Try reading more, writing regularly, and paying attention to proper grammar and usage."
    }
  },
  adversity: {
    high: "You're incredibly resilient! You handle challenges with grace and bounce back quickly from setbacks. You see obstacles as opportunities to learn and grow, and you maintain a positive attitude even in difficult situations.",
    'moderately high': "You're strong, however there's room to grow! You're already great at handling setbacks and staying resilient. When things get tough, you push through and keep moving forward.",
    moderate: "You're doing well, just keep building! You handle most of life's ups and downs well, but when faced with bigger challenges, you might feel stuck or overwhelmed. That's totally normal!",
    'moderately low': "Keep going! You're growing! You manage some setbacks well, but when life throws bigger challenges your way, it can feel harder to bounce back.",
    low: "This is just the beginning of your growth! Right now, challenges might feel overwhelming, and setbacks can seem like the end of the road. But remember—everyone starts somewhere! Building resilience takes time and effort."
  },
  sei: {
    'self awareness': {
      high: "You have excellent self-awareness! You understand your emotions, motivations, and reactions very well. This insight helps you make better decisions and manage your responses effectively.",
      moderate: "You have good self-awareness and understand your emotions most of the time. With continued practice in reflection and mindfulness, you can further develop this important skill.",
      low: "Understanding yourself can be tricky! Sometimes, emotions can feel confusing, and you may not always notice how they impact your actions. Small steps like journaling or talking to a trusted person can help."
    },
    'self management': {
      high: "You have excellent self-management skills! You can control your emotions effectively and respond to situations in a calm, thoughtful manner. This skill helps you achieve your goals and maintain good relationships.",
      moderate: "You manage your emotions reasonably well most of the time. With practice in stress management techniques and emotional regulation, you can further strengthen this skill.",
      low: "Big emotions can be tough to handle! You might find it difficult to control your emotions, especially when something upsetting or stressful happens. The good news is that self-management is a skill that can be improved!"
    },
    'social skills': {
      high: "You have excellent social skills! You communicate effectively, build relationships easily, and handle social situations with confidence. These skills are valuable in both personal and professional settings.",
      moderate: "You have decent social skills and can communicate effectively in most situations. With practice, you can become even more confident in social interactions and relationship building.",
      low: "Making connections can be tough! Expressing yourself and building relationships may sometimes feel difficult. You might struggle to join conversations, explain your ideas, or handle conflicts. The good news is that social skills can be improved with practice!"
    },
    'social awareness': {
      high: "You have excellent social awareness! You easily pick up on others' emotions and social cues, which helps you respond appropriately and build strong relationships.",
      moderate: "You have good social awareness and can usually pick up on others' emotions and social cues. With continued practice in observation and empathy, you can further develop this skill.",
      low: "Social cues can be tricky! Understanding other people's feelings might not always come easily. Sometimes, you may not realize when a friend is feeling sad or when someone needs support. But don't worry—social awareness is something you can improve!"
    }
  },
  interests: {
    investigative: "You are a Thinker! You have a natural curiosity about the world around you. You enjoy diving deep into complex ideas, asking questions, and trying to figure out how things work.",
    artistic: "You are a Creator! Your imagination knows no bounds, and creativity flows through everything you do. Whether it's through drawing, writing, music, or any other form of self-expression, you have a deep need to bring your ideas to life.",
    social: "You are a Helper! Your heart is always open to others, and you have a natural ability to understand and care for people. Whether it's offering advice, lending a helping hand, or simply being there for someone, you have a strong desire to make a positive impact.",
    conventional: "You are an Organizer! You're someone who loves structure and order. You thrive in environments where things are planned out, organized, and clearly defined. You pay attention to the smallest details, and you take pride in keeping things in order.",
    realistic: "You are a Doer! You are someone who loves to get things done with your hands. Whether it's fixing a broken item, building something new, or solving a practical challenge, you feel most fulfilled when you can work physically.",
    enterprising: "You are a Persuader! You have a natural charisma and confidence that draws people in. You're someone who loves to set big goals and works hard to achieve them. You have the ability to inspire and motivate others to take action."
  }
};

// Career mappings matching .NET backend
const CAREER_MAPPINGS = [
  {
    ruleName: "Rule1",
    idealCareer: "Biomedical Engineer, Architect, Industrial Designer, Robotics Engineer, Aerospace Engineer, Automotive Designer, UX Designer, Marine Biologist, Forensic Scientist, Environmental Scientist",
    clubToJoin: "Engineering Explorers",
    idealFor: "Students with high logical and spatial aptitude, a problem-solving mindset, and an interest in technology and innovation.",
    tagLine: "Innovate Today, Engineer Tomorrow!"
  },
  {
    ruleName: "Rule2",
    idealCareer: "Surgeon, Microbiologist, Geologist, Geneticist, Medical Researcher, Ecologist, Pharmacologist, Biomedical Engineer, Physical Therapist, Veterinarian, Athletic Trainer, Science Teacher, Wildlife Biologist, Sports Medicine Specialist",
    clubToJoin: "Medical Mavericks",
    idealFor: "Students interested in healthcare, medical research, and contributing to life-changing advancements.",
    tagLine: "Healing Lives, Inspiring Futures!"
  },
  {
    ruleName: "Rule3",
    idealCareer: "Biomedical Engineer, Aerospace Engineer, Cybersecurity Analyst, Technical Sales Engineer, Entrepreneur (Tech/Engineering Field), Operations Manager (Manufacturing/Tech), Data Scientist, Technology Consultant",
    clubToJoin: "Engineering Explorers",
    idealFor: "Students with high logical and spatial aptitude, a problem-solving mindset, and an interest in technology and innovation.",
    tagLine: "Innovate Today, Engineer Tomorrow!"
  },
  {
    ruleName: "Rule4",
    idealCareer: "Mechanical Engineer, Industrial Engineer, Software Developer, Civil Engineer, Operations Analyst, Statistician, Data Analyst, Quality Control Engineer, IT Systems Analyst, Financial Analyst, Quality Control Manager, Supply Chain Manager",
    clubToJoin: "Engineering Explorers",
    idealFor: "Students with high logical and spatial aptitude, a problem-solving mindset, and an interest in technology and innovation.",
    tagLine: "Innovate Today, Engineer Tomorrow!"
  },
  {
    ruleName: "Rule5",
    idealCareer: "Physical Therapist, Occupational Therapist, Art Therapist, Counselor, Nurse, Music Therapist, Teacher (Art, Music, or Special Education), Social Worker, Fashion Designer",
    clubToJoin: "Medical Mavericks",
    idealFor: "Students interested in healthcare, medical research, and contributing to life-changing advancements.",
    tagLine: "Healing Lives, Inspiring Futures!"
  },
  {
    ruleName: "Rule6",
    idealCareer: "Creative Director, Fashion Designer, Event Manager, Interior Designer, Film Producer/Director, Advertising Executive, Real Estate Developer, Film Director, Event Planner, Entrepreneur (Creative/Design-Based Business)",
    clubToJoin: "Artistic Visionaries",
    idealFor: "Students with high creativity, artistic interests, and openness to experimentation.",
    tagLine: "Create, Express, Inspire – The Future is Yours!"
  },
  {
    ruleName: "Rule7",
    idealCareer: "Graphic Designer, Multimedia Artist, Jewelry Designer, Web Designer, Art Conservator, Animation Specialist, Interior Designer",
    clubToJoin: "Artistic Visionaries",
    idealFor: "Students with high creativity, artistic interests, and openness to experimentation.",
    tagLine: "Create, Express, Inspire – The Future is Yours!"
  },
  {
    ruleName: "Rule8",
    idealCareer: "Sports Coach, Emergency Services Manager, Fitness Trainer/Personal Trainer, Hospitality Manager, Nutritionist, Entrepreneur (Health, Wellness, or Trades)",
    clubToJoin: "Medical Mavericks",
    idealFor: "Students interested in healthcare, medical research, and contributing to life-changing advancements.",
    tagLine: "Healing Lives, Inspiring Futures!"
  },
  {
    ruleName: "Rule9",
    idealCareer: "IPS, IAS, Medical Assistant, Teacher (Technical or Vocational Subjects), Human Resources Specialist, Administrative Supervisor (Healthcare, Government, or Social Work), Social Worker, Occupational Health and Safety Officer, Community Organizer, Customer Support Manager",
    clubToJoin: "Administrative Achievers",
    idealFor: "Students with strong communication skills, an interest in public affairs, and a passion for leadership and community impact.",
    tagLine: "Lead with Integrity, Govern with Impact!"
  },
  {
    ruleName: "Rule10",
    idealCareer: "Operations Manager, Supply Chain Manager, IPS, IAS, Defence Services, Administrative Service, Bank Branch Manager",
    clubToJoin: "Administrative Achievers",
    idealFor: "Students with strong communication skills, an interest in public affairs, and a passion for leadership and community impact.",
    tagLine: "Lead with Integrity, Govern with Impact!"
  },
  {
    ruleName: "Rule11",
    idealCareer: "Healthcare Administrator, Public Health Specialist, Science or Medical Journalist, Health Policy Analyst, Public Health Consultant, Career Coach, Medical Consultant, Psychologist, Management Consultant (Healthcare, Education, or Research-focused), Market Research Analyst, Data Science Consultant, Educational Consultant",
    clubToJoin: "Medical Mavericks",
    idealFor: "Students interested in healthcare, medical research, and contributing to life-changing advancements.",
    tagLine: "Healing Lives, Inspiring Futures!"
  },
  {
    ruleName: "Rule12",
    idealCareer: "Clinical Psychologist, Human Resources Specialist, Healthcare Administrator, Social Worker (Research & Policy Focused), Public Health Analyst, Educational Program Coordinator, Compliance Officer (Healthcare, Education, or Social Services), Educational Policy Maker, Academic Advisor",
    clubToJoin: "Administrative Achievers",
    idealFor: "Students with strong communication skills, an interest in public affairs, and a passion for leadership and community impact.",
    tagLine: "Lead with Integrity, Govern with Impact!"
  },
  {
    ruleName: "Rule13",
    idealCareer: "Actuary, Business Intelligence Analyst, Market Research Analyst, Risk Analyst, Supply Chain Manager, Investment Banker, Data Analyst, Financial Analyst, Economist",
    clubToJoin: "Business Trailblazers",
    idealFor: "Students with a knack for numbers, strong analytical skills, and an interest in exploring innovative financial strategies.",
    tagLine: "Master Strategies, Lead the Game!"
  },
  {
    ruleName: "Rule14",
    idealCareer: "Psychologist, Science Communicator, Medical Researcher, Speech-Language Pathologist, Museum Curator, Cognitive Scientist, Speech Therapist, Public Health Educator, Human-Centered Researcher (UX, Behavioral Science, Sociology)",
    clubToJoin: "Medical Mavericks",
    idealFor: "Students interested in healthcare, medical research, and contributing to life-changing advancements.",
    tagLine: "Healing Lives, Inspiring Futures!"
  },
  {
    ruleName: "Rule15",
    idealCareer: "Tech Startup Founder, AI Researcher, Biotech Entrepreneur, Innovation Consultant",
    clubToJoin: "Entrepreneurship League",
    idealFor: "Students with a passion for innovation, leadership, and turning ideas into successful ventures.",
    tagLine: "Dream, Build, Lead – Shape the World!"
  },
  {
    ruleName: "Rule16",
    idealCareer: "Data Visualization Expert, UX Researcher, Technical Writer, Forensic Analyst, Interior Designer, Fashion Designer",
    clubToJoin: "Engineering Explorers",
    idealFor: "Students with high logical and spatial aptitude, a problem-solving mindset, and an interest in technology and innovation.",
    tagLine: "Innovate Today, Engineer Tomorrow!"
  },
  {
    ruleName: "Rule17",
    idealCareer: "Editor, Art Teacher, Career Counselor, Public Relations Specialist, Event Planner, Teacher (Arts, Literature, Music), HR Manager",
    clubToJoin: "Administrative Achievers",
    idealFor: "Students with strong communication skills, an interest in public affairs, and a passion for leadership and community impact.",
    tagLine: "Lead with Integrity, Govern with Impact!"
  },
  {
    ruleName: "Rule18",
    idealCareer: "Public Relations Specialist, Marketing Manager, Social Media Strategist, Advertising Executive, Motivational Speaker, Political Campaign Manager, Podcast Producer, Event Host, Arts Administrator / Creative Director",
    clubToJoin: "Business Trailblazers",
    idealFor: "Students with a knack for numbers, strong analytical skills, and an interest in exploring innovative financial strategies.",
    tagLine: "Master Strategies, Lead the Game!"
  },
  {
    ruleName: "Rule19",
    idealCareer: "Corporate Trainer, Business Consultant, Financial Planner, Financial Advisor, Bank Manager, Management Analyst, HR Director, Sales Manager, School Administrator, Public Relations Manager, Project manager",
    clubToJoin: "Business Trailblazers",
    idealFor: "Students with a knack for numbers, strong analytical skills, and an interest in exploring innovative financial strategies.",
    tagLine: "Master Strategies, Lead the Game!"
  },
  {
    ruleName: "Rule20",
    idealCareer: "Creative Director, Advertising Director, Product Designer, Brand Manager, Art Director, Marketing Executive, Media Planner, Fashion Brand Strategist, Corporate Branding Consultant",
    clubToJoin: "Business Trailblazers",
    idealFor: "Students with a knack for numbers, strong analytical skills, and an interest in exploring innovative financial strategies.",
    tagLine: "Master Strategies, Lead the Game!"
  }
];

// Main calculation function
export const calculateDetailedAssessmentResult = (
  submissions: QuestionSubmission[],
  questions: QuestionData[],
  studentData?: any
): DetailedAssessmentResult => {
  
  console.log('Starting assessment calculation with:', {
    submissions: submissions.length,
    questions: questions.length,
    studentData
  });

  // Validate input data
  if (!submissions || submissions.length === 0) {
    throw new Error('No submissions provided for calculation');
  }
  
  if (!questions || questions.length === 0) {
    throw new Error('No questions provided for calculation');
  }

  // Create question lookup
  const questionMap = new Map<string, QuestionData>();
  questions.forEach(q => {
    if (q && q.id) {
      questionMap.set(q.id, q);
    }
  });

  console.log('Question map created with', questionMap.size, 'questions');

  // Filter valid submissions
  const validSubmissions = submissions.filter(sub => 
    sub && sub.questionId && sub.selectedOptionId && questionMap.has(sub.questionId)
  );

  console.log('Valid submissions:', validSubmissions.length);

  // Group submissions by question type
  const submissionsByType = new Map<string, QuestionSubmission[]>();
  validSubmissions.forEach(sub => {
    const question = questionMap.get(sub.questionId);
    if (!question || !question.sub_section || !question.sub_section.section) {
      console.warn('Question missing section data:', sub.questionId);
      return;
    }

    const questionType = mapQuestionType(question);
    
    if (!submissionsByType.has(questionType)) {
      submissionsByType.set(questionType, []);
    }
    submissionsByType.get(questionType)!.push(sub);
  });

  console.log('Submissions by type:', Object.fromEntries(submissionsByType.entries().map(([k, v]) => [k, v.length])));

  // Calculate each section
  const detailedPsychometricScore = calculatePsychometricScore(
    submissionsByType.get('psychometric') || [],
    questionMap
  );

  const aptitudeScore = calculateAptitudeScore(
    submissionsByType.get('aptitude') || [],
    questionMap
  );

  const adversityScore = calculateAdversityScore(
    submissionsByType.get('adversity') || [],
    questionMap
  );

  const seiScore = calculateSEIScore(
    submissionsByType.get('sei') || [],
    questionMap
  );

  const interestAndPreferenceScore = calculateInterestScore(
    submissionsByType.get('interests_and_preferences') || [],
    questionMap
  );

  // Generate career mapping
  const careerMapping = generateCareerMapping(
    aptitudeScore,
    detailedPsychometricScore,
    interestAndPreferenceScore
  );

  return {
    detailedPsychometricScore,
    aptitudeScore,
    adversityScore,
    seiScore,
    interestAndPreferenceScore,
    student: studentData,
    assessmentDate: new Date().toISOString(),
    careerMapping
  };
};

// Map question to assessment type based on section and sub-section
function mapQuestionType(question: QuestionData): string {
  const sectionName = question.sub_section.section.name.toLowerCase();
  const subSectionName = question.sub_section.name.toLowerCase();

  if (sectionName === 'behavioural') {
    if (subSectionName.includes('leadership') || subSectionName.includes('teamwork') || 
        subSectionName.includes('communication') || subSectionName.includes('problem solving') || 
        subSectionName.includes('adaptability')) {
      return 'psychometric';
    } else if (subSectionName.includes('time management')) {
      return 'adversity';
    } else if (subSectionName.includes('emotional') || subSectionName.includes('social') ||
               subSectionName.includes('self awareness') || subSectionName.includes('self management') ||
               subSectionName.includes('social skills') || subSectionName.includes('social awareness')) {
      return 'sei';
    } else if (subSectionName.includes('r vs i') || subSectionName.includes('r vs a') ||
               subSectionName.includes('r vs a') || subSectionName.includes('r vs s') ||
               subSectionName.includes('r vs e') || subSectionName.includes('r vs c') ||
               subSectionName.includes('i vs a') ||
               subSectionName.includes('i vs s') || subSectionName.includes('i vs e') ||
               subSectionName.includes('i vs c') || subSectionName.includes('a vs s') ||
               subSectionName.includes('a vs e') || subSectionName.includes('a vs c') ||
               subSectionName.includes('s vs e') || subSectionName.includes('s vs c') ||
               subSectionName.includes('e vs c')) {
      return 'interests_and_preferences';
    } else {
      return 'psychometric'; // Default for behavioral
    }
  } else if (sectionName === 'aptitude') {
    return 'aptitude';
  }

  return 'psychometric'; // Default fallback
}

// Map sub-section to category
function mapSubSectionToCategory(subSectionName: string, questionType: string): string {
  const normalized = subSectionName.toLowerCase().trim();

  console.log(`Mapping sub-section "${subSectionName}" for question type "${questionType}"`);
  console.log('Normalized sub-section:', normalized);
  
  switch (questionType) {
    case 'psychometric':
      if (normalized.includes('leadership')) return 'extraversion';
      if (normalized.includes('teamwork')) return 'agreeableness';
      if (normalized.includes('communication')) return 'extraversion';
      if (normalized.includes('problem solving')) return 'openness';
      if (normalized.includes('adaptability')) return 'openness';
      return 'conscientiousness'; // Default
      
    case 'aptitude':
      if (normalized.includes('verbal')) return 'verbal';
      if (normalized.includes('numerical')) return 'numerical';
      if (normalized.includes('logical')) return 'abstract';
      if (normalized.includes('abstract')) return 'abstract';
      if (normalized.includes('spatial')) return 'space relations';
      return 'verbal'; // Default
      
    case 'adversity':
      if (normalized.includes('control')) return 'control';
      if (normalized.includes('ownership')) return 'ownership';
      if (normalized.includes('reach')) return 'reach';
      if (normalized.includes('endurance')) return 'endurance';
      if (normalized.includes('time management')) return 'control';
      return 'control'; // Default
      
    case 'sei':
      if (normalized.includes('self awareness')) return 'self awareness';
      if (normalized.includes('self management')) return 'self management';
      if (normalized.includes('social skills')) return 'social skills';
      if (normalized.includes('social awareness')) return 'social awareness';
      return 'self awareness'; // Default
      
    case 'interests_and_preferences':
      // if (normalized.includes('investigative')) return 'investigative';
      // if (normalized.includes('artistic')) return 'artistic';
      // if (normalized.includes('social')) return 'social';
      // if (normalized.includes('conventional')) return 'conventional';
      // if (normalized.includes('realistic')) return 'realistic';
      // if (normalized.includes('enterprising')) return 'enterprising';
      // return 'realistic'; // Default
      return normalized;
      
    default:
      return 'general';
  }
}

function calculatePsychometricScore(submissions: QuestionSubmission[], questionMap: Map<string, QuestionData>): ScoreCategory {
  const categoryScores: Record<string, number> = {};
  
  // Initialize categories
  CATEGORY_MAPPINGS.psychometric.categories.forEach(cat => {
    categoryScores[cat] = 0;
  });

  // Calculate scores
  submissions.forEach(sub => {
    const question = questionMap.get(sub.questionId);
    if (!question) return;

    const category = mapSubSectionToCategory(question.sub_section.name, 'psychometric');
    
    if (CATEGORY_MAPPINGS.psychometric.categories.includes(category)) {
      const selectedOption = question.options.find(opt => opt.id === sub.selectedOptionId);
      if (selectedOption) {
        // Use database marks if available, otherwise use text scoring
        if (selectedOption.marks && selectedOption.marks > 0) {
          categoryScores[category] += selectedOption.marks;
        } else {
          categoryScores[category] += scorePsychometric(selectedOption.option_text);
        }
      }
    }
  });

  // Build category-wise scores
  const categoryWiseScore: Record<string, CategoryScore> = {};
  CATEGORY_MAPPINGS.psychometric.categories.forEach(cat => {
    const score = categoryScores[cat];
    const percentage = (score / 25.0) * 100; // Max 25 per category (5 questions × 5 points)
    const level = getPsychometricLevel(score);
    
    categoryWiseScore[cat] = {
      categoryName: cat,
      categoryDisplayText: CATEGORY_MAPPINGS.psychometric.displayNames[cat],
      categoryLetter: CATEGORY_MAPPINGS.psychometric.letters[cat],
      categoryScore: score,
      categoryPercentage: percentage,
      categoryScoreLevel: level,
      categoryInterpretation: INTERPRETATIONS.psychometric[cat][level.toLowerCase()] || ""
    };
  });

  // Generate overall interpretation
  const resultInterpretation = CATEGORY_MAPPINGS.psychometric.categories
    .map(cat => categoryWiseScore[cat].categoryInterpretation)
    .join('\n');

  return {
    resultInterpretation,
    questionType: "psychometric",
    displayText: "Psychometric",
    description: "",
    categoryWiseScore
  };
}

function calculateAptitudeScore(submissions: QuestionSubmission[], questionMap: Map<string, QuestionData>): ScoreCategory {
  const categoryScores: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  
  // Initialize categories
  CATEGORY_MAPPINGS.aptitude.categories.forEach(cat => {
    categoryScores[cat] = 0;
    categoryCounts[cat] = 0;
  });

  // Calculate scores
  submissions.forEach(sub => {
    const question = questionMap.get(sub.questionId);
    if (!question) return;

    const category = mapSubSectionToCategory(question.sub_section.name, 'aptitude');
    
    if (CATEGORY_MAPPINGS.aptitude.categories.includes(category)) {
      const selectedOption = question.options.find(opt => opt.id === sub.selectedOptionId);
      if (selectedOption) {
        // For aptitude, score 1 if marks > 0 (correct answer)
        if (selectedOption.marks && selectedOption.marks > 0) {
          categoryScores[category] += 1;
        }
        categoryCounts[category]++;
      }
    }
  });

  // Build category-wise scores
  const categoryWiseScore: Record<string, CategoryScore> = {};
  CATEGORY_MAPPINGS.aptitude.categories.forEach(cat => {
    const score = categoryScores[cat];
    const totalQuestions = categoryCounts[cat];
    const maxQuestions = QUESTION_PER_CATEGORY_V2[`aptitude__${cat}`] || totalQuestions;
    const percentage = maxQuestions > 0 ? (score / maxQuestions) * 100 : 0;
    const level = getAptitudeLevel(percentage);
    
    categoryWiseScore[cat] = {
      categoryName: cat,
      categoryDisplayText: CATEGORY_MAPPINGS.aptitude.displayNames[cat],
      categoryLetter: "",
      categoryScore: score,
      categoryPercentage: Math.round(percentage * 100) / 100,
      categoryScoreLevel: level,
      categoryInterpretation: INTERPRETATIONS.aptitude[cat][level.toLowerCase()] || ""
    };
  });

  // Generate overall interpretation
  const resultInterpretation = CATEGORY_MAPPINGS.aptitude.categories
    .map(cat => {
      const level = categoryWiseScore[cat].categoryScoreLevel.toLowerCase();
      const categoryName = CATEGORY_MAPPINGS.aptitude.displayNames[cat];
      return `You have scored ${level} in ${categoryName}, ${INTERPRETATIONS.aptitude[cat][level] || ''}`;
    })
    .join('\n');

  return {
    resultInterpretation,
    questionType: "aptitude",
    displayText: "Aptitude (IQ)",
    description: "",
    categoryWiseScore
  };
}

function calculateAdversityScore(submissions: QuestionSubmission[], questionMap: Map<string, QuestionData>): AdversityScore {
  const categoryScores: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  
  // Initialize categories
  CATEGORY_MAPPINGS.adversity.categories.forEach(cat => {
    categoryScores[cat] = 0;
    categoryCounts[cat] = 0;
  });

  // Calculate scores
  submissions.forEach(sub => {
    const question = questionMap.get(sub.questionId);
    if (!question) return;

    const category = mapSubSectionToCategory(question.sub_section.name, 'adversity');
    
    if (CATEGORY_MAPPINGS.adversity.categories.includes(category)) {
      const selectedOption = question.options.find(opt => opt.id === sub.selectedOptionId);
      if (selectedOption) {
        // Use database marks if available, otherwise use text scoring
        if (selectedOption.marks && selectedOption.marks > 0) {
          categoryScores[category] += selectedOption.marks;
        } else {
          categoryScores[category] += scoreAdversity(selectedOption.option_text);
        }
        categoryCounts[category]++;
      }
    }
  });

  // Calculate AQ Score (2 × sum of category scores)
  const totalCategoryScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0);
  const aqScore = 2 * totalCategoryScore;
  const aqLevel = getAQLevel(aqScore);

  // Build category-wise scores with CORE ordering
  const categoryWiseScore: Record<string, CategoryScore> = {};
  const orderedCategories = ['control', 'ownership', 'reach', 'endurance']; // CORE order
  
  orderedCategories.forEach(cat => {
    const score = categoryScores[cat] || 0;
    const questionCount = categoryCounts[cat] || 0;
    const maxScore = questionCount * 5; // Max 5 per question
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    
    categoryWiseScore[cat] = {
      categoryName: cat,
      categoryDisplayText: CATEGORY_MAPPINGS.adversity.displayNames[cat],
      categoryLetter: CATEGORY_MAPPINGS.adversity.letters[cat],
      categoryScore: score,
      categoryPercentage: Math.round(percentage * 100) / 100,
      categoryScoreLevel: "",
      categoryInterpretation: ""
    };
  });

  return {
    resultInterpretation: INTERPRETATIONS.adversity[aqLevel.toLowerCase().replace(' ', '_')] || INTERPRETATIONS.adversity.low,
    aqScore,
    aqLevel,
    questionType: "adversity",
    displayText: "Adversity Quotient",
    description: "",
    categoryWiseScore
  };
}

function calculateSEIScore(submissions: QuestionSubmission[], questionMap: Map<string, QuestionData>): ScoreCategory {
  const categoryScores: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  
  // Initialize categories
  CATEGORY_MAPPINGS.sei.categories.forEach(cat => {
    categoryScores[cat] = 0;
    categoryCounts[cat] = 0;
  });

  // Calculate scores
  submissions.forEach(sub => {
    const question = questionMap.get(sub.questionId);
    if (!question) return;

    const category = mapSubSectionToCategory(question.sub_section.name, 'sei');
    
    if (CATEGORY_MAPPINGS.sei.categories.includes(category)) {
      const selectedOption = question.options.find(opt => opt.id === sub.selectedOptionId);
      if (selectedOption) {
        // Use database marks if available, otherwise use text scoring
        if (selectedOption.marks && selectedOption.marks > 0) {
          categoryScores[category] += selectedOption.marks;
        } else {
          categoryScores[category] += scoreSEI(selectedOption.option_text);
        }
        categoryCounts[category]++;
      }
    }
  });

  // Build category-wise scores with normalization
  const categoryWiseScore: Record<string, CategoryScore> = {};
  CATEGORY_MAPPINGS.sei.categories.forEach(cat => {
    const rawScore = categoryScores[cat];
    const questionCount = categoryCounts[cat];
    const maxRawScore = questionCount * 5; // Max 5 per question
    const normalizedScore = normalizeSEIScore(rawScore * 2); // Double then normalize
    const percentage = maxRawScore > 0 ? (rawScore / maxRawScore) * 100 : 0;
    const level = getSEILevel(normalizedScore);
    
    categoryWiseScore[cat] = {
      categoryName: cat,
      categoryDisplayText: CATEGORY_MAPPINGS.sei.displayNames[cat],
      categoryLetter: CATEGORY_MAPPINGS.sei.letters[cat],
      categoryScore: normalizedScore,
      categoryPercentage: Math.round(percentage * 100) / 100,
      categoryScoreLevel: level,
      categoryInterpretation: INTERPRETATIONS.sei[cat][level.toLowerCase()] || ""
    };
  });

  return {
    resultInterpretation: CATEGORY_MAPPINGS.sei.categories
      .map(cat => categoryWiseScore[cat].categoryInterpretation)
      .join('\n'),
    questionType: "sei",
    displayText: "Socio-Economical Intelligence (SEI)",
    description: "",
    categoryWiseScore
  };
}

function calculateInterestScore(
  submissions: QuestionSubmission[],
  questionMap: Map<string, QuestionData>
): ScoreCategory {
  // Initialize type scores (R, I, A, S, C, E)
  const typeScores: Record<string, number> = {
    r: 0, i: 0, a: 0, s: 0, c: 0, e: 0
  };

  // Initialize category scores
  const categoryWiseScore: Record<string, CategoryScore> = {};
  CATEGORY_MAPPINGS.interests.categories.forEach(cat => {
    categoryWiseScore[cat] = {
      categoryName: cat,
      categoryDisplayText: CATEGORY_MAPPINGS.interests.displayNames[cat],
      categoryLetter: "", // keeping consistent with earlier
      categoryScore: 0,   // total attempts under this category
      categoryPercentage: 0,
      categoryScoreLevel: "",
      categoryInterpretation: INTERPRETATIONS.interests[cat] || "",
      // new detailed counts
      categoryScoreR: 0,
      categoryScoreI: 0,
      categoryScoreA: 0,
      categoryScoreS: 0,
      categoryScoreC: 0,
      categoryScoreE: 0,
    };
  });

  // Process submissions
  submissions.forEach(sub => {

    //console.log('Processing submission:', sub);
    const question = questionMap.get(sub.questionId);
    //console.log('Mapped question:', question);
    if (!question) return;

    // Category is like "r vs i"
    const category = mapSubSectionToCategory(
      question.sub_section.name,
      "interests_and_preferences"
    );
    // console.log("Mapped category:", category);
    if (!CATEGORY_MAPPINGS.interests.categories.includes(category)) return;

    const selectedOption = question.options.find(
      opt => opt.id === sub.selectedOptionId
    );
    if (!selectedOption) return;

    const type = selectedOption.type?.toLowerCase(); // 'r' | 'i' | 'a' | 's' | 'c' | 'e'
    if (!type || !(type in typeScores)) return;

    // increment type score
    typeScores[type]++;

    console.log("incrementing type score:", { type, currentScore: typeScores[type] });

    // increment inside category
    switch (type) {
      case "r": categoryWiseScore[category].categoryScoreR++; break;
      case "i": categoryWiseScore[category].categoryScoreI++; break;
      case "a": categoryWiseScore[category].categoryScoreA++; break;
      case "s": categoryWiseScore[category].categoryScoreS++; break;
      case "c": categoryWiseScore[category].categoryScoreC++; break;
      case "e": categoryWiseScore[category].categoryScoreE++; break;
    }

    // increment total attempts
    categoryWiseScore[category].categoryScore++;
  });

  // --- Tie-breaking helper ---
  function resolveTie(candidates: string[], needed: number): string[] {
    if (candidates.length <= needed) return candidates;

    // head-to-head wins count
    const wins: Record<string, number> = {};
    candidates.forEach(t => (wins[t] = 0));

    for (let i = 0; i < candidates.length; i++) {
      for (let j = i + 1; j < candidates.length; j++) {
        const t1 = candidates[i], t2 = candidates[j];
        const pair = [t1, t2].sort().join(" vs ");
        const catScore = categoryWiseScore[pair];

        if (catScore) {
          const score1 = catScore[`categoryScore${t1.toUpperCase() as "R"}`];
          const score2 = catScore[`categoryScore${t2.toUpperCase() as "R"}`];
          if (score1 > score2) wins[t1]++; else if (score2 > score1) wins[t2]++;
        }
      }
    }

    return candidates
      .sort((a, b) => wins[b] - wins[a])
      .slice(0, needed);
  }

  // --- Pick top 3 ---
  const sortedTypes = Object.entries(typeScores).sort((a, b) => b[1] - a[1]);
  const topThree: string[] = [];
  let i = 0;
  while (topThree.length < 3 && i < sortedTypes.length) {
    const score = sortedTypes[i][1];
    const tied = sortedTypes
      .filter(entry => entry[1] === score)
      .map(entry => entry[0]);

    if (topThree.length + tied.length <= 3) {
      topThree.push(...tied);
    } else {
      const resolved = resolveTie(tied, 3 - topThree.length);
      topThree.push(...resolved);
    }
    i += tied.length;
  }

  // Build result interpretation (like earlier)
  const resultInterpretation = CATEGORY_MAPPINGS.interests.categories
    .map(cat => categoryWiseScore[cat].categoryInterpretation)
    .join("\n");

  return {
    resultInterpretation,
    questionType: "interests_and_preferences",
    displayText: "Interest And Preference",
    description: "",
    categoryWiseScore,
    // exposing extra info (safe to add, won’t break earlier pattern)
    typeScores,
    topThree
  };
}


function generateCareerMapping(
  aptitudeScore: ScoreCategory,
  psychometricScore: ScoreCategory,
  interestScore: ScoreCategory
): any {
  // Get top interest category
  const interestCategories = Object.entries(interestScore.categoryWiseScore)
    .sort(([,a], [,b]) => b.categoryScore - a.categoryScore);
  
  const topInterest = interestCategories[0]?.[0] || 'realistic';
  
  // Get psychometric traits
  const psychometricCategories = Object.entries(psychometricScore.categoryWiseScore)
    .sort(([,a], [,b]) => b.categoryScore - a.categoryScore);
  
  const topPsychometric = psychometricCategories[0]?.[0] || 'conscientiousness';
  
  // Simple rule selection based on top interest and psychometric trait
  let selectedRule = "Rule8"; // Default to Rule8
  
  if (topInterest === 'investigative') {
    selectedRule = "Rule2";
  } else if (topInterest === 'artistic') {
    selectedRule = "Rule6";
  } else if (topInterest === 'social') {
    selectedRule = "Rule5";
  } else if (topInterest === 'enterprising') {
    selectedRule = "Rule19";
  } else if (topInterest === 'conventional') {
    selectedRule = "Rule13";
  } else if (topInterest === 'realistic') {
    if (topPsychometric === 'openness') {
      selectedRule = "Rule1";
    } else if (topPsychometric === 'conscientiousness') {
      selectedRule = "Rule4";
    } else {
      selectedRule = "Rule8";
    }
  }

  const careerMapping = CAREER_MAPPINGS.find(cm => cm.ruleName === selectedRule) || CAREER_MAPPINGS[7]; // Default to Rule8

  return {
    ruleName: careerMapping.ruleName,
    idealCareer: careerMapping.idealCareer,
    topLine: "Every person has a unique mix of strengths, interests, and talents that shape how they think, work, and connect with the world. Your results highlight what makes you tick—how you approach challenges, make decisions, and thrive in different environments. Let's dive into what makes you, you!",
    clubToJoin: careerMapping.clubToJoin,
    tagLine: careerMapping.tagLine,
    idealFor: careerMapping.idealFor
  };
}