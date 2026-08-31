import React from 'react';
import { Project } from '../../types/resume';
import { Plus, Trash2, FolderGit2, Globe, Github } from 'lucide-react';

interface ProjectsEditorProps {
  projects: Project[];
  onChange: (updated: Project[]) => void;
}

export const ProjectsEditor: React.FC<ProjectsEditorProps> = ({ projects, onChange }) => {
  const addProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: 'Project Name',
      role: 'Lead Architect',
      url: '',
      githubUrl: '',
      startDate: '2024-01',
      endDate: '2024-06',
      isCurrent: false,
      bullets: ['Built an interactive high-throughput system with real-time analytics.'],
      techStack: ['TypeScript', 'React', 'Node.js'],
    };
    onChange([...projects, newProj]);
  };

  const removeProject = (id: string) => {
    onChange(projects.filter(p => p.id !== id));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    onChange(
      projects.map(p => {
        if (p.id === id) {
          return { ...p, [field]: value };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Featured Projects</h3>
          <p className="text-xs text-slate-500">Showcase technical builds, client solutions, and open source work.</p>
        </div>

        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-1.5 px-3 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="space-y-3">
        {projects.map(proj => (
          <div key={proj.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">{proj.title || 'Untitled Project'}</span>
              </div>
              <button
                type="button"
                onClick={() => removeProject(proj.id)}
                className="text-slate-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Project Name</label>
                <input
                  type="text"
                  value={proj.title}
                  onChange={e => updateProject(proj.id, 'title', e.target.value)}
                  placeholder="e.g. HyperLog Observability"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Role / Contribution</label>
                <input
                  type="text"
                  value={proj.role || ''}
                  onChange={e => updateProject(proj.id, 'role', e.target.value)}
                  placeholder="e.g. Creator & Solo Architect"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Live URL / Demo</label>
                <input
                  type="text"
                  value={proj.url || ''}
                  onChange={e => updateProject(proj.id, 'url', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">GitHub / Code Repository</label>
                <input
                  type="text"
                  value={proj.githubUrl || ''}
                  onChange={e => updateProject(proj.id, 'githubUrl', e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Technologies Used (Comma Separated)
                </label>
                <input
                  type="text"
                  value={proj.techStack?.join(', ') || ''}
                  onChange={e =>
                    updateProject(
                      proj.id,
                      'techStack',
                      e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    )
                  }
                  placeholder="e.g. TypeScript, React, Go, Docker, AWS"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Key Accomplishment Bullet</label>
                <textarea
                  rows={2}
                  value={proj.bullets?.[0] || ''}
                  onChange={e => updateProject(proj.id, 'bullets', [e.target.value])}
                  placeholder="Engineered high-concurrency log parser processing 50k events/sec with sub-5ms latency..."
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
