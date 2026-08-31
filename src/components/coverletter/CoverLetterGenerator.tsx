import React, { useState } from 'react';
import { ResumeData, CoverLetter } from '../../types/resume';
import { AIService } from '../../services/aiService';
import { StorageService } from '../../services/storageService';
import {
  Mail,
  Sparkles,
  RefreshCw,
  Copy,
  Download,
  Check,
  Building,
  User,
  Sliders,
  FileText,
  AlertCircle,
} from 'lucide-react';
import jsPDF from 'jspdf';

interface CoverLetterGeneratorProps {
  resume: ResumeData;
  onShowToast: (toast: { type: 'success' | 'error' | 'info' | 'warning'; title: string; message?: string }) => void;
}

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({ resume, onShowToast }) => {
  const [jobTitle, setJobTitle] = useState(resume.targetRole || 'Senior Software Engineer');
  const [company, setCompany] = useState('Acme Technologies');
  const [hiringManagerName, setHiringManagerName] = useState('Hiring Team');
  const [tone, setTone] = useState<'Professional' | 'Confident' | 'Concise' | 'Warm' | 'Executive'>('Professional');
  const [customHighlights, setCustomHighlights] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await AIService.generateCoverLetter({
        resume,
        jobTitle,
        company,
        hiringManagerName,
        tone,
        customHighlights,
      });

      setGeneratedLetter(res.fullLetterText);

      // Save to cover letters storage
      const newLetter: CoverLetter = {
        id: `cl-${Date.now()}`,
        userId: 'user-default',
        resumeId: resume.id,
        jobTitle,
        company,
        hiringManagerName,
        subject: `Application for ${jobTitle} - ${resume.personalInfo?.fullName || 'Candidate'}`,
        salutation: `Dear ${hiringManagerName || 'Hiring Team'},`,
        bodyParagraphs: res.bodyParagraphs,
        signOff: 'Sincerely,',
        fullLetterText: res.fullLetterText,
        tone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      StorageService.saveCoverLetter(newLetter);
      StorageService.trackEvent('cover_letter_generated', { company, jobTitle });

      onShowToast({
        type: 'success',
        title: 'Cover Letter Generated',
        message: 'Tailored to your work history and target company.',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to generate cover letter.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    onShowToast({
      type: 'info',
      title: 'Copied to Clipboard',
    });
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);

      const splitText = doc.splitTextToSize(generatedLetter, 170);
      doc.text(splitText, 20, 25);

      const fileName = `Cover_Letter_${company.replace(/\s+/g, '_')}.pdf`;
      doc.save(fileName);

      onShowToast({
        type: 'success',
        title: 'Cover Letter PDF Exported',
        message: `Saved as ${fileName}`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <Mail className="w-4 h-4" />
          <span>AI Application Writer</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Cover Letter Generator</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Generate targeted, recruiter-ready cover letters referencing your actual accomplishments and credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Settings */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Application Details</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Company Name</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Stripe, OpenAI, Google"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Hiring Manager Name / Title</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={hiringManagerName}
                onChange={e => setHiringManagerName(e.target.value)}
                placeholder="e.g. Engineering Hiring Team"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tone of Voice</label>
            <select
              value={tone}
              onChange={e => setTone(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="Professional">Professional & Formal</option>
              <option value="Confident">Confident & Impactful</option>
              <option value="Concise">Concise & Direct</option>
              <option value="Executive">Executive & Strategic</option>
              <option value="Warm">Warm & Collaborative</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Strengths to Emphasize</label>
            <textarea
              rows={3}
              value={customHighlights}
              onChange={e => setCustomHighlights(e.target.value)}
              placeholder="e.g. Highlight microservices migration and reducing API latency by 42%..."
              className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isGenerating ? 'Drafting Cover Letter...' : 'Generate AI Cover Letter'}</span>
          </button>
        </div>

        {/* Right Preview & Editor */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Cover Letter Document</h3>
            {generatedLetter && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1">
            {generatedLetter ? (
              <textarea
                rows={16}
                value={generatedLetter}
                onChange={e => setGeneratedLetter(e.target.value)}
                className="w-full p-4 text-xs sm:text-sm border border-slate-200 rounded-xl font-serif leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-center p-8 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
                <Mail className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-700">No cover letter generated yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Fill in your target company and job details on the left, then click Generate.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
