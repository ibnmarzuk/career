import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Briefcase,
  Target,
  Wand2,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Layers,
  GraduationCap,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CareerLevel, UserProfile } from '../../types/resume';

interface OnboardingPageProps {
  onNavigate: (view: string) => void;
  onComplete?: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onNavigate, onComplete }) => {
  const { user, completeOnboarding, updateUserProfile } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [goal, setGoal] = useState<'create_new' | 'improve_existing' | 'tailor_job' | 'create_cover_letter'>('create_new');
  const [careerLevel, setCareerLevel] = useState<CareerLevel>(user?.careerLevel || 'Mid Level');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Software Engineer');
  const [industry, setIndustry] = useState(user?.industry || 'Software & Technology');
  const [yearsOfExperience, setYearsOfExperience] = useState(user?.yearsOfExperience || '4-6 years');

  const careerLevels: { level: CareerLevel; desc: string; icon: any }[] = [
    { level: 'Student', desc: 'Currently enrolled in high school or university', icon: GraduationCap },
    { level: 'Graduate', desc: 'Recent graduate entering the job market', icon: Award },
    { level: 'Entry Level', desc: '0-2 years of full-time work experience', icon: Layers },
    { level: 'Mid Level', desc: '3-6 years of specialized track record', icon: Briefcase },
    { level: 'Senior', desc: '7+ years leading initiatives & mentoring', icon: TrendingUp },
    { level: 'Executive', desc: 'Director, VP, or C-suite leadership', icon: Sparkles },
    { level: 'Freelancer', desc: 'Independent contractor or consultant', icon: Zap },
    { level: 'Career Changer', desc: 'Pivoting domains or learning new skillsets', icon: Target },
  ];

  const suggestedRoles = [
    'Frontend Developer',
    'Full Stack Engineer',
    'Software Engineer',
    'UI/UX Designer',
    'Product Manager',
    'AI / Machine Learning Engineer',
    'Data Scientist',
    'DevOps & Cloud Engineer',
    'Marketing Manager',
    'Sales Development Rep',
  ];

  const handleFinish = (action: 'ai' | 'manual') => {
    completeOnboarding({
      primaryGoal: goal,
      careerLevel,
      targetRole,
      industry,
      yearsOfExperience,
    });

    if (onComplete) onComplete();

    if (action === 'ai') {
      onNavigate('ai-resume-generator');
    } else {
      onNavigate('resume-builder');
    }
  };

  const handleSkip = () => {
    completeOnboarding({
      primaryGoal: goal,
      careerLevel,
      targetRole,
      industry,
      yearsOfExperience,
    });
    if (onComplete) onComplete();
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-8 md:p-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Bar */}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white">ResumeForge AI</span>
            <span className="text-blue-400 font-bold ml-2 text-xs uppercase tracking-wider bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/50">
              Personalization
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === currentStep
                    ? 'w-7 bg-blue-500'
                    : s < currentStep
                    ? 'w-2 bg-emerald-400'
                    : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="text-xs text-slate-400 hover:text-white font-semibold px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-3xl mx-auto w-full my-auto py-8">
        {/* STEP 1: What do you want to do? */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Step 1 of 4</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">What do you want to do?</h1>
              <p className="text-sm text-slate-400 mt-1.5">
                Choose your primary objective so we can tailor AI prompts and ATS checklists.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  id: 'create_new',
                  title: 'Create a new resume',
                  desc: 'Generate or handcraft a pristine ATS-ready resume from scratch.',
                  icon: FileText,
                  badge: 'Most Popular',
                },
                {
                  id: 'improve_existing',
                  title: 'Improve my existing CV',
                  desc: 'Upload an existing document, run diagnostics, and rewrite weak bullets.',
                  icon: Sparkles,
                },
                {
                  id: 'tailor_job',
                  title: 'Tailor my resume to a job',
                  desc: 'Match keywords against a specific job description and close skill gaps.',
                  icon: Target,
                },
                {
                  id: 'create_cover_letter',
                  title: 'Create a cover letter',
                  desc: 'Generate an executive narrative aligned with your resume highlights.',
                  icon: Wand2,
                },
              ].map(item => {
                const Icon = item.icon;
                const isSelected = goal === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGoal(item.id as any)}
                    className={`p-5 rounded-2xl text-left border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/10'
                        : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {item.badge && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                        {item.badge}
                      </span>
                    )}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-700/80 text-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-base text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: What best describes you? */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Step 2 of 4</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">What best describes you?</h1>
              <p className="text-sm text-slate-400 mt-1.5">
                This helps our ATS engine calibrate action-verb seniority, metrics weight, and layout density.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {careerLevels.map(item => {
                const Icon = item.icon;
                const isSelected = careerLevel === item.level;
                return (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setCareerLevel(item.level)}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10 ring-1 ring-blue-500'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                      {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-white">{item.level}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: What role are you targeting? */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Step 3 of 4</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">What role are you targeting?</h1>
              <p className="text-sm text-slate-400 mt-1.5">
                We'll tailor your resume summary, core competencies, and action keywords to this title.
              </p>
            </div>

            <div className="space-y-4 bg-slate-800/60 border border-slate-700/80 p-6 rounded-2xl">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Target Job Title
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  placeholder="e.g. Frontend Developer, Product Designer"
                  className="w-full px-4 py-3 text-sm bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                />
              </div>

              {/* Quick suggestions */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Popular Suggestions:
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestedRoles.map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setTargetRole(role)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        targetRole === role
                          ? 'bg-blue-600 text-white border-blue-500 font-bold'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Industry & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Industry / Domain
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    placeholder="e.g. SaaS, Fintech, Healthcare"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Total Experience
                  </label>
                  <select
                    value={yearsOfExperience}
                    onChange={e => setYearsOfExperience(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="0-1 years">0-1 years (Entry / Junior)</option>
                    <option value="2-3 years">2-3 years (Associate)</option>
                    <option value="4-6 years">4-6 years (Mid Level)</option>
                    <option value="7-10 years">7-10 years (Senior)</option>
                    <option value="10+ years">10+ years (Lead / Staff / Executive)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Let's build your resume */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Final Step</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Let's build your resume</h1>
              <p className="text-sm text-slate-400 mt-1.5">
                How would you like to start? You can switch methods or edit your content at any time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Start with AI */}
              <button
                type="button"
                onClick={() => handleFinish('ai')}
                className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-slate-800 border-2 border-blue-500/60 hover:border-blue-400 text-left transition-all hover:scale-[1.01] shadow-xl group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 text-amber-300" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/40">
                    Recommended
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">Start with AI</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Describe your career or talk to our voice assistant. AI extracts achievements, structures STAR bullets, and formats for ATS compliance.
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs font-bold text-blue-300 group-hover:translate-x-1 transition-transform">
                  <span>Launch AI Generator</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              {/* Option B: Build Manually */}
              <button
                type="button"
                onClick={() => handleFinish('manual')}
                className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 hover:bg-slate-800 text-left transition-all hover:scale-[1.01] shadow-lg group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-700 text-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-700 text-slate-300">
                    Document Mode
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">Build Manually</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Enter your background section-by-section with live split-screen preview, AI assist chips, and 8 ATS templates.
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs font-bold text-slate-300 group-hover:translate-x-1 transition-transform">
                  <span>Open Resume Builder</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            <div className="flex justify-start pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 max-w-4xl mx-auto w-full text-center text-xs text-slate-500">
        ResumeForge AI &bull; Grounded ATS Intelligence &bull; Privacy Protected
      </div>
    </div>
  );
};
