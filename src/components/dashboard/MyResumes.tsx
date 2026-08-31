import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Upload,
  MoreVertical,
  Edit3,
  Copy,
  Trash2,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Layers,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { ResumeData } from '../../types/resume';

interface MyResumesProps {
  resumes: ResumeData[];
  activeResumeId: string;
  onSelectResume: (id: string) => void;
  onCreateNew: () => void;
  onUploadCV: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onExportPDF: (resume: ResumeData) => void;
  onNavigate: (view: string) => void;
}

export const MyResumes: React.FC<MyResumesProps> = ({
  resumes,
  activeResumeId,
  onSelectResume,
  onCreateNew,
  onUploadCV,
  onDuplicate,
  onDelete,
  onExportPDF,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTemplate, setFilterTemplate] = useState<string>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredResumes = resumes.filter(r => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.targetRole?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.personalInfo?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTemplate = filterTemplate === 'all' || r.templateId === filterTemplate;
    return matchesSearch && matchesTemplate;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Resumes & CVs</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your tailored resume variations, role-specific blueprints, and export-ready drafts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onUploadCV}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-3.5 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Import CV</span>
          </button>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Resume</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title, role, or candidate name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterTemplate}
            onChange={e => setFilterTemplate(e.target.value)}
            className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">All Templates</option>
            <option value="modern">Modern Clean</option>
            <option value="executive">Executive Elite</option>
            <option value="minimal">Minimalist Studio</option>
            <option value="ats-pro">ATS Pro</option>
            <option value="creative">Creative Sidebar</option>
            <option value="tech">Tech & Engineering</option>
            <option value="classic">Classic Heritage</option>
          </select>
        </div>
      </div>

      {/* Resumes Grid */}
      {filteredResumes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No resumes matched your search</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Create a new resume or clear your filters to see your existing CV variations.
            </p>
          </div>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Resume</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResumes.map(resume => {
            const isActive = resume.id === activeResumeId;
            return (
              <div
                key={resume.id}
                className={`bg-white rounded-xl border transition-all duration-200 shadow-xs flex flex-col justify-between overflow-hidden group ${
                  isActive ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                          {resume.title}
                        </h3>
                        {isActive && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{resume.targetRole || 'General Purpose'}</p>
                    </div>

                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 shrink-0">
                      {resume.atsScore}% ATS
                    </span>
                  </div>

                  {/* Summary Snippet */}
                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {resume.summary || 'No summary entered yet. Add one in the editor.'}
                  </p>

                  {/* Badges & Meta */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-700">
                      {resume.templateId}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(resume.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        onSelectResume(resume.id);
                        onNavigate('builder');
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onExportPDF(resume)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-200/60 transition-colors flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDuplicate(resume.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {resumes.length > 1 && (
                      <button
                        onClick={() => onDelete(resume.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
