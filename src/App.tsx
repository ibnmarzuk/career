import React, { useState, useEffect } from 'react';
import { ResumeData, UserProfile, TemplateId } from './types/resume';
import { StorageService } from './services/storageService';
import { INITIAL_RESUMES } from './data/initialResumes';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { MyResumes } from './components/dashboard/MyResumes';
import { ResumeBuilder } from './components/builder/ResumeBuilder';
import { ResumeAnalyzer } from './components/analyzer/ResumeAnalyzer';
import { AIOptimizer } from './components/optimizer/AIOptimizer';
import { JobMatcher } from './components/jobmatcher/JobMatcher';
import { CoverLetterGenerator } from './components/coverletter/CoverLetterGenerator';
import { AIResumeGenerator } from './components/generator/AIResumeGenerator';
import { PrintPreviewModal } from './components/builder/PrintPreviewModal';
import { ResumeImporterModal } from './components/importer/ResumeImporterModal';
import { Toast, ToastMessage } from './components/common/Toast';
import { DEFAULT_CUSTOMIZATION } from './types/resume';
import { FileText } from 'lucide-react';

// Authentication Pages & Guard
import { useAuth } from './context/AuthContext';
import { AuthGuard, AUTH_ROUTES } from './components/auth/AuthGuard';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import { VerifyEmailPage } from './components/auth/VerifyEmailPage';
import { OnboardingPage } from './components/auth/OnboardingPage';
import { LandingPage } from './components/landing/LandingPage';

export function App() {
  const { user: authUser, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Helper to resolve current view from hash or pathname
  const resolveViewFromLocation = (): string => {
    try {
      const hash = window.location.hash.replace('#', '').replace(/^\//, '').trim();
      if (hash) return hash;
      const pathname = window.location.pathname.replace(/^\//, '').trim();
      if (pathname && pathname !== 'index.html') return pathname;
    } catch {
      // ignore
    }
    return 'landing';
  };

  // Navigation State - initialized from hash or pathname, defaults to landing
  const [currentView, setCurrentView] = useState<string>(resolveViewFromLocation);

  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string>('');
  const [user, setUser] = useState<UserProfile>(() => authUser || StorageService.getUserProfile());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals State
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [printResumeTarget, setPrintResumeTarget] = useState<ResumeData | null>(null);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync state when authUser changes
  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  // Synchronize URL Hash with view navigation
  const navigateTo = (view: string) => {
    setCurrentView(view);
    window.location.hash = view;
  };

  // Listen for browser hash and popstate changes
  useEffect(() => {
    const handleLocationChange = () => {
      const view = resolveViewFromLocation();
      if (view && view !== currentView) {
        setCurrentView(view);
      }
    };
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [currentView]);

  // Initialize data on mount
  useEffect(() => {
    const loaded = StorageService.getResumes();
    setResumes(loaded);
    if (loaded && loaded.length > 0) {
      setActiveResumeId(loaded[0].id);
    }

    // Check if onboarding is needed for non-auth or new user
    if (!StorageService.isOnboardingComplete() && !AUTH_ROUTES.includes(currentView) && currentView !== 'landing') {
      navigateTo('onboarding');
    }
  }, []);

  const activeResume = resumes.find(r => r.id === activeResumeId) || resumes[0] || INITIAL_RESUMES[0];

  // Resume State Management
  const handleUpdateResume = (updated: ResumeData, shouldSnapshot = false, actionName?: string) => {
    const newResumes = resumes.map(r => (r.id === updated.id ? updated : r));
    setResumes(newResumes);
    StorageService.saveResume(updated, shouldSnapshot, actionName);
  };

  const handleCreateResume = (title = 'Untitled Resume', targetRole = 'Software Engineer') => {
    const newResume: ResumeData = {
      id: `resume-${Date.now()}`,
      userId: user.id,
      title,
      targetRole,
      careerLevel: 'Mid Level',
      templateId: 'modern-clean',
      customization: DEFAULT_CUSTOMIZATION,
      personalInfo: {
        fullName: user?.name || 'Your Full Name',
        email: user?.email || 'your.email@example.com',
        phone: '+1 (555) 019-2834',
        location: 'San Francisco, CA',
        jobTitle: targetRole,
        linkedin: 'https://linkedin.com/in/profile',
        github: 'https://github.com/profile',
      },
      summary:
        'Results-driven professional with proven expertise in building robust, performant solutions and driving engineering excellence across agile teams.',
      experience: [
        {
          id: `exp-${Date.now()}`,
          jobTitle: targetRole,
          company: 'Acme Corporation',
          location: 'San Francisco, CA',
          employmentType: 'Full-time',
          startDate: '2022-03',
          endDate: 'Present',
          isCurrent: true,
          bullets: [
            'Architected and deployed high-throughput backend services reducing system response latency by 35%.',
            'Partnered with product managers and designers to launch key SaaS capabilities to over 100k active users.',
          ],
          skillsUsed: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
        },
      ],
      education: [
        {
          id: `edu-${Date.now()}`,
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science in Computer Science',
          fieldOfStudy: 'Computer Science',
          location: 'Berkeley, CA',
          startDate: '2016-09',
          endDate: '2020-05',
          isCurrent: false,
          gpa: '3.8',
          honors: 'Dean’s Honors List',
        },
      ],
      skills: [
        { id: 'sk-1', name: 'TypeScript', level: 'Expert', category: 'Languages' },
        { id: 'sk-2', name: 'React & Next.js', level: 'Expert', category: 'Frameworks' },
        { id: 'sk-3', name: 'Node.js', level: 'Advanced', category: 'Technical' },
        { id: 'sk-4', name: 'PostgreSQL', level: 'Advanced', category: 'Technical' },
        { id: 'sk-5', name: 'Tailwind CSS', level: 'Expert', category: 'Frameworks' },
        { id: 'sk-6', name: 'Docker & Kubernetes', level: 'Intermediate', category: 'Tools' },
      ],
      projects: [
        {
          id: `proj-${Date.now()}`,
          title: 'Cloud Workflow Automation Engine',
          role: 'Lead Architect',
          bullets: ['Engineered an event-driven workflow engine handling 2M+ daily asynchronous jobs with automated failure recovery.'],
          url: 'https://github.com/profile/engine',
          techStack: ['TypeScript', 'Kafka', 'Redis', 'Docker'],
        },
      ],
      certifications: [
        { id: 'cert-1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', issueDate: '2023-04' },
      ],
      awards: [
        { id: 'aw-1', title: 'Top Engineering Innovator Award', issuer: 'Acme Corp', date: '2023' },
      ],
      languages: [
        { id: 'lang-1', name: 'English', proficiency: 'Native' },
        { id: 'lang-2', name: 'Spanish', proficiency: 'Professional' },
      ],
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
      status: 'draft',
      atsScore: 85,
      completionScore: 90,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = StorageService.saveResume(newResume, true, 'Created New Resume');
    setResumes([saved, ...resumes]);
    setActiveResumeId(saved.id);
    navigateTo('builder');

    addToast({
      type: 'success',
      title: 'New Resume Created',
      message: 'Ready for editing and AI optimization.',
    });
  };

  const handleDuplicateResume = (id: string) => {
    const duplicated = StorageService.duplicateResume(id);
    if (duplicated) {
      setResumes(StorageService.getResumes());
      setActiveResumeId(duplicated.id);
      addToast({
        type: 'success',
        title: 'Resume Duplicated',
        message: `Created "${duplicated.title}"`,
      });
    }
  };

  const handleDeleteResume = (id: string) => {
    StorageService.deleteResume(id);
    const updated = StorageService.getResumes();
    setResumes(updated);
    if (activeResumeId === id && updated && updated.length > 0) {
      setActiveResumeId(updated[0].id);
    }
    addToast({
      type: 'info',
      title: 'Resume Deleted',
    });
  };

  const handleSelectResumeToEdit = (id: string) => {
    setActiveResumeId(id);
    navigateTo('builder');
  };

  const handleImportResume = (imported: ResumeData) => {
    const saved = StorageService.saveResume(imported, true, 'Imported from Document');
    setResumes([saved, ...resumes]);
    setActiveResumeId(saved.id);
    navigateTo('builder');
    addToast({
      type: 'success',
      title: 'CV Imported Successfully',
      message: 'Structured data loaded into the resume builder.',
    });
  };

  const handleExportPDF = (res: ResumeData) => {
    setActiveResumeId(res.id);
    navigateTo('builder');
    addToast({
      type: 'info',
      title: 'Opening Resume in Document Studio',
      message: 'Ready for PDF download or print.',
    });
  };

  // Render Standalone Authentication & Onboarding Routes
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-slate-900 antialiased">
        <LoginPage onNavigate={navigateTo} />
        {/* Global Toast Container */}
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast toast={toast} onClose={removeToast} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentView === 'signup') {
    return (
      <div className="min-h-screen bg-slate-900 antialiased">
        <SignupPage onNavigate={navigateTo} />
        {/* Global Toast Container */}
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast toast={toast} onClose={removeToast} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentView === 'forgot-password') {
    return (
      <div className="min-h-screen bg-slate-900 antialiased">
        <ForgotPasswordPage onNavigate={navigateTo} />
        {/* Global Toast Container */}
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast toast={toast} onClose={removeToast} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentView === 'reset-password') {
    return (
      <div className="min-h-screen bg-slate-900 antialiased">
        <ResetPasswordPage onNavigate={navigateTo} />
        {/* Global Toast Container */}
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast toast={toast} onClose={removeToast} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentView === 'verify-email') {
    return (
      <div className="min-h-screen bg-slate-900 antialiased">
        <VerifyEmailPage onNavigate={navigateTo} />
        {/* Global Toast Container */}
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast toast={toast} onClose={removeToast} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentView === 'onboarding') {
    return (
      <div className="min-h-screen bg-slate-900 antialiased">
        <OnboardingPage
          onNavigate={navigateTo}
          onComplete={() => {
            addToast({
              type: 'success',
              title: 'Personalization Complete',
              message: 'Your profile and career preferences have been saved.',
            });
            navigateTo('dashboard');
          }}
        />
        {/* Global Toast Container */}
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast toast={toast} onClose={removeToast} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-900 antialiased">
        <Navbar
          currentView={currentView}
          onNavigate={navigateTo}
          user={user}
          activeResume={activeResume}
          onOpenAuth={() => navigateTo('login')}
          onOpenPricing={() => navigateTo('pricing')}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <LandingPage
          onNavigate={navigateTo}
          onCreateResume={() => handleCreateResume()}
          onUploadCV={() => setIsImporterOpen(true)}
        />
        {/* Modals & Dialogs */}
        {isImporterOpen && (
          <ResumeImporterModal
            isOpen={isImporterOpen}
            onClose={() => setIsImporterOpen(false)}
            onImportSuccess={handleImportResume}
            onShowToast={addToast}
          />
        )}
        {/* Global Toast Container */}
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast toast={toast} onClose={removeToast} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <AuthGuard currentView={currentView} onNavigate={navigateTo}>
      <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-900 font-sans">
        {/* Top Application Navbar */}
        <Navbar
          currentView={currentView}
          onNavigate={navigateTo}
          user={user}
          activeResume={activeResume}
          onOpenAuth={() => navigateTo('login')}
          onOpenPricing={() => navigateTo('pricing')}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Main App Workspace Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Sidebar */}
          <Sidebar
            currentView={currentView}
            onNavigate={navigateTo}
            user={user}
            resumes={resumes}
            activeResumeId={activeResumeId}
            onSelectResume={handleSelectResumeToEdit}
            onCreateNewResume={() => handleCreateResume()}
            onUploadCV={() => setIsImporterOpen(true)}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />

          {/* Dynamic Route View */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {currentView === 'dashboard' && (
              <Dashboard
                user={user}
                resumes={resumes}
                activeResume={activeResume}
                onNavigate={navigateTo}
                onSelectResume={handleSelectResumeToEdit}
                onCreateNewResume={() => handleCreateResume()}
                onUploadCV={() => setIsImporterOpen(true)}
                onExportPDF={handleExportPDF}
                onDuplicateResume={handleDuplicateResume}
              />
            )}

            {(currentView === 'ai-generator' || currentView === 'generator' || currentView === 'ai-resume-generator') && (
              <AIResumeGenerator
                user={user}
                onNavigate={navigateTo}
                onSelectResume={handleSelectResumeToEdit}
                onOpenPrintPreview={resumeToPrint => setPrintResumeTarget(resumeToPrint)}
              />
            )}

            {(currentView === 'my-resumes' || currentView === 'resumes') && (
              <MyResumes
                resumes={resumes}
                activeResumeId={activeResumeId}
                onSelectResume={handleSelectResumeToEdit}
                onCreateResume={() => handleCreateResume()}
                onUploadCV={() => setIsImporterOpen(true)}
                onDuplicateResume={handleDuplicateResume}
                onDeleteResume={handleDeleteResume}
              />
            )}

            {currentView === 'builder' && (
              <ResumeBuilder
                resume={activeResume}
                user={user}
                onUpdateResume={handleUpdateResume}
                onNavigate={navigateTo}
                onShowToast={addToast}
              />
            )}

            {currentView === 'analyzer' && (
              <ResumeAnalyzer
                resume={activeResume}
                onNavigate={navigateTo}
                onOptimize={() => navigateTo('optimizer')}
              />
            )}

            {currentView === 'optimizer' && (
              <AIOptimizer
                resume={activeResume}
                onApplyOptimizations={updated => handleUpdateResume(updated, true, 'AI Resume Optimization')}
                onNavigate={navigateTo}
                onShowToast={addToast}
              />
            )}

            {(currentView === 'job-matcher' || currentView === 'matcher') && (
              <JobMatcher
                resume={activeResume}
                onTailorResume={_jd => {
                  navigateTo('optimizer');
                }}
              />
            )}

            {currentView === 'cover-letter' && (
              <CoverLetterGenerator
                resume={activeResume}
                onShowToast={addToast}
              />
            )}

            {currentView === 'templates' && (
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Resume Templates</h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Select a layout archetype to apply instantly to "{activeResume?.title}".
                    </p>
                  </div>
                  <button
                    onClick={() => navigateTo('builder')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
                  >
                    Return to Builder
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { id: 'modern-clean', name: 'Modern Clean', badge: 'Popular', desc: 'Minimalist single-column format optimized for tech & modern roles.' },
                    { id: 'executive-pro', name: 'Executive Pro', badge: 'ATS High', desc: 'Traditional two-column layout with deep contrast and classic styling.' },
                    { id: 'tech-minimalist', name: 'Tech Minimalist', badge: 'Technical', desc: 'Code-inspired dense typographic design for developers & engineers.' },
                    { id: 'creative-bold', name: 'Creative Bold', badge: 'Creative', desc: 'Vibrant header styling with distinctive accents for marketing & product.' },
                  ].map(tpl => (
                    <div
                      key={tpl.id}
                      className={`bg-white rounded-xl border p-5 flex flex-col justify-between transition-all ${
                        activeResume.templateId === tpl.id
                          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-slate-900">{tpl.name}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {tpl.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">{tpl.desc}</p>
                      </div>

                      <button
                        onClick={() => {
                          handleUpdateResume({ ...activeResume, templateId: tpl.id as TemplateId }, true, `Applied ${tpl.name} Template`);
                          addToast({
                            type: 'success',
                            title: 'Template Applied',
                            message: `Switched to ${tpl.name}.`,
                          });
                          navigateTo('builder');
                        }}
                        className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          activeResume.templateId === tpl.id
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {activeResume.templateId === tpl.id ? 'Current Active' : 'Use Template'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === 'settings' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">User Profile & Account</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Manage your personal details, AI model preferences, and active subscription.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={user?.name || ''}
                        onChange={e => {
                          const updated = { ...user, name: e.target.value };
                          setUser(updated);
                          StorageService.saveUserProfile(updated);
                        }}
                        className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        onChange={e => {
                          const updated = { ...user, email: e.target.value };
                          setUser(updated);
                          StorageService.saveUserProfile(updated);
                        }}
                        className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Target Job Title</label>
                      <input
                        type="text"
                        value={user?.targetRole || ''}
                        onChange={e => {
                          const updated = { ...user, targetRole: e.target.value };
                          setUser(updated);
                          StorageService.saveUserProfile(updated);
                        }}
                        className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Career Level</label>
                      <select
                        value={user?.careerLevel || 'Mid Level'}
                        onChange={e => {
                          const updated = { ...user, careerLevel: e.target.value as any };
                          setUser(updated);
                          StorageService.saveUserProfile(updated);
                        }}
                        className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none bg-white"
                      >
                        <option value="Entry Level">Entry Level</option>
                        <option value="Mid Level">Mid Level</option>
                        <option value="Senior Level">Senior Level</option>
                        <option value="Lead / Manager">Lead / Manager</option>
                        <option value="Executive / VP">Executive / VP</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => navigateTo('onboarding')}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1.5"
                    >
                      <span>Rerun Personalization Wizard &rarr;</span>
                    </button>
                    <button
                      onClick={() => {
                        StorageService.saveUserProfile(user);
                        addToast({
                          type: 'success',
                          title: 'Profile Updated',
                          message: 'Your personal settings have been saved.',
                        });
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'pricing' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center space-y-2 mb-8">
                  <h1 className="text-2xl font-bold text-slate-900">Subscription Plans</h1>
                  <p className="text-xs text-slate-500">Upgrade for unlimited AI resume enhancements, ATS scans, and premium styling.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <div className="text-sm font-bold text-slate-900">Free Starter</div>
                    <div className="text-2xl font-bold text-slate-900">$0<span className="text-xs font-normal text-slate-500"> / month</span></div>
                    <ul className="text-xs text-slate-600 space-y-2">
                      <li>• 1 Active Resume</li>
                      <li>• 5 AI Optimization credits</li>
                      <li>• Standard ATS Scoring</li>
                      <li>• Basic PDF Export</li>
                    </ul>
                    <button
                      disabled
                      className="w-full py-2 bg-slate-100 text-slate-400 font-semibold text-xs rounded-lg"
                    >
                      Current Plan
                    </button>
                  </div>
                  <div className="bg-white rounded-xl border-2 border-blue-600 p-6 space-y-4 shadow-sm relative">
                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      RECOMMENDED
                    </div>
                    <div className="text-sm font-bold text-slate-900">ResumeForge Pro</div>
                    <div className="text-2xl font-bold text-slate-900">$19<span className="text-xs font-normal text-slate-500"> / month</span></div>
                    <ul className="text-xs text-slate-600 space-y-2">
                      <li>• Unlimited Resumes</li>
                      <li>• 100 AI Optimization credits/mo</li>
                      <li>• Deep ATS Diagnostic Engine</li>
                      <li>• Real-time Job Match Analyzer</li>
                      <li>• Cover Letter Generator</li>
                      <li>• 4 Professional Archetype Templates</li>
                    </ul>
                    <button
                      onClick={() => {
                        const updated = { ...user, plan: 'pro' as const, aiCreditsRemaining: 150 };
                        setUser(updated);
                        StorageService.saveUserProfile(updated);
                        addToast({
                          type: 'success',
                          title: 'Upgraded to ResumeForge Pro!',
                          message: 'All premium features and 150 AI credits unlocked.',
                        });
                      }}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              </div>
            )}

            {(currentView === 'career-tools' || currentView === 'admin') && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <h2 className="text-base font-bold text-slate-900">Career Diagnostics & ATS Engine Status</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="text-[11px] font-bold text-slate-400 uppercase">Engine Status</div>
                      <div className="text-sm font-bold text-green-600 mt-1">Operational</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="text-[11px] font-bold text-slate-400 uppercase">AI Provider</div>
                      <div className="text-sm font-bold text-slate-900 mt-1">Google Gemini API</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="text-[11px] font-bold text-slate-400 uppercase">Active Resumes</div>
                      <div className="text-sm font-bold text-slate-900 mt-1">{resumes.length} In Storage</div>
                    </div>
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={() => navigateTo('dashboard')}
                      className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={() => navigateTo('builder')}
                      className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Open Resume Builder
                    </button>
                  </div>
                </div>
              </div>
            )}
            {![
              'dashboard',
              'ai-generator',
              'generator',
              'ai-resume-generator',
              'my-resumes',
              'resumes',
              'builder',
              'analyzer',
              'ats-analyzer',
              'optimizer',
              'job-matcher',
              'matcher',
              'cover-letter',
              'coverletter',
              'templates',
              'settings',
              'pricing',
              'career-tools',
              'admin',
            ].includes(currentView) && (
              <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Page Not Found</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  The section or view you requested does not exist or has moved. Return to the dashboard to continue editing your resumes.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigateTo('dashboard')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-5 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Modals & Dialogs */}
        <ResumeImporterModal
          isOpen={isImporterOpen}
          onClose={() => setIsImporterOpen(false)}
          onImportComplete={handleImportResume}
        />

        {printResumeTarget && (
          <PrintPreviewModal
            isOpen={!!printResumeTarget}
            onClose={() => setPrintResumeTarget(null)}
            resume={printResumeTarget}
          />
        )}

        {/* Global Toast Container */}
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast toast={toast} onClose={removeToast} />
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}

export default App;
