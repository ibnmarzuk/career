import { TemplateDefinition, ResumeCustomization } from '../types/resume';

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'modern',
    name: 'Modern Clean',
    category: 'Modern',
    description: 'Crisp contemporary styling with refined accent bars and balanced whitespace. Ideal for high-growth tech and modern SaaS.',
    atsSuitability: 'Excellent (100%)',
    recommendedRoles: ['Software Engineers', 'Product Managers', 'UI/UX Designers', 'Growth Marketers'],
    accentColorDefault: '#2563eb', // Blue-600
    fontDefault: 'Plus Jakarta Sans',
    layoutStyle: 'single-column',
  },
  {
    id: 'executive',
    name: 'Executive Elite',
    category: 'Executive',
    description: 'Commanding top header banner, elegant serif typography, and strategic hierarchy tailored for directors, VPs, and executives.',
    atsSuitability: 'High (95%)',
    recommendedRoles: ['C-Suite Executives', 'Engineering Directors', 'VP of Product', 'Management Consultants'],
    accentColorDefault: '#0f172a', // Slate-900
    fontDefault: 'EB Garamond',
    layoutStyle: 'banner-header',
  },
  {
    id: 'minimal',
    name: 'Minimalist Studio',
    category: 'Minimal',
    description: 'Pristine negative space, understated dividers, and razor-sharp typographic alignment. Zero fluff, maximum elegance.',
    atsSuitability: 'Excellent (100%)',
    recommendedRoles: ['Software Architects', 'Data Scientists', 'Design Leads', 'Writers'],
    accentColorDefault: '#334155', // Slate-700
    fontDefault: 'Inter',
    layoutStyle: 'minimal-modern',
  },
  {
    id: 'ats-pro',
    name: 'ATS Pro (High Density)',
    category: 'ATS Friendly',
    description: 'Engineered strictly for parsing algorithms (Workday, Taleo, Greenhouse, Lever). Single column, clear header tags, zero parsing blockers.',
    atsSuitability: 'Excellent (100%)',
    recommendedRoles: ['All Corporate Roles', 'Enterprise Tech', 'Finance & Banking', 'Healthcare'],
    accentColorDefault: '#1e293b', // Slate-800
    fontDefault: 'Inter',
    layoutStyle: 'single-column',
  },
  {
    id: 'professional',
    name: 'Professional Corporate',
    category: 'Professional',
    description: 'Polished traditional layout with tasteful horizontal rules, structured dates, and authoritative presence.',
    atsSuitability: 'Excellent (100%)',
    recommendedRoles: ['Financial Analysts', 'Operations Managers', 'Legal Professionals', 'HR Leads'],
    accentColorDefault: '#0284c7', // Sky-600
    fontDefault: 'Outfit',
    layoutStyle: 'single-column',
  },
  {
    id: 'tech',
    name: 'Tech & Engineering',
    category: 'Technical',
    description: 'Tailored for developers, SREs, and architects. Highlights tech stack badges, system impact, and repository links.',
    atsSuitability: 'Excellent (100%)',
    recommendedRoles: ['Full-Stack Engineers', 'Backend / Cloud Engineers', 'DevOps / SRE', 'Machine Learning'],
    accentColorDefault: '#4f46e5', // Indigo-600
    fontDefault: 'Space Grotesk',
    layoutStyle: 'single-column',
  },
  {
    id: 'classic',
    name: 'Classic Heritage',
    category: 'Professional',
    description: 'Timeless Ivy League styling with centered editorial header, classic serif headings, and formal section dividers.',
    atsSuitability: 'High (95%)',
    recommendedRoles: ['Lawyers', 'Economists', 'Academic Faculty', 'Investment Bankers'],
    accentColorDefault: '#78350f', // Amber-900
    fontDefault: 'EB Garamond',
    layoutStyle: 'single-column',
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    category: 'Creative',
    description: 'Modern two-tone sidebar with visual skill indicators, dedicated portfolio showcase, and striking design flair.',
    atsSuitability: 'Standard (90%)',
    recommendedRoles: ['Brand Designers', 'Art Directors', 'Creative Strategists', 'Front-End Creatives'],
    accentColorDefault: '#7c3aed', // Violet-600
    fontDefault: 'Outfit',
    layoutStyle: 'sidebar',
  },
  {
    id: 'academic',
    name: 'Academic & Research',
    category: 'Academic',
    description: 'Comprehensive research CV format with dedicated sections for peer-reviewed publications, awards, grants, and teaching.',
    atsSuitability: 'High (95%)',
    recommendedRoles: ['PhD Candidates', 'Postdoctoral Researchers', 'Professors', 'Research Scientists'],
    accentColorDefault: '#1e3a8a', // Blue-900
    fontDefault: 'Playfair Display',
    layoutStyle: 'single-column',
  },
  {
    id: 'graduate',
    name: 'Graduate Starter',
    category: 'Graduate',
    description: 'Strategic layout for students and new grads that emphasizes education, academic projects, leadership, and internships.',
    atsSuitability: 'Excellent (100%)',
    recommendedRoles: ['Recent Graduates', 'University Students', 'Junior Developers', 'Career Starters'],
    accentColorDefault: '#0d9488', // Teal-600
    fontDefault: 'Plus Jakarta Sans',
    layoutStyle: 'single-column',
  },
];

export const DEFAULT_CUSTOMIZATION: ResumeCustomization = {
  fontFamily: 'Plus Jakarta Sans',
  fontSize: 'base',
  headingSize: 'lg',
  lineSpacing: 'normal',
  margins: 'normal',
  sectionSpacing: 'normal',
  accentColor: '#2563eb',
  textColor: '#0f172a',
  headerStyle: 'left',
  dateFormat: 'MM/YYYY',
  bulletStyle: 'disc',
  paperSize: 'a4',
};
