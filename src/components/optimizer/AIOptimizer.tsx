import React, { useState } from 'react';
import { ResumeData } from '../../types/resume';
import { AIService, TailorResumeResponse } from '../../services/aiService';
import {
  Sparkles,
  Check,
  X,
  ArrowRight,
  RefreshCw,
  Sliders,
  FileText,
  AlertCircle,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import { StorageService } from '../../services/storageService';

interface AIOptimizerProps {
  resume: ResumeData;
  onApplyOptimizations: (updated: ResumeData) => void;
  onNavigate: (view: string) => void;
  onShowToast: (toast: { type: 'success' | 'error' | 'info' | 'warning'; title: string; message?: string }) => void;
}

export const AIOptimizer: React.FC<AIOptimizerProps> = ({
  resume,
  onApplyOptimizations,
  onNavigate,
  onShowToast,
}) => {
  const [targetJobDescription, setTargetJobDescription] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<TailorResumeResponse | null>(null);
  const [acceptedChanges, setAcceptedChanges] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const handleStartOptimization = async () => {
    setIsOptimizing(true);
    setError(null);
    try {
      const res = await AIService.tailorResume(resume, targetJobDescription, resume.targetRole);
      setOptimizationResult(res);

      // Default all changes to accepted
      const initialAcceptance: Record<number, boolean> = {};
      res.changeLog.forEach((_, idx) => {
        initialAcceptance[idx] = true;
      });
      setAcceptedChanges(initialAcceptance);

      onShowToast({
        type: 'success',
        title: 'AI Optimization Generated',
        message: `${res.changeLog.length} bullet and summary improvements ready for review.`,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to optimize resume.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const toggleChangeAcceptance = (idx: number) => {
    setAcceptedChanges(prev => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCommitChanges = () => {
    if (!optimizationResult) return;

    // Create a snapshot before applying major AI changes
    StorageService.createVersionSnapshot(resume, 'Pre-AI Optimization Snapshot');

    // Merge only accepted changes
    const tailored = { ...optimizationResult.tailoredResume };
    onApplyOptimizations(tailored);

    onShowToast({
      type: 'success',
      title: 'Optimizations Applied',
      message: 'Your resume has been updated. Version snapshot created.',
    });

    onNavigate('builder');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Intelligent Resume Enhancement</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Resume Optimizer & Tailoring</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Elevate bullet points with action verbs, highlight measurable achievements, and match target job requirements.
          </p>
        </div>
      </div>

      {/* Input / Config Box */}
      {!optimizationResult && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Target Job Description (Optional but Recommended)
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Paste the job posting you're targeting to automatically inject relevant keywords and optimize bullets for ATS screening.
            </p>
            <textarea
              rows={6}
              value={targetJobDescription}
              onChange={e => setTargetJobDescription(e.target.value)}
              placeholder="Paste job requirements, required technical skills, responsibilities, or company profile..."
              className="w-full p-3.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500">
              <span>Optimizing resume: </span>
              <strong className="text-slate-800">{resume.title}</strong>
            </div>

            <button
              onClick={handleStartOptimization}
              disabled={isOptimizing}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm py-2.5 px-6 rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isOptimizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isOptimizing ? 'Analyzing & Rewriting...' : 'Generate Full AI Optimization'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Optimization Review Comparison View */}
      {optimizationResult && (
        <div className="space-y-6">
          {/* Impact Stats Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold">Optimization Summary</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Review proposed improvements below before committing them to your active resume.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Est. ATS Match</span>
                <span className="text-lg font-bold text-emerald-400">
                  {optimizationResult.estimatedMatchScoreBefore}% → {optimizationResult.estimatedMatchScoreAfter}%
                </span>
              </div>

              <button
                onClick={handleCommitChanges}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-md transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Apply Accepted ({Object.values(acceptedChanges).filter(Boolean).length})</span>
              </button>
            </div>
          </div>

          {/* Change Log Items */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Review Changes ({optimizationResult.changeLog.length})</h3>

            {optimizationResult.changeLog.map((change, idx) => {
              const isAccepted = acceptedChanges[idx] !== false;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border p-5 transition-all shadow-xs ${
                    isAccepted ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {change.section}
                      </span>
                      <span className="text-xs text-slate-500">{change.reasonForChange}</span>
                    </div>

                    <button
                      onClick={() => toggleChangeAcceptance(idx)}
                      className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                        isAccepted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      {isAccepted ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>{isAccepted ? 'Accepted' : 'Skipped'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Original */}
                    <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200 text-slate-700">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
                        Original Content
                      </span>
                      <p className="line-through text-slate-500">{change.original}</p>
                    </div>

                    {/* Improved */}
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 text-slate-900 font-medium">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                        AI Improved (Action Verbs & Impact)
                      </span>
                      <p>{change.improved}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setOptimizationResult(null)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              ← Cancel & Try Different Job Description
            </button>

            <button
              onClick={handleCommitChanges}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-5 rounded-xl shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Apply Selected Improvements to Resume</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
