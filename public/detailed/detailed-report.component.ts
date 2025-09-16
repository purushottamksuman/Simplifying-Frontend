import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractCategoryType, AssessmentService, CategoryScore, DetailAssessmentResult, LanguageUsageAndGrammarCategoryType, MappedResult, MechanicalCategoryType, NumericalCategoryType, SpaceRelationsCategoryType, SpeedAndAccuracyCategoryType, SpellingsCategoryType } from '@ss/assessment';

@Component({
  selector: 'app-detailed-report',
  templateUrl: './detailed-report.component.html',
  styleUrl: './detailed-report.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class DetailedReportComponent implements OnInit, OnDestroy {
  detailedReport!: DetailAssessmentResult;
  constructor(
    private renderer: Renderer2,
    private assessmentService: AssessmentService,
    private route: ActivatedRoute
  ) {}

  careerMapping!: MappedResult;
  aptiCategoryWiseScores: { category: string; scoreObject: CategoryScore }[] =
    [];
  aptitudeDescriptions = {
    VerbalCategoryType:
      'Per your results, you have scored highest in Verbal Reasoning, which reflects your ability to understand, analyze, and draw conclusions from complex written or verbal information. This aptitude is essential for roles that require strategic thinking, clear communication, and problem-solving, making you well-suited for leadership and analytical positions.',
    SpeedAndAccuracyCategoryType:
      'Per your results, you have scored highest in Perceptual Speed and Accuracy, which indicates a strong ability to process and interpret information quickly and with precision. This skill is vital for careers where attention to detail, efficiency, and quick decision-making are key to success, such as in medical, technical, or research-oriented roles.',
    SpellingsCategoryType:
      'Per your results, you have scored highest in Spelling, which highlights your attention to detail, language precision, and ability to work accurately with textual information. This skill is critical in careers requiring strong written communication, editing, and accuracy, such as writing, journalism, and administrative roles.',
    LanguageUsageAndGrammarCategoryType:
      'Per your results, you have scored highest in Language Usage, demonstrating strong verbal and written communication skills. This aptitude is essential for roles requiring storytelling, persuasion, and the ability to express ideas effectively, making it ideal for creative, managerial, or teaching roles.',
    NumericalCategoryType:
      'Per your results, you have scored highest in Numerical Reasoning, which indicates an aptitude for working with numbers, analyzing data, and solving quantitative problems. These skills are fundamental for careers in business, finance, engineering, and analytical fields that require logical thinking and precision.',
    AbstractCategoryType:
      'Per your results, you have scored highest in Abstract Reasoning, highlighting your ability to think conceptually, identify patterns, and solve problems creatively. This skill is highly valued in roles that require strategic thinking, innovation, and the capacity to handle complex scenarios, such as in design, engineering, or leadership positions.',
    MechanicalCategoryType:
      'Per your results, you have scored highest in Mechanical Reasoning, which reflects your understanding of physical principles, systems, and structures. This aptitude is key for technical roles in engineering, robotics, and other fields where practical problem-solving and technical knowledge are essential.',
    SpaceRelationsCategoryType:
      'Per your results, you have scored highest in Space Relations, demonstrating strong spatial awareness and the ability to visualize and manipulate objects in three dimensions. This aptitude is ideal for careers in design, architecture, engineering, or creative arts, where visualizing concepts and precision are critical for success.',
  };
  topAptiCategoryWiseScoresDisplay!: string[];
  topAptiCategoryWiseScores!: string[];

  ngOnInit(): void {
    const topbar = document.querySelector('.layout-topbar');
    if (topbar) {
      this.renderer.setStyle(topbar, 'visibility', 'collapse');
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assessmentService.getDetailedReport(id).subscribe((data) => {
        this.detailedReport = data;
        console.log(data);
      });

      this.aptiCategoryWiseScores = Object.entries(
        this.detailedReport.aptitudeScore.categoryWiseScore
      )
        .map(([category, scoreObject]) => ({
          category,
          scoreObject,
        }))
        .sort(
          (a, b) =>
            b.scoreObject.categoryPercentage - a.scoreObject.categoryPercentage
        );
  
      this.topAptiCategoryWiseScoresDisplay = this.aptiCategoryWiseScores
        .slice(0, 3)
        .map((x) => x.scoreObject.categoryDisplayText);
      this.topAptiCategoryWiseScores = this.aptiCategoryWiseScores
        .slice(0, 3)
        .map((x) => x.category);
      console.log(this.topAptiCategoryWiseScores.join(','));
      if (
        this.topAptiCategoryWiseScores.includes(NumericalCategoryType) &&
        this.topAptiCategoryWiseScores.includes(
        LanguageUsageAndGrammarCategoryType
        ) &&
        this.topAptiCategoryWiseScores.includes(SpeedAndAccuracyCategoryType)
      ) {
        this.careerMapping = {
        potentialCareerRoles: [
          'Entrepreneur',
          'Startup Founder',
          'Venture Capitalist',
          'Business Consultant',
        ],
        requiredSkillSets: [
          'Leadership',
          'Innovation',
          'Business Strategy',
          'Risk Management',
          'Communication',
          'Financial Management',
          'Problem Solving',
          'Decision Making',
          'Networking',
        ],
        areasForMastery: [
          'Entrepreneurship and Leadership',
          'Financial Literacy',
          'Communication Skills',
          'Innovation and Creativity',
          'Critical Thinking and Problem Solving',
        ],
        reasoning:
          'You have scored high in Numerical Reasoning. You have an excellent ability to analyze numbers and solve complex problems. This makes you a great fit for careers that involve data analysis, finance, and other roles that require working with numbers.',
        clubToJoin: 'Entrepreneurship League',
        idealFor:
          'Students with a passion for innovation, leadership, and turning ideas into successful ventures.',
        rationale: 'Dream, Build, Lead – Shape the World!',
        };
      } else if (
        this.topAptiCategoryWiseScores.includes(MechanicalCategoryType) &&
        this.topAptiCategoryWiseScores.includes(SpeedAndAccuracyCategoryType) &&
        this.topAptiCategoryWiseScores.includes(NumericalCategoryType)
      ) {
        this.careerMapping = {
        potentialCareerRoles: [
          'Software Engineer',
          'Mechanical Engineer',
          'Civil Engineer',
          'Data Scientist',
          'AI Specialist',
        ],
        requiredSkillSets: [
          'Analytical Thinking',
          'Programming (Python, Java, etc.)',
          'Problem Solving',
          'Mathematics',
          'Physics',
          'Creativity',
          'Logical Reasoning',
          'Teamwork',
          'Technical Skills',
        ],
        areasForMastery: [
          'Data Literacy',
          'Artificial Intelligence',
          'Robotics',
          'Innovation and Creativity',
          'Critical Thinking and Problem Solving',
        ],
        reasoning:
          'Per your results, you have scored highest in Mechanical Reasoning, which reflects your understanding of physical principles, systems, and structures. This aptitude is key for technical roles in engineering, robotics, and other fields where practical problem-solving and technical knowledge are essential.',
        clubToJoin: 'Engineering Explorers',
        idealFor:
          'Students with high logical and spatial aptitude, a problem-solving mindset, and an interest in technology and innovation.',
        rationale: 'Innovate Today, Engineer Tomorrow!',
        };
      } else if (
        this.topAptiCategoryWiseScores.includes(SpeedAndAccuracyCategoryType) &&
        this.topAptiCategoryWiseScores.includes(AbstractCategoryType) &&
        this.topAptiCategoryWiseScores.includes(NumericalCategoryType)
      ) {
        this.careerMapping = {
        potentialCareerRoles: [
          'Doctor',
          'Surgeon',
          'Pharmacist',
          'Medical Researcher',
          'Biotechnologist',
          'Psychologist',
          'Teaching',
        ],
        requiredSkillSets: [
          'Scientific Knowledge',
          'Empathy',
          'Attention to Detail',
          'Critical Thinking',
          'Decision Making',
          'Teamwork',
          'Emotional Resilience',
          'Communication',
          'Problem Solving',
        ],
        areasForMastery: [
          'Digital Literacy and Information Technology',
          'Ethical and Global Citizenship',
          'Emotional Intelligence',
          'Communication Skills',
          'Environmental Literacy',
        ],
        reasoning:
          'Per your results, you have scored highest in Perceptual Speed and Accuracy, which indicates a strong ability to process and interpret information quickly and with precision. This skill is vital for careers where attention to detail, efficiency, and quick decision-making are key to success, such as in medical, technical, or research-oriented roles.',
        clubToJoin: 'Medical Mavericks',
        idealFor:
          'Students interested in healthcare, medical research, and contributing to life-changing advancements.',
        rationale: 'Healing Lives, Inspiring Futures!',
        };
      } else if (
        this.topAptiCategoryWiseScores.includes(SpaceRelationsCategoryType) &&
        this.topAptiCategoryWiseScores.includes(
        LanguageUsageAndGrammarCategoryType
        ) &&
        this.topAptiCategoryWiseScores.includes(AbstractCategoryType)
      ) {
        this.careerMapping = {
        potentialCareerRoles: [
          'Influencer',
          'Actor',
          'Director',
          'Artist',
          'Designer',
          'Photographer',
          'Content Creator',
          'Event Planner',
        ],
        requiredSkillSets: [
          'Creativity',
          'Storytelling',
          'Public Speaking',
          'Social Media Management',
          'Networking',
          'Presentation Skills',
          'Emotional Intelligence',
          'Branding',
          'Visual Design',
          'Innovation',
        ],
        areasForMastery: [
          'Communication Skills',
          'Emotional Intelligence',
          'Innovation and Creativity',
          'Environmental Literacy',
          'Artificial Intelligence',
        ],
        reasoning:
          'Per your results, you have scored highest in Space Relations, demonstrating strong spatial awareness and the ability to visualize and manipulate objects in three dimensions. This aptitude is ideal for careers in design, architecture, engineering, or creative arts, where visualizing concepts and precision are critical for success.',
        clubToJoin: 'Artistic Visionaries',
        idealFor:
          'Students with high creativity, artistic interests, and openness to experimentation.',
        rationale: 'Create, Express, Inspire – The Future is Yours!',
        };
      } else if (
        this.topAptiCategoryWiseScores.includes(AbstractCategoryType) &&
        this.topAptiCategoryWiseScores.includes(SpeedAndAccuracyCategoryType) &&
        this.topAptiCategoryWiseScores.includes(LanguageUsageAndGrammarCategoryType)
      ) {
        this.careerMapping = {
        potentialCareerRoles: [
          'Sales and Marketing Manager',
          'Financial Analyst',
          'HR Manager',
          'Project Management',
          'Hospitality',
          'Teaching',
        ],
        requiredSkillSets: [
          'Leadership',
          'Financial Management',
          'Communication',
          'Strategic Thinking',
          'Marketing',
          'Teamwork',
          'Negotiation',
          'Analytical Thinking',
          'Adaptability',
        ],
        areasForMastery: [
          'Digital Literacy and Information Technology',
          'Financial Literacy',
          'Communication Skills',
          'Data Literacy',
          'Critical Thinking and Problem Solving',
          'Artificial Intelligence',
        ],
        reasoning:
          'Per your results, you have scored highest in Verbal Reasoning, which reflects your ability to understand, analyze, and draw conclusions from complex written or verbal information. This aptitude is essential for roles that require strategic thinking, clear communication, and problem-solving, making you well-suited for leadership and analytical positions.',
        clubToJoin: 'Business Trailblazers',
        idealFor:
          'Students with a knack for numbers, strong analytical skills, and an interest in exploring innovative financial strategies.',
        rationale: 'Master Strategies, Lead the Game!',
        };
      } else if (
        this.topAptiCategoryWiseScores.includes(AbstractCategoryType) &&
        this.topAptiCategoryWiseScores.includes(NumericalCategoryType) &&
        this.topAptiCategoryWiseScores.includes(SpellingsCategoryType)
      ) {
        this.careerMapping = {
        potentialCareerRoles: [
          'IAS Officer',
          'IPS Officer',
          'IFS Officer',
          'Government Administrator',
          'Public Relations',
          'Law',
          'Journalism',
          'Teaching',
        ],
        requiredSkillSets: [
          'Leadership',
          'Governance Knowledge',
          'Critical Thinking',
          'Decision Making',
          'Emotional Intelligence',
          'Public Speaking',
          'Analytical Skills',
          'Time Management',
          'Problem Solving',
        ],
        areasForMastery: [
          'Communication Skills',
          'Ethical and Global Citizenship',
          'Critical Thinking and Problem Solving',
          'Data Literacy',
          'Digital Literacy and Information Technology',
        ],
        reasoning:
          'Per your results, you have scored highest in Verbal Reasoning, which reflects your ability to understand, analyze, and draw conclusions from complex written or verbal information. This aptitude is essential for roles that require strategic thinking, clear communication, and problem-solving, making you well-suited for leadership and analytical positions.',
        clubToJoin: 'Administrative Achievers',
        idealFor:
          'Students with strong communication skills, an interest in public affairs, and a passion for leadership and community impact.',
        rationale: 'Lead with Integrity, Govern with Impact!',
        };
        console.log(this.careerMapping);
      }
    }
  }

  ngOnDestroy(): void {
    const topbar = document.querySelector('.layout-topbar');
    if (topbar) {
      this.renderer.removeStyle(topbar, 'visibility');
    }
  }
}
