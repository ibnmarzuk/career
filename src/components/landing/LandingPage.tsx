import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Target,
  Wand2,
  Upload,
  Layers,
  ChevronRight,
  Star,
  Quote,
  Zap,
  Lock,
  Download,
  HelpCircle,
  BarChart3,
  Check,
  X,
  ExternalLink,
  Laptop,
  Briefcase,
  Play,
  RotateCcw,
  Sparkle,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Shield,
  FileCheck,
  Globe,
  LifeBuoy,
  MessageSquare,
  Send,
  Scale,
  Award,
  Clock,
  Heart
} from 'lucide-react';
import { ResumeData, TemplateId } from '../../types/resume';
import { useAuth } from '../../context/AuthContext';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onCreateResume: () => void;
  onUploadCV: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onCreateResume,
  onUploadCV,
}) => {
  const { isAuthenticated } = useAuth();

  // Interactive Live Demo State for Hero/Feature section
  const [demoInput, setDemoInput] = useState(
    'Responsible for making website faster and helped the marketing team with campaigns.'
  );
  const [demoTone, setDemoTone] = useState<'impactful' | 'concise' | 'executive'>('impactful');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedResult, setEnhancedResult] = useState<string | null>(
    'Spearheaded frontend performance overhaul utilizing code-splitting and asset optimization, slashing Core Web Vitals LCP by 44% and driving a 22% increase in campaign conversion rate.'
  );

  // Template Showcase active tab
  const [activeTemplateTab, setActiveTemplateTab] = useState<'modern-clean' | 'executive-pro' | 'tech-minimalist' | 'creative-bold'>('modern-clean');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Legal & Contact Modals
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', topic: 'general' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopyLink = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 3000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.email) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setIsContactOpen(false);
      setContactForm({ name: '', email: '', message: '', topic: 'general' });
    }, 2500);
  };

  const sampleBullets = [
    {
      label: 'Engineering / Tech',
      original: 'Responsible for making website faster and helped the marketing team with campaigns.',
      enhanced: 'Spearheaded frontend performance overhaul utilizing code-splitting and asset optimization, slashing Core Web Vitals LCP by 44% and driving a 22% increase in campaign conversion rate.',
    },
    {
      label: 'Product / Management',
      original: 'Led weekly meetings and managed product backlog in Jira.',
      enhanced: 'Orchestrated cross-functional agile sprints for 14 engineers and designers, accelerating feature release velocity by 35% across 4 major product cycles.',
    },
    {
      label: 'Marketing / Growth',
      original: 'Sent out email newsletters and grew social media accounts.',
      enhanced: 'Executed data-driven lifecycle email sequences and omni-channel growth campaigns, boosting subscriber retention by 28% and generating $180K in pipeline ARR.',
    },
  ];

  const handleSimulateEnhance = (text: string, tone: 'impactful' | 'concise' | 'executive') => {
    setIsEnhancing(true);
    setTimeout(() => {
      if (tone === 'concise') {
        setEnhancedResult(
          'Optimized web application architecture, improving load speed by 44% and boosting marketing conversions by 22%.'
        );
      } else if (tone === 'executive') {
        setEnhancedResult(
          'Directed technical modernization and high-conversion web funnel infrastructure, delivering measurable latency reductions of 44% aligned with strategic marketing objectives.'
        );
      } else {
        setEnhancedResult(
          'Spearheaded frontend performance overhaul utilizing code-splitting and asset optimization, slashing Core Web Vitals LCP by 44% and driving a 22% increase in campaign conversion rate.'
        );
      }
      setIsEnhancing(false);
    }, 600);
  };

  const faqs = [
    {
      question: 'How does ResumeForge AI guarantee 95%+ ATS pass rates?',
      answer:
        'Our algorithms format every resume with parse-friendly semantic hierarchy, standard system typography, verified section tokens, and zero invisible tables or multi-column traps that confuse Applicant Tracking Systems like Greenhouse, Lever, and Workday.',
    },
    {
      question: 'Can I upload my existing PDF or Word CV?',
      answer:
        'Yes! Our built-in document parser extracts your contact details, work experience, achievements, education, and skills in seconds, populating your editable workspace immediately.',
    },
    {
      question: 'Does the AI fabricate fake work history or metrics?',
      answer:
        'Never. Our strict grounding model enhances your existing accomplishments with active verbs and quantified framing suggestions without ever hallucinating fictional companies, degrees, or certifications.',
    },
    {
      question: 'Is my personal information and resume data private?',
      answer:
        'All documents and profile data are protected with Firebase Firestore security rules and isolated to your authenticated account. We never sell or share your career data.',
    },
    {
      question: 'Can I export to both PDF and plain text?',
      answer:
        'Yes, you can generate pixel-perfect vector PDFs formatted for A4 and US Letter sizes, as well as copy clean ATS plain text for direct portal submissions.',
    },
  ];

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen selection:bg-blue-600 selection:text-white font-sans">
      {/* Top Notice Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-700 text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <span>ResumeForge AI 2.0 is live: Powered by Google Gemini AI &amp; Real-time ATS Scanners</span>
        <button
          onClick={() => (isAuthenticated ? onNavigate('dashboard') : onNavigate('signup'))}
          className="underline hover:text-blue-200 ml-1 transition-colors"
        >
          Try Free &rarr;
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Next-Generation Career Intelligence &amp; Resume Studio</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Land <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">3x More Interviews</span> with ATS-Engineered Resumes
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Build, optimize, and job-match professional resumes with Gemini AI. Real-time ATS score diagnostics, pixel-perfect PDF export, and verified ATS templates.
            </p>

            {/* CTA Button Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    onNavigate('dashboard');
                  } else {
                    onCreateResume();
                  }
                }}
                className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>{isAuthenticated ? 'Open Your Dashboard' : 'Build Free Resume Now'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onUploadCV}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-blue-400" />
                <span>Upload &amp; Scan Existing CV</span>
              </button>

              <button
                onClick={() => onNavigate('ai-generator')}
                className="w-full sm:w-auto px-5 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm rounded-xl border border-slate-700/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Wand2 className="w-4 h-4 text-indigo-400" />
                <span>AI Generator</span>
              </button>
            </div>

            {/* Trust Signals */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Greenhouse &amp; Workday ATS Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant Vector PDF Export</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Showcase Preview */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 p-2 sm:p-4 shadow-2xl shadow-blue-900/20 backdrop-blur-sm">
              <div className="bg-slate-950 rounded-xl p-4 sm:p-6 border border-slate-800">
                {/* Mock Browser Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs text-slate-500 font-mono ml-2 hidden sm:inline">
                      resumeforge.ai/builder/alexander-wright
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      ATS Compatibility: 98%
                    </span>
                    <button
                      onClick={() => onNavigate('builder')}
                      className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Live Editor
                    </button>
                  </div>
                </div>

                {/* Split Interactive Showcase Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Left Column: AI Feature Highlights */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span className="flex items-center gap-1.5 text-blue-400">
                          <Target className="w-4 h-4" />
                          Job Match Score
                        </span>
                        <span className="text-emerald-400 font-bold">92% Match</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full w-[92%]" />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Matches 12 of 13 target keywords for <span className="text-slate-200">Senior Full Stack Engineer</span>
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span className="flex items-center gap-1.5 text-indigo-400">
                          <Wand2 className="w-4 h-4" />
                          AI Bullet Rewriter
                        </span>
                        <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">
                          Gemini 2.5
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 line-through">
                        "Built components for checkout flow."
                      </div>
                      <div className="text-xs text-emerald-300 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40">
                        "Engineered zero-latency React checkout workflow, increasing completion rates by 19% across 450K monthly transactions."
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1 px-1">
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Auto-Save Active
                      </span>
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> 4 Archetypes Ready
                      </span>
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> PDF Download
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Mini Resume Preview Card */}
                  <div className="lg:col-span-7 bg-white text-slate-900 p-6 sm:p-8 rounded-xl shadow-xl space-y-4 text-left select-none">
                    <div className="border-b border-slate-200 pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Alexander Wright</h3>
                          <p className="text-xs font-semibold text-blue-600">Senior Full Stack Engineer</p>
                        </div>
                        <div className="text-right text-[10px] text-slate-500 space-y-0.5">
                          <div>alex.wright@example.com</div>
                          <div>San Francisco, CA &bull; +1 (555) 019-2834</div>
                          <div>linkedin.com/in/alexander-wright</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-0.5">
                        Professional Summary
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Results-driven Senior Full Stack Engineer with 6+ years specializing in distributed TypeScript microservices, high-performance React architectures, and cloud workflow systems.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-0.5">
                        Work Experience
                      </h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-slate-800">
                          <span>Senior Full Stack Engineer &bull; Acme Corporation</span>
                          <span className="text-slate-500 font-normal">2022 &ndash; Present</span>
                        </div>
                        <ul className="text-[10px] text-slate-600 space-y-1 list-disc list-inside">
                          <li>
                            Architected cloud microservices handling 2M+ daily asynchronous jobs with 99.99% uptime.
                          </li>
                          <li>
                            Accelerated application render performance by 35% through custom virtualized data grids.
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL', 'Docker', 'AWS'].map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Logos */}
          <div className="mt-14 text-center">
            <p className="text-xs uppercase tracking-widest text-slate-300 font-semibold mb-6">
              Empowering top candidates hired at leading companies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-slate-400 font-bold text-sm tracking-wider opacity-85">
              <span className="hover:text-slate-300 transition-colors">GOOGLE</span>
              <span className="hover:text-slate-300 transition-colors">MICROSOFT</span>
              <span className="hover:text-slate-300 transition-colors">AMAZON</span>
              <span className="hover:text-slate-300 transition-colors">META</span>
              <span className="hover:text-slate-300 transition-colors">STRIPE</span>
              <span className="hover:text-slate-300 transition-colors">AIRBNB</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AI Bullet Transformer Sandbox */}
      <section className="py-16 bg-slate-950 border-t border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
              <Wand2 className="w-3.5 h-3.5" />
              <span>Interactive AI Demonstration</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Test Our Bullet Point Enhancer Live
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Select a sample unoptimized bullet point or type your own, then watch Gemini AI re-engineer it for maximum ATS weight and recruiter impact.
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="text-xs text-slate-400 mr-1">Sample presets:</span>
            {sampleBullets.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDemoInput(sample.original);
                  setEnhancedResult(sample.enhanced);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>

          {/* Interactive transformation box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Your Raw Bullet Point (Draft)
              </label>
              <textarea
                value={demoInput}
                onChange={e => setDemoInput(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Type your bullet point here..."
              />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Target Tone:</span>
                {(['impactful', 'concise', 'executive'] as const).map(tone => (
                  <button
                    key={tone}
                    onClick={() => {
                      setDemoTone(tone);
                      handleSimulateEnhance(demoInput, tone);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium capitalize transition-colors cursor-pointer ${
                      demoTone === tone
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleSimulateEnhance(demoInput, demoTone)}
                disabled={isEnhancing || !demoInput.trim()}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
                <span>{isEnhancing ? 'Optimizing with AI...' : 'Enhance with AI'}</span>
              </button>
            </div>

            {/* Result preview */}
            {enhancedResult && (
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> AI-Enhanced Output
                  </span>
                  <span className="text-[11px] text-slate-400">+35% ATS Score Impact</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">{enhancedResult}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Core Feature Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">Everything You Need to Win</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Job Seekers Who Demand Results
          </h3>
          <p className="text-sm text-slate-400">
            Every feature was built to eliminate recruiter friction and pass every enterprise screening algorithm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-slate-600 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Live Split-Screen Resume Builder</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Edit sections, reorder categories with drag and drop, and watch your changes render instantly in a real-time vector preview.
              </p>
            </div>
            <button
              onClick={() => onNavigate('builder')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 pt-2 cursor-pointer"
            >
              <span>Explore Builder</span> &rarr;
            </button>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-slate-600 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">8-Factor ATS Compatibility Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scan your resume against strict keyword density, action verb ratios, format compatibility, and grammar checks.
              </p>
            </div>
            <button
              onClick={() => onNavigate('analyzer')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 pt-2 cursor-pointer"
            >
              <span>View ATS Diagnostic</span> &rarr;
            </button>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-slate-600 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Target Job Description Matcher</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste any job posting to extract key requirements, identify missing skills, and tailor your bullets to match the job.
              </p>
            </div>
            <button
              onClick={() => onNavigate('job-matcher')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 pt-2 cursor-pointer"
            >
              <span>Match Job Posting</span> &rarr;
            </button>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-slate-600 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">4 Certified Layout Archetypes</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Switch between Modern Clean, Executive Pro, Tech Minimalist, and Creative Bold without re-entering any data.
              </p>
            </div>
            <button
              onClick={() => onNavigate('templates')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 pt-2 cursor-pointer"
            >
              <span>Preview Templates</span> &rarr;
            </button>
          </div>

          {/* Feature 5 */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-slate-600 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Pixel-Perfect PDF Generation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate pure vector PDFs formatted for A4 or US Letter, with clickable hyperlinks and clean margin balance.
              </p>
            </div>
            <button
              onClick={() => onNavigate('builder')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 pt-2 cursor-pointer"
            >
              <span>Test PDF Engine</span> &rarr;
            </button>
          </div>

          {/* Feature 6 */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-slate-600 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Firebase Security &amp; Cloud Sync</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your resumes and versions are automatically stored in secure cloud database storage with instant revision history.
              </p>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 pt-2 cursor-pointer"
            >
              <span>Open Dashboard</span> &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Template Showcase */}
      <section className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Universal Data Model</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              One Resume. Four ATS-Certified Archetypes.
            </h2>
            <p className="text-sm text-slate-400">
              Switch themes with one click. Your career data never breaks or gets lost between styles.
            </p>
          </div>

          {/* Template Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { id: 'modern-clean', label: 'Modern Clean', badge: 'Most Popular' },
              { id: 'executive-pro', label: 'Executive Pro', badge: 'Leadership' },
              { id: 'tech-minimalist', label: 'Tech Minimalist', badge: 'Developers' },
              { id: 'creative-bold', label: 'Creative Bold', badge: 'Product & Design' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTemplateTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTemplateTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-normal ${
                    activeTemplateTab === tab.id ? 'bg-blue-700 text-blue-100' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Template Mockup Card */}
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
            <div className="bg-white text-slate-900 rounded-xl p-8 shadow-md space-y-6">
              {activeTemplateTab === 'modern-clean' && (
                <div className="space-y-4">
                  <div className="border-b-2 border-blue-600 pb-3">
                    <h3 className="text-2xl font-bold text-slate-900">Sarah Jenkins</h3>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Product Marketing Director</p>
                    <p className="text-xs text-slate-500 mt-1">sarah.j@example.com &bull; New York, NY &bull; (555) 392-1094</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider">Experience</h4>
                    <div className="text-xs text-slate-700 space-y-0.5">
                      <div className="font-bold flex justify-between">
                        <span>Director of Growth Marketing &bull; Apex SaaS</span>
                        <span className="text-slate-500 font-normal">2021 &ndash; Present</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Led 8-person growth engine increasing self-serve ARR from $4M to $12M in 24 months.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTemplateTab === 'executive-pro' && (
                <div className="space-y-4">
                  <div className="bg-slate-900 text-white p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">David Vance</h3>
                      <p className="text-xs text-slate-300">VP of Engineering &bull; Cloud Infrastructure</p>
                    </div>
                    <div className="text-right text-[10px] text-slate-400">
                      <div>david.vance@example.com</div>
                      <div>Austin, TX</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div className="col-span-2 space-y-2">
                      <h4 className="font-bold border-b border-slate-300 pb-0.5">Executive Career Highlights</h4>
                      <p className="text-[11px] text-slate-600">
                        Scaled engineering organization from 20 to 120 engineers while managing $18M annual cloud budget.
                      </p>
                    </div>
                    <div className="space-y-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                      <h4 className="font-bold text-[11px]">Core Competencies</h4>
                      <div className="text-[10px] text-slate-600 space-y-1">
                        <div>&bull; Cloud Architecture</div>
                        <div>&bull; Agile Governance</div>
                        <div>&bull; Org Scaling</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTemplateTab === 'tech-minimalist' && (
                <div className="space-y-3 font-mono">
                  <div className="border-b border-slate-900 pb-2">
                    <div className="text-lg font-bold">root@dev:~$ cat profile.json</div>
                    <div className="text-xs text-slate-600">Name: Marcus Chen | Role: Staff Backend Architect | Loc: Seattle, WA</div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="font-bold">// CORE SYSTEMS EXPERIENCE</div>
                    <div className="text-[11px] text-slate-700">
                      &bull; High-Throughput Distributed Kafka Streams (10M msgs/sec)
                      <br />
                      &bull; Zero-Downtime Database Sharding in Go &amp; PostgreSQL
                    </div>
                  </div>
                </div>
              )}

              {activeTemplateTab === 'creative-bold' && (
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-600 pl-4 py-1">
                    <h3 className="text-2xl font-black text-slate-900">Elena Rostova</h3>
                    <p className="text-xs font-bold text-purple-600">Principal UX / UI Architect</p>
                  </div>
                  <p className="text-xs text-slate-600">
                    Designing intuitive enterprise software experiences used by 3M+ daily professionals worldwide.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">All 4 templates available on free and pro plans.</span>
              <button
                onClick={() => onNavigate('templates')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Use This Template &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table: ResumeForge vs Old Tools */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">Why We Are Different</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Modern 2026 Hiring Systems
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-xs uppercase tracking-wider text-slate-400">
                <th className="p-4 sm:p-5">Feature</th>
                <th className="p-4 sm:p-5 text-blue-400 font-bold bg-blue-950/30 border-l border-r border-blue-900/40">
                  ResumeForge AI
                </th>
                <th className="p-4 sm:p-5">Generic AI Chatbots</th>
                <th className="p-4 sm:p-5">Word / Canva Templates</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-300 divide-y divide-slate-800">
              <tr>
                <td className="p-4 font-semibold text-white">Live Split-Screen Live Preview</td>
                <td className="p-4 bg-blue-950/20 border-l border-r border-blue-900/30 font-bold text-emerald-400">
                  <Check className="w-4 h-4 inline mr-1.5" /> Instant Live Render
                </td>
                <td className="p-4 text-slate-500">
                  <X className="w-4 h-4 inline mr-1.5 text-rose-400" /> Text only
                </td>
                <td className="p-4 text-slate-400">Manual layout drag</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">8-Factor ATS Score Diagnostic</td>
                <td className="p-4 bg-blue-950/20 border-l border-r border-blue-900/30 font-bold text-emerald-400">
                  <Check className="w-4 h-4 inline mr-1.5" /> Real-time Math Score
                </td>
                <td className="p-4 text-slate-500">
                  <X className="w-4 h-4 inline mr-1.5 text-rose-400" /> None
                </td>
                <td className="p-4 text-slate-500">
                  <X className="w-4 h-4 inline mr-1.5 text-rose-400" /> None
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">Job Description Matching</td>
                <td className="p-4 bg-blue-950/20 border-l border-r border-blue-900/30 font-bold text-emerald-400">
                  <Check className="w-4 h-4 inline mr-1.5" /> Skill gap breakdown
                </td>
                <td className="p-4 text-slate-400">Requires manual prompt</td>
                <td className="p-4 text-slate-500">
                  <X className="w-4 h-4 inline mr-1.5 text-rose-400" /> None
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">Hallucination-Free AI Engine</td>
                <td className="p-4 bg-blue-950/20 border-l border-r border-blue-900/30 font-bold text-emerald-400">
                  <Check className="w-4 h-4 inline mr-1.5" /> Strictly Grounded
                </td>
                <td className="p-4 text-slate-400">Often invents metrics</td>
                <td className="p-4 text-slate-400">Manual user input</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">Cloud Autosave &amp; Version History</td>
                <td className="p-4 bg-blue-950/20 border-l border-r border-blue-900/30 font-bold text-emerald-400">
                  <Check className="w-4 h-4 inline mr-1.5" /> Firebase Firestore
                </td>
                <td className="p-4 text-slate-500">
                  <X className="w-4 h-4 inline mr-1.5 text-rose-400" /> None
                </td>
                <td className="p-4 text-slate-400">Local files only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">Real Candidate Success</h2>
            <h3 className="text-3xl font-extrabold text-white">Loved by 45,000+ Job Seekers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Rachel Kim',
                role: 'Senior Product Manager @ Fintech Scaleup',
                quote:
                  'The Job Description Matcher changed my search entirely. I tailored my resume for 6 targeted roles and got 4 interview callbacks within 10 days.',
                rating: 5,
              },
              {
                name: 'Marcus Brody',
                role: 'Lead Cloud Architect @ HealthTech Corp',
                quote:
                  'Applicant tracking systems were discarding my Word doc for 3 months. After switching to the Modern Clean template and ATS optimizer, I passed every screen.',
                rating: 5,
              },
              {
                name: 'Samantha Lee',
                role: 'Software Engineer @ Series B SaaS',
                quote:
                  'The bullet point action-verb rewriter made my contributions sound executive and quantified without fabricating any false claims. Truly exceptional.',
                rating: 5,
              },
            ].map((testi, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(testi.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">"{testi.quote}"</p>
                </div>
                <div className="pt-3 border-t border-slate-800">
                  <div className="text-xs font-bold text-white">{testi.name}</div>
                  <div className="text-[11px] text-slate-400">{testi.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">Got Questions?</h2>
          <h3 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-slate-200 hover:text-white flex justify-between items-center transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90 text-blue-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/10">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Build Your Winning Resume?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Join thousands of professionals securing dream offers with AI-optimized, ATS-certified resumes.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  onNavigate('dashboard');
                } else {
                  onCreateResume();
                }
              }}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>{isAuthenticated ? 'Go to Your Dashboard' : 'Get Started Free'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onUploadCV}
              className="w-full sm:w-auto px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              Upload Existing CV
            </button>
          </div>
        </div>
      </section>

      {/* Comprehensive SaaS Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
        {/* Newsletter & ATS Guide Banner */}
        <div className="border-b border-slate-800/80 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[10px] uppercase tracking-wider border border-blue-500/30">
                    Weekly Career Brief
                  </span>
                  <span className="text-slate-300 font-semibold text-sm">Join 45,000+ ambitious candidates</span>
                </div>
                <p className="text-xs text-slate-400 max-w-xl">
                  Get our exclusive 2026 ATS keyword cheat sheets, hiring trend breakdowns, and AI prompt templates delivered every Tuesday.
                </p>
              </div>

              <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto flex flex-col sm:flex-row gap-2 max-w-md">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your work or personal email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
            {newsletterSubmitted && (
              <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you! We've sent your 2026 ATS Optimization Blueprint to your inbox.</span>
              </div>
            )}
          </div>
        </div>

        {/* 5-Column Navigation Links */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            {/* Column 1: Brand & Socials */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-white text-base tracking-tight">ResumeForge</span>
                  <span className="text-[10px] font-bold ml-1.5 px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    AI v2.4
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                The intelligent career studio combining Gemini AI precision, deterministic ATS compliance, and real-time document previewing.
              </p>

              {/* Live Status */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All AI &amp; Cloud Systems Operational</span>
              </div>

              {/* Social Media Handles */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-slate-300 mb-2.5 uppercase tracking-wider">Connect &amp; Follow</div>
                <div className="flex items-center gap-2 text-slate-400">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 hover:bg-slate-850 transition-all cursor-pointer"
                    title="GitHub Repository & Community"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-blue-400 hover:border-blue-500/40 hover:bg-slate-850 transition-all cursor-pointer"
                    title="LinkedIn Community"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-850 transition-all cursor-pointer"
                    title="X (formerly Twitter)"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setIsContactOpen(true)}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-indigo-400 hover:border-indigo-500/40 hover:bg-slate-850 transition-all cursor-pointer"
                    title="Direct Support & Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyLink('https://resumeforge.ai', 'App Link')}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-amber-400 hover:border-amber-500/40 hover:bg-slate-850 transition-all cursor-pointer relative"
                    title="Share & Copy Link"
                  >
                    <Globe className="w-4 h-4" />
                    {copiedLink === 'App Link' && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-600 text-white text-[10px] rounded font-bold whitespace-nowrap shadow-md">
                        Copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Column 2: Product Capabilities */}
            <div className="space-y-3">
              <div className="font-bold text-slate-200 text-sm tracking-wide">Product Platform</div>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => onNavigate('builder')} className="hover:text-blue-400 transition-colors text-left flex items-center gap-1.5">
                    <span>Split-Screen Resume Builder</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('ai-generator')} className="hover:text-blue-400 transition-colors text-left flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span className="text-white font-medium">1-Click AI Generator</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('analyzer')} className="hover:text-blue-400 transition-colors text-left">
                    ATS 8-Factor Scanner
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('job-matcher')} className="hover:text-blue-400 transition-colors text-left">
                    Job Match &amp; Keyword Gap
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('cover-letter')} className="hover:text-blue-400 transition-colors text-left">
                    Cover Letter Engine
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('templates')} className="hover:text-blue-400 transition-colors text-left">
                    Template Catalog (4 Archetypes)
                  </button>
                </li>
                <li>
                  <button onClick={onUploadCV} className="hover:text-blue-400 transition-colors text-left flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Upload &amp; Extract CV</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Solutions by Role */}
            <div className="space-y-3">
              <div className="font-bold text-slate-200 text-sm tracking-wide">Tailored For</div>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => onNavigate('templates')} className="hover:text-slate-200 transition-colors text-left">
                    Software &amp; Cloud Engineers
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('templates')} className="hover:text-slate-200 transition-colors text-left">
                    Product Managers &amp; Owners
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('templates')} className="hover:text-slate-200 transition-colors text-left">
                    Data Scientists &amp; AI Analysts
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('templates')} className="hover:text-slate-200 transition-colors text-left">
                    Marketing, Growth &amp; Sales
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('templates')} className="hover:text-slate-200 transition-colors text-left">
                    Finance &amp; Strategy
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('templates')} className="hover:text-slate-200 transition-colors text-left">
                    Recent Graduates &amp; Interns
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('templates')} className="hover:text-slate-200 transition-colors text-left">
                    Executive &amp; VP Leadership
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Guides & Resources */}
            <div className="space-y-3">
              <div className="font-bold text-slate-200 text-sm tracking-wide">Resources &amp; Insights</div>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setOpenFaq(0);
                      window.scrollTo({ top: 1800, behavior: 'smooth' });
                    }}
                    className="hover:text-slate-200 transition-colors text-left"
                  >
                    ATS Compliance Masterclass
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setOpenFaq(1);
                      window.scrollTo({ top: 1800, behavior: 'smooth' });
                    }}
                    className="hover:text-slate-200 transition-colors text-left"
                  >
                    Action Verb &amp; Metric Formulas
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('pricing')} className="hover:text-slate-200 transition-colors text-left">
                    Pricing &amp; Pro Access
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsContactOpen(true)} className="hover:text-slate-200 transition-colors text-left flex items-center gap-1.5">
                    <LifeBuoy className="w-3.5 h-3.5 text-blue-400" />
                    <span>Candidate Help Desk</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setOpenFaq(3);
                      window.scrollTo({ top: 1800, behavior: 'smooth' });
                    }}
                    className="hover:text-slate-200 transition-colors text-left"
                  >
                    Data Privacy &amp; AI Safety Guide
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 5: Legal & Trust */}
            <div className="space-y-3">
              <div className="font-bold text-slate-200 text-sm tracking-wide">Trust &amp; Legal</div>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setIsTermsOpen(true)}
                    className="text-slate-300 hover:text-white font-medium transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5 text-slate-400" />
                    <span>Terms of Service</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsPrivacyOpen(true)}
                    className="text-slate-300 hover:text-white font-medium transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span>Privacy Policy</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsPrivacyOpen(true)}
                    className="hover:text-slate-200 transition-colors text-left flex items-center gap-1"
                  >
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>GDPR &amp; CCPA Rights</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCopyLink('support@resumeforge.ai', 'Email')}
                    className="hover:text-slate-200 transition-colors text-left flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>support@resumeforge.ai</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsContactOpen(true)}
                    className="hover:text-slate-200 transition-colors text-left"
                  >
                    Enterprise &amp; University Inquiries
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Trust & Copyright Strip */}
        <div className="border-t border-slate-800/80 bg-slate-950 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[11px] text-slate-500">
              <span>&copy; {new Date().getFullYear()} ResumeForge AI Inc. All rights reserved.</span>
              <span className="hidden sm:inline">&bull;</span>
              <button onClick={() => setIsTermsOpen(true)} className="hover:text-slate-300 transition-colors underline cursor-pointer">
                Terms of Service
              </button>
              <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-slate-300 transition-colors underline cursor-pointer">
                Privacy Policy
              </button>
              <button onClick={() => setIsContactOpen(true)} className="hover:text-slate-300 transition-colors underline cursor-pointer">
                Contact &amp; Support
              </button>
            </div>

            {/* Security Compliance Badges */}
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                <Lock className="w-3 h-3 text-emerald-400" />
                256-Bit SSL
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                <Shield className="w-3 h-3 text-blue-400" />
                GDPR Compliant
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                <Award className="w-3 h-3 text-amber-400" />
                ATS Certified
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          MODALS: TERMS OF SERVICE, PRIVACY POLICY, CONTACT SUPPORT
         ========================================================================= */}

      {/* Terms of Service Modal */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Terms of Service</h3>
                  <p className="text-xs text-slate-400">Last updated: August 2026 &bull; Version 2.4</p>
                </div>
              </div>
              <button
                onClick={() => setIsTermsOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed font-sans">
              <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300">
                <strong>Summary for Candidates:</strong> You own 100% of the resume and cover letter content you create or optimize with ResumeForge AI. We never sell your personal contact or employment information.
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1.5">1. Acceptance of Terms</h4>
                <p>
                  By accessing or utilizing ResumeForge AI ("the Service"), including our resume builders, ATS analyzer, AI rewriting engines, and PDF generation toolsets, you agree to be legally bound by these Terms of Service. If you do not agree to these terms, you must discontinue use immediately.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1.5">2. User Accounts &amp; Authentication</h4>
                <p>
                  You are responsible for maintaining the confidentiality of your account credentials. You agree not to share your credentials or authorize third parties to access your account. All resumes stored within your profile are private and secured through Firebase Firestore Row-Level Security.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1.5">3. AI Content &amp; Intellectual Property</h4>
                <p>
                  <strong>User Ownership:</strong> You retain full copyright and ownership of all personal data, work history, educational records, and resumes produced or exported through ResumeForge AI.
                </p>
                <p className="mt-1">
                  <strong>AI Assistance &amp; Verification:</strong> ResumeForge AI utilizes large language models (such as Google Gemini) to assist in phrasing, ATS keyword matching, and document formatting. While our algorithms enforce strict factual grounding rules, candidates are solely responsible for reviewing and verifying the accuracy and authenticity of all facts, dates, and claims before submitting resumes to prospective employers.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1.5">4. Fair Usage &amp; Subscriptions</h4>
                <p>
                  Free accounts receive foundational resume building and export features. Pro and Premium subscriptions unlock unlimited AI rewrites, advanced ATS keyword gap analysis, full cover letter generation, and premium styling archetypes. You may cancel your subscription at any time through your dashboard settings.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1.5">5. Limitation of Liability</h4>
                <p>
                  ResumeForge AI provides career preparation tools designed to optimize application quality. We do not guarantee interview offers or employment outcomes, as hiring decisions are made independently by third-party employers.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">ResumeForge AI Legal &bull; USA &amp; International</span>
              <button
                onClick={() => setIsTermsOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                I Understand &amp; Agree
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Privacy Policy</h3>
                  <p className="text-xs text-slate-400">GDPR, CCPA &amp; Zero-Data-Selling Pledge</p>
                </div>
              </div>
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed font-sans">
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300">
                <strong>Our Core Privacy Promise:</strong> We never sell, monetize, or rent your resume data or job application history to third-party recruiters or advertising brokers.
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1.5">1. Information We Collect</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li><strong>Account Credentials:</strong> Email address, name, and profile settings for authentication.</li>
                  <li><strong>Resume &amp; Document Data:</strong> Work experience, education, skills, projects, and contact info you input or upload.</li>
                  <li><strong>Target Job Data:</strong> Job descriptions and keywords you submit for matching analysis.</li>
                  <li><strong>Usage Telemetry:</strong> Anonymized performance metrics to optimize template rendering and latency.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1.5">2. How AI &amp; Gemini Processing Works</h4>
                <p>
                  When you request AI bullet rewriting, ATS scoring, or cover letter drafting, your text is securely passed via encrypted server-side channels to the Gemini API. <strong>Your private resume content is never used to train public foundation models</strong>.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1.5">3. Data Security &amp; Storage</h4>
                <p>
                  All user data is encrypted in transit (TLS 1.3 / HTTPS) and at rest with AES-256 encryption via Google Cloud Firestore. Database access is strictly sandboxed per authenticated user identifier (UID).
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1.5">4. Your Rights (GDPR &amp; CCPA)</h4>
                <p>
                  You have the right to request an export of your data or complete permanent deletion of your account and all associated resumes at any time. Simply use the Account Settings page or contact our data privacy officer at <code>privacy@resumeforge.ai</code>.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Encrypted with 256-bit SSL</span>
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Close Privacy Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact & Support Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Contact &amp; Candidate Support</h3>
                  <p className="text-xs text-slate-400">We typically reply in under 2 hours</p>
                </div>
              </div>
              <button
                onClick={() => setIsContactOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            {contactSubmitted ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Message Sent Successfully!</h4>
                <p className="text-xs text-slate-300">
                  Thank you for reaching out. Our support team has received your ticket and will follow up at <strong>{contactForm.email}</strong> shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2 bg-slate-850 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full px-3.5 py-2 bg-slate-850 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Topic</label>
                  <select
                    value={contactForm.topic}
                    onChange={(e) => setContactForm({ ...contactForm, topic: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="general">General Feedback / Feature Request</option>
                    <option value="ats">ATS Parsing / Scoring Question</option>
                    <option value="billing">Billing or Subscription Inquiry</option>
                    <option value="enterprise">University or Enterprise Partner</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Message</label>
                  <textarea
                    rows={3}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="How can our career engineers help you today?"
                    className="w-full px-3.5 py-2 bg-slate-850 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsContactOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
