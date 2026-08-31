import { ResumeData, ATSAnalysisResult } from '../types/resume';

export function calculateATSMetrics(resume?: ResumeData, jobDescription?: string): ATSAnalysisResult {
  const r = resume || ({} as Partial<ResumeData>);
  const p = r.personalInfo || ({} as any);
  const exps = r.experience || [];
  const edus = r.education || [];
  const skills = r.skills || [];
  const projs = r.projects || [];
  const summary = r.summary || '';

  // 1. Personal & Contact checks
  const hasName = !!(p.fullName && p.fullName.trim().length > 2);
  const hasJobTitle = !!(p.jobTitle && p.jobTitle.trim().length > 2);
  const hasEmail = !!(p.email && p.email.includes('@'));
  const hasPhone = !!(p.phone && p.phone.trim().length >= 7);
  const hasLocation = !!(p.location && p.location.trim().length > 2);
  const hasLinkedIn = !!(p.linkedin && p.linkedin.includes('linkedin.com'));

  // 2. Summary checks
  const summaryLength = summary.trim().length;
  const hasGoodSummary = summaryLength >= 80 && summaryLength <= 500;

  // 3. Experience & Bullet checks
  const totalBullets = exps.reduce((acc, e) => acc + (e.bullets?.length || 0), 0);
  const bulletsWithMetrics = exps.reduce((acc, e) => {
    return (
      acc +
      (e.bullets || []).filter(b => /\b(\d+%|\$\d+|\d+\+?\s*(users|clients|engineers|members|projects|ms|s|hours|days|x))\b/i.test(b)).length
    );
  }, 0);

  const strongActionVerbs = [
    'architected', 'spearheaded', 'optimized', 'engineered', 'developed', 'deployed',
    'streamlined', 'mentored', 'authored', 'orchestrated', 'built', 'reduced',
    'increased', 'launched', 'automated', 'integrated', 'designed', 'accelerated',
  ];

  const bulletsWithActionVerbs = exps.reduce((acc, e) => {
    return (
      acc +
      (e.bullets || []).filter(b => {
        const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
        return strongActionVerbs.includes(firstWord);
      }).length
    );
  }, 0);

  // 4. Skills checks
  const skillCount = skills.length;
  const hasCategorizedSkills = skills.some(s => s.category === 'Technical') && skills.some(s => s.category === 'Soft' || s.category === 'Tools');

  // Category Scoring
  // A. Keyword Score (0-100) -> 25% weight
  let keywordScore = 40;
  if (skillCount >= 4) keywordScore += 20;
  if (skillCount >= 8) keywordScore += 20;
  if (hasCategorizedSkills) keywordScore += 10;
  if (hasJobTitle) keywordScore += 10;
  keywordScore = Math.min(98, keywordScore);

  // B. Content Quality Score (0-100) -> 20% weight
  let contentQualityScore = 50;
  if (hasGoodSummary) contentQualityScore += 20;
  if (bulletsWithActionVerbs >= 3) contentQualityScore += 15;
  if (bulletsWithMetrics >= 2) contentQualityScore += 15;
  contentQualityScore = Math.min(98, contentQualityScore);

  // C. Experience Score (0-100) -> 20% weight
  let experienceScore = 50;
  if (exps.length >= 1) experienceScore += 15;
  if (exps.length >= 2) experienceScore += 15;
  if (totalBullets >= 4) experienceScore += 10;
  if (bulletsWithMetrics >= 2) experienceScore += 10;
  experienceScore = Math.min(98, experienceScore);

  // D. Formatting Score (0-100) -> 15% weight
  let formattingScore = 75;
  if (hasName && hasEmail && hasPhone && hasLocation) formattingScore += 15;
  if (edus.length >= 1) formattingScore += 10;
  formattingScore = Math.min(100, formattingScore);

  // E. Skills Score (0-100) -> 10% weight
  let skillsScore = Math.min(98, Math.max(30, skillCount * 9 + 15));

  // F. Grammar & Clarity Score (0-100) -> 10% weight
  let grammarClarityScore = 92;
  if (totalBullets > 0 && bulletsWithActionVerbs / totalBullets < 0.5) grammarClarityScore -= 8;

  // Job relevance
  let jobRelevanceScore = 80;
  if (jobDescription && jobDescription.length > 50) {
    const jdLower = jobDescription.toLowerCase();
    const matches = skills.filter(s => s && s.name && jdLower.includes(s.name.toLowerCase()));
    const ratio = skills.length > 0 ? matches.length / skills.length : 0.5;
    jobRelevanceScore = Math.min(95, Math.round(50 + ratio * 45));
  }

  // Weighted Overall ATS Score
  const overallScore = Math.round(
    keywordScore * 0.25 +
    contentQualityScore * 0.20 +
    experienceScore * 0.20 +
    formattingScore * 0.15 +
    skillsScore * 0.10 +
    grammarClarityScore * 0.10
  );

  // ATS Compatibility specific index
  const atsCompatibility = Math.round((formattingScore * 0.4 + keywordScore * 0.35 + experienceScore * 0.25));

  // Construct Issues & Recommendations
  const criticalIssues = [];
  const warnings = [];
  const suggestions = [];

  if (!hasEmail || !hasPhone) {
    criticalIssues.push({
      problem: 'Missing Direct Contact Information',
      whyItMatters: 'Recruiters and automated ATS parsers cannot invite you to interviews without validated email and phone fields.',
      recommendedFix: 'Add your active email and phone number in the Personal Information section.',
    });
  }

  if (bulletsWithMetrics === 0 && totalBullets > 0) {
    criticalIssues.push({
      problem: 'Zero Quantified Achievements in Work Experience',
      whyItMatters: 'Bullet points without metrics (%, $, time saved, users) rank in the bottom 30% of candidate screenings.',
      recommendedFix: 'Add at least 2 measurable achievements (e.g. "reduced load time by 35%", "managed $2M budget").',
      autoFixSuggestion: 'Run AI Bullet Optimizer to suggest quantifiable impact structures.',
    });
  }

  if (skillCount < 6) {
    warnings.push({
      problem: 'Low Keyword / Skill Count',
      whyItMatters: 'ATS scanners search for exact matches for core industry technologies and competencies.',
      recommendedFix: 'Include at least 8 to 12 verified technical and domain skills.',
    });
  }

  if (!hasGoodSummary) {
    warnings.push({
      problem: 'Professional Summary Missing or Too Short',
      whyItMatters: 'A 3-4 line summary anchors your target seniority level and hooks human reviewers within 6 seconds.',
      recommendedFix: 'Generate a tailored 35-50 word summary highlighting your core value proposition.',
    });
  }

  if (!hasLinkedIn) {
    suggestions.push('Add your personalized LinkedIn URL to increase credibility during recruiter review.');
  }

  if (projs.length === 0 && (r.careerLevel === 'Student' || r.careerLevel === 'Graduate' || r.careerLevel === 'Entry Level')) {
    suggestions.push('Add 1-2 featured academic or open-source projects to showcase practical execution.');
  }

  const foundKeywords = skills.filter(s => s && s.name).map(s => s.name);
  const commonTech = ['Docker', 'AWS', 'CI/CD', 'GraphQL', 'System Architecture', 'Agile', 'Performance Optimization'];
  const missingKeywords = commonTech.filter(k => !foundKeywords.some(f => f.toLowerCase() === k.toLowerCase())).slice(0, 5);

  return {
    overallScore,
    atsCompatibility,
    keywordScore,
    experienceScore,
    skillsScore,
    formattingScore,
    contentQualityScore,
    grammarClarityScore,
    jobRelevanceScore,
    summary: `Resume shows a strong ${overallScore}% overall strength with clean formatting and structured experience. Adding ${bulletsWithMetrics === 0 ? 'quantifiable business outcomes' : 'more domain keywords'} will maximize recruiter callbacks.`,
    criticalIssues,
    warnings,
    suggestions,
    missingKeywords,
    foundKeywords,
    strongPoints: [
      hasName && hasJobTitle ? 'Clear title and target positioning' : 'Clean layout structure',
      totalBullets >= 4 ? 'Well-distributed experience bullet points' : 'Concise career history',
      skillCount >= 6 ? 'Good variety of technical and soft skills' : 'Focused skill profile',
    ],
    impactMetricsCount: bulletsWithMetrics,
  };
}

export function calculateCompletionScore(resume?: ResumeData): number {
  if (!resume) return 80;
  let score = 0;
  const p = resume.personalInfo || ({} as any);
  if (p.fullName) score += 15;
  if (p.email && p.phone) score += 10;
  if (p.location) score += 5;
  if (p.linkedin || p.website || p.github) score += 5;
  if (resume.summary && resume.summary.length > 30) score += 15;
  if (resume.experience && resume.experience.length > 0) score += 20;
  if (resume.education && resume.education.length > 0) score += 15;
  if (resume.skills && resume.skills.length >= 4) score += 10;
  if (resume.projects && resume.projects.length > 0) score += 5;
  return Math.min(100, score);
}
