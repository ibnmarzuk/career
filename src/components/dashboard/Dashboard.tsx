import React from 'react';
import {
  Sparkles,
  FileText,
  Upload,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Target,
  Mail,
  Copy,
  Download,
  Edit3,
  TrendingUp,
  Clock,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import { ResumeData, UserProfile, ATSAnalysisResult } from '../../types/resume';
import { calculateATSMetrics } from '../../utils/atsCalculator';

interface DashboardProps {
  user?: UserProfile;
  resumes?: ResumeData[];
  activeResume?: ResumeData;
  onNavigate: (view: string) => void;
  onSelectResume?: (id: string) => void;
  onCreateNewResume?: () => void;
  onUploadCV?: () => void;
  onExportPDF?: (resume: ResumeData) => void;
  onDuplicateResume?: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  resumes = [],
  activeResume,
  onNavigate,
  onSelectResume = (_id: string) => {},
  onCreateNewResume = () => {},
  onUploadCV = () => {},
  onExportPDF = (_resume: ResumeData) => {},
  onDuplicateResume = (_id: string) => {},
}) => {
  const safeResumes = resumes || [];
  const currentResume = activeResume || safeResumes[0] || ({} as ResumeData);
  const atsAnalysis = calculateATSMetrics(currentResume);
  const completion = currentResume.completionScore || 88;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* AI Resume Generator Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 p-6 sm:p-7 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold uppercase tracking-wider mb-2.5 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Resume Generator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Generate a custom ATS-optimized resume from a simple description
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-blue-100 leading-relaxed">
            Tell us about your background in your own words. Our AI extracts your true achievements, structures action-verbs, and applies ATS formatting instantly.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('ai-generator')}
            className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all hover:shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Try AI Generator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-Column Top Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* ATS Score Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">ATS Score</div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900">{atsAnalysis.overallScore}</span>
            <span className="mb-1 text-sm font-semibold text-green-600">+4%</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {atsAnalysis.overallScore >= 80 ? 'Optimized for Target Roles' : 'Optimization Recommended'}
          </div>
        </div>

        {/* Completion Progress Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Completion</div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900">{completion}%</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {atsAnalysis.criticalIssues.length > 0
              ? `${atsAnalysis.criticalIssues.length} issue(s) need review`
              : 'All primary sections verified'}
          </div>
        </div>

        {/* Job Matches Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Job Matches</div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900">12</span>
            <span className="mb-1 text-sm font-semibold text-blue-600">Active</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">Based on your skill & experience set</div>
        </div>
      </div>

      {/* Main 2-Column Balanced Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Resumes & Active Editor Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Resumes Grid */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Recent Resumes</h2>
              <button
                onClick={() => onNavigate('my-resumes')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View All ({safeResumes.length})
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {safeResumes.slice(0, 2).map((res, index) => (
                <div
                  key={res.id}
                  onClick={() => {
                    onSelectResume(res.id);
                    onNavigate('builder');
                  }}
                  className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-blue-300 cursor-pointer transition-colors"
                >
                  {/* Geometric Document Skeleton Preview */}
                  <div className="mb-4 h-44 w-full rounded-lg bg-slate-50 p-4 border border-slate-100 overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-2 w-1/3 bg-slate-300 rounded"></div>
                        <div className="h-2 w-12 bg-blue-100 rounded"></div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-1 w-full bg-slate-200 rounded"></div>
                        <div className="h-1 w-5/6 bg-slate-200 rounded"></div>
                        <div className="h-1 w-2/3 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-200/60 flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">
                        {res.title?.charAt(0) || 'R'}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="h-1 w-3/4 bg-slate-200 rounded"></div>
                        <div className="h-1 w-1/2 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                        {res.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Updated {new Date(res.updatedAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        (res.atsScore || 0) >= 80
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {(res.atsScore || 0) >= 80 ? 'ATS Ready' : 'Draft'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Resume Quick Optimization Center */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{currentResume.title || 'Active Resume'}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {currentResume.templateId || 'modern-clean'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Target Role: <strong className="text-slate-700">{currentResume.targetRole || 'Professional'}</strong> • ATS Score:{' '}
                  <strong className="text-slate-900">{atsAnalysis.overallScore}/100</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('builder')}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Open Editor</span>
                </button>
                <button
                  onClick={() => onNavigate('optimizer')}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>AI Optimize</span>
                </button>
                <button
                  onClick={() => onExportPDF(currentResume)}
                  className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Export PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Structured Insights & Suggestions */}
            <div className="mt-4 space-y-2.5">
              {atsAnalysis.criticalIssues.length > 0 ? (
                atsAnalysis.criticalIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-rose-50/70 border border-rose-200/80 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-rose-950">{issue.problem}</span>
                        <p className="text-[11px] text-rose-800 mt-0.5">{issue.recommendedFix}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('optimizer')}
                      className="text-[11px] font-bold text-rose-700 bg-white hover:bg-rose-100 px-2.5 py-1 rounded border border-rose-300 shrink-0 transition-colors"
                    >
                      Fix with AI
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-lg bg-green-50/70 border border-green-200/80 flex items-center gap-2.5 text-xs text-green-900">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Resume content complies with modern ATS standards. Ready for submissions!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: AI Career Coach & Action Panel */}
        <div className="flex flex-col gap-6">
          {/* AI Career Coach Panel */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 p-4">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">AI Career Coach</h3>
            </div>
            <div className="p-4 space-y-4">
              {/* Highlight Recommendation */}
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="text-xs leading-relaxed text-blue-900">
                  <strong>Recommended:</strong> Your experience section for "{currentResume.targetRole || 'Software Engineering'}" can be enhanced with 2+ measurable impact metrics (percentages, revenue, latency).
                </p>
                <button
                  onClick={() => onNavigate('optimizer')}
                  className="mt-2 text-[10px] font-bold text-blue-700 hover:underline block"
                >
                  Auto-rewrite with AI →
                </button>
              </div>

              {/* Status Checks with Geometric Badges */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">Contact info verified</div>
                    <div className="text-[10px] text-slate-500">Phone, email, and links are valid</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-400 text-white font-bold text-[10px]">
                    !
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">Recommended Keywords</div>
                    <div className="text-[10px] text-slate-500">Add industry skills: "Architecture", "CI/CD", "Optimization"</div>
                  </div>
                </div>
              </div>

              {/* Job Tailoring Action Box */}
              <div className="mt-6 rounded-lg border border-dashed border-slate-300 p-4 text-center">
                <p className="text-[11px] font-medium text-slate-500">Paste a job description to tailor your resume</p>
                <button
                  onClick={() => onNavigate('job-matcher')}
                  className="mt-2 w-full rounded-md border border-slate-200 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Analyze Job Description
                </button>
              </div>
            </div>
          </div>

          {/* Fast Career Tools & Prep */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Upcoming Interview</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                  {(currentResume.targetRole || 'P').charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{currentResume.targetRole || 'Professional Interview'}</div>
                  <div className="text-[10px] text-slate-500">Technical & Systems Review</div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('builder')}
                className="rounded-md bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 text-[10px] font-bold text-slate-700 transition-colors"
              >
                Prep AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
