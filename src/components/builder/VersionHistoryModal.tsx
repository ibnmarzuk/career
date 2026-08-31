import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { ResumeVersion, ResumeData } from '../../types/resume';
import {
  History,
  RotateCcw,
  Clock,
  Check,
  Edit2,
  Trash2,
  Plus,
  ArrowRight,
  ShieldCheck,
  FileText,
  Sparkles,
  Layers,
  Search,
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { ResumeTemplateRenderer } from '../templates/ResumeTemplateRenderer';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeId: string;
  currentResume: ResumeData;
  onRestore: (restored: ResumeData) => void;
  onShowToast?: (toast: { type: 'success' | 'error' | 'info' | 'warning'; title: string; message?: string }) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  resumeId,
  currentResume,
  onRestore,
  onShowToast,
}) => {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string>('');
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);
  const [newSnapshotName, setNewSnapshotName] = useState('');
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'preview'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const refreshVersions = () => {
    const list = StorageService.getVersions(resumeId);
    setVersions(list);
    if (list.length > 0 && (!selectedVersionId || !list.some(v => v.id === selectedVersionId))) {
      setSelectedVersionId(list[0].id);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshVersions();
    }
  }, [isOpen, resumeId]);

  const selectedVersion = versions.find(v => v.id === selectedVersionId);

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSnapshotName.trim()) return;

    const created = StorageService.createVersionSnapshot(
      currentResume,
      'Manual Named Snapshot',
      newSnapshotName.trim()
    );

    setNewSnapshotName('');
    setIsCreatingSnapshot(false);
    refreshVersions();
    setSelectedVersionId(created.id);

    if (onShowToast) {
      onShowToast({
        type: 'success',
        title: 'Snapshot Saved',
        message: `Named "${created.title}" successfully captured.`,
      });
    }
  };

  const handleRenameVersion = (versionId: string) => {
    if (!editingName.trim()) {
      setEditingVersionId(null);
      return;
    }

    StorageService.renameVersion(versionId, editingName.trim());
    setEditingVersionId(null);
    setEditingName('');
    refreshVersions();

    if (onShowToast) {
      onShowToast({
        type: 'success',
        title: 'Snapshot Renamed',
        message: `Updated name to "${editingName.trim()}".`,
      });
    }
  };

  const handleDeleteVersion = (e: React.MouseEvent, versionId: string, title: string) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete snapshot "${title}"?`)) {
      StorageService.deleteVersion(versionId);
      refreshVersions();
      if (onShowToast) {
        onShowToast({
          type: 'info',
          title: 'Snapshot Deleted',
          message: `Removed "${title}" from history.`,
        });
      }
    }
  };

  const handleRestore = (verId: string) => {
    const target = versions.find(v => v.id === verId);
    if (!target) return;

    if (
      confirm(
        `Restore snapshot "${target.title}"? Your current changes will be backed up as a new snapshot automatically.`
      )
    ) {
      // Auto backup current live state before rollback
      StorageService.createVersionSnapshot(
        currentResume,
        'Auto-Backup Pre-Restore',
        `Pre-Restore Backup (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
      );

      const restored = StorageService.restoreVersion(verId);
      if (restored) {
        onRestore(restored);
        onClose();
      }
    }
  };

  const filteredVersions = versions.filter(
    v =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.action?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resume Version History & Snapshots"
      subtitle="View, name, compare, and restore full snapshots of your resume across key editing milestones."
      maxWidth="5xl"
    >
      <div className="space-y-4">
        {/* Header Action Bar: Create Snapshot Form */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Current Resume: {currentResume.title}</div>
              <div className="text-[11px] text-slate-500">
                {versions.length} recorded version snapshots in storage
              </div>
            </div>
          </div>

          {!isCreatingSnapshot ? (
            <button
              type="button"
              onClick={() => {
                setIsCreatingSnapshot(true);
                setNewSnapshotName(`Milestone - ${new Date().toLocaleDateString()}`);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Capture New Snapshot</span>
            </button>
          ) : (
            <form onSubmit={handleCreateSnapshot} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                autoFocus
                placeholder="Snapshot Name (e.g., Pre-Google Interview)"
                value={newSnapshotName}
                onChange={e => setNewSnapshotName(e.target.value)}
                className="text-xs px-3 py-1.5 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white min-w-[220px]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingSnapshot(false)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
            </form>
          )}
        </div>

        {versions.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <History className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Snapshot History Yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Snapshots are automatically captured during AI enhancements, major section rewrites, and template switches. You can also name and capture a milestone anytime.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsCreatingSnapshot(true);
                setNewSnapshotName(`Initial Baseline - ${new Date().toLocaleDateString()}`);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Capture First Snapshot</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Version List Sidebar (5 cols) */}
            <div className="md:col-span-5 space-y-2 flex flex-col">
              {/* Search filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search snapshots by name or action..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* List */}
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {filteredVersions.map((ver, idx) => {
                  const isSelected = ver.id === selectedVersionId;
                  const date = new Date(ver.timestamp);
                  const isEditing = editingVersionId === ver.id;

                  return (
                    <div
                      key={ver.id}
                      onClick={() => setSelectedVersionId(ver.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-2xs'
                          : 'border-slate-200 hover:bg-slate-50/80 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        {isEditing ? (
                          <div
                            className="flex-1 flex items-center gap-1"
                            onClick={e => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={editingName}
                              onChange={e => setEditingName(e.target.value)}
                              autoFocus
                              className="text-xs px-2 py-1 border border-indigo-400 rounded bg-white w-full"
                            />
                            <button
                              type="button"
                              onClick={() => handleRenameVersion(ver.id)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {ver.title || 'Untitled Snapshot'}
                              </span>
                              {idx === 0 && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
                                  Latest
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1">
                              <span className="truncate">{ver.action || 'Auto Save'}</span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            {ver.atsScore || 85}% ATS
                          </span>

                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              setEditingVersionId(ver.id);
                              setEditingName(ver.title || '');
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200/60 transition-colors"
                            title="Rename Snapshot"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>

                          <button
                            type="button"
                            onClick={e => handleDeleteVersion(e, ver.id, ver.title)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                            title="Delete Snapshot"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between pt-1.5 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>
                            {date.toLocaleDateString()} at{' '}
                            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {ver.snapshot?.experience?.length || 0} exp • {ver.snapshot?.skills?.length || 0} skills
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Version Detail, Comparison & Document View (7 cols) */}
            <div className="md:col-span-7 bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between min-h-[460px]">
              {selectedVersion ? (
                <div className="space-y-3 flex-1 flex flex-col">
                  {/* Top Bar of Selected Version */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{selectedVersion.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          ATS Score: {selectedVersion.atsScore}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Captured {new Date(selectedVersion.timestamp).toLocaleString()} • Trigger: {selectedVersion.action}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRestore(selectedVersion.id)}
                      className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-1.5 px-3.5 rounded-lg shadow-2xs transition-colors self-start sm:self-auto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore Snapshot</span>
                    </button>
                  </div>

                  {/* Sub Tabs: Overview vs Comparison vs Full Preview */}
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('overview')}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                        activeTab === 'overview'
                          ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Snapshot Content
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('comparison')}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                        activeTab === 'comparison'
                          ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Diff vs Current Live
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                        activeTab === 'preview'
                          ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Mini Document Preview
                    </button>
                  </div>

                  {/* Tab 1: Overview */}
                  {activeTab === 'overview' && (
                    <div className="space-y-3 text-xs flex-1 overflow-y-auto max-h-[340px] pr-1">
                      {/* Summary box */}
                      <div className="bg-white rounded-lg border border-slate-200 p-3">
                        <span className="font-bold text-slate-900 block mb-1">Professional Summary:</span>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                          {selectedVersion.snapshot.summary || 'No summary text present in this snapshot.'}
                        </p>
                      </div>

                      {/* Work Experience */}
                      <div className="bg-white rounded-lg border border-slate-200 p-3">
                        <span className="font-bold text-slate-900 block mb-1.5">
                          Work Experience ({selectedVersion.snapshot.experience?.length || 0} positions):
                        </span>
                        <div className="space-y-2">
                          {selectedVersion.snapshot.experience?.map(exp => (
                            <div key={exp.id} className="border-l-2 border-indigo-400 pl-2.5 py-0.5">
                              <div className="font-semibold text-slate-800 text-[11px]">
                                {exp.jobTitle} • <span className="text-slate-600">{exp.company}</span>
                              </div>
                              <div className="text-[10px] text-slate-400">{exp.startDate} - {exp.endDate || 'Present'}</div>
                              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                                {exp.bullets?.[0] || 'No bullet text.'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Skills & Stats */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white rounded-lg border border-slate-200 p-2.5">
                          <span className="font-bold text-slate-900 block text-[11px] mb-1">
                            Skills ({selectedVersion.snapshot.skills?.length || 0})
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {selectedVersion.snapshot.skills?.slice(0, 8).map(sk => (
                              <span
                                key={sk.id}
                                className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]"
                              >
                                {sk.name}
                              </span>
                            ))}
                            {(selectedVersion.snapshot.skills?.length || 0) > 8 && (
                              <span className="text-[10px] text-slate-400">+{(selectedVersion.snapshot.skills?.length || 0) - 8} more</span>
                            )}
                          </div>
                        </div>

                        <div className="bg-white rounded-lg border border-slate-200 p-2.5">
                          <span className="font-bold text-slate-900 block text-[11px] mb-1">
                            Template & Typography
                          </span>
                          <div className="text-[11px] text-slate-600 space-y-0.5">
                            <div>Layout: <strong className="text-slate-800">{selectedVersion.snapshot.templateId}</strong></div>
                            <div>Font: <strong className="text-slate-800">{selectedVersion.snapshot.customization?.fontFamily || 'Default'}</strong></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Comparison vs Current Live */}
                  {activeTab === 'comparison' && (
                    <div className="space-y-3 text-xs flex-1 overflow-y-auto max-h-[340px] pr-1">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          Comparing <strong>Snapshot ({selectedVersion.title})</strong> vs <strong>Current Live Resume</strong>.
                        </span>
                      </div>

                      {/* Summary comparison */}
                      <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-2">
                        <span className="font-bold text-slate-900 block">Summary Comparison:</span>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="p-2 bg-slate-50 rounded border border-slate-200">
                            <span className="text-[10px] font-bold text-indigo-700 uppercase block mb-1">In Snapshot</span>
                            <p className="text-slate-600 line-clamp-4">{selectedVersion.snapshot.summary || 'Empty'}</p>
                          </div>
                          <div className="p-2 bg-emerald-50/60 rounded border border-emerald-200">
                            <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">Current Live</span>
                            <p className="text-slate-600 line-clamp-4">{currentResume.summary || 'Empty'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Experience and Skills counts */}
                      <div className="bg-white rounded-lg border border-slate-200 p-3">
                        <span className="font-bold text-slate-900 block mb-2">Metrics & Metadata:</span>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 bg-slate-50 rounded border">
                            <div className="text-[10px] text-slate-500">ATS Score</div>
                            <div className="font-bold text-xs text-slate-900">
                              {selectedVersion.atsScore}% → {currentResume.atsScore}%
                            </div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded border">
                            <div className="text-[10px] text-slate-500">Experience Items</div>
                            <div className="font-bold text-xs text-slate-900">
                              {selectedVersion.snapshot.experience?.length || 0} → {currentResume.experience?.length || 0}
                            </div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded border">
                            <div className="text-[10px] text-slate-500">Total Skills</div>
                            <div className="font-bold text-xs text-slate-900">
                              {selectedVersion.snapshot.skills?.length || 0} → {currentResume.skills?.length || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Mini Document Preview */}
                  {activeTab === 'preview' && (
                    <div className="flex-1 bg-slate-900 rounded-lg p-2 overflow-y-auto max-h-[340px] flex justify-center items-start shadow-inner">
                      <div
                        style={{
                          width: '210mm',
                          transform: 'scale(0.55)',
                          transformOrigin: 'top center',
                        }}
                        className="bg-white shadow-xl pointer-events-none"
                      >
                        <ResumeTemplateRenderer resume={selectedVersion.snapshot} isPreview={true} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400 text-xs">
                  Select a version from the left panel to inspect details.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
