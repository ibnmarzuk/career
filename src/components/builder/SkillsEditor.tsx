import React, { useState } from 'react';
import { Skill, SkillCategory, ResumeData } from '../../types/resume';
import { Plus, X, Sparkles, Wand2, RefreshCw, Layers } from 'lucide-react';
import { AIService } from '../../services/aiService';

interface SkillsEditorProps {
  skills: Skill[];
  resume: ResumeData;
  onChange: (updated: Skill[]) => void;
  onTrackEvent?: (name: string) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({ skills, resume, onChange, onTrackEvent }) => {
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('Technical');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const categories: SkillCategory[] = ['Technical', 'Frameworks', 'Tools', 'Soft', 'Languages'];

  const addSkill = (name: string, category: SkillCategory = newSkillCategory) => {
    if (!name.trim()) return;
    if (skills.some(s => s && s.name && s.name.toLowerCase() === name.trim().toLowerCase())) return;

    const newSkill: Skill = {
      id: `sk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      category,
      level: 'Advanced',
    };
    onChange([...skills, newSkill]);
    setNewSkillName('');
  };

  const removeSkill = (id: string) => {
    onChange(skills.filter(s => s.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(newSkillName);
    }
  };

  const handleAISuggestSkills = async () => {
    setIsSuggesting(true);
    try {
      const res = await AIService.generateSkills({
        resume,
        targetRole: resume.targetRole || resume.personalInfo?.jobTitle,
      });

      const recs = res.recommendations;
      const combined = [
        ...(recs.technicalSkills || []),
        ...(recs.frameworksAndLibraries || []),
        ...(recs.toolsAndPlatforms || []),
        ...(recs.softSkills || []),
      ];

      // Filter out already present skills
      const existingNames = new Set(skills.filter(s => s && s.name).map(s => s.name.toLowerCase()));
      const filtered = combined.filter(name => !existingNames.has(name.toLowerCase()));

      setAiSuggestions(filtered.slice(0, 15));
      onTrackEvent?.('skills_ai_suggested');
    } catch (err) {
      console.error('Error generating skills', err);
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Skills & Competencies</h3>
          <p className="text-xs text-slate-500">
            Categorized technical and domain competencies parsed by ATS screening bots.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAISuggestSkills}
          disabled={isSuggesting}
          className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
        >
          {isSuggesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
          <span>{isSuggesting ? 'Analyzing...' : 'AI Suggest Skills'}</span>
        </button>
      </div>

      {/* Quick Add Input */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <select
          value={newSkillCategory}
          onChange={e => setNewSkillCategory(e.target.value as SkillCategory)}
          className="w-full sm:w-36 text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Type skill name & press Enter (e.g. React, PostgreSQL, Docker)..."
            value={newSkillName}
            onChange={e => setNewSkillName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <button
          type="button"
          onClick={() => addSkill(newSkillName)}
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 px-4 rounded-lg transition-colors"
        >
          Add
        </button>
      </div>

      {/* AI Suggestions Chips */}
      {aiSuggestions.length > 0 && (
        <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Suggested Skills for {resume.targetRole || 'Your Role'}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {aiSuggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  addSkill(s, 'Technical');
                  setAiSuggestions(aiSuggestions.filter(item => item !== s));
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-indigo-600 hover:text-white text-xs font-medium text-slate-700 border border-slate-200 shadow-2xs transition-colors group"
              >
                <span>+ {s}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Skills List by Category */}
      <div className="space-y-3 pt-2">
        {categories.map(cat => {
          const categorySkills = skills.filter(s => s.category === cat);
          if (categorySkills.length === 0) return null;

          return (
            <div key={cat} className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{cat}</span>
              <div className="flex flex-wrap gap-1.5">
                {categorySkills.map(sk => (
                  <div
                    key={sk.id}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                  >
                    <span>{sk?.name || ''}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(sk.id)}
                      className="text-slate-400 hover:text-rose-600 ml-1 p-0.5 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
