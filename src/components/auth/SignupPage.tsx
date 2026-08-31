import React, { useState, useMemo } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { evaluatePasswordStrength } from '../../utils/passwordStrength';
import { AuthVisualSide } from './AuthVisualSide';

interface SignupPageProps {
  onNavigate: (view: string) => void;
  onSuccess?: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate, onSuccess }) => {
  const { signUp, signInWithGoogle, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Evaluate password strength
  const passwordStrength = useMemo(() => {
    return evaluatePasswordStrength(password);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validations
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!passwordStrength.isValid) {
      setErrorMessage('Password must contain at least 8 characters with uppercase, lowercase, and a number.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password confirmation.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signUp(fullName, email, password);
      if (result.success) {
        if (onSuccess) onSuccess();
        if (result.requiresVerification) {
          onNavigate('verify-email');
        } else {
          onNavigate('onboarding');
        }
      } else {
        setErrorMessage(result.error || 'Failed to create your account. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('An unexpected error occurred during signup.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        if (onSuccess) onSuccess();
        onNavigate('onboarding');
      } else {
        setErrorMessage(result.error || 'Google authentication was not completed.');
      }
    } catch (err: any) {
      setErrorMessage('Google authentication could not be initialized.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Left Column: Registration Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-10 max-w-xl mx-auto w-full">
        {/* Brand Header */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-2 mb-4 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">ResumeForge</span>
              <span className="text-blue-600 font-bold ml-1 text-xs uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100">AI</span>
            </div>
          </button>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Create your free account
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            Build, optimize, and tailor your resume with AI.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isSubmitting || isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm py-2.5 px-4 rounded-xl border border-slate-300 shadow-xs hover:border-slate-400 transition-all disabled:opacity-60 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">or register with email</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                autoComplete="name"
                placeholder="e.g. Sarah Jenkins"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="sarah.jenkins@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1.5 bg-slate-100/70 p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">Password Strength:</span>
                  <span
                    className={`font-bold ${
                      passwordStrength.score >= 3
                        ? 'text-emerald-600'
                        : passwordStrength.score === 2
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 h-1.5">
                  {[1, 2, 3, 4].map(idx => (
                    <div
                      key={idx}
                      className={`h-full rounded-full transition-colors ${
                        idx <= passwordStrength.score ? passwordStrength.color : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Requirement Checkpoints */}
                <div className="grid grid-cols-2 gap-1 pt-1 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1">
                    {passwordStrength.hasMinLength ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-slate-400" />
                    )}
                    <span>8+ characters</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {passwordStrength.hasUppercase ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-slate-400" />
                    )}
                    <span>Uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {passwordStrength.hasLowercase ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-slate-400" />
                    )}
                    <span>Lowercase letter</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {passwordStrength.hasNumber ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-slate-400" />
                    )}
                    <span>One number</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="Re-type your password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-[11px] font-medium text-rose-600 mt-1">Passwords do not match.</p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-600">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 shrink-0"
              />
              <span className="leading-snug">
                I agree to the{' '}
                <a href="#terms" className="text-blue-600 hover:underline font-semibold" onClick={e => e.preventDefault()}>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="text-blue-600 hover:underline font-semibold" onClick={e => e.preventDefault()}>
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Creating your account...</span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Login Link */}
        <div className="mt-6 pt-5 border-t border-slate-200 text-center text-xs text-slate-600">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </div>

      {/* Right Column: Visual Product Showcase */}
      <AuthVisualSide quote="Build, optimize, and tailor your resume with AI." />
    </div>
  );
};
