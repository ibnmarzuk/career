import { ResumeData, ATSAnalysisResult, JobMatchResult, CoverLetter } from '../types/resume';

export interface BulletRewriteResponse {
  success: boolean;
  original: string;
  variations: {
    text: string;
    highlightVerb: string;
    impactType: string;
    reasoning: string;
  }[];
  suggestedMetricsPrompt?: string;
  actionVerbsUsed?: string[];
  error?: string;
}

export interface SummaryGenResponse {
  success: boolean;
  summaries: {
    style: string;
    title: string;
    text: string;
    wordCount: number;
    keyStrengthsHighlighted: string[];
  }[];
  recommendedSummaryIndex: number;
  actionableTips?: string[];
  error?: string;
}

export interface TailorResumeResponse {
  success: boolean;
  tailoredResume: ResumeData;
  changeLog: {
    section: string;
    original: string;
    improved: string;
    reasonForChange: string;
  }[];
  estimatedMatchScoreBefore: number;
  estimatedMatchScoreAfter: number;
  keyKeywordsIntegrated: string[];
  error?: string;
}

export interface SkillsGenResponse {
  success: boolean;
  recommendations: {
    technicalSkills: string[];
    softSkills: string[];
    toolsAndPlatforms: string[];
    frameworksAndLibraries: string[];
    industrySpecific: string[];
  };
  error?: string;
}

export interface CoachChatResponse {
  success: boolean;
  reply: string;
  suggestedActions: string[];
  error?: string;
}

export class AIService {
  private static async post<T>(endpoint: string, body: any): Promise<T> {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorMessage = `Request failed (Status ${response.status}: ${response.statusText || 'Error'})`;
        try {
          const rawText = await response.text();
          try {
            const parsed = JSON.parse(rawText);
            if (parsed && parsed.error) {
              errorMessage = parsed.error;
            }
          } catch {
            if (rawText && rawText.length < 200) {
              errorMessage = rawText;
            }
          }
        } catch {
          // Keep default message
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('AI service request timed out. Please try again.');
      }
      if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }
      throw new Error('AI connection temporarily unavailable. Please check your network or try again.');
    }
  }

  // 1. Analyze Resume with full ATS breakdown
  static async analyzeResume(resume: ResumeData, jobDescription?: string): Promise<{ success: boolean; analysis: ATSAnalysisResult }> {
    return this.post<{ success: boolean; analysis: ATSAnalysisResult }>('/api/ai/analyze-resume', {
      resume,
      jobDescription,
    });
  }

  // 2. Rewrite & Polish Bullet Points
  static async rewriteBullet(params: {
    bullet: string;
    jobTitle?: string;
    company?: string;
    mode?: 'impact' | 'concise' | 'ats-friendly' | 'executive' | 'action-verbs' | 'technical';
    customPrompt?: string;
  }): Promise<BulletRewriteResponse> {
    return this.post<BulletRewriteResponse>('/api/ai/rewrite-bullet', params);
  }

  // 3. Generate Tailored Summaries
  static async generateSummary(params: {
    targetRole: string;
    yearsOfExperience?: string;
    industry?: string;
    keySkills?: string[];
    careerAchievements?: string;
    careerLevel?: string;
    style?: string;
    currentSummary?: string;
  }): Promise<SummaryGenResponse> {
    return this.post<SummaryGenResponse>('/api/ai/generate-summary', params);
  }

  // 4. Match Resume to Job Description
  static async matchJob(resume: ResumeData, jobDescription: string, targetRole?: string): Promise<{ success: boolean; result: JobMatchResult }> {
    return this.post<{ success: boolean; result: JobMatchResult }>('/api/ai/match-job', {
      resume,
      jobDescription,
      targetRole,
    });
  }

  // 5. Tailor Resume
  static async tailorResume(resume: ResumeData, jobDescription: string, targetRole?: string): Promise<TailorResumeResponse> {
    return this.post<TailorResumeResponse>('/api/ai/tailor-resume', {
      resume,
      jobDescription,
      targetRole,
    });
  }

  // 6. Suggest High-Impact Skills
  static async generateSkills(params: {
    resume: ResumeData;
    targetRole?: string;
    industry?: string;
    jobDescription?: string;
  }): Promise<SkillsGenResponse> {
    return this.post<SkillsGenResponse>('/api/ai/generate-skills', params);
  }

  // 7. Generate Cover Letter
  static async generateCoverLetter(params: {
    resume: ResumeData;
    jobDescription?: string;
    jobTitle: string;
    company: string;
    hiringManagerName?: string;
    tone: 'Professional' | 'Confident' | 'Concise' | 'Warm' | 'Executive';
    customHighlights?: string;
  }): Promise<{
    success: boolean;
    subject: string;
    salutation: string;
    bodyParagraphs: string[];
    signOff: string;
    fullLetterText: string;
    wordCount: number;
    keyHighlightsAddressed: string[];
  }> {
    return this.post('/api/ai/generate-cover-letter', params);
  }

  // 8. Extract CV / Resume from Raw Text or Uploaded File
  static async extractCV(rawText: string, fileName?: string): Promise<{ success: boolean; extractedData: Partial<ResumeData> }> {
    return this.post('/api/ai/extract-cv', { rawText, fileName });
  }

  static async parseCV(rawText: string, fileName?: string): Promise<{ success: boolean; structuredResume: Partial<ResumeData> }> {
    const res = await this.extractCV(rawText, fileName);
    return {
      success: res.success,
      structuredResume: res.extractedData,
    };
  }

  // 9. Interactive AI Resume Coach Chat
  static async coachChat(params: {
    message: string;
    history?: { role: 'user' | 'assistant'; content: string }[];
    currentResume: ResumeData;
    activeSection?: string;
    jobDescription?: string;
  }): Promise<CoachChatResponse> {
    return this.post<CoachChatResponse>('/api/ai/coach-chat', params);
  }

  // 10. AI Resume Generator from Natural Language Description
  static async generateResumeFromDescription(params: {
    description: string;
    targetRole?: string;
    industry?: string;
    yearsOfExperience?: string;
    careerLevel?: string;
    location?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    portfolio?: string;
    github?: string;
    website?: string;
    photoUrl?: string;
    targetJobDescription?: string;
  }): Promise<{
    success: boolean;
    resume: ResumeData;
    scores: {
      overallQuality: number;
      atsCompatibility: number;
      contentQuality: number;
      completeness: number;
    };
    missingInformation: {
      id: string;
      field: string;
      question: string;
      placeholder: string;
      importance: 'high' | 'medium' | 'low';
    }[];
    aiFeedback: {
      greeting: string;
      strengths: string[];
      opportunities: string[];
    };
    error?: string;
    suggestions?: string[];
  }> {
    return this.post('/api/resume/generate', params);
  }

  // 11. Multi-turn AI Follow-Up Refinement
  static async followUpResumeChat(params: {
    currentResume: ResumeData;
    prompt: string;
    history?: { role: 'user' | 'assistant'; content: string }[];
    actionType?: string;
  }): Promise<{
    success: boolean;
    updatedResume: ResumeData;
    aiMessage: string;
    changesMade: string[];
    suggestedNextQuestions: string[];
    error?: string;
  }> {
    return this.post('/api/resume/follow-up', params);
  }

  // 12. Section Improvement
  static async improveSection(params: {
    sectionName: string;
    sectionData: any;
    instruction?: string;
    context?: any;
  }): Promise<{
    success: boolean;
    improvedSectionData: any;
    explanation: string;
    keyChanges: string[];
    error?: string;
  }> {
    return this.post('/api/resume/improve', params);
  }

  // 13. Process & Validate Profile Photo
  static async uploadPhoto(params: {
    photoBase64: string;
    fileName?: string;
    cropData?: any;
  }): Promise<{
    success: boolean;
    photoUrl: string;
    fileName: string;
    message: string;
    atsRecommendation: string;
    error?: string;
  }> {
    return this.post('/api/resume/photo', params);
  }
}

