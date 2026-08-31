import React from 'react';
import { ResumeData, Certification, Award, Language, SectionKey } from '../../types/resume';
import { Plus, Trash2, Award as AwardIcon, CheckCircle, Globe2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';

interface AdditionalSectionsEditorProps {
  resume: ResumeData;
  onChange: (updated: Partial<ResumeData>) => void;
}

export const AdditionalSectionsEditor: React.FC<AdditionalSectionsEditorProps> = ({ resume, onChange }) => {
  const {
    certifications = [],
    awards = [],
    languages = [],
    sectionOrder = ['personal', 'summary', 'experience', 'skills', 'projects', 'education', 'certifications', 'awards', 'languages'],
    enabledSections = {} as Record<SectionKey, boolean>,
  } = resume;

  // Toggle Section Visibility
  const toggleSection = (key: SectionKey) => {
    onChange({
      enabledSections: {
        ...enabledSections,
        [key]: enabledSections[key] === false ? true : false,
      },
    });
  };

  // Reorder Sections
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...sectionOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;

    onChange({ sectionOrder: newOrder });
  };

  // --- Certifications Management ---
  const addCert = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: 'Certification Title',
      issuer: 'Issuing Body / Cloud Provider',
      issueDate: '2023-05',
    };
    onChange({ certifications: [...certifications, newCert] });
  };

  const removeCert = (id: string) => {
    onChange({ certifications: certifications.filter(c => c.id !== id) });
  };

  const updateCert = (id: string, field: keyof Certification, value: any) => {
    onChange({
      certifications: certifications.map(c => (c.id === id ? { ...c, [field]: value } : c)),
    });
  };

  // --- Awards Management ---
  const addAward = () => {
    const newAw: Award = {
      id: `aw-${Date.now()}`,
      title: 'Award / Honor Title',
      issuer: 'Organization / University',
      date: '2024',
      description: '',
    };
    onChange({ awards: [...awards, newAw] });
  };

  const removeAward = (id: string) => {
    onChange({ awards: awards.filter(a => a.id !== id) });
  };

  const updateAward = (id: string, field: keyof Award, value: any) => {
    onChange({
      awards: awards.map(a => (a.id === id ? { ...a, [field]: value } : a)),
    });
  };

  // --- Languages Management ---
  const addLanguage = () => {
    const newLang: Language = {
      id: `lang-${Date.now()}`,
      name: 'Language Name',
      proficiency: 'Fluent',
    };
    onChange({ languages: [...languages, newLang] });
  };

  const removeLanguage = (id: string) => {
    onChange({ languages: languages.filter(l => l.id !== id) });
  };

  const updateLanguage = (id: string, field: keyof Language, value: any) => {
    onChange({
      languages: languages.map(l => (l.id === id ? { ...l, [field]: value } : l)),
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Structure & Reordering */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Section Hierarchy & Visibility</h4>
        <p className="text-xs text-slate-500">Reorder sections or toggle their appearance in the generated PDF.</p>

        <div className="space-y-1.5 pt-1">
          {sectionOrder.map((sec, idx) => {
            const isEnabled = enabledSections[sec] !== false;
            return (
              <div
                key={sec}
                className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
              >
                <span className="font-semibold text-slate-700 capitalize">{sec}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveSection(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(idx, 'down')}
                    disabled={idx === sectionOrder.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSection(sec)}
                    className={`p-1 rounded ${isEnabled ? 'text-indigo-600' : 'text-slate-400'}`}
                    title={isEnabled ? 'Visible on PDF' : 'Hidden'}
                  >
                    {isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Certifications Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Certifications & Licenses</h3>
          <button
            type="button"
            onClick={addCert}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Certification</span>
          </button>
        </div>

        <div className="space-y-2">
          {certifications.map(cert => (
            <div key={cert.id} className="p-3 bg-white rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Certification Name"
                value={cert?.name || ''}
                onChange={e => updateCert(cert.id, 'name', e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg sm:col-span-1"
              />
              <input
                type="text"
                placeholder="Issuer (e.g. AWS, Meta)"
                value={cert.issuer}
                onChange={e => updateCert(cert.id, 'issuer', e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Date (2023-04)"
                  value={cert.issueDate || ''}
                  onChange={e => updateCert(cert.id, 'issueDate', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeCert(cert.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Awards Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Honors & Awards</h3>
          <button
            type="button"
            onClick={addAward}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Award</span>
          </button>
        </div>

        <div className="space-y-2">
          {awards.map(aw => (
            <div key={aw.id} className="p-3 bg-white rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Award Title"
                value={aw.title}
                onChange={e => updateAward(aw.id, 'title', e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Issuer / Org"
                value={aw.issuer}
                onChange={e => updateAward(aw.id, 'issuer', e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Date (2024)"
                  value={aw.date || ''}
                  onChange={e => updateAward(aw.id, 'date', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeAward(aw.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Languages Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Languages</h3>
          <button
            type="button"
            onClick={addLanguage}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Language</span>
          </button>
        </div>

        <div className="space-y-2">
          {languages.map(lang => (
            <div key={lang.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
              <input
                type="text"
                placeholder="Language (e.g. English)"
                value={lang?.name || ''}
                onChange={e => updateLanguage(lang.id, 'name', e.target.value)}
                className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
              <select
                value={lang.proficiency}
                onChange={e => updateLanguage(lang.id, 'proficiency', e.target.value)}
                className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
              >
                <option value="Native">Native</option>
                <option value="Fluent">Fluent</option>
                <option value="Professional">Professional Working</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Basic">Elementary</option>
              </select>
              <button
                type="button"
                onClick={() => removeLanguage(lang.id)}
                className="text-slate-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
