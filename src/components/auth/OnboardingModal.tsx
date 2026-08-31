import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Sparkles, ArrowRight, CheckCircle2, Briefcase, Award, Target, FileText, Upload } from 'lucide-react';
import { UserProfile, CareerLevel } from '../../types/resume';

interface OnboardingModalProps {
  isOpen: boolean;
  user?: UserProfile;
  onComplete: (updated: UserProfile, initialAction?: 'create' | 'upload') => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name || '');
  const [careerLevel, setCareerLevel] = useState<CareerLevel>(user?.careerLevel || 'Mid Level');
  const [industry, setIndustry] = useState(user?.industry || 'Technology & Software');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Software Engineer');
  const [yearsOfExperience, setYearsOfExperience] = useState(user?.yearsOfExperience || '4-6 years');
  const [location, setLocation] = useState(user?.location || 'San Francisco, CA');
  const [primaryGoal, setPrimaryGoal] = useState<UserProfile['primaryGoal']>(user?.primaryGoal || 'improve_existing');

  const careerLevels: CareerLevel[] = [
    'Student',
    'Graduate',
    'Entry Level',
    'Mid Level',
    'Senior',
    'Executive',
    'Career Changer',
    'Freelancer',
  ];

  const handleFinish = (action: 'create' | 'upload') => {
    const updated: UserProfile = {
      ...user,
      name,
      careerLevel,
      industry,
      targetRole,
      yearsOfExperience,
      location,
      primaryGoal,
      isOnboarded: true,
    };
    onComplete(updated, action);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      title={`Step ${step} of 2: Personalize Your Career Intelligence`}
      subtitle="Customize AI recommendations, ATS scoring rules, and tailored bullet enhancements."
      maxWidth="2xl"
    >
      {step === 1 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Alexander Wright"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Title / Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Industry / Sector</label>
              <input
                type="text"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                placeholder="e.g. SaaS, FinTech, Healthcare"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Years of Experience</label>
              <select
                value={yearsOfExperience}
                onChange={e => setYearsOfExperience(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="0-1 years (Student / Entry)">0-1 years (Student / Entry)</option>
                <option value="1-3 years (Junior)">1-3 years (Junior)</option>
                <option value="4-6 years (Mid-Level)">4-6 years (Mid-Level)</option>
                <option value="7-10 years (Senior)">7-10 years (Senior)</option>
                <option value="10+ years (Lead / Staff)">10+ years (Lead / Staff)</option>
                <option value="15+ years (Executive)">15+ years (Executive)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Career Level Archetype</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {careerLevels.map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setCareerLevel(lvl)}
                  className={`p-2 rounded-xl text-xs font-semibold text-left transition-all border ${
                    careerLevel === lvl
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 px-5 rounded-xl shadow-xs transition-colors"
            >
              <span>Continue to Goal Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">What is your primary goal today?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'create_new',
                  title: 'Create a New Resume',
                  desc: 'Start with a structured blueprint tailored to your target industry.',
                  icon: FileText,
                },
                {
                  id: 'improve_existing',
                  title: 'Improve Existing Resume',
                  desc: 'Run ATS diagnostic checks, rewrite bullets, and elevate impact.',
                  icon: Sparkles,
                },
                {
                  id: 'tailor_job',
                  title: 'Tailor Resume to a Job',
                  desc: 'Paste a job description to optimize keywords and close experience gaps.',
                  icon: Target,
                },
                {
                  id: 'create_cv',
                  title: 'Create Academic / Global CV',
                  desc: 'Multi-page comprehensive CV highlighting research, publications & grants.',
                  icon: Award,
                },
              ].map(goal => {
                const Icon = goal.icon;
                const isSelected = primaryGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setPrimaryGoal(goal.id as any)}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{goal.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{goal.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">How would you like to begin?</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleFinish('create')}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 px-3 rounded-lg shadow-xs transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Build in Interactive Editor</span>
              </button>
              <button
                type="button"
                onClick={() => handleFinish('upload')}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs py-2.5 px-3 rounded-lg border border-slate-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload / Import Existing CV</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
