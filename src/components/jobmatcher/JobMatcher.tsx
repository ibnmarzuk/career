import React, { useState } from 'react';
import { ResumeData, JobMatchResult } from '../../types/resume';
import { AIService } from '../../services/aiService';
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Building,
  Target,
  ArrowRight,
  Briefcase,
} from 'lucide-react';

interface JobMatcherProps {
  resume: ResumeData;
  onTailorResume: (jobDescription: string) => void;
}

export const JobMatcher: React.FC<JobMatcherProps> = ({ resume, onTailorResume }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState(resume.targetRole || '');
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunMatch = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description first.');
      return;
    }
    setIsMatching(true);
    setError(null);

    try {
      const res = await AIService.matchJob(resume, jobDescription, targetRole);
      setMatchResult(res.result);
    } catch (err: any) {
      setError(err.message || 'Job description matching failed.');
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <Target className="w-4 h-4" />
          <span>Job Description Semantic Scanner</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Job Matcher & Keyword Gap Analysis</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Compare your resume against any target vacancy to identify matched keywords, missing requirements, and tailored gaps.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Target Job Title
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Active Resume Being Analyzed
            </label>
            <div className="px-3 py-2 text-xs sm:text-sm border border-slate-200 bg-slate-50 rounded-xl text-slate-700 font-medium">
              {resume.title} ({resume.personalInfo?.fullName})
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Target Job Description / Requirements
          </label>
          <textarea
            rows={6}
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the full job posting text including responsibilities, required qualifications, and technologies..."
            className="w-full p-3.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
          />
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleRunMatch}
            disabled={isMatching}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm py-2.5 px-6 rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            {isMatching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{isMatching ? 'Analyzing Job Posting...' : 'Analyze Match & Gaps'}</span>
          </button>
        </div>
      </div>

      {/* Match Results */}
      {matchResult && (
        <div className="space-y-6">
          {/* Match Score Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Building className="w-4 h-4 text-indigo-600" />
                <span>{matchResult.company || 'Company'}</span>
                <span>•</span>
                <span>{matchResult.jobTitle || targetRole}</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Job Fit & Alignment Overview</h3>
              <p className="text-xs text-slate-600 max-w-xl">{matchResult.recommendations?.[0]}</p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-center">
                <span className="text-4xl font-extrabold text-indigo-600">{matchResult.matchScore}%</span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Match Score</span>
              </div>

              <button
                onClick={() => onTailorResume(jobDescription)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-3 px-4 rounded-xl shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Tailor Resume for This Job</span>
              </button>
            </div>
          </div>

          {/* Breakdown Grid: Matched vs Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <h3 className="text-sm font-bold">Matched Requirements ({matchResult.matchedSkills?.length || 0})</h3>
              </div>
              <p className="text-xs text-slate-500">Skills and qualifications found in your current resume.</p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchResult.matchedSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-medium"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-rose-700">
                <XCircle className="w-4 h-4" />
                <h3 className="text-sm font-bold">Missing Keywords ({matchResult.missingSkills?.length || 0})</h3>
              </div>
              <p className="text-xs text-slate-500">High-priority JD requirements not detected in your resume.</p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchResult.missingSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-lg font-medium"
                  >
                    ! {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
