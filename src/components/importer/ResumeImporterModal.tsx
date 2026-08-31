import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ResumeData } from '../../types/resume';
import { AIService } from '../../services/aiService';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { DEFAULT_CUSTOMIZATION } from '../../types/resume';

interface ResumeImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (importedResume: ResumeData) => void;
}

export const ResumeImporterModal: React.FC<ResumeImporterModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileText, setFileText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<Partial<ResumeData> | null>(null);

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    setError(null);
    const reader = new FileReader();

    reader.onload = e => {
      const text = e.target?.result as string;
      setFileText(text);
    };

    reader.onerror = () => {
      setError('Unable to read the uploaded document.');
    };

    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleParseDocument = async () => {
    if (!fileText.trim()) {
      setError('Please paste or upload CV text to parse.');
      return;
    }

    setIsParsing(true);
    setError(null);

    try {
      const res = await AIService.parseCV(fileText);
      setParsedPreview(res.structuredResume);
    } catch (err: any) {
      setError(err.message || 'AI document parser encountered an error.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirmImport = () => {
    if (!parsedPreview) return;

    const fullResume: ResumeData = {
      id: `resume-${Date.now()}`,
      userId: 'user-default',
      title: parsedPreview.title || `${parsedPreview.personalInfo?.fullName || 'Imported'} Resume`,
      targetRole: parsedPreview.targetRole || parsedPreview.personalInfo?.jobTitle || 'Professional',
      careerLevel: 'Mid Level',
      templateId: 'modern-clean',
      status: 'draft',
      atsScore: 75,
      completionScore: 70,
      customization: DEFAULT_CUSTOMIZATION,
      personalInfo: parsedPreview.personalInfo || {
        fullName: 'Imported Candidate',
        email: '',
        phone: '',
        location: '',
        jobTitle: '',
      },
      summary: parsedPreview.summary || '',
      experience: parsedPreview.experience || [],
      education: parsedPreview.education || [],
      skills: parsedPreview.skills || [],
      projects: parsedPreview.projects || [],
      certifications: parsedPreview.certifications || [],
      awards: parsedPreview.awards || [],
      languages: parsedPreview.languages || [],
      volunteer: [],
      publications: [],
      customSections: [],
      sectionOrder: ['personal', 'summary', 'experience', 'skills', 'projects', 'education', 'certifications', 'awards', 'languages'],
      enabledSections: {
        personal: true,
        summary: true,
        experience: true,
        skills: true,
        education: true,
        projects: true,
        certifications: true,
        awards: true,
        languages: true,
        volunteer: true,
        publications: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onImportComplete(fullResume);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Existing CV or Resume"
      subtitle="Upload or paste raw text to intelligently convert it into our structured document schema."
      maxWidth="3xl"
    >
      {!parsedPreview ? (
        <div className="space-y-4">
          {/* Drag and Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
              dragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100/50'
            }`}
          >
            <UploadCloud className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-900">Drag and drop your CV file here</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Supports .txt, .json, markdown, or plain text</p>

            <label className="mt-3 inline-block">
              <span className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer">
                Browse Files
              </span>
              <input
                type="file"
                className="hidden"
                accept=".txt,.json,.md,.doc,.docx"
                onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />
            </label>
            {fileName && <p className="text-xs text-indigo-600 font-semibold mt-2">Selected: {fileName}</p>}
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase">Or Paste Text</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <textarea
            rows={6}
            value={fileText}
            onChange={e => setFileText(e.target.value)}
            placeholder="Paste your existing resume raw text, bullets, or LinkedIn summary..."
            className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />

          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleParseDocument}
              disabled={!fileText.trim() || isParsing}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 px-5 rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {isParsing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>{isParsing ? 'Parsing Sections...' : 'Extract & Convert CV'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Parsed Preview Verification */
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-emerald-950">Extraction Successful</h4>
              <p className="text-[11px] text-emerald-800">
                Please review extracted structured data before creating your new editable resume.
              </p>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-900">Name:</span> {parsedPreview.personalInfo?.fullName}
            </div>
            <div>
              <span className="font-bold text-slate-900">Title:</span> {parsedPreview.personalInfo?.jobTitle}
            </div>
            <div>
              <span className="font-bold text-slate-900">Summary:</span>
              <p className="text-slate-600 mt-0.5">{parsedPreview.summary}</p>
            </div>
            <div>
              <span className="font-bold text-slate-900">Work Experience ({parsedPreview.experience?.length || 0}):</span>
              <ul className="list-disc pl-5 text-slate-600 mt-0.5">
                {parsedPreview.experience?.map((e, idx) => (
                  <li key={idx}>
                    {e.jobTitle} at {e.company} ({e.startDate} - {e.endDate})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-bold text-slate-900">Skills ({parsedPreview.skills?.length || 0}):</span>
              <p className="text-slate-600 mt-0.5">{parsedPreview.skills?.map(s => s?.name || '').filter(Boolean).join(', ')}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setParsedPreview(null)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              ← Back to Upload
            </button>

            <button
              onClick={handleConfirmImport}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 px-5 rounded-xl shadow-xs transition-colors"
            >
              <span>Create Resume from Extracted CV</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
