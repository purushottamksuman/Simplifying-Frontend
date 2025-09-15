import { CareerMapping, CareerRule } from "./types";

// Minimal illustrative rule set; extend to full 20 as needed.
export const CAREER_RULES: CareerRule[] = [
  {
    ruleName: "Engineering_Design_Rule",
    riasecCombination: "RIA",
    highOCEANTraits: "OC",
    lowOCEANTraits: "EA",
    datScoreRules: [
      { shortCode: "AR", score: 5 },
      { shortCode: "SR", score: 5 },
      { shortCode: "NA", score: 3 },
      { shortCode: "MR", score: 3 },
    ],
    ruleScore: 56,
  },
  {
    ruleName: "Medical_Health_Rule",
    riasecCombination: "RIS",
    highOCEANTraits: "CO",
    lowOCEANTraits: "NA", // N (low) and A (low)
    datScoreRules: [
      { shortCode: "VR", score: 5 },
      { shortCode: "PSA", score: 5 },
      { shortCode: "LU", score: 3 },
    ],
    ruleScore: 52,
  },
  {
    ruleName: "Business_Leadership_Rule",
    riasecCombination: "SEC",
    highOCEANTraits: "CE",
    lowOCEANTraits: "O",
    datScoreRules: [
      { shortCode: "VR", score: 5 },
      { shortCode: "PSA", score: 5 },
      { shortCode: "NA", score: 3 },
    ],
    ruleScore: 49,
  },
  // Placeholder rules to complete a 20-rule set; adjust as needed
  { ruleName: "Creative_Arts_Rule", riasecCombination: "AER", highOCEANTraits: "O", lowOCEANTraits: "C", datScoreRules: [{ shortCode: "AR", score: 3 }], ruleScore: 30 },
  { ruleName: "Education_Training_Rule", riasecCombination: "SIE", highOCEANTraits: "AE", datScoreRules: [{ shortCode: "VR", score: 5 }], ruleScore: 35 },
  { ruleName: "Finance_Analytics_Rule", riasecCombination: "CIE", highOCEANTraits: "C", datScoreRules: [{ shortCode: "NA", score: 5 }, { shortCode: "PSA", score: 3 }], ruleScore: 35 },
  { ruleName: "Law_Policy_Rule", riasecCombination: "EIS", highOCEANTraits: "C", datScoreRules: [{ shortCode: "VR", score: 5 }, { shortCode: "LU", score: 5 }], ruleScore: 40 },
  { ruleName: "IT_Software_Rule", riasecCombination: "RIA", highOCEANTraits: "C", datScoreRules: [{ shortCode: "AR", score: 5 }, { shortCode: "NA", score: 3 }], ruleScore: 40 },
  { ruleName: "Architecture_Planning_Rule", riasecCombination: "RIA", highOCEANTraits: "O", datScoreRules: [{ shortCode: "SR", score: 5 }, { shortCode: "AR", score: 5 }], ruleScore: 40 },
  { ruleName: "Media_Communication_Rule", riasecCombination: "AES", highOCEANTraits: "E", datScoreRules: [{ shortCode: "VR", score: 5 }], ruleScore: 30 },
  { ruleName: "Healthcare_Support_Rule", riasecCombination: "SIR", highOCEANTraits: "A", datScoreRules: [{ shortCode: "PSA", score: 3 }], ruleScore: 30 },
  { ruleName: "Entrepreneurship_Rule", riasecCombination: "ECR", highOCEANTraits: "E", lowOCEANTraits: "N", datScoreRules: [{ shortCode: "VR", score: 3 }, { shortCode: "PSA", score: 3 }], ruleScore: 35 },
  { ruleName: "Operations_SupplyChain_Rule", riasecCombination: "CER", highOCEANTraits: "C", datScoreRules: [{ shortCode: "PSA", score: 5 }], ruleScore: 30 },
  { ruleName: "Design_UIUX_Rule", riasecCombination: "AIR", highOCEANTraits: "O", datScoreRules: [{ shortCode: "SR", score: 3 }], ruleScore: 30 },
  { ruleName: "Data_Science_Rule", riasecCombination: "IAC", highOCEANTraits: "C", datScoreRules: [{ shortCode: "NA", score: 5 }, { shortCode: "AR", score: 5 }], ruleScore: 45 },
  { ruleName: "Public_Service_Rule", riasecCombination: "SEC", highOCEANTraits: "A", datScoreRules: [{ shortCode: "VR", score: 3 }], ruleScore: 28 },
  { ruleName: "Mechanical_Technician_Rule", riasecCombination: "RCE", datScoreRules: [{ shortCode: "MR", score: 5 }, { shortCode: "PSA", score: 3 }], ruleScore: 35 },
  { ruleName: "Civil_Engineering_Rule", riasecCombination: "RIA", highOCEANTraits: "C", datScoreRules: [{ shortCode: "SR", score: 5 }, { shortCode: "NA", score: 3 }], ruleScore: 40 },
  { ruleName: "Marketing_Sales_Rule", riasecCombination: "ESR", highOCEANTraits: "E", datScoreRules: [{ shortCode: "VR", score: 5 }, { shortCode: "PSA", score: 3 }], ruleScore: 38 },
  { ruleName: "HR_PeopleOps_Rule", riasecCombination: "SEC", highOCEANTraits: "A", datScoreRules: [{ shortCode: "VR", score: 3 }], ruleScore: 28 },
  { ruleName: "Research_Academia_Rule", riasecCombination: "IAR", highOCEANTraits: "O", datScoreRules: [{ shortCode: "AR", score: 5 }], ruleScore: 32 },
];

export const CAREER_MAPPINGS: CareerMapping[] = [
  {
    ruleName: "Engineering_Design_Rule",
    idealCareer: "Biomedical Engineer, Architect, Industrial Designer, Robotics Engineer",
    clubToJoin: "Engineering Explorers",
    idealFor: "Students with strong abstract and spatial reasoning with disciplined creativity.",
    tagLine: "Innovate Today, Engineer Tomorrow!",
  },
  {
    ruleName: "Medical_Health_Rule",
    idealCareer: "Surgeon, Microbiologist, Medical Researcher, Veterinarian",
    clubToJoin: "Medical Mavericks",
    idealFor: "Detail-focused, conscientious students with high verbal and speed-accuracy skills.",
    tagLine: "Healing Lives, Inspiring Futures!",
  },
  {
    ruleName: "Business_Leadership_Rule",
    idealCareer: "Corporate Trainer, Business Consultant, Financial Planner, HR Director",
    clubToJoin: "Business Trailblazers",
    idealFor: "Organized, outgoing leaders with strong communication and quick processing.",
    tagLine: "Master Strategies, Lead the Game!",
  },
  { ruleName: "Creative_Arts_Rule", idealCareer: "Graphic Designer, Illustrator, Art Director", clubToJoin: "Creative Collective", idealFor: "Imaginative creators with expressive skills.", tagLine: "Design the Future!" },
  { ruleName: "Education_Training_Rule", idealCareer: "Teacher, Trainer, Instructional Designer", clubToJoin: "EdVentures", idealFor: "Supportive communicators who love helping others learn.", tagLine: "Teach. Inspire. Transform." },
  { ruleName: "Finance_Analytics_Rule", idealCareer: "Financial Analyst, Auditor, Actuary", clubToJoin: "FinEdge", idealFor: "Detail-driven problem solvers with strong numeracy.", tagLine: "Numbers that Matter." },
  { ruleName: "Law_Policy_Rule", idealCareer: "Lawyer, Policy Analyst, Compliance Officer", clubToJoin: "Debate & Law Society", idealFor: "Articulate, principled thinkers with strong language skills.", tagLine: "Advocate with Impact." },
  { ruleName: "IT_Software_Rule", idealCareer: "Software Engineer, QA, DevOps", clubToJoin: "CodeCraft", idealFor: "Analytical builders who love systems.", tagLine: "Build. Break. Improve." },
  { ruleName: "Architecture_Planning_Rule", idealCareer: "Architect, Urban Planner, CAD Specialist", clubToJoin: "Design Studio", idealFor: "Spatial thinkers blending logic and aesthetics.", tagLine: "Shape Spaces, Shape Lives." },
  { ruleName: "Media_Communication_Rule", idealCareer: "Content Strategist, PR, Broadcaster", clubToJoin: "Media House", idealFor: "Expressive storytellers and presenters.", tagLine: "Tell Stories that Stick." },
  { ruleName: "Healthcare_Support_Rule", idealCareer: "Physiotherapist, Lab Tech, Radiographer", clubToJoin: "Health Hub", idealFor: "Compassionate, steady executors.", tagLine: "Care in Action." },
  { ruleName: "Entrepreneurship_Rule", idealCareer: "Founder, Product Manager, Growth Lead", clubToJoin: "Startup Garage", idealFor: "Risk-tolerant leaders with bias for action.", tagLine: "Start. Iterate. Scale." },
  { ruleName: "Operations_SupplyChain_Rule", idealCareer: "Operations Manager, SCM Analyst", clubToJoin: "Ops Guild", idealFor: "Organizers who optimize systems.", tagLine: "Make it Flow." },
  { ruleName: "Design_UIUX_Rule", idealCareer: "UI/UX Designer, Interaction Designer", clubToJoin: "UX Lab", idealFor: "Empathic designers with eye for detail.", tagLine: "Design for Delight." },
  { ruleName: "Data_Science_Rule", idealCareer: "Data Scientist, ML Engineer, Analyst", clubToJoin: "DataWorks", idealFor: "Quant thinkers who love patterns.", tagLine: "Learn from Data." },
  { ruleName: "Public_Service_Rule", idealCareer: "Civil Services, NGO Program Lead", clubToJoin: "Civic League", idealFor: "Service-minded team players.", tagLine: "Serve with Purpose." },
  { ruleName: "Mechanical_Technician_Rule", idealCareer: "Maintenance Tech, CNC Operator", clubToJoin: "Makers Lab", idealFor: "Hands-on problem solvers.", tagLine: "Fix. Fabricate. Function." },
  { ruleName: "Civil_Engineering_Rule", idealCareer: "Civil Engineer, Site Planner", clubToJoin: "Infra Club", idealFor: "Structured builders with spatial sense.", tagLine: "Build the Backbone." },
  { ruleName: "Marketing_Sales_Rule", idealCareer: "Brand Manager, Sales Lead", clubToJoin: "Growth Guild", idealFor: "Persuasive, energetic communicators.", tagLine: "Win Hearts, Win Markets." },
  { ruleName: "HR_PeopleOps_Rule", idealCareer: "HR Business Partner, Talent Lead", clubToJoin: "People Ops", idealFor: "Empathic organizers who develop others.", tagLine: "Grow People, Grow Business." },
  { ruleName: "Research_Academia_Rule", idealCareer: "Research Fellow, Lecturer", clubToJoin: "Scholars Circle", idealFor: "Curious minds who dig deep.", tagLine: "Question. Discover. Share." },
];


