import React from 'react';
import {
  LayoutDashboard,
  FileText,
  PenTool,
  BarChart3,
  Sparkles,
  Search,
  Mail,
  Palette,
  Briefcase,
  Settings,
  Shield,
  CreditCard,
  PlusCircle,
  UploadCloud,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { UserProfile, ResumeData } from '../../types/resume';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user?: UserProfile;
  resumes?: ResumeData[];
  activeResumeId?: string;
  onSelectResume?: (id: string) => void;
  onCreateNewResume?: () => void;
  onUploadCV?: () => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  user,
  resumes = [],
  activeResumeId = '',
  onSelectResume = (_id: string) => {},
  onCreateNewResume = () => {},
  onUploadCV = () => {},
  isMobileMenuOpen = false,
  setIsMobileMenuOpen = (_open: boolean) => {},
}) => {
  const safeResumes = resumes || [];
  const navItems = [
    { id: 'landing', label: 'Overview & Landing', icon: Compass },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-generator', label: 'AI Resume Generator', icon: Sparkles },
    { id: 'my-resumes', label: 'My Resumes', icon: FileText, badge: safeResumes.length },
    { id: 'builder', label: 'Resume Builder', icon: PenTool },
    { id: 'analyzer', label: 'Resume Analyzer', icon: BarChart3 },
    { id: 'optimizer', label: 'AI Optimizer', icon: Sparkles },
    { id: 'job-matcher', label: 'Job Matcher', icon: Search },
    { id: 'cover-letter', label: 'Cover Letter', icon: Mail },
    { id: 'templates', label: 'Templates', icon: Palette },
    { id: 'career-tools', label: 'Career Tools', icon: Briefcase },
    { id: 'admin', label: 'Admin Telemetry', icon: Shield },
    { id: 'pricing', label: 'Plans & Pricing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 z-30 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1">
          {/* Sidebar Top Brand Header */}
          <button
            onClick={() => handleNavClick('landing')}
            className="flex h-16 items-center border-b border-slate-200 px-5 gap-2.5 hover:bg-slate-50 transition-colors text-left w-full cursor-pointer"
            title="View Homepage & Landing"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900">ResumeForge</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">AI</span>
            </div>
          </button>

          <div className="p-4 space-y-5 flex-1">
            {/* Quick Action Buttons */}
            <div className="space-y-1.5">
              <button
                onClick={() => handleNavClick('ai-generator')}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs py-2.5 px-3 rounded-lg shadow-xs transition-all"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>AI Resume Generator</span>
              </button>

              <button
                onClick={() => {
                  onCreateNewResume();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2 px-3 rounded-lg border border-slate-200 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-slate-500" />
                <span>Blank Resume</span>
              </button>

              <button
                onClick={() => {
                  onUploadCV();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs py-2 px-3 rounded-lg transition-colors border border-slate-200/80"
              >
                <UploadCloud className="w-4 h-4 text-slate-500" />
                <span>Import / Upload CV</span>
              </button>
            </div>

            {/* Primary Navigation List */}
            <div>
              <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Main
              </div>
              <nav className="space-y-1">
                {navItems.slice(0, 4).map(item => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-slate-100 text-blue-600 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tools Section */}
            <div>
              <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Tools & Services
              </div>
              <nav className="space-y-1">
                {navItems.slice(4).map(item => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-slate-100 text-blue-600 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Active Resumes Quick List */}
            {safeResumes.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-2">
                  <span>Recent Resumes</span>
                  <button onClick={() => handleNavClick('my-resumes')} className="text-blue-600 hover:underline">
                    All
                  </button>
                </div>
                <div className="space-y-1">
                  {safeResumes.slice(0, 3).map(res => (
                    <button
                      key={res.id}
                      onClick={() => {
                        onSelectResume(res.id);
                        handleNavClick('builder');
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        res.id === activeResumeId
                          ? 'bg-blue-50/80 text-blue-900 font-semibold border border-blue-200/80'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate max-w-[130px]">{res.title}</span>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {res.atsScore}%
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Tier Card at bottom */}
        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl bg-slate-900 p-4 text-white">
            <div className="text-xs font-semibold opacity-70">Account Tier</div>
            <div className="mt-1 text-sm font-bold flex items-center justify-between">
              <span>{user?.plan === 'free' ? 'Free Starter' : 'Pro Plan'}</span>
              <button
                onClick={() => handleNavClick('pricing')}
                className="text-[10px] bg-blue-500/30 hover:bg-blue-500/50 text-blue-300 px-2 py-0.5 rounded font-semibold transition-colors"
              >
                Upgrade
              </button>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, ((user?.aiCreditsRemaining || 100) / 150) * 100)}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] opacity-70">
              {user?.aiCreditsRemaining ?? 100} AI credits remaining
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
