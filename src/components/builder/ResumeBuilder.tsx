import React, { useState, useEffect, useRef } from 'react';
import { ResumeData, TemplateId, ResumeCustomization, UserProfile } from '../../types/resume';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryEditor } from './SummaryEditor';
import { ExperienceEditor } from './ExperienceEditor';
import { EducationEditor } from './EducationEditor';
import { SkillsEditor } from './SkillsEditor';
import { ProjectsEditor } from './ProjectsEditor';
import { AdditionalSectionsEditor } from './AdditionalSectionsEditor';
import { TemplateCustomizer } from './TemplateCustomizer';
import { AICoachPanel } from './AICoachPanel';
import { VersionHistoryModal } from './VersionHistoryModal';
import { PrintPreviewModal } from './PrintPreviewModal';
import { ResumeTemplateRenderer } from '../templates/ResumeTemplateRenderer';
import { exportResumeToPDF, printResume } from '../../utils/pdfExport';
import { StorageService } from '../../services/storageService';
import {
  Save,
  Download,
  Printer,
  Sparkles,
  History,
  Palette,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  AlignLeft,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  PlusSquare,
  Bot,
  Eye,
  Edit3,
} from 'lucide-react';

interface ResumeBuilderProps {
  resume: ResumeData;
  user: UserProfile;
  onUpdateResume: (updated: ResumeData, shouldSnapshot?: boolean, actionName?: string) => void;
  onNavigate: (view: string) => void;
  onShowToast: (toast: { type: 'success' | 'error' | 'info' | 'warning'; title: string; message?: string }) => void;
}

type EditorTab = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'extra' | 'design';

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  resume,
  user,
  onUpdateResume,
  onNavigate,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('personal');
  const [mobileView, setMobileView] = useState<'edit' | 'preview' | 'coach'>('edit');
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(0.85);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save debouncer
  const handleDataChange = (partial: Partial<ResumeData>) => {
    setSaveStatus('saving');
    const updated: ResumeData = {
      ...resume,
      ...partial,
      updatedAt: new Date().toISOString(),
    };

    onUpdateResume(updated, false);

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      StorageService.saveResume(updated, false);
      setSaveStatus('saved');
    }, 1000);
  };

  const handleManualSave = () => {
    setSaveStatus('saving');
    const updated = StorageService.saveResume(resume, true, 'User Manual Save');
    onUpdateResume(updated, true, 'User Manual Save');
    setSaveStatus('saved');
    onShowToast({
      type: 'success',
      title: 'Resume Saved Successfully',
      message: 'A version snapshot was recorded.',
    });
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    onShowToast({
      type: 'info',
      title: 'Generating Document PDF...',
      message: 'Compiling high-resolution vector layout.',
    });

    try {
      const fileName = `${resume.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'}_CV.pdf`;
      const success = await exportResumeToPDF('resume-document-root', fileName);
      if (success) {
        onShowToast({
          type: 'success',
          title: 'PDF Export Complete',
          message: `Saved as ${fileName}`,
        });
        StorageService.trackEvent('pdf_exported', { resumeId: resume.id, templateId: resume.templateId });
      }
    } catch (e) {
      onShowToast({
        type: 'error',
        title: 'Export Failed',
        message: 'Opening browser print dialog instead.',
      });
      printResume();
    } finally {
      setIsExportingPDF(false);
    }
  };

  const tabs = [
    { id: 'personal' as EditorTab, label: 'Contact', icon: User },
    { id: 'summary' as EditorTab, label: 'Summary', icon: AlignLeft },
    { id: 'experience' as EditorTab, label: 'Experience', icon: Briefcase },
    { id: 'education' as EditorTab, label: 'Education', icon: GraduationCap },
    { id: 'skills' as EditorTab, label: 'Skills', icon: Wrench },
    { id: 'projects' as EditorTab, label: 'Projects', icon: FolderGit2 },
    { id: 'extra' as EditorTab, label: 'Add-ons', icon: PlusSquare },
    { id: 'design' as EditorTab, label: 'Design & Theme', icon: Palette },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4.1rem)] -m-4 sm:-m-6 lg:-m-8 bg-slate-100 overflow-hidden">
      {/* Top Builder Control Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={resume.title}
            onChange={e => handleDataChange({ title: e.target.value })}
            className="text-sm font-bold text-slate-900 bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg px-2 py-1 max-w-[220px] sm:max-w-xs transition-colors"
          />

          {/* Saving Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            {saveStatus === 'saving' && (
              <span className="text-amber-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>Saving...</span>
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-emerald-600 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved</span>
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mobile View Toggle Buttons */}
          <div className="flex sm:hidden bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setMobileView('edit')}
              className={`p-1.5 rounded-md text-xs font-semibold ${
                mobileView === 'edit' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`p-1.5 rounded-md text-xs font-semibold ${
                mobileView === 'preview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMobileView('coach')}
              className={`p-1.5 rounded-md text-xs font-semibold ${
                mobileView === 'coach' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsAICoachOpen(!isAICoachOpen)}
            className={`hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
              isAICoachOpen
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Coach</span>
          </button>

          <button
            onClick={() => setIsVersionHistoryOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>History</span>
          </button>

          <button
            onClick={() => setIsPrintPreviewOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
            title="A4 Print & Document Preview"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPDF ? 'Exporting...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Form Editor Workspace */}
        <div
          className={`w-full lg:w-1/2 flex flex-col bg-white border-r border-slate-200 overflow-hidden ${
            mobileView !== 'edit' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Form Tabs Bar */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-100 bg-slate-50/70 overflow-x-auto shrink-0">
            {tabs.map(t => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Tab Content View */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {activeTab === 'personal' && (
              <PersonalInfoForm
                personalInfo={resume.personalInfo}
                onChange={personalInfo => handleDataChange({ personalInfo })}
              />
            )}

            {activeTab === 'summary' && (
              <SummaryEditor
                summary={resume.summary}
                targetRole={resume.targetRole}
                careerLevel={resume.careerLevel}
                onChange={summary => handleDataChange({ summary })}
                onTrackEvent={StorageService.trackEvent}
              />
            )}

            {activeTab === 'experience' && (
              <ExperienceEditor
                experience={resume.experience}
                onChange={experience => handleDataChange({ experience })}
                onTrackEvent={StorageService.trackEvent}
              />
            )}

            {activeTab === 'education' && (
              <EducationEditor
                education={resume.education}
                onChange={education => handleDataChange({ education })}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsEditor
                skills={resume.skills}
                resume={resume}
                onChange={skills => handleDataChange({ skills })}
                onTrackEvent={StorageService.trackEvent}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsEditor
                projects={resume.projects}
                onChange={projects => handleDataChange({ projects })}
              />
            )}

            {activeTab === 'extra' && (
              <AdditionalSectionsEditor
                resume={resume}
                onChange={partial => handleDataChange(partial)}
              />
            )}

            {activeTab === 'design' && (
              <TemplateCustomizer
                currentTemplateId={resume.templateId}
                customization={resume.customization}
                onSelectTemplate={templateId => handleDataChange({ templateId })}
                onChangeCustomization={customizationUpdate =>
                  handleDataChange({ customization: { ...resume.customization, ...customizationUpdate } })
                }
              />
            )}
          </div>
        </div>

        {/* Right Side: Live Resume Document Preview (Desktop or Mobile preview) */}
        <div
          className={`w-full lg:w-1/2 flex flex-col bg-slate-200/80 relative overflow-hidden ${
            mobileView !== 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Preview Toolbar */}
          <div className="bg-slate-800 text-slate-200 px-4 py-2 flex items-center justify-between text-xs z-10">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Live PDF Preview</span>
              <span className="text-slate-400">({resume.customization?.paperSize?.toUpperCase() || 'A4'})</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomScale(Math.max(0.4, zoomScale - 0.1))}
                className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] text-slate-400">{Math.round(zoomScale * 100)}%</span>
              <button
                onClick={() => setZoomScale(Math.min(1.3, zoomScale + 0.1))}
                className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomScale(0.85)}
                className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
                title="Reset Zoom"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scaled Preview Canvas */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
            <ResumeTemplateRenderer resume={resume} scale={zoomScale} isPreview={true} />
          </div>
        </div>

        {/* Docked AI Coach Floating Panel */}
        {isAICoachOpen && (
          <div className="hidden lg:block w-80 h-full border-l border-slate-800 z-20 shrink-0">
            <AICoachPanel
              resume={resume}
              activeSection={activeTab}
              onClose={() => setIsAICoachOpen(false)}
            />
          </div>
        )}

        {/* Mobile Coach View */}
        {mobileView === 'coach' && (
          <div className="w-full h-full lg:hidden z-20">
            <AICoachPanel
              resume={resume}
              activeSection={activeTab}
              onClose={() => setMobileView('edit')}
            />
          </div>
        )}
      </div>

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
        resumeId={resume.id}
        currentResume={resume}
        onRestore={restored => {
          onUpdateResume(restored, true, 'Restored previous version');
          onShowToast({
            type: 'success',
            title: 'Version Restored',
            message: `Reverted to snapshot "${restored.title}" (${new Date(restored.updatedAt).toLocaleTimeString()})`,
          });
        }}
        onShowToast={onShowToast}
      />

      {/* A4 Print & Document Preview Modal */}
      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        resume={resume}
        onShowToast={onShowToast}
      />
    </div>
  );
};
