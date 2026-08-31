import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  Layers,
  BarChart3,
  Search,
  Briefcase,
  Mail,
  Sliders,
  Crown,
  Menu,
  X,
  User,
  LogOut,
  ShieldCheck,
  Compass,
  Settings,
  ChevronDown,
  Wand2,
} from 'lucide-react';
import { UserProfile, ResumeData } from '../../types/resume';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user?: UserProfile;
  activeResume?: ResumeData;
  onOpenAuth?: () => void;
  onOpenPricing?: () => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user: propUser,
  activeResume,
  onOpenAuth = () => {},
  onOpenPricing = () => {},
  isMobileMenuOpen = false,
  setIsMobileMenuOpen = (_open: boolean) => {},
}) => {
  const { user: authUser, isAuthenticated, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentUser = authUser || propUser;
  const isLanding = currentView === 'landing';
  const userName = currentUser?.name || 'Alexander Wright';
  const userEmail = currentUser?.email || 'user@example.com';
  const firstName = userName.split(' ')[0] || 'User';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    await signOut();
    onNavigate('login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: User greeting / context */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left cursor-pointer"
              title="Go to Homepage / Landing"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-slate-900 leading-tight">
                  {isAuthenticated ? (
                    <>
                      Welcome back, <span className="font-bold text-slate-900">{firstName}</span>
                    </>
                  ) : (
                    <span className="font-extrabold text-slate-900">ResumeForge AI</span>
                  )}
                </h1>
                <p className="text-[10px] text-slate-400 font-medium">Resume &amp; Career Studio</p>
              </div>
            </button>

            {/* Quick Resume context if available */}
            {activeResume && !isLanding && isAuthenticated && (
              <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-200 text-xs">
                <span className="text-slate-400">Active Resume:</span>
                <span className="font-semibold text-slate-700 max-w-[180px] truncate">{activeResume.title || 'Untitled Resume'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                  ATS: {activeResume.atsScore || 85}%
                </span>
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {isLanding ? (
              <>
                <button
                  onClick={() => onNavigate('landing')}
                  className="px-3 py-1.5 text-sm font-medium text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Overview
                </button>
                <button
                  onClick={() => onNavigate('ai-generator')}
                  className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Builder</span>
                </button>
                <button
                  onClick={() => onNavigate('templates')}
                  className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Templates
                </button>
                <button
                  onClick={() => onNavigate('analyzer')}
                  className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  ATS Scanner
                </button>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Pricing
                </button>
                {isAuthenticated && (
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="px-3.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors ml-2 border border-blue-200"
                  >
                    Open Dashboard &rarr;
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-slate-100 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => onNavigate('ai-generator')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    currentView === 'ai-generator'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50/50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Generator</span>
                </button>
                <button
                  onClick={() => onNavigate('my-resumes')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    currentView === 'my-resumes'
                      ? 'bg-slate-100 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Resumes
                </button>
                <button
                  onClick={() => onNavigate('builder')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    currentView === 'builder'
                      ? 'bg-slate-100 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Builder
                </button>
                <button
                  onClick={() => onNavigate('analyzer')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    currentView === 'analyzer'
                      ? 'bg-slate-100 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  ATS Analyzer
                </button>
                <button
                  onClick={() => onNavigate('optimizer')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    currentView === 'optimizer'
                      ? 'bg-slate-100 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  AI Optimizer
                </button>
              </>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => onNavigate('ai-generator')}
                  className="hidden sm:flex h-9 items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-3.5 text-xs sm:text-sm font-semibold text-white transition-colors shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Generator</span>
                </button>

                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-xl hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                  >
                    {currentUser?.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={userName}
                        className="w-7 h-7 rounded-lg object-cover border border-slate-300"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-semibold hidden sm:inline max-w-[120px] truncate">{firstName}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase border border-blue-200">
                            {currentUser?.plan || 'Pro'} Plan
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                            {currentUser?.careerLevel || 'Mid Level'}
                          </span>
                        </div>
                      </div>

                      <div className="py-1 text-xs text-slate-700">
                        <button
                          type="button"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onNavigate('landing');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5"
                        >
                          <Compass className="w-4 h-4 text-blue-500" />
                          <span>Product Landing Page</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onNavigate('dashboard');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5"
                        >
                          <BarChart3 className="w-4 h-4 text-slate-400" />
                          <span>Dashboard</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onNavigate('onboarding');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5"
                        >
                          <Wand2 className="w-4 h-4 text-slate-400" />
                          <span>Personalization Wizard</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onNavigate('pricing');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5"
                        >
                          <Crown className="w-4 h-4 text-amber-500" />
                          <span>Subscription &amp; Plans</span>
                        </button>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full px-4 py-2 text-left hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-2.5"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('signup')}
                  className="text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

