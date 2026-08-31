import React from 'react';
import { Education } from '../../types/resume';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

interface EducationEditorProps {
  education: Education[];
  onChange: (updated: Education[]) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({ education, onChange }) => {
  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: 'University Name',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      location: 'City, State',
      startDate: '2018',
      endDate: '2022',
      isCurrent: false,
      gpa: '',
      honors: '',
    };
    onChange([...education, newEdu]);
  };

  const removeEducation = (id: string) => {
    onChange(education.filter(e => e.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    onChange(
      education.map(e => {
        if (e.id === id) {
          return { ...e, [field]: value };
        }
        return e;
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Education & Academics</h3>
          <p className="text-xs text-slate-500">Add degrees, certifications, universities, and academic honors.</p>
        </div>

        <button
          type="button"
          onClick={addEducation}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-1.5 px-3 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Degree</span>
        </button>
      </div>

      <div className="space-y-3">
        {education.map(edu => (
          <div key={edu.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">{edu.degree || 'Degree'}</span>
              </div>
              <button
                type="button"
                onClick={() => removeEducation(edu.id)}
                className="text-slate-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Institution / University</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={e => updateEducation(edu.id, 'institution', e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Degree & Major</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Start & Graduation Year</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Start (2018)"
                    value={edu.startDate || ''}
                    onChange={e => updateEducation(edu.id, 'startDate', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="End (2022)"
                    value={edu.endDate || ''}
                    onChange={e => updateEducation(edu.id, 'endDate', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">GPA / Honors (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 3.85 / Magna Cum Laude"
                  value={edu.honors || edu.gpa || ''}
                  onChange={e => updateEducation(edu.id, 'honors', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
