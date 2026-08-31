export type CareerLevel =
  | 'Student'
  | 'Graduate'
  | 'Entry Level'
  | 'Mid Level'
  | 'Senior'
  | 'Executive'
  | 'Career Changer'
  | 'Freelancer';

export type PlanType = 'free' | 'pro' | 'premium';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  careerLevel: CareerLevel;
  industry: string;
  targetRole: string;
  yearsOfExperience: string;
  location: string;
  primaryGoal: 'create_new' | 'improve_existing' | 'tailor_job' | 'create_cv' | 'create_cover_letter';
  plan: PlanType;
  isOnboarded: boolean;
  aiCreditsRemaining: number;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  avatarUrl?: string;
  showAvatar?: boolean;
  customLinks?: { label: string; url: string }[];
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance' | 'Remote';
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description?: string;
  bullets: string[];
  achievements?: string[];
  skillsUsed?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  gpa?: string;
  honors?: string;
  description?: string;
}

export type SkillCategory = 'Technical' | 'Soft' | 'Tools' | 'Languages' | 'Frameworks' | 'Other';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Project {
  id: string;
  title: string;
  role?: string;
  subtitle?: string;
  url?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  bullets: string[];
  techStack: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
}

export interface VolunteerExperience {
  id: string;
  organization: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description?: string;
  bullets: string[];
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  description?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  bullets: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export type SectionKey =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'awards'
  | 'languages'
  | 'volunteer'
  | 'publications';

export type TemplateId = string;

export const DEFAULT_CUSTOMIZATION: ResumeCustomization = {
  fontFamily: 'Plus Jakarta Sans',
  fontSize: 'base',
  headingSize: 'base',
  lineSpacing: 'normal',
  margins: 'normal',
  sectionSpacing: 'normal',
  accentColor: '#2563eb',
  textColor: '#0f172a',
  headerStyle: 'split',
  dateFormat: 'MMM YYYY',
  bulletStyle: 'disc',
  paperSize: 'a4',
};

export interface ResumeCustomization {
  fontFamily:
    | 'Plus Jakarta Sans'
    | 'Inter'
    | 'EB Garamond'
    | 'Playfair Display'
    | 'Outfit'
    | 'Space Grotesk'
    | 'Cinzel'
    | 'Fira Code';
  fontSize: 'sm' | 'base' | 'lg';
  headingSize: 'sm' | 'base' | 'lg' | 'xl';
  lineSpacing: 'tight' | 'normal' | 'relaxed';
  margins: 'compact' | 'normal' | 'spacious';
  sectionSpacing: 'compact' | 'normal' | 'spacious';
  accentColor: string;
  textColor: string;
  headerStyle: 'left' | 'center' | 'split' | 'banner' | 'modern-card';
  dateFormat: 'MM/YYYY' | 'Month YYYY' | 'YYYY' | 'MMM YYYY';
  bulletStyle: 'disc' | 'circle' | 'dash' | 'arrow' | 'none';
  paperSize: 'a4' | 'letter';
}

export interface ResumeData {
  id: string;
  userId: string;
  title: string;
  targetRole: string;
  careerLevel: CareerLevel;
  templateId: string;
  status: 'draft' | 'optimized' | 'ready' | 'tailored';
  atsScore: number;
  completionScore: number;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  awards: Award[];
  languages: Language[];
  volunteer: VolunteerExperience[];
  publications: Publication[];
  customSections: CustomSection[];
  sectionOrder: SectionKey[];
  enabledSections: Record<SectionKey, boolean>;
  customization: ResumeCustomization;
  targetJobDescription?: string;
  rawUserDescription?: string;
  aiQualityScores?: {
    overallQuality: number;
    atsCompatibility: number;
    contentQuality: number;
    completeness: number;
  };
  missingInformationAlerts?: {
    id: string;
    field: string;
    question: string;
    placeholder: string;
    importance: 'high' | 'medium' | 'low';
  }[];
  aiFeedbackGreeting?: string;
}

export interface ATSCriticalIssue {
  problem: string;
  whyItMatters: string;
  recommendedFix: string;
  autoFixSuggestion?: string;
}

export interface ATSWarning {
  problem: string;
  whyItMatters: string;
  recommendedFix: string;
}

export interface ATSAnalysisResult {
  overallScore: number;
  atsCompatibility: number;
  keywordScore: number;
  experienceScore: number;
  skillsScore: number;
  formattingScore: number;
  contentQualityScore: number;
  grammarClarityScore: number;
  jobRelevanceScore: number;
  summary: string;
  criticalIssues: ATSCriticalIssue[];
  warnings: ATSWarning[];
  suggestions: string[];
  missingKeywords: string[];
  foundKeywords: string[];
  strongPoints: string[];
  impactMetricsCount: number;
  weakBullets?: { original: string; reason: string; rewrite: string }[];
}

export interface JobMatchQualification {
  text: string;
  status: 'matched' | 'missing' | 'partially-matched';
}

export interface JobMatchSkill {
  name: string;
  category: 'Technical' | 'Soft' | 'Tool';
  evidenceInResume?: string;
}

export interface JobMissingSkill {
  name: string;
  category: 'Technical' | 'Soft' | 'Tool';
  importance: 'Critical' | 'High' | 'Nice-to-have';
  suggestion: string;
}

export interface JobMatchResult {
  matchScore: number;
  jobOverview: {
    title: string;
    company: string;
    summary: string;
    seniorLevel?: string;
  };
  requiredQualifications: JobMatchQualification[];
  preferredQualifications: JobMatchQualification[];
  matchedSkills: JobMatchSkill[];
  missingSkills: JobMissingSkill[];
  experienceGaps: string[];
  keywordComparison: {
    keyword: string;
    frequencyInJob: number;
    inResume: boolean;
    context: string;
  }[];
  suggestedTailoredSummary: string;
  recommendedBulletImprovements: {
    originalBullet: string;
    suggestedBullet: string;
    rationale: string;
  }[];
}

export interface CoverLetter {
  id: string;
  userId?: string;
  resumeId: string;
  jobTitle: string;
  company: string;
  hiringManagerName: string;
  tone: 'Professional' | 'Confident' | 'Concise' | 'Warm' | 'Executive';
  subject: string;
  salutation: string;
  bodyParagraphs: string[];
  signOff: string;
  fullLetterText: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  title: string;
  timestamp: string;
  action: string;
  atsScore: number;
  snapshot: ResumeData;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: 'Modern' | 'Minimal' | 'Professional' | 'Executive' | 'Creative' | 'Technical' | 'Academic' | 'ATS Friendly' | 'Graduate' | 'Two Column';
  description: string;
  atsSuitability: 'Excellent (100%)' | 'High (95%)' | 'Standard (90%)';
  isPremium?: boolean;
  recommendedRoles: string[];
  accentColorDefault: string;
  fontDefault: ResumeCustomization['fontFamily'];
  layoutStyle: 'single-column' | 'two-column' | 'sidebar' | 'banner-header' | 'minimal-modern';
}
