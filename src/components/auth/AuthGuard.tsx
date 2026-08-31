import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles } from 'lucide-react';

interface AuthGuardProps {
  currentView: string;
  onNavigate: (view: string) => void;
  children: React.ReactNode;
}

export const PROTECTED_ROUTES = [
  'dashboard',
  'my-resumes',
  'resumes',
  'resume-builder',
  'builder',
  'ai-resume-generator',
  'ai-generator',
  'resume-analyzer',
  'analyzer',
  'ai-optimizer',
  'job-matcher',
  'cover-letter',
];

export const AUTH_ROUTES = [
  'login',
  'signup',
  'forgot-password',
  'reset-password',
  'verify-email',
];

export const AuthGuard: React.FC<AuthGuardProps> = ({ currentView, onNavigate, children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // If loading session state, show modern loader without flashing protected content
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 animate-pulse mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-100 tracking-tight">Authenticating Session...</h2>
        <p className="text-xs text-slate-400 mt-1">Connecting to ResumeForge AI Security &amp; Cloud Sync</p>
      </div>
    );
  }

  // If route is protected and user is not authenticated -> redirect to login
  if (PROTECTED_ROUTES.includes(currentView) && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Sign in required</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Please sign in to access your resumes, ATS scoring history, and AI tools.
          </p>
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => onNavigate('login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              Sign In to ResumeForge AI
            </button>
            <button
              onClick={() => onNavigate('signup')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
