import React, { useState } from 'react';
import { Sparkles, Wand2, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { AIService, SummaryGenResponse } from '../../services/aiService';

interface SummaryEditorProps {
  summary: string;
  targetRole?: string;
  careerLevel?: string;
  onChange: (updated: string) => void;
  onTrackEvent?: (name: string) => void;
}

export const SummaryEditor: React.FC<SummaryEditorProps> = ({
  summary,
  targetRole = 'Software Engineer',
  careerLevel = 'Mid Level',
  onChange,
  onTrackEvent,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<SummaryGenResponse | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('impact');
  const [error, setError] = useState<string | null>(null);

  const wordCount = summary.trim() ? summary.trim().split(/\s+/).length : 0;
  const charCount = summary.length;

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await AIService.generateSummary({
        targetRole,
        careerLevel,
        currentSummary: summary,
        style: selectedStyle,
      });
      setAiSuggestions(res);
      onTrackEvent?.('summary_ai_generated');
    } catch (err: any) {
      setError(err.message || 'Could not generate summary.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySuggestion = (text: string) => {
    onChange(text);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Professional Summary</h3>
          <p className="text-xs text-slate-500">
            A concise 3-4 sentence elevator pitch highlighting your target seniority and core achievements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStyle}
            onChange={e => setSelectedStyle(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700"
          >
            <option value="impact">Impact & Results</option>
            <option value="executive">Executive & Leadership</option>
            <option value="concise">Ultra-Concise</option>
            <option value="ats">ATS Keyword Rich</option>
          </select>
          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
            <span>{isGenerating ? 'Drafting...' : 'AI Generate'}</span>
          </button>
        </div>
      </div>

      <div>
        <textarea
          rows={4}
          value={summary}
          onChange={e => onChange(e.target.value)}
          placeholder="e.g. Dynamic Software Engineer with 5+ years of experience architecting resilient cloud systems..."
          className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
        />

        <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
          <span>
            {wordCount} words ({charCount} characters)
          </span>
          <span className={wordCount < 30 ? 'text-amber-500 font-medium' : wordCount > 80 ? 'text-amber-500' : 'text-emerald-600 font-medium'}>
            {wordCount < 30 ? 'Recommended: 35–60 words' : wordCount > 80 ? 'Too lengthy for 1-page CV' : 'Ideal summary length'}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* AI Suggestions Panel */}
      {aiSuggestions && aiSuggestions.summaries && (
        <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>AI Generated Variations for {targetRole}</span>
            </div>
            <span className="text-[11px] text-slate-400">Click to apply</span>
          </div>

          <div className="space-y-2.5">
            {aiSuggestions.summaries.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleApplySuggestion(item.text)}
                className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-indigo-300">{item.title || item.style}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.wordCount} words</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
