import React, { useState } from 'react';
import { ResumeData, ATSAnalysisResult } from '../../types/resume';
import { calculateATSMetrics } from '../../utils/atsCalculator';
import { AIService } from '../../services/aiService';
import {
  BarChart3,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Wand2,
  RefreshCw,
  Target,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ResumeAnalyzerProps {
  resume: ResumeData;
  onNavigate: (view: string) => void;
  onOptimize: () => void;
}

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ resume, onNavigate, onOptimize }) => {
  const [isDeepScanning, setIsDeepScanning] = useState(false);
  const [analysis, setAnalysis] = useState<ATSAnalysisResult>(calculateATSMetrics(resume));
  const [jobDescriptionInput, setJobDescriptionInput] = useState('');

  const handleRunDeepScan = async () => {
    setIsDeepScanning(true);
    try {
      const res = await AIService.analyzeResume(resume, jobDescriptionInput);
      if (res.analysis) {
        setAnalysis(res.analysis);
      }
    } catch (err) {
      console.error('Deep scan failed, keeping client calculated metrics', err);
    } finally {
      setIsDeepScanning(false);
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>ATS Compliance & Diagnostic Scanner</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Resume ATS Diagnostic Report</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Simulates Taleo, Workday, Greenhouse, and Lever parsing engines to calculate interview callback probability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunDeepScan}
            disabled={isDeepScanning}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDeepScanning ? 'animate-spin' : ''}`} />
            <span>{isDeepScanning ? 'Scanning Algorithm...' : 'Re-Run Deep Scan'}</span>
          </button>
          <button
            onClick={onOptimize}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto Optimize</span>
          </button>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Circular / Hero Overall Score */}
          <div className="text-center lg:text-left lg:border-r lg:border-slate-100 lg:pr-8">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall ATS Score</span>
            <div className="my-2 flex items-center justify-center lg:justify-start gap-3">
              <span className="text-5xl font-black tracking-tight text-slate-900">{analysis.overallScore}</span>
              <span className="text-sm font-semibold text-slate-400">/ 100</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getScoreBadge(analysis.overallScore)}`}>
                {analysis.overallScore >= 80 ? 'Interview Ready' : 'Needs Optimization'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">{analysis.summary}</p>
          </div>

          {/* Detailed Category Bars (Weightings) */}
          <div className="lg:col-span-2 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Keyword Relevance (25% weight)</span>
                <span className="font-bold text-slate-900">{analysis.keywordScore}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${analysis.keywordScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Content Quality & Verbs (20% weight)</span>
                <span className="font-bold text-slate-900">{analysis.contentQualityScore}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${analysis.contentQualityScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Experience & Metrics (20% weight)</span>
                <span className="font-bold text-slate-900">{analysis.experienceScore}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${analysis.experienceScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">ATS Layout & Formatting (15% weight)</span>
                <span className="font-bold text-slate-900">{analysis.formattingScore}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: `${analysis.formattingScore}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Issues & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Critical Issues */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">Critical Issues ({analysis.criticalIssues?.length || 0})</h3>
          </div>

          {analysis.criticalIssues && analysis.criticalIssues.length > 0 ? (
            <div className="space-y-3">
              {analysis.criticalIssues.map((issue, idx) => (
                <div key={idx} className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1.5">
                  <h4 className="text-xs font-bold text-rose-950">{issue.problem}</h4>
                  <p className="text-[11px] text-rose-800 leading-relaxed">{issue.whyItMatters}</p>
                  <p className="text-[11px] text-slate-700 font-medium bg-white/80 p-2 rounded-lg border border-rose-200/60">
                    💡 <strong>Fix:</strong> {issue.recommendedFix}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
              Zero critical parsing blockers detected. Your resume structure parses cleanly.
            </div>
          )}
        </div>

        {/* Missing Keywords & Suggestions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Missing High-Yield Keywords</h3>
          </div>

          <p className="text-xs text-slate-500">
            ATS scanners filter candidates based on exact term matches found in peer job postings.
          </p>

          <div className="flex flex-wrap gap-1.5">
            {analysis.missingKeywords?.map((kw, idx) => (
              <span
                key={idx}
                className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg font-medium"
              >
                + {kw}
              </span>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <h4 className="text-xs font-bold text-slate-800">Actionable Suggestions</h4>
            {analysis.suggestions?.map((sug, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>{sug}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
