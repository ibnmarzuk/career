import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Edit3,
  FileDown,
  Layers,
  Search,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Send,
  Zap,
  Briefcase,
  GraduationCap,
  Award,
  Sliders,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Copy,
  ExternalLink,
  HelpCircle,
  Flame,
  ShieldCheck,
  Camera,
  Crop,
} from 'lucide-react';
import { ResumeData, UserProfile, TemplateId, DEFAULT_CUSTOMIZATION } from '../../types/resume';
import { AIService } from '../../services/aiService';
import { StorageService } from '../../services/storageService';
import { ResumeTemplateRenderer } from '../templates/ResumeTemplateRenderer';

interface AIResumeGeneratorProps {
  user?: UserProfile;
  onNavigate: (view: string) => void;
  onSelectResume: (id: string) => void;
  onOpenPrintPreview?: (resume: ResumeData) => void;
}

const EXAMPLE_PROMPTS = [
  {
    title: 'Frontend Developer',
    role: 'Frontend Developer',
    text: 'I am a frontend developer with 2 years of experience. I have worked with React, JavaScript, TypeScript, Tailwind CSS, and Firebase. I built websites for small businesses and created a high-traffic e-commerce platform. I studied computer science at university and I have a Google certificate in UX design.',
  },
  {
    title: 'Senior Full Stack Lead',
    role: 'Senior Full Stack Engineer',
    text: 'Senior full-stack engineer with 6 years of experience architecting distributed microservices and reactive web apps. Core tech includes Node.js, Python, React, PostgreSQL, Docker, and AWS. Led a team of 5 engineers delivering high-throughput payment pipelines handling millions in monthly volume.',
  },
  {
    title: 'Recent CS Graduate',
    role: 'Junior Software Engineer',
    text: 'Recent Computer Science graduate with strong foundation in data structures, algorithms, Java, Python, and web development. Completed a capstone project building an AI-powered study tool with React and FastAPI. Looking for an entry-level software engineering role.',
  },
  {
    title: 'Product Manager',
    role: 'Product Manager',
    text: 'Product manager with 4 years of experience leading cross-functional squads across fintech and SaaS products. Skilled in product discovery, agile roadmapping, user research, SQL analytics, and Figma prototyping. Launched a mobile checkout experience that increased conversion.',
  },
];

const TEMPLATES: { id: string; name: string; tag: string; description: string; atsFriendly: boolean; supportsPhoto: boolean }[] = [
  { id: 'ats-pro', name: 'ATS Pro Standard', tag: 'Top ATS Score', description: 'Engineered strictly for parsing bots, zero formatting friction.', atsFriendly: true, supportsPhoto: false },
  { id: 'modern', name: 'Modern Clean', tag: 'Popular', description: 'Clean headers, elegant typography, balanced negative space.', atsFriendly: true, supportsPhoto: true },
  { id: 'photo-resume', name: 'Executive Photo', tag: 'Visual Impact', description: 'Prominent professional photo card with accented contact bar.', atsFriendly: false, supportsPhoto: true },
  { id: 'minimal', name: 'Minimalist Grid', tag: 'Clean & Crisp', description: 'Understated elegance, maximum content density and readability.', atsFriendly: true, supportsPhoto: true },
  { id: 'executive', name: 'Executive Dark Header', tag: 'Leadership', description: 'High contrast header banner for director and executive roles.', atsFriendly: true, supportsPhoto: true },
  { id: 'creative', name: 'Creative Sidebar', tag: 'Modern Portfolio', description: 'Two-column layout with skills gauge and dark contrast column.', atsFriendly: false, supportsPhoto: true },
  { id: 'tech', name: 'Tech Minimalist', tag: 'Developers', description: 'Monospace badges, terminal accents, and repository links.', atsFriendly: true, supportsPhoto: false },
  { id: 'graduate', name: 'Early Career / Graduate', tag: 'Entry Level', description: 'Highlights education, projects, coursework, and certifications.', atsFriendly: true, supportsPhoto: true },
];

export const AIResumeGenerator: React.FC<AIResumeGeneratorProps> = ({
  user,
  onNavigate,
  onSelectResume,
  onOpenPrintPreview,
}) => {
  // Input State
  const [description, setDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('2');
  const [careerLevel, setCareerLevel] = useState<'Entry Level' | 'Mid Level' | 'Senior' | 'Executive'>('Mid Level');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [github, setGithub] = useState('');
  const [targetJobDescription, setTargetJobDescription] = useState('');
  const [showAdvancedInputs, setShowAdvancedInputs] = useState(false);

  // Photo Upload State
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [photoError, setPhotoError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Speech Recognition State
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Generation & Status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationSuggestions, setGenerationSuggestions] = useState<string[]>([]);

  // Generated Resume & Studio State
  const [generatedResume, setGeneratedResume] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');
  const [previewZoom, setPreviewZoom] = useState<number>(0.85);
  const [aiScores, setAiScores] = useState<{
    overallQuality: number;
    atsCompatibility: number;
    contentQuality: number;
    completeness: number;
  }>({ overallQuality: 88, atsCompatibility: 92, contentQuality: 86, completeness: 85 });
  const [missingInfoAlerts, setMissingInfoAlerts] = useState<
    { id: string; field: string; question: string; placeholder: string; importance: 'high' | 'medium' | 'low' }[]
  >([]);
  const [aiFeedback, setAiFeedback] = useState<{ greeting: string; strengths: string[]; opportunities: string[] } | null>(null);

  // Interactive Follow-up Chat
  const [chatInput, setChatInput] = useState('');
  const [isChatProcessing, setIsChatProcessing] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; text: string; changes?: string[]; time: string }[]
  >([]);
  const [quickAnswers, setQuickAnswers] = useState<Record<string, string>>({});
  const [answeredAlertIds, setAnsweredAlertIds] = useState<string[]>([]);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Initialize Speech Recognition if browser supports it
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (currentTranscript) {
          setDescription(prev => (prev ? `${prev.trim()} ${currentTranscript.trim()}` : currentTranscript.trim()));
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!speechSupported || !recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Speech recognition error:', err);
      }
    }
  };

  // Photo Handling
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setPhotoError('Please upload a PNG, JPG, or WEBP image.');
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPhotoUrl(base64);
      setPhotoFileName(file.name);

      // If we already have a generated resume, update it live
      if (generatedResume) {
        setGeneratedResume(prev => {
          if (!prev) return null;
          return {
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              avatarUrl: base64,
              showAvatar: true,
            },
          };
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoUrl('');
    setPhotoFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (generatedResume) {
      setGeneratedResume(prev => {
        if (!prev) return null;
        return {
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            avatarUrl: '',
            showAvatar: false,
          },
        };
      });
    }
  };

  // Apply an Example Prompt
  const handleApplyExample = (ex: (typeof EXAMPLE_PROMPTS)[0]) => {
    setDescription(ex.text);
    if (!targetRole) setTargetRole(ex.role);
  };

  // Generation Workflow
  const handleGenerateResume = async () => {
    if (!description.trim() || description.trim().length < 15) {
      setGenerationError('Please provide a little more detail about yourself (at least 1-2 sentences) so we can create a complete resume.');
      return;
    }

    setGenerationError(null);
    setIsGenerating(true);
    setGenerationStep(0);

    const stepInterval = setInterval(() => {
      setGenerationStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 900);

    try {
      const response = await AIService.generateResumeFromDescription({
        description,
        targetRole,
        industry,
        yearsOfExperience,
        careerLevel,
        location,
        email,
        phone,
        linkedin,
        portfolio,
        github,
        photoUrl: photoUrl || undefined,
        targetJobDescription: targetJobDescription || undefined,
      });

      clearInterval(stepInterval);
      setGenerationStep(5);

      if (!response.success || !response.resume) {
        throw new Error(response.error || 'Failed to generate structured resume');
      }

      const freshResume: ResumeData = {
        ...response.resume,
        id: `res-${Date.now()}`,
        userId: user?.id || 'usr-default',
        title: `${response.resume.personalInfo?.fullName || 'My'} - ${response.resume.personalInfo?.jobTitle || targetRole || 'Resume'}`,
        targetRole: response.resume.personalInfo?.jobTitle || targetRole || 'Professional',
        careerLevel: careerLevel,
        templateId: selectedTemplate,
        status: 'ready',
        atsScore: response.scores?.atsCompatibility || 92,
        completionScore: response.scores?.completeness || 88,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefault: false,
        rawUserDescription: description,
        aiQualityScores: response.scores,
        missingInformationAlerts: response.missingInformation || [],
        aiFeedbackGreeting: response.aiFeedback?.greeting,
        customization: {
          ...DEFAULT_CUSTOMIZATION,
          accentColor: '#2563eb',
        },
        sectionOrder: ['personal', 'summary', 'experience', 'skills', 'projects', 'education', 'certifications', 'awards', 'languages'],
        enabledSections: {
          personal: true,
          summary: true,
          experience: true,
          education: true,
          skills: true,
          projects: true,
          certifications: true,
          awards: true,
          languages: true,
          volunteer: false,
          publications: false,
        },
      };

      // Save to StorageService
      StorageService.saveResume(freshResume);
      setGeneratedResume(freshResume);
      setAiScores(response.scores || { overallQuality: 88, atsCompatibility: 92, contentQuality: 86, completeness: 85 });
      setMissingInfoAlerts(response.missingInformation || []);
      setAiFeedback(response.aiFeedback || null);

      // Add initial greeting to chat
      setChatMessages([
        {
          role: 'assistant',
          text: response.aiFeedback?.greeting || `I've generated a comprehensive, ATS-optimized resume for your background! You can ask me to tweak any section, tailor for specific roles, or choose another template.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Generation failure:', err);
      setGenerationError(err.message || 'Could not generate resume. Please check your connection and try again.');
      if (err.suggestions) {
        setGenerationSuggestions(err.suggestions);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Follow-up Chat or Quick Refinements
  const handleSendChat = async (overridePrompt?: string) => {
    const textToSend = overridePrompt || chatInput;
    if (!textToSend.trim() || !generatedResume) return;

    const userMessageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { role: 'user', text: textToSend, time: userMessageTime }]);
    if (!overridePrompt) setChatInput('');
    setIsChatProcessing(true);

    try {
      const response = await AIService.followUpResumeChat({
        currentResume: generatedResume,
        prompt: textToSend,
      });

      if (response.success && response.updatedResume) {
        const updated: ResumeData = {
          ...generatedResume,
          ...response.updatedResume,
          updatedAt: new Date().toISOString(),
        };
        StorageService.saveResume(updated);
        setGeneratedResume(updated);

        setChatMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: response.aiMessage || "I've applied your updates to the resume.",
            changes: response.changesMade,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: "I encountered an issue applying that change. Please try phrasing your request again.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsChatProcessing(false);
    }
  };

  // Answering a Missing Information Prompt
  const handleAnswerMissingInfo = async (item: { id: string; field: string; question: string }) => {
    const answer = quickAnswers[item.id];
    if (!answer || !answer.trim()) return;

    setAnsweredAlertIds(prev => [...prev, item.id]);
    await handleSendChat(`Regarding "${item.question}": My answer is: ${answer}`);
  };

  // Template Switcher
  const handleSelectTemplate = (tId: string) => {
    setSelectedTemplate(tId);
    if (generatedResume) {
      const updated = { ...generatedResume, templateId: tId, updatedAt: new Date().toISOString() };
      StorageService.saveResume(updated);
      setGeneratedResume(updated);
    }
  };

  // Handoff to Builder
  const handleOpenInBuilder = () => {
    if (generatedResume) {
      onSelectResume(generatedResume.id);
      onNavigate('builder');
    }
  };

  const handleCopyMarkdown = () => {
    if (!generatedResume) return;
    const md = `# ${generatedResume.personalInfo.fullName}
${generatedResume.personalInfo.jobTitle} | ${generatedResume.personalInfo.email} | ${generatedResume.personalInfo.location}

## Summary
${generatedResume.summary}

## Experience
${generatedResume.experience
  .map(
    e => `### ${e.jobTitle} - ${e.company} (${e.startDate} - ${e.endDate})
${e.bullets.map(b => `- ${b}`).join('\n')}`
  )
  .join('\n\n')}

## Education
${generatedResume.education.map(ed => `- **${ed.degree} in ${ed.fieldOfStudy}**, ${ed.institution}`).join('\n')}

## Skills
${generatedResume.skills.map(s => s.name).join(', ')}
`;
    navigator.clipboard.writeText(md);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const generationStepsText = [
    'Understanding your background & experience...',
    'Organizing career history & achievements...',
    'Writing high-impact ATS professional summary...',
    'Categorizing skills & technical competencies...',
    'Structuring bullet points (Action + Task + Result)...',
    'Almost ready! Finalizing formatting & ATS validation...',
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Banner Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Generation AI Resume Generator</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                Tell us about yourself. We'll build your resume.
              </h1>
              <p className="mt-2 text-base text-slate-600 leading-relaxed">
                Describe your experience, skills, education, projects, and career goals in your own words. Our AI will turn your story into a professional, structured, ATS-optimized resume.
              </p>
            </div>

            {generatedResume && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleOpenInBuilder}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm shadow-xs transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Open in Full Builder</span>
                </button>
                {onOpenPrintPreview && (
                  <button
                    onClick={() => onOpenPrintPreview(generatedResume)}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg font-semibold text-sm border border-slate-200 transition-colors"
                  >
                    <FileDown className="w-4 h-4 text-slate-600" />
                    <span>Print / PDF</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {!generatedResume ? (
          /* ======================================================= */
          /* STAGE 1: CREATION CONSOLE (DESCRIPTION + PHOTO + OPTIONAL) */
          /* ======================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Primary Input Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Primary Conversational Textarea Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-blue-600" />
                    <span>Your Story & Career Background</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {speechSupported && (
                      <button
                        type="button"
                        onClick={toggleSpeechRecognition}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isRecording
                            ? 'bg-rose-500 text-white animate-pulse shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        title="Dictate with voice"
                      >
                        {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-blue-600" />}
                        <span>{isRecording ? 'Listening...' : 'Voice Dictate'}</span>
                      </button>
                    )}
                    {description && (
                      <button
                        type="button"
                        onClick={() => setDescription('')}
                        className="text-xs text-slate-400 hover:text-slate-600 p-1"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={8}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Tell us about yourself, your experience, education, skills, projects, achievements, and the kind of job you're looking for...&#10;&#10;Example: I am a frontend developer with 2 years of experience. I have worked with React, JavaScript, Tailwind CSS, and Firebase. I built websites for small businesses and created an e-commerce platform. I studied computer science and have a Google certificate in UX design."
                    className="w-full rounded-xl border border-slate-300 p-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm leading-relaxed transition-all resize-y"
                  />
                  <div className="absolute bottom-3 right-3 text-[11px] font-medium text-slate-400">
                    {description.length} characters
                  </div>
                </div>

                {/* Example Prompts Carousel */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Or click an example to pre-fill:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLE_PROMPTS.map((ex, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleApplyExample(ex)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200/80 transition-colors font-medium text-left"
                      >
                        {ex.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collapsible Optional Extra Fields */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedInputs(!showAdvancedInputs)}
                    className="flex items-center justify-between w-full text-xs font-bold text-slate-700 hover:text-slate-900"
                  >
                    <span className="flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-blue-600" />
                      <span>Optional Targeted Details (Role, Level, Contact Info)</span>
                    </span>
                    {showAdvancedInputs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showAdvancedInputs && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Title</label>
                        <input
                          type="text"
                          value={targetRole}
                          onChange={e => setTargetRole(e.target.value)}
                          placeholder="e.g. Senior Frontend Engineer"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
                        <input
                          type="text"
                          value={industry}
                          onChange={e => setIndustry(e.target.value)}
                          placeholder="e.g. Fintech, SaaS, Healthcare"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Career Level</label>
                        <select
                          value={careerLevel}
                          onChange={e => setCareerLevel(e.target.value as any)}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                        >
                          <option value="Entry Level">Entry Level (0-2 years)</option>
                          <option value="Mid Level">Mid Level (2-5 years)</option>
                          <option value="Senior">Senior (5-8+ years)</option>
                          <option value="Executive">Executive / Director</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                        <input
                          type="text"
                          value={location}
                          onChange={e => setLocation(e.target.value)}
                          placeholder="e.g. San Francisco, CA (or Remote)"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="alex@example.com"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="+1 (555) 019-2834"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn Profile</label>
                        <input
                          type="text"
                          value={linkedin}
                          onChange={e => setLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Portfolio or GitHub</label>
                        <input
                          type="text"
                          value={portfolio}
                          onChange={e => setPortfolio(e.target.value)}
                          placeholder="https://myportfolio.dev"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Target Job Description (Optional - for instant ATS alignment)
                        </label>
                        <textarea
                          rows={3}
                          value={targetJobDescription}
                          onChange={e => setTargetJobDescription(e.target.value)}
                          placeholder="Paste a job description to automatically align keywords and skills..."
                          className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Banner if any */}
                {generationError && (
                  <div className="mt-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">{generationError}</p>
                        {generationSuggestions.length > 0 && (
                          <ul className="mt-2 list-disc list-inside space-y-1 text-rose-700">
                            {generationSuggestions.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Primary Action Button */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Grounded in facts • Zero fictional data invented</span>
                  </div>

                  <button
                    type="button"
                    disabled={isGenerating || !description.trim()}
                    onClick={handleGenerateResume}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white shadow-md transition-all ${
                      isGenerating || !description.trim()
                        ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating Your Resume...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate My Resume</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Progress State Overlay when generating */}
              {isGenerating && (
                <div className="bg-blue-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl animate-fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center animate-spin">
                      <RefreshCw className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">Creating Your Professional Resume</h3>
                      <p className="text-xs text-blue-200">{generationStepsText[generationStep]}</p>
                    </div>
                  </div>

                  <div className="w-full bg-blue-950/60 rounded-full h-2 overflow-hidden mb-4">
                    <div
                      className="bg-blue-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (generationStep + 1) * 20)}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-blue-200 pt-2 border-t border-blue-800">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Extracting Truthful Facts</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Action-Task-Result Bullets</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ATS Keyword Optimization</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Photo Upload & Benefits Card */}
            <div className="lg:col-span-4 space-y-6">
              {/* Optional Profile Photo Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-blue-600" />
                    <span>Add a Professional Photo</span>
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Optional</span>
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Some resume templates support profile photos. ATS friendly templates will automatically hide it.
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoSelect}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />

                {photoUrl ? (
                  <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="relative mb-3">
                      <img
                        src={photoUrl}
                        alt="Profile preview"
                        className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-1 shadow-xs hover:bg-rose-700 transition-colors"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-xs font-semibold text-slate-800 truncate max-w-[200px] mb-2">{photoFileName || 'Profile Photo'}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="text-xs px-2.5 py-1 rounded bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl bg-slate-50/50 hover:bg-blue-50/40 cursor-pointer transition-all text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Upload Professional Photo</span>
                    <span className="text-[11px] text-slate-400 mt-1">PNG, JPG or WEBP (Max 5MB)</span>
                  </div>
                )}

                {photoError && <p className="text-xs text-rose-600 font-medium mt-2">{photoError}</p>}

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Recommendation: ATS-friendly corporate formats usually perform best without photos.</span>
                </div>
              </div>

              {/* Quality Checklist Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">How AI Transforms Your Story</h3>
                <div className="space-y-3 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Action + Result Phrasing</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">Turns everyday tasks into strong, recruiter-proven achievements.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">2-4 Sentence Executive Summary</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">Captures your key capabilities and career trajectory clearly.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Categorized Skills Matrix</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">Organizes languages, frameworks, tools, and soft competencies.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================= */
          /* STAGE 2: INTERACTIVE STUDIO (LIVE RESUME + AI CHAT + ATS) */
          /* ======================================================= */
          <div className="space-y-6">
            {/* Success Banner & ATS Highlights */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Your Resume is Ready!</h2>
                  <p className="text-xs text-slate-600">
                    Generated from your description with high ATS compatibility and structured impact bullets.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>ATS Score: {aiScores.atsCompatibility}/100</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                  Quality: {aiScores.overallQuality}/100
                </div>
                <button
                  onClick={handleOpenInBuilder}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Open in Builder</span>
                </button>
              </div>
            </div>

            {/* Missing Information / High-Impact Questions Alert */}
            {missingInfoAlerts.length > 0 && (
              <div className="bg-amber-50/80 rounded-2xl border border-amber-200/80 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      A few details could make your resume even stronger:
                    </h3>
                  </div>
                  <span className="text-[11px] text-amber-700 font-medium">Answer to update resume live</span>
                </div>

                <div className="space-y-3 mt-3">
                  {missingInfoAlerts.map(item => {
                    const isAnswered = answeredAlertIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border transition-all ${
                          isAnswered ? 'bg-emerald-50 border-emerald-200 opacity-60' : 'bg-white border-amber-200'
                        }`}
                      >
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-900">{item.question}</p>
                        </div>

                        {!isAnswered ? (
                          <div className="flex items-center gap-2 sm:w-96">
                            <input
                              type="text"
                              placeholder={item.placeholder}
                              value={quickAnswers[item.id] || ''}
                              onChange={e => setQuickAnswers({ ...quickAnswers, [item.id]: e.target.value })}
                              onKeyDown={e => e.key === 'Enter' && handleAnswerMissingInfo(item)}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50"
                            />
                            <button
                              type="button"
                              onClick={() => handleAnswerMissingInfo(item)}
                              disabled={!quickAnswers[item.id]?.trim() || isChatProcessing}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shrink-0 transition-colors disabled:opacity-50"
                            >
                              Add
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Added
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Split Screen Workspace: Controls & AI Follow-up on Left, Document on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Template Switcher & AI Follow-Up Assistant */}
              <div className="lg:col-span-5 space-y-6">
                {/* Template Selector Bar */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      <span>Choose Template Style</span>
                    </h3>
                    <span className="text-[11px] text-slate-400">8 Styles Available</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TEMPLATES.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSelectTemplate(t.id)}
                        className={`p-2 rounded-xl text-left border transition-all ${
                          selectedTemplate === t.id
                            ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                            : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-bold text-xs truncate">{t.name}</div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">{t.tag}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Follow-Up Refinement Console */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">AI Resume Strategist</h3>
                        <span className="text-[10px] text-emerald-600 font-medium">Ready to refine & tailor</span>
                      </div>
                    </div>
                  </div>

                  {/* Message History */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`max-w-[88%] rounded-2xl p-3.5 ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white rounded-br-xs'
                              : 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-bl-xs'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          {msg.changes && msg.changes.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] space-y-1">
                              <span className="font-bold text-slate-700">Applied Updates:</span>
                              {msg.changes.map((ch, idx) => (
                                <div key={idx} className="flex items-center gap-1 text-slate-600">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>{ch}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                      </div>
                    ))}

                    {isChatProcessing && (
                      <div className="flex items-center gap-2 text-slate-500 text-xs p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                        <span>Applying requested updates to resume...</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Action Chips */}
                  <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSendChat('Make this resume more suitable for a senior leadership role with stronger executive action verbs.')}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-700 whitespace-nowrap"
                    >
                      Make Senior Level
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendChat('Optimize this resume for maximum ATS keyword match and clarity.')}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-700 whitespace-nowrap"
                    >
                      Optimize for ATS
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendChat('Make the professional summary more concise and punchy.')}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-700 whitespace-nowrap"
                    >
                      Punchy Summary
                    </button>
                  </div>

                  {/* Chat Input Bar */}
                  <div className="p-3 border-t border-slate-200 flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                      placeholder="e.g. Add Firebase to skills, or emphasize my e-commerce project..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                    <button
                      type="button"
                      disabled={!chatInput.trim() || isChatProcessing}
                      onClick={() => handleSendChat()}
                      className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Reset or Generate Another */}
                <div className="flex items-center justify-between text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGeneratedResume(null);
                      setGenerationStep(0);
                    }}
                    className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Start Over / New Description</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyMarkdown}
                    className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNotification ? 'Copied Markdown!' : 'Copy Markdown'}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live Resume Document Preview */}
              <div className="lg:col-span-7 space-y-4">
                {/* Preview Toolbar */}
                <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Live Preview:</span>
                    <span className="font-semibold text-blue-600">
                      {TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'Modern Clean'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewZoom(prev => Math.max(0.5, prev - 0.05))}
                      className="p-1 rounded hover:bg-slate-100 text-slate-600"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono text-slate-500 min-w-[36px] text-center">
                      {Math.round(previewZoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewZoom(prev => Math.min(1.2, prev + 0.05))}
                      className="p-1 rounded hover:bg-slate-100 text-slate-600"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Rendered Sheet Container */}
                <div className="bg-slate-200/70 p-4 sm:p-6 rounded-2xl border border-slate-300/80 shadow-inner flex justify-center overflow-x-auto min-h-[700px]">
                  <div style={{ transform: `scale(${previewZoom})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}>
                    <ResumeTemplateRenderer resume={generatedResume} isPreview={false} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
