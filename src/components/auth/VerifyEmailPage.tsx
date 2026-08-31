import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthVisualSide } from './AuthVisualSide';

interface VerifyEmailPageProps {
  onNavigate: (view: string) => void;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ onNavigate }) => {
  const { pendingVerificationEmail, resendVerificationEmail, verifyEmailManually, user } = useAuth();
  const [targetEmail, setTargetEmail] = useState(pendingVerificationEmail || user?.email || 'your.email@example.com');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setResendSuccess(false);

    try {
      await resendVerificationEmail(targetEmail);
      setResendSuccess(true);
      setResendCooldown(60);
    } catch (e) {
      console.error(e);
    } finally {
      setIsResending(false);
    }
  };

  const handleInstantVerification = async () => {
    setIsVerifying(true);
    try {
      await verifyEmailManually(targetEmail);
      onNavigate('onboarding');
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Left Column */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-12 max-w-xl mx-auto w-full">
        {/* Brand Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">ResumeForge</span>
              <span className="text-blue-600 font-bold ml-1 text-xs uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100">AI</span>
            </div>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-5 shadow-xs">
            <Mail className="w-7 h-7" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Check your email
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            We've sent a verification link to your email address. Verify your email to continue.
          </p>
        </div>

        {/* Email Box */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recipient Email</span>
            <span className="text-xs font-bold text-slate-900 font-mono bg-slate-100 px-2.5 py-1 rounded-lg">
              {targetEmail}
            </span>
          </div>

          {resendSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>A fresh verification link was dispatched to your inbox!</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {/* Instant Verify for frictionless flow */}
          <button
            type="button"
            onClick={handleInstantVerification}
            disabled={isVerifying}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
          >
            {isVerifying ? (
              <span>Verifying token...</span>
            ) : (
              <>
                <span>I've Verified My Email / Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Resend Button */}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl border border-slate-300 transition-colors disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
            <span>
              {resendCooldown > 0 ? `Resend email in ${resendCooldown}s` : 'Resend verification email'}
            </span>
          </button>

          {/* Secondary Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="text-slate-600 hover:text-slate-950 font-medium"
            >
              Change email
            </button>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-blue-600 hover:underline font-bold inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Product Showcase */}
      <AuthVisualSide quote="Verify your credentials to activate cloud synchronization and AI ATS scoring." />
    </div>
  );
};
