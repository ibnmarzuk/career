import React, { useState } from 'react';
import { WorkExperience } from '../../types/resume';
import {
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Building,
  Calendar,
  Wand2,
  Check,
  RefreshCw,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { AIService, BulletRewriteResponse } from '../../services/aiService';

interface ExperienceEditorProps {
  experience: WorkExperience[];
  onChange: (updated: WorkExperience[]) => void;
  onTrackEvent?: (name: string) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ experience, onChange, onTrackEvent }) => {
  const [activeExpId, setActiveExpId] = useState<string>(experience[0]?.id || '');
  const [optimizingBullet, setOptimizingBullet] = useState<{ expId: string; bulletIdx: number } | null>(null);
  const [aiBulletResponse, setAiBulletResponse] = useState<BulletRewriteResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<'impact' | 'concise' | 'ats-friendly' | 'executive'>('impact');

  const addExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      jobTitle: 'Software Engineer',
      company: 'Company Name',
      location: 'City, State',
      employmentType: 'Full-time',
      startDate: '2023-01',
      endDate: 'Present',
      isCurrent: true,
      bullets: [
        'Developed and deployed scalable web services and features using modern technologies.',
        'Collaborated with cross-functional teams to deliver product milestones on schedule.',
      ],
      skillsUsed: [],
    };
    onChange([newExp, ...experience]);
    setActiveExpId(newExp.id);
  };

  const removeExperience = (id: string) => {
    onChange(experience.filter(e => e.id !== id));
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: any) => {
    onChange(
      experience.map(e => {
        if (e.id === id) {
          return { ...e, [field]: value };
        }
        return e;
      })
    );
  };

  const updateBullet = (expId: string, bulletIdx: number, newText: string) => {
    onChange(
      experience.map(e => {
        if (e.id === expId) {
          const newBullets = [...(e.bullets || [])];
          newBullets[bulletIdx] = newText;
          return { ...e, bullets: newBullets };
        }
        return e;
      })
    );
  };

  const addBullet = (expId: string) => {
    onChange(
      experience.map(e => {
        if (e.id === expId) {
          return {
            ...e,
            bullets: [...(e.bullets || []), 'Achieved measurable business outcomes by implementing robust engineering solutions.'],
          };
        }
        return e;
      })
    );
  };

  const removeBullet = (expId: string, bulletIdx: number) => {
    onChange(
      experience.map(e => {
        if (e.id === expId) {
          const newBullets = (e.bullets || []).filter((_, idx) => idx !== bulletIdx);
          return { ...e, bullets: newBullets };
        }
        return e;
      })
    );
  };

  const handleRewriteBullet = async (expId: string, bulletIdx: number, bulletText: string, jobTitle?: string, company?: string) => {
    setOptimizingBullet({ expId, bulletIdx });
    setAiLoading(true);
    setAiError(null);
    setAiBulletResponse(null);

    try {
      const res = await AIService.rewriteBullet({
        bullet: bulletText,
        jobTitle,
        company,
        mode: selectedMode,
      });
      setAiBulletResponse(res);
      onTrackEvent?.('bullet_rewritten');
    } catch (err: any) {
      setAiError(err.message || 'Failed to rewrite bullet');
    } finally {
      setAiLoading(false);
    }
  };

  const applyBulletVariation = (expId: string, bulletIdx: number, newBulletText: string) => {
    updateBullet(expId, bulletIdx, newBulletText);
    setOptimizingBullet(null);
    setAiBulletResponse(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Work Experience</h3>
          <p className="text-xs text-slate-500">
            Detail your past roles, quantified impact metrics, and action-verb driven bullets.
          </p>
        </div>

        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-1.5 px-3 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Role</span>
        </button>
      </div>

      {/* Experience Accordion / Cards */}
      <div className="space-y-3">
        {experience.map(exp => {
          const isExpanded = activeExpId === exp.id;
          return (
            <div
              key={exp.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
            >
              {/* Card Header */}
              <div
                onClick={() => setActiveExpId(isExpanded ? '' : exp.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{exp.jobTitle || 'Untitled Position'}</h4>
                    <p className="text-[11px] text-slate-500">
                      {exp.company || 'Company'} • {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      removeExperience(exp.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Card Expanded Content */}
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-slate-100 space-y-4 mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={exp.jobTitle}
                        onChange={e => updateExperience(exp.id, 'jobTitle', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Company / Organization</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. San Francisco, CA / Remote"
                        value={exp.location || ''}
                        onChange={e => updateExperience(exp.id, 'location', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Employment Type</label>
                      <select
                        value={exp.employmentType || 'Full-time'}
                        onChange={e => updateExperience(exp.id, 'employmentType', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Start Date</label>
                      <input
                        type="text"
                        placeholder="YYYY-MM (e.g. 2022-03)"
                        value={exp.startDate || ''}
                        onChange={e => updateExperience(exp.id, 'startDate', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-700">End Date</label>
                        <label className="flex items-center gap-1.5 text-[11px] text-indigo-600 font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exp.isCurrent || false}
                            onChange={e => {
                              updateExperience(exp.id, 'isCurrent', e.target.checked);
                              if (e.target.checked) updateExperience(exp.id, 'endDate', 'Present');
                            }}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>Currently Working Here</span>
                        </label>
                      </div>
                      {!exp.isCurrent && (
                        <input
                          type="text"
                          placeholder="YYYY-MM (e.g. 2024-01)"
                          value={exp.endDate || ''}
                          onChange={e => updateExperience(exp.id, 'endDate', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      )}
                    </div>
                  </div>

                  {/* Bullet Points with Integrated AI Optimizer */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Achievement Bullet Points ({exp.bullets?.length || 0})
                      </label>
                      <button
                        type="button"
                        onClick={() => addBullet(exp.id)}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Bullet</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(exp.bullets || []).map((bullet, bIdx) => {
                        const isOptimizingThis =
                          optimizingBullet?.expId === exp.id && optimizingBullet?.bulletIdx === bIdx;
                        return (
                          <div key={bIdx} className="space-y-1.5">
                            <div className="flex items-start gap-2">
                              <textarea
                                rows={2}
                                value={bullet}
                                onChange={e => updateBullet(exp.id, bIdx, e.target.value)}
                                className="flex-1 p-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
                              />

                              <div className="flex flex-col gap-1 shrink-0">
                                <button
                                  type="button"
                                  title="AI Bullet Optimizer"
                                  onClick={() => handleRewriteBullet(exp.id, bIdx, bullet, exp.jobTitle, exp.company)}
                                  className="p-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  title="Remove bullet"
                                  onClick={() => removeBullet(exp.id, bIdx)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* AI Suggestions Dropdown for this specific bullet */}
                            {isOptimizingThis && (
                              <div className="p-3 bg-slate-900 text-white rounded-xl text-xs space-y-2 border border-slate-800">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>AI Suggested Bullet Rewrites</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <select
                                      value={selectedMode}
                                      onChange={e => setSelectedMode(e.target.value as any)}
                                      className="bg-slate-800 text-[10px] text-slate-300 rounded border border-slate-700 px-1.5 py-0.5"
                                    >
                                      <option value="impact">Impact & Results</option>
                                      <option value="concise">Concise</option>
                                      <option value="ats-friendly">ATS Keywords</option>
                                      <option value="executive">Executive</option>
                                    </select>
                                    <button
                                      type="button"
                                      onClick={() => handleRewriteBullet(exp.id, bIdx, bullet, exp.jobTitle, exp.company)}
                                      className="text-slate-400 hover:text-white p-1"
                                    >
                                      <RefreshCw className={`w-3 h-3 ${aiLoading ? 'animate-spin' : ''}`} />
                                    </button>
                                  </div>
                                </div>

                                {aiLoading && (
                                  <div className="py-3 text-center text-slate-400 text-[11px] flex items-center justify-center gap-2">
                                    <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                                    <span>Analyzing action verbs and impact metrics...</span>
                                  </div>
                                )}

                                {aiBulletResponse && aiBulletResponse.variations && (
                                  <div className="space-y-2">
                                    {aiBulletResponse.variations.map((v, vIdx) => (
                                      <div
                                        key={vIdx}
                                        onClick={() => applyBulletVariation(exp.id, bIdx, v.text)}
                                        className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 cursor-pointer transition-all"
                                      >
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-[10px] font-bold text-indigo-300 uppercase">
                                            {v.impactType} ({v.highlightVerb})
                                          </span>
                                          <span className="text-[10px] text-emerald-400 font-semibold">Apply</span>
                                        </div>
                                        <p className="text-slate-200 leading-snug">{v.text}</p>
                                        {v.reasoning && <p className="text-[10px] text-slate-400 mt-1">{v.reasoning}</p>}
                                      </div>
                                    ))}

                                    {aiBulletResponse.suggestedMetricsPrompt && (
                                      <p className="text-[10px] text-amber-300 italic pt-1 border-t border-slate-800">
                                        💡 {aiBulletResponse.suggestedMetricsPrompt}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
